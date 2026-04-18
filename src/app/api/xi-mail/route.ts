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
          <a href="https://makoa.live/gate" style="display:inline-block;padding:12px 28px;border:1px solid rgba(176,142,80,0.4);color:#b08e50;text-decoration:none;font-size:12px;letter-spacing:3px;">ENTER THE GATE</a>
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

  // Weight Room — missed 1 session (Don't miss 2 in a row)
  weight_room_miss1: (data) => ({
    subject: "You missed the Weight Room.",
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:40px 24px;font-family:'Georgia',serif;max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;border-radius:50%;border:1.5px solid #f85149;margin:0 auto 16px;"></div>
          <p style="color:#f85149;font-size:12px;letter-spacing:4px;">THE WEIGHT ROOM</p>
        </div>
        <p style="color:#e8e0d0;font-size:18px;font-style:italic;text-align:center;margin-bottom:24px;">
          ${data.name || "Brother"} — the circle noticed.
        </p>
        <p style="color:rgba(232,224,208,0.6);font-size:14px;line-height:1.8;margin-bottom:16px;">
          You weren't at the Weight Room this week. Nobody's keeping score — but we noticed the empty chair.
        </p>
        <div style="margin:24px 0;padding:16px;border:1px solid rgba(248,81,73,0.2);border-radius:6px;background:rgba(248,81,73,0.04);">
          <p style="color:#f85149;font-size:13px;font-weight:bold;margin-bottom:8px;">DON'T MISS TWO IN A ROW.</p>
          <p style="color:rgba(232,224,208,0.5);font-size:13px;line-height:1.7;">
            The weight you carry alone is the weight that breaks you. Next Saturday — 5:30 AM.
            If something's wrong, reply to this email. A brother will reach out.
          </p>
        </div>
        <p style="color:rgba(232,224,208,0.4);font-size:12px;line-height:1.7;margin-top:20px;">
          No judgment. No guilt. Just presence.<br/>
          We hold your seat.
        </p>
        <p style="color:rgba(176,142,80,0.2);font-size:10px;text-align:center;margin-top:32px;letter-spacing:2px;">
          XI · MĀKOA ORDER · THE WEIGHT ROOM
        </p>
      </div>
    `,
  }),

  // Weight Room — missed 2 sessions (escalation — a brother shows up)
  weight_room_miss2: (data) => ({
    subject: "Two weeks. We're coming to you.",
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:40px 24px;font-family:'Georgia',serif;max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;border-radius:50%;border:1.5px solid #f85149;margin:0 auto 16px;"></div>
          <p style="color:#f85149;font-size:12px;letter-spacing:4px;">INTERVAL CHECK</p>
        </div>
        <p style="color:#e8e0d0;font-size:18px;font-style:italic;text-align:center;margin-bottom:24px;">
          ${data.name || "Brother"} — two weeks.
        </p>
        <p style="color:rgba(232,224,208,0.6);font-size:14px;line-height:1.8;margin-bottom:16px;">
          You've missed two Weight Rooms in a row. That's the line.
          A brother from your circle is going to reach out — not to lecture,
          not to guilt. Just to check in. Face to face if possible.
        </p>
        <div style="margin:24px 0;padding:16px;border:1px solid rgba(248,81,73,0.25);border-radius:6px;background:rgba(248,81,73,0.06);">
          <p style="color:#f85149;font-size:13px;font-weight:bold;margin-bottom:8px;">THIS IS THE PROMISE WE MADE.</p>
          <p style="color:rgba(232,224,208,0.5);font-size:13px;line-height:1.7;">
            When you pledged, you agreed: if you disappear, we come find you.
            Not because you're in trouble. Because you matter.
          </p>
        </div>
        <p style="color:rgba(232,224,208,0.4);font-size:12px;line-height:1.7;margin-top:20px;">
          ${data.circle_lead || "Your circle lead"} will be in touch within 48 hours.<br/>
          If you need to talk now, reply to this email.
        </p>
        <p style="color:rgba(176,142,80,0.2);font-size:10px;text-align:center;margin-top:32px;letter-spacing:2px;">
          XI · MĀKOA ORDER · NO BROTHER LEFT BEHIND
        </p>
      </div>
    `,
  }),

  // Weekly Weight Room reminder (sent Friday evening)
  weight_room_reminder: (data) => ({
    subject: "Tomorrow morning. The circle holds.",
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:40px 24px;font-family:'Georgia',serif;max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;border-radius:50%;border:1.5px solid #f85149;margin:0 auto 16px;"></div>
          <p style="color:#f85149;font-size:12px;letter-spacing:4px;">THE WEIGHT ROOM</p>
        </div>
        <p style="color:#e8e0d0;font-size:16px;text-align:center;margin-bottom:24px;">
          Tomorrow · Saturday · 5:30 AM
        </p>
        <p style="color:rgba(232,224,208,0.5);font-size:14px;line-height:1.8;text-align:center;">
          The circle holds space for you, ${data.name || "brother"}.<br/>
          Whatever you're carrying — bring it tomorrow.
        </p>
        <p style="color:rgba(176,142,80,0.2);font-size:10px;text-align:center;margin-top:32px;letter-spacing:2px;">
          XI · MĀKOA ORDER · EST. 2026
        </p>
      </div>
    `,
  }),

  // HOLD — gate applicant needs follow-up before acceptance
  gate_hold: (data) => ({
    subject: "XI has a few more questions.",
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:40px 24px;font-family:'Georgia',serif;max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;border-radius:50%;border:1.5px solid #b08e50;margin:0 auto 16px;"></div>
          <p style="color:#b08e50;font-size:12px;letter-spacing:4px;">MĀKOA ORDER</p>
        </div>
        <p style="color:#e8e0d0;font-size:18px;font-style:italic;text-align:center;margin-bottom:24px;">
          ${data.name || "Brother"} — your answers were received.
        </p>
        <p style="color:rgba(232,224,208,0.6);font-size:14px;line-height:1.8;margin-bottom:16px;">
          XI reviewed your 12 questions. Before the gate opens, XI has a few more questions.
          This is not rejection — this is care. The Order doesn't rush. We make sure you're ready,
          and that we're ready for you.
        </p>
        <div style="margin:24px 0;padding:16px;border:1px solid rgba(176,142,80,0.15);border-radius:6px;background:rgba(176,142,80,0.04);">
          <p style="color:#b08e50;font-size:11px;letter-spacing:3px;margin-bottom:8px;">WHAT HAPPENS NEXT</p>
          <p style="color:rgba(232,224,208,0.5);font-size:13px;line-height:1.8;">
            Reply to this email and tell XI what you need.<br/>
            A brother will review your response within 48 hours.<br/>
            Your answers are confidential. Nothing leaves this exchange.
          </p>
        </div>
        <p style="color:rgba(232,224,208,0.4);font-size:12px;line-height:1.7;margin-top:20px;">
          The gate is not closed. It is waiting for you.
        </p>
        <p style="color:rgba(176,142,80,0.2);font-size:10px;text-align:center;margin-top:32px;letter-spacing:2px;">
          XI · MĀKOA ORDER · UNDER THE MALU
        </p>
      </div>
    `,
  }),

  // CRISIS — immediate resources + Steward alert
  gate_crisis: (data) => ({
    subject: "You are not alone. Resources inside.",
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:40px 24px;font-family:'Georgia',serif;max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;border-radius:50%;border:1.5px solid #f85149;margin:0 auto 16px;"></div>
          <p style="color:#f85149;font-size:12px;letter-spacing:4px;">MĀKOA ORDER</p>
        </div>
        <p style="color:#e8e0d0;font-size:18px;font-style:italic;text-align:center;margin-bottom:24px;">
          ${data.name || "Brother"} — you are not alone.
        </p>
        <p style="color:rgba(232,224,208,0.6);font-size:14px;line-height:1.8;margin-bottom:16px;">
          XI read your answers. What you shared takes courage. Before anything else,
          we want to make sure you have the right support — right now.
        </p>
        <div style="margin:24px 0;padding:20px;border:1px solid rgba(248,81,73,0.25);border-radius:8px;background:rgba(248,81,73,0.06);">
          <p style="color:#f85149;font-size:13px;font-weight:bold;margin-bottom:12px;">IF YOU NEED HELP RIGHT NOW:</p>
          <p style="color:rgba(232,224,208,0.7);font-size:14px;line-height:2.2;">
            <strong style="color:#fff;">988 Suicide & Crisis Lifeline</strong> — Call or text <strong>988</strong><br/>
            <strong style="color:#fff;">Crisis Text Line</strong> — Text <strong>HOME</strong> to <strong>741741</strong><br/>
            <strong style="color:#fff;">SAMHSA Helpline</strong> — <strong>1-800-662-4357</strong> (free, 24/7)<br/>
            <strong style="color:#fff;">Veterans Crisis Line</strong> — Call 988, press <strong>1</strong><br/>
            <strong style="color:#fff;">Hawaii CARES</strong> — <strong>1-800-753-6879</strong><br/>
            <strong style="color:#fff;">Aloha United Way</strong> — Dial <strong>211</strong>
          </p>
        </div>
        <p style="color:rgba(232,224,208,0.5);font-size:13px;line-height:1.8;margin-top:16px;">
          The brotherhood exists for moments like this. A Crisis Steward will reach out
          within 24 hours — not to fix, not to lecture. Just to check in.
        </p>
        <p style="color:rgba(232,224,208,0.4);font-size:12px;line-height:1.7;margin-top:16px;font-style:italic;">
          Mākoa Order is a peer-support brotherhood, not a clinical or crisis service.
          If you are in immediate danger, please call 911 or 988.
        </p>
        <p style="color:rgba(176,142,80,0.2);font-size:10px;text-align:center;margin-top:32px;letter-spacing:2px;">
          XI · MĀKOA ORDER · NO BROTHER LEFT BEHIND
        </p>
      </div>
    `,
  }),

  // WELCOME DRIP — Day 1 (after $9.99 gate entry)
  welcome_day1: (data) => ({
    subject: `Day 1 — Your Formation Begins, ${data.handle || data.name || "Brother"}`,
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:40px 24px;font-family:'Georgia',serif;max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;border-radius:50%;border:1.5px solid #b08e50;margin:0 auto 16px;"></div>
          <p style="color:#b08e50;font-size:12px;letter-spacing:4px;">DAY 1 · FORMATION</p>
        </div>
        <p style="color:#e8e0d0;font-size:18px;font-style:italic;text-align:center;margin-bottom:24px;">
          ${data.name || "Brother"} — welcome to the Order.
        </p>
        <p style="color:rgba(232,224,208,0.6);font-size:14px;line-height:1.8;margin-bottom:20px;">
          Your $9.99 gate entry has been confirmed. You are now inside the brotherhood.
          Here is what happens in your first 7 days:
        </p>
        <div style="margin:16px 0;padding:16px;border:1px solid rgba(176,142,80,0.12);border-radius:6px;">
          <p style="color:rgba(232,224,208,0.5);font-size:13px;line-height:2;">
            <strong style="color:#b08e50;">Day 1 (today):</strong> Read the oath. Let it sit.<br/>
            <strong style="color:#b08e50;">Day 3:</strong> XI sends your first circle invitation.<br/>
            <strong style="color:#b08e50;">Day 7:</strong> Your founding dues decision — $497/year locked for life.
          </p>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="https://makoa.live/gatherings" style="display:inline-block;padding:12px 28px;border:1px solid rgba(176,142,80,0.4);color:#b08e50;text-decoration:none;font-size:12px;letter-spacing:3px;">SEE THE GATHERINGS</a>
        </div>
        <p style="color:rgba(176,142,80,0.2);font-size:10px;text-align:center;margin-top:32px;letter-spacing:2px;">
          XI · MĀKOA ORDER · EST. 2026
        </p>
      </div>
    `,
  }),

  // WELCOME DRIP — Day 3
  welcome_day3: (data) => ({
    subject: `Day 3 — The Path Ahead, ${data.handle || data.name || "Brother"}`,
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:40px 24px;font-family:'Georgia',serif;max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;border-radius:50%;border:1.5px solid #3fb950;margin:0 auto 16px;"></div>
          <p style="color:#3fb950;font-size:12px;letter-spacing:4px;">DAY 3 · FIRST CIRCLE</p>
        </div>
        <p style="color:#e8e0d0;font-size:16px;text-align:center;margin-bottom:24px;">
          ${data.name || "Brother"} — checking in.
        </p>
        <p style="color:rgba(232,224,208,0.6);font-size:14px;line-height:1.8;margin-bottom:16px;">
          Three days inside the Order. You walked through the gate when most men
          scroll past. That says something about you. The path ahead is 90 days
          of formation, a circle of brothers who hold each other accountable,
          and MAYDAY 2026 — the founding summit in Kapolei, Hawai'i.
        </p>
        <div style="margin:20px 0;padding:16px;border:1px solid rgba(63,185,80,0.15);border-radius:6px;background:rgba(63,185,80,0.04);">
          <p style="color:#3fb950;font-size:11px;letter-spacing:3px;margin-bottom:8px;">YOUR NEXT MOVE</p>
          <p style="color:rgba(232,224,208,0.5);font-size:13px;line-height:1.8;">
            Join the Telegram group. This is where the brotherhood lives between
            gatherings — daily check-ins, accountability, and real talk.
          </p>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="https://t.me/+makoaorder" style="display:inline-block;padding:12px 28px;border:1px solid rgba(63,185,80,0.4);color:#3fb950;text-decoration:none;font-size:12px;letter-spacing:3px;">JOIN TELEGRAM</a>
        </div>
        <p style="color:rgba(176,142,80,0.2);font-size:10px;text-align:center;margin-top:32px;letter-spacing:2px;">
          XI · MĀKOA ORDER · THE WEIGHT ROOM
        </p>
      </div>
    `,
  }),

  // WELCOME DRIP — Day 7 (dues decision)
  welcome_day7: (data) => ({
    subject: `Day 7 — Warriors Don't Wait, ${data.handle || data.name || "Brother"}`,
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:40px 24px;font-family:'Georgia',serif;max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;border-radius:50%;border:1.5px solid #b08e50;margin:0 auto 16px;"></div>
          <p style="color:#b08e50;font-size:12px;letter-spacing:4px;">DAY 7 · THE COMMITMENT</p>
        </div>
        <p style="color:#e8e0d0;font-size:18px;font-style:italic;text-align:center;margin-bottom:24px;">
          ${data.name || "Brother"} — warriors don't wait.
        </p>
        <p style="color:rgba(232,224,208,0.6);font-size:14px;line-height:1.8;margin-bottom:16px;">
          Seven days inside the Order. Seats at MAYDAY 2026 are filling.
          The founding class is capped at 100 brothers — once it closes,
          the gate locks and the founding rate disappears. This is not a
          sales pitch. This is a countdown.
        </p>
        <div style="margin:20px 0;padding:20px;border:1px solid rgba(176,142,80,0.2);border-radius:8px;background:rgba(176,142,80,0.04);text-align:center;">
          <p style="color:#b08e50;font-size:24px;font-weight:bold;margin-bottom:4px;">$497/year</p>
          <p style="color:rgba(232,224,208,0.5);font-size:13px;margin-bottom:12px;">Founding rate — locked for life.<br/>Standard rate after founding: $997/year.</p>
          <p style="color:rgba(232,224,208,0.4);font-size:12px;">25% down today: $124.25 · then $31.06/mo</p>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="https://makoa.live/accepted" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#b08e50,#8a6d3b);color:#000;font-weight:bold;text-decoration:none;font-size:12px;letter-spacing:3px;border-radius:6px;">LOCK MY FOUNDING RATE</a>
        </div>
        <p style="color:rgba(176,142,80,0.2);font-size:10px;text-align:center;margin-top:32px;letter-spacing:2px;">
          XI · MĀKOA ORDER · EST. 2026
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

  // Gary Vee / VIP speaker invite — MAYDAY Co-Founders Weekend
  speaker_invite_vip: (data) => ({
    subject: "An invite — not a pitch.",
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:48px 32px;font-family:'Georgia',serif;max-width:560px;margin:0 auto;">
        <p style="color:#b08e50;font-size:11px;letter-spacing:4px;margin-bottom:32px;">MĀKOA ORDER · PRIVATE CORRESPONDENCE</p>

        <p style="color:#e8e0d0;font-size:17px;line-height:1.9;margin-bottom:20px;">
          ${data.first_name || "Gary"} —
        </p>

        <p style="color:rgba(232,224,208,0.7);font-size:15px;line-height:1.9;margin-bottom:20px;">
          I'm not sending this to a team. I'm not pitching a sponsorship.
          I'm writing directly because what we're building in Hawaii is the thing
          you've been describing for years — and I think you should see it in person.
        </p>

        <p style="color:rgba(232,224,208,0.7);font-size:15px;line-height:1.9;margin-bottom:20px;">
          Mākoa is a brotherhood. Not a brand. Not a podcast. A physical order of men
          organized around territory, trade routes, and a law of the house.
          80% of every job goes to the brother who did the work.
          10% to the house. 10% to the order.
          No middleman. No corporate. Men on routes.
        </p>

        <p style="color:rgba(232,224,208,0.7);font-size:15px;line-height:1.9;margin-bottom:20px;">
          This May — the entire month — we're running MAYDAY:
          4 weekends, 4 Wednesday 4AM global calls, 2 co-founder dinners,
          and the Co-Founders Founding on May 31 — the Blue Moon.
          Team leaders from around the world. War room mastermind.
          72-hour elite reset. West Oahu.
        </p>

        <p style="color:rgba(232,224,208,0.7);font-size:15px;line-height:1.9;margin-bottom:20px;">
          I'm inviting you as a Co-Founding witness — not a keynote speaker,
          not a paid appearance. A seat at the table with the men who are building
          this thing from the ground up in Hawaii.
          No camera crew required. No agenda handed to you.
          Just a room full of men making a decision about the next 100 years.
        </p>

        <div style="border-left:2px solid #b08e50;padding-left:20px;margin:28px 0;">
          <p style="color:#b08e50;font-size:13px;line-height:1.8;margin:0;">
            May 29–31 · West Oahu, Hawaiʻi<br/>
            Co-Founders Founding · Blue Moon · May 31<br/>
            Full weekend covered · 2-person travel + accommodation<br/>
            No public announcement without your approval
          </p>
        </div>

        <p style="color:rgba(232,224,208,0.7);font-size:15px;line-height:1.9;margin-bottom:20px;">
          If this is something you want to witness, reply here.
          If it's not — no follow-up, no pitch deck, no newsletter.
          I respect your time more than that.
        </p>

        <p style="color:rgba(232,224,208,0.7);font-size:15px;line-height:1.9;margin-bottom:32px;">
          One brotherhood. One founding. One Blue Moon.
        </p>

        <p style="color:#e8e0d0;font-size:15px;margin-bottom:4px;">${data.sender_name || "Kris"}</p>
        <p style="color:rgba(232,224,208,0.35);font-size:12px;margin-bottom:4px;">Mana Steward 0001 · Mākoa Order · West Oahu</p>
        <p style="color:rgba(232,224,208,0.25);font-size:12px;">${data.sender_email || "steward@makoa.live"} · makoa.live/founding48</p>

        <p style="color:rgba(176,142,80,0.15);font-size:10px;text-align:center;margin-top:48px;letter-spacing:2px;">
          XI · MĀKOA ORDER · EST. 2026 · PRIVATE
        </p>
      </div>
    `,
  }),

  // Makoa House application confirmation — sent to anyone who applies to open a house
  house_application_confirm: (data) => ({
    subject: "Your house application is in.",
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:40px 24px;font-family:'Georgia',serif;max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;border-radius:50%;border:1.5px solid #b08e50;margin:0 auto 16px;"></div>
          <p style="color:#b08e50;font-size:11px;letter-spacing:4px;">MĀKOA ORDER · HOUSE CHARTERS</p>
        </div>
        <p style="color:#e8e0d0;font-size:17px;font-style:italic;text-align:center;margin-bottom:24px;">
          ${data.name || "Brother"} — your application is in.
        </p>
        <p style="color:rgba(232,224,208,0.6);font-size:14px;line-height:1.8;margin-bottom:16px;">
          We received your application to open a Makoa House in ${data.location || "your territory"}.
          XI will review and respond within 5 days.
        </p>
        <p style="color:rgba(232,224,208,0.5);font-size:13px;line-height:1.8;margin-bottom:16px;">
          What happens next:<br/>
          — XI reviews your zip cluster for open territory<br/>
          — A Mana Steward will reach out to verify your standing<br/>
          — If approved, you'll receive your 90-day live-in start date<br/>
          — Day 90: elevation vote. Aliʻi class. Stone sealed.
        </p>
        <p style="color:rgba(232,224,208,0.4);font-size:13px;line-height:1.8;margin-bottom:24px;">
          MAYDAY is the founding moment. If your application is approved before May 31,
          your charter date will be sealed on the Blue Moon — alongside every other
          founding house worldwide.
        </p>
        <div style="text-align:center;margin-top:32px;">
          <a href="https://makoa.live/houses" style="display:inline-block;padding:12px 28px;border:1px solid rgba(176,142,80,0.4);color:#b08e50;text-decoration:none;font-size:11px;letter-spacing:3px;">VIEW THE CHARTER SYSTEM</a>
        </div>
        <p style="color:rgba(176,142,80,0.15);font-size:10px;text-align:center;margin-top:32px;letter-spacing:2px;">
          XI · MĀKOA ORDER · EST. 2026
        </p>
      </div>
    `,
  }),

  // 90-day live-in milestone — sent at Day 30, 60, and 90
  live_in_milestone: (data) => ({
    subject: `Day ${data.day || "30"} — the house holds.`,
    html: `
      <div style="background:#04060a;color:#e8e0d0;padding:40px 24px;font-family:'Georgia',serif;max-width:480px;margin:0 auto;">
        <p style="color:#b08e50;font-size:11px;letter-spacing:4px;text-align:center;margin-bottom:32px;">MĀKOA ORDER · LIVE-IN TRACKING</p>
        <p style="color:#e8e0d0;font-size:28px;font-style:italic;text-align:center;margin-bottom:8px;">Day ${data.day || "30"}.</p>
        <p style="color:rgba(232,224,208,0.4);font-size:12px;text-align:center;letter-spacing:2px;margin-bottom:32px;">
          ${data.days_remaining || "60"} DAYS TO ELEVATION
        </p>
        <p style="color:rgba(232,224,208,0.6);font-size:14px;line-height:1.8;margin-bottom:16px;">
          ${data.name || "Brother"} — you're holding the house. That's not nothing.
          Most men talk about brotherhood. You're living it.
        </p>
        <p style="color:rgba(232,224,208,0.5);font-size:13px;line-height:1.8;margin-bottom:24px;">
          What XI sees so far:<br/>
          — Trade Academy sessions hosted: ${data.academy_sessions || "0"}<br/>
          — Wednesday 4AM calls attended: ${data.wed_sessions || "0"}<br/>
          — Jobs dispatched from the house: ${data.jobs || "0"}<br/>
          — War Room sessions: ${data.war_room || "0"}
        </p>
        <p style="color:rgba(176,142,80,0.5);font-size:13px;font-style:italic;text-align:center;margin-bottom:24px;">
          "The stone is being carved. Finish what you started."
        </p>
        <p style="color:rgba(176,142,80,0.15);font-size:10px;text-align:center;margin-top:32px;letter-spacing:2px;">
          XI · MĀKOA ORDER · EST. 2026
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
