"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.12)";

// Tier seat caps — real numbers, start at 0 filled
const TIER_CAPS = {
  alii: 12,
  mana: 20,
  nakoa: 72,
};

interface GatePageProps {
  visitorName: string;
  onPledge: (tier: "nakoa" | "mana" | "alii") => void;
}

const TIERS = [
  {
    id: "alii" as const,
    name: "Aliʻi",
    subtitle: "The Sovereign Seat",
    color: GOLD,
    colorDim: GOLD_DIM,
    colorFaint: GOLD_FAINT,
    cap: TIER_CAPS.alii,
    price: "$297/mo",
    deposit: "$500 deposit",
    description: "Reserved for those who lead. Full access. Quarterly summits. Chapter authority.",
    access: [
      "All monthly full moon gatherings",
      "All quarterly hotel summits (4 included)",
      "Weekly Wednesday training",
      "Founding 72 — May 1",
      "Chapter leadership track",
      "Priority event access",
    ],
  },
  {
    id: "mana" as const,
    name: "Mana",
    subtitle: "The Builder's Path",
    color: "#58a6ff",
    colorDim: "rgba(88,166,255,0.5)",
    colorFaint: "rgba(88,166,255,0.08)",
    cap: TIER_CAPS.mana,
    price: "$147/mo",
    deposit: "$250 deposit",
    description: "For men building something. Quarterly access. Full formation track.",
    access: [
      "All monthly full moon gatherings",
      "2 quarterly hotel summits included",
      "Weekly Wednesday training",
      "Founding 72 — May 1",
      "Formation advancement track",
    ],
  },
  {
    id: "nakoa" as const,
    name: "Nā Koa",
    subtitle: "The Warrior's Entry",
    color: "#8b9aaa",
    colorDim: "rgba(139,154,170,0.5)",
    colorFaint: "rgba(139,154,170,0.08)",
    cap: TIER_CAPS.nakoa,
    price: "$47/mo",
    deposit: "$97 deposit",
    description: "The entry formation. Prove your standing. Advance through the ranks.",
    access: [
      "All monthly full moon gatherings",
      "Weekly Wednesday training",
      "Founding 72 — May 1",
      "Formation rank progression",
      "Quarterly summits — upgrade required",
    ],
  },
];

// Schedule items for April 15 preview
const SCHEDULE = [
  { time: "May 1 · 6:00 PM", label: "Gates Open — Founding 72 Begins", note: "Waiʻanae Coast" },
  { time: "May 2 · 4:00 AM", label: "Ice Bath as the Flower Moon Sets", note: "Over the Pacific" },
  { time: "May 2 · 6:00 AM", label: "Morning Formation & Oath", note: "All tiers" },
  { time: "May 3 · All Day", label: "Brotherhood Work & Training", note: "Structured formation" },
  { time: "May 4 · Sunrise", label: "Closing Ceremony — 72 Hours Complete", note: "Founding sealed" },
];

const REGIONS = [
  "West Oahu", "East Oahu", "North Shore", "Maui Nui",
  "Big Island", "Kauaʻi", "Mainland West", "Mainland East",
];

export default function GatePage({ visitorName, onPledge }: GatePageProps) {
  const [selectedTier, setSelectedTier] = useState<"nakoa" | "mana" | "alii" | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  // Seats filled — starts at 0 (real launch state)
  // In production, fetch from Supabase applicants count
  const seatsFilled = { alii: 0, mana: 0, nakoa: 0 };

  useEffect(() => {
    const t = setTimeout(() => setShowSchedule(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050709",
      color: "#e8e0d0",
      fontFamily: "'JetBrains Mono', monospace",
      overflowX: "hidden",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(176,142,80,0.1)",
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <p className="font-cormorant" style={{ color: GOLD, fontSize: "1.1rem", letterSpacing: "0.15em" }}>MĀKOA</p>
          <p style={{ color: GOLD_DIM, fontSize: "0.45rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Private Order · Est. May 1, 2025</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.48rem", letterSpacing: "0.1em" }}>Reviewing</p>
          <p style={{ color: "#e8e0d0", fontSize: "0.6rem" }}>{visitorName || "Brother"}</p>
        </div>
      </div>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "36px", animation: "fadeUp 0.7s ease forwards" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "12px" }}>
            Founding 72 · May 1–4, 2025
          </p>
          <h1 className="font-cormorant" style={{
            fontSize: "2.4rem",
            fontWeight: 300,
            color: "#e8e0d0",
            lineHeight: 1.15,
            marginBottom: "16px",
          }}>
            The Gate<br />
            <span style={{ color: GOLD }}>Is Open.</span>
          </h1>
          <p style={{
            color: "rgba(232,224,208,0.45)",
            fontSize: "0.6rem",
            lineHeight: 1.8,
            maxWidth: "320px",
            margin: "0 auto",
          }}>
            72 hours under the Flower Moon.<br />
            Ice bath at 4am as the moon sets over the Pacific.<br />
            Brotherhood sealed in formation.
          </p>
        </div>

        {/* Seat availability — REAL numbers only */}
        <div style={{
          background: "rgba(176,142,80,0.04)",
          border: "1px solid rgba(176,142,80,0.12)",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "28px",
          animation: "fadeUp 0.7s ease 0.1s both",
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px" }}>
            Seat Availability
          </p>
          {TIERS.map(t => {
            const filled = seatsFilled[t.id];
            const open = t.cap - filled;
            const pct = (filled / t.cap) * 100;
            return (
              <div key={t.id} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: t.color, fontSize: "0.52rem", letterSpacing: "0.1em" }}>{t.name}</span>
                  <span style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.5rem" }}>
                    {open} of {t.cap} open
                  </span>
                </div>
                <div style={{ height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "1px" }}>
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: t.color,
                    borderRadius: "1px",
                    transition: "width 1s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tier cards */}
        <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "14px", animation: "fadeUp 0.7s ease 0.15s both" }}>
          Choose Your Path
        </p>

        {TIERS.map((tier, i) => (
          <div
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            style={{
              border: `1px solid ${selectedTier === tier.id ? tier.color : "rgba(255,255,255,0.07)"}`,
              borderRadius: "8px",
              padding: "18px",
              marginBottom: "12px",
              cursor: "pointer",
              background: selectedTier === tier.id ? tier.colorFaint : "rgba(13,17,23,0.6)",
              transition: "all 0.2s ease",
              animation: `fadeUp 0.7s ease ${0.2 + i * 0.08}s both`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                  <span style={{
                    color: tier.color,
                    fontSize: "0.75rem",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                  }}>{tier.name}</span>
                  <span style={{
                    background: tier.colorFaint,
                    border: `1px solid ${tier.colorDim}`,
                    color: tier.color,
                    fontSize: "0.4rem",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}>{tier.subtitle}</span>
                </div>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem" }}>{tier.description}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "12px" }}>
                <p style={{ color: tier.color, fontSize: "0.7rem", fontWeight: 500 }}>{tier.price}</p>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.45rem" }}>{tier.deposit}</p>
              </div>
            </div>

            {selectedTier === tier.id && (
              <div style={{ marginTop: "12px", borderTop: `1px solid ${tier.colorFaint}`, paddingTop: "12px" }}>
                {tier.access.map((item, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                    <span style={{ color: tier.color, fontSize: "0.5rem" }}>—</span>
                    <span style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.52rem" }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* CTA */}
        {selectedTier && (
          <div style={{ animation: "fadeUp 0.5s ease forwards", marginTop: "8px" }}>
            <button
              onClick={() => onPledge(selectedTier)}
              style={{
                width: "100%",
                padding: "15px",
                background: "transparent",
                border: `1px solid ${TIERS.find(t => t.id === selectedTier)?.color || GOLD}`,
                color: TIERS.find(t => t.id === selectedTier)?.color || GOLD,
                fontSize: "0.55rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: "6px",
                fontFamily: "'JetBrains Mono', monospace",
                transition: "all 0.2s",
                marginBottom: "8px",
              }}
            >
              Pledge Your Seat — {TIERS.find(t => t.id === selectedTier)?.name}
            </button>
            <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.45rem", textAlign: "center" }}>
              Pledge is $9.99 · Deposit due upon acceptance
            </p>
          </div>
        )}

        {/* Schedule */}
        {showSchedule && (
          <div style={{ marginTop: "36px", animation: "fadeUp 0.7s ease forwards" }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "14px" }}>
              Founding 72 — Schedule
            </p>
            {SCHEDULE.map((item, i) => (
              <div key={i} style={{
                display: "flex",
                gap: "14px",
                marginBottom: "14px",
                paddingBottom: "14px",
                borderBottom: i < SCHEDULE.length - 1 ? "1px solid rgba(176,142,80,0.06)" : "none",
              }}>
                <div style={{ flexShrink: 0, width: "120px" }}>
                  <p style={{ color: GOLD, fontSize: "0.48rem", lineHeight: 1.4 }}>{item.time}</p>
                </div>
                <div>
                  <p style={{ color: "#e8e0d0", fontSize: "0.55rem", marginBottom: "2px" }}>{item.label}</p>
                  <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.45rem" }}>{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Regions */}
        <div style={{ marginTop: "32px", animation: "fadeUp 0.7s ease 0.3s both" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "12px" }}>
            Active Regions
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
            {REGIONS.map(r => (
              <span key={r} style={{
                background: "rgba(176,142,80,0.06)",
                border: "1px solid rgba(176,142,80,0.12)",
                color: "rgba(232,224,208,0.5)",
                fontSize: "0.45rem",
                padding: "4px 8px",
                borderRadius: "3px",
                letterSpacing: "0.08em",
              }}>{r}</span>
            ))}
          </div>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.5rem", lineHeight: 1.7 }}>
            Don&apos;t see your region? Pledge your seat and XI will place you in the nearest active zone. New chapters open under each full moon.
          </p>
        </div>

        {/* Oath */}
        <div style={{
          marginTop: "36px",
          padding: "20px",
          border: "1px solid rgba(176,142,80,0.1)",
          borderRadius: "8px",
          background: "rgba(176,142,80,0.03)",
          textAlign: "center",
          animation: "fadeUp 0.7s ease 0.4s both",
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.45rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "14px" }}>
            The Oath
          </p>
          <p className="font-cormorant" style={{
            color: "rgba(232,224,208,0.7)",
            fontSize: "1rem",
            fontStyle: "italic",
            lineHeight: 1.9,
            fontWeight: 300,
          }}>
            &ldquo;E komo mai i lalo o ka Malu.<br />
            I enter under the Malu.<br />
            I serve before I am served.<br />
            I build what lasts.<br />
            I stand with my brothers<br />
            under every full moon.&rdquo;
          </p>
        </div>

        {/* Footer */}
        <p style={{
          color: "rgba(176,142,80,0.2)",
          fontSize: "0.45rem",
          textAlign: "center",
          marginTop: "40px",
          letterSpacing: "0.15em",
        }}>
          MĀKOA ORDER · PRIVATE · INVITATION ONLY
        </p>
      </div>
    </div>
  );
}
