import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// XI Post Office — outbound mail
// Will use real API key once domain is registered
const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

// XI email templates
const TEMPLATES: Record<string, (data: Record<string, string>) => { subject: string; html: string }> = {
  // Sponsor notification — sent to the brother being sponsored
  sponsor_notify: (data) => ({
    subject: "Someone believes in you.",
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:40px 24px;font-family:'Georgia',serif;max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;border-radius:50%;border:1.5px solid #b08e50;margin:0 auto 16px;"></div>
          <p style="color:#b08e50;font-size:12px;letter-spacing:4px;">MĀKOA ORDER</p>
        </div>
        <p style="color:#e8e0d0;font-size:18px;font-style:italic;text-align:center;margin-bottom:24px;">
          Someone believes in you.
        </p>
        <p style="color:rgba(232,224,208,0.6);font-size:14px;line-height:1.8;margin-bottom:16px;">
          ${data.brother_name || "Brother"} — you've been sponsored into Mākoa.
          A ${data.sponsor_relation || "someone who cares about you"} has paid your way
          to MAYDAY 2026. ${data.ticket_type || "A seat"} is waiting for you.
        </p>
        ${data.message ? `<p style="color:rgba(176,142,80,0.5);font-size:13px;font-style:italic;border-left:2px solid rgba(176,142,80,0.2);padding-left:16px;margin-bottom:16px;">"${data.message}"</p>` : ""}
        <p style="color:rgba(232,224,208,0.5);font-size:13px;line-height:1.7;">
          You don't owe anyone anything. You just need to show up.<br/>
          May 1–3, 2026 · Kapolei, Hawai'i
        </p>
        <div style="text-align:center;margin-top:32px;">
          <a href="https://wild-sloth-yawn.vercel.app/gate" style="display:inline-block;padding:12px 28px;border:1px solid rgba(176,142,80,0.4);color:#b08e50;text-decoration:none;font-size:12px;letter-spacing:3px;">ENTER THE GATE</a>
        </div>
        <p style="color:rgba(176,142,80,0.2);font-size:10px;text-align:center;margin-top:32px;letter-spacing:2px;">
          XI · MĀKOA ORDER · EST. 2026
        </p>
      </div>
    `,
  }),

  // Welcome email — new pledge
  welcome_pledge: (data) => ({
    subject: "You walked through the gate.",
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:40px 24px;font-family:'Georgia',serif;max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;border-radius:50%;border:1.5px solid #b08e50;margin:0 auto 16px;"></div>
          <p style="color:#b08e50;font-size:12px;letter-spacing:4px;">MĀKOA ORDER</p>
        </div>
        <p style="color:#e8e0d0;font-size:18px;font-style:italic;text-align:center;margin-bottom:24px;">
          ${data.name || "Brother"} — you're in.
        </p>
        <p style="color:rgba(232,224,208,0.6);font-size:14px;line-height:1.8;">
          Your pledge has been received. Your 90-day formation starts now.
          You'll be assigned to a house, connected with your circle, and begin
          the path. This is not a subscription — it's a commitment.
        </p>
        <div style="margin:24px 0;padding:16px;border:1px solid rgba(176,142,80,0.12);border-radius:6px;">
          <p style="color:#b08e50;font-size:11px;letter-spacing:3px;margin-bottom:8px;">YOUR NEXT STEPS</p>
          <p style="color:rgba(232,224,208,0.5);font-size:13px;line-height:1.8;">
            1. Join the Telegram group (link coming)<br/>
            2. Attend your first circle<br/>
            3. Begin the 90-day formation<br/>
            4. Show up. That's it.
          </p>
        </div>
        <p style="color:rgba(176,142,80,0.2);font-size:10px;text-align:center;margin-top:32px;letter-spacing:2px;">
          XI · MĀKOA ORDER · EST. 2026
        </p>
      </div>
    `,
  }),

  // MAYDAY confirmation
  mayday_confirm: (data) => ({
    subject: "MAYDAY 2026 — You're confirmed.",
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:40px 24px;font-family:'Georgia',serif;max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;border-radius:50%;border:1.5px solid #b08e50;margin:0 auto 16px;"></div>
          <p style="color:#b08e50;font-size:12px;letter-spacing:4px;">MAYDAY 2026</p>
        </div>
        <p style="color:#e8e0d0;font-size:18px;font-style:italic;text-align:center;margin-bottom:24px;">
          See you at the gate, ${data.name || "brother"}.
        </p>
        <div style="margin:24px 0;padding:16px;border:1px solid rgba(176,142,80,0.12);border-radius:6px;">
          <p style="color:rgba(232,224,208,0.5);font-size:13px;line-height:1.8;">
            <strong style="color:#b08e50;">When:</strong> May 1–3, 2026<br/>
            <strong style="color:#b08e50;">Where:</strong> Kapolei, West O'ahu, Hawai'i<br/>
            <strong style="color:#b08e50;">Ticket:</strong> ${data.ticket_type || "Confirmed"}<br/>
            <strong style="color:#b08e50;">Check-in:</strong> Friday · 5:00 PM
          </p>
        </div>
        <p style="color:rgba(232,224,208,0.5);font-size:13px;line-height:1.7;">
          Bring nothing but yourself. We provide the rest.<br/>
          Ice bath gear, meals, and lodging details will follow 48 hours before the event.
        </p>
        <p style="color:rgba(176,142,80,0.2);font-size:10px;text-align:center;margin-top:32px;letter-spacing:2px;">
          XI · MĀKOA ORDER · EST. 2026
        </p>
      </div>
    `,
  }),

  // Dinner reservation request (XI sends to venues)
  dinner_reservation: (data) => ({
    subject: `Reservation Request — Mākoa Order — ${data.date || "May 2, 2026"}`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:560px;margin:0 auto;padding:24px;color:#333;">
        <p>Aloha,</p>
        <p>I'm writing on behalf of the Mākoa Order to request a private dining reservation:</p>
        <ul style="line-height:2;">
          <li><strong>Date:</strong> ${data.date || "May 2, 2026"}</li>
          <li><strong>Time:</strong> ${data.time || "6:00 PM"}</li>
          <li><strong>Party size:</strong> ${data.party_size || "24"} guests</li>
          <li><strong>Type:</strong> ${data.type || "Private founders dinner"}</li>
          <li><strong>Contact:</strong> ${data.contact_name || "Steward 0001"}</li>
          <li><strong>Phone:</strong> ${data.contact_phone || "—"}</li>
        </ul>
        <p>We're a men's brotherhood order based in West O'ahu hosting our founding summit (MAYDAY 2026).
        We'd like to discuss menu options and pricing for a private or semi-private dinner setting.</p>
        <p>Mahalo for your time.</p>
        <p style="margin-top:24px;">
          <em>XI — Operations, Mākoa Order</em><br/>
          <span style="font-size:12px;color:#888;">xi@makoaorder.com</span>
        </p>
      </div>
    `,
  }),

  // Hotel block request
  hotel_block: (data) => ({
    subject: `Group Block Request — Mākoa Order — May 1-3, 2026`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:560px;margin:0 auto;padding:24px;color:#333;">
        <p>Aloha,</p>
        <p>I'm reaching out on behalf of the Mākoa Order regarding a group room block:</p>
        <ul style="line-height:2;">
          <li><strong>Check-in:</strong> ${data.checkin || "May 1, 2026"}</li>
          <li><strong>Check-out:</strong> ${data.checkout || "May 3, 2026"}</li>
          <li><strong>Rooms needed:</strong> ${data.rooms || "12-24"}</li>
          <li><strong>Event:</strong> MAYDAY 2026 — Brotherhood founding summit</li>
          <li><strong>Location preference:</strong> ${data.location || "Kapolei / Ko Olina area"}</li>
          <li><strong>Contact:</strong> ${data.contact_name || "Steward 0001"}</li>
        </ul>
        <p>We're looking for group rates for our founding members attending a 3-day summit in West O'ahu.
        Please let us know availability, group pricing, and any meeting room options.</p>
        <p>Mahalo,</p>
        <p style="margin-top:24px;">
          <em>XI — Operations, Mākoa Order</em><br/>
          <span style="font-size:12px;color:#888;">xi@makoaorder.com</span>
        </p>
      </div>
    `,
  }),
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { template, to, data, from_alias } = body;

    // Use template if provided
    if (template && TEMPLATES[template]) {
      const { subject, html } = TEMPLATES[template](data || {});

      const result = await resend.emails.send({
        from: from_alias || "XI <xi@makoaorder.com>",
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });

      return NextResponse.json({ success: true, id: result.data?.id, template });
    }

    // Custom email (no template)
    const { subject, html, text } = body;
    if (!to || !subject) {
      return NextResponse.json({ error: "Missing 'to' or 'subject'" }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: from_alias || "XI <xi@makoaorder.com>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || `<p>${text || ""}</p>`,
    });

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error("XI Mail error:", error);
    return NextResponse.json({ error: "Mail delivery failed" }, { status: 500 });
  }
}

// GET — list available templates
export async function GET() {
  return NextResponse.json({
    templates: Object.keys(TEMPLATES),
    status: process.env.RESEND_API_KEY ? "ACTIVE" : "AWAITING_API_KEY",
    from: "xi@makoaorder.com",
    note: "POST with { template, to, data } or { to, subject, html }",
  });
}
