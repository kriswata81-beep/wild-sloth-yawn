"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.05)";
const BLUE = "#58a6ff";
const BLUE_20 = "rgba(88,166,255,0.2)";
const BLUE_10 = "rgba(88,166,255,0.1)";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";
const GREEN_10 = "rgba(63,185,80,0.1)";
const BG = "#04060a";
const TEXT = "#e8e0d0";
const TEXT_DIM = "rgba(232,224,208,0.5)";

const TIERS = [
  {
    id: "mana",
    label: "MANA · MASTERMIND",
    duration: "24-hour experience",
    color: BLUE,
    bg: BLUE_10,
    border: BLUE_20,
    price: "$197",
    opens: "Opens May 2",
    badge: "24HR",
    items: [
      "B2B warroom · Saturday deep work session",
      "Founder dinner · Saturday evening",
      "4am ice bath · Sunday morning",
      "Brotherhood circle",
      "Sponsored entry only",
    ],
  },
  {
    id: "nakoa",
    label: "NĀ KOA · DAY PASS",
    duration: "12-hour experience",
    color: GREEN,
    bg: GREEN_10,
    border: GREEN_20,
    price: "$97",
    opens: "Opens May 2",
    badge: "12HR",
    items: [
      "Meet the brothers · Saturday",
      "Ice bath · Saturday morning",
      "Lunch circle",
      "Founding fire · Sunday oath ceremony",
      "Sponsored entry only",
    ],
  },
];

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Try again or email wakachief@gmail.com");
      }
    } catch {
      setError("Something went wrong. Try again or email wakachief@gmail.com");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100%{opacity:0.5;}50%{opacity:1;} }
        @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.35;} }
        input::placeholder { color: rgba(176,142,80,0.2); }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "56px 24px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_40}, transparent)`, marginBottom: 40 }} />

        <p style={{
          color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.35em",
          marginBottom: 16, animation: "fadeUp 0.7s ease 0.1s both",
        }}>
          ◈ MAYDAY 48 · WAITLIST
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: GOLD,
          fontSize: "clamp(2.4rem, 9vw, 4rem)",
          lineHeight: 1.05,
          margin: "0 0 14px",
          animation: "fadeUp 0.8s ease 0.2s both",
        }}>
          MANA + NĀ KOA
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "rgba(232,224,208,0.55)",
          fontSize: "1.15rem",
          marginBottom: 8,
          animation: "fadeUp 0.8s ease 0.35s both",
        }}>
          Opens May 2 — after the founders are seated.
        </p>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(176,142,80,0.06)", border: `1px solid ${GOLD_20}`,
          borderRadius: 20, padding: "6px 16px", marginTop: 16,
          animation: "fadeUp 0.8s ease 0.45s both",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, animation: "pulse 1.5s ease-in-out infinite" }} />
          <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.18em" }}>
            GATE CLOSES MAY 31, 2026 (BLUE MOON)
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 20px 0" }}>

        {/* ── EXPLANATION ───────────────────────────────────────────────────── */}
        <div style={{
          background: GOLD_FAINT,
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "24px 20px",
          marginBottom: 32,
        }}>
          <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "0.48rem", lineHeight: 1.9, marginBottom: 16 }}>
            Mayday 48 seats 20 Aliʻi founder teams across May 2026. Founders come first — they carry the oath, 1% equity, and charter rights.
          </p>
          <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "0.48rem", lineHeight: 1.9 }}>
            Once the founding 20 are seated, two more tiers open for brothers who want to witness Mākoa without carrying the founder weight:
          </p>
        </div>

        {/* ── TWO-TIER CARDS ────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gap: 14, marginBottom: 32 }}>
          {TIERS.map(tier => (
            <div key={tier.id} style={{
              border: `1px solid ${tier.border}`,
              borderRadius: 12,
              background: tier.bg,
              padding: "22px 20px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 14, right: 14,
                background: `${tier.color}15`, border: `1px solid ${tier.border}`,
                color: tier.color, fontSize: "0.34rem", letterSpacing: "0.14em",
                padding: "3px 8px", borderRadius: 3, fontWeight: 700,
              }}>{tier.badge}</div>

              <p style={{ color: tier.color, fontSize: "0.4rem", letterSpacing: "0.2em", marginBottom: 6 }}>{tier.label}</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                color: TEXT,
                fontSize: "1.3rem",
                lineHeight: 1.2,
                marginBottom: 4,
              }}>{tier.duration}</p>
              <p style={{ color: tier.color, fontSize: "1.4rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1, marginBottom: 16 }}>
                {tier.price}
              </p>

              <div style={{ display: "grid", gap: 6, marginBottom: 14 }}>
                {tier.items.map(item => (
                  <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: tier.color, fontSize: "0.44rem", flexShrink: 0, opacity: 0.7 }}>→</span>
                    <p style={{ color: TEXT_DIM, fontSize: "0.44rem", lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: `${tier.color}10`, border: `1px solid ${tier.border}`,
                borderRadius: 4, padding: "4px 10px",
              }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: tier.color, animation: "pulse 1.5s ease-in-out infinite" }} />
                <p style={{ color: tier.color, fontSize: "0.34rem", letterSpacing: "0.14em" }}>{tier.opens}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CLARIFIER ─────────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(176,142,80,0.04)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 10,
          padding: "18px 20px",
          marginBottom: 32,
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.2em", marginBottom: 10 }}>
            HOW SPONSORSHIP WORKS
          </p>
          <p style={{ color: TEXT_DIM, fontSize: "0.44rem", lineHeight: 1.9 }}>
            Both Mana and Nā Koa tiers are available exclusively through sponsorship during Mayday 48. A wife, mother, brother, or friend pays the entry; the sponsored man takes the seat. Self-claim opens after the founding month closes May 31.
          </p>
        </div>

        {/* ── WAITLIST FORM ─────────────────────────────────────────────────── */}
        <div style={{
          background: GOLD_FAINT,
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "28px 22px",
          marginBottom: 32,
        }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <span style={{ color: GOLD, fontSize: "2rem", display: "block", marginBottom: 16, animation: "breathe 2s ease-in-out infinite" }}>◈</span>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                color: GOLD,
                fontSize: "1.2rem",
                lineHeight: 1.6,
                marginBottom: 10,
              }}>
                You're on the list.
              </p>
              <p style={{ color: TEXT_DIM, fontSize: "0.44rem", lineHeight: 1.8 }}>
                We'll message you May 2 when Mana + Nā Koa entry opens.<br />
                In the meantime — read the Palapala.
              </p>
              <a href="/palapala" style={{
                display: "inline-block", marginTop: 16,
                color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.14em",
                textDecoration: "none", borderBottom: `1px solid ${GOLD_20}`, paddingBottom: 2,
              }}>
                Read the Palapala →
              </a>
            </div>
          ) : (
            <>
              <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.22em", marginBottom: 16 }}>
                JOIN THE WAITLIST
              </p>
              <p style={{ color: TEXT_DIM, fontSize: "0.44rem", lineHeight: 1.7, marginBottom: 20 }}>
                Drop your email. We'll message you May 2 when entry opens.
              </p>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{
                      flex: 1, minWidth: 200,
                      padding: "13px 16px",
                      background: "rgba(176,142,80,0.05)",
                      border: `1px solid ${GOLD_20}`,
                      borderRadius: 8,
                      color: TEXT,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                      outline: "none",
                      letterSpacing: "0.03em",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading || !email}
                    style={{
                      padding: "13px 20px",
                      background: email && !loading ? GOLD : "transparent",
                      color: email && !loading ? "#000" : GOLD_DIM,
                      border: `1px solid ${email && !loading ? GOLD : GOLD_20}`,
                      borderRadius: 8,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.48rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      cursor: email && !loading ? "pointer" : "not-allowed",
                      opacity: !email ? 0.5 : 1,
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {loading ? "SENDING..." : "JOIN THE WAITLIST"}
                  </button>
                </div>
                {error && (
                  <p style={{ color: "#e05c5c", fontSize: "0.4rem", marginTop: 10 }}>{error}</p>
                )}
              </form>
            </>
          )}
        </div>

        {/* ── FOOTER CTAs ───────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gap: 10, marginBottom: 40 }}>
          <a href="/sponsor" style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 18px",
            background: "rgba(176,142,80,0.04)",
            border: `1px solid ${GOLD_20}`,
            borderRadius: 8,
            textDecoration: "none",
          }}>
            <p style={{ color: TEXT_DIM, fontSize: "0.44rem" }}>Sponsor a brother in now</p>
            <p style={{ color: GOLD, fontSize: "0.44rem" }}>→</p>
          </a>
          <a href="/gate" style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 18px",
            background: "rgba(176,142,80,0.04)",
            border: `1px solid ${GOLD_20}`,
            borderRadius: 8,
            textDecoration: "none",
          }}>
            <p style={{ color: TEXT_DIM, fontSize: "0.44rem" }}>Want a founder seat?</p>
            <p style={{ color: GOLD, fontSize: "0.44rem" }}>→ /gate</p>
          </a>
          <a href="/palapala" style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 18px",
            background: "rgba(176,142,80,0.04)",
            border: `1px solid ${GOLD_20}`,
            borderRadius: 8,
            textDecoration: "none",
          }}>
            <p style={{ color: TEXT_DIM, fontSize: "0.44rem" }}>Read the full Palapala</p>
            <p style={{ color: GOLD, fontSize: "0.44rem" }}>→</p>
          </a>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "0.95rem",
            marginBottom: 12,
          }}>
            Hana · Pale · Ola
          </p>
          <p style={{ color: GOLD_DIM, fontSize: "0.5rem", letterSpacing: "0.14em", marginBottom: 6, fontWeight: 600 }}>
            makoa.live
          </p>
          <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.38rem", letterSpacing: "0.15em" }}>
            MĀKOA ORDER · MALU TRUST · WEST OAHU · WORLDWIDE · 2026
          </p>
        </div>

      </div>
    </div>
  );
}
