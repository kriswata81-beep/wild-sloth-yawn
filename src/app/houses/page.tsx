"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";
const GREEN_10 = "rgba(63,185,80,0.1)";
const BLUE = "#58a6ff";
const BLUE_20 = "rgba(88,166,255,0.2)";
const BLUE_10 = "rgba(88,166,255,0.1)";
const AMBER = "#f0883e";
const AMBER_20 = "rgba(240,136,62,0.2)";
const AMBER_10 = "rgba(240,136,62,0.1)";
const PURPLE = "#a78bfa";
const PURPLE_20 = "rgba(167,139,250,0.2)";
const PURPLE_10 = "rgba(167,139,250,0.1)";
const BG = "#04060a";

// The 3-tier charter hierarchy
const CHARTER_TIERS = [
  {
    tier: "WORLD CHAPTER",
    class: "Aliʻi Global",
    icon: "◉",
    color: GOLD,
    bg: GOLD_10,
    border: GOLD_20,
    seats: "1 World Chapter",
    territory: "All Makoa Houses worldwide",
    description: "The founding doctrine. Holds equity in all trade routes globally. Sets the law of the house. Every Makoa Stone in every house bears the World Chapter seal.",
    rights: [
      "Master Room access at every Makoa House worldwide",
      "Equity stake in all trade route networks",
      "Charter approval authority for new houses",
      "Co-Founders Founding seat — May 31, Blue Moon",
      "Vote in World Chapter council",
    ],
  },
  {
    tier: "REGIONAL CHARTER",
    class: "Aliʻi Land · Sea · Air",
    icon: "◈",
    color: AMBER,
    bg: AMBER_10,
    border: AMBER_20,
    seats: "Up to 7 per island cluster",
    territory: "Island cluster or metro region",
    description: "Opens a regional charter when Aliʻi takes a Land, Sea, or Air route. Holds equity in all routes within their region. One charter seat per territory. First to claim, first to hold.",
    rights: [
      "Master Room timeshare at all houses in their region",
      "Equity in regional Land · Sea · Air trade routes",
      "Authority to open new Makoa Houses in territory",
      "Wednesday 4AM call hosting rights",
      "Full Moon 72hr War Room access — all regional houses",
    ],
  },
  {
    tier: "MAKOA HOUSE",
    class: "Mana Live-In → Aliʻi",
    icon: "◆",
    color: BLUE,
    bg: BLUE_10,
    border: BLUE_20,
    seats: "1 house per zip cluster",
    territory: "Single zip code cluster",
    description: "A physical house managed by a Mana brother on 90-day live-in. Serves as the hub for the zip cluster — Trade Co dispatch, Academy, War Room, and the path from Mana to Aliʻi.",
    rights: [
      "90-day live-in elevates Mana → Aliʻi class",
      "Manage Trade Co for the zip code cluster",
      "Host Nakoa Trade Academy (9AM–2PM)",
      "Host Wednesday 4AM Elite Reset training",
      "Full Moon 72hr War Room events",
      "Open your own Makoa House upon elevation",
    ],
  },
];

// What's inside every Makoa House
const HOUSE_FEATURES = [
  {
    icon: "◉",
    color: GOLD,
    title: "The Master Room",
    sub: "Aliʻi Timeshare",
    desc: "One room in every Makoa House reserved for Aliʻi-class brothers traveling regionally or globally. Book it. Show up. The house holds you.",
  },
  {
    icon: "⬡",
    color: PURPLE,
    title: "Mana Co-Living",
    sub: "90-Day Live-In",
    desc: "Mana brothers apply to live in the house. 90 days of full immersion — managing the Trade Co, running the Academy, holding the order. Complete it and rise to Aliʻi class.",
  },
  {
    icon: "◈",
    color: AMBER,
    title: "Nakoa Trade Academy",
    sub: "9AM–2PM Daily",
    desc: "The classroom for Nā Koa. Trade skills, business, finance, digital, breathwork. Taught by Mana brothers who do the work. Free for Nā Koa class. The pipeline from Candidate to Operator.",
  },
  {
    icon: "▲",
    color: GREEN,
    title: "Wednesday 4AM Elite Reset",
    sub: "Global · Every Week",
    desc: "The call that never sleeps. 4AM every Wednesday. Brothers from every house, every timezone, every continent. Training. Accountability. Orders from the field. Free to all Nā Koa.",
  },
  {
    icon: "◆",
    color: BLUE,
    title: "Full Moon 72hr War Room",
    sub: "Every Full Moon",
    desc: "72 hours. Mastermind. Strategy. Elevation. Every full moon, the house locks in for a War Room cycle. Open to Mana+ class. Visitors by charter invite.",
  },
  {
    icon: "✦",
    color: "#c9a050",
    title: "B2B Tool Library",
    sub: "SaaS · Equipment · Routes",
    desc: "The house holds the tools — digital (SaaS stack, XI access) and physical (equipment library for Trade Co jobs). Nā Koa class gets free access in exchange for P2P work on the routes.",
  },
];

// The 90-day live-in path
const ELEVATION_PATH = [
  { step: "01", title: "Enter the Gate", desc: "Apply at makoa.live/gate. 12 questions. $9.99 entry. Brotherhood begins here.", class: "Nā Koa", color: BLUE },
  { step: "02", title: "Work the Routes", desc: "Take P2P jobs dispatched by XI. Use the tool library. Attend Wednesday 4AM calls. Build your record.", class: "Nā Koa Active", color: BLUE },
  { step: "03", title: "Rise to Mana", desc: "Consistent attendance, referrals, route performance. Pay the Mana Steward seat ($497/yr). Claim a zip cluster.", class: "Mana Steward", color: AMBER },
  { step: "04", title: "Apply for Live-In", desc: "Apply to manage a Makoa House. 90-day immersion. Run the Academy. Hold the Trade Co. Host the War Room.", class: "Mana Live-In", color: AMBER },
  { step: "05", title: "Complete the 90 Days", desc: "Full 90-day immersion complete. You've managed the house, the routes, and the brothers. The order votes.", class: "Elevation Vote", color: GOLD },
  { step: "06", title: "Aliʻi Seated", desc: "Elevated to Aliʻi class. Equity in trade routes. Master Room access worldwide. Authority to open your own house.", class: "Aliʻi", color: GOLD },
];

// Current charter map
const ACTIVE_CHARTERS = [
  { location: "West Oahu, Hawaiʻi", tier: "MAKOA HOUSE", status: "FOUNDING", class: "Mana Steward 0001", zip: "96792", color: GREEN },
  { location: "Honolulu, Hawaiʻi", tier: "REGIONAL", status: "OPEN", class: "Aliʻi Land", zip: "96801", color: GOLD_DIM },
  { location: "Maui, Hawaiʻi", tier: "REGIONAL", status: "OPEN", class: "Aliʻi Sea", zip: "96732", color: GOLD_DIM },
  { location: "Los Angeles, CA", tier: "MAKOA HOUSE", status: "OPEN", class: "Mana Applicant", zip: "90001", color: GOLD_DIM },
  { location: "Las Vegas, NV", tier: "MAKOA HOUSE", status: "OPEN", class: "Mana Applicant", zip: "89101", color: GOLD_DIM },
  { location: "Auckland, NZ", tier: "REGIONAL", status: "OPEN", class: "Aliʻi Global", zip: "1010", color: GOLD_DIM },
];

export default function HousesPage() {
  const [ready, setReady] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      fontFamily: "'JetBrains Mono', monospace",
      padding: "40px 20px 80px",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .house-card:hover { border-color: rgba(176,142,80,0.25) !important; transform: translateY(-1px); }
        .charter-card:hover { transform: translateY(-2px); }
      `}</style>

      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "48px",
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: GREEN_10,
          border: `1px solid ${GREEN_20}`,
          borderRadius: "4px",
          padding: "5px 12px",
          marginBottom: "16px",
        }}>
          <span style={{ color: GREEN, fontSize: "0.38rem", animation: "pulse 2.5s infinite" }}>◉</span>
          <span style={{ color: GREEN, fontSize: "0.4rem", letterSpacing: "0.18em" }}>WEST OAHU · FOUNDING HOUSE ACTIVE</span>
        </div>

        <p style={{ fontSize: "0.44rem", letterSpacing: "0.3em", color: GOLD_40, marginBottom: "10px" }}>
          MĀKOA ORDER · WORLDWIDE CHARTERS
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "2.8rem",
          color: GOLD,
          margin: "0 0 12px",
          fontWeight: 300,
          lineHeight: 1.1,
        }}>
          The Makoa Houses
        </h1>
        <p style={{
          fontSize: "0.52rem",
          color: "rgba(176,142,80,0.45)",
          maxWidth: "440px",
          margin: "0 auto 10px",
          lineHeight: 1.85,
        }}>
          One house. One zip cluster. One Mana brother who holds it.<br />
          Every house is a charter. Every charter is a gateway to Aliʻi.
        </p>
        <p style={{ color: "rgba(232,224,208,0.15)", fontSize: "0.4rem", letterSpacing: "0.12em" }}>
          Worldwide chapters · Aliʻi equity · Master Room timeshare · 90-day live-in path
        </p>
      </div>

      {/* The Law of the House */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 48px",
        background: GOLD_10,
        border: `1px solid ${GOLD_20}`,
        borderRadius: "8px",
        padding: "24px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.7s ease 0.1s",
      }}>
        <p style={{ color: GOLD, fontSize: "0.44rem", letterSpacing: "0.2em", textAlign: "center", marginBottom: "16px" }}>
          THE LAW OF THE HOUSE
        </p>
        {[
          "One Makoa House per zip cluster — never two.",
          "The Mana brother who lives in holds the Trade Co route for that territory.",
          "Every Nā Koa in the cluster gets P2P jobs, free tools, and Wednesday 4AM access.",
          "90 days complete = Aliʻi elevation. Non-negotiable.",
          "Aliʻi holds equity. Mana holds the route. Nā Koa holds the work.",
          "The Master Room in every house is held for traveling Aliʻi. It does not rent.",
          "The house stone marks the charter. The stone cannot be moved.",
        ].map((law, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
            <span style={{ color: GOLD_40, fontSize: "0.5rem", flexShrink: 0, fontWeight: 600, opacity: 0.7 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.44rem", lineHeight: 1.65 }}>{law}</p>
          </div>
        ))}
      </div>

      {/* Charter Hierarchy */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 48px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.7s ease 0.2s",
      }}>
        <p style={{ color: GOLD_40, fontSize: "0.42rem", letterSpacing: "0.22em", textAlign: "center", marginBottom: "20px" }}>
          CHARTER STRUCTURE
        </p>
        <div style={{ display: "grid", gap: "14px" }}>
          {CHARTER_TIERS.map((tier, i) => (
            <div
              key={i}
              className="charter-card"
              onClick={() => setActiveSection(activeSection === tier.tier ? null : tier.tier)}
              style={{
                background: tier.bg,
                border: `1px solid ${activeSection === tier.tier ? tier.color + "60" : tier.border}`,
                borderRadius: "8px",
                padding: "18px",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ color: tier.color, fontSize: "1.1rem" }}>{tier.icon}</span>
                  <div>
                    <p style={{ color: tier.color, fontSize: "0.46rem", letterSpacing: "0.15em" }}>{tier.tier}</p>
                    <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.38rem", marginTop: "2px" }}>{tier.class}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.38rem" }}>{tier.seats}</p>
                  <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.34rem", marginTop: "2px" }}>{tier.territory}</p>
                </div>
              </div>

              <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.42rem", lineHeight: 1.65, marginBottom: activeSection === tier.tier ? "14px" : "0" }}>
                {tier.description}
              </p>

              {activeSection === tier.tier && (
                <div style={{ animation: "fadeUp 0.25s ease forwards" }}>
                  <div style={{ height: "1px", background: `${tier.color}20`, margin: "0 0 12px" }} />
                  <p style={{ color: tier.color, fontSize: "0.38rem", letterSpacing: "0.15em", marginBottom: "8px" }}>RIGHTS & ACCESS</p>
                  {tier.rights.map((right, ri) => (
                    <div key={ri} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ color: tier.color, fontSize: "0.42rem", flexShrink: 0 }}>+</span>
                      <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.42rem", lineHeight: 1.5 }}>{right}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.38rem", textAlign: "center", marginTop: "10px" }}>
          Tap any tier to expand rights & access
        </p>
      </div>

      {/* Inside Every House */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 48px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.7s ease 0.3s",
      }}>
        <p style={{ color: GOLD_40, fontSize: "0.42rem", letterSpacing: "0.22em", textAlign: "center", marginBottom: "20px" }}>
          INSIDE EVERY MAKOA HOUSE
        </p>
        <div style={{ display: "grid", gap: "10px" }}>
          {HOUSE_FEATURES.map((f, i) => (
            <div key={i} className="house-card" style={{
              background: "rgba(176,142,80,0.03)",
              border: "1px solid rgba(176,142,80,0.08)",
              borderRadius: "7px",
              padding: "16px",
              display: "flex",
              gap: "14px",
              alignItems: "flex-start",
              transition: "all 0.2s ease",
            }}>
              <span style={{ color: f.color, fontSize: "1rem", flexShrink: 0, marginTop: "2px" }}>{f.icon}</span>
              <div>
                <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "4px", flexWrap: "wrap" }}>
                  <p style={{ color: f.color, fontSize: "0.5rem" }}>{f.title}</p>
                  <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.38rem" }}>{f.sub}</p>
                </div>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Elevation Path */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 48px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.7s ease 0.4s",
      }}>
        <p style={{ color: GOLD_40, fontSize: "0.42rem", letterSpacing: "0.22em", textAlign: "center", marginBottom: "8px" }}>
          THE 90-DAY ELEVATION PATH
        </p>
        <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.4rem", textAlign: "center", marginBottom: "20px" }}>
          Nā Koa → Mana → Aliʻi. The path is the same for every brother.
        </p>
        {ELEVATION_PATH.map((step, i) => (
          <div key={i} style={{
            display: "flex",
            gap: "14px",
            padding: "14px 0",
            borderBottom: i < ELEVATION_PATH.length - 1 ? "1px solid rgba(176,142,80,0.06)" : "none",
            position: "relative",
          }}>
            {i < ELEVATION_PATH.length - 1 && (
              <div style={{
                position: "absolute",
                left: "18px",
                top: "36px",
                bottom: "-14px",
                width: "1px",
                background: `${step.color}20`,
              }} />
            )}
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: `1.5px solid ${step.color}40`,
              background: `${step.color}08`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ color: step.color, fontSize: "0.5rem", fontWeight: 600 }}>{step.step}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "3px" }}>
                <p style={{ color: "#e8e0d0", fontSize: "0.5rem" }}>{step.title}</p>
                <span style={{
                  color: step.color,
                  fontSize: "0.34rem",
                  letterSpacing: "0.1em",
                  background: `${step.color}10`,
                  padding: "2px 7px",
                  borderRadius: "2px",
                }}>{step.class}</span>
              </div>
              <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem", lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Makoa House Stones */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 48px",
        background: PURPLE_10,
        border: `1px solid ${PURPLE_20}`,
        borderRadius: "8px",
        padding: "24px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.7s ease 0.45s",
        textAlign: "center",
      }}>
        <span style={{ color: PURPLE, fontSize: "1.5rem", display: "block", marginBottom: "10px" }}>◉</span>
        <p style={{ color: PURPLE, fontSize: "0.48rem", letterSpacing: "0.2em", marginBottom: "10px" }}>
          THE MAKOA HOUSE STONE
        </p>
        <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.44rem", lineHeight: 1.8, maxWidth: "360px", margin: "0 auto 16px" }}>
          Every Makoa House receives a physical stone — carved, numbered, and sealed with the charter date. The stone marks the territory. It holds the history of every brother who passed through. It cannot be moved, sold, or surrendered. It stays with the house.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "16px" }}>
          {[
            { label: "HOUSE #", value: "0001", sub: "West Oahu" },
            { label: "CHARTER DATE", value: "May 2026", sub: "MAYDAY Founding" },
            { label: "STONE CLASS", value: "FOUNDING", sub: "First 100 houses" },
          ].map((s, i) => (
            <div key={i}>
              <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.36rem", letterSpacing: "0.12em", marginBottom: "4px" }}>{s.label}</p>
              <p style={{ color: PURPLE, fontSize: "0.52rem" }}>{s.value}</p>
              <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.34rem", marginTop: "2px" }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charter Map */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 48px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.7s ease 0.5s",
      }}>
        <p style={{ color: GOLD_40, fontSize: "0.42rem", letterSpacing: "0.22em", textAlign: "center", marginBottom: "16px" }}>
          CHARTER MAP — WORLDWIDE
        </p>
        <div style={{ display: "grid", gap: "8px" }}>
          {ACTIVE_CHARTERS.map((c, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: c.status === "FOUNDING" ? GREEN_10 : "rgba(176,142,80,0.03)",
              border: `1px solid ${c.status === "FOUNDING" ? GREEN_20 : "rgba(176,142,80,0.08)"}`,
              borderRadius: "6px",
              padding: "10px 14px",
            }}>
              <div>
                <p style={{ color: c.status === "FOUNDING" ? "#e8e0d0" : "rgba(232,224,208,0.45)", fontSize: "0.48rem", marginBottom: "2px" }}>
                  {c.location}
                </p>
                <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.36rem" }}>{c.tier} · {c.class}</p>
              </div>
              <span style={{
                color: c.status === "FOUNDING" ? GREEN : GOLD_40,
                fontSize: "0.36rem",
                letterSpacing: "0.12em",
                background: c.status === "FOUNDING" ? GREEN_10 : "transparent",
                padding: "2px 8px",
                borderRadius: "2px",
              }}>
                {c.status}
              </span>
            </div>
          ))}
        </div>
        <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.38rem", textAlign: "center", marginTop: "10px" }}>
          Open territories claim via MAYDAY onboarding · May 2026
        </p>
      </div>

      {/* CTAs */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 48px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.7s ease 0.55s",
      }}>
        <p style={{ color: GOLD_40, fontSize: "0.42rem", letterSpacing: "0.22em", textAlign: "center", marginBottom: "16px" }}>
          YOUR PATH STARTS HERE
        </p>
        <div style={{ display: "grid", gap: "10px" }}>
          <a href="/gate" style={{
            display: "block",
            background: GOLD_10,
            border: `1px solid ${GOLD_40}`,
            color: GOLD,
            fontSize: "0.5rem",
            letterSpacing: "0.2em",
            padding: "16px",
            textDecoration: "none",
            borderRadius: "6px",
            textAlign: "center",
          }}>
            ENTER THE GATE — NĀ KOA →
          </a>
          <a href="/founding48" style={{
            display: "block",
            background: GREEN_10,
            border: `1px solid ${GREEN_20}`,
            color: GREEN,
            fontSize: "0.5rem",
            letterSpacing: "0.2em",
            padding: "16px",
            textDecoration: "none",
            borderRadius: "6px",
            textAlign: "center",
          }}>
            MAYDAY — CLAIM YOUR HOUSE SEAT →
          </a>
          <a href="/808" style={{
            display: "block",
            background: BLUE_10,
            border: `1px solid ${BLUE_20}`,
            color: BLUE,
            fontSize: "0.5rem",
            letterSpacing: "0.2em",
            padding: "16px",
            textDecoration: "none",
            borderRadius: "6px",
            textAlign: "center",
          }}>
            808 7G NET — VIEW OPEN TERRITORIES →
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "GATE", href: "/" },
            { label: "MAYDAY", href: "/founding48" },
            { label: "808 NET", href: "/808" },
            { label: "TRADE CO", href: "/trade" },
            { label: "STONES", href: "/stones/nakoa" },
          ].map((link, i) => (
            <a key={i} href={link.href} style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>
              {link.label}
            </a>
          ))}
        </div>
        <p style={{ color: "rgba(176,142,80,0.1)", fontSize: "0.36rem", letterSpacing: "0.12em", marginTop: "12px" }}>
          Mākoa Order · One House Per Zip · Worldwide · Est. 2026
        </p>
      </div>
    </div>
  );
}
