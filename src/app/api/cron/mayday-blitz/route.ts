// GET /api/cron/mayday-blitz — MAYDAY 30-day content blitz
// Runs daily at 14:00 UTC (4:00am HST). Generates 40 posts via Claude Haiku,
// schedules them directly to Blotato (native scheduledTime — no second cron needed).
// Target: men who lead groups worldwide. Universal tone. No geography lock.
// Auth: Bearer ${CRON_SECRET}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { blotatoPost } from "@/lib/blotato";
import type { SocialPlatform } from "@/lib/constants";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = "7954185672";

// Campaign: Apr 18 → May 31 2026 (44 days max)
const CAMPAIGN_START = new Date("2026-04-18T00:00:00Z");
const CAMPAIGN_END   = new Date("2026-05-31T23:59:59Z");

// Platform distribution — 40 posts/day
// TikTok excluded (text-only posts unsupported — add when video pipeline is live)
const DIST: { platform: SocialPlatform; count: number }[] = [
  { platform: "twitter",   count: 22 },
  { platform: "instagram", count: 12 },
  { platform: "facebook",  count: 6  },
];

interface GeneratedPost {
  platform: string;
  text: string;
}

async function sendTelegram(msg: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "HTML" }),
  }).catch(() => {});
}

// ── Content generation ────────────────────────────────────────────────────────
// One Claude Haiku batch call → 40 posts as JSON array.
async function generatePosts(key: string, dayNum: number): Promise<GeneratedPost[]> {
  const prompt = `You are ECHO — content intelligence for Mākoa Brotherhood Order.
Today is Day ${dayNum} of the MAYDAY campaign.

AUDIENCE: Men who lead groups. Coaches, pastors, team captains, business owners, veterans, mentors, fathers, community organizers. Men who carry others. Men who haven't been carried in years. They feel it. They just haven't named it.

THE EVENT: MAYDAY MONTH 2026 — The Summit of Founders.
West Oʻahu. Mākoa House. May 1 – June 1, 2026.
Apply: makoa.live

STRUCTURE — 4 WEEKENDS, 2 FULL MOONS:
• Weekend 1 (May 1–4) — FLOWER MOON — First Founders Round. Original Mākoa 48. Founding fire. First Aliʻi equity seats locked. Gate closes April 25.
• Weekend 2 (May 8–11) — BUILD PHASE — Trade network activation. Mākoa House charters. Hands-on construction + B2B deal making.
• Weekend 3 (May 15–18) — LEADERSHIP PHASE — Warchest Mastermind + Aliʻi Room. Leaders map land/air/sea trade routes. Charter their own local node.
• Weekend 4 (May 29–Jun 1) — BLUE MOON FINALE — Last Founders Round. Last equity seats. Founding rates close forever. Final fire.

TRAVELING WAR PARTY PACKS (each week):
Full 5-Day: Tue night → Mon morning | 4-Day Elite: Wed → Mon | 3-Day Builder: Thu → Mon | Day Pass: 12 hours.
Daily: 4am ice bath + movement. 9am–2pm War Rooms + Mastermind. Evenings: brotherhood circles + trade deals. Vans provided for land/air/sea route scouting.

FOUNDING RATES (close after May — never again):
• Nā Koa Day Pass: $97
• Mana Mastermind: $197
• War Room / 48h: $397
• Aliʻi Co-Founder + 1% equity + Hale Stone buy-in path: $4,997 (handful left. ever.)

LEADER MULTIPLIER: Know a man who leads men? Bring your team. Fill a War Party Pack. Charter your own Mākoa House node. Men who bring other men become founders of their own cluster.

FINALE ANGLE: Weekend 4 = closing sale of the founding era. After May — gate price rises, equity closes forever. Be in the room when the final fire burns.

VOICE: Direct. Real. Masculine. No hype. No corporate speak. No emojis. Speak to the man reading alone at 11pm, not the crowd.

Generate exactly 40 posts. Return ONLY a valid JSON array. No explanation. No markdown code fences. Just the array starting with [ and ending with ].

POST BREAKDOWN (must match exactly):
- 22 posts → platform "twitter": max 220 chars, no hashtags, one sharp idea per post — provocation, hard truth, countdown, or question. Hit like a fist.
- 12 posts → platform "instagram": 150-220 chars, hook first line (stops the scroll), end with 3-5 hashtags ONLY from: #brotherhood #leadership #makoa #warroom #mayday #menscommunity #accountability #buildersnottalkers. No links.
- 6 posts → platform "facebook": 80-120 words, story or question driven, community tone, one paragraph, real and warm.

CONTENT PILLARS — cycle through all 15, never repeat same pillar twice on same platform same day:
1. SIGNAL: most men who lead feel alone at the top — and they never say it
2. BURDEN: you carry your team, your family, your crew. Who carries you?
3. FLOWER MOON: Weekend 1 urgency — May 1–4, first fire, first founding round, gate closes April 25
4. WAR ROOM: what actually happens inside — real stakes, no performance, vans + ice baths + trade deals
5. TRUTH: the difference between real brotherhood and brotherhood cosplay
6. CHALLENGE: direct provocation — "if you lead a group and you're reading this..."
7. LEADER MULTIPLIER: bring your team — fill a War Party Pack — charter your own node
8. INVITATION: specific CTA with dates, pack options, pricing, makoa.live
9. QUESTION: pull content that drives comments — "which of these hits hardest: A, B, C, or D?"
10. BLUE MOON FINALE: Weekend 4 closing-sale urgency — last equity seats, founding rates close forever May 29–Jun 1
11. EQUITY ANGLE: $4,997 Aliʻi Co-Founder seat — 1% equity + Hale Stone buy-in — handful left, ever
12. SCARCITY AD: "WE'RE CLOSING [X]. Tonight is the final [Y]." — countdown copy, deadline, one CTA. Short. Every word creates pressure.
13. ENGAGEMENT BAIT: A/B/C/D question format — "In your experience which builds a man more:" — drives replies not just likes
14. QUOTE DROP: single statement 8-12 words max, stands alone, men screenshot and forward it
15. LEGACY: build something worth passing down — full month = legend tier — living foundation of the order

RULES:
- Day ${dayNum} content should feel FRESH — not like Day 1 boilerplate
- No two posts share the same opening line or core idea
- Vary sentence rhythm — some posts are 2 sentences, some are 8 words, some are a list
- Never mention AI, automation, algorithms, or technology
- Never use the word "journey", "space", "authentic", "curated", "passionate"
- Every post must make a man feel seen OR called out. One or the other.

Return: [{"platform":"twitter","text":"..."},{"platform":"instagram","text":"..."},...]`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const json = await res.json();
  const raw: string = json.content?.[0]?.text?.trim() || "";
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`No JSON array found. Raw: ${raw.slice(0, 300)}`);
  const parsed = JSON.parse(match[0]) as GeneratedPost[];
  return parsed.filter(p => p.platform && typeof p.text === "string" && p.text.length > 10);
}

// ── Time slots ────────────────────────────────────────────────────────────────
// Spread posts from 6am–11pm HST = 16:00–09:00 UTC (next day).
// 40 posts → 1 every ~25 min.
function buildSlots(count: number): Date[] {
  const now = new Date();
  // Start = 16:00 UTC today; if already past 15:50, push to tomorrow
  const start = new Date(now);
  start.setUTCHours(16, 0, 0, 0);
  if (now >= start) start.setUTCDate(start.getUTCDate() + 1);

  const totalMs = 17 * 60 * 60 * 1000; // 17 hours
  const gapMs   = Math.floor(totalMs / Math.max(count, 1));

  return Array.from({ length: count }, (_, i) => new Date(start.getTime() + i * gapMs));
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Auth
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    if (req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });

  // Campaign window check
  const now = new Date();
  if (now < CAMPAIGN_START || now > CAMPAIGN_END) {
    return NextResponse.json({ ok: true, message: "Outside campaign window — no posts generated" });
  }

  const dayNum = Math.floor((now.getTime() - CAMPAIGN_START.getTime()) / 86400000) + 1;
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

  // ── Generate ─────────────────────────────────────────────────────────────
  let posts: GeneratedPost[] = [];
  try {
    posts = await generatePosts(anthropicKey, dayNum);
  } catch (err) {
    const msg = `⚠️ <b>MAYDAY BLITZ · Day ${dayNum} — GENERATION FAILED</b>\n\n${String(err).slice(0, 400)}`;
    await sendTelegram(msg);
    return NextResponse.json({ error: "Generation failed", detail: String(err) }, { status: 500 });
  }

  if (posts.length < 15) {
    const msg = `⚠️ <b>MAYDAY BLITZ · Day ${dayNum}</b>\nOnly ${posts.length} posts generated (expected 40). Check ANTHROPIC_API_KEY + model response.`;
    await sendTelegram(msg);
    return NextResponse.json({ error: "Too few posts", count: posts.length }, { status: 500 });
  }

  // ── Enforce platform limits (IG shadowban guard: max 12/day) ────────────
  const maxPerPlatform: Record<string, number> = { twitter: 22, instagram: 12, facebook: 6 };
  const counts: Record<string, number> = {};
  const filtered: GeneratedPost[] = [];
  for (const p of posts) {
    const max = maxPerPlatform[p.platform] ?? 99;
    counts[p.platform] = (counts[p.platform] || 0);
    if (counts[p.platform] < max) {
      filtered.push(p);
      counts[p.platform]++;
    }
  }

  const timeSlots = buildSlots(filtered.length);

  // ── Schedule to Blotato + log to social_posts ────────────────────────────
  const results = { ok: 0, failed: 0, errors: [] as string[] };

  for (let i = 0; i < filtered.length; i++) {
    const post  = filtered[i];
    const slot  = timeSlots[i] ?? timeSlots[timeSlots.length - 1];
    const sched = slot.toISOString();

    const bl = await blotatoPost({
      platform:      post.platform as SocialPlatform,
      text:          post.text,
      scheduledTime: sched,
    });

    // Audit log — non-blocking
    sb.from("social_posts").insert({
      platform:              post.platform,
      text:                  post.text,
      media_urls:            [],
      platform_specific:     {},
      status:                bl.ok ? "mayday_queued" : "failed",
      scheduled_for:         sched,
      created_by:            "mayday_blitz",
      blotato_submission_id: bl.ok ? bl.postSubmissionId : null,
      error_message:         bl.ok ? null : bl.error?.slice(0, 300),
    }).then(() => {}, () => {});

    if (bl.ok) {
      results.ok++;
    } else {
      results.failed++;
      results.errors.push(`[${post.platform}] ${bl.error.slice(0, 100)}`);
    }
  }

  // ── Telegram summary ──────────────────────────────────────────────────────
  const samples = filtered
    .filter(p => p.platform === "twitter")
    .slice(0, 3)
    .map((p, i) => `${i + 1}. ${p.text.slice(0, 130)}${p.text.length > 130 ? "..." : ""}`)
    .join("\n\n");

  const startTime = timeSlots[0];
  const endTime   = timeSlots[timeSlots.length - 1];
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-US", { timeZone: "Pacific/Honolulu", hour: "2-digit", minute: "2-digit", hour12: true });

  const breakdown = Object.entries(counts)
    .map(([p, c]) => `${p}: ${c}`)
    .join(" · ");

  await sendTelegram(
    `🔱 <b>MAYDAY BLITZ · Day ${dayNum}</b>\n\n` +
    `📊 Scheduled: <b>${results.ok}/${filtered.length}</b> · Failed: ${results.failed}\n` +
    `⏱ ${fmt(startTime)} → ${fmt(endTime)} HST\n` +
    `📡 ${breakdown}\n\n` +
    `<b>Sample drops:</b>\n\n${samples}\n\n` +
    `<a href="https://makoa.live/steward/campaign">→ Campaign Intel</a>`
  );

  return NextResponse.json({
    ok: true,
    day: dayNum,
    generated: posts.length,
    filtered: filtered.length,
    scheduled: results.ok,
    failed: results.failed,
    breakdown: counts,
    errors: results.errors.slice(0, 5),
    window: {
      start: startTime?.toISOString(),
      end:   endTime?.toISOString(),
    },
  });
}
