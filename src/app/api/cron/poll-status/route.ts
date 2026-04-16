// GET /api/cron/poll-status — backfills async publish results from Blotato.
// Why: /api/social/post returns success based on Blotato's *submission* response,
// but Blotato can later async-fail (YouTube without video, IG with bad URL, etc).
// This cron picks up rows where status='fired' AND blotato_post_url IS NULL,
// polls Blotato's get-post-status, and reconciles to 'published' (with publicUrl)
// or 'failed' (with errorMessage).
// Auth: Bearer ${CRON_SECRET}.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const BLOTATO_STATUS_ENDPOINT = "https://backend.blotato.com/v2/posts";

// Cap per run — Blotato rate limit is 30 req/min.
const MAX_PER_RUN = 25;

// Skip rows that are too fresh — Blotato needs ~30s minimum to publish.
const MIN_AGE_SECONDS = 60;

interface PendingRow {
  id: string;
  blotato_submission_id: string;
  fired_at: string;
}

interface BlotatoStatusResponse {
  postSubmissionId: string;
  status: "in-progress" | "published" | "failed";
  publicUrl?: string;
  errorMessage?: string;
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const apiKey = process.env.BLOTATO_API_KEY;
  if (!apiKey || apiKey === "blotato_placeholder") {
    return NextResponse.json(
      { ok: false, error: "BLOTATO_API_KEY not set" },
      { status: 500 }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Pull rows where we fired to Blotato but haven't yet recorded the public URL.
  // Older than MIN_AGE_SECONDS so Blotato has had time to publish.
  const cutoffIso = new Date(Date.now() - MIN_AGE_SECONDS * 1000).toISOString();

  const { data: pending, error: queryErr } = await supabase
    .from("social_posts")
    .select("id, blotato_submission_id, fired_at")
    .eq("status", "fired")
    .is("blotato_post_url", null)
    .not("blotato_submission_id", "is", null)
    .lte("fired_at", cutoffIso)
    .order("fired_at", { ascending: true })
    .limit(MAX_PER_RUN);

  if (queryErr) {
    console.error("[cron poll-status] Query error:", queryErr.message);
    return NextResponse.json({ error: queryErr.message }, { status: 500 });
  }

  if (!pending || pending.length === 0) {
    return NextResponse.json({ ok: true, polled: 0, message: "No pending posts" });
  }

  const results: Array<{
    id: string;
    submissionId: string;
    finalStatus: string;
    detail: string;
  }> = [];

  for (const row of pending as PendingRow[]) {
    try {
      const res = await fetch(`${BLOTATO_STATUS_ENDPOINT}/${row.blotato_submission_id}`, {
        method: "GET",
        headers: { "blotato-api-key": apiKey },
      });

      if (!res.ok) {
        results.push({
          id: row.id,
          submissionId: row.blotato_submission_id,
          finalStatus: "skip",
          detail: `Blotato HTTP ${res.status}`,
        });
        continue;
      }

      const json = (await res.json()) as BlotatoStatusResponse;

      if (json.status === "published" && json.publicUrl) {
        await supabase
          .from("social_posts")
          .update({ blotato_post_url: json.publicUrl })
          .eq("id", row.id);
        results.push({
          id: row.id,
          submissionId: row.blotato_submission_id,
          finalStatus: "published",
          detail: json.publicUrl,
        });
      } else if (json.status === "failed") {
        await supabase
          .from("social_posts")
          .update({
            status: "failed",
            error_message: `Blotato async fail: ${json.errorMessage || "unknown"}`,
          })
          .eq("id", row.id);
        results.push({
          id: row.id,
          submissionId: row.blotato_submission_id,
          finalStatus: "failed",
          detail: json.errorMessage || "unknown",
        });
      } else {
        // Still in-progress — leave for next poll
        results.push({
          id: row.id,
          submissionId: row.blotato_submission_id,
          finalStatus: "in-progress",
          detail: "still publishing",
        });
      }
    } catch (err) {
      results.push({
        id: row.id,
        submissionId: row.blotato_submission_id,
        finalStatus: "error",
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json({
    ok: true,
    polled: results.length,
    published: results.filter((r) => r.finalStatus === "published").length,
    failed: results.filter((r) => r.finalStatus === "failed").length,
    inProgress: results.filter((r) => r.finalStatus === "in-progress").length,
    errors: results.filter((r) => r.finalStatus === "error").length,
    results,
  });
}
