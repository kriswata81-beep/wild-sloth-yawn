"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.55)";
const GOLD_FAINT = "rgba(176,142,80,0.06)";
const RED = "#e05c5c";
const RED_DIM = "rgba(224,92,92,0.08)";
const RED_BORDER = "rgba(224,92,92,0.3)";
const BG = "#04060a";
const TEXT = "#e8e0d0";
const TEXT_DIM = "rgba(232,224,208,0.5)";

const GIFT_OPTIONS = [
  {
    id: "daypass",
    title: "Day Pass",
    subtitle: "NĀ KOA · 12HR",
    price: "$97",
    seats: "10 Nā Koa seats",
    description: "One day that changes everything.",
    detail: "He arrives Saturday morning. 4am ice bath. Brotherhood circle. The Nā Koa Academy. He leaves a different man. One day is enough to know if he belongs.",
    what: ["4am ice bath — Saturday morning", "Brotherhood circle — no performance, just truth", "Nā Koa Academy — trade skills + formation", "Founding fire — Sunday oath ceremony"],
    priceId: "price_1TN55d6JgsMzYUQR8GfoWcoQ",
    color: "#3fb950",
    badge: "12HR",
  },
  {
    id: "mastermind",
    title: "Mastermind",
    subtitle: "MANA · 24HR",
    price: "$197",
    seats: "6 Mana seats",
    description: "Deep work. Real brotherhood.",
    detail: "Friday night through Saturday. The full Mana experience — ice bath, brotherhood circle, trade academy, mastermind session, bonfire. He goes deep and comes back with brothers and a plan.",
    what: ["4am ice bath — both mornings", "Mana Mastermind — build together", "Trade academy — skills + B2B network", "Brotherhood circle — truth without performance", "Founding fire + oath — Sunday"],
    priceId: "price_1TN55e6JgsMzYUQRB6ISb8pc",
    color: "#58a6ff",
    badge: "24HR",
  },
  {
    id: "warroom",
    title: "War Room",
    subtitle: "ALIʻI · 48HR",
    price: "$397",
    seats: "4 Aliʻi seats",
    description: "The full founding experience.",
    detail: "Friday through Sunday. The complete Aliʻi experience — War Room council, Network 2 Network, ice bath both mornings, the fire ceremony, the oath. He comes back a founding brother with a seat at the council.",
    what: ["War Room council — Friday night", "Network 2 Network — room to room, B2B", "4am ice bath — both mornings", "Founders Summit — all classes, one table", "Founding fire + oath — the order is born", "Aliʻi council seat — 1% founding equity"],
    priceId: "price_1TN55f6JgsMzYUQRLFSk07DF",
    color: GOLD,
    badge: "48HR",
  },
];

// Scarcity: seats remaining per tier
const SEATS = [
  { label: "ALIʻI WAR ROOM", remaining: 4, total: 12, color: GOLD },
  { label: "MANA MASTERMIND", remaining: 6, total: 24, color: "#58a6ff" },
  { label: "NĀ KOA DAY PASS", remaining: 10, total: 12, color: "#3fb950" },
];

function SeatBar({ remaining, total, color }: { remaining: number; total: number; color: string }) {
  const pct = ((total - remaining) / total) * 100;
  return (
    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 1s ease" }} />
    </div>
  );
}

export default function SponsorPage() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<string | null>("warroom");
  const [loading, setLoading] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorEmail, setSponsorEmail] = useState("");
  const [brotherName, setBrotherName] = useState("");
  const [brotherEmail, setBrotherEmail] = useState("");
  const [message, setMessage] = useState("");
  const [daysLeft, setDaysLeft] = useState(9);

  useEffect(() => {
    setVisible(true);
    const gate = new Date("2026-04-25T23:59:59-10:00").getTime();
    const diff = gate - Date.now();
    setDaysLeft(Math.max(0, Math.ceil(diff / 86400000)));
  }, []);

  const handleSubmit = async (priceId: string) => {
    if (!sponsorName || !sponsorEmail || !brotherName || !brotherEmail) return;
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          customerEmail: sponsorEmail,
          metadata: {
            type: "sponsor",
            sponsorName: anonymous ? "Anonymous" : sponsorName,
            sponsorEmail,
            brotherName,
            brotherEmail,
            message: message || "",
            anonymous: anonymous ? "true" : "false",
          },
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px",
    background: "rgba(176,142,80,0.05)", border: `1px solid ${GOLD_20}`,
    borderRadius: 8, color: TEXT,
    fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem",
    outline: "none", boxSizing: "border-box", letterSpacing: "0.03em",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.38rem", letterSpacing: "0.2em",
    color: GOLD_DIM, marginBottom: 6,
    fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase",
  };

  const formReady = sponsorName && sponsorEmail && brotherName && brotherEmail;

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'JetBrains Mono', monospace", opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.35;} }
        @keyframes shimmer { 0%{opacity:0.7;}50%{opacity:1;}100%{opacity:0.7;} }
        input::placeholder, textarea::placeholder { color: rgba(176,142,80,0.2); }
        .gift-card { transition: border-color 0.25s, transform 0.2s; }
        .gift-card:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── URGENCY STRIP ── */}
      <div style={{
        background: RED_DIM, borderBottom: `1px solid ${RED_BORDER}`,
        padding: "10px 20px", textAlign: "center",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED, animation: "pulse 1s ease-in-out infinite", flexShrink: 0 }} />
        <p style={{ color: RED, fontSize: "0.38rem", letterSpacing: "0.16em" }}>
          {daysLeft} DAYS LEFT · GATE CLOSES APRIL 25 · HOTEL ROOMS HELD UNTIL APRIL 20 · ONLY 20 SEATS TOTAL
        </p>
      </div>

      {/* ── HERO ── */}
      <div style={{ textAlign: "center", padding: "56px 24px 40px", borderBottom: `1px solid ${GOLD_10}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

        {/* Campaign badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: GOLD_FAINT, border: `1px solid ${GOLD_20}`,
          borderRadius: 20, padding: "6px 16px", marginBottom: 20,
        }}>
          <span style={{ fontSize: "0.7rem" }}>💛</span>
          <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.2em" }}>
            "SOMEONE BELIEVES IN YOU" CAMPAIGN
          </p>
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          fontSize: "clamp(2.4rem, 8vw, 3.6rem)", color: GOLD,
          fontWeight: 300, margin: "0 0 8px", lineHeight: 1.1,
        }}>
          He won't ask for help.
        </h1>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          fontSize: "clamp(1.4rem, 5vw, 2rem)", color: "rgba(232,224,208,0.6)",
          fontWeight: 300, margin: "0 0 24px", lineHeight: 1.2,
        }}>
          You can give it to him.
        </h2>

        {/* The message preview */}
        <div style={{
          maxWidth: 400, margin: "0 auto 24px",
          background: GOLD_FAINT, border: `1px solid ${GOLD_20}`,
          borderRadius: 12, padding: "20px 24px",
          animation: "shimmer 3s ease-in-out infinite",
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.32rem", letterSpacing: "0.2em", marginBottom: 10 }}>
            THE MESSAGE HE RECEIVES
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            color: TEXT, fontSize: "1.1rem", lineHeight: 1.8,
          }}>
            "Someone believes in you.<br />
            <span style={{ color: GOLD }}>You've been sponsored into Mākoa.</span>"
          </p>
          <p style={{ color: TEXT_DIM, fontSize: "0.38rem", marginTop: 10, lineHeight: 1.6 }}>
            He never has to know who — unless you want him to.<br />
            Anonymous or named. You choose.
          </p>
        </div>

        {/* Who this is for */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 8 }}>
          {[
            { label: "Wives", icon: "💍" },
            { label: "Mothers", icon: "🤍" },
            { label: "Girlfriends", icon: "💛" },
            { label: "Brothers", icon: "✊" },
            { label: "Close Friends", icon: "🤝" },
            { label: "Employers", icon: "🏗" },
          ].map(w => (
            <span key={w.label} style={{
              background: GOLD_FAINT, border: `1px solid ${GOLD_20}`,
              borderRadius: 20, padding: "5px 12px",
              color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.08em",
            }}>{w.icon} {w.label}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "36px 20px 0" }}>

        {/* ── WHY THIS WORKS ── */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.25em", marginBottom: 16 }}>WHY THIS WORKS</p>
          <div style={{ borderLeft: `3px solid ${GOLD_20}`, paddingLeft: 18, background: GOLD_FAINT, borderRadius: "0 10px 10px 0", padding: "20px 18px" }}>
            <p style={{ color: TEXT_DIM, fontSize: "0.48rem", lineHeight: 2, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
              "Most men carry it alone. The job, the family, the weight.<br /><br />
              Mākoa is not another retreat or circle. It's a brotherhood that builds real things — labor, knowledge, territory — and holds men accountable at 4am when no one is watching.<br /><br />
              Many of the right men won't self-apply. Not because they don't want it — because pride and inertia get in the way.<br /><br />
              <span style={{ color: GOLD }}>Sponsorship bypasses that. You become the push he needed but would never ask for.</span>"
            </p>
          </div>
        </div>

        {/* ── SCARCITY SEATS ── */}
        <div style={{ marginBottom: 32, background: GOLD_FAINT, border: `1px solid ${GOLD_20}`, borderRadius: 12, padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.22em" }}>SEATS REMAINING</p>
            <p style={{ color: RED, fontSize: "0.36rem", letterSpacing: "0.14em" }}>WHEN THEY'RE GONE — THEY'RE GONE</p>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {SEATS.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p style={{ color: s.color, fontSize: "0.36rem", letterSpacing: "0.12em" }}>{s.label}</p>
                  <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.36rem" }}>
                    <span style={{ color: s.color, fontWeight: 700 }}>{s.remaining}</span> of {s.total} left
                  </p>
                </div>
                <SeatBar remaining={s.remaining} total={s.total} color={s.color} />
              </div>
            ))}
          </div>
          <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.34rem", marginTop: 12, textAlign: "center" }}>
            Hotel rooms held until April 20 · Act before they release
          </p>
        </div>

        {/* ── WHAT HE'S WALKING INTO ── */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.25em", marginBottom: 16 }}>WHAT HE'S WALKING INTO</p>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { icon: "🧊", label: "4AM ICE BATH", desc: "Both mornings. Ko Olina. The cold is the ritual." },
              { icon: "⚔", label: "ELITE TRAINING", desc: "Formation run. Combat fitness. Breathwork." },
              { icon: "🧠", label: "MASTERMIND", desc: "Mana class. Build together. Trade + business." },
              { icon: "🔗", label: "NETWORK 2 NETWORK", desc: "Aliʻi class. Room to room. Real B2B deal flow." },
              { icon: "🏗", label: "B2B · B2C", desc: "Route contracts. Client pipeline. Trade ops." },
              { icon: "🤝", label: "PEER 2 PEER", desc: "Nā Koa class. Skills shared. Brotherhood built." },
              { icon: "🔥", label: "FOUNDERS SUMMIT", desc: "All classes. One table. The order is born." },
              { icon: "🌅", label: "THE OATH", desc: "Sunday sunrise. Spoken together. Once." },
            ].map((p, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px",
                background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: 8,
              }}>
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>{p.icon}</span>
                <div>
                  <p style={{ color: GOLD, fontSize: "0.36rem", letterSpacing: "0.1em", marginBottom: 2 }}>{p.label}</p>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.36rem" }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="/fire" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            marginTop: 12, color: GOLD_DIM, fontSize: "0.38rem",
            textDecoration: "none", letterSpacing: "0.1em",
          }}>
            🔥 Read the full 48-hour breakdown →
          </a>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.25em", marginBottom: 16 }}>HOW IT WORKS</p>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { n: "01", t: "Choose his experience", d: "Day Pass ($97) · Mastermind ($197) · War Room ($397)" },
              { n: "02", t: "Pay securely via Stripe", d: "Anonymous or named — you decide" },
              { n: "03", t: "Enter his contact info", d: "Name + email. Add a personal note if you want." },
              { n: "04", t: "He receives the message", d: '"Someone believes in you. You\'ve been sponsored into Mākoa."' },
              { n: "05", t: "He enters the gate", d: "His application is reviewed by XI. His class is assigned." },
              { n: "06", t: "He shows up May 1–3", d: "West Oahu. The founding fire. He comes back different." },
            ].map((s, i) => (
              <div key={i} style={{
                display: "flex", gap: 14, padding: "10px 14px",
                background: GOLD_FAINT, border: `1px solid ${GOLD_10}`,
                borderRadius: 8,
              }}>
                <p style={{ color: GOLD_DIM, fontSize: "0.9rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", flexShrink: 0, width: 24 }}>{s.n}</p>
                <div>
                  <p style={{ color: "rgba(232,224,208,0.8)", fontSize: "0.42rem", marginBottom: 2 }}>{s.t}</p>
                  <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.38rem" }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RISK REVERSAL ── */}
        <div style={{
          background: "rgba(63,185,80,0.04)", border: "1px solid rgba(63,185,80,0.15)",
          borderRadius: 10, padding: "16px 18px", marginBottom: 32,
        }}>
          <p style={{ color: "#3fb950", fontSize: "0.36rem", letterSpacing: "0.18em", marginBottom: 10 }}>YOUR PEACE OF MIND</p>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              "If he can't make it — contact wakachief@gmail.com within 7 days. We'll work with you.",
              "Transfer option available — his spot can go to another man you choose.",
              "He is never pressured. The gate is an invitation, not a demand.",
              "Anonymous by default — he receives the gift, not the obligation.",
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#3fb950", fontSize: "0.5rem", flexShrink: 0, marginTop: 1 }}>✓</span>
                <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", lineHeight: 1.6 }}>{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── GIFT OPTIONS ── */}
        <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.3em", textAlign: "center", marginBottom: 20 }}>
          CHOOSE HIS EXPERIENCE
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
          {GIFT_OPTIONS.map((opt) => {
            const isExpanded = expanded === opt.id;
            return (
              <div key={opt.id} className="gift-card" style={{
                border: `1px solid ${isExpanded ? opt.color + "60" : GOLD_20}`,
                borderRadius: 12,
                background: isExpanded ? `${opt.color}05` : "transparent",
                overflow: "hidden", transition: "all 0.3s ease",
              }}>
                {/* Header */}
                <button onClick={() => setExpanded(isExpanded ? null : opt.id)} style={{
                  width: "100%", background: "none", border: "none",
                  padding: "18px 20px", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  textAlign: "left", gap: 12,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{
                        background: `${opt.color}15`, border: `1px solid ${opt.color}40`,
                        color: opt.color, fontSize: "0.32rem", letterSpacing: "0.14em",
                        padding: "3px 8px", borderRadius: 3,
                      }}>{opt.badge}</span>
                      <p style={{ color: opt.color, fontSize: "0.34rem", letterSpacing: "0.14em" }}>{opt.subtitle}</p>
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.3rem", color: TEXT, fontWeight: 400, lineHeight: 1, marginBottom: 4 }}>
                      {opt.title}
                    </p>
                    <p style={{ color: TEXT_DIM, fontSize: "0.4rem" }}>{opt.description}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: opt.color, fontWeight: 300, lineHeight: 1, marginBottom: 2 }}>{opt.price}</p>
                    <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.32rem" }}>{opt.seats}</p>
                    <span style={{ color: opt.color, fontSize: "0.7rem" }}>{isExpanded ? "−" : "+"}</span>
                  </div>
                </button>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ padding: "0 20px 24px", animation: "fadeUp 0.3s ease forwards" }}>
                    <div style={{ height: 1, background: `${opt.color}20`, marginBottom: 18 }} />

                    {/* What he gets */}
                    <div style={{ background: `${opt.color}07`, border: `1px solid ${opt.color}20`, borderRadius: 8, padding: "14px", marginBottom: 18 }}>
                      <p style={{ color: opt.color, fontSize: "0.34rem", letterSpacing: "0.14em", marginBottom: 10 }}>WHAT HE GETS</p>
                      <div style={{ display: "grid", gap: 6 }}>
                        {opt.what.map((w, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <span style={{ color: opt.color, fontSize: "0.4rem", flexShrink: 0, opacity: 0.6 }}>→</span>
                            <p style={{ color: TEXT_DIM, fontSize: "0.4rem", lineHeight: 1.5 }}>{w}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Anonymous toggle */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 14px", background: GOLD_FAINT, border: `1px solid ${GOLD_10}`,
                      borderRadius: 8, marginBottom: 18, cursor: "pointer",
                    }} onClick={() => setAnonymous(!anonymous)}>
                      <div>
                        <p style={{ color: TEXT, fontSize: "0.44rem", marginBottom: 2 }}>
                          {anonymous ? "Anonymous gift" : "Reveal your name"}
                        </p>
                        <p style={{ color: TEXT_DIM, fontSize: "0.38rem" }}>
                          {anonymous ? "He won't know who sent this" : "He'll know it came from you"}
                        </p>
                      </div>
                      <div style={{
                        width: 36, height: 20, borderRadius: 10,
                        background: anonymous ? GOLD : "rgba(255,255,255,0.1)",
                        border: `1px solid ${anonymous ? GOLD : "rgba(255,255,255,0.15)"}`,
                        position: "relative", transition: "all 0.2s", flexShrink: 0,
                      }}>
                        <div style={{
                          position: "absolute", top: 2, left: anonymous ? 18 : 2,
                          width: 14, height: 14, borderRadius: "50%",
                          background: anonymous ? "#000" : "rgba(255,255,255,0.4)",
                          transition: "left 0.2s",
                        }} />
                      </div>
                    </div>

                    {/* Form */}
                    <div style={{ display: "grid", gap: 12 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                          <label style={labelStyle}>Your Name</label>
                          <input style={inputStyle} value={sponsorName} onChange={e => setSponsorName(e.target.value)} placeholder="Your name" />
                        </div>
                        <div>
                          <label style={labelStyle}>Your Email</label>
                          <input style={inputStyle} type="email" value={sponsorEmail} onChange={e => setSponsorEmail(e.target.value)} placeholder="you@email.com" />
                        </div>
                      </div>
                      <div style={{ height: 1, background: GOLD_10 }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                          <label style={labelStyle}>His Name</label>
                          <input style={inputStyle} value={brotherName} onChange={e => setBrotherName(e.target.value)} placeholder="His name" />
                        </div>
                        <div>
                          <label style={labelStyle}>His Email</label>
                          <input style={inputStyle} type="email" value={brotherEmail} onChange={e => setBrotherEmail(e.target.value)} placeholder="his@email.com" />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>A word for him (optional)</label>
                        <textarea
                          style={{ ...inputStyle, minHeight: 72, resize: "vertical" as const, lineHeight: 1.7 }}
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          placeholder="Why you believe in him..."
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleSubmit(opt.priceId)}
                      disabled={loading || !formReady}
                      style={{
                        width: "100%", marginTop: 16, padding: "15px",
                        background: formReady ? opt.color : "transparent",
                        color: formReady ? "#000" : GOLD_DIM,
                        border: `1px solid ${formReady ? opt.color : GOLD_20}`,
                        borderRadius: 8, fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.48rem", fontWeight: 700, letterSpacing: "0.15em",
                        cursor: formReady && !loading ? "pointer" : "not-allowed",
                        opacity: !formReady ? 0.4 : 1, transition: "all 0.2s",
                      }}
                    >
                      {loading ? "PROCESSING..." : `SPONSOR HIM — ${opt.price}`}
                    </button>

                    <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.36rem", textAlign: "center", marginTop: 8 }}>
                      Secure checkout via Stripe · He receives his invitation after payment
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── OUTREACH TEMPLATES ── */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.25em", marginBottom: 16 }}>
            SHARE THIS — OUTREACH TEMPLATES
          </p>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem", lineHeight: 1.7, marginBottom: 14 }}>
            The highest ROI move: a direct message from someone who knows him. Use these.
          </p>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              {
                label: "FOR WIVES / GIRLFRIENDS",
                icon: "💍",
                text: "I thought of [his name] for this. It's a brotherhood event in West Oahu — May 1–3. Real men, 4am ice bath, building real things together. I know he'd never ask for it himself, so I wanted to give you the option to sponsor him. No obligation. makoa.live/sponsor",
              },
              {
                label: "FOR MOTHERS",
                icon: "🤍",
                text: "I came across something I thought of [his name] for. It's a brotherhood in West Oahu — men who show up at 4am, hold each other accountable, build real things. The founding event is May 1–3. You can sponsor him anonymously. He gets the message: 'Someone believes in you.' makoa.live/sponsor",
              },
              {
                label: "FOR CLOSE FRIENDS",
                icon: "✊",
                text: "Bro — I'm going to Mākoa MAYDAY in West Oahu, May 1–3. 4am ice bath, brotherhood, real work. I thought of you. Gate closes April 25. If you're in, go to makoa.live. If you need a push, I'll sponsor you.",
              },
              {
                label: "FOR INSTAGRAM / FACEBOOK",
                icon: "📸",
                text: "The 4am ice bath with brothers who actually show up.\n\nSponsor him before the gate closes.\n\nGate closes April 25. Only 20 seats. The Founding Fire happens once.\n\nmakoa.live/sponsor\n\n#Mākoa #SomeoneBelievesInYou #WestOahu #MAYDAY2026",
              },
            ].map(item => (
              <OutreachCard key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: 24, borderTop: `1px solid ${GOLD_10}`, marginBottom: 40 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD, fontSize: "1.2rem", lineHeight: 1.6, marginBottom: 16 }}>
            "Give him the push he won't give himself.<br />
            The Founding Fire happens once."
          </p>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.14em", marginBottom: 16, fontWeight: 600 }}>
            makoa.live/sponsor
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {[
              { href: "/gate", label: "THE GATE" },
              { href: "/fire", label: "THE FOUNDING FIRE" },
              { href: "/founding48", label: "MAYDAY" },
              { href: "/wahine", label: "WAHINE CIRCLE" },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.14em",
                textDecoration: "none", borderBottom: `1px solid ${GOLD_20}`, paddingBottom: 2,
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OutreachCard({ label, icon, text }: { label: string; icon: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
      style={{
        width: "100%", background: copied ? "rgba(176,142,80,0.08)" : "rgba(176,142,80,0.03)",
        border: `1px solid ${copied ? "rgba(176,142,80,0.35)" : "rgba(176,142,80,0.1)"}`,
        borderRadius: 8, padding: "12px 14px", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        gap: 10, textAlign: "left", transition: "all 0.2s",
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.14em", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>
          {icon} {label}
        </p>
        <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.38rem", lineHeight: 1.6, whiteSpace: "pre-line", fontFamily: "'JetBrains Mono', monospace" }}>
          {text}
        </p>
      </div>
      <p style={{ color: copied ? GOLD : "rgba(176,142,80,0.25)", fontSize: "0.34rem", flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", transition: "color 0.2s" }}>
        {copied ? "✓ COPIED" : "TAP"}
      </p>
    </button>
  );
}
