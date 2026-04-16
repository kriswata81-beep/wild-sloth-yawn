// ─── Blotato REST client (server-only) ─────────────────────────────────────
// Wraps https://backend.blotato.com/v2/posts
// Used by /api/social/post (immediate fire) and /api/cron/post-scheduled (queue drain).
// Server-only — never import in client components. BLOTATO_API_KEY lives in Vercel env.

import { SOCIAL_ACCOUNTS, type SocialPlatform } from "./constants";

const BLOTATO_ENDPOINT = "https://backend.blotato.com/v2/posts";

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

// Map our platform → the targetType Blotato expects.
// Best-effort defaults based on Blotato's REST docs. Refine via dashboard
// (my.blotato.com/failed) if any platform errors.
function targetTypeFor(platform: SocialPlatform, hasPageId: boolean): string {
  if (platform === "facebook") return "page";
  if (platform === "linkedin") return hasPageId ? "page" : "user";
  if (platform === "pinterest" as SocialPlatform) return "board";
  return "user";
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

  // Merge defaults + per-post overrides for the target object.
  const targetExtras = { ...account.defaults, ...(input.overrides || {}) };
  const hasPageId = "pageId" in targetExtras && Boolean(targetExtras.pageId);

  const body: Record<string, unknown> = {
    post: {
      accountId: account.accountId,
      content: {
        text: input.text,
        mediaUrls: input.mediaUrls || [],
        platform: input.platform,
      },
      target: {
        targetType: targetTypeFor(input.platform, hasPageId),
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
