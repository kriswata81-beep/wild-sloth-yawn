"use client";

import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const RED = "#f85149";
const BG = "#04060a";

interface AcceptancePageProps {
  name: string;
  tier?: string; // pre-selected tier from q3 answer
  onSelectTier: (tier: "alii" | "mana" | "nakoa") => void;
}

const TIERS = [
  {
    key: "alii" as const,
    icon: "👑",
    label: "Aliʻi",
    sub: "Network to Network",
    color: GOLD,
    borderColor: "rgba(176,142,80,0.4)",
    bgColor: "rgba(176,142,80,0.04)",
    totalPrice: 2999,
    deposit: 750,
    monthly: 125,
    months: 18,
    badge: "COUNCIL TIER",
    soldOut: false,
    seatsLeft: 5,
    totalSeats: 12,
    urgencyColor: RED,
    features: [
      { text: "72hr War Room · May 1–4 · Hotel", included: true },
      { text: "Council access · founding vote", included: true },
      { text: "4 Quarterly Hotel Summits INCLUDED", included: true },
      { text: "Unlimited Monthly Full Moon (Mākoa House)", included: true },
      { text: "Weekly Elite Training · Wed 4–6am", included: true },
      { text: "B2B network · 11 Aliʻi brothers", included: true },
      { text: "Founding crest · gear", included: true },
    ],
    emailCopy: "12 seats. No expansion. Your seat is not held.",
  },
  {
    key: "mana" as const,
    icon: "🌀",
    label: "Mana",
    sub: "Build · B2B + B2C",
    color: BLUE,
    borderColor: "rgba(88,166,255,0.35)",
    bgColor: "rgba(88,166,255,0.03)",
    totalPrice: 999,
    deposit: 250,
    monthly: 42,
    months: 18,
    badge: "BUILDER TIER",
    soldOut: false,
    seatsLeft: 7,
    totalSeats: 20,
    urgencyColor: "#f0a030",
    features: [
      { text: "72hr Mastermind · May 1–4 · Hotel", included: true },
      { text: "2 Quarterly Hotel Summits INCLUDED", included: true },
      { text: "Unlimited Monthly Full Moon (Mākoa House)", included: true },
      { text: "Weekly Elite Training · Wed 4–6am", included: true },
      { text: "Wednesday school · job queue", included: true },
      { text: "B2B pipeline access", included: true },
      { text: "Additional quarterly events = paid upgrade", included: false },
    ],
    emailCopy: "Core builders move fast. Secure your place.",
  },
  {
    key: "nakoa" as const,
    icon: "⚔",
    label: "Nā Koa",
    sub: "Serve · Peer 2 Peer",
    color: GREEN,
    borderColor: "rgba(63,185,80,0.3)",
    bgColor: "rgba(63,185,80,0.02)",
    totalPrice: 499,
    deposit: 125,
    monthly: 20,
    months: 18,
    badge: "ENTRY TIER",
    soldOut: false,
    seatsLeft: 18,
    totalSeats: 40,
    urgencyColor: GREEN,
    features: [
      { text: "Entry to May 1st 72hr founding", included: true },
      { text: "Unlimited Monthly Full Moon (House-based)", included: true },
      { text: "Weekly Elite Training · Wed 4–6am", included: true },
      { text: "808 network access", included: true },
      { text: "Path to Mana elevation", included: true },
      { text: "Quarterly Hotel Summits NOT included", included: false },
      { text: "Pay per event for quarterly upgrades", included: false },
    ],
    emailCopy: "Entry is open. Advancement is earned.",
  },
];

function useAcceptanceCountdown() {
  // 48-hour window from now
  const [target] = useState(() => Date.now() + 48 * 60 * 60 * 1000);
  const calc = () => {
    const diff = target - Date.now();
    if (diff <= 0) return { hours: 0, mins: 0 };
    return {
      hours: Math.floor(diff / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 60000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

export default function AcceptancePage({ name, onSelectTier }: AcceptancePageProps) {
  const [selected, setSelected] = useState<"alii" | "mana" | "nakoa" | null>(null);
  const [expanded, setExpanded] = useState<"alii" | "mana" | "nakoa" | null>("mana");
  const { hours, mins } = useAcceptanceCountdown();
  const displayName = name.trim() || "brother";

  return (
    <div style={{ background: BG, minHeight: "100dvh", fontFamily: "var(--font-jetbrains)", overflowX: "hidden" }}>

      {/* Radial glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 20%, rgba(176,142,80,0.08) 0%, transparent 60%)",
      }} />

      {/* Sticky urgency bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(4,6,10,0.97)", backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${RED}33`,
        padding: "10px 16px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED, boxShadow: `0 0 8px ${RED}` }} />
        <p style={{ color: RED, fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", margin: 0, letterSpacing: "0.1em" }}>
          Seat hold expires in {String(hours).padStart(2, "0")}:{String(mins).padStart(2, "0")} — secure now
        </p>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 16px 48px", position: "relative", zIndex: 1 }}>

        {/* Acceptance header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: "2.4rem", marginBottom: 14 }}>🌕</div>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", margin: "0 0 10px" }}>
            You've been accepted into Mākoa Formation
          </p>
          <h1 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "2rem", margin: "0 0 10px", lineHeight: 1.15 }}>
            Welcome, {displayName}.
          </h1>
          <p style={{ color: "rgba(176,142,80,0.55)", fontSize: "0.65rem", lineHeight: 1.8, margin: "0 0 4px" }}>
            Secure your seat for the May 1st 72-hour founding.
          </p>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.58rem", lineHeight: 1.6, margin: 0 }}>
            One action. One seat. No second founding.
          </p>
        </div>

        {/* Tier cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {TIERS.map((tier) => {
            const isSelected = selected === tier.key;
            const isExpanded = expanded === tier.key;

            if (tier.soldOut) {
              return (
                <div key={tier.key} style={{
                  background: "#060810", border: "1px solid rgba(176,142,80,0.06)",
                  borderRadius: 12, padding: "16px", opacity: 0.5,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "1rem" }}>{tier.icon}</span>
                      <span className="font-cormorant" style={{ fontStyle: "italic", color: "rgba(176,142,80,0.4)", fontSize: "1.2rem" }}>{tier.label}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ color: RED, fontSize: "0.52rem", letterSpacing: "0.1em", border: `1px solid ${RED}44`, padding: "3px 8px", borderRadius: 4 }}>SOLD OUT</span>
                      <button style={{ background: "rgba(176,142,80,0.08)", border: "1px solid rgba(176,142,80,0.15)", color: GOLD_DIM, padding: "5px 12px", borderRadius: 4, fontFamily: "var(--font-jetbrains)", fontSize: "0.52rem", cursor: "pointer", letterSpacing: "0.1em" }}>
                        JOIN WAITLIST
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={tier.key}
                style={{
                  background: isSelected ? tier.bgColor : "#060810",
                  border: `1px solid ${isSelected ? tier.borderColor : "rgba(176,142,80,0.08)"}`,
                  borderRadius: 12, overflow: "hidden",
                  transition: "all 0.25s",
                }}
              >
                {/* Card header — always visible */}
                <button
                  onClick={() => {
                    setSelected(tier.key);
                    setExpanded(isExpanded ? null : tier.key);
                  }}
                  style={{
                    width: "100%", background: "transparent", border: "none",
                    padding: "16px", cursor: "pointer", textAlign: "left",
                    position: "relative",
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

                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    {/* Radio */}
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                      border: `1.5px solid ${isSelected ? tier.color : "rgba(176,142,80,0.2)"}`,
                      background: isSelected ? tier.color : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}>
                      {isSelected && <span style={{ color: "#000", fontSize: "0.5rem", fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: "1rem" }}>{tier.icon}</span>
                    <span className="font-cormorant" style={{ fontStyle: "italic", color: tier.color, fontSize: "1.3rem" }}>{tier.label}</span>
                    <span style={{ color: `${tier.color}55`, fontSize: "0.55rem", letterSpacing: "0.06em" }}>· {tier.sub}</span>
                  </div>

                  {/* Price row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingLeft: 28 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ color: tier.color, fontSize: "1.6rem", fontWeight: 700, lineHeight: 1 }}>${tier.deposit}</span>
                        <span style={{ color: GOLD_DIM, fontSize: "0.55rem" }}>deposit today</span>
                      </div>
                      <div style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.52rem", marginTop: 2 }}>
                        then ${tier.monthly}/mo × {tier.months} months · ${tier.totalPrice} total
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: tier.urgencyColor, fontSize: "0.52rem", letterSpacing: "0.05em" }}>
                        {tier.seatsLeft} of {tier.totalSeats} remaining
                      </div>
                      <div style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.48rem", marginTop: 2 }}>
                        {isExpanded ? "▲ collapse" : "▼ see details"}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded features */}
                {isExpanded && (
                  <div style={{ padding: "0 16px 16px 16px", borderTop: `1px solid ${tier.color}18` }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
                      {tier.features.map((f) => (
                        <div key={f.text} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: f.included ? tier.color : "rgba(176,142,80,0.2)", fontSize: "0.55rem", flexShrink: 0, marginTop: 1 }}>
                            {f.included ? "✦" : "✕"}
                          </span>
                          <span style={{ color: f.included ? "rgba(176,142,80,0.65)" : "rgba(176,142,80,0.25)", fontSize: "0.6rem", lineHeight: 1.5 }}>
                            {f.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, background: `${tier.color}08`, border: `1px solid ${tier.color}22`, borderRadius: 6, padding: "8px 10px" }}>
                      <p style={{ color: `${tier.color}88`, fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", margin: 0, fontStyle: "italic" }}>
                        "{tier.emailCopy}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Formation note */}
        <div style={{ background: "rgba(176,142,80,0.03)", border: "1px solid rgba(176,142,80,0.12)", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
          <p style={{ color: "rgba(176,142,80,0.55)", fontSize: "0.62rem", lineHeight: 1.9, margin: 0 }}>
            Your deposit secures your seat in the May 1st founding 72-hour event.<br />
            <span style={{ color: GOLD_DIM }}>Remaining balance is completed over your 18-month formation.</span><br />
            <span style={{ color: "rgba(176,142,80,0.3)" }}>Subscription auto-activates after deposit is confirmed.</span>
          </p>
        </div>

        {/* Urgency row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            { label: "Aliʻi", seats: "5 left", color: RED },
            { label: "Mana", seats: "7 left", color: "#f0a030" },
            { label: "Nā Koa", seats: "Open", color: GREEN },
          ].map(({ label, seats, color }) => (
            <div key={label} style={{ flex: 1, background: "#060810", border: `1px solid ${color}22`, borderRadius: 6, padding: "8px 6px", textAlign: "center" }}>
              <div style={{ color, fontSize: "0.52rem", fontWeight: 700, marginBottom: 2 }}>{label}</div>
              <div style={{ color: `${color}88`, fontSize: "0.48rem" }}>{seats}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => selected && onSelectTier(selected)}
          disabled={!selected}
          style={{
            width: "100%",
            background: selected ? (TIERS.find(t => t.key === selected)?.color || GOLD) : "rgba(176,142,80,0.12)",
            color: selected ? "#000" : "rgba(176,142,80,0.25)",
            border: "none", padding: "18px", borderRadius: 8,
            fontFamily: "var(--font-jetbrains)", fontSize: "0.75rem",
            fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            cursor: selected ? "pointer" : "not-allowed",
            transition: "all 0.25s",
          }}
        >
          {selected
            ? `SECURE MY ${selected.toUpperCase()} SEAT — $${TIERS.find(t => t.key === selected)?.deposit} →`
            : "SELECT YOUR TIER ABOVE"}
        </button>

        <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.52rem", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
          Mākoa Order · Malu Trust · West Oahu · 2026
        </p>
      </div>
    </div>
  );
}
