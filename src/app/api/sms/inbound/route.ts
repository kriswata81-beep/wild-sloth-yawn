// POST /api/sms/inbound — Twilio webhook for incoming SMS.
// Twilio POSTs form-urlencoded data. We respond with TwiML XML to send the
// auto-reply in-band. Crisis detection runs fast-path; everything else uses
// Anthropic LLM for intent classification.
//
// Configure in Twilio console: Phone Numbers → your number → Messaging →
// "A MESSAGE COMES IN" webhook → POST https://www.makoa.live/api/sms/inbound

import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { quickCrisisCheck } from "@/lib/twilio";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const TELEGRAM_FN = `${SUPABASE_URL}/functions/v1/telegram-send`;

// Auto-reply templates per intent
const REPLIES: Record<string, string> = {
  gate_inquiry:
    "Welcome to Mākoa Brotherhood. The gate is at makoa.live/gate — 12 questions, 3 minutes, $9.99. XI will respond within moments. — XI",
  sponsor_inquiry:
    "To sponsor a brother into Mākoa: makoa.live/sponsor. Three tiers, anonymous by default. He'll receive 'Someone believes in you.' — XI",
  crisis:
    "We see you. You are not alone.\n\nUS Crisis Lifeline: 988 (call or text)\nCrisis Text Line: text HOME to 741741\nHawaiʻi CARES: 832-3100 (Oʻahu) / 1-800-753-6879\n\nA brother is being notified now. — XI",
  needs_human: "Received. A brother will reach out within the day. — XI",
  spam: "", // no reply
  other: "Received. Mākoa Brotherhood — makoa.live. — XI",
  unscreened: "Received. — XI",
};

interface ClassifyResult {
  intent: keyof typeof REPLIES | "unscreened";
  severity: "normal" | "crisis";
  confidence: number;
  reason: string;
}

async function classifyWithAnthropic(body: string): Promise<ClassifyResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "placeholder") return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        system: `You are XI, gate-screener for Mākoa Brotherhood (Hawaiʻi men's order). Classify inbound SMS into ONE of these intents:
- gate_inquiry: asking about joining, the gate, applications, MAYDAY event
- sponsor_inquiry: asking about sponsoring a man, sending someone in, gifts
- crisis: ANY mention of suicide, self-harm, abuse, addiction, homelessness, domestic violence, despair
- needs_human: serious question that requires Steward's personal attention (legal, money, leadership)
- spam: marketing, scams, wrong-number autoreplies
- other: greetings, vague questions, anything ambiguous

Respond ONLY in this exact JSON format:
{"intent":"gate_inquiry","severity":"normal","confidence":0.85,"reason":"asks about joining"}

severity is "crisis" ONLY for the crisis intent. confidence 0..1.`,
        messages: [{ role: "user", content: `Classify this SMS:\n\n"${body.slice(0, 800)}"` }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.content?.[0]?.text?.trim();
    if (!text) return null;
    // Extract JSON from possible markdown
    const jsonMatch = text.match(/\{[^}]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]) as ClassifyResult;
    return parsed;
  } catch {
    return null;
  }
}

function twiml(reply: string): Response {
  const xml = reply
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${reply
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</Message></Response>`
    : `<?xml version="1.0" encoding="UTF-8"?><Response/>`;
  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

async function pageTelegram(text: string): Promise<void> {
  try {
    await fetch(TELEGRAM_FN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch {
    // Best-effort; don't block the SMS response
  }
}

export async function POST(req: NextRequest) {
  // Twilio sends application/x-www-form-urlencoded
  const formData = await req.formData();
  const messageSid = formData.get("MessageSid")?.toString() || null;
  const from = formData.get("From")?.toString() || "";
  const to = formData.get("To")?.toString() || "";
  const body = formData.get("Body")?.toString() || "";
  const numMedia = parseInt(formData.get("NumMedia")?.toString() || "0", 10);

  const mediaUrls: string[] = [];
  for (let i = 0; i < numMedia; i++) {
    const url = formData.get(`MediaUrl${i}`)?.toString();
    if (url) mediaUrls.push(url);
  }

  if (!from || !body) {
    return twiml(""); // empty response, don't bounce
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // 1. Insert raw message immediately (don't lose data even if downstream fails)
  const { data: row } = await supabase
    .from("inbound_messages")
    .insert({
      twilio_message_sid: messageSid,
      from_number: from,
      to_number: to,
      body,
      num_media: numMedia,
      media_urls: mediaUrls,
      intent: "unscreened",
      severity: "normal",
    })
    .select()
    .single();

  // 2. Fast-path crisis check
  if (quickCrisisCheck(body)) {
    const reply = REPLIES.crisis;
    if (row) {
      await supabase
        .from("inbound_messages")
        .update({
          intent: "crisis",
          severity: "crisis",
          classification_reason: "Quick keyword match (pre-LLM)",
          auto_replied: true,
          auto_reply_body: reply,
          auto_reply_sent_at: new Date().toISOString(),
          handled_by: "xi_auto",
          handled_at: new Date().toISOString(),
          telegram_paged: true,
          telegram_paged_at: new Date().toISOString(),
        })
        .eq("id", row.id);
    }
    // Async page Telegram (don't block reply)
    pageTelegram(`🚨 CRISIS SMS from ${from}\n\n"${body.slice(0, 400)}"\n\nAuto-resources sent. Steward — call within the hour.`);
    return twiml(reply);
  }

  // 3. LLM classify (synchronous; Twilio gives us 15s)
  const classified = await classifyWithAnthropic(body);

  let intent: string = "other";
  let severity: "normal" | "crisis" = "normal";
  let confidence = 0;
  let reason = "default fallback";

  if (classified) {
    intent = classified.intent;
    severity = classified.severity;
    confidence = classified.confidence;
    reason = classified.reason;
  }

  // 4. Crisis from LLM (in case keyword check missed)
  if (severity === "crisis") {
    pageTelegram(`🚨 CRISIS SMS (LLM-flagged) from ${from}\n\n"${body.slice(0, 400)}"\n\nAuto-resources sent. Steward — call within the hour.`);
  }
  // 5. needs_human → also page Telegram (no auto-action beyond ack)
  else if (intent === "needs_human") {
    pageTelegram(`📩 SMS needs human · from ${from}\n\n"${body.slice(0, 400)}"\n\nReply via /steward Messages tab.`);
  }

  const reply = REPLIES[intent] ?? REPLIES.other;
  const handled = reply ? "xi_auto" : "unhandled";

  if (row) {
    await supabase
      .from("inbound_messages")
      .update({
        intent,
        severity,
        classification_confidence: confidence,
        classification_reason: reason,
        auto_replied: Boolean(reply),
        auto_reply_body: reply || null,
        auto_reply_sent_at: reply ? new Date().toISOString() : null,
        handled_by: handled,
        handled_at: reply ? new Date().toISOString() : null,
        telegram_paged: severity === "crisis" || intent === "needs_human",
        telegram_paged_at:
          severity === "crisis" || intent === "needs_human"
            ? new Date().toISOString()
            : null,
      })
      .eq("id", row.id);
  }

  return twiml(reply);
}

// GET — health/status check (used by /steward Messages tab)
export async function GET() {
  const cfg = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER;
  const llm = process.env.ANTHROPIC_API_KEY;
  return Response.json({
    twilio: cfg ? "ACTIVE" : "AWAITING_TWILIO_CREDS",
    classifier: llm ? "ACTIVE" : "AWAITING_ANTHROPIC_API_KEY",
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || null,
    webhookUrl: "https://www.makoa.live/api/sms/inbound",
  });
}
