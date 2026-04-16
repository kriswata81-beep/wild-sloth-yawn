// GET /api/cron/post-scheduled — Vercel cron drains the social_posts queue.
// Picks up rows where status='scheduled' AND scheduled_for <= now, then fires each via Blotato.
// Auth: Bearer ${CRON_SECRET} (set in Vercel env, automatically included by Vercel cron).

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { blotatoPost } from "@/lib/blotato";
import type { SocialPlatform } from "@/lib/constants";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

// Cap per cron run so we never hammer Blotato (rate limit: 30 req/min).
const MAX_PER_RUN = 20;

interface QueuedPost {
  id: string;
  platform: SocialPlatform;
  text: string;
  media_urls: string[];
  platform_specific: Record<string, unknown>;
  scheduled_for: string;
}

export async function GET(req: NextRequest) {
  // Auth — Vercel cron sends `Authorization: Bearer ${CRON_SECRET}`.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const now = new Date().toISOString();

  // Pull due posts
  const { data: due, error: queryErr } = await supabase
    .from("social_posts")
    .select("id, platform, text, media_urls, platform_specific, scheduled_for")
    .eq("status", "scheduled")
    .lte("scheduled_for", now)
    .order("scheduled_for", { ascending: true })
    .limit(MAX_PER_RUN);

  if (queryErr) {
    console.error("[cron post-scheduled] Query error:", queryErr.message);
    return NextResponse.json({ error: queryErr.message }, { status: 500 });
  }

  if (!due || due.length === 0) {
    return NextResponse.json({ ok: true, fired: 0, message: "No due posts" });
  }

  const results: Array<{ id: string; platform: string; ok: boolean; detail: string }> = [];

  for (const row of due as QueuedPost[]) {
    // Mark as 'firing' so a concurrent cron run won't grab it again.
    const { error: lockErr } = await supabase
      .from("social_posts")
      .update({ status: "firing", fired_at: new Date().toISOString(), fired_by: "cron" })
      .eq("id", row.id)
      .eq("status", "scheduled"); // Only if still scheduled (race-condition guard)

    if (lockErr) {
      results.push({ id: row.id, platform: row.platform, ok: false, detail: `lock: ${lockErr.message}` });
      continue;
    }

    // Fire to Blotato
    const result = await blotatoPost({
      platform: row.platform,
      text: row.text,
      mediaUrls: row.media_urls || [],
      overrides: row.platform_specific || {},
    });

    if (result.ok) {
      await supabase
        .from("social_posts")
        .update({
          status: "fired",
          blotato_submission_id: result.postSubmissionId,
        })
        .eq("id", row.id);
      results.push({ id: row.id, platform: row.platform, ok: true, detail: result.postSubmissionId });
    } else {
      await supabase
        .from("social_posts")
        .update({
          status: "failed",
          error_message: result.error,
        })
        .eq("id", row.id);
      results.push({ id: row.id, platform: row.platform, ok: false, detail: result.error.slice(0, 200) });
    }
  }

  return NextResponse.json({
    ok: true,
    fired: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
}
