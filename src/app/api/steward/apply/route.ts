import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = "7954185672"; // Steward 0001

// ── XI Essay Scorer ─────────────────────────────────────────────────────────
// Scores 0-100. Leadership + trade + brotherhood language weighted.
function xiScoreEssay(essay: string, zip: string): {
  score: number; tier: string; signals: string[]; recommendation: string;
} {
  const lower = essay.toLowerCase();
  let score = 0;
  const signals: string[] = [];

  const categories = [
    {
      name: "leadership", weight: 8,
      words: ["lead", "build", "community", "territory", "serve", "responsible",
              "commit", "accountable", "vision", "steward", "hold", "protect"],
    },
    {
      name: "trade", weight: 6,
      words: ["route", "business", "service", "trade", "work", "job", "operator",
              "hustle", "earn", "revenue", "client", "customer", "market"],
    },
    {
      name: "brotherhood", weight: 10,
      words: ["ohana", "family", "men", "house", "order", "makoa", "mana",
              "nakoa", "alii", "brother", "brotherhood", "7g", "cluster"],
    },
    {
      name: "specificity", weight: 12,
      words: [zip, zip.toLowerCase(), "90 day", "90-day", "warchest", "war room",
              "war chest", "charter", "founding", "stone"],
    },
  ];

  categories.forEach(cat => {
    const matched = cat.words.filter(w => lower.includes(w));
    if (matched.length > 0) {
      const pts = Math.min(matched.length * cat.weight, 25);
      score += pts;
      signals.push(`${cat.name}: +${pts} (${matched.slice(0, 3).join(", ")})`);
    }
  });

  // Word count bonus (sweet spot: 95-110)
  const wc = essay.trim().split(/\s+/).filter(Boolean).length;
  if (wc >= 95 && wc <= 110) { score += 10; signals.push("word_count: +10 (optimal)"); }
  else if (wc >= 80 && wc <= 120) { score += 5; signals.push("word_count: +5"); }

  score = Math.min(score, 100);

  const tier = score >= 70 ? "alii" : score >= 40 ? "mana" : "nakoa";
  const recommendation =
    score >= 70 ? "RECOMMEND: Primary Steward seat" :
    score >= 55 ? "RECOMMEND: Co-Steward (strong)" :
    score >= 40 ? "RECOMMEND: Co-Steward (standard)" :
    "WAITLIST: Revisit if primary/co seats filled";

  return { score, tier, signals, recommendation };
}

async function sendTelegram(msg: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "HTML" }),
  }).catch(() => {});
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { zip, handle, essay, timestamp } = body;

    if (!zip || !handle || !essay) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const wc = essay.trim().split(/\s+/).filter(Boolean).length;
    if (wc < 80 || wc > 120) {
      return NextResponse.json({ error: "Essay must be 80-120 words" }, { status: 400 });
    }

    // XI scores the essay — keyword pass
    const keywordResult = xiScoreEssay(essay, zip);
    let { score, tier, signals, recommendation } = keywordResult;

    // XI scores the essay — Claude Haiku deep pass (if API key present)
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 256,
            messages: [{
              role: "user",
              content: `You are XI, the AI scorer for Mākoa Order steward applications. Score this essay on 4 dimensions (0-25 each). Return ONLY valid JSON, no explanation.

Essay: "${essay}"
ZIP: ${zip}

Return: {"authenticity": 0-25, "commitment": 0-25, "specificity": 0-25, "community_fit": 0-25, "note": "one sentence max"}

Scoring guide:
- authenticity: Does it sound like a real person with real stakes, not generic language?
- commitment: Does the applicant show they understand the long-term obligation?
- specificity: Do they name real places, real timelines, real actions (not vague)?
- community_fit: Do they demonstrate belonging to this specific territory and brotherhood?`,
            }],
          }),
        });
        const aiJson = await aiRes.json();
        const raw = aiJson.content?.[0]?.text?.trim() || "";
        // Extract JSON from response (may have markdown fences)
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const aiScore = Math.round(
            (Number(parsed.authenticity || 0) +
             Number(parsed.commitment || 0) +
             Number(parsed.specificity || 0) +
             Number(parsed.community_fit || 0)) * 0.4 // Claude pass = 40% of total (max 40 pts)
          );
          // Blend: keyword (60%) + Claude (40%), cap at 100
          score = Math.min(Math.round(score * 0.6 + aiScore), 100);
          tier = score >= 70 ? "alii" : score >= 40 ? "mana" : "nakoa";
          recommendation = score >= 70 ? "RECOMMEND: Primary Steward seat" :
            score >= 55 ? "RECOMMEND: Co-Steward (strong)" :
            score >= 40 ? "RECOMMEND: Co-Steward (standard)" :
            "WAITLIST: Revisit if primary/co seats filled";
          if (parsed.note) signals = [...signals, `xi_analysis: ${parsed.note}`];
        }
      } catch (err) {
        console.error("Claude scorer error (keyword score still saved):", err);
      }
    }

    // Save to Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data, error } = await supabase
      .from("steward_applications")
      .insert({
        zip_cluster: zip,
        handle,
        essay,
        word_count: wc,
        xi_score: score,
        xi_tier: tier,
        xi_signals: signals,
        xi_recommendation: recommendation,
        status: "pending",
        created_at: timestamp || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      // Still send Telegram even if DB fails
    }

    // Telegram alert to Steward 0001
    const emoji = score >= 70 ? "🔱" : score >= 40 ? "⚡" : "📋";
    await sendTelegram(
      `${emoji} <b>STEWARD APPLICATION — ZIP ${zip}</b>\n\n` +
      `Handle: <b>${handle}</b>\n` +
      `XI Score: <b>${score}/100</b> — ${tier.toUpperCase()}\n` +
      `Words: ${wc}\n\n` +
      `<b>Essay:</b>\n${essay.slice(0, 500)}${essay.length > 500 ? "..." : ""}\n\n` +
      `<b>XI Recommendation:</b> ${recommendation}\n` +
      `Signals: ${signals.slice(0, 4).join(" | ")}\n\n` +
      `Review all applications at makoa.live/steward`
    );

    return NextResponse.json({
      success: true,
      xi_score: score,
      xi_tier: tier,
      xi_recommendation: recommendation,
      id: data?.id,
    });

  } catch (err) {
    console.error("Steward apply error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET — list top applicants for a zip (admin use)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zip = searchParams.get("zip");
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const query = supabase
    .from("steward_applications")
    .select("*")
    .order("xi_score", { ascending: false })
    .limit(20);
  if (zip) query.eq("zip_cluster", zip);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ applications: data });
}
