// POST /api/social/schedule — queue a post for future firing.
// Writes to social_posts with status='scheduled' + scheduled_for set.
// Cron route (/api/cron/post-scheduled) drains the queue every 15 minutes.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SOCIAL_ACCOUNTS, type SocialPlatform } from "@/lib/constants";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

interface RequestBody {
  platform: SocialPlatform;
  text: string;
  mediaUrls?: string[];
  scheduledFor: string; // ISO 8601
  overrides?: Record<string, unknown>;
  createdBy?: string;
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    platform,
    text,
    mediaUrls = [],
    scheduledFor,
    overrides,
    createdBy = "steward",
  } = body;

  if (!platform || !text || !scheduledFor) {
    return NextResponse.json(
      { error: "Required: platform, text, scheduledFor (ISO 8601)" },
      { status: 400 }
    );
  }

  const account = SOCIAL_ACCOUNTS[platform];
  if (!account) {
    return NextResponse.json({ error: `Unknown platform: ${platform}` }, { status: 400 });
  }
  if (!account.connected) {
    return NextResponse.json(
      { error: `Platform "${platform}" is not connected. Connect at my.blotato.com first.` },
      { status: 400 }
    );
  }

  const when = new Date(scheduledFor);
  if (isNaN(when.getTime())) {
    return NextResponse.json({ error: "Invalid scheduledFor — must be ISO 8601" }, { status: 400 });
  }
  if (when.getTime() <= Date.now() + 60_000) {
    return NextResponse.json(
      { error: "scheduledFor must be at least 1 minute in the future. Use /api/social/post for immediate." },
      { status: 400 }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: row, error: insertErr } = await supabase
    .from("social_posts")
    .insert({
      platform,
      account_id: account.accountId,
      platform_specific: overrides || {},
      text,
      media_urls: mediaUrls,
      scheduled_for: when.toISOString(),
      status: "scheduled",
      created_by: createdBy,
    })
    .select()
    .single();

  if (insertErr || !row) {
    return NextResponse.json(
      { error: `DB insert failed: ${insertErr?.message || "unknown"}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    id: row.id,
    scheduledFor: row.scheduled_for,
    platform,
  });
}

// DELETE — cancel a scheduled post (DELETE /api/social/schedule?id=...)
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Required: ?id=..." }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: row, error: selErr } = await supabase
    .from("social_posts")
    .select("status")
    .eq("id", id)
    .single();

  if (selErr || !row) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  if (row.status !== "scheduled") {
    return NextResponse.json(
      { error: `Cannot cancel — post is ${row.status}, not scheduled` },
      { status: 400 }
    );
  }

  const { error: delErr } = await supabase
    .from("social_posts")
    .delete()
    .eq("id", id);

  if (delErr) {
    return NextResponse.json(
      { error: `Delete failed: ${delErr.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, id });
}
