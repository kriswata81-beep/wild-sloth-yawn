// GET /api/cron/echo-draft — ECHO agent (daily 6:30am HST = 16:30 UTC)
// Drafts tomorrow's social content using Claude, saves to social_posts as status='draft',
// then pings Steward 0001 on Telegram with a one-tap approve link.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = "7954185672"; // Steward 0001

const PLATFORM_ROTATION = [
  { platform: "instagram", label: "IG" },
  { platform: "twitter", label: "Twitter" },
  { platform: "facebook", label: "FB" },
];

// 7G Net content themes — rotate daily
const CONTENT_THEMES = [
  "Brotherhood & belonging: a brother helping another brother secure work through the route",
  "The 80/10/10 split: money staying in the zip code, funding the community",
  "West Oahu founding story: why this started in 96792 and what it means",
  "The Trade Route: how Nā Koa brothers find consistent income through the order",
  "The 7G Net vision: 7 zip codes, 7 clusters, one network that feeds its own",
  "War Room culture: what happens when brothers sit down together weekly",
  "Steward life: what it means to hold ground for your zip code",
  "Join or be left behind: the window is closing on founding membership",
];

async function sendTelegram(msg: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "HTML" }),
  }).catch(() => {});
}

export async function GET(req: NextRequest) {
  // Auth — Vercel cron sends `Authorization: Bearer ${CRON_SECRET}`
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Pick today's theme based on day-of-year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const theme = CONTENT_THEMES[dayOfYear % CONTENT_THEMES.length];

  // Pick 2 platforms for today (rotate)
  const platformsToday = PLATFORM_ROTATION.slice(dayOfYear % PLATFORM_ROTATION.length)
    .concat(PLATFORM_ROTATION)
    .slice(0, 2);

  // Pull last 7 days of fired posts to avoid repetition
  const { data: recentPosts } = await sb
    .from("social_posts")
    .select("text, platform")
    .in("status", ["fired", "scheduled"])
    .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString())
    .limit(20);

  const recentSummary = recentPosts?.slice(0, 5).map(p => `[${p.platform}] ${p.text.slice(0, 80)}`).join("\n") || "none";

  const drafts: { platform: string; text: string; id: string }[] = [];

  for (const { platform } of platformsToday) {
    try {
      const isTwitter = platform === "twitter";
      const isInstagram = platform === "instagram";

      const charLimit = isTwitter ? 220 : 400;
      const hashtagNote = isInstagram
        ? "End with 3-5 relevant hashtags (max 5 total). No links."
        : isTwitter
        ? "No hashtags. Keep it punchy. No links."
        : "1-2 hashtags max. Focus on story.";

      const prompt = `You are ECHO, the content agent for Mākoa Order — a brotherhood network in West Oahu, Hawaii.

TODAY'S THEME: ${theme}

RECENT POSTS (do not repeat these ideas):
${recentSummary}

Write a single social post for ${platform.toUpperCase()}.
- Max ${charLimit} characters
- Voice: direct, brotherhood-coded, no corporate speak, Hawaiian perspective
- Tone: proud, earned, gritty, real — not hype
- ${hashtagNote}
- Output ONLY the post text. No preamble, no quotes, no label.`;

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
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const aiJson = await aiRes.json();
      const text: string = aiJson.content?.[0]?.text?.trim() || "";

      if (!text) continue;

      // Schedule for 8am HST next day = 18:00 UTC next day
      const tomorrow = new Date();
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(18, 0, 0, 0);

      const { data: inserted } = await sb
        .from("social_posts")
        .insert({
          platform,
          text,
          media_urls: [],
          platform_specific: {},
          status: "draft",
          scheduled_for: tomorrow.toISOString(),
          created_by: "echo_agent",
          fired_by: null,
        })
        .select("id")
        .single();

      if (inserted?.id) {
        drafts.push({ platform, text, id: inserted.id });
      }
    } catch (err) {
      console.error(`[ECHO] Error drafting ${platform}:`, err);
    }
  }

  if (drafts.length === 0) {
    return NextResponse.json({ ok: true, drafts: 0, message: "No drafts created" });
  }

  // Telegram ping with draft previews
  const draftLines = drafts.map((d, i) =>
    `<b>${i + 1}. ${d.platform.toUpperCase()}</b>\n${d.text.slice(0, 120)}${d.text.length > 120 ? "..." : ""}`
  ).join("\n\n");

  const telegramMsg = `📝 <b>ECHO · Daily Drafts Ready</b>

Theme: ${theme.slice(0, 60)}...

${draftLines}

<a href="https://makoa.live/steward">→ Review &amp; Approve in Command Center</a>

${drafts.length} draft${drafts.length > 1 ? "s" : ""} saved. Approve to schedule for 8am HST tomorrow.`;

  await sendTelegram(telegramMsg);

  return NextResponse.json({
    ok: true,
    drafts: drafts.length,
    theme,
    platforms: drafts.map(d => d.platform),
  });
}
