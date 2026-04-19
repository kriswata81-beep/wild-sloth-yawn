// POST /api/yard-quote — Receive a yard service quote request.
// Saves to Supabase + pings Steward via Telegram bot directly.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8579323983:AAHHba3AN9pzJKfbKcVBG8B0bs9N1okvrys";
const TELEGRAM_CHAT_ID = "-1003779092888"; // Mākoa brotherhood channel

async function sendTelegram(msg: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: msg,
        parse_mode: "HTML",
      }),
    });
  } catch (err) {
    console.error("[yard-quote] Telegram send failed:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, address, zip, service, notes, source, timestamp } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Save to Supabase — graceful fail if table missing
    await supabase.from("yard_quotes").insert([{
      name,
      phone,
      address: address || "",
      zip: zip || "",
      service: service || "unspecified",
      notes: notes || "",
      source: source || "yard_landing",
      status: "new",
      created_at: timestamp || new Date().toISOString(),
    }]).then(({ error }) => {
      if (error) console.error("[yard-quote] DB insert error:", error.message);
    });

    // Telegram alert
    const serviceLabel = service
      ? service.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
      : "General inquiry";

    await sendTelegram(
      `🌿 <b>YARD QUOTE REQUEST</b>\n\n` +
      `<b>Name:</b> ${name}\n` +
      `<b>Phone:</b> ${phone}\n` +
      (address ? `<b>Address:</b> ${address}\n` : "") +
      (zip ? `<b>Zip:</b> ${zip}\n` : "") +
      `<b>Service:</b> ${serviceLabel}\n` +
      (notes ? `<b>Notes:</b> ${notes}\n` : "") +
      `\n<i>Land Route · West Oahu Cluster · makoa.live</i>`
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[yard-quote] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
