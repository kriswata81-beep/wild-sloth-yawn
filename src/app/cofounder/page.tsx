"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_FAINT = "rgba(176,142,80,0.06)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const PURPLE = "#a78bfa";
const BG = "#04060a";

const STACK = [
  {
    category: "FINANCIAL RETURN",
    color: GREEN,
    icon: "💰",
    items: [
      { label: "1% Equity", detail: "Mākoa Trade Co. LLC — founding valuation set at MAYDAY 2026. You're in at the floor." },
      { label: "5% Territory Revenue Share", detail: "5% of net route revenue from your home territory, paid quarterly. Routes scale — so does your cut." },
      { label: "$200 Ambassador Commission", detail: "Every brother you bring who completes 90-day formation pays you $200. No cap." },
      { label: "Tax-Deductible Investment", detail: "Dues, events, equipment, and tech costs are deductible. Your $4,997 works harder than it looks." },
    ],
  },
  {
    category: "OPERATIONAL POWER",
    color: GOLD,
    icon: "⚔️",
    items: [
      { label: "Exclusive Territory", detail: "One co-founder per region. No overlap. No competition from inside the order. Your market is yours." },
      { label: "First Access — Every Route & Market", detail: "New B2B contracts, hotel routes, property managers — co-founders get right of first refusal before anyone else." },
      { label: "XI Agent Access", detail: "Full access to XI — the AI agent that runs ops, scores applicants, posts content, and briefs the council. $497/yr value included." },
      { label: "Named on All LLC Filings", detail: "Co-Founding Director on the Articles of Organization. Not a title — a legal designation. Permanent." },
    ],
  },
  {
    category: "GOVERNANCE RIGHTS",
    color: BLUE,
    icon: "🏛",
    items: [
      { label: "Ali'i Council Seat", detail: "Quarterly strategy sessions. You vote on expansion, treasury, discipline, and order-level decisions." },
      { label: "2/3 Majority Required", detail: "Your vote is not ceremonial. No decision passes without council consensus. You have real power." },
      { label: "Succession Rights", detail: "Your seat transfers to your designated heir. This is generational — not just a membership." },
      { label: "NDA + D&O Insurance", detail: "Directors & Officers insurance covers your seat. NDA protects the council's intelligence." },
    ],
  },
  {
    category: "LEGACY & IMPACT",
    color: PURPLE,
    icon: "🌊",
    items: [
      { label: "Founding Stone — Permanent", detail: "Your name carved in the founding record. Every brother who joins after you knows you were first." },
      { label: "MAYDAY 2026 War Room Pass", detail: "The 48-hour founding event. The charter is signed. The order is legally founded. You're in the room." },
      { label: "Chapter Leadership", detail: "You anchor the Mākoa chapter in your region. You open the first 4am. You build the first circle." },
      { label: "100-Year Mission", detail: "You're not joining a startup. You're founding an order designed to outlive every one of us." },
    ],
  },
];

const FAQS = [
  {
    q: "What does 1% equity actually mean?",
    a: "1% of Mākoa Trade Co. LLC — the operating entity that holds route contracts, B2B agreements, and cooperative revenue. Founding valuation is set at MAYDAY 2026 by the council. You're buying in at the floor before any external valuation.",
  },
  {
    q: "How does the revenue share work?",
    a: "5% of net route revenue generated in your home territory, paid quarterly. As more brothers operate routes in your region, your share grows. The 80/10/10 model means 10% of all revenue flows to the Order fund — your 5% territory share comes from gross before that split.",
  },
  {
    q: "Can I sell or transfer my seat?",
    a: "Co-founder seats are not publicly tradeable. If you step down, your seat opens for council vote. If you pass, your seat transfers to your designated successor. This protects the integrity of the founding council.",
  },
  {
    q: "What if I'm not in Hawaii?",
    a: "Co-founders are worldwide. Your territory is wherever you are. West Coast, East Coast, international — the order is expanding. You anchor your region.",
  },
  {
    q: "What is XI exactly?",
    a: "XI is the Mākoa AI agent. It runs the Command Center, scores applicants, generates content, sends the 808 Signal, briefs the council, and manages operational intelligence. As a co-founder, you have full access — it works for you.",
  },
  {
    q: "Is $4,997 the only cost?",
    a: "Yes. One-time. No monthly fees at the co-founder tier. Annual reaffirmation at Makahiki is ceremonial, not financial. Your seat is yours.",
  },
];

const TIMELINE = [
  { phase: "NOW", label: "Claim Your Seat", detail: "12 seats. First come, first seated. Pay $4,997 — your name goes on the founding docs." },
  { phase: "MAYDAY", label: "War Room — May 2026", detail: "48 hours in Kapolei. Co-founders charter signed. Order legally founded. You're in the room." },
  { phase: "30 DAYS", label: "Territory Activation", detail: "XI assigns your territory. You open your first 4am. First circle. First brothers under you." },
  { phase: "90 DAYS", label: "Route Revenue Begins", detail: "First quarterly revenue share distributed. Your 5% territory cut starts flowing." },
  { phase: "1 YEAR", label: "Council Seat Active", detail: "First full year of Ali'i Council governance. Expansion votes. Treasury decisions. Your voice matters." },
  { phase: "100 YRS", label: "The Mission Continues", detail: "Your name is on the founding stone. The order outlives every one of us. That's the design." },
];

export default function CofounderPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", region: "" });
  const [submitting, setSubmitting] = useState(false);
  const [seatsLeft] = useState(12);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  async function handleClaim() {
    if (!form.name || !form.email) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_1TKnnt836uPpUiqMrOthQ4oE",
          customerEmail: form.email,
          metadata: {
            circle_type: "cofounder",
            full_name: form.name,
            phone: form.phone,
            region: form.region,
          },
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Connection error. Try again.");
    }
    setSubmitting(false);
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.5)",
    border: `1px solid ${GOLD_20}`,
    color: GOLD,
    fontSize: "0.6rem",
    fontFamily: "'JetBrains Mono', monospace",
    padding: "12px 14px",
    width: "100%",
    outline: "none",
    borderRadius: "6px",
    letterSpacing: "0.05em",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      fontFamily: "'JetBrains Mono', monospace",
      color: "#e8e0d0",
      overflowX: "hidden",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        input::placeholder { color: rgba(176,142,80,0.2); }
        .stack-card { transition: border-color 0.3s, transform 0.3s; }
        .stack-card:hover { border-color: rgba(176,142,80,0.25) !important; transform: translateY(-2px); }
        .faq-row { cursor: pointer; transition: background 0.2s; }
        .faq-row:hover { background: rgba(176,142,80,0.04) !important; }
        .claim-btn { transition: all 0.25s; }
        .claim-btn:hover:not(:disabled) { background: rgba(176,142,80,0.2) !important; transform: translateY(-1px); }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div style={{
        padding: "80px 24px 60px",
        textAlign: "center",
        borderBottom: `1px solid ${GOLD_10}`,
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.9s ease, transform 0.9s ease",
      }}>
        {/* Seat counter */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(63,185,80,0.08)",
          border: "1px solid rgba(63,185,80,0.25)",
          borderRadius: "20px",
          padding: "6px 16px",
          marginBottom: "28px",
        }}>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: GREEN,
            animation: "pulse 2s infinite",
          }} />
          <span style={{ color: GREEN, fontSize: "0.42rem", letterSpacing: "0.2em" }}>
            {seatsLeft} OF 12 SEATS REMAINING
          </span>
        </div>

        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.35em", marginBottom: "16px" }}>
          ALI'I CO-FOUNDING PACK
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "clamp(2.4rem, 8vw, 4rem)",
          color: GOLD,
          margin: "0 0 16px",
          fontWeight: 300,
          lineHeight: 1.1,
        }}>
          You're Not Joining.<br />You're Founding.
        </h1>

        <p style={{
          color: "rgba(232,224,208,0.45)",
          fontSize: "0.58rem",
          maxWidth: "480px",
          margin: "0 auto 32px",
          lineHeight: 1.9,
        }}>
          12 seats. Worldwide. One-time investment.<br />
          Equity, territory, governance, and legacy —<br />
          in an order built to last 100 years.
        </p>

        <div style={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: "8px",
          marginBottom: "8px",
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "3.5rem",
            color: GOLD,
            fontWeight: 300,
            lineHeight: 1,
          }}>$4,997</span>
          <span style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.1em" }}>ONE-TIME</span>
        </div>

        <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.42rem", marginBottom: "40px" }}>
          No monthly fees. No lock-in. Your seat is permanent.
        </p>

        <a href="#claim" style={{
          display: "inline-block",
          background: GOLD_10,
          border: `1px solid ${GOLD_20}`,
          color: GOLD,
          fontSize: "0.5rem",
          letterSpacing: "0.25em",
          padding: "14px 36px",
          borderRadius: "4px",
          textDecoration: "none",
          transition: "all 0.25s",
        }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.background = "rgba(176,142,80,0.15)";
            (e.target as HTMLElement).style.borderColor = "rgba(176,142,80,0.4)";
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = GOLD_10;
            (e.target as HTMLElement).style.borderColor = GOLD_20;
          }}
        >
          CLAIM YOUR SEAT
        </a>
      </div>

      {/* ── THE STACK ────────────────────────────────────────────── */}
      <div style={{ padding: "60px 24px", maxWidth: "680px", margin: "0 auto" }}>
        <p style={{
          color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em",
          textAlign: "center", marginBottom: "40px",
        }}>
          WHAT YOU GET
        </p>

        <div style={{ display: "grid", gap: "20px" }}>
          {STACK.map((section, si) => (
            <div
              key={si}
              className="stack-card"
              style={{
                background: GOLD_FAINT,
                border: `1px solid ${GOLD_10}`,
                borderRadius: "10px",
                padding: "24px 20px",
                opacity: ready ? 1 : 0,
                transform: ready ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.6s ease ${0.2 + si * 0.1}s, transform 0.6s ease ${0.2 + si * 0.1}s, border-color 0.3s, box-shadow 0.3s`,
              }}
            >
              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <span style={{ fontSize: "1rem" }}>{section.icon}</span>
                <p style={{ color: section.color, fontSize: "0.42rem", letterSpacing: "0.25em" }}>
                  {section.category}
                </p>
              </div>

              {/* Items */}
              <div style={{ display: "grid", gap: "16px" }}>
                {section.items.map((item, ii) => (
                  <div key={ii} style={{
                    display: "flex",
                    gap: "14px",
                    paddingBottom: ii < section.items.length - 1 ? "16px" : 0,
                    borderBottom: ii < section.items.length - 1 ? `1px solid rgba(176,142,80,0.06)` : "none",
                  }}>
                    <span style={{
                      color: section.color,
                      fontSize: "0.55rem",
                      flexShrink: 0,
                      marginTop: "1px",
                      opacity: 0.8,
                    }}>+</span>
                    <div>
                      <p style={{ color: "#e8e0d0", fontSize: "0.52rem", marginBottom: "4px", fontWeight: 500 }}>
                        {item.label}
                      </p>
                      <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem", lineHeight: 1.7 }}>
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TIMELINE ─────────────────────────────────────────────── */}
      <div style={{
        padding: "60px 24px",
        borderTop: `1px solid ${GOLD_10}`,
        borderBottom: `1px solid ${GOLD_10}`,
        background: "rgba(0,0,0,0.3)",
      }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p style={{
            color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em",
            textAlign: "center", marginBottom: "40px",
          }}>
            YOUR TIMELINE AS CO-FOUNDER
          </p>

          <div style={{ display: "grid", gap: "0" }}>
            {TIMELINE.map((step, i) => (
              <div key={i} style={{
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
                paddingBottom: i < TIMELINE.length - 1 ? "28px" : 0,
                position: "relative",
              }}>
                {/* Line */}
                {i < TIMELINE.length - 1 && (
                  <div style={{
                    position: "absolute",
                    left: "31px",
                    top: "28px",
                    width: "1px",
                    height: "calc(100% - 4px)",
                    background: `linear-gradient(to bottom, ${GOLD_20}, transparent)`,
                  }} />
                )}

                {/* Phase badge */}
                <div style={{
                  width: "62px",
                  flexShrink: 0,
                  background: i === 0 ? GOLD_10 : "rgba(0,0,0,0.4)",
                  border: `1px solid ${i === 0 ? GOLD_20 : "rgba(176,142,80,0.08)"}`,
                  borderRadius: "6px",
                  padding: "6px 4px",
                  textAlign: "center",
                }}>
                  <p style={{
                    color: i === 0 ? GOLD : GOLD_DIM,
                    fontSize: "0.38rem",
                    letterSpacing: "0.1em",
                  }}>{step.phase}</p>
                </div>

                {/* Content */}
                <div style={{ paddingTop: "4px" }}>
                  <p style={{ color: "#e8e0d0", fontSize: "0.52rem", marginBottom: "4px" }}>{step.label}</p>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem", lineHeight: 1.7 }}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROI SNAPSHOT ─────────────────────────────────────────── */}
      <div style={{ padding: "60px 24px", maxWidth: "680px", margin: "0 auto" }}>
        <p style={{
          color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em",
          textAlign: "center", marginBottom: "40px",
        }}>
          CONSERVATIVE ROI SNAPSHOT
        </p>

        <div style={{
          background: GOLD_FAINT,
          border: `1px solid ${GOLD_10}`,
          borderRadius: "10px",
          padding: "24px 20px",
          marginBottom: "16px",
        }}>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem", letterSpacing: "0.15em", marginBottom: "16px" }}>
            EXAMPLE: 10 BROTHERS OPERATING ROUTES IN YOUR TERRITORY
          </p>

          {[
            { label: "Avg brother route revenue / mo", value: "$3,200", color: "rgba(232,224,208,0.6)" },
            { label: "Territory gross / mo (10 brothers)", value: "$32,000", color: "rgba(232,224,208,0.6)" },
            { label: "Your 5% territory share / mo", value: "$1,600", color: GREEN },
            { label: "Your 5% territory share / yr", value: "$19,200", color: GREEN },
            { label: "Ambassador commissions (est.)", value: "$2,000+", color: GOLD },
            { label: "XI agent value (included)", value: "$497", color: GOLD },
            { label: "Your initial investment", value: "$4,997", color: "rgba(232,224,208,0.4)" },
            { label: "Break-even timeline", value: "~3 months", color: BLUE },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: i < 7 ? `1px solid rgba(176,142,80,0.06)` : "none",
            }}>
              <span style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.44rem" }}>{row.label}</span>
              <span style={{ color: row.color, fontSize: "0.52rem", fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}
        </div>

        <p style={{
          color: "rgba(176,142,80,0.25)",
          fontSize: "0.4rem",
          textAlign: "center",
          lineHeight: 1.7,
          fontStyle: "italic",
        }}>
          These are conservative projections based on current route operator averages.<br />
          Not a guarantee. The work determines the return.
        </p>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <div style={{
        padding: "60px 24px",
        borderTop: `1px solid ${GOLD_10}`,
        background: "rgba(0,0,0,0.2)",
      }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p style={{
            color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em",
            textAlign: "center", marginBottom: "40px",
          }}>
            QUESTIONS
          </p>

          <div style={{ display: "grid", gap: "4px" }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="faq-row"
                style={{
                  background: openFaq === i ? "rgba(176,142,80,0.05)" : "transparent",
                  border: `1px solid ${openFaq === i ? GOLD_20 : "rgba(176,142,80,0.08)"}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                  transition: "all 0.2s",
                }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 18px",
                  gap: "12px",
                }}>
                  <p style={{ color: "#e8e0d0", fontSize: "0.5rem", lineHeight: 1.5 }}>{faq.q}</p>
                  <span style={{
                    color: GOLD_DIM,
                    fontSize: "0.7rem",
                    flexShrink: 0,
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0)",
                    transition: "transform 0.2s",
                    lineHeight: 1,
                  }}>+</span>
                </div>
                {openFaq === i && (
                  <div style={{
                    padding: "0 18px 16px",
                    animation: "fadeUp 0.2s ease forwards",
                  }}>
                    <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.46rem", lineHeight: 1.8 }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CLAIM FORM ───────────────────────────────────────────── */}
      <div id="claim" style={{
        padding: "80px 24px",
        borderTop: `1px solid ${GOLD_10}`,
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em", marginBottom: "12px" }}>
            CLAIM YOUR SEAT
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "2rem",
            color: GOLD,
            fontWeight: 300,
            margin: "0 0 12px",
          }}>
            12 Seats. Worldwide.
          </h2>
          <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.46rem", lineHeight: 1.7 }}>
            When they're gone, they're gone.<br />
            No second round. No waitlist.
          </p>
        </div>

        {/* Seat progress */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.1em" }}>SEATS CLAIMED</span>
            <span style={{ color: GOLD, fontSize: "0.4rem" }}>0 / 12</span>
          </div>
          <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div style={{ height: "100%", width: "0%", background: GOLD, borderRadius: "2px" }} />
          </div>
        </div>

        <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
          <input
            style={inputStyle}
            placeholder="Full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Email address"
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
            placeholder="Your region (Hawaii, California, etc.)"
            value={form.region}
            onChange={e => setForm({ ...form, region: e.target.value })}
          />
        </div>

        <button
          className="claim-btn"
          onClick={handleClaim}
          disabled={submitting || !form.name || !form.email}
          style={{
            width: "100%",
            background: form.name && form.email ? GOLD_10 : "transparent",
            border: `1px solid ${form.name && form.email ? GOLD_20 : "rgba(176,142,80,0.08)"}`,
            color: form.name && form.email ? GOLD : GOLD_DIM,
            fontSize: "0.52rem",
            letterSpacing: "0.25em",
            padding: "16px",
            cursor: form.name && form.email && !submitting ? "pointer" : "not-allowed",
            fontFamily: "'JetBrains Mono', monospace",
            borderRadius: "6px",
            opacity: !form.name || !form.email ? 0.4 : 1,
            marginBottom: "16px",
          }}
        >
          {submitting ? "CONNECTING..." : "ENTER THE FOUNDING COUNCIL — $4,997"}
        </button>

        <p style={{
          color: "rgba(176,142,80,0.2)",
          fontSize: "0.4rem",
          textAlign: "center",
          lineHeight: 1.7,
        }}>
          Secure checkout via Stripe · 1% equity · 12 seats worldwide<br />
          Questions? Talk to XI on the 808 channel.
        </p>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <div style={{
        borderTop: `1px solid ${GOLD_10}`,
        padding: "32px 24px",
        textAlign: "center",
      }}>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" }}>
          {[
            { label: "GATE", href: "/" },
            { label: "CIRCLE", href: "/circle" },
            { label: "MAYDAY", href: "/founding48" },
            { label: "ALI'I STONE", href: "/stones/alii" },
            { label: "SERVICES", href: "/services" },
          ].map(link => (
            <a key={link.label} href={link.href} style={{
              color: "rgba(176,142,80,0.3)",
              fontSize: "0.38rem",
              textDecoration: "none",
              letterSpacing: "0.15em",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = GOLD_DIM}
              onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(176,142,80,0.3)"}
            >
              {link.label}
            </a>
          ))}
        </div>
        <p style={{ color: "rgba(176,142,80,0.1)", fontSize: "0.36rem", letterSpacing: "0.15em" }}>
          Mākoa Order · Co-Founding Council · 2026
        </p>
      </div>
    </div>
  );
}
