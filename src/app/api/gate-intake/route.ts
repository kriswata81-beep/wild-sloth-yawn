import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export async function POST(req: NextRequest) {
  try {
    const { avatarName, email, phone, weekend } = await req.json();

    if (!avatarName || !email || !phone) {
      return NextResponse.json(
        { error: "avatarName, email, and phone are required" },
        { status: 400 }
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneOk = phone.replace(/\D/g, "").length >= 7;

    if (!emailOk)
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    if (!phoneOk)
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });

    // Save to Supabase using service role key (bypasses RLS for insert)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { error: dbError } = await supabase.from("gate_intake").insert({
      avatar_name: avatarName,
      email,
      phone,
      weekend: weekend || null,
    });

    if (dbError) {
      console.error("[gate-intake] Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
    }

    console.log("[gate-intake] saved to Supabase:", {
      avatarName,
      email,
      phone,
      weekend: weekend || "not specified",
      ts: new Date().toISOString(),
    });

    // Notify steward via Supabase email (uses service role)
    try {
      await supabase.functions.invoke("notify-steward", {
        body: { avatarName, email, phone, weekend: weekend || "not specified" },
      });
    } catch (notifyErr) {
      // Non-fatal — submission is already saved
      console.warn("[gate-intake] steward notification failed (non-fatal):", notifyErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[gate-intake] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
