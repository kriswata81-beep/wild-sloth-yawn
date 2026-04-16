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

  // Merge defaults + per-post overrides for the target object.
  const targetExtras = { ...account.defaults, ...(input.overrides || {}) };

  const body: Record<string, unknown> = {
    post: {
      accountId: account.accountId,
      content: {
        text: input.text,
        mediaUrls: input.mediaUrls || [],
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
