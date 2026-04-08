"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const BLUE = "#58a6ff";
const BLUE_20 = "rgba(88,166,255,0.2)";
const BLUE_10 = "rgba(88,166,255,0.1)";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";
const GREEN_10 = "rgba(63,185,80,0.1)";
const BG = "#04060a";

const SERVICES = [
  {
    id: "academies",
    color: BLUE,
    bg: BLUE_10,
    border: BLUE_20,
    icon: "🎓",
    tier: "MANA · PEER ACADEMIES",
    title: "Trade & Skills Academies",
    sub: "Brother teaches brother. Community learns.",
    price: "$97–$297 per workshop",
    items: [
      "Construction, electrical, plumbing, welding",
      "Business, finance, and entrepreneurship",
      "Coding, digital skills, and tech",
      "Men's healing, breathwork, and mental fitness",
      "Taught by Mana brothers — men who do the work",
      "Open to community — not just members",
    ],
    cta: "REQUEST A WORKSHOP",
    ctaHref: "mailto:wakachief@gmail.com?subject=Mana Makoa Academy Request",
  },
  {
    id: "home",
    color: GOLD,
    bg: GOLD_10,
    border: GOLD_40,
    icon: "🏠",
    tier: "MANA · HOME SERVICES",
    title: "Pro Home & Property Services",
    sub: "Brotherhood-backed. Quality guaranteed.",
    price: "Market rate · Brother-run",
    items: [
      "Construction and renovation",
      "Landscaping and yard work",
      "Cleaning and property maintenance",
      "Moving and hauling",
      "Repair and handyman services",
      "80% to the brother · 20% funds the house",
    ],
    cta: "BOOK A SERVICE",
    ctaHref: "mailto:wakachief@gmail.com?subject=Mana Makoa Home Service Request",
  },
  {
    id: "b2b",
    color: GOLD,
    bg: GOLD_10,
    border: GOLD_20,
    icon: "🤝",
    tier: "ALIʻI · B2B SERVICES",
    title: "Business & Professional Services",
    sub: "Aliʻi brothers serving companies.",
    price: "$500–$5,000 per engagement",
    items: [
      "Business consulting and strategy",
      "Project management and operations",
      "Leadership development for teams",
      "Mentorship programs for organizations",
      "Community partnership and outreach",
      "Founding brother network access",
    ],
    cta: "PARTNER WITH US",
    ctaHref: "mailto:wakachief@gmail.com?subject=Mana Makoa B2B Partnership",
  },
  {
    id: "elite",
    color: GREEN,
    bg: GREEN_10,
    border: GREEN_20,
    icon: "⚡",
    tier: "ALL TIERS · ELITE TRAINING",
    title: "Elite Reset & Training Programs",
    sub: "4am. Ice. Brotherhood. No performance.",
    price: "$500–$5,000 per engagement",
    items: [
      "Corporate team reset (4am ice bath + circle)",
      "Leadership immersion — 1 or 2 day format",
      "Men's wellness programs for organizations",
      "Sports team mental conditioning",
      "Community 4am training events",
      "Founding brother facilitation team",
    ],
    cta: "BOOK ELITE TRAINING",
    ctaHref: "mailto:wakachief@gmail.com?subject=Mana Makoa Elite Training Request",
  },
];

const EXPANSION = [
  { year: "2026", label: "West Oahu", status: "FOUNDING", color: GOLD, brothers: 72, houses: 1 },
  { year: "2027", label: "Maui · Big Island · Kauai", status: "FORMING", color: BLUE, brothers: 200, houses: 3 },
  { year: "2028", label: "West Coast · Pacific", status: "VISION", color: GREEN, brothers: 500, houses: 10 },
  { year: "2029", label: "Mainland USA · Pacific Rim", status: "VISION", color: GOLD_DIM, brothers: 1200, houses: 25 },
  { year: "2030", label: "Worldwide", status: "VISION", color: GOLD_DIM, brothers: 3000, houses: 50 },
];

const REVENUE_MODEL = [
  { stream: "Annual Dues", formula: "Brothers × $497/yr", example: "72 brothers = $35,784/yr", color: GOLD },
  { stream: "Peer Academies", formula: "$97–$297 × workshops/mo", example: "8 workshops = $1,600–$2,400/mo", color: BLUE },
  { stream: "Home Services", formula: "20% of brother earnings", example: "10 jobs/mo avg $500 = $1,000/mo", color: GOLD },
  { stream: "Elite Training", formula: "$500–$5,000 per engagement", example: "2 corporate resets/mo = $2,000–$10,000", color: GREEN },
];

export default function ManaMakoaPage() {
  const [revealed, setRevealed] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes goldGlow { 0%,100% { box-shadow: 0 0 12px rgba(176,142,80,0.15); } 50% { box-shadow: 0 0 32px rgba(176,142,80,0.4); } }
        @keyframes paperclipPulse { 0%,100% { opacity:0.7; transform:scale(1); } 50% { opacity:1; transform:scale(1.02); } }
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
          background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_40}, transparent)`, marginBottom: 40 }} />

        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em", marginBottom: 16, animation: "fadeUp 0.8s ease 0.1s both" }}>
          MĀKOA ORDER · COMMERCIAL ARM
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: GOLD,
          fontSize: "3rem",
          lineHeight: 1.1,
          margin: "0 0 16px",
          animation: "fadeUp 0.9s ease 0.2s both",
        }}>
          Mana Makoa
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "rgba(232,224,208,0.6)",
          fontSize: "1.2rem",
          marginBottom: 12,
          animation: "fadeUp 0.9s ease 0.35s both",
        }}>
          Brotherhood-backed. Worldwide.
        </p>

        <p style={{
          color: "rgba(232,224,208,0.35)",
          fontSize: "0.5rem",
          lineHeight: 1.8,
          maxWidth: 360,
          margin: "0 auto 32px",
          animation: "fadeUp 0.9s ease 0.5s both",
        }}>
          Peer-to-peer academies. Pro home services. Elite training and reset. B2B partnerships. Built by brothers. Sustained by the order.
        </p>

        {/* Tier badges */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap",
          animation: "fadeUp 0.9s ease 0.6s both",
        }}>
          {[
            { label: "NĀ KOA", color: GREEN },
            { label: "MANA", color: BLUE },
            { label: "ALIʻI", color: GOLD },
          ].map(t => (
            <div key={t.label} style={{
              padding: "5px 14px",
              border: `1px solid ${t.color}40`,
              borderRadius: 4,
              color: t.color,
              fontSize: "0.4rem",
              letterSpacing: "0.2em",
            }}>{t.label}</div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>

        {/* ── THE PAPERCLIP PRINCIPLE ───────────────────────────────────────── */}
        <div style={{
          margin: "32px 0",
          background: "rgba(176,142,80,0.04)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "26px 22px",
          position: "relative",
          overflow: "hidden",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.25em", marginBottom: 16 }}>
            THE XI PAPERCLIP PRINCIPLE
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "1.15rem",
            lineHeight: 2.0,
            marginBottom: 16,
          }}>
            Every brother is a paperclip factory.<br />
            Not making paperclips.<br />
            Making brotherhood.
          </p>

          <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.48rem", lineHeight: 1.9, marginBottom: 18 }}>
            Every skill a brother has becomes a service. Every service generates revenue. Every dollar of revenue funds the next Makoa House. Every house opens a new city. Every city builds more brothers. The loop never stops.
          </p>

          {/* The loop visual */}
          <div style={{ display: "grid", gap: 6 }}>
            {[
              "Brother joins → XI assigns tier",
              "Brother trains → skill.md created",
              "Skill becomes service → Mana Makoa",
              "Service generates revenue",
              "Revenue funds next house",
              "Next house opens → new brothers join",
              "↑ Loop repeats worldwide",
            ].map((step, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "7px 12px",
                background: i === 6 ? `${GOLD}10` : "rgba(0,0,0,0.2)",
                border: `1px solid ${i === 6 ? GOLD_40 : "rgba(176,142,80,0.06)"}`,
                borderRadius: 5,
              }}>
                <span style={{ color: i === 6 ? GOLD : GOLD_DIM, fontSize: "0.44rem", flexShrink: 0 }}>
                  {i === 6 ? "◈" : `${i + 1}.`}
                </span>
                <p style={{
                  color: i === 6 ? GOLD : "rgba(232,224,208,0.6)",
                  fontSize: "0.46rem",
                  fontWeight: i === 6 ? 700 : 400,
                  fontStyle: i === 6 ? "italic" : "normal",
                  fontFamily: i === 6 ? "'Cormorant Garamond', serif" : "inherit",
                }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SERVICES ──────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", whiteSpace: "nowrap" }}>WHAT WE OFFER</p>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
        </div>

        {SERVICES.map((svc, i) => (
          <div
            key={svc.id}
            style={{
              border: `1px solid ${svc.border}`,
              borderRadius: 12,
              background: `linear-gradient(135deg, #0a0d12 0%, #080a0f 100%)`,
              padding: "24px 20px",
              marginBottom: 16,
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
              borderColor: activeService === svc.id ? svc.color : svc.border,
            }}
            onClick={() => setActiveService(activeService === svc.id ? null : svc.id)}
          >
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(135deg, ${svc.color}06 0%, transparent 60%)`,
              pointerEvents: "none",
            }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: svc.color, fontSize: "0.38rem", letterSpacing: "0.2em", marginBottom: 6 }}>{svc.tier}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "1.2rem" }}>{svc.icon}</span>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    color: "#e8e0d0",
                    fontSize: "1.2rem",
                    lineHeight: 1.2,
                  }}>{svc.title}</p>
                </div>
              </div>
              <span style={{ color: svc.color, fontSize: "0.7rem", marginTop: 4 }}>
                {activeService === svc.id ? "−" : "+"}
              </span>
            </div>

            <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.46rem", lineHeight: 1.6, marginBottom: 10 }}>
              {svc.sub}
            </p>

            <div style={{
              display: "inline-flex",
              background: `${svc.color}12`,
              border: `1px solid ${svc.border}`,
              borderRadius: 4,
              padding: "4px 10px",
              marginBottom: activeService === svc.id ? 16 : 0,
            }}>
              <span style={{ color: svc.color, fontSize: "0.42rem", letterSpacing: "0.1em" }}>{svc.price}</span>
            </div>

            {/* Expanded details */}
            {activeService === svc.id && (
              <div>
                <div style={{ display: "grid", gap: 6, marginBottom: 16 }}>
                  {svc.items.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ color: svc.color, fontSize: "0.44rem", flexShrink: 0, marginTop: 1 }}>→</span>
                      <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.46rem", lineHeight: 1.5 }}>{item}</p>
                    </div>
                  ))}
                </div>
                <a
                  href={svc.ctaHref}
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: "block",
                    textAlign: "center",
                    background: svc.color === GOLD ? GOLD : "transparent",
                    color: svc.color === GOLD ? "#000" : svc.color,
                    border: `1px solid ${svc.color}`,
                    borderRadius: 6,
                    padding: "12px",
                    fontSize: "0.48rem",
                    letterSpacing: "0.18em",
                    textDecoration: "none",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                  }}
                >
                  {svc.cta}
                </a>
              </div>
            )}
          </div>
        ))}

        {/* ── REVENUE MODEL ─────────────────────────────────────────────────── */}
        <div style={{
          marginTop: 32,
          background: "#080b10",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "26px 22px",
          marginBottom: 32,
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.25em", marginBottom: 6 }}>
            THE REVENUE MODEL
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.6)",
            fontSize: "1.0rem",
            marginBottom: 20,
          }}>
            Brotherhood sustains itself.
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            {REVENUE_MODEL.map(r => (
              <div key={r.stream} style={{
                padding: "12px 14px",
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${r.color}20`,
                borderLeft: `3px solid ${r.color}`,
                borderRadius: "0 6px 6px 0",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <p style={{ color: r.color, fontSize: "0.44rem", letterSpacing: "0.12em" }}>{r.stream}</p>
                  <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.4rem" }}>{r.formula}</p>
                </div>
                <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.44rem", lineHeight: 1.5 }}>{r.example}</p>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: GOLD_20, margin: "20px 0" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Year 1 Target", value: "$35K", sub: "1 house · 72 brothers" },
              { label: "Year 3 Target", value: "$350K", sub: "10 houses · 500 brothers" },
            ].map(stat => (
              <div key={stat.label} style={{
                textAlign: "center",
                padding: "14px",
                background: "rgba(176,142,80,0.04)",
                border: `1px solid ${GOLD_20}`,
                borderRadius: 8,
              }}>
                <p style={{ color: GOLD, fontSize: "1.4rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{stat.value}</p>
                <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.12em", marginTop: 4 }}>{stat.label}</p>
                <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", marginTop: 2 }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── WORLDWIDE EXPANSION MAP ───────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", whiteSpace: "nowrap" }}>WORLDWIDE EXPANSION</p>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {EXPANSION.map((phase, i) => (
              <div key={phase.year} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px",
                background: i === 0 ? `${GOLD}08` : "rgba(0,0,0,0.2)",
                border: `1px solid ${phase.color}${i === 0 ? "40" : "20"}`,
                borderRadius: 8,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  border: `1px solid ${phase.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  background: i === 0 ? `${GOLD}15` : "transparent",
                }}>
                  <p style={{ color: phase.color, fontSize: "0.4rem", fontWeight: 700 }}>{phase.year}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <p style={{ color: "#e8e0d0", fontSize: "0.5rem" }}>{phase.label}</p>
                    <span style={{
                      background: `${phase.color}15`,
                      border: `1px solid ${phase.color}30`,
                      color: phase.color,
                      fontSize: "0.34rem",
                      letterSpacing: "0.12em",
                      padding: "2px 6px",
                      borderRadius: 3,
                    }}>{phase.status}</span>
                  </div>
                  <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem" }}>
                    {phase.houses} house{phase.houses > 1 ? "s" : ""} · {phase.brothers.toLocaleString()} brothers
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── JOIN THE COMPANY ──────────────────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg, #0d0f14 0%, #080a0f 100%)",
          border: `1px solid ${GOLD_40}`,
          borderRadius: 12,
          padding: "28px 22px",
          marginBottom: 28,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          animation: "goldGlow 4s ease-in-out infinite",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <span style={{ color: GOLD_DIM, fontSize: "1.5rem", display: "block", marginBottom: 16, animation: "breathe 3s ease-in-out infinite" }}>◈</span>

          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.25em", marginBottom: 16 }}>
            JOIN THE COMPANY
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "1.1rem",
            lineHeight: 2.0,
            marginBottom: 20,
          }}>
            You don't work for Mana Makoa.<br />
            You are Mana Makoa.<br />
            Your skill is the company.
          </p>

          <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
            <a
              href="/gate"
              style={{
                display: "block",
                background: GOLD,
                color: "#000",
                border: "none",
                borderRadius: 6,
                padding: "15px",
                fontSize: "0.52rem",
                letterSpacing: "0.2em",
                textDecoration: "none",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              ENTER THE GATE — JOIN THE ORDER
            </a>
            <a
              href="mailto:wakachief@gmail.com?subject=Mana Makoa — I want to offer my skills"
              style={{
                display: "block",
                background: "transparent",
                color: GOLD_DIM,
                border: `1px solid ${GOLD_20}`,
                borderRadius: 6,
                padding: "13px",
                fontSize: "0.48rem",
                letterSpacing: "0.15em",
                textDecoration: "none",
                fontFamily: "'JetBrains Mono', monospace",
                textAlign: "center",
              }}
            >
              OFFER YOUR SKILLS — CONTACT XI
            </a>
          </div>

          <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.42rem" }}>
            wakachief@gmail.com · Telegram: t.me/+dsS4Mz0p5wM4OGYx
          </p>
        </div>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
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
          <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.42rem", marginBottom: 6 }}>
            Questions: wakachief@gmail.com
          </p>
          <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.4rem", letterSpacing: "0.15em" }}>
            MANA MAKOA · MĀKOA ORDER · MALU TRUST · WEST OAHU · WORLDWIDE · 2026
          </p>
        </div>

      </div>
    </div>
  );
}
