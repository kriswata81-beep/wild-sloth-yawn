"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.12)";

// Founding 72 — 72 seats, one tier, one price
const FOUNDING_72_SEATS = 72;

interface GatePageProps {
  visitorName: string;
  onPledge: (tier: "nakoa" | "mana" | "alii") => void;
}

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
  const [showPledgePopup, setShowPledgePopup] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  // Seats filled — starts at 0 (real launch state)
  const seatsFilled = 0;
  const seatsOpen = FOUNDING_72_SEATS - seatsFilled;

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

      {/* Hero image — full bleed */}
      <div style={{ position: "relative", height: "320px", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/hero-waianae-moon.png"
          alt="Waiʻanae Mountains under the Flower Moon"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(5,7,9,0.5) 0%, rgba(5,7,9,0.05) 40%, rgba(5,7,9,0.05) 55%, rgba(5,7,9,0.95) 100%)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(176,142,80,0.25), transparent)",
        }} />
        <div style={{ position: "absolute", bottom: 28, left: 0, right: 0, textAlign: "center" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.45rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "8px", textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
            Founding 72 · May 1–4, 2025
          </p>
          <h1 className="font-cormorant" style={{
            fontSize: "2.6rem",
            fontWeight: 300,
            color: "#e8e0d0",
            lineHeight: 1.1,
            margin: 0,
            textShadow: "0 2px 24px rgba(0,0,0,0.8)",
          }}>
            The Gate<br />
            <span style={{ color: GOLD }}>Is Open.</span>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* Hero subtext */}
        <div style={{ textAlign: "center", marginBottom: "32px", animation: "fadeUp 0.7s ease forwards" }}>
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

        {/* Seat availability */}
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
          <div style={{ marginBottom: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: GOLD, fontSize: "0.52rem", letterSpacing: "0.1em" }}>The Founding 72</span>
              <span style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.5rem" }}>
                {seatsOpen} of {FOUNDING_72_SEATS} open
              </span>
            </div>
            <div style={{ height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "1px" }}>
              <div style={{
                height: "100%",
                width: `${(seatsFilled / FOUNDING_72_SEATS) * 100}%`,
                background: GOLD,
                borderRadius: "1px",
                transition: "width 1s ease",
              }} />
            </div>
          </div>
        </div>

        {/* THE FOUNDING 72 — Single unified card */}
        <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "14px", animation: "fadeUp 0.7s ease 0.15s both" }}>
          The Founding 72
        </p>

        <div style={{
          border: `1px solid ${GOLD}`,
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "20px",
          background: GOLD_FAINT,
          animation: "fadeUp 0.7s ease 0.2s both",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle shimmer overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(176,142,80,0.06) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <p className="font-cormorant" style={{ color: GOLD, fontSize: "1.6rem", fontStyle: "italic", lineHeight: 1.1, marginBottom: "4px" }}>
                The Founding 72
              </p>
              <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em" }}>MAY 1–4 · WAIʻANAE COAST</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "12px" }}>
              <p style={{ color: GOLD, fontSize: "1.1rem", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>$297</p>
              <p style={{ color: GOLD_DIM, fontSize: "0.38rem", marginTop: "2px" }}>founding fee</p>
            </div>
          </div>

          {/* The oath line */}
          <div style={{
            borderTop: "1px solid rgba(176,142,80,0.2)",
            borderBottom: "1px solid rgba(176,142,80,0.2)",
            padding: "14px 0",
            marginBottom: "16px",
            textAlign: "center",
          }}>
            <p className="font-cormorant" style={{ color: "rgba(232,224,208,0.7)", fontSize: "0.95rem", fontStyle: "italic", lineHeight: 1.8 }}>
              Every brother. Same door.<br />Same oath. Same fire.
            </p>
          </div>

          {/* Details */}
          <div style={{ display: "grid", gap: "8px", marginBottom: "20px" }}>
            {[
              { label: "Seats", value: "72 Founding Seats" },
              { label: "Duration", value: "72 hours — May 1–4" },
              { label: "Includes", value: "Starts your $97/mo membership" },
              { label: "Payment", value: "$74.25 today · 3 payments of $74.25" },
              { label: "Access", value: "All brothers — one tier, one oath" },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(176,142,80,0.08)" }}>
                <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.44rem" }}>{row.label}</span>
                <span style={{ color: "#e8e0d0", fontSize: "0.48rem" }}>{row.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowPledgePopup(true)}
            style={{
              width: "100%",
              padding: "15px",
              background: "transparent",
              border: `1px solid ${GOLD}`,
              color: GOLD,
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: "6px",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.2s",
            }}
          >
            Claim Your Founding Seat
          </button>
          <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.42rem", textAlign: "center", marginTop: "8px" }}>
            {seatsOpen} of {FOUNDING_72_SEATS} seats remaining
          </p>
        </div>

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

      {/* Pledge Popup */}
      {showPledgePopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.88)",
            zIndex: 100,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={() => setShowPledgePopup(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#080b0f",
              border: "1px solid rgba(176,142,80,0.2)",
              borderRadius: "12px 12px 0 0",
              padding: "28px 24px 36px",
              width: "100%",
              maxWidth: "480px",
              animation: "fadeUp 0.35s ease forwards",
            }}
          >
            {/* Close */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <p className="font-cormorant" style={{ color: GOLD, fontSize: "1.3rem", fontStyle: "italic" }}>
                Founding Fee
              </p>
              <button
                onClick={() => setShowPledgePopup(false)}
                style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "1rem" }}
              >×</button>
            </div>

            {/* Price breakdown */}
            <div style={{
              background: "rgba(176,142,80,0.06)",
              border: "1px solid rgba(176,142,80,0.15)",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.45rem", letterSpacing: "0.15em" }}>$297 FOUNDING FEE</p>
                <p style={{ color: GOLD, fontSize: "1.2rem", fontFamily: "'JetBrains Mono', monospace" }}>$297</p>
              </div>

              <div style={{ display: "grid", gap: "8px" }}>
                {[
                  { label: "Due today (25% down)", value: "$74.25", highlight: true },
                  { label: "Payment 2", value: "$74.25" },
                  { label: "Payment 3", value: "$74.25" },
                  { label: "Includes", value: "May 1–4 event" },
                  { label: "Starts", value: "$97/mo membership" },
                ].map(row => (
                  <div key={row.label} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px solid rgba(176,142,80,0.08)",
                  }}>
                    <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.46rem" }}>{row.label}</span>
                    <span style={{
                      color: row.highlight ? GOLD : "#e8e0d0",
                      fontSize: row.highlight ? "0.6rem" : "0.48rem",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: row.highlight ? 600 : 400,
                    }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem", lineHeight: 1.7, marginBottom: "20px", textAlign: "center" }}>
              Every brother. Same door. Same oath. Same fire.<br />
              <span style={{ color: GOLD_DIM }}>72 founding seats. No tiers. No exceptions.</span>
            </p>

            <button
              onClick={() => { setShowPledgePopup(false); onPledge("nakoa"); }}
              style={{
                width: "100%",
                padding: "16px",
                background: "transparent",
                border: `1px solid ${GOLD}`,
                color: GOLD,
                fontSize: "0.55rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: "6px",
                fontFamily: "'JetBrains Mono', monospace",
                transition: "all 0.2s",
                marginBottom: "10px",
              }}
            >
              Pledge — $74.25 Today
            </button>
            <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.42rem", textAlign: "center" }}>
              3 payments of $74.25 · $97/mo membership begins after founding event
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
