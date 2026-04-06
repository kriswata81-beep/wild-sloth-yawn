"use client";

import { useState } from "react";
import { TIER_CONFIG, TELEGRAM, zipToRegion, type Tier } from "@/lib/makoa";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const BG = "#04060a";

const WHAT_TO_BRING = [
  { icon: "🏊", text: "Towel + swimwear for ice bath" },
  { icon: "👕", text: "Change of clothes (2 sets)" },
  { icon: "📓", text: "Notebook + pen" },
  { icon: "💧", text: "Water bottle" },
  { icon: "🪪", text: "Government-issued ID" },
  { icon: "💼", text: "Business cards (Aliʻi/Mana)" },
  { icon: "🧠", text: "Open mind. No ego." },
];

const EVENT_DETAILS = {
  alii: { hotel: "Hotel · Kapolei · West Oahu", track: "72hr War Room · Boardroom" },
  mana: { hotel: "Hotel · Kapolei · West Oahu", track: "72hr Mastermind" },
  nakoa: { hotel: "Beach Training · Kapolei", track: "2-Day Founding Pass" },
};

const ACCESS_RULES = {
  alii: [
    { text: "May 1–4 · 72hr War Room INCLUDED", included: true },
    { text: "Weekly Wednesday 4am training · unlimited", included: true },
    { text: "Monthly Full Moon 72 · Mākoa House · unlimited", included: true },
    { text: "4 Quarterly Hotel Summits INCLUDED", included: true },
    { text: "Council access · founding vote", included: true },
  ],
  mana: [
    { text: "May 1–4 · 72hr Mastermind INCLUDED", included: true },
    { text: "Weekly Wednesday 4am training · unlimited", included: true },
    { text: "Monthly Full Moon 72 · Mākoa House · unlimited", included: true },
    { text: "2 Quarterly Hotel Summits INCLUDED", included: true },
    { text: "Additional quarterly events = paid upgrade", included: false },
  ],
  nakoa: [
    { text: "May 1–4 · Founding pass INCLUDED", included: true },
    { text: "Weekly Wednesday 4am training · unlimited", included: true },
    { text: "Monthly Full Moon 72 · House-based · unlimited", included: true },
    { text: "Quarterly Hotel Summits NOT included", included: false },
    { text: "Pay per event for quarterly upgrades", included: false },
  ],
};

interface SeatSecuredPageProps {
  tier: Tier;
  name: string;
  zip?: string;
  applicationId?: string;
}

export default function SeatSecuredPage({ tier, name, zip = "", applicationId = "" }: SeatSecuredPageProps) {
  const cfg = TIER_CONFIG[tier];
  const event = EVENT_DETAILS[tier];
  const access = ACCESS_RULES[tier];
  const displayName = name.trim() || "brother";
  const region = zipToRegion(zip);
  const [botStep, setBotStep] = useState<"idle" | "verifying" | "verified" | "placed">("idle");
  const [botEmail, setBotEmail] = useState("");

  const tierGroup = TELEGRAM.tiers[tier];
  const regionGroup = TELEGRAM.regions[region] || TELEGRAM.regions["Unknown"];

  const handleBotVerify = () => {
    if (!botEmail.trim()) return;
    setBotStep("verifying");
    setTimeout(() => setBotStep("verified"), 1500);
    setTimeout(() => setBotStep("placed"), 3000);
  };

  return (
    <div style={{ background: BG, minHeight: "100dvh", fontFamily: "var(--font-jetbrains)", overflowX: "hidden" }}>

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 25%, ${cfg.color}09 0%, transparent 60%)`,
      }} />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "56px 20px 48px", position: "relative", zIndex: 1, textAlign: "center" }}>

        {/* Confirmation badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: `${cfg.color}15`, border: `1px solid ${cfg.color}44`,
          borderRadius: 20, padding: "6px 16px", marginBottom: 24,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
          <span style={{ color: cfg.color, fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Seat Secured · You are now in formation
          </span>
        </div>

        <div style={{ fontSize: "3rem", marginBottom: 20, opacity: 0.8 }}>🌕</div>

        <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 10px" }}>
          {cfg.icon} {cfg.label} · Founding Member
        </p>
        <h1 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "2.2rem", margin: "0 0 12px", lineHeight: 1.15 }}>
          You stand with<br />the Order, {displayName}.
        </h1>
        <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.65rem", lineHeight: 1.8, margin: "0 0 8px" }}>
          Your seat is confirmed.<br />
          XI will reach you on Telegram within 24 hours.
        </p>
        {applicationId && (
          <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.52rem", margin: "0 0 32px" }}>
            Application ID: {applicationId}
          </p>
        )}

        {/* ── TELEGRAM ROUTING FLOW ── */}
        <div style={{ background: "rgba(88,166,255,0.04)", border: "1px solid rgba(88,166,255,0.2)", borderRadius: 12, padding: "20px 16px", marginBottom: 16, textAlign: "left" }}>
          <p style={{ color: "#58a6ff", fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Complete Your Placement
          </p>
          <p style={{ color: "rgba(176,142,80,0.45)", fontSize: "0.62rem", lineHeight: 1.7, margin: "0 0 14px" }}>
            Join Telegram and complete your placement. Your unit is being assigned.
          </p>

          {botStep === "idle" && (
            <>
              {/* Bot verification */}
              <div style={{ background: "#080c14", border: "0.5px solid rgba(88,166,255,0.12)", borderRadius: 8, padding: "12px", marginBottom: 12 }}>
                <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.55rem", margin: "0 0 8px" }}>
                  Verify your payment email to receive placement:
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={botEmail}
                    onChange={(e) => setBotEmail(e.target.value)}
                    placeholder="Email used during payment"
                    style={{
                      flex: 1, background: "#060810", border: "0.5px solid rgba(176,142,80,0.15)",
                      borderRadius: 6, padding: "10px 12px", fontSize: "0.6rem",
                      color: GOLD, fontFamily: "var(--font-jetbrains)", outline: "none",
                    }}
                  />
                  <button
                    onClick={handleBotVerify}
                    style={{
                      background: "#58a6ff", color: "#000", border: "none",
                      padding: "10px 14px", borderRadius: 6, cursor: "pointer",
                      fontFamily: "var(--font-jetbrains)", fontSize: "0.58rem",
                      fontWeight: 700, letterSpacing: "0.1em", flexShrink: 0,
                    }}
                  >
                    VERIFY
                  </button>
                </div>
              </div>

              <a
                href={TELEGRAM.bot.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block", width: "100%", background: "#58a6ff",
                  color: "#000", border: "none", padding: "13px",
                  borderRadius: 8, fontFamily: "var(--font-jetbrains)",
                  fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", cursor: "pointer",
                  textDecoration: "none", textAlign: "center", boxSizing: "border-box",
                }}
              >
                JOIN TELEGRAM — COMPLETE PLACEMENT →
              </a>
            </>
          )}

          {botStep === "verifying" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ color: "#58a6ff", fontSize: "0.65rem", margin: "0 0 6px" }}>Verifying payment record...</p>
              <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.55rem", margin: 0 }}>Checking against deposit list</p>
            </div>
          )}

          {(botStep === "verified" || botStep === "placed") && (
            <div>
              <div style={{ background: "#080c14", border: "1px solid rgba(88,166,255,0.2)", borderRadius: 8, padding: "14px", marginBottom: 12 }}>
                <p style={{ color: "#58a6ff", fontSize: "0.52rem", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px" }}>
                  ✓ Payment Verified
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { label: "Name", value: displayName },
                    { label: "Tier", value: cfg.label },
                    { label: "Region", value: region },
                    { label: "Application ID", value: applicationId || "MKO-PENDING" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.58rem" }}>{label}</span>
                      <span style={{ color: GOLD, fontSize: "0.58rem" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {botStep === "placed" && (
                <div style={{ background: `${cfg.color}08`, border: `1px solid ${cfg.color}22`, borderRadius: 8, padding: "12px", marginBottom: 12 }}>
                  <p style={{ color: cfg.color, fontSize: "0.52rem", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>
                    Unit Placement
                  </p>
                  <p style={{ color: "rgba(176,142,80,0.55)", fontSize: "0.6rem", lineHeight: 1.7, margin: "0 0 8px" }}>
                    Tier: <span style={{ color: cfg.color }}>{cfg.label}</span><br />
                    ZIP: <span style={{ color: GOLD }}>{zip || "—"}</span><br />
                    Region: <span style={{ color: GOLD }}>{region}</span>
                  </p>
                  <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.58rem", margin: 0 }}>
                    Stand by for unit placement. Your formation channel is now open. Watch for instructions, schedule drops, and house assignments.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Telegram groups */}
        <div style={{ background: "#060810", border: "1px solid rgba(88,166,255,0.1)", borderRadius: 12, padding: "18px 16px", marginBottom: 16, textAlign: "left" }}>
          <p style={{ color: "#58a6ff", fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>
            Your Telegram Groups
          </p>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.55rem", margin: "0 0 12px", lineHeight: 1.6 }}>
            Reply with your tier + zip to be placed in your unit.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { name: TELEGRAM.main.name, url: TELEGRAM.main.url, desc: TELEGRAM.main.desc, badge: "ALL MEMBERS" },
              { name: tierGroup.name, url: tierGroup.url, desc: tierGroup.desc, badge: cfg.label.toUpperCase() },
              { name: regionGroup.name, url: regionGroup.url, desc: ("desc" in regionGroup ? regionGroup.desc : region) as string, badge: region.toUpperCase() },
            ].map(({ name: gName, url, desc, badge }) => (
              <a
                key={gName}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "#080c14", border: "0.5px solid rgba(88,166,255,0.12)",
                  borderRadius: 8, padding: "10px 12px", textDecoration: "none",
                }}
              >
                <div>
                  <p style={{ color: "#58a6ff", fontSize: "0.62rem", margin: "0 0 2px", fontWeight: 600 }}>{gName}</p>
                  <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.52rem", margin: 0 }}>{desc}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                  <span style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.42rem", letterSpacing: "0.1em" }}>{badge}</span>
                  <span style={{ color: "#58a6ff", fontSize: "0.9rem" }}>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Event details */}
        <div style={{ background: "#060810", border: `1px solid ${cfg.color}22`, borderRadius: 12, padding: "18px 16px", marginBottom: 16, textAlign: "left" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>Event Details</p>
          {[
            { label: "Event", value: "Mākoa 1st Roundup · The 72" },
            { label: "Dates", value: "May 1–4, 2026" },
            { label: "Location", value: "Kapolei · West Oahu" },
            { label: "Accommodation", value: event.hotel },
            { label: "Your Track", value: event.track },
            { label: "Check-in", value: "May 1 · 6:00pm" },
            { label: "First Formation", value: "May 2 · 4:00am" },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 12 }}>
              <span style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.6rem", flexShrink: 0 }}>{label}</span>
              <span style={{ color: GOLD, fontSize: "0.6rem", textAlign: "right" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* 18-month access */}
        <div style={{ background: "#060810", border: "1px solid rgba(176,142,80,0.08)", borderRadius: 12, padding: "18px 16px", marginBottom: 16, textAlign: "left" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>Your 18-Month Access</p>
          {access.map(({ text, included }) => (
            <div key={text} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: included ? cfg.color : "rgba(176,142,80,0.2)", fontSize: "0.52rem", flexShrink: 0, marginTop: 1 }}>
                {included ? "✦" : "✕"}
              </span>
              <span style={{ color: included ? "rgba(176,142,80,0.6)" : "rgba(176,142,80,0.25)", fontSize: "0.6rem", lineHeight: 1.5 }}>
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* What to bring */}
        <div style={{ background: "#060810", border: "1px solid rgba(176,142,80,0.08)", borderRadius: 12, padding: "18px 16px", marginBottom: 24, textAlign: "left" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>What to Bring</p>
          {WHAT_TO_BRING.map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: "0.8rem", flexShrink: 0 }}>{icon}</span>
              <span style={{ color: "rgba(176,142,80,0.6)", fontSize: "0.62rem" }}>{text}</span>
            </div>
          ))}
        </div>

        <p className="font-cormorant" style={{ fontStyle: "italic", color: "rgba(176,142,80,0.2)", fontSize: "1rem", margin: "0 0 6px" }}>
          Hana · Pale · Ola
        </p>
        <p style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.52rem", letterSpacing: "0.18em", margin: 0 }}>
          Malu Trust · West Oahu · 2026 · All Faiths · Service First
        </p>
      </div>
    </div>
  );
}
