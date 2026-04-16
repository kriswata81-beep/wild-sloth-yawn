// POST /api/social/post — fire a post immediately to a connected social channel.
// Used by /steward Social tab "Post Now" button + by Claude Code ad-hoc.
// Records the result in social_posts so /steward shows complete history.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { blotatoPost } from "@/lib/blotato";
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
  overrides?: Record<string, unknown>;
  createdBy?: string; // 'steward' | 'claude' | 'dyad'
  firedBy?: string;   // 'steward_manual' | 'claude_adhoc'
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { platform, text, mediaUrls = [], overrides, createdBy = "steward", firedBy = "steward_manual" } = body;

  // Validation
  if (!platform || !text) {
    return NextResponse.json(
      { error: "Required: platform, text" },
      { status: 400 }
    );
  }
  const account = SOCIAL_ACCOUNTS[platform];
  if (!account) {
    return NextResponse.json(
      { error: `Unknown platform: ${platform}` },
      { status: 400 }
    );
  }
  if (!account.connected) {
    return NextResponse.json(
      {
        error: `Platform "${platform}" is not connected. Connect at my.blotato.com first.`,
      },
      { status: 400 }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // 1. Insert as 'firing' so /steward shows it in flight
  const { data: row, error: insertErr } = await supabase
    .from("social_posts")
    .insert({
      platform,
      account_id: account.accountId,
      platform_specific: overrides || {},
      text,
      media_urls: mediaUrls,
      status: "firing",
      created_by: createdBy,
      fired_by: firedBy,
      fired_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertErr || !row) {
    return NextResponse.json(
      { error: `DB insert failed: ${insertErr?.message || "unknown"}` },
      { status: 500 }
    );
  }

  // 2. Fire to Blotato
  const result = await blotatoPost({
    platform,
    text,
    mediaUrls,
    overrides,
  });

  // 3. Update row with result
  if (result.ok) {
    await supabase
      .from("social_posts")
      .update({
        status: "fired",
        blotato_submission_id: result.postSubmissionId,
      })
      .eq("id", row.id);

    return NextResponse.json({
      success: true,
      id: row.id,
      blotatoSubmissionId: result.postSubmissionId,
    });
  } else {
    await supabase
      .from("social_posts")
      .update({
        status: "failed",
        error_message: result.error,
      })
      .eq("id", row.id);

    return NextResponse.json(
      { success: false, id: row.id, error: result.error },
      { status: result.status || 500 }
    );
  }
}

// GET — connection status check (used by /steward UI to show what's wired)
export async function GET() {
  const apiKeySet =
    Boolean(process.env.BLOTATO_API_KEY) &&
    process.env.BLOTATO_API_KEY !== "blotato_placeholder";

  const channels = Object.values(SOCIAL_ACCOUNTS).map((a) => ({
    platform: a.platform,
    label: a.label,
    username: a.username,
    connected: a.connected,
    accountId: a.accountId,
  }));

  return NextResponse.json({
    blotatoApiKey: apiKeySet ? "ACTIVE" : "AWAITING_BLOTATO_API_KEY",
    channels,
  });
}
