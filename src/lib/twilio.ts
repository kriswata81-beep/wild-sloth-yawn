// ─── Twilio REST helpers (server-only) ─────────────────────────────────────
// Used by /api/sms/* routes. Never import in client components.
// Required env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER.

const TWILIO_API_BASE = "https://api.twilio.com/2010-04-01";

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string; // E.164, e.g. +18085551234
}

export function getTwilioConfig(): TwilioConfig | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
  if (!accountSid || !authToken || !phoneNumber) return null;
  if (
    accountSid === "twilio_placeholder" ||
    authToken === "twilio_placeholder" ||
    phoneNumber === "twilio_placeholder"
  ) {
    return null;
  }
  return { accountSid, authToken, phoneNumber };
}

export interface SmsSendResult {
  ok: boolean;
  messageSid?: string;
  error?: string;
}

export async function sendSms(opts: { to: string; body: string }): Promise<SmsSendResult> {
  const cfg = getTwilioConfig();
  if (!cfg) {
    return { ok: false, error: "Twilio not configured (missing TWILIO_* env vars)" };
  }

  const url = `${TWILIO_API_BASE}/Accounts/${cfg.accountSid}/Messages.json`;
  const auth = Buffer.from(`${cfg.accountSid}:${cfg.authToken}`).toString("base64");
  const body = new URLSearchParams({
    To: opts.to,
    From: cfg.phoneNumber,
    Body: opts.body.slice(0, 1600), // Twilio caps at 1600 chars
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return { ok: false, error: `Twilio HTTP ${res.status}: ${txt.slice(0, 300)}` };
    }
    const json = (await res.json()) as { sid?: string };
    return { ok: true, messageSid: json.sid };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// Crisis keywords — mirror xi-agent.ts crisis detection. Used as fast-path
// pre-screen before falling back to LLM classification.
const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end it all", "want to die",
  "hurt myself", "self-harm",
  "abuse", "abused", "abusing",
  "homeless", "no place to go", "nowhere to go",
  "addicted", "addiction", "withdrawal",
  "domestic violence", "dv", "hit me", "she hit", "he hit",
  "overdose", "od'd",
];

export function quickCrisisCheck(body: string): boolean {
  const lower = body.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}
