// GET /api/cron/echo-draft — ECHO agent (daily 6:30am HST = 16:30 UTC)
// Drafts tomorrow's social content using Claude, saves to social_posts as status='draft',
// then pings Steward 0001 on Telegram with a one-tap approve link.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = "7954185672"; // Steward 0001

// Daily rotation: 3 text/image platforms + TikTok (image) every day
// YouTube gets a short video drop on Mondays only (video pipeline)
const PLATFORM_ROTATION = [
  { platform: "instagram", label: "IG",      scheduledHour: 18 }, // 8am HST
  { platform: "facebook",  label: "FB",      scheduledHour: 20 }, // 10am HST
  { platform: "twitter",   label: "Twitter", scheduledHour: 22 }, // 12pm HST
  { platform: "tiktok",    label: "TikTok",  scheduledHour: 2  }, // 4pm HST next day
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
  const isMonday = new Date().getUTCDay() === 1;

  // All 4 platforms every day — each gets its own staggered time slot
  const platformsToday = [...PLATFORM_ROTATION];

  // Mondays: add YouTube video drop at 6pm HST (4am UTC next day)
  if (isMonday) {
    platformsToday.push({ platform: "youtube", label: "YouTube", scheduledHour: 4 });
  }

  // Pull last 7 days of fired posts to avoid repetition
  const { data: recentPosts } = await sb
    .from("social_posts")
    .select("text, platform")
    .in("status", ["fired", "scheduled"])
    .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString())
    .limit(20);

  const recentSummary = recentPosts?.slice(0, 5).map(p => `[${p.platform}] ${p.text.slice(0, 80)}`).join("\n") || "none";

  const drafts: { platform: string; text: string; id: string; scheduledFor: string }[] = [];

  for (const { platform, scheduledHour } of platformsToday) {
    try {
      const isTwitter = platform === "twitter";
      const isInstagram = platform === "instagram";
      const isTikTok = platform === "tiktok";
      const isYouTube = platform === "youtube";

      const charLimit = isTwitter ? 220 : isTikTok ? 150 : isYouTube ? 300 : 400;
      const hashtagNote = isInstagram
        ? "End with 3-5 relevant hashtags (max 5 total). No links. End with: → link in bio → makoa.live"
        : isTwitter
        ? "No hashtags. Keep it punchy. End with: makoa.live"
        : isTikTok
        ? "Short, punchy hook. Max 3 hashtags. End with: makoa.live"
        : isYouTube
        ? "Write a video title + 2-sentence description. End with: makoa.live"
        : "1-2 hashtags max. End with: makoa.live";

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

      // Each platform fires at its own hour the NEXT day — staggered across the day
      const scheduled = new Date();
      scheduled.setUTCDate(scheduled.getUTCDate() + 1);
      scheduled.setUTCHours(scheduledHour, 0, 0, 0);

      // TikTok and Instagram get the crest image; YouTube gets video via blotato default resolver
      const mediaUrls = (isTikTok || isInstagram) ? ["https://makoa.live/makoa_crest.png"] : [];

      const { data: inserted, error: insertErr } = await sb
        .from("social_posts")
        .insert({
          platform,
          text,
          media_urls: mediaUrls,
          platform_specific: {},
          status: "draft",
          scheduled_for: scheduled.toISOString(),
          created_by: "echo_agent",
          fired_by: null,
        })
        .select("id")
        .single();

      if (insertErr) {
        console.error(`[ECHO] Insert failed for ${platform}:`, insertErr.message);
        await sendTelegram(`[ECHO] ERROR: insert failed for ${platform}: ${insertErr.message}`);
        continue;
      }

      if (inserted?.id) {
        drafts.push({ platform, text, id: inserted.id, scheduledFor: scheduled.toISOString() });
      }
    } catch (err) {
      console.error(`[ECHO] Error drafting ${platform}:`, err);
    }
  }

  if (drafts.length === 0) {
    await sendTelegram("[ECHO] WARNING: No drafts created today. Check ANTHROPIC_API_KEY and Supabase.");
    return NextResponse.json({ ok: true, drafts: 0, message: "No drafts created" });
  }

  // Telegram ping with draft previews + scheduled times
  const draftLines = drafts.map((d, i) => {
    const timeStr = new Date(d.scheduledFor).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Pacific/Honolulu", hour12: true });
    return `<b>${i + 1}. ${d.platform.toUpperCase()} @ ${timeStr} HST</b>\n${d.text.slice(0, 100)}${d.text.length > 100 ? "..." : ""}`;
  }).join("\n\n");

  const telegramMsg = `ECHO · Daily Drafts Ready\n\nTheme: ${theme.slice(0, 60)}...\n\n${draftLines}\n\n→ Review in Command Center: https://makoa.live/steward\n\n${drafts.length} draft${drafts.length > 1 ? "s" : ""} queued. Staggered throughout tomorrow.`;

  await sendTelegram(telegramMsg);

  return NextResponse.json({
    ok: true,
    drafts: drafts.length,
    theme,
    platforms: drafts.map(d => d.platform),
  });
}
