// POST /api/gate/notify — Ping Steward on Telegram when someone passes the gate
import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8579323983:AAHHba3AN9pzJKfbKcVBG8B0bs9N1okvrys";
const TELEGRAM_CHAT_ID = "-1003779092888";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { handle, tier, zip, q1, q4, q7, referral_code } = body;

    const tierEmoji = tier === "alii" ? "🔱" : tier === "mana" ? "⚡" : "🌿";
    const tierLabel = tier === "alii" ? "ALIʻI" : tier === "mana" ? "MANA" : "NĀ KOA";

    const msg =
      `${tierEmoji} <b>GATE SUBMISSION — ${tierLabel}</b>\n\n` +
      `<b>Handle:</b> ${handle || "Anonymous"}\n` +
      `<b>Zip:</b> ${zip || "—"}\n` +
      `<b>Brings:</b> ${q1 || "—"}\n` +
      `<b>Trade:</b> ${q4 || "—"}\n` +
      `<b>Vehicle:</b> ${q7 || "—"}\n` +
      (referral_code ? `<b>Ref:</b> ${referral_code}\n` : "") +
      `\n<i>Review at makoa.live/steward</i>`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "HTML" }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[gate/notify] Error:", err);
    return NextResponse.json({ ok: false });
  }
}
