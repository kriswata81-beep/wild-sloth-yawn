import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }
    // TODO: wire to Supabase waitlist table
    console.log("[waitlist] new signup:", { email, ts: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[waitlist] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
