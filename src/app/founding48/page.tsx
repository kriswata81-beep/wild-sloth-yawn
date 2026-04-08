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

// ─── Seat state ───────────────────────────────────────────────────────────────
const WAR_VAN_TOTAL = 8;
const WAR_ROOM_TOTAL = 12;
const MASTERMIND_TOTAL = 12;
const DAYPASS_TOTAL = 12; // 6/day × 2 days
const WAR_VAN_FILLED = 0;
const WAR_ROOM_FILLED = 0;
const MASTERMIND_FILLED = 0;
const DAYPASS_FILLED = 0;

// April 15 Hawaii time (HST = UTC-10)
const EARLY_BIRD_CUTOFF = new Date("2026-04-15T23:59:59-10:00");
const MAY_1 = new Date("2026-05-01T17:00:00-10:00");

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

function CountdownBlock({ target, label, color = GOLD }: { target: Date; label: string; color?: string }) {
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
              color: color, fontSize: "1.4rem", fontWeight: 700, lineHeight: 1,
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

function PulsingDot({ color = RED }: { color?: string }) {
  return (
    <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, animation: "urgencyPulse 1.5s ease-in-out infinite", flexShrink: 0 }} />
  );
}

function SeatBadge({ remaining, total, color = RED }: { remaining: number; total: number; color?: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.3)",
      borderRadius: 4, padding: "5px 11px", marginBottom: 16,
    }}>
      <PulsingDot />
      <span style={{ color: RED, fontSize: "0.42rem", letterSpacing: "0.15em" }}>
        {remaining} OF {total} SEATS REMAINING
      </span>
    </div>
  );
}

function PricingBlock({
  isEarlyBird,
  earlyPrice,
  lastCallPrice,
  earlyLabel,
  lastCallLabel,
  downToday,
  paymentNote,
  color,
  bg,
  border,
}: {
  isEarlyBird: boolean;
  earlyPrice: string;
  lastCallPrice: string;
  earlyLabel?: string;
  lastCallLabel?: string;
  downToday?: string;
  paymentNote?: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "16px", marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        {/* Early Bird column */}
        <div>
          <p style={{
            color: isEarlyBird ? color : "rgba(232,224,208,0.25)",
            fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: 3,
            textDecoration: isEarlyBird ? "none" : "line-through",
          }}>
            {earlyLabel || "EARLY BIRD · THRU APR 15"}
          </p>
          <p style={{
            color: isEarlyBird ? color : "rgba(232,224,208,0.25)",
            fontSize: "1.9rem", fontWeight: 700, lineHeight: 1,
            fontFamily: "'JetBrains Mono', monospace",
            textDecoration: isEarlyBird ? "none" : "line-through",
          }}>{earlyPrice}</p>
        </div>
        {/* Last Call column */}
        <div style={{ textAlign: "right" }}>
          <p style={{
            color: isEarlyBird ? "rgba(232,224,208,0.3)" : color,
            fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: 3,
          }}>
            {lastCallLabel || "LAST CALL · APR 16–25"}
          </p>
          <p style={{
            color: isEarlyBird ? "rgba(232,224,208,0.3)" : color,
            fontSize: isEarlyBird ? "1.1rem" : "1.9rem",
            fontWeight: isEarlyBird ? 400 : 700,
            lineHeight: 1,
            fontFamily: "'JetBrains Mono', monospace",
          }}>{lastCallPrice}</p>
        </div>
      </div>
      {(downToday || paymentNote) && (
        <>
          <div style={{ height: 1, background: border, margin: "10px 0" }} />
          {downToday && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem" }}>
                {isEarlyBird ? "25% down today" : "Pay in full"}
              </span>
              <span style={{ color, fontSize: "0.65rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                {isEarlyBird ? downToday : lastCallPrice}
              </span>
            </div>
          )}
          {paymentNote && isEarlyBird && (
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", marginTop: 4 }}>{paymentNote}</p>
          )}
        </>
      )}
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

const TEAM_PACKS = [
  { label: "War Van · Team of 3", perPerson: "$699/each", total: "$2,097", color: GOLD, border: GOLD_40 },
  { label: "War Van · Team of 5", perPerson: "$649/each", total: "$3,245", color: GOLD, border: GOLD_40 },
  { label: "War Room · Team of 3", perPerson: "$449/each", total: "$1,347", color: GOLD, border: GOLD_20 },
  { label: "Mastermind · Team of 3", perPerson: "$265/each", total: "$797", color: BLUE, border: BLUE_20 },
];

function Founding48Content() {
  const searchParams = useSearchParams();
  const [handle, setHandle] = useState("Brother");
  const [showTimeline, setShowTimeline] = useState(false);

  const isEarlyBird = Date.now() < EARLY_BIRD_CUTOFF.getTime();

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
        @keyframes urgencyPulse { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.4); } }
        @keyframes breathe { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes goldGlow { 0%,100% { box-shadow: 0 0 12px rgba(176,142,80,0.15); } 50% { box-shadow: 0 0 28px rgba(176,142,80,0.35); } }
      `}</style>

      {/* ── HERO HEADER ─────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "48px 24px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.07) 0%, transparent 70%)",
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
          MAYDAY<br />Founding 48
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

        {/* Dual countdowns */}
        <div style={{ maxWidth: 400, margin: "0 auto", animation: "fadeUp 0.9s ease 0.6s both" }}>
          <div style={{ marginBottom: 20 }}>
            <CountdownBlock target={MAY_1} label="FOUNDING FIRE IN" color={GOLD} />
          </div>
          {isEarlyBird && (
            <div style={{
              background: "rgba(248,81,73,0.06)",
              border: "1px solid rgba(248,81,73,0.2)",
              borderRadius: 8,
              padding: "14px 16px",
            }}>
              <CountdownBlock target={EARLY_BIRD_CUTOFF} label="⚡ EARLY BIRD CLOSES IN" color={RED} />
            </div>
          )}
        </div>

        <p style={{
          color: "rgba(232,224,208,0.3)",
          fontSize: "0.48rem",
          fontStyle: "italic",
          marginTop: 20,
          animation: "fadeUp 0.9s ease 0.7s both",
        }}>
          44 seats total. Once they're gone, this moment is gone.
        </p>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>

        {/* ── EARLY BIRD BANNER ─────────────────────────────────────────────── */}
        {isEarlyBird && (
          <div style={{
            margin: "28px 0 0",
            background: "rgba(176,142,80,0.06)",
            border: `1px solid ${GOLD_40}`,
            borderRadius: 8,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <PulsingDot color={GOLD} />
            <div>
              <p style={{ color: GOLD, fontSize: "0.48rem", letterSpacing: "0.15em", marginBottom: 2 }}>EARLY BIRD PRICING ACTIVE</p>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem" }}>Lock in your seat before April 15. Prices rise April 16.</p>
            </div>
          </div>
        )}

        {!isEarlyBird && (
          <div style={{
            margin: "28px 0 0",
            background: "rgba(248,81,73,0.08)",
            border: "1px solid rgba(248,81,73,0.3)",
            borderRadius: 8,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <PulsingDot color={RED} />
            <div>
              <p style={{ color: RED, fontSize: "0.48rem", letterSpacing: "0.15em", marginBottom: 2 }}>LAST CALL PRICING — APR 16–25</p>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem" }}>Early bird has closed. Remaining seats at last call price.</p>
            </div>
          </div>
        )}

        {/* ── WHAT HAPPENS IN 48 HOURS ──────────────────────────────────────── */}
        <div style={{ padding: "36px 0 28px" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.25em", marginBottom: 24 }}>
            WHAT HAPPENS IN 48 HOURS
          </p>

          <div style={{ position: "relative" }}>
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
                <div style={{ width: 90, flexShrink: 0, textAlign: "right", paddingRight: 16 }}>
                  <p style={{ color: GOLD_DIM, fontSize: "0.4rem", lineHeight: 1.5 }}>{item.time}</p>
                </div>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: (i === 5 || i === 11) ? GOLD : "rgba(176,142,80,0.3)",
                  border: `1px solid ${GOLD_40}`,
                  flexShrink: 0, marginTop: 3,
                  boxShadow: (i === 5 || i === 11) ? `0 0 8px ${GOLD}` : "none",
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{
                    color: (i === 5 || i === 11) ? GOLD : "#e8e0d0",
                    fontSize: "0.55rem",
                    fontWeight: (i === 5 || i === 11) ? 600 : 400,
                    marginBottom: 3,
                  }}>{item.event}</p>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.46rem", lineHeight: 1.6 }}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION DIVIDER ───────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", whiteSpace: "nowrap" }}>CHOOSE YOUR SEAT</p>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TIER 1 — WAR VAN VIP
        ══════════════════════════════════════════════════════════════════════ */}
        <div style={{
          border: `2px solid ${GOLD}`,
          borderRadius: 14,
          background: "linear-gradient(135deg, #0f1018 0%, #080a0f 100%)",
          padding: "28px 22px",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
          animation: "goldGlow 4s ease-in-out infinite",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(176,142,80,0.08) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />

          {/* Crown badge */}
          <div style={{
            position: "absolute", top: 14, right: 14,
            background: GOLD, color: "#000",
            fontSize: "0.38rem", letterSpacing: "0.12em",
            padding: "4px 10px", borderRadius: 3, fontWeight: 700,
          }}>👑 VIP · 8 SEATS</div>

          <div style={{ marginBottom: 8 }}>
            <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 4 }}>WAR VAN VIP</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#e8e0d0", fontSize: "1.5rem", lineHeight: 1.2 }}>
              The Full Experience
            </p>
          </div>

          <SeatBadge remaining={WAR_VAN_TOTAL - WAR_VAN_FILLED} total={WAR_VAN_TOTAL} />

          <div style={{ marginBottom: 20 }}>
            {[
              "Airport pickup from HNL — Makoa van",
              "Hotel room included · 2 nights shared",
              "All War Room + Mastermind sessions",
              "4am ice bath both mornings",
              "Founding fire + oath",
              "Founding gear pack",
              "Private XI briefing",
              "Founding Brother status — permanent",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                <span style={{ color: GOLD, fontSize: "0.5rem", flexShrink: 0, marginTop: 1 }}>—</span>
                <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "0.48rem", lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>

          <PricingBlock
            isEarlyBird={isEarlyBird}
            earlyPrice="$799"
            lastCallPrice="$999"
            earlyLabel="EARLY BIRD · THRU APR 15"
            lastCallLabel="LAST CALL · APR 16–25"
            downToday="$199.75"
            paymentNote="Balance: 3 payments of $199.75"
            color={GOLD}
            bg={GOLD_10}
            border={GOLD_40}
          />

          <SeatBar filled={WAR_VAN_FILLED} total={WAR_VAN_TOTAL} color={GOLD} />

          <button
            onClick={() => handleClaim("warvan")}
            style={{
              width: "100%", background: GOLD, color: "#000",
              border: "none", padding: "16px", fontSize: "0.54rem",
              letterSpacing: "0.2em", cursor: "pointer", borderRadius: 6,
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              marginTop: 16,
            }}
          >
            CLAIM YOUR VAN SEAT
          </button>
          {isEarlyBird && (
            <p style={{ textAlign: "center", color: "rgba(232,224,208,0.25)", fontSize: "0.42rem", marginTop: 8 }}>
              $199.75 today · 3 payments of $199.75
            </p>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TIER 2 — WAR ROOM
        ══════════════════════════════════════════════════════════════════════ */}
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

          <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(176,142,80,0.15)", border: `1px solid ${GOLD_40}`, color: GOLD, fontSize: "0.38rem", letterSpacing: "0.12em", padding: "4px 10px", borderRadius: 3, fontWeight: 700 }}>
            👑 12 SEATS
          </div>

          <div style={{ marginBottom: 8 }}>
            <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 4 }}>WAR ROOM</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#e8e0d0", fontSize: "1.4rem", lineHeight: 1.2 }}>
              Council Level
            </p>
          </div>

          <SeatBadge remaining={WAR_ROOM_TOTAL - WAR_ROOM_FILLED} total={WAR_ROOM_TOTAL} />

          <div style={{ marginBottom: 20 }}>
            {[
              "Drive yourself to the hotel",
              "Hotel room included · 2 nights shared",
              "All War Room + Mastermind sessions",
              "4am ice bath both mornings",
              "Founding fire + oath",
              "Founding gear pack",
              "Founding Brother status — permanent",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                <span style={{ color: GOLD, fontSize: "0.5rem", flexShrink: 0, marginTop: 1 }}>—</span>
                <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.48rem", lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>

          <PricingBlock
            isEarlyBird={isEarlyBird}
            earlyPrice="$499"
            lastCallPrice="$699"
            earlyLabel="EARLY BIRD · THRU APR 15"
            lastCallLabel="LAST CALL · APR 16–25"
            downToday="$124.75"
            paymentNote="Balance: 3 payments of $124.75"
            color={GOLD}
            bg={GOLD_10}
            border={GOLD_40}
          />

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
              $124.75 today · 3 payments of $124.75
            </p>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TIER 3 — MASTERMIND
        ══════════════════════════════════════════════════════════════════════ */}
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

          <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(88,166,255,0.12)", border: `1px solid ${BLUE_20}`, color: BLUE, fontSize: "0.38rem", letterSpacing: "0.12em", padding: "4px 10px", borderRadius: 3, fontWeight: 700 }}>
            🌀 12 SEATS
          </div>

          <div style={{ marginBottom: 8 }}>
            <p style={{ color: BLUE, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 4 }}>MASTERMIND</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#e8e0d0", fontSize: "1.4rem", lineHeight: 1.2 }}>
              Skills Level
            </p>
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.3)",
            borderRadius: 4, padding: "5px 11px", marginBottom: 16,
          }}>
            <PulsingDot />
            <span style={{ color: RED, fontSize: "0.42rem", letterSpacing: "0.15em" }}>
              {MASTERMIND_TOTAL - MASTERMIND_FILLED} OF {MASTERMIND_TOTAL} SEATS REMAINING
            </span>
          </div>

          <div style={{ marginBottom: 20 }}>
            {[
              "Book your own hotel",
              "All Mastermind sessions",
              "4am ice bath both mornings",
              "Founding fire + oath",
              "Founding gear pack",
              "Founding Brother status — permanent",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                <span style={{ color: BLUE, fontSize: "0.5rem", flexShrink: 0, marginTop: 1 }}>—</span>
                <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.48rem", lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>

          <PricingBlock
            isEarlyBird={isEarlyBird}
            earlyPrice="$299"
            lastCallPrice="$399"
            earlyLabel="EARLY BIRD · THRU APR 15"
            lastCallLabel="LAST CALL · APR 16–25"
            downToday="$299"
            paymentNote="Pay in full today"
            color={BLUE}
            bg={BLUE_10}
            border={BLUE_20}
          />

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
              $299 today · pay in full
            </p>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TIER 4 — DAY PASS
        ══════════════════════════════════════════════════════════════════════ */}
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

          <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(63,185,80,0.12)", border: `1px solid ${GREEN_20}`, color: GREEN, fontSize: "0.38rem", letterSpacing: "0.12em", padding: "4px 10px", borderRadius: 3, fontWeight: 700 }}>
            ⚔️ 6/DAY
          </div>

          <div style={{ marginBottom: 8 }}>
            <p style={{ color: GREEN, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 4 }}>DAY PASS</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#e8e0d0", fontSize: "1.4rem", lineHeight: 1.2 }}>
              Warrior Level
            </p>
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.3)",
            borderRadius: 4, padding: "5px 11px", marginBottom: 16,
          }}>
            <PulsingDot />
            <span style={{ color: RED, fontSize: "0.42rem", letterSpacing: "0.15em" }}>
              {DAYPASS_TOTAL - DAYPASS_FILLED} OF {DAYPASS_TOTAL} PASSES REMAINING (6/DAY)
            </span>
          </div>

          <div style={{ marginBottom: 20 }}>
            {[
              "Saturday OR Sunday — your choice",
              "Seminar block 9am–2pm",
              "4am ice bath (both mornings)",
              "Founding fire — Sunday only",
              "No hotel room",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                <span style={{ color: GREEN, fontSize: "0.5rem", flexShrink: 0, marginTop: 1 }}>—</span>
                <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.48rem", lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>

          <PricingBlock
            isEarlyBird={isEarlyBird}
            earlyPrice="$149"
            lastCallPrice="$199"
            earlyLabel="EARLY BIRD · THRU APR 15"
            lastCallLabel="LAST CALL · APR 16–25"
            downToday="$149"
            paymentNote="Pay in full today"
            color={GREEN}
            bg={GREEN_10}
            border={GREEN_20}
          />

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
          {isEarlyBird && (
            <p style={{ textAlign: "center", color: "rgba(232,224,208,0.2)", fontSize: "0.42rem", marginTop: 8 }}>
              $149 today · pay in full
            </p>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TEAM PACKS
        ══════════════════════════════════════════════════════════════════════ */}
        <div style={{
          background: "#080b10",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "26px 22px",
          marginBottom: 32,
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.25em", marginBottom: 6 }}>BRING YOUR TEAM</p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.6)",
            fontSize: "1.05rem",
            marginBottom: 22,
          }}>
            Save when you come together.
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            {TEAM_PACKS.map((pack, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${pack.border}`,
                borderRadius: 8,
                padding: "14px 16px",
              }}>
                <div>
                  <p style={{ color: pack.color, fontSize: "0.48rem", marginBottom: 3 }}>{pack.label}</p>
                  <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem" }}>{pack.perPerson}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: pack.color, fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginBottom: 6 }}>
                    {pack.total}
                  </p>
                  <button
                    onClick={() => handleClaim("team")}
                    style={{
                      background: "transparent", color: pack.color,
                      border: `1px solid ${pack.color}`, padding: "5px 12px",
                      fontSize: "0.38rem", letterSpacing: "0.12em",
                      cursor: "pointer", borderRadius: 4,
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                    }}
                  >
                    {i < 2 ? `BOOK TEAM OF ${i === 0 ? "3" : "5"}` : "BOOK TEAM OF 3"}
                  </button>
                </div>
              </div>
            ))}
          </div>
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
          {[
            "Red shirt — solid, nothing on it",
            "Black slacks",
            "Your own towel",
            "No devices during sessions.",
            "Pack light. That's it.",
          ].map((item, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <span style={{ color: GOLD_DIM, fontSize: "0.5rem", flexShrink: 0 }}>·</span>
              <p style={{
                color: i >= arr.length - 2 ? GOLD_DIM : "rgba(232,224,208,0.6)",
                fontSize: "0.5rem",
                fontStyle: i >= arr.length - 2 ? "italic" : "normal",
                lineHeight: 1.5,
              }}>{item}</p>
            </div>
          ))}
        </div>

        {/* ── FOUNDING BROTHER STATUS ───────────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg, #0d0f14 0%, #080a0f 100%)",
          border: `1px solid ${GOLD_40}`,
          borderRadius: 12,
          padding: "28px 22px",
          marginBottom: 28,
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
            marginBottom: 16,
          }}>
            Every man at the fire becomes<br />a Founding Brother.
          </p>

          <div style={{ display: "grid", gap: 6, marginBottom: 20 }}>
            {[
              "Permanent.",
              "Stone engraved.",
              "This happens once.",
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
            This is what happens when men stop performing strength<br />
            and start building it together.<br /><br />
            4am ice bath. Brotherhood. The oath.<br /><br />
            Healing is not soft —<br />
            it is the hardest thing a man can do.
          </p>
        </div>

        {/* ── FOUNDING AMBASSADOR ───────────────────────────────────────────── */}
        <div style={{
          background: "#080b10",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 10,
          padding: "24px 20px",
          marginBottom: 28,
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 16 }}>FOUNDING AMBASSADOR</p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.7)",
            fontSize: "1.0rem",
            lineHeight: 2.0,
          }}>
            You leave MAYDAY as a founding ambassador.<br /><br />
            Go home. Open a Makoa house in your city.<br />
            Lead the first 4am. Build the order where you are.<br /><br />
            The founding 24 become the first house leaders on earth.
          </p>
        </div>

        {/* ── BOTTOM DUAL COUNTDOWN + CTA ───────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <CountdownBlock target={MAY_1} label="FOUNDING FIRE IN" color={GOLD} />
        </div>

        {isEarlyBird && (
          <div style={{
            background: "rgba(248,81,73,0.06)",
            border: "1px solid rgba(248,81,73,0.2)",
            borderRadius: 8,
            padding: "14px 16px",
            marginBottom: 24,
          }}>
            <CountdownBlock target={EARLY_BIRD_CUTOFF} label="⚡ EARLY BIRD CLOSES IN" color={RED} />
          </div>
        )}

        <button
          onClick={() => handleClaim("warvan")}
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
          44 seats total · once they're gone, this moment is gone
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
