// POST /api/sms/reply — Steward sends a manual reply to an inbound message.
// Used by /steward Messages tab. Sends via Twilio + records in inbound_messages.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSms } from "@/lib/twilio";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

interface RequestBody {
  inboundId: string; // uuid of the inbound_messages row to reply to
  body: string;
}

export async function POST(req: NextRequest) {
  let payload: RequestBody;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { inboundId, body } = payload;
  if (!inboundId || !body?.trim()) {
    return NextResponse.json({ error: "Required: inboundId, body" }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Look up the inbound row to get the phone number
  const { data: inbound, error: lookupErr } = await supabase
    .from("inbound_messages")
    .select("from_number")
    .eq("id", inboundId)
    .single();

  if (lookupErr || !inbound) {
    return NextResponse.json({ error: "Inbound message not found" }, { status: 404 });
  }

  const result = await sendSms({ to: inbound.from_number, body: body.trim() });

  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 }
    );
  }

  // Record the reply on the inbound row
  await supabase
    .from("inbound_messages")
    .update({
      steward_reply_body: body.trim(),
      steward_reply_sent_at: new Date().toISOString(),
      handled_by: "steward",
      handled_at: new Date().toISOString(),
    })
    .eq("id", inboundId);

  return NextResponse.json({
    success: true,
    inboundId,
    twilioMessageSid: result.messageSid,
  });
}
