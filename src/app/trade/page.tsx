"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";
const GREEN_10 = "rgba(63,185,80,0.1)";
const BLUE = "#58a6ff";
const BLUE_20 = "rgba(88,166,255,0.2)";
const BLUE_10 = "rgba(88,166,255,0.1)";
const AMBER = "#f0883e";
const AMBER_20 = "rgba(240,136,62,0.2)";
const AMBER_10 = "rgba(240,136,62,0.1)";
const BG = "#04060a";

const CARGO = [
  {
    id: "labor",
    icon: "⚒",
    color: AMBER,
    bg: AMBER_10,
    border: AMBER_20,
    label: "FIRST CARGO",
    title: "Labor",
    sub: "Skilled men, organized and dispatched.",
    doctrine: "The oldest trade in the world. Men who work, organized. Construction, landscaping, maintenance, hauling, renovation. The margin goes to the house — not a middleman, not a corporation. A brotherhood-backed labor cooperative with territory rights.",
    lines: [
      "Construction & renovation crews",
      "Landscaping & property maintenance",
      "Hauling, moving, and logistics",
      "Electrical, plumbing, handyman",
      "80% to the brother · 20% to the house",
      "Dispatched by XI · Backed by the order",
    ],
    stat: "$500–$5K per job",
    statLabel: "per engagement",
  },
  {
    id: "knowledge",
    icon: "◈",
    color: BLUE,
    bg: BLUE_10,
    border: BLUE_20,
    label: "SECOND CARGO",
    title: "Knowledge",
    sub: "The most valuable cargo on any route.",
    doctrine: "Brother teaches brother. Welding, electrical, finance, breathwork, code, business. The Peer Academies are the curriculum network — skills flow from Aliʻi down to Nā Koa. Knowledge has always been the most protected cargo on any trade route. We don't sell courses. We transmit mastery.",
    lines: [
      "Trade skills: welding, electrical, plumbing",
      "Business, finance, and entrepreneurship",
      "Coding, digital, and tech literacy",
      "Men's healing, breathwork, mental fitness",
      "Taught by Mana brothers — men who do the work",
      "Open to community · Not just members",
    ],
    stat: "$97–$297",
    statLabel: "per workshop",
  },
  {
    id: "territory",
    icon: "◉",
    color: GREEN,
    bg: GREEN_10,
    border: GREEN_20,
    label: "THIRD CARGO",
    title: "Territory",
    sub: "The route itself is the product.",
    doctrine: "Mākoa Houses are nodes on the route. West Oahu → Maui → Big Island → West Coast → Pacific Rim. Each house is a waypoint. Each city is a port. The trade route is a franchise of men, not goods. Territory rights are held by the order — not by any individual. The man who holds a territory holds it in trust for the brotherhood.",
    lines: [
      "West Oahu — FOUNDING 2026",
      "Maui · Big Island · Kauai — 2027",
      "West Coast · Pacific — 2028",
      "Mainland USA · Pacific Rim — 2029",
      "Worldwide — 2030",
      "Each node: 1 house · 1 chief · 1 route",
    ],
    stat: "50 nodes",
    statLabel: "by 2030",
  },
];

const ROUTE_NODES = [
  { year: "2026", city: "West Oahu", status: "FOUNDING", color: GOLD, active: true },
  { year: "2027", city: "Maui", status: "FORMING", color: BLUE, active: false },
  { year: "2027", city: "Big Island", status: "FORMING", color: BLUE, active: false },
  { year: "2027", city: "Kauai", status: "FORMING", color: BLUE, active: false },
  { year: "2028", city: "West Coast", status: "VISION", color: GREEN, active: false },
  { year: "2028", city: "Pacific Islands", status: "VISION", color: GREEN, active: false },
  { year: "2029", city: "Mainland USA", status: "VISION", color: GOLD_DIM, active: false },
  { year: "2030", city: "Pacific Rim", status: "VISION", color: GOLD_DIM, active: false },
];

const LAWS = [
  {
    num: "I",
    title: "The Man IS the Trade",
    body: "The trade isn't what you sell. The trade is the men. A man who passes the gate becomes a node in the network. His skill is inventory. His house is a port. His brotherhood is route protection.",
  },
  {
    num: "II",
    title: "The House Holds the Territory",
    body: "No individual owns a territory. The Mākoa House holds it in trust. When a brother leaves, the territory stays. The route is permanent. The men are temporary. The order is forever.",
  },
  {
    num: "III",
    title: "The Route Protects Itself",
    body: "Brotherhood is the moat. A competitor can undercut your price. They cannot replicate your brotherhood. The route is protected by loyalty, not by contract.",
  },
  {
    num: "IV",
    title: "Revenue Funds the Next Node",
    body: "Every dollar earned by the trade funds the next house. The next house opens the next city. The next city builds more brothers. The loop never stops. This is the 100-year mission.",
  },
  {
    num: "V",
    title: "The Chief Holds the Line",
    body: "Each node has one chief. He is accountable to the order, not to a corporation. He holds the territory, trains the brothers, and dispatches the route. The chief is the trade.",
  },
];

export default function TradePage() {
  const [revealed, setRevealed] = useState(false);
  const [activeCargo, setActiveCargo] = useState<string | null>("labor");

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        @keyframes routePulse { 0%,100% { box-shadow: 0 0 0 0 rgba(176,142,80,0.4); } 50% { box-shadow: 0 0 0 8px rgba(176,142,80,0); } }
        @keyframes goldGlow { 0%,100% { box-shadow: 0 0 12px rgba(176,142,80,0.1); } 50% { box-shadow: 0 0 40px rgba(176,142,80,0.3); } }
        .cargo-card { transition: border-color 0.2s ease, background 0.2s ease; }
        .cargo-card:hover { cursor: pointer; }
        .law-row { transition: background 0.15s ease; }
        .law-row:hover { background: rgba(176,142,80,0.04) !important; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "64px 24px 56px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.1) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_40}, transparent)`, marginBottom: 48 }} />

        <p style={{
          color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.35em",
          marginBottom: 20, animation: "fadeUp 0.7s ease 0.1s both",
        }}>
          MĀKOA ORDER · COMMERCIAL DOCTRINE
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: GOLD,
          fontSize: "clamp(2.4rem, 8vw, 4rem)",
          lineHeight: 1.05,
          margin: "0 0 12px",
          animation: "fadeUp 0.8s ease 0.2s both",
        }}>
          Mākoa Trade Co.
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "rgba(232,224,208,0.5)",
          fontSize: "1.15rem",
          marginBottom: 28,
          animation: "fadeUp 0.8s ease 0.35s both",
        }}>
          A brotherhood with territory rights, governance structure,<br />
          and a 100-year mission built around an actual trade.
        </p>

        {/* The three cargos */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap",
          animation: "fadeUp 0.8s ease 0.5s both",
        }}>
          {[
            { label: "LABOR", color: AMBER },
            { label: "KNOWLEDGE", color: BLUE },
            { label: "TERRITORY", color: GREEN },
          ].map(c => (
            <div key={c.label} style={{
              padding: "6px 16px",
              border: `1px solid ${c.color}40`,
              borderRadius: 4,
              color: c.color,
              fontSize: "0.42rem",
              letterSpacing: "0.22em",
              background: `${c.color}08`,
            }}>{c.label}</div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px" }}>

        {/* ── THE DOCTRINE ─────────────────────────────────────────────────── */}
        <div style={{
          margin: "40px 0 32px",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.28em", marginBottom: 20 }}>
            THE QUESTION THAT UNLOCKS EVERYTHING
          </p>

          <div style={{
            background: "rgba(176,142,80,0.04)",
            border: `1px solid ${GOLD_40}`,
            borderRadius: 12,
            padding: "28px 24px",
            position: "relative",
            overflow: "hidden",
            animation: "goldGlow 5s ease-in-out infinite",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "#e8e0d0",
              fontSize: "1.3rem",
              lineHeight: 1.9,
              marginBottom: 20,
            }}>
              "What does the trade route actually sell or move?"
            </p>

            <div style={{ height: 1, background: GOLD_20, marginBottom: 20 }} />

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: GOLD,
              fontSize: "1.5rem",
              lineHeight: 1.7,
              marginBottom: 16,
            }}>
              The trade isn't what you sell.<br />
              The trade is the men.
            </p>

            <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.5rem", lineHeight: 1.9 }}>
              A man who passes the gate becomes a node in the network. His skill is inventory. His house is a port. His brotherhood is route protection. The route moves three things: <span style={{ color: AMBER }}>labor</span>, <span style={{ color: BLUE }}>knowledge</span>, and <span style={{ color: GREEN }}>territory</span>. Everything else is downstream of that.
            </p>
          </div>
        </div>

        {/* ── THREE CARGOS ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", whiteSpace: "nowrap" }}>WHAT THE ROUTE MOVES</p>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
        </div>

        <div style={{ display: "grid", gap: 14, marginBottom: 40 }}>
          {CARGO.map((c) => (
            <div
              key={c.id}
              className="cargo-card"
              onClick={() => setActiveCargo(activeCargo === c.id ? null : c.id)}
              style={{
                border: `1px solid ${activeCargo === c.id ? c.color : c.border}`,
                borderRadius: 12,
                background: activeCargo === c.id ? c.bg : "rgba(8,10,15,0.8)",
                padding: "22px 20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(135deg, ${c.color}05 0%, transparent 60%)`,
                pointerEvents: "none",
              }} />

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: c.color, fontSize: "0.38rem", letterSpacing: "0.22em", marginBottom: 8 }}>{c.label}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ color: c.color, fontSize: "1.4rem", lineHeight: 1 }}>{c.icon}</span>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      color: "#e8e0d0",
                      fontSize: "1.4rem",
                      lineHeight: 1.1,
                    }}>{c.title}</p>
                  </div>
                  <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.47rem", lineHeight: 1.5 }}>{c.sub}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, marginLeft: 12 }}>
                  <span style={{ color: c.color, fontSize: "0.8rem" }}>{activeCargo === c.id ? "−" : "+"}</span>
                  <div style={{
                    background: `${c.color}12`,
                    border: `1px solid ${c.border}`,
                    borderRadius: 4,
                    padding: "4px 8px",
                    textAlign: "right",
                  }}>
                    <p style={{ color: c.color, fontSize: "0.5rem", fontWeight: 700 }}>{c.stat}</p>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem" }}>{c.statLabel}</p>
                  </div>
                </div>
              </div>

              {activeCargo === c.id && (
                <div style={{ marginTop: 20 }}>
                  <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.48rem", lineHeight: 1.9, marginBottom: 16 }}>
                    {c.doctrine}
                  </p>
                  <div style={{ display: "grid", gap: 6 }}>
                    {c.lines.map(line => (
                      <div key={line} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ color: c.color, fontSize: "0.44rem", flexShrink: 0, marginTop: 1 }}>→</span>
                        <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.46rem", lineHeight: 1.5 }}>{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── THE LOOP ─────────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(176,142,80,0.03)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "28px 22px",
          marginBottom: 40,
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.28em", marginBottom: 20 }}>
            THE SELF-FUNDING LOOP
          </p>

          <div style={{ display: "grid", gap: 6 }}>
            {[
              { step: "01", text: "Man passes the gate", color: GOLD_DIM },
              { step: "02", text: "XI assigns tier — skill inventory logged", color: GOLD_DIM },
              { step: "03", text: "Skill becomes a service on the route", color: AMBER },
              { step: "04", text: "Service generates revenue", color: AMBER },
              { step: "05", text: "20% funds the house · 80% to the brother", color: BLUE },
              { step: "06", text: "House funds the next node", color: BLUE },
              { step: "07", text: "Next node opens a new city", color: GREEN },
              { step: "08", text: "New city recruits new brothers", color: GREEN },
              { step: "∞", text: "The loop never stops", color: GOLD, bold: true },
            ].map((row) => (
              <div key={row.step} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "8px 12px",
                background: row.step === "∞" ? `${GOLD}10` : "rgba(0,0,0,0.2)",
                border: `1px solid ${row.step === "∞" ? GOLD_40 : "rgba(176,142,80,0.06)"}`,
                borderRadius: 5,
              }}>
                <span style={{
                  color: row.color,
                  fontSize: "0.4rem",
                  fontWeight: 700,
                  minWidth: 20,
                  flexShrink: 0,
                }}>{row.step}</span>
                <p style={{
                  color: row.step === "∞" ? GOLD : "rgba(232,224,208,0.6)",
                  fontSize: "0.47rem",
                  fontWeight: row.bold ? 700 : 400,
                  fontStyle: row.bold ? "italic" : "normal",
                  fontFamily: row.bold ? "'Cormorant Garamond', serif" : "inherit",
                  lineHeight: 1.4,
                }}>{row.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── THE ROUTE MAP ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", whiteSpace: "nowrap" }}>THE ROUTE MAP</p>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
        </div>

        <div style={{ display: "grid", gap: 8, marginBottom: 40 }}>
          {ROUTE_NODES.map((node, i) => (
            <div key={`${node.year}-${node.city}`} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 16px",
              background: node.active ? `${GOLD}08` : "rgba(0,0,0,0.2)",
              border: `1px solid ${node.color}${node.active ? "50" : "20"}`,
              borderRadius: 8,
              position: "relative",
            }}>
              {/* Route line connector */}
              {i < ROUTE_NODES.length - 1 && (
                <div style={{
                  position: "absolute",
                  left: 27,
                  bottom: -8,
                  width: 1,
                  height: 8,
                  background: `${node.color}30`,
                  zIndex: 1,
                }} />
              )}

              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                border: `1px solid ${node.color}${node.active ? "60" : "30"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                background: node.active ? `${GOLD}20` : "transparent",
                animation: node.active ? "routePulse 2.5s ease-in-out infinite" : "none",
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: node.active ? GOLD : `${node.color}50`,
                }} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <p style={{ color: node.active ? "#e8e0d0" : "rgba(232,224,208,0.5)", fontSize: "0.5rem" }}>{node.city}</p>
                  <span style={{
                    background: `${node.color}15`,
                    border: `1px solid ${node.color}30`,
                    color: node.color,
                    fontSize: "0.34rem",
                    letterSpacing: "0.12em",
                    padding: "2px 6px",
                    borderRadius: 3,
                  }}>{node.status}</span>
                </div>
                <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem" }}>{node.year}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── THE FIVE LAWS ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", whiteSpace: "nowrap" }}>TRADE CO. DOCTRINE</p>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
        </div>

        <div style={{ display: "grid", gap: 2, marginBottom: 40 }}>
          {LAWS.map((law) => (
            <div key={law.num} className="law-row" style={{
              padding: "18px 16px",
              background: "rgba(0,0,0,0.2)",
              border: `1px solid ${GOLD_20}`,
              borderRadius: 8,
            }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: `1px solid ${GOLD_40}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  background: GOLD_10,
                }}>
                  <span style={{ color: GOLD, fontSize: "0.44rem", fontWeight: 700 }}>{law.num}</span>
                </div>
                <div>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    color: "#e8e0d0",
                    fontSize: "1.05rem",
                    marginBottom: 6,
                    lineHeight: 1.2,
                  }}>{law.title}</p>
                  <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.46rem", lineHeight: 1.8 }}>{law.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── REVENUE ARCHITECTURE ─────────────────────────────────────────── */}
        <div style={{
          background: "#080b10",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "26px 22px",
          marginBottom: 40,
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.28em", marginBottom: 6 }}>
            REVENUE ARCHITECTURE
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.5)",
            fontSize: "1.0rem",
            marginBottom: 22,
          }}>
            Three streams. One loop.
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            {[
              { stream: "Labor Route", formula: "20% of job revenue", example: "10 jobs/mo avg $1,200 = $2,400/mo to house", color: AMBER },
              { stream: "Knowledge Route", formula: "$97–$297 per workshop", example: "8 workshops/mo = $1,600–$2,400/mo", color: BLUE },
              { stream: "Territory Dues", formula: "Brothers × $497/yr", example: "72 brothers = $35,784/yr", color: GREEN },
              { stream: "Co-Founder Seats", formula: "12 seats × $4,997", example: "One-time: $59,964 founding capital", color: GOLD },
            ].map(r => (
              <div key={r.stream} style={{
                padding: "12px 14px",
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${r.color}20`,
                borderLeft: `3px solid ${r.color}`,
                borderRadius: "0 6px 6px 0",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <p style={{ color: r.color, fontSize: "0.44rem", letterSpacing: "0.1em" }}>{r.stream}</p>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem" }}>{r.formula}</p>
                </div>
                <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.44rem", lineHeight: 1.5 }}>{r.example}</p>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: GOLD_20, margin: "20px 0" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Year 1 Target", value: "$120K", sub: "1 house · 72 brothers" },
              { label: "Year 3 Target", value: "$1.2M", sub: "10 nodes · 500 brothers" },
            ].map(stat => (
              <div key={stat.label} style={{
                textAlign: "center",
                padding: "16px",
                background: "rgba(176,142,80,0.04)",
                border: `1px solid ${GOLD_20}`,
                borderRadius: 8,
              }}>
                <p style={{ color: GOLD, fontSize: "1.6rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{stat.value}</p>
                <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.12em", marginTop: 4 }}>{stat.label}</p>
                <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", marginTop: 2 }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── THE 100-YEAR MISSION ─────────────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg, #0d0f14 0%, #080a0f 100%)",
          border: `1px solid ${GOLD_40}`,
          borderRadius: 12,
          padding: "32px 24px",
          marginBottom: 32,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <span style={{ color: GOLD_DIM, fontSize: "2rem", display: "block", marginBottom: 20, animation: "breathe 3s ease-in-out infinite" }}>◈</span>

          <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.28em", marginBottom: 20 }}>
            THE 100-YEAR MISSION
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "1.25rem",
            lineHeight: 2.0,
            marginBottom: 24,
          }}>
            Not a company.<br />
            A civilization infrastructure.<br />
            Built by men who pass the gate.
          </p>

          <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.48rem", lineHeight: 1.9, marginBottom: 28, maxWidth: 380, margin: "0 auto 28px" }}>
            In 100 years, Mākoa Trade Co. will be the largest brotherhood-backed labor and knowledge network in the Pacific. Every node will be self-sustaining. Every house will be owned by the order. Every brother will have a trade, a territory, and a legacy.
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            <a href="/cofounder" style={{
              display: "block",
              background: GOLD,
              color: "#000",
              borderRadius: 6,
              padding: "15px",
              fontSize: "0.52rem",
              letterSpacing: "0.2em",
              textDecoration: "none",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              textAlign: "center",
            }}>
              CLAIM A CO-FOUNDER SEAT
            </a>
            <a href="/gate" style={{
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
            }}>
              ENTER THE GATE — JOIN THE ORDER
            </a>
            <a href="/mana-makoa" style={{
              display: "block",
              background: "transparent",
              color: "rgba(232,224,208,0.3)",
              border: `1px solid rgba(232,224,208,0.08)`,
              borderRadius: 6,
              padding: "13px",
              fontSize: "0.46rem",
              letterSpacing: "0.15em",
              textDecoration: "none",
              fontFamily: "'JetBrains Mono', monospace",
              textAlign: "center",
            }}>
              VIEW MANA MAKOA — THE COMMERCIAL ARM
            </a>
          </div>
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
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
            {[
              { href: "/gate", label: "THE GATE" },
              { href: "/mana-makoa", label: "MANA MAKOA" },
              { href: "/cofounder", label: "CO-FOUNDER" },
              { href: "/sponsor", label: "SPONSOR" },
            ].map(link => (
              <a key={link.href} href={link.href} style={{
                color: "rgba(176,142,80,0.3)",
                fontSize: "0.4rem",
                letterSpacing: "0.15em",
                textDecoration: "none",
              }}>{link.label}</a>
            ))}
          </div>
          <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.4rem", letterSpacing: "0.15em" }}>
            MĀKOA TRADE CO. · MĀKOA ORDER · MALU TRUST · WEST OAHU · WORLDWIDE · 2026
          </p>
        </div>

      </div>
    </div>
  );
}
