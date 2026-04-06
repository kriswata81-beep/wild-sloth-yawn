"use client";

import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const BG = "#04060a";

interface AcceptancePageProps {
  name: string;
  onSelectTier: (tier: "alii" | "mana" | "nakoa") => void;
}

const TIERS = [
  {
    key: "alii" as const,
    icon: "👑",
    label: "Aliʻi",
    sub: "Network to Network",
    color: GOLD,
    borderColor: "rgba(176,142,80,0.35)",
    bgColor: "rgba(176,142,80,0.03)",
    deposit: 750,
    badge: "COUNCIL TIER",
    features: [
      "Full 72hr War Room · May 1–4",
      "Council access · founding vote",
      "Quarterly hotel summits",
      "B2B network · 11 Aliʻi brothers",
      "Founding crest · gear",
      "18-month formation path",
    ],
    seatsLeft: 5,
    totalSeats: 12,
    urgency: "5 of 12 seats remaining",
    urgencyColor: "#f85149",
  },
  {
    key: "mana" as const,
    icon: "🌀",
    label: "Mana",
    sub: "Build · B2B + B2C",
    color: BLUE,
    borderColor: "rgba(88,166,255,0.3)",
    bgColor: "rgba(88,166,255,0.02)",
    deposit: 250,
    badge: "BUILDER TIER",
    features: [
      "72hr Mastermind · May 1–4",
      "Monthly full moon training",
      "Brotherhood network · 20 brothers",
      "Wednesday school · job queue",
      "B2B pipeline access",
      "18-month formation path",
    ],
    seatsLeft: 7,
    totalSeats: 20,
    urgency: "7 of 20 seats remaining",
    urgencyColor: "#f0a030",
  },
  {
    key: "nakoa" as const,
    icon: "⚔",
    label: "Nā Koa",
    sub: "Serve · Peer 2 Peer",
    color: GREEN,
    borderColor: "rgba(63,185,80,0.25)",
    bgColor: "rgba(63,185,80,0.02)",
    deposit: 125,
    badge: "ENTRY TIER",
    features: [
      "2-day founding pass · May 3–4",
      "4am Saturday + Sunday training",
      "Ice bath · beach training",
      "Full moon ceremony",
      "808 network access",
      "Path to Mana elevation",
    ],
    seatsLeft: 18,
    totalSeats: 40,
    urgency: "Limited intake · open",
    urgencyColor: GREEN,
  },
];

export default function AcceptancePage({ name, onSelectTier }: AcceptancePageProps) {
  const [selected, setSelected] = useState<"alii" | "mana" | "nakoa" | null>(null);
  const displayName = name.trim() || "brother";

  return (
    <div style={{ background: BG, minHeight: "100dvh", fontFamily: "var(--font-jetbrains)", overflowX: "hidden" }}>

      {/* Radial glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 20%, rgba(176,142,80,0.07) 0%, transparent 60%)",
      }} />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "48px 16px 40px", position: "relative", zIndex: 1 }}>

        {/* Acceptance header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: "2.2rem", marginBottom: 16 }}>🌕</div>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", margin: "0 0 10px" }}>
            You've been accepted
          </p>
          <h1 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "2.1rem", margin: "0 0 10px", lineHeight: 1.15 }}>
            Welcome to Formation,<br />{displayName}.
          </h1>
          <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.65rem", lineHeight: 1.8, margin: "0 0 6px" }}>
            Secure your seat for the May 1st 72-hour founding.
          </p>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.58rem", lineHeight: 1.6, margin: 0 }}>
            Select your tier below. One action. One seat.
          </p>
        </div>

        {/* Tier cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {TIERS.map((tier) => {
            const isSelected = selected === tier.key;
            return (
              <button
                key={tier.key}
                onClick={() => setSelected(tier.key)}
                style={{
                  background: isSelected ? tier.bgColor : "#060810",
                  border: `1px solid ${isSelected ? tier.borderColor : "rgba(176,142,80,0.08)"}`,
                  borderRadius: 12, padding: "18px 16px", cursor: "pointer",
                  textAlign: "left", transition: "all 0.2s",
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* Badge */}
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  background: tier.color, color: "#000",
                  fontSize: "0.42rem", fontWeight: 700, letterSpacing: "0.14em",
                  padding: "3px 10px", borderRadius: "0 11px 0 6px",
                  fontFamily: "var(--font-jetbrains)",
                }}>
                  {tier.badge}
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  {/* Select indicator */}
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                    border: `1.5px solid ${isSelected ? tier.color : "rgba(176,142,80,0.2)"}`,
                    background: isSelected ? tier.color : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}>
                    {isSelected && <span style={{ color: "#000", fontSize: "0.55rem", fontWeight: 700 }}>✓</span>}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: "1rem" }}>{tier.icon}</span>
                      <span className="font-cormorant" style={{ fontStyle: "italic", color: tier.color, fontSize: "1.3rem" }}>{tier.label}</span>
                      <span style={{ color: `${tier.color}55`, fontSize: "0.55rem", letterSpacing: "0.08em" }}>· {tier.sub}</span>
                    </div>

                    {/* Features */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                      {tier.features.map((f) => (
                        <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: tier.color, fontSize: "0.5rem", flexShrink: 0, marginTop: 2 }}>✦</span>
                          <span style={{ color: "rgba(176,142,80,0.55)", fontSize: "0.6rem", lineHeight: 1.5 }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Deposit + urgency */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ color: tier.color, fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-jetbrains)" }}>
                          ${tier.deposit}
                        </span>
                        <span style={{ color: GOLD_DIM, fontSize: "0.55rem", marginLeft: 6 }}>deposit today</span>
                      </div>
                      <span style={{ color: tier.urgencyColor, fontSize: "0.52rem", letterSpacing: "0.05em" }}>
                        {tier.urgency}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Formation note */}
        <div style={{ background: "rgba(176,142,80,0.03)", border: "1px solid rgba(176,142,80,0.1)", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
          <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.62rem", lineHeight: 1.8, margin: 0 }}>
            Your down payment secures your place in the May 1st founding event.<br />
            <span style={{ color: GOLD_DIM }}>Remaining balance is completed over your 18-month formation.</span>
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => selected && onSelectTier(selected)}
          disabled={!selected}
          style={{
            width: "100%",
            background: selected ? (TIERS.find(t => t.key === selected)?.color || GOLD) : "rgba(176,142,80,0.12)",
            color: selected ? "#000" : "rgba(176,142,80,0.25)",
            border: "none", padding: "17px", borderRadius: 8,
            fontFamily: "var(--font-jetbrains)", fontSize: "0.72rem",
            fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            cursor: selected ? "pointer" : "not-allowed",
            transition: "all 0.25s",
          }}
        >
          {selected ? `SECURE MY ${selected.toUpperCase()} SEAT →` : "SELECT YOUR TIER"}
        </button>

        <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.52rem", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
          Mākoa Order · Malu Trust · West Oahu · 2026
        </p>
      </div>
    </div>
  );
}
