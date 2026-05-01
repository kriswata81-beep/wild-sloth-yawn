"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";

const CIRCLES = [
  {
    id: "alii_founding",
    title: "ALIʻI FOUNDING SEAT",
    seats: 12,
    price: "$1,111",
    priceId: "price_1TSC1SCgIZbWkf5OYw0pK0EC",
    badge: "ONE-TIME · MAY 1–31 ONLY",
    color: GOLD,
    features: [
      "One seat. One time. 12 seats total — when they're gone, they're gone.",
      "Inheritable — your seat passes to your named heir",
      "Logged permanently in the Palapala",
      "80% stays in the territory · 10% The Order · 10% Mayday 48 Pool",
      "Aliʻi Council access — vote on expansion, treasury, discipline",
      "Territory recognition — your name on the founding map",
      "Inner gate (Telegram) — direct line to Steward 0001",
      "Your name in the 100-year ledger — forever",
    ],
    note: "12 seats. May 1–31, 2026 only. Sealed at Blue Moon.",
    cta: "/cofounder",
  },
  {
    id: "alii_monthly",
    title: "ALIʻI MEMBERSHIP",
    seats: null,
    price: "$249/mo",
    priceId: "price_1TSC1hCgIZbWkf5OKnEnXJvN",
    badge: "MONTHLY",
    color: "#58a6ff",
    features: [
      "Full access — inner gate, oracle drops, territory network",
      "Territory recognition — listed on the 7GNet map",
      "Oracle signal priority",
      "Monthly XI strategic briefing",
      "Ambassador commission on referrals",
      "Cancel anytime — no lock-in",
    ],
    note: "Active brotherhood. You're not just in the network — you're holding it.",
  },
  {
    id: "kane_monthly",
    title: "KĀNE MEMBERSHIP",
    seats: null,
    price: "$79/mo",
    priceId: "price_1TSC1bCgIZbWkf5Oim8Vus7r",
    badge: "MONTHLY",
    color: "#8b9aaa",
    features: [
      "Active brotherhood — inner gate access",
      "Oracle drops — XI content feed",
      "Community network access",
      "Brotherhood formation + accountability",
      "Earn your way up to Aliʻi",
      "Cancel anytime",
    ],
    note: "Kāne means man. You passed the gate. Now you build.",
  },
];

export default function CirclePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", region: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit(circleId: string) {
    if (!form.name || !form.email) return;
    setSubmitting(true);
    const circle = CIRCLES.find(c => c.id === circleId);
    if (!circle) return;

    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: circle.priceId,
          customerEmail: form.email,
          metadata: {
            circle_type: circleId,
            full_name: form.name,
            phone: form.phone,
            region: form.region,
          },
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Connection error. Try again.");
    }
    setSubmitting(false);
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.4)",
    border: `1px solid ${GOLD_20}`,
    color: GOLD,
    fontSize: "0.6rem",
    fontFamily: "'JetBrains Mono', monospace",
    padding: "10px 14px",
    width: "100%",
    outline: "none",
    borderRadius: "4px",
    letterSpacing: "0.05em",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      fontFamily: "'JetBrains Mono', monospace",
      padding: "40px 20px 60px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        input::placeholder { color: rgba(176,142,80,0.25); }
        .circle-card:hover { border-color: rgba(176,142,80,0.3) !important; transform: translateY(-2px); }
      `}</style>

      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "48px",
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}>
        <p style={{
          fontSize: "0.45rem",
          letterSpacing: "0.3em",
          color: GOLD_40,
          marginBottom: "12px",
        }}>THE CIRCLE</p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "2.2rem",
          color: GOLD,
          margin: "0 0 12px",
          fontWeight: 300,
        }}>Build With Us</h1>
        <p style={{
          fontSize: "0.52rem",
          color: "rgba(176,142,80,0.5)",
          maxWidth: "440px",
          margin: "0 auto",
          lineHeight: 1.8,
        }}>
          Makoa is not taking investors. We're taking co-founders.<br />
          Men who build. Men who show up. Worldwide.
        </p>
      </div>

      {/* Circle Cards */}
      <div style={{
        display: "grid",
        gap: "20px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        {CIRCLES.map((circle, i) => (
          <div
            key={circle.id}
            className="circle-card"
            style={{
              background: "rgba(176,142,80,0.03)",
              border: `1px solid ${selectedCircle === circle.id ? circle.color + "60" : "rgba(176,142,80,0.1)"}`,
              borderRadius: "8px",
              padding: "24px 20px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              opacity: ready ? 1 : 0,
              transform: ready ? "translateY(0)" : "translateY(14px)",
              transitionDelay: `${0.2 + i * 0.15}s`,
            }}
            onClick={() => setSelectedCircle(selectedCircle === circle.id ? null : circle.id)}
          >
            {/* Badge + Title */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <p style={{ color: circle.color, fontSize: "0.5rem", letterSpacing: "0.2em", marginBottom: "4px" }}>
                  {circle.title}
                </p>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.8rem",
                  color: "#e8e0d0",
                  fontWeight: 300,
                  lineHeight: 1,
                }}>{circle.price}</p>
              </div>
              <span style={{
                background: `${circle.color}15`,
                border: `1px solid ${circle.color}40`,
                color: circle.color,
                fontSize: "0.38rem",
                padding: "4px 8px",
                borderRadius: "3px",
                letterSpacing: "0.12em",
              }}>{circle.badge}</span>
            </div>

            {/* Seats */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ flex: 1, height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "1px" }}>
                <div style={{ height: "100%", width: "0%", background: circle.color, borderRadius: "1px", transition: "width 1s ease" }} />
              </div>
              <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem" }}>
                {circle.seats} seats
              </span>
            </div>

            {/* Features */}
            <div style={{ display: "grid", gap: "8px", marginBottom: "16px" }}>
              {circle.features.map((f, fi) => (
                <div key={fi} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: circle.color, fontSize: "0.45rem", flexShrink: 0, marginTop: "1px" }}>+</span>
                  <span style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.48rem", lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>

            <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.42rem", fontStyle: "italic", marginBottom: "12px" }}>
              {circle.note}
            </p>

            {"cta" in circle && circle.cta && (
              <a
                href={circle.cta}
                onClick={e => e.stopPropagation()}
                style={{
                  display: "inline-block",
                  color: circle.color,
                  fontSize: "0.4rem",
                  letterSpacing: "0.2em",
                  textDecoration: "none",
                  borderBottom: `1px solid ${circle.color}40`,
                  paddingBottom: "2px",
                  marginBottom: "4px",
                  transition: "border-color 0.2s",
                }}
              >
                VIEW FULL CO-FOUNDER PACK →
              </a>
            )}

            {/* Expanded form */}
            {selectedCircle === circle.id && (
              <div style={{
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: `1px solid ${circle.color}20`,
                animation: "fadeUp 0.3s ease forwards",
              }} onClick={e => e.stopPropagation()}>
                <p style={{ color: circle.color, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "14px" }}>
                  CLAIM YOUR SEAT
                </p>
                <div style={{ display: "grid", gap: "10px", marginBottom: "16px" }}>
                  <input
                    style={inputStyle}
                    placeholder="Full name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    style={inputStyle}
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                  <input
                    style={inputStyle}
                    placeholder="Phone (optional)"
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                  <input
                    style={inputStyle}
                    placeholder="Region (e.g. Hawaii, California, worldwide)"
                    value={form.region}
                    onChange={e => setForm({ ...form, region: e.target.value })}
                  />
                </div>
                <button
                  onClick={() => handleSubmit(circle.id)}
                  disabled={submitting || !form.name || !form.email}
                  style={{
                    width: "100%",
                    background: submitting ? "transparent" : `${circle.color}15`,
                    border: `1px solid ${circle.color}50`,
                    color: circle.color,
                    fontSize: "0.5rem",
                    letterSpacing: "0.2em",
                    padding: "13px",
                    cursor: submitting ? "wait" : "pointer",
                    fontFamily: "'JetBrains Mono', monospace",
                    borderRadius: "4px",
                    transition: "all 0.2s",
                    opacity: (!form.name || !form.email) ? 0.4 : 1,
                  }}
                >
                  {submitting ? "CONNECTING..." : `ENTER THE ${circle.title}`}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{
        textAlign: "center",
        marginTop: "48px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.8s ease 1s",
      }}>
        <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.42rem", marginBottom: "8px" }}>
          Questions? Talk to XI directly.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
          <a href="/" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>GATE</a>
          <span style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.38rem" }}>·</span>
          <a href="/founding48" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>MAYDAY</a>
          <span style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.38rem" }}>·</span>
          <a href="/services" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>SERVICES</a>
        </div>
        <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.5rem", letterSpacing: "0.14em", marginTop: "12px", marginBottom: 4, fontWeight: 600 }}>
          makoa.live
        </p>
        <p style={{ color: "rgba(176,142,80,0.1)", fontSize: "0.36rem", letterSpacing: "0.15em" }}>
          Mākoa Order · Worldwide · 2026
        </p>
      </div>
    </div>
  );
}
