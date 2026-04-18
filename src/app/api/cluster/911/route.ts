import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = "7954185672"; // Steward 0001

const SEVERITY_EMOJI: Record<string, string> = {
  critical: "🚨",
  high: "⚠️",
  medium: "📍",
  low: "ℹ️",
};

const TYPE_LABEL: Record<string, string> = {
  medical: "MEDICAL",
  safety: "SAFETY",
  resource: "RESOURCE",
  mental_health: "MENTAL HEALTH",
  housing: "HOUSING",
};

async function sendTelegram(msg: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "HTML" }),
  }).catch(() => {});
}

// POST /api/cluster/911
// Submits an emergency alert. Notifies Steward 0001 via Telegram.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { zip, handle, emergency_type, message, severity } = body;

    if (!zip || !emergency_type || !message) {
      return NextResponse.json(
        { error: "zip, emergency_type, and message are required" },
        { status: 400 }
      );
    }

    const validTypes = ["medical", "safety", "resource", "mental_health", "housing"];
    const validSeverities = ["low", "medium", "high", "critical"];

    if (!validTypes.includes(emergency_type)) {
      return NextResponse.json({ error: "Invalid emergency_type" }, { status: 400 });
    }

    const cleanSeverity = validSeverities.includes(severity) ? severity : "medium";

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data, error } = await supabase
      .from("cluster_911")
      .insert({
        zip_cluster: zip,
        brother_handle: handle || "anonymous",
        emergency_type,
        message,
        severity: cleanSeverity,
        steward_notified: !!TELEGRAM_BOT_TOKEN,
      })
      .select("id")
      .single();

    if (error) {
      console.error("cluster_911 insert error:", error.message);
      // Still send Telegram even if DB fails
    }

    // Telegram alert — immediate
    const emoji = SEVERITY_EMOJI[cleanSeverity] || "📍";
    const typeLabel = TYPE_LABEL[emergency_type] || emergency_type.toUpperCase();

    await sendTelegram(
      `${emoji} <b>CLUSTER 911 — ZIP ${zip}</b>\n\n` +
      `Type: <b>${typeLabel}</b> | Severity: <b>${cleanSeverity.toUpperCase()}</b>\n` +
      `Brother: ${handle || "anonymous"}\n\n` +
      `<b>Message:</b>\n${message}\n\n` +
      `⚠️ <i>This is a brotherhood coordination alert — not a substitute for calling 911 in emergencies.</i>\n` +
      `ID: ${data?.id || "unknown"}`
    );

    return NextResponse.json({
      success: true,
      id: data?.id,
      steward_notified: !!TELEGRAM_BOT_TOKEN,
      message: "Steward has been notified. Help is on the way.",
    });

  } catch (err) {
    console.error("cluster 911 POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
