"use client";

import { useState, useEffect } from "react";
import {
  TIER_CONFIG,
  SIMULATED_SEATS,
  getSeatInfo,
  LEGAL_TEXT,
  STRIPE_LINKS,
  type Tier,
} from "@/lib/makoa";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const RED = "#f85149";
const BG = "#04060a";

interface AcceptancePageProps {
  name: string;
  onSelectTier: (tier: Tier) => void;
}

function useAcceptanceCountdown() {
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

const TIERS: Tier[] = ["alii", "mana", "nakoa"];

export default function AcceptancePage({ name, onSelectTier }: AcceptancePageProps) {
  const [selected, setSelected] = useState<Tier | null>(null);
  const [expanded, setExpanded] = useState<Tier | null>("mana");
  const { hours, mins } = useAcceptanceCountdown();
  const displayName = name.trim() || "brother";

  // Seat info per tier (simulated mode)
  const seats = {
    alii: getSeatInfo("alii", SIMULATED_SEATS.alii),
    mana: getSeatInfo("mana", SIMULATED_SEATS.mana),
    nakoa: getSeatInfo("nakoa", SIMULATED_SEATS.nakoa),
  };

  const handleStripeDeposit = (tier: Tier) => {
    const cfg = TIER_CONFIG[tier];
    const seatInfo = seats[tier];
    if (seatInfo.status === "sold_out") return;

    // In real mode: redirect to Stripe payment link
    // In simulated mode: proceed through funnel
    const stripeUrl = cfg.depositLink.url;
    const isRealStripe = !stripeUrl.includes("placeholder") && stripeUrl.includes("buy.stripe.com");

    if (isRealStripe) {
      window.location.href = stripeUrl;
    } else {
      // Simulated mode — continue funnel
      onSelectTier(tier);
    }
  };

  const handleWaitlist = (tier: "alii" | "mana") => {
    const link = tier === "alii" ? STRIPE_LINKS.alii_waitlist : STRIPE_LINKS.mana_waitlist;
    const isReal = !link.url.includes("placeholder") && link.url.includes("buy.stripe.com");
    if (isReal) {
      window.location.href = link.url;
    } else {
      alert(`Waitlist for ${tier === "alii" ? "Aliʻi" : "Mana"} — link will be live when Stripe is connected.`);
    }
  };

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
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          {TIERS.map((t) => {
            const s = seats[t];
            const cfg = TIER_CONFIG[t];
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: s.status === "sold_out" ? "#4a4a4a" : s.urgencyColor,
                  boxShadow: s.pulse ? `0 0 6px ${s.urgencyColor}` : "none",
                }} />
                <span style={{ color: s.urgencyColor, fontSize: "0.48rem", letterSpacing: "0.06em" }}>
                  {cfg.label}: {s.status === "sold_out" ? "Full" : `${s.remaining}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 16px 48px", position: "relative", zIndex: 1 }}>

        {/* Header */}
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
          {TIERS.map((tierKey) => {
            const cfg = TIER_CONFIG[tierKey];
            const seatInfo = seats[tierKey];
            const isSelected = selected === tierKey;
            const isExpanded = expanded === tierKey;
            const isSoldOut = seatInfo.status === "sold_out";

            return (
              <div
                key={tierKey}
                style={{
                  background: isSoldOut ? "#050709" : isSelected ? `${cfg.color}06` : "#060810",
                  border: `1px solid ${isSoldOut ? "rgba(176,142,80,0.05)" : isSelected ? `${cfg.color}44` : "rgba(176,142,80,0.08)"}`,
                  borderRadius: 12, overflow: "hidden",
                  transition: "all 0.25s",
                  opacity: isSoldOut ? 0.6 : 1,
                }}
              >
                {/* Card header */}
                <button
                  onClick={() => {
                    if (isSoldOut) return;
                    setSelected(tierKey);
                    setExpanded(isExpanded ? null : tierKey);
                  }}
                  style={{
                    width: "100%", background: "transparent", border: "none",
                    padding: "16px", cursor: isSoldOut ? "default" : "pointer",
                    textAlign: "left", position: "relative",
                  }}
                >
                  {/* Badge */}
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    background: isSoldOut ? "#2a2a2a" : cfg.color,
                    color: isSoldOut ? "#666" : "#000",
                    fontSize: "0.42rem", fontWeight: 700, letterSpacing: "0.14em",
                    padding: "3px 10px", borderRadius: "0 11px 0 6px",
                    fontFamily: "var(--font-jetbrains)",
                  }}>
                    {isSoldOut ? "SOLD OUT" : tierKey === "alii" ? "COUNCIL TIER" : tierKey === "mana" ? "BUILDER TIER" : "ENTRY TIER"}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    {!isSoldOut && (
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                        border: `1.5px solid ${isSelected ? cfg.color : "rgba(176,142,80,0.2)"}`,
                        background: isSelected ? cfg.color : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                      }}>
                        {isSelected && <span style={{ color: "#000", fontSize: "0.5rem", fontWeight: 700 }}>✓</span>}
                      </div>
                    )}
                    <span style={{ fontSize: "1rem" }}>{cfg.icon}</span>
                    <span className="font-cormorant" style={{ fontStyle: "italic", color: isSoldOut ? "#4a4a4a" : cfg.color, fontSize: "1.3rem" }}>{cfg.label}</span>
                    <span style={{ color: `${cfg.color}44`, fontSize: "0.52rem" }}>· {cfg.sub}</span>
                  </div>

                  {/* Price row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingLeft: isSoldOut ? 0 : 28 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ color: isSoldOut ? "#4a4a4a" : cfg.color, fontSize: "1.6rem", fontWeight: 700, lineHeight: 1 }}>
                          ${cfg.deposit}
                        </span>
                        <span style={{ color: GOLD_DIM, fontSize: "0.55rem" }}>deposit today</span>
                      </div>
                      <div style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.52rem", marginTop: 2 }}>
                        then ${cfg.monthly}/mo × {cfg.months} months · ${cfg.total} total
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        color: seatInfo.urgencyColor,
                        fontSize: "0.52rem",
                        animation: seatInfo.pulse ? "breatheGlow 1.5s ease-in-out infinite" : "none",
                      }}>
                        {seatInfo.label}
                      </div>
                      {!isSoldOut && (
                        <div style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.46rem", marginTop: 2 }}>
                          {isExpanded ? "▲ collapse" : "▼ see details"}
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded features */}
                {isExpanded && !isSoldOut && (
                  <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${cfg.color}18` }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12, marginBottom: 12 }}>
                      {cfg.includes.map((f) => (
                        <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: cfg.color, fontSize: "0.52rem", flexShrink: 0, marginTop: 1 }}>✦</span>
                          <span style={{ color: "rgba(176,142,80,0.65)", fontSize: "0.6rem", lineHeight: 1.5 }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stripe internal name reference */}
                    <div style={{ background: "rgba(176,142,80,0.03)", border: "0.5px solid rgba(176,142,80,0.08)", borderRadius: 6, padding: "8px 10px", marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.48rem" }}>Payment ref</span>
                        <span style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.48rem", fontFamily: "var(--font-jetbrains)" }}>
                          {cfg.depositLink.internalName}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStripeDeposit(tierKey)}
                      style={{
                        width: "100%", background: cfg.color, color: "#000",
                        border: "none", padding: "13px", borderRadius: 8,
                        fontFamily: "var(--font-jetbrains)", fontSize: "0.65rem",
                        fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                    >
                      SECURE {cfg.label.toUpperCase()} SEAT — ${cfg.deposit} →
                    </button>
                  </div>
                )}

                {/* Sold out state */}
                {isSoldOut && (
                  <div style={{ padding: "0 16px 14px" }}>
                    <p style={{ color: "#4a4a4a", fontSize: "0.58rem", margin: "0 0 10px", lineHeight: 1.6 }}>
                      {cfg.soldOutMsg}<br />
                      <span style={{ color: "#3a3a3a" }}>{cfg.waitlistMsg}</span>
                    </p>
                    {(tierKey === "alii" || tierKey === "mana") && (
                      <button
                        onClick={() => handleWaitlist(tierKey as "alii" | "mana")}
                        style={{
                          width: "100%", background: "transparent",
                          border: "1px solid rgba(176,142,80,0.15)", color: GOLD_DIM,
                          padding: "11px", borderRadius: 6,
                          fontFamily: "var(--font-jetbrains)", fontSize: "0.6rem",
                          letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer",
                        }}
                      >
                        JOIN PRIORITY WAITLIST →
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legal clarity */}
        <div style={{ background: "rgba(176,142,80,0.02)", border: "1px solid rgba(176,142,80,0.08)", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.58rem", lineHeight: 1.9, margin: 0 }}>
            {LEGAL_TEXT}
          </p>
        </div>

        {/* Urgency seat grid */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {TIERS.map((t) => {
            const s = seats[t];
            const cfg = TIER_CONFIG[t];
            return (
              <div key={t} style={{
                flex: 1, background: "#060810",
                border: `1px solid ${s.urgencyColor}22`,
                borderRadius: 6, padding: "10px 6px", textAlign: "center",
              }}>
                <div style={{ color: cfg.color, fontSize: "0.55rem", fontWeight: 700, marginBottom: 3 }}>{cfg.label}</div>
                <div style={{
                  color: s.urgencyColor, fontSize: "0.5rem",
                  animation: s.pulse ? "breatheGlow 1.5s ease-in-out infinite" : "none",
                }}>
                  {s.status === "sold_out" ? "Full" : s.remaining}
                </div>
                <div style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.44rem", marginTop: 2 }}>
                  {s.status === "sold_out" ? "waitlist" : "remaining"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main CTA if tier selected */}
        {selected && seats[selected].status !== "sold_out" && (
          <button
            onClick={() => handleStripeDeposit(selected)}
            style={{
              width: "100%",
              background: TIER_CONFIG[selected].color,
              color: "#000", border: "none", padding: "18px", borderRadius: 8,
              fontFamily: "var(--font-jetbrains)", fontSize: "0.75rem",
              fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.25s",
            }}
          >
            SECURE MY {selected.toUpperCase()} SEAT — ${TIER_CONFIG[selected].deposit} →
          </button>
        )}

        <p style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.52rem", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
          Mākoa Order · Malu Trust · West Oahu · 2026
        </p>
      </div>
    </div>
  );
}
