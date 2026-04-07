"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
const RED = "#f85149";
const BG = "#04060a";

// ─── Seat state (starts at 0 filled — real launch state) ─────────────────────
const WAR_ROOM_TOTAL = 12;
const MASTERMIND_TOTAL = 20;
const DAYPASS_TOTAL = 10;
const WAR_ROOM_FILLED = 0;
const MASTERMIND_FILLED = 0;
const DAYPASS_FILLED = 0;

const EARLY_BIRD_CUTOFF = new Date("2026-04-15T23:59:59-10:00");

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function CountdownBlock({ target, label }: { target: Date; label: string }) {
  const { days, hours, minutes, seconds } = useCountdown(target);
  return (
    <div>
      <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem", letterSpacing: "0.2em", textAlign: "center", marginBottom: 10 }}>
        {label}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { label: "DAYS", val: days },
          { label: "HRS", val: hours },
          { label: "MIN", val: minutes },
          { label: "SEC", val: seconds },
        ].map(t => (
          <div key={t.label} style={{
            flex: 1, background: "rgba(0,0,0,0.5)",
            border: `1px solid rgba(176,142,80,0.12)`,
            borderRadius: 6, padding: "12px 4px", textAlign: "center",
          }}>
            <p style={{
              color: GOLD, fontSize: "1.4rem", fontWeight: 700, lineHeight: 1,
              fontFamily: "'JetBrains Mono', monospace",
            }}>{String(t.val).padStart(2, "0")}</p>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.36rem", letterSpacing: "0.15em", marginTop: 4 }}>{t.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeatBar({ filled, total, color }: { filled: number; total: number; color: string }) {
  const pct = (filled / total) * 100;
  const remaining = total - filled;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem" }}>{filled} claimed</span>
        <span style={{ color: remaining <= 3 ? RED : color, fontSize: "0.44rem", fontWeight: remaining <= 3 ? 700 : 400 }}>
          {remaining} of {total} remaining
        </span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function UrgencyBadge({ text }: { text: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.3)",
      borderRadius: 4, padding: "4px 10px", marginBottom: 14,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED, animation: "urgencyPulse 1.5s ease-in-out infinite" }} />
      <span style={{ color: RED, fontSize: "0.42rem", letterSpacing: "0.15em" }}>{text}</span>
    </div>
  );
}

const TIMELINE = [
  { time: "Friday · 5:00 PM", event: "Gates Open", detail: "Check-in begins. Brothers arrive. The 48 starts." },
  { time: "Friday · 6:00 PM", event: "War Room Roll Call", detail: "All brothers seated. XI opens the founding session." },
  { time: "Friday · 9:00 PM", event: "Brotherhood Circle", detail: "First circle. Men speak. No performance. Just truth." },
  { time: "Saturday · 3:00 AM", event: "Wake Call", detail: "The van is running. No alarm needed. You know." },
  { time: "Saturday · 3:33 AM", event: "In the Van", detail: "Brothers moving in the dark. West Oahu. The coast." },
  { time: "Saturday · 4:00 AM", event: "Ice Bath", detail: "The Flower Moon sets over the Pacific. You go in." },
  { time: "Saturday · 6:00 AM", event: "Morning Formation", detail: "Oath. Silence. The sun rises over the Ko'olau." },
  { time: "Saturday · 9:00 AM", event: "Mastermind Breakouts", detail: "Trade academies. Skills. Business. Brotherhood." },
  { time: "Saturday · 2:00 PM", event: "Seminar Block", detail: "Healing. Leadership. Building. Men teaching men." },
  { time: "Saturday · 7:00 PM", event: "Founding Dinner", detail: "Brothers at the table. No phones. Just presence." },
  { time: "Sunday · 9:00 AM", event: "Final Sessions", detail: "Commitments made. Plans sealed. Brothers assigned." },
  { time: "Sunday · 5:00 PM", event: "Founding Fire", detail: "The oath. The fire. The moment that doesn't end." },
];

const WHAT_TO_BRING = [
  "Red shirt — solid, nothing on it",
  "Black slacks",
  "Your own towel",
  "That's it.",
];

function Founding48Content() {
  const searchParams = useSearchParams();
  const [handle, setHandle] = useState("Brother");
  const [showTimeline, setShowTimeline] = useState(false);
  const may1 = new Date("2026-05-01T18:00:00-10:00");
  const earlyBird = EARLY_BIRD_CUTOFF;
  const isEarlyBird = Date.now() < earlyBird.getTime();

  useEffect(() => {
    const urlHandle = searchParams.get("h") || searchParams.get("handle") || "";
    const storedHandle = typeof window !== "undefined" ? sessionStorage.getItem("makoa_handle") || "" : "";
    setHandle(urlHandle || storedHandle || "Brother");
    const t = setTimeout(() => setShowTimeline(true), 600);
    return () => clearTimeout(t);
  }, [searchParams]);

  function handleClaim(tier: string) {
    if (typeof window !== "undefined") {
      window.location.href = "https://t.me/+dsS4Mz0p5wM4OGYx";
    }
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes urgencyPulse { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.3); } }
        @keyframes goldShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes breathe { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
      `}</style>

      {/* ── HERO HEADER ───────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "48px 24px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background shimmer */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_40}, transparent)`, marginBottom: 32 }} />

        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em", marginBottom: 16 }}>
          MĀKOA ORDER · FOUNDING EVENT
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: GOLD,
          fontSize: "2.6rem",
          lineHeight: 1.15,
          margin: "0 0 12px",
          animation: "fadeUp 0.9s ease 0.2s both",
        }}>
          The Founding 48
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "rgba(232,224,208,0.6)",
          fontSize: "1.1rem",
          marginBottom: 8,
          animation: "fadeUp 0.9s ease 0.35s both",
        }}>
          May 1–3 · Kapolei · West Oahu
        </p>

        <p style={{
          color: "rgba(232,224,208,0.35)",
          fontSize: "0.5rem",
          lineHeight: 1.7,
          marginBottom: 32,
          animation: "fadeUp 0.9s ease 0.5s both",
        }}>
          The only event where brothers are sworn in at the founding fire.
        </p>

        {/* Main countdown */}
        <div style={{ maxWidth: 360, margin: "0 auto 24px", animation: "fadeUp 0.9s ease 0.6s both" }}>
          <CountdownBlock target={may1} label="FOUNDING FIRE IN" />
        </div>

        <p style={{
          color: "rgba(232,224,208,0.3)",
          fontSize: "0.48rem",
          fontStyle: "italic",
          animation: "fadeUp 0.9s ease 0.7s both",
        }}>
          48 seats. Once they're gone, this moment is gone.
        </p>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>

        {/* ── WHAT HAPPENS IN 48 HOURS ──────────────────────────────────────── */}
        <div style={{ padding: "36px 0 32px" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.25em", marginBottom: 24 }}>
            WHAT HAPPENS IN 48 HOURS
          </p>

          <div style={{ position: "relative" }}>
            {/* Timeline line */}
            <div style={{
              position: "absolute", left: 52, top: 0, bottom: 0,
              width: 1, background: `linear-gradient(to bottom, ${GOLD_20}, transparent)`,
            }} />

            {TIMELINE.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex", gap: 16, marginBottom: 20,
                  opacity: showTimeline ? 1 : 0,
                  transform: showTimeline ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`,
                }}
              >
                {/* Time column */}
                <div style={{ width: 90, flexShrink: 0, textAlign: "right", paddingRight: 16 }}>
                  <p style={{ color: GOLD_DIM, fontSize: "0.4rem", lineHeight: 1.5 }}>{item.time}</p>
                </div>

                {/* Dot */}
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: i === 4 ? GOLD : i === 11 ? GOLD : "rgba(176,142,80,0.3)",
                  border: `1px solid ${GOLD_40}`,
                  flexShrink: 0, marginTop: 3,
                  boxShadow: (i === 4 || i === 11) ? `0 0 8px ${GOLD}` : "none",
                }} />

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    color: (i === 4 || i === 11) ? GOLD : "#e8e0d0",
                    fontSize: "0.55rem",
                    fontWeight: (i === 4 || i === 11) ? 600 : 400,
                    marginBottom: 3,
                  }}>{item.event}</p>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.46rem", lineHeight: 1.6 }}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── EARLY BIRD SECTION ────────────────────────────────────────────── */}
        {isEarlyBird && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
              <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", whiteSpace: "nowrap" }}>
                EARLY BIRD · THROUGH APRIL 15
              </p>
              <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
            </div>

            <div style={{ maxWidth: 360, margin: "0 auto 20px" }}>
              <CountdownBlock target={earlyBird} label="EARLY BIRD CLOSES IN" />
            </div>
          </div>
        )}

        {/* ── WAR ROOM CARD ─────────────────────────────────────────────────── */}
        <div style={{
          border: `1px solid ${GOLD_40}`,
          borderRadius: 12,
          background: "linear-gradient(135deg, #0d0f14 0%, #080a0f 100%)",
          padding: "26px 22px",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(176,142,80,0.05) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 4 }}>WAR ROOM</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#e8e0d0", fontSize: "1.3rem", lineHeight: 1.2 }}>
                Council Level
              </p>
            </div>
            <div style={{
              background: GOLD, color: "#000",
              fontSize: "0.38rem", letterSpacing: "0.12em",
              padding: "4px 10px", borderRadius: 3, fontWeight: 700,
            }}>12 SEATS</div>
          </div>

          <UrgencyBadge text={`${WAR_ROOM_TOTAL - WAR_ROOM_FILLED} OF ${WAR_ROOM_TOTAL} SEATS REMAINING`} />

          {/* What's included */}
          <div style={{ marginBottom: 20 }}>
            {[
              "48hr War Room — all sessions",
              "Hotel room included (Fri–Sun)",
              "4am ice bath under the Flower Moon",
              "Founding fire — sworn in",
              "Makoa gear pack",
              "Founding Brother status — permanent",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ color: GOLD, fontSize: "0.5rem", flexShrink: 0 }}>—</span>
                <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.48rem" }}>{item}</p>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div style={{ background: "rgba(176,142,80,0.06)", border: `1px solid ${GOLD_20}`, borderRadius: 8, padding: "16px", marginBottom: 18 }}>
            {isEarlyBird ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: 2 }}>EARLY BIRD · THRU APR 15</p>
                    <p style={{ color: GOLD, fontSize: "2rem", fontWeight: 700, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>$997</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", textDecoration: "line-through", marginBottom: 2 }}>$1,497</p>
                    <div style={{ background: "rgba(248,81,73,0.15)", border: "1px solid rgba(248,81,73,0.3)", borderRadius: 3, padding: "2px 8px" }}>
                      <p style={{ color: RED, fontSize: "0.42rem", letterSpacing: "0.1em" }}>SAVE $500</p>
                    </div>
                  </div>
                </div>
                <div style={{ height: 1, background: GOLD_20, margin: "10px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.46rem" }}>25% down today</span>
                  <span style={{ color: GOLD, fontSize: "0.6rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>$249.25</span>
                </div>
                <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", marginTop: 4 }}>Balance in 3 payments of $249.25</p>
              </>
            ) : (
              <>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: 6 }}>RETAIL · APR 16–25</p>
                <p style={{ color: GOLD, fontSize: "2rem", fontWeight: 700, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>$1,497</p>
              </>
            )}
          </div>

          <SeatBar filled={WAR_ROOM_FILLED} total={WAR_ROOM_TOTAL} color={GOLD} />

          <button
            onClick={() => handleClaim("warroom")}
            style={{
              width: "100%", background: GOLD, color: "#000",
              border: "none", padding: "15px", fontSize: "0.54rem",
              letterSpacing: "0.2em", cursor: "pointer", borderRadius: 6,
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              marginTop: 16,
            }}
          >
            CLAIM YOUR WAR ROOM SEAT
          </button>
          {isEarlyBird && (
            <p style={{ textAlign: "center", color: "rgba(232,224,208,0.2)", fontSize: "0.42rem", marginTop: 8 }}>
              $249.25 today · 3 payments of $249.25
            </p>
          )}
        </div>

        {/* ── MASTERMIND CARD ───────────────────────────────────────────────── */}
        <div style={{
          border: `1px solid ${BLUE_20}`,
          borderRadius: 12,
          background: "linear-gradient(135deg, #0a0d14 0%, #080a0f 100%)",
          padding: "26px 22px",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(88,166,255,0.04) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <p style={{ color: BLUE, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 4 }}>MASTERMIND</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#e8e0d0", fontSize: "1.3rem", lineHeight: 1.2 }}>
                Skills Level
              </p>
            </div>
            <div style={{
              background: BLUE, color: "#000",
              fontSize: "0.38rem", letterSpacing: "0.12em",
              padding: "4px 10px", borderRadius: 3, fontWeight: 700,
            }}>20 SEATS</div>
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.3)",
            borderRadius: 4, padding: "4px 10px", marginBottom: 14,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED, animation: "urgencyPulse 1.5s ease-in-out infinite" }} />
            <span style={{ color: RED, fontSize: "0.42rem", letterSpacing: "0.15em" }}>
              {MASTERMIND_TOTAL - MASTERMIND_FILLED} OF {MASTERMIND_TOTAL} SEATS REMAINING
            </span>
          </div>

          <div style={{ marginBottom: 20 }}>
            {[
              "48hr Mastermind — all sessions",
              "4am ice bath under the Flower Moon",
              "Founding fire — sworn in",
              "Makoa gear pack",
              "Founding Brother status — permanent",
              "No hotel room (commuter access)",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ color: BLUE, fontSize: "0.5rem", flexShrink: 0 }}>—</span>
                <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.48rem" }}>{item}</p>
              </div>
            ))}
          </div>

          <div style={{ background: BLUE_10, border: `1px solid ${BLUE_20}`, borderRadius: 8, padding: "16px", marginBottom: 18 }}>
            {isEarlyBird ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <p style={{ color: BLUE, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: 2 }}>EARLY BIRD · THRU APR 15</p>
                    <p style={{ color: BLUE, fontSize: "2rem", fontWeight: 700, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>$497</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", textDecoration: "line-through", marginBottom: 2 }}>$697</p>
                    <div style={{ background: "rgba(248,81,73,0.15)", border: "1px solid rgba(248,81,73,0.3)", borderRadius: 3, padding: "2px 8px" }}>
                      <p style={{ color: RED, fontSize: "0.42rem", letterSpacing: "0.1em" }}>SAVE $200</p>
                    </div>
                  </div>
                </div>
                <div style={{ height: 1, background: BLUE_20, margin: "10px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.46rem" }}>25% down today</span>
                  <span style={{ color: BLUE, fontSize: "0.6rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>$124.25</span>
                </div>
              </>
            ) : (
              <>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: 6 }}>RETAIL · APR 16–25</p>
                <p style={{ color: BLUE, fontSize: "2rem", fontWeight: 700, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>$697</p>
              </>
            )}
          </div>

          <SeatBar filled={MASTERMIND_FILLED} total={MASTERMIND_TOTAL} color={BLUE} />

          <button
            onClick={() => handleClaim("mastermind")}
            style={{
              width: "100%", background: "transparent", color: BLUE,
              border: `1px solid ${BLUE}`, padding: "15px", fontSize: "0.54rem",
              letterSpacing: "0.2em", cursor: "pointer", borderRadius: 6,
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              marginTop: 16,
            }}
          >
            CLAIM YOUR MASTERMIND SEAT
          </button>
          {isEarlyBird && (
            <p style={{ textAlign: "center", color: "rgba(232,224,208,0.2)", fontSize: "0.42rem", marginTop: 8 }}>
              $124.25 today · balance in 3 payments
            </p>
          )}
        </div>

        {/* ── LAST MINUTE SEATS ─────────────────────────────────────────────── */}
        <div style={{
          background: "#080b10",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          padding: "20px 18px",
          marginBottom: 20,
        }}>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 14 }}>
            LAST MINUTE SEATS · APR 16–25
          </p>
          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.48rem", lineHeight: 1.7, marginBottom: 14 }}>
            These seats open April 16th. Early birds are seated first.
          </p>
          {[
            { label: "War Room Last Call", price: "$1,497", note: "Full retail" },
            { label: "Mastermind Last Call", price: "$697", note: "Full retail" },
          ].map(row => (
            <div key={row.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}>
              <div>
                <p style={{ color: "#e8e0d0", fontSize: "0.5rem" }}>{row.label}</p>
                <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem" }}>{row.note}</p>
              </div>
              <p style={{ color: GOLD, fontSize: "0.65rem", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{row.price}</p>
            </div>
          ))}
        </div>

        {/* ── DAY PASS CARD ─────────────────────────────────────────────────── */}
        <div style={{
          border: `1px solid ${GREEN_20}`,
          borderRadius: 12,
          background: "linear-gradient(135deg, #0a0d0a 0%, #080a08 100%)",
          padding: "26px 22px",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(63,185,80,0.04) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <p style={{ color: GREEN, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 4 }}>DAY PASS</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#e8e0d0", fontSize: "1.3rem", lineHeight: 1.2 }}>
                Warrior Level
              </p>
            </div>
            <div style={{
              background: GREEN, color: "#000",
              fontSize: "0.38rem", letterSpacing: "0.12em",
              padding: "4px 10px", borderRadius: 3, fontWeight: 700,
            }}>10 PER DAY</div>
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.3)",
            borderRadius: 4, padding: "4px 10px", marginBottom: 14,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED, animation: "urgencyPulse 1.5s ease-in-out infinite" }} />
            <span style={{ color: RED, fontSize: "0.42rem", letterSpacing: "0.15em" }}>
              {DAYPASS_TOTAL - DAYPASS_FILLED} OF {DAYPASS_TOTAL} PASSES REMAINING PER DAY
            </span>
          </div>

          <div style={{ marginBottom: 20 }}>
            {[
              "Saturday OR Sunday — your choice",
              "Seminar block 9am–2pm",
              "4am ice bath (Saturday pass)",
              "Founding fire (Sunday pass)",
              "No hotel room",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ color: GREEN, fontSize: "0.5rem", flexShrink: 0 }}>—</span>
                <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.48rem" }}>{item}</p>
              </div>
            ))}
          </div>

          <div style={{ background: GREEN_10, border: `1px solid ${GREEN_20}`, borderRadius: 8, padding: "16px", marginBottom: 18 }}>
            <p style={{ color: GREEN, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: 4 }}>PER DAY</p>
            <p style={{ color: GREEN, fontSize: "2rem", fontWeight: 700, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>$297</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", marginTop: 4 }}>No early bird — flat rate</p>
          </div>

          <SeatBar filled={DAYPASS_FILLED} total={DAYPASS_TOTAL} color={GREEN} />

          <button
            onClick={() => handleClaim("daypass")}
            style={{
              width: "100%", background: "transparent", color: GREEN,
              border: `1px solid ${GREEN}`, padding: "15px", fontSize: "0.54rem",
              letterSpacing: "0.2em", cursor: "pointer", borderRadius: 6,
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              marginTop: 16,
            }}
          >
            GRAB A DAY PASS
          </button>
        </div>

        {/* ── WHAT TO BRING ─────────────────────────────────────────────────── */}
        <div style={{
          background: "#080b10",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 10,
          padding: "22px 20px",
          marginBottom: 28,
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 16 }}>WHAT TO BRING</p>
          {WHAT_TO_BRING.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ color: GOLD_DIM, fontSize: "0.5rem", flexShrink: 0 }}>·</span>
              <p style={{
                color: i === WHAT_TO_BRING.length - 1 ? GOLD_DIM : "rgba(232,224,208,0.6)",
                fontSize: "0.5rem",
                fontStyle: i === WHAT_TO_BRING.length - 1 ? "italic" : "normal",
              }}>{item}</p>
            </div>
          ))}
        </div>

        {/* ── MEN'S HEALING ─────────────────────────────────────────────────── */}
        <div style={{
          borderLeft: `3px solid ${GOLD_40}`,
          background: "rgba(176,142,80,0.03)",
          borderRadius: "0 8px 8px 0",
          padding: "24px 20px",
          marginBottom: 28,
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 16 }}>MEN'S HEALING</p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.7)",
            fontSize: "1.05rem",
            lineHeight: 2.1,
          }}>
            This is not a conference.<br />
            This is not a retreat.<br /><br />
            This is what happens when men stop performing strength<br />
            and start building it together.<br /><br />
            4am ice bath. Brotherhood. The oath.<br /><br />
            Healing is not soft —<br />
            it is the hardest thing a man can do.
          </p>
        </div>

        {/* ── FOUNDING BROTHER STATUS ───────────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg, #0d0f14 0%, #080a0f 100%)",
          border: `1px solid ${GOLD_40}`,
          borderRadius: 12,
          padding: "28px 22px",
          marginBottom: 32,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: `1px solid ${GOLD_20}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <span style={{ color: GOLD_DIM, fontSize: "1.2rem", animation: "breathe 3s ease-in-out infinite" }}>◈</span>
          </div>

          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.25em", marginBottom: 16 }}>
            FOUNDING BROTHER STATUS
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "1.1rem",
            lineHeight: 2.0,
            marginBottom: 20,
          }}>
            Every man who stands at the founding fire<br />
            becomes a Founding Brother of the Makoa Order.
          </p>

          <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
            {[
              "This status is permanent.",
              "This moment happens once.",
              "Your stone is engraved.",
              "Your name is sealed.",
            ].map(line => (
              <p key={line} style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                color: GOLD_DIM,
                fontSize: "0.95rem",
                lineHeight: 1.8,
              }}>{line}</p>
            ))}
          </div>

          <div style={{ height: 1, background: GOLD_20, margin: "20px 0" }} />

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.4)",
            fontSize: "0.9rem",
          }}>
            Under the Malu — I am Makoa.
          </p>
        </div>

        {/* ── BOTTOM COUNTDOWN + CTA ────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <CountdownBlock target={may1} label="FOUNDING FIRE IN" />
        </div>

        <button
          onClick={() => handleClaim("warroom")}
          style={{
            width: "100%", background: GOLD, color: "#000",
            border: "none", padding: "17px", fontSize: "0.58rem",
            letterSpacing: "0.22em", cursor: "pointer", borderRadius: 6,
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            marginBottom: 12,
          }}
        >
          CLAIM YOUR FOUNDING SEAT
        </button>
        <p style={{ textAlign: "center", color: "rgba(232,224,208,0.2)", fontSize: "0.42rem", marginBottom: 32 }}>
          48 seats total · once they're gone, this moment is gone
        </p>

        {/* ── TELEGRAM STRIP ───────────────────────────────────────────────── */}
        <div style={{
          background: "#080b10", border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 8, padding: "14px 16px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 28,
        }}>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem", lineHeight: 1.5 }}>
            Follow the signal —<br />updates drop on Telegram
          </p>
          <a
            href="https://t.me/+dsS4Mz0p5wM4OGYx"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              border: `1px solid ${BLUE}`, color: BLUE, fontSize: "0.44rem",
              padding: "8px 14px", borderRadius: 4, textDecoration: "none",
              letterSpacing: "0.1em", whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            JOIN THE SIGNAL
          </a>
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
            MĀKOA ORDER · MALU TRUST · WEST OAHU · 2026
          </p>
        </div>

      </div>
    </div>
  );
}

export default function Founding48Page() {
  return (
    <Suspense fallback={
      <div style={{ background: "#04060a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(176,142,80,0.4)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.2em" }}>
          LOADING...
        </p>
      </div>
    }>
      <Founding48Content />
    </Suspense>
  );
}
