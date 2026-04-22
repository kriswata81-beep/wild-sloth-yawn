// ─── Blotato REST client (server-only) ─────────────────────────────────────
// Wraps https://backend.blotato.com/v2/posts
// Used by /api/social/post (immediate fire) and /api/cron/post-scheduled (queue drain).
// Server-only — never import in client components. BLOTATO_API_KEY lives in Vercel env.

import { SOCIAL_ACCOUNTS, type SocialPlatform } from "./constants";

const BLOTATO_ENDPOINT = "https://backend.blotato.com/v2/posts";
const SITE_URL = "https://makoa.live";

// Default media per platform — used when caller provides no mediaUrls
// Videos rotate by day-of-year so the feed doesn't repeat
const YOUTUBE_VIDEOS = [
  "/videos/01_crest_reveal.mp4",
  "/videos/02_the_ice.mp4",
  "/videos/03_the_oath.mp4",
  "/videos/04_the_mission.mp4",
  "/videos/05_the_war_room.mp4",
  "/videos/06_countdown_12.mp4",
  "/videos/07_seats_remaining.mp4",
  "/videos/08_brotherhood_medicine.mp4",
  "/videos/09_sold_out.mp4",
  "/videos/10_the_fire.mp4",
];

function defaultMediaFor(platform: SocialPlatform): string[] {
  if (platform === "tiktok" || platform === "instagram") {
    return [`${SITE_URL}/makoa_crest.png`];
  }
  if (platform === "youtube") {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const video = YOUTUBE_VIDEOS[dayOfYear % YOUTUBE_VIDEOS.length];
    return [`${SITE_URL}${video}`];
  }
  return [];
}

export interface BlotatoPostInput {
  platform: SocialPlatform;
  text: string;
  mediaUrls?: string[];
  scheduledTime?: string; // ISO 8601 with timezone
  // Per-post overrides for platform-specific fields (merged on top of SOCIAL_ACCOUNTS defaults)
  overrides?: Record<string, unknown>;
}

export interface BlotatoSuccess {
  ok: true;
  postSubmissionId: string;
}

export interface BlotatoFailure {
  ok: false;
  error: string;
  status?: number;
  raw?: unknown;
}

export type BlotatoResult = BlotatoSuccess | BlotatoFailure;

// Blotato's targetType is just the platform name itself (confirmed via 400
// error: must be one of "webhook"|"twitter"|"linkedin"|"facebook"|...).
// pageId / boardId / etc. live as sibling fields in the target object.
function targetTypeFor(platform: SocialPlatform): string {
  return platform;
}

export async function blotatoPost(input: BlotatoPostInput): Promise<BlotatoResult> {
  const apiKey = process.env.BLOTATO_API_KEY;
  if (!apiKey || apiKey === "blotato_placeholder") {
    return {
      ok: false,
      error:
        "BLOTATO_API_KEY is not set. Add it in Vercel → Settings → Environment Variables, then redeploy.",
    };
  }

  const account = SOCIAL_ACCOUNTS[input.platform];
  if (!account || !account.connected) {
    return {
      ok: false,
      error: `Platform "${input.platform}" is not connected. Add the account at my.blotato.com first.`,
    };
  }

  // Platform-specific media resolution — inject defaults if caller didn't provide media
  const rawMedia = input.mediaUrls || [];
  const media = rawMedia.length > 0 ? rawMedia : defaultMediaFor(input.platform);

  // Final validation after defaults applied
  if (input.platform === "tiktok" && media.length === 0) {
    return { ok: false, error: "TikTok requires at least one image or video. Default injection failed." };
  }
  if (input.platform === "youtube") {
    const hasVideo = media.some((u) => /\.(mp4|mov|avi|mkv|webm)/i.test(u));
    if (!hasVideo) {
      return { ok: false, error: "YouTube requires a video file URL. Default injection failed." };
    }
  }

  // Merge defaults + per-post overrides for the target object.
  const targetExtras = { ...account.defaults, ...(input.overrides || {}) };

  const body: Record<string, unknown> = {
    post: {
      accountId: account.accountId,
      content: {
        text: input.text,
        mediaUrls: media,
        platform: input.platform,
      },
      target: {
        targetType: targetTypeFor(input.platform),
        ...targetExtras,
      },
    },
  };

  if (input.scheduledTime) {
    body.scheduledTime = input.scheduledTime;
  }

  try {
    const res = await fetch(BLOTATO_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "blotato-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        ok: false,
        status: res.status,
        error: `Blotato returned ${res.status}: ${errText.slice(0, 400)}`,
      };
    }

    const json = await res.json().catch(() => null);
    const submissionId = json?.postSubmissionId as string | undefined;
    if (!submissionId) {
      return {
        ok: false,
        status: res.status,
        error: "Blotato 2xx but no postSubmissionId in response",
        raw: json,
      };
    }

    return { ok: true, postSubmissionId: submissionId };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
