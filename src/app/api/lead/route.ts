import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "https://flzivjhxtbolcfaniskv.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

// In-memory rate limit store: ip → [timestamps]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return false;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const {
    full_name,
    email,
    phone,
    zip_code,
    weekend_preference,
    tier_interest,
    why,
  } = body as {
    full_name?: string;
    email?: string;
    phone?: string;
    zip_code?: string;
    weekend_preference?: string;
    tier_interest?: string;
    why?: string;
  };

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("applicants")
    .insert({
      full_name: full_name ?? null,
      email: email.trim().toLowerCase(),
      phone: phone ?? null,
      zip_code: zip_code ?? null,
      weekend_preference: weekend_preference ?? null,
      tier_interest: tier_interest ?? null,
      why: why ?? null,
      source: "mayday48_landing",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[api/lead] Supabase insert error:", error);
    return NextResponse.json(
      { error: "Failed to save application. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, application_id: data?.id ?? null });
}
