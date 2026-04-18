// POST /api/yard-quote — Receive a yard service quote request.
// Saves to Supabase, pings Steward via Telegram, and sends confirmation via Resend.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const TELEGRAM_FN = `${SUPABASE_URL}/functions/v1/telegram-send`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, address, zip, service, notes, source, timestamp } = body;

    if (!name || !phone || !address || !zip) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Insert into yard_quotes table (create if missing — graceful fail)
    const { error: dbError } = await supabase.from("yard_quotes").insert([{
      name,
      phone,
      address,
      zip,
      service: service || "unspecified",
      notes: notes || "",
      source: source || "yard_landing",
      status: "new",
      created_at: timestamp || new Date().toISOString(),
    }]);

    if (dbError) {
      console.error("[YARD-QUOTE] Supabase insert error:", dbError.message);
      // Don't fail the user — continue to Telegram ping
    }

    // Telegram alert to Steward 0001
    const serviceLabel = service
      ? service.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
      : "General inquiry";

    const tgMessage =
      `🌿 *YARD QUOTE REQUEST*\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Address:* ${address}\n` +
      `*Zip:* ${zip}\n` +
      `*Service:* ${serviceLabel}\n` +
      (notes ? `*Notes:* ${notes}\n` : "") +
      `\n_Land Route · West Oahu Cluster_`;

    try {
      await fetch(TELEGRAM_FN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ message: tgMessage }),
      });
    } catch (tgErr) {
      console.error("[YARD-QUOTE] Telegram ping failed:", tgErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[YARD-QUOTE] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
