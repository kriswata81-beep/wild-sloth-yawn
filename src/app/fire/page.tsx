"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.55)";
const GOLD_FAINT = "rgba(176,142,80,0.07)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_40 = "rgba(176,142,80,0.4)";
const BG = "#04060a";

export default function FirePage() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => { setTimeout(() => setReady(true), 300); }, []);

  const moments = [
    {
      time: "Friday · 5:00 PM",
      title: "You Arrive",
      icon: "🚗",
      body: "You pull up to the location in West Oahu. You don't know most of the men here. That's the point. You check in. You get your class assignment — Aliʻi, Mana, or Nā Koa. You find your seat. The War Room opens at 6.",
      reveal: "No phones after check-in. You're here now.",
    },
    {
      time: "Friday · 6:00 PM",
      title: "War Room Roll Call",
      icon: "⚔",
      body: "All classes seated together for the first time. XI opens the session. The Steward speaks the mission. You hear why this order exists — not the pitch, the real reason. Then the first circle opens. No performance. Just truth.",
      reveal: "The first man who speaks honestly changes the room.",
    },
    {
      time: "Saturday · 4:00 AM",
      title: "The Ice Bath",
      icon: "🧊",
      body: "You wake up before the sun. You walk to the water. The ice bath is not a challenge — it's a ritual. You get in. The cold hits. Your mind goes quiet. For the first time in months, maybe years, there is nothing to think about except this moment. The brothers around you are in the same water.",
      reveal: "You will remember this for the rest of your life.",
    },
    {
      time: "Saturday · 6:00 AM",
      title: "Sunrise Formation",
      icon: "🌅",
      body: "After the bath, you run. Not a race — a formation. Every man moving together. The Ko'olau range behind you. The sun coming up over the water. This is what the order looks like in motion.",
      reveal: "Brotherhood is not a feeling. It's a formation.",
    },
    {
      time: "Saturday · 9:00 AM",
      title: "The Mastermind",
      icon: "🧠",
      body: "Mana class breaks into trade academies. Aliʻi class enters the Network 2 Network session — room to room, deal flow, B2B introductions. Nā Koa class runs the Peer 2 Peer skills exchange. Every man is in the room he belongs in.",
      reveal: "This is where the order starts making money together.",
    },
    {
      time: "Saturday · 2:00 PM",
      title: "The Founders Summit",
      icon: "🔥",
      body: "All three classes at one table. This has never happened before — Aliʻi, Mana, and Nā Koa in the same room, building the same thing. The order's first year is planned here. Routes assigned. Territories mapped. Houses designated. The blueprint becomes real.",
      reveal: "You are not attending an event. You are founding an order.",
    },
    {
      time: "Sunday · 4:00 AM",
      title: "Second Ice Bath",
      icon: "🧊",
      body: "You get back in. This time it's different. You know the men around you now. You've heard their truth. You've built something with them. The cold is the same. You are not.",
      reveal: "The second bath is always easier. That's the point.",
    },
    {
      time: "Sunday · 7:00 AM",
      title: "The Oath",
      icon: "🔱",
      body: `Every brother. Same door. Same oath. Same fire.\n\n"I stand with the order.\nI carry my brother's weight as my own.\nI show up at 4am when no one is watching.\nI serve before I lead.\nI build what will outlast me.\nUnder the Malu — I am Makoa."\n\nSpoken together. Out loud. Once.`,
      reveal: "The oath is not a ceremony. It's a commitment.",
      isOath: true,
    },
    {
      time: "Sunday · 9:00 AM",
      title: "The Founding Fire",
      icon: "🌅",
      body: "The fire is lit. The order is born. Every man who stood in that circle is now a founding brother. Not a member — a founder. The difference matters. Founders build. Members attend. You are a founder.",
      reveal: "This is the moment the order becomes real.",
    },
    {
      time: "Sunday · 12:00 PM",
      title: "You Leave Different",
      icon: "🚗",
      body: "You drive home. You have a rank. You have a route assignment. You have brothers who know your name and your truth. You have a 808 channel that's already active. The founding fire is behind you. The order is ahead.",
      reveal: "The event ends. The brotherhood doesn't.",
    },
  ];

  const faqs = [
    {
      q: "What if I can't make it after I register?",
      a: "Life happens. Contact us at wakachief@gmail.com within 7 days of the event and we'll work with you — credit toward the next gathering or a partial refund depending on timing. We don't trap men.",
    },
    {
      q: "Do I need to be in shape?",
      a: "The ice bath and formation run are not athletic events. They are mental events. Men of all fitness levels complete them. What matters is that you show up and get in.",
    },
    {
      q: "What do I bring?",
      a: "Swim shorts for the ice bath. Workout clothes for the formation run. One change of clothes. A notebook. No phone after check-in. Everything else is provided.",
    },
    {
      q: "Is this religious?",
      a: "No. The order draws from Hawaiian cultural values — Malu (protection), Hana (work), Pale (defense), Ola (life). It is not affiliated with any religion. Men of all backgrounds are welcome.",
    },
    {
      q: "What is the oath committing me to?",
      a: "The oath commits you to showing up — to your brothers, to the weekly trainings, to the order's mission. It is not a legal contract. It is a man's word. In this order, that's worth more.",
    },
    {
      q: "What happens after the event?",
      a: "You receive your rank stone, your 808 channel access, your route assignment (Mana/Nā Koa), and your founding ambassador designation. The weekly 4am trainings begin the following Wednesday. The order is live.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes coronaPulse { 0%,100%{opacity:0.7;transform:scale(1);}50%{opacity:1;transform:scale(1.04);} }
      `}</style>

      {/* Hero */}
      <div style={{
        textAlign: "center", padding: "56px 24px 40px",
        borderBottom: `1px solid ${GOLD_20}`,
        opacity: ready ? 1 : 0, transition: "opacity 0.8s ease",
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: "50%",
          border: `1.5px solid ${GOLD}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          animation: "coronaPulse 3s ease-in-out infinite",
          background: GOLD_FAINT,
        }}>
          <span style={{ color: GOLD, fontSize: "1.5rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>🔥</span>
        </div>

        <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.3em", marginBottom: 12 }}>
          MĀKOA ORDER · WEST OAHUʻ · MAY 1–3
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          fontSize: "2.4rem", color: GOLD, margin: "0 0 14px", fontWeight: 300, lineHeight: 1.15,
        }}>
          What the Founding Fire<br />Actually Is
        </h1>
        <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.46rem", lineHeight: 1.8, maxWidth: 460, margin: "0 auto 24px" }}>
          Not a retreat. Not a seminar. Not a men's group.<br />
          A 48-hour founding event where an order of men is born.<br />
          Here is exactly what happens — without giving away the mystery.
        </p>

        {/* Urgency */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(224,92,92,0.07)", border: "1px solid rgba(224,92,92,0.25)",
          borderRadius: 20, padding: "7px 16px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e05c5c", animation: "coronaPulse 1.2s ease-in-out infinite" }} />
          <p style={{ color: "#e05c5c", fontSize: "0.36rem", letterSpacing: "0.16em" }}>
            GATE CLOSES APRIL 25 · 20 SEATS REMAINING
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "36px 20px" }}>

        {/* Timeline */}
        <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.25em", marginBottom: 20 }}>
          THE 48-HOUR TIMELINE
        </p>

        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: 20, top: 0, bottom: 0,
            width: 1, background: `linear-gradient(to bottom, ${GOLD_40}, transparent)`,
          }} />

          {moments.map((m, i) => (
            <div
              key={i}
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                display: "flex", gap: 16, marginBottom: 16,
                cursor: "pointer",
                opacity: ready ? 1 : 0,
                transition: `opacity 0.5s ease ${i * 0.06}s`,
              }}
            >
              {/* Icon node */}
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: open === i ? GOLD_20 : GOLD_FAINT,
                border: `1px solid ${open === i ? GOLD : GOLD_20}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", transition: "all 0.2s", zIndex: 1,
              }}>
                {m.icon}
              </div>

              {/* Content */}
              <div style={{
                flex: 1, background: open === i ? GOLD_FAINT : "transparent",
                border: `1px solid ${open === i ? GOLD_20 : "transparent"}`,
                borderRadius: 10, padding: open === i ? "14px 16px" : "10px 0",
                transition: "all 0.25s",
              }}>
                <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.14em", marginBottom: 3 }}>{m.time}</p>
                <p style={{ color: open === i ? GOLD : "rgba(232,224,208,0.75)", fontSize: "0.48rem", marginBottom: open === i ? 10 : 0, transition: "color 0.2s" }}>
                  {m.title}
                </p>

                {open === i && (
                  <div>
                    <p style={{
                      color: "rgba(232,224,208,0.6)", fontSize: "0.44rem", lineHeight: 1.8,
                      marginBottom: 12, whiteSpace: m.isOath ? "pre-line" : undefined,
                      fontFamily: m.isOath ? "'Cormorant Garamond', serif" : undefined,
                      fontStyle: m.isOath ? "italic" : undefined,
                    }}>
                      {m.body}
                    </p>
                    <div style={{
                      borderLeft: `2px solid ${GOLD_40}`, paddingLeft: 12,
                      background: "rgba(176,142,80,0.04)", borderRadius: "0 6px 6px 0", padding: "8px 12px",
                    }}>
                      <p style={{ color: GOLD, fontSize: "0.4rem", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>
                        "{m.reveal}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Founding Brothers social proof */}
        <div style={{
          background: GOLD_FAINT, border: `1px solid ${GOLD_20}`,
          borderRadius: 12, padding: "20px", marginTop: 32, marginBottom: 32,
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.22em", marginBottom: 14 }}>
            FOUNDING BROTHERS · FORMING NOW
          </p>
          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem", lineHeight: 1.7, marginBottom: 16 }}>
            Real men from West Oahu and Hawaii who have already stepped through the gate:
          </p>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { name: "Miles", region: "West Oahu", class: "Mana", color: "#58a6ff" },
              { name: "Brother K.", region: "Kapolei", class: "Nā Koa", color: "#3fb950" },
              { name: "Brother T.", region: "Ewa Beach", class: "Nā Koa", color: "#3fb950" },
              { name: "You?", region: "West Oahu", class: "Your seat is open", color: GOLD },
            ].map((b, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px",
                background: i === 3 ? "rgba(176,142,80,0.06)" : "rgba(0,0,0,0.2)",
                border: `1px solid ${i === 3 ? GOLD_20 : "rgba(255,255,255,0.04)"}`,
                borderRadius: 8,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: `${b.color}20`, border: `1px solid ${b.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ color: b.color, fontSize: "0.7rem" }}>{i === 3 ? "?" : b.name[0]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: i === 3 ? GOLD : "rgba(232,224,208,0.7)", fontSize: "0.42rem" }}>{b.name}</p>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem" }}>{b.region}</p>
                </div>
                <div style={{
                  background: `${b.color}15`, border: `1px solid ${b.color}30`,
                  borderRadius: 4, padding: "3px 8px",
                }}>
                  <p style={{ color: b.color, fontSize: "0.32rem", letterSpacing: "0.1em" }}>{b.class}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.36rem", marginTop: 12, textAlign: "center" }}>
            Names shown with permission · Some anonymized by request
          </p>
        </div>

        {/* FAQ */}
        <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.25em", marginBottom: 16 }}>
          QUESTIONS MEN ACTUALLY ASK
        </p>
        <div style={{ display: "grid", gap: 8, marginBottom: 32 }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              onClick={() => setOpen(open === 100 + i ? null : 100 + i)}
              style={{
                background: open === 100 + i ? GOLD_FAINT : "rgba(0,0,0,0.2)",
                border: `1px solid ${open === 100 + i ? GOLD_20 : "rgba(255,255,255,0.04)"}`,
                borderRadius: 8, padding: "12px 14px", cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <p style={{ color: "rgba(232,224,208,0.75)", fontSize: "0.42rem", lineHeight: 1.5 }}>{faq.q}</p>
                <span style={{ color: GOLD_DIM, fontSize: "0.6rem", flexShrink: 0 }}>{open === 100 + i ? "−" : "+"}</span>
              </div>
              {open === 100 + i && (
                <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.42rem", lineHeight: 1.8, marginTop: 10 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div style={{
          textAlign: "center", padding: "28px 20px",
          background: GOLD_FAINT, border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            color: GOLD, fontSize: "1.3rem", lineHeight: 1.4, marginBottom: 16,
          }}>
            "The founding fire happens once.<br />You either stood in it — or you didn't."
          </p>
          <a href="/gate" style={{
            display: "block", background: GOLD, color: BG,
            borderRadius: 8, padding: "14px 0", textDecoration: "none",
            fontSize: "0.42rem", fontWeight: 700, letterSpacing: "0.18em",
            fontFamily: "'JetBrains Mono', monospace", marginBottom: 10,
          }}>
            ENTER THE GATE → MAKOA.LIVE
          </a>
          <a href="/sponsor" style={{
            display: "block", color: GOLD_DIM, fontSize: "0.38rem",
            textDecoration: "none", letterSpacing: "0.12em", padding: "8px",
          }}>
            or sponsor a brother →
          </a>
          <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.34rem", marginTop: 12, letterSpacing: "0.15em" }}>
            GATE CLOSES APRIL 25 · 20 SEATS · WEST OAHU · MAY 1–3
          </p>
        </div>
      </div>
    </div>
  );
}
