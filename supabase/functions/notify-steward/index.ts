import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STEWARD_EMAIL = "Wakachefs@gmail.com";
const STEWARD_PHONE = "808-757-6985";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { avatarName, email, phone, weekend } = await req.json();

    console.log("[notify-steward] new gate submission received:", {
      avatarName,
      email,
      phone,
      weekend,
      ts: new Date().toISOString(),
    });

    // Send notification email via Supabase SMTP (built-in)
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const emailBody = `
NEW GATE SUBMISSION — MĀKOA MAYDAY 48

Avatar Name: ${avatarName}
Email: ${email}
Phone: ${phone}
Weekend: ${weekend}
Time: ${new Date().toISOString()}

---
Reply to this email or text ${phone} to connect with this brother.
Steward contact: ${STEWARD_PHONE}
    `.trim();

    // Use Supabase's admin email endpoint
    const emailRes = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        to: STEWARD_EMAIL,
        subject: `🔥 New Gate Submission: ${avatarName} — ${weekend}`,
        text: emailBody,
      }),
    });

    if (!emailRes.ok) {
      console.warn("[notify-steward] email send failed, status:", emailRes.status);
    } else {
      console.log("[notify-steward] steward notification email sent to", STEWARD_EMAIL);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[notify-steward] error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
