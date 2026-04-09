import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface ConfirmationPayload {
  to_email: string;
  handle: string;
  product_name: string;
  product_id: string;
  amount: string;
  day_selection?: string;
  session_id?: string;
}

const TIER_DETAILS: Record<string, { tier: string; color: string; what: string; when: string }> = {
  DUES_DOWN: {
    tier: "Founding Member",
    color: "#b08e50",
    what: "Annual Dues — 25% Down Payment",
    when: "Your founding rate is locked for life at $497/yr.",
  },
  MAYDAY_DAY_PASS_EARLY: {
    tier: "Nā Koa",
    color: "#3fb950",
    what: "12HR Day Pass — Early Bird",
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu",
  },
  MAYDAY_DAY_PASS_LAST: {
    tier: "Nā Koa",
    color: "#3fb950",
    what: "12HR Day Pass — Last Call",
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu",
  },
  MAYDAY_MASTERMIND_EARLY: {
    tier: "Mana",
    color: "#58a6ff",
    what: "24HR Mana Mastermind — Early Bird",
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu",
  },
  MAYDAY_MASTERMIND_LAST: {
    tier: "Mana",
    color: "#58a6ff",
    what: "24HR Mana Mastermind — Last Call",
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu",
  },
  MAYDAY_WAR_ROOM_EARLY: {
    tier: "Aliʻi",
    color: "#b08e50",
    what: "48HR Aliʻi War Room — Early Bird",
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu",
  },
  MAYDAY_WAR_ROOM_LAST: {
    tier: "Aliʻi",
    color: "#b08e50",
    what: "48HR Aliʻi War Room — Last Call",
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu",
  },
  MAYDAY_WAR_VAN_EARLY: {
    tier: "War Party VIP",
    color: "#b08e50",
    what: "72HR War Party VIP — Early Bird",
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu · Airport pickup included",
  },
  MAYDAY_WAR_VAN_LAST: {
    tier: "War Party VIP",
    color: "#b08e50",
    what: "72HR War Party VIP — Last Call",
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu · Airport pickup included",
  },
  TEAM_WAR_PARTY_2: {
    tier: "Aliʻi War Party · Fly-In",
    color: "#b08e50",
    what: "72HR Fly-In Party of 2 — Hotel + Dinner + Ice Bath",
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu · 1 shared room · Airport pickup included",
  },
  TEAM_WAR_PARTY_3: {
    tier: "Aliʻi War Party · Fly-In",
    color: "#b08e50",
    what: "72HR Fly-In Party of 3 — Hotel + Dinner + Ice Bath",
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu · 2 shared rooms · Airport pickup included",
  },
  TEAM_WAR_PARTY_4: {
    tier: "Aliʻi War Party · Fly-In",
    color: "#b08e50",
    what: "72HR Fly-In Party of 4 — Hotel + Dinner + Ice Bath",
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu · 2 shared rooms · Airport pickup included",
  },
  TEAM_WAR_ROOM_3: {
    tier: "Aliʻi War Party · Drive-Up",
    color: "#b08e50",
    what: "72HR Drive-Up Team of 3 — Dinner + Ice Bath",
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu · Founders Dinner Sunday night",
  },
  TEAM_MASTERMIND_3: {
    tier: "Mana War Party · Drive-Up",
    color: "#58a6ff",
    what: "72HR Drive-Up Team of 3 — Ice Bath",
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu · 3× Elite Ice Bath Reset",
  },
};

function buildEmailHtml(payload: ConfirmationPayload): string {
  const details = TIER_DETAILS[payload.product_id] || {
    tier: "Mākoa Brother",
    color: "#b08e50",
    what: payload.product_name,
    when: "MAYDAY Founding 48 · May 1–4, 2026 · Kapolei, Oʻahu",
  };

  const dayLine = payload.day_selection
    ? `<p style="color:#b08e50;font-size:13px;margin:4px 0 0;">Day: ${payload.day_selection === "saturday" ? "Saturday, May 2" : "Sunday, May 3"}</p>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#04060a;font-family:'Courier New',monospace;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;border-bottom:1px solid rgba(176,142,80,0.3);padding-bottom:28px;margin-bottom:28px;">
      <p style="color:rgba(176,142,80,0.5);font-size:10px;letter-spacing:0.3em;margin:0 0 12px;">MĀKOA ORDER</p>
      <h1 style="color:#b08e50;font-size:28px;margin:0 0 8px;font-style:italic;font-family:Georgia,serif;">
        Aloha, ${payload.handle}
      </h1>
      <p style="color:rgba(232,224,208,0.5);font-size:12px;margin:0;">Your seat is confirmed. Brotherhood awaits.</p>
    </div>

    <!-- Confirmation box -->
    <div style="background:rgba(176,142,80,0.06);border:1px solid rgba(176,142,80,0.3);border-radius:10px;padding:24px;margin-bottom:24px;">
      <p style="color:rgba(176,142,80,0.5);font-size:10px;letter-spacing:0.2em;margin:0 0 6px;">TIER</p>
      <p style="color:${details.color};font-size:16px;font-weight:700;margin:0 0 16px;letter-spacing:0.1em;">${details.tier}</p>

      <p style="color:rgba(176,142,80,0.5);font-size:10px;letter-spacing:0.2em;margin:0 0 6px;">WHAT</p>
      <p style="color:#e8e0d0;font-size:14px;margin:0 0 4px;">${details.what}</p>
      ${dayLine}

      <div style="height:1px;background:rgba(176,142,80,0.15);margin:16px 0;"></div>

      <p style="color:rgba(176,142,80,0.5);font-size:10px;letter-spacing:0.2em;margin:0 0 6px;">WHEN & WHERE</p>
      <p style="color:#e8e0d0;font-size:13px;margin:0 0 16px;line-height:1.6;">${details.when}</p>

      <p style="color:rgba(176,142,80,0.5);font-size:10px;letter-spacing:0.2em;margin:0 0 6px;">AMOUNT PAID</p>
      <p style="color:#b08e50;font-size:20px;font-weight:700;margin:0;">${payload.amount}</p>
    </div>

    <!-- What's next -->
    <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:20px;margin-bottom:24px;">
      <p style="color:rgba(176,142,80,0.5);font-size:10px;letter-spacing:0.2em;margin:0 0 14px;">WHAT HAPPENS NEXT</p>
      ${[
        "Join the 808 Brotherhood Telegram → t.me/+dsS4Mz0p5wM4OGYx",
        "Watch for your XI briefing — event details, schedule, and logistics",
        "Founders Dinner vote drops in Telegram — Hawaii-owned restaurant, Kapolei",
        "4am ice bath schedule confirmed 2 weeks before MAYDAY",
        "Questions? wakachief@gmail.com",
      ].map(step => `
        <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;">
          <span style="color:#b08e50;font-size:12px;flex-shrink:0;margin-top:1px;">→</span>
          <p style="color:rgba(232,224,208,0.6);font-size:12px;margin:0;line-height:1.5;">${step}</p>
        </div>
      `).join("")}
    </div>

    <!-- Quote -->
    <div style="text-align:center;padding:20px 0;border-top:1px solid rgba(176,142,80,0.15);">
      <p style="color:#b08e50;font-size:18px;font-style:italic;font-family:Georgia,serif;margin:0 0 8px;">
        Hana · Pale · Ola
      </p>
      <p style="color:rgba(232,224,208,0.25);font-size:10px;letter-spacing:0.15em;margin:0;">
        MĀKOA ORDER · WEST OAHU · 2026
      </p>
    </div>

  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("[send-confirmation] RESEND_API_KEY not set");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload: ConfirmationPayload = await req.json();
    console.log("[send-confirmation] Sending confirmation to:", payload.to_email, "product:", payload.product_id);

    const html = buildEmailHtml(payload);

    const subject = payload.product_id === "DUES_DOWN"
      ? `Mākoa Order — Dues Confirmed, ${payload.handle}`
      : `MAYDAY Confirmed — Your Seat is Locked, ${payload.handle}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mākoa Order <noreply@makoaorder.com>",
        to: [payload.to_email],
        subject,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[send-confirmation] Resend API error:", data);
      return new Response(JSON.stringify({ error: "Failed to send email", details: data }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[send-confirmation] Email sent successfully:", data.id);
    return new Response(JSON.stringify({ success: true, email_id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[send-confirmation] Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
