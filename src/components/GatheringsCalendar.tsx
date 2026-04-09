"use client";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.07)";
const GREEN = "#3fb950";
const PURPLE = "#534AB7";
const EVENT_GOLD = "#BA7517";

// ─── Date helpers ────────────────────────────────────────────────────────────

function getNextWednesdays(count: number): string[] {
  const results: string[] = [];
  const now = new Date();
  const d = new Date(now);
  // Advance to next Wednesday (day 3)
  const day = d.getDay();
  const daysUntilWed = (3 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntilWed);
  for (let i = 0; i < count; i++) {
    results.push(
      d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    );
    d.setDate(d.getDate() + 7);
  }
  return results;
}

function getNextFullMoon(): string {
  // Known full moon dates (approximate) — cycle every ~29.5 days
  const knownFullMoon = new Date("2025-05-12");
  const now = new Date();
  const cycleMs = 29.53 * 24 * 60 * 60 * 1000;
  let next = new Date(knownFullMoon);
  while (next <= now) {
    next = new Date(next.getTime() + cycleMs);
  }
  return next.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function getNextQuarterDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const quarters = [
    new Date(year, 2, 1),   // Mar 1
    new Date(year, 5, 1),   // Jun 1
    new Date(year, 8, 1),   // Sep 1
    new Date(year, 11, 1),  // Dec 1
    new Date(year + 1, 2, 1),
  ];
  const next = quarters.find(q => q > now) || quarters[quarters.length - 1];
  return next.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface GatheringCardProps {
  emoji: string;
  name: string;
  subtitle: string;
  frequency: string;
  description: string;
  price: string;
  priceNote?: string;
  nextDates: string[];
  accent: string;
  accentFaint: string;
  accentDim: string;
  memberTier?: string;
  requiredTier?: string;
  memberHandle?: string;
  onReserve?: () => void;
}

// ─── Gathering Card ───────────────────────────────────────────────────────────

function GatheringCard({
  emoji, name, subtitle, frequency, description, price, priceNote,
  nextDates, accent, accentFaint, accentDim, memberTier, requiredTier, memberHandle,
}: GatheringCardProps & { memberHandle?: string }) {
  const [reserved, setReserved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

  const tierOrder = ["nakoa", "mana", "alii"];
  const memberTierIdx = tierOrder.indexOf(memberTier || "nakoa");
  const requiredTierIdx = tierOrder.indexOf(requiredTier || "nakoa");
  const hasAccess = memberTierIdx >= requiredTierIdx;

  async function handleReserve() {
    if (!hasAccess || reserved || saving) return;
    setSaving(true);
    try {
      await supabase.from("waitlist").insert({
        handle: memberHandle || "unknown",
        gathering_name: name,
        gathering_type: frequency.toLowerCase(),
        next_date: nextDates[0] || "TBD",
        tier: memberTier || "nakoa",
        status: "reserved",
        reserved_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("[GatheringsCalendar] Reserve error:", err);
    }
    setSaving(false);
    setReserved(true);
  }

  return (
    <div style={{
      background: reserved ? accentFaint : "rgba(0,0,0,0.35)",
      border: `1px solid ${reserved ? accent + "50" : accent + "22"}`,
      borderRadius: "12px",
      overflow: "hidden",
      transition: "all 0.3s",
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ padding: "18px 18px 14px", cursor: "pointer", display: "flex", gap: "14px", alignItems: "flex-start" }}
      >
        <div style={{
          width: "50px", height: "50px", borderRadius: "50%",
          background: accentFaint, border: `1px solid ${accent}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, fontSize: "1.4rem",
        }}>
          {emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: accent, fontSize: "1.05rem", lineHeight: 1.1, marginBottom: "2px" }}>{name}</p>
              <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem", letterSpacing: "0.15em" }}>{subtitle}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ color: accent, fontSize: "0.65rem", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{price}</p>
              {priceNote && <p style={{ color: accentDim, fontSize: "0.38rem", marginTop: "2px" }}>{priceNote}</p>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
            <span style={{ background: accentFaint, border: `1px solid ${accent}30`, color: accent, fontSize: "0.38rem", padding: "2px 7px", borderRadius: "3px", letterSpacing: "0.12em" }}>{frequency}</span>
            {reserved && <span style={{ color: "#3fb950", fontSize: "0.4rem", letterSpacing: "0.1em" }}>✓ RESERVED</span>}
            {!hasAccess && <span style={{ color: "#f0883e", fontSize: "0.38rem", letterSpacing: "0.1em" }}>UPGRADE REQUIRED</span>}
          </div>
        </div>
        <span style={{ color: accentDim, fontSize: "0.6rem", flexShrink: 0, transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s", marginTop: "4px" }}>▾</span>
      </div>

      {expanded && (
        <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${accent}15`, animation: "gatherFadeIn 0.3s ease forwards" }}>
          <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.5rem", lineHeight: 1.8, marginTop: "14px", marginBottom: "16px" }}>{description}</p>
          <p style={{ color: accentDim, fontSize: "0.4rem", letterSpacing: "0.2em", marginBottom: "10px" }}>UPCOMING DATES</p>
          <div style={{ display: "grid", gap: "6px", marginBottom: "16px" }}>
            {nextDates.map((date, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", background: "rgba(0,0,0,0.3)", borderRadius: "6px", border: `1px solid ${accent}15` }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === 0 ? accent : accentDim, flexShrink: 0 }} />
                <p style={{ color: i === 0 ? "#e8e0d0" : "rgba(232,224,208,0.45)", fontSize: "0.48rem" }}>{date}</p>
                {i === 0 && <span style={{ marginLeft: "auto", color: accent, fontSize: "0.38rem", letterSpacing: "0.1em" }}>NEXT</span>}
              </div>
            ))}
          </div>
          <button
            onClick={handleReserve}
            disabled={reserved || !hasAccess || saving}
            style={{
              width: "100%",
              background: reserved ? accentFaint : hasAccess ? "transparent" : "transparent",
              border: `1px solid ${reserved ? accent + "60" : hasAccess ? accent : "#f0883e40"}`,
              color: reserved ? accent : hasAccess ? accent : "#f0883e",
              fontSize: "0.5rem", letterSpacing: "0.25em", padding: "12px",
              cursor: reserved || !hasAccess || saving ? "default" : "pointer",
              borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace",
              fontWeight: reserved ? 700 : 400, transition: "all 0.2s",
              opacity: !hasAccess ? 0.6 : 1,
            }}
          >
            {saving ? "RESERVING..." : reserved ? "✓ SPOT RESERVED" : !hasAccess ? `REQUIRES ${(requiredTier || "").toUpperCase()} TIER` : "RESERVE MY SPOT"}
          </button>
          {reserved && (
            <p style={{ color: "rgba(63,185,80,0.5)", fontSize: "0.42rem", textAlign: "center", marginTop: "8px" }}>
              XI will confirm via Telegram. Check your 808 channel.
            </p>
          )}
          {!hasAccess && (
            <p style={{ color: "rgba(240,136,62,0.5)", fontSize: "0.42rem", textAlign: "center", marginTop: "8px", lineHeight: 1.6 }}>
              Upgrade your tier to access this gathering. Contact XI.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface GatheringsCalendarProps {
  memberTier?: string;
}

export default function GatheringsCalendar({ memberTier = "nakoa", memberHandle }: GatheringsCalendarProps & { memberHandle?: string }) {
  const wednesdays = getNextWednesdays(4);
  const fullMoon = getNextFullMoon();
  const quarterDate = getNextQuarterDate();

  const GATHERINGS: (GatheringCardProps & { memberHandle?: string })[] = [
    {
      emoji: "⚔",
      name: "Ke Ala",
      subtitle: "THE PATH · WEEKLY WARRIOR TRAINING",
      frequency: "WEEKLY",
      description: "Every Wednesday at 4am. 90 minutes of elite warrior conditioning — strength circuit, ocean run, ice bath, sauna, and closing circle. This is the heartbeat of the order. Show up 3 consecutive weeks and your rank advances automatically. Free for all Nā Koa. Ko Olina Beach and Kapolei Community Park alternate.",
      price: "INCLUDED",
      priceNote: "In $97/mo dues",
      nextDates: wednesdays,
      accent: "#3fb950",
      accentFaint: "rgba(63,185,80,0.07)",
      accentDim: "rgba(63,185,80,0.5)",
      memberTier,
      requiredTier: "nakoa",
      memberHandle,
    },
    {
      emoji: "🌕",
      name: "Pō Māhina",
      subtitle: "FULL MOON · MONTHLY 72HR GATHERING",
      frequency: "MONTHLY",
      description: "Every full moon, brothers gather at Mākoa House for a 72-hour immersion. Deep work, brotherhood, fire ceremony, and formation review. Included in your $97/mo membership dues. Ice bath waiver required before your first Pō Māhina. XI reviews all standing at this gathering.",
      price: "INCLUDED",
      priceNote: "In $97/mo dues",
      nextDates: [fullMoon, "Following full moon — ~29 days later", "Third cycle — ~58 days out"],
      accent: "#b08e50",
      accentFaint: "rgba(176,142,80,0.07)",
      accentDim: "rgba(176,142,80,0.5)",
      memberTier,
      requiredTier: "nakoa",
      memberHandle,
    },
    {
      emoji: "🏨",
      name: "Ka Hoʻike",
      subtitle: "THE SHOWCASE · QUARTERLY REGIONAL SUMMIT",
      frequency: "QUARTERLY",
      description: "72-hour hotel gathering for the full regional order. War Room sessions, service route reviews, rank ceremonies, and brotherhood. A la carte add-on for all brothers — $199/event. This is where the order makes decisions and advances its mission. Attendance earns 25 formation score points.",
      price: "+$199",
      priceNote: "Per event · a la carte",
      nextDates: [quarterDate, "Next quarter — 3 months out", "Third quarter — 6 months out"],
      accent: "#534AB7",
      accentFaint: "rgba(83,74,183,0.07)",
      accentDim: "rgba(83,74,183,0.5)",
      memberTier,
      requiredTier: "nakoa",
      memberHandle,
    },
    {
      emoji: "🏝",
      name: "Makahiki Mākoa",
      subtitle: "ANNUAL RESORT GATHERING",
      frequency: "ANNUAL",
      description: "The full order convenes once a year at a resort for 72 hours. This is the highest gathering of the Mākoa Order — rank ceremonies, new chapter announcements, and the annual oath renewal. A la carte add-on: +$399 for active members. Date announced by XI.",
      price: "+$399",
      priceNote: "Per event · a la carte",
      nextDates: ["Date TBD — XI will announce", "Watch your Telegram channel", "All active members eligible"],
      accent: "#BA7517",
      accentFaint: "rgba(186,117,23,0.07)",
      accentDim: "rgba(186,117,23,0.5)",
      memberTier,
      requiredTier: "nakoa",
      memberHandle,
    },
  ];

  return (
    <div>
      <style>{`
        @keyframes gatherFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#b08e50", fontSize: "1.3rem", lineHeight: 1.2, marginBottom: "6px" }}>
          The Gatherings
        </p>
        <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem", lineHeight: 1.7 }}>
          Four rhythms of the order. Weekly, monthly, quarterly, annual. Show up. Advance.
        </p>
      </div>
      <div style={{ display: "grid", gap: "12px" }}>
        {GATHERINGS.map((g) => (
          <GatheringCard key={g.name} {...g} />
        ))}
      </div>
      <div style={{ marginTop: "20px", padding: "14px 16px", background: "rgba(176,142,80,0.07)", border: "1px solid rgba(176,142,80,0.15)", borderRadius: "8px", textAlign: "center" }}>
        <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.45rem", lineHeight: 1.8 }}>
          Weekly, monthly & academy gatherings included in $97/mo dues.<br />
          Ka Hoʻike +$199 · Makahiki +$399 · a la carte per event.<br />
          Ice bath waiver required before first Pō Māhina. Contact XI to register.
        </p>
      </div>
    </div>
  );
}