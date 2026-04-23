import { NextRequest, NextResponse } from "next/server";

// TODO: Wire to Supabase gate_intake table + Twilio SMS
// Confirm with Kris before fully enabling Twilio:
//   - Supabase: insert row into gate_intake (encrypted email + phone)
//   - Twilio: send SMS to phone with link: makoa.live/mayday48/paywall?ref={token}
// For now: logs submission and returns 200 so the form UX works end-to-end.

export async function POST(req: NextRequest) {
  try {
    const { avatarName, email, phone, weekend } = await req.json();

    if (!avatarName || !email || !phone) {
      return NextResponse.json({ error: "avatarName, email, and phone are required" }, { status: 400 });
    }

    // Basic format validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneOk = phone.replace(/\D/g, "").length >= 7;

    if (!emailOk) return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    if (!phoneOk) return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });

    // TODO: replace with Supabase insert
    console.log("[gate-intake] new submission:", {
      avatarName,
      email,
      phone,
      weekend: weekend || "not specified",
      ts: new Date().toISOString(),
    });

    // TODO: trigger Twilio SMS here
    // const paywall_url = `https://makoa.live/mayday48/paywall?ref=${token}`;
    // await twilioClient.messages.create({ to: phone, from: TWILIO_FROM, body: `XI here. Your gate link: ${paywall_url}` });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[gate-intake] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
