"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SocialFooter from "@/components/SocialFooter";
import { TIMELINE } from "@/lib/timeline";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const FLAME = "#ff4e1f";
const BG = "#04060a";

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return mounted ? time : null;
}

function MakoaCrest({ size = 88 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/makoa_eclipse_crest.png"
      alt="Mākoa Order Crest"
      width={size}
      height={size}
      style={{ borderRadius: "50%", display: "block" }}
    />
  );
}

const SCHEDULE = [
  { time: "FRI  12pm",   event: "HNL pickup · VIP War Van → Kapolei" },
  { time: "FRI  5–7pm",  event: "Founder fire + pūpū · gear trade circle" },
  { time: "FRI  10pm",   event: "Lights out" },
  { time: "SAT  3:33am", event: "Wake call" },
  { time: "SAT  4–5am",  event: "Ice bath · elite rest training" },
  { time: "SAT  9–2pm",  event: "Warroom + Warchest · B2B mastermind" },
  { time: "SAT  5–7pm",  event: "Founder dinner" },
  { time: "SAT  10pm",   event: "Lights out" },
  { time: "SUN  3:33am", event: "Wake call" },
  { time: "SUN  4–5am",  event: "Ice bath (full-moon bookends only)" },
  { time: "SUN  9am",    event: "Sealing · beach luau" },
  { time: "SUN  12pm",   event: "Departure" },
];

const WEEKENDS = [
  { moon: "🌕", dates: "MAY 1–3",    label: "FLOWER MOON · Opening · 5 teams",  bookend: true },
  { moon: "◦",  dates: "MAY 8–10",   label: "Weekend 2 · 5 teams",              bookend: false },
  { moon: "◦",  dates: "MAY 15–17",  label: "Weekend 3 · 5 teams",              bookend: false },
  { moon: "🌕", dates: "MAY 29–31",  label: "BLUE MOON · Sealing · 5 teams",   bookend: true },
];

const SEAT_INCLUDES = [
  "The full 48-hour founding weekend",
  "VIP War Van · HNL pickup + weekend transport",
  "Warroom + Warchest B2B mastermind sessions",
  "All shared meals: Fri pūpū · Sat dinner · Sun beach luau",
  "Ice bath + elite rest training",
  "1% equity in Mākoa Trade Co.",
  "Charter rights to open your territory's chapter",
  "Share of the Mayday 48 Aliʻi pool — forever",
  "Your name on the Palapala · permanent",
];

const TRADE_SPLIT = [
  { pct: "80%", label: "TERRITORY", desc: "Stays in your chapter · labor, goods, services" },
  { pct: "10%", label: "THE ORDER", desc: "Mākoa treasury · infrastructure · 7G Net" },
  { pct: "10%", label: "MAYDAY 48 POOL", desc: "Split among the 20 founding Aliʻi · forever" },
];

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [tapFlash, setTapFlash] = useState(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gateTime = useCountdown(TIMELINE.GATE_OPENS);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  function handleCrestTap() {
    const next = tapCount + 1;
    setTapCount(next);
    setTapFlash(true);
    setTimeout(() => setTapFlash(false), 120);
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (next >= 5) { setTapCount(0); router.push("/steward"); return; }
    tapTimer.current = setTimeout(() => setTapCount(0), 2000);
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", overflowX: "hidden" }}>
      <style>{`
        @keyframes crestFadeIn { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:scale(1); } }
        @keyframes breatheGlow { 0%,100% { box-shadow:0 0 0 0 rgba(176,142,80,0); } 50% { box-shadow:0 0 48px 14px rgba(176,142,80,0.14); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:1; transform:scale(1.5); } }
        @keyframes goldGlow { 0%,100% { box-shadow:0 0 16px rgba(176,142,80,0.15); } 50% { box-shadow:0 0 48px rgba(176,142,80,0.45); } }
        @keyframes breathe { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        .cta-primary { transition: transform 0.15s, box-shadow 0.15s; }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(176,142,80,0.35); }
        .cta-primary:active { transform: translateY(0); }
        .cta-secondary { transition: border-color 0.2s, background 0.2s; }
        .cta-secondary:hover { border-color: rgba(176,142,80,0.7) !important; background: rgba(176,142,80,0.07) !important; }
        .nav-link:hover { color: rgba(176,142,80,0.75) !important; }
      `}</style>

      {/* ── ANNOUNCEMENT BANNER ──────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: FLAME,
        padding: "10px 16px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        opacity: ready ? 1 : 0,
        transition: "opacity 0.5s ease 0.3s",
      }}>
        <p style={{ color: "#fff", fontSize: "12px", letterSpacing: "0.12em", fontWeight: 700, textAlign: "center", lineHeight: 1.4 }}>
          THE PALAPALA DROPPED APR 21 ·{" "}
          <a href="/palapala" style={{ color: "#fff", textDecoration: "underline" }}>READ THE MANIFEST</a>
          {" "}· 🌕 GATE OPENS MAY 1 FULL MOON
        </p>
      </div>

      {/* ── URGENCY BAR ──────────────────────────────────────────────────────── */}
      {gateTime && (
        <div style={{
          position: "fixed", top: 38, left: 0, right: 0, zIndex: 99,
          background: "rgba(4,6,10,0.96)",
          borderBottom: "1px solid rgba(255,78,31,0.25)",
          padding: "9px 16px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          opacity: ready ? 1 : 0,
          transition: "opacity 0.5s ease 0.6s",
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: FLAME, animation: "pulse 1.4s ease-in-out infinite", flexShrink: 0 }} />
          <p style={{ color: FLAME, fontSize: "13px", letterSpacing: "0.1em", fontWeight: 600 }}>
            🌕 GATE OPENS · FRI MAY 1 · 9AM HST · FULL MOON — {gateTime.days}D {gateTime.hours}H {gateTime.minutes}M {gateTime.seconds}S
          </p>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: gateTime ? "120px 24px 100px" : "80px 24px 100px",
        position: "relative",
        background: "radial-gradient(ellipse at 50% 25%, rgba(176,142,80,0.07) 0%, transparent 60%)",
      }}>

        {/* Crest */}
        <div
          style={{ marginBottom: 24, animation: "crestFadeIn 1.6s cubic-bezier(0.16,1,0.3,1) forwards", cursor: "pointer", userSelect: "none" }}
          onClick={handleCrestTap}
        >
          <div style={{ borderRadius: "50%", animation: "breatheGlow 4s ease-in-out 1.8s infinite", opacity: tapFlash ? 0.6 : 1, transition: "opacity 0.1s" }}>
            <MakoaCrest size={88} />
          </div>
          {tapCount > 0 && tapCount < 5 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 8 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: i <= tapCount ? GOLD : "rgba(176,142,80,0.15)", transition: "background 0.15s" }} />
              ))}
            </div>
          )}
        </div>

        {/* Hero copy */}
        <div style={{
          textAlign: "center", maxWidth: 480,
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
        }}>
          {/* Eyebrow */}
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px", letterSpacing: "0.28em",
            color: GOLD, margin: "0 0 16px",
            opacity: ready ? 1 : 0, transition: "opacity 0.7s ease 0.15s",
          }}>
            ◈ FOUNDING MONTH · MAY 2026
          </p>

          {/* H1 */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(3rem, 12vw, 4.2rem)",
            color: "#e8e0d0",
            margin: "0 0 12px",
            lineHeight: 1,
            letterSpacing: "0.04em",
            opacity: ready ? 1 : 0,
            transition: "opacity 0.7s ease 0.2s",
          }}>MAYDAY 48</p>

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 4vw, 1.35rem)",
            color: GOLD,
            margin: "0 0 12px",
            lineHeight: 1.5,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.7s ease 0.3s",
          }}>
            The Workcation That Builds a Brotherhood
          </p>

          {/* Meta */}
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px", letterSpacing: "0.22em",
            color: "rgba(232,224,208,0.35)",
            margin: "0 0 40px",
            opacity: ready ? 1 : 0,
            transition: "opacity 0.7s ease 0.35s",
          }}>
            WEST OʻAHU · 4 WEEKENDS · 2 FULL MOONS
          </p>

          {/* Primary CTA */}
          <div style={{ opacity: ready ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}>
            <a
              href="/gate"
              className="cta-primary"
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: GOLD,
                borderRadius: 10,
                padding: "18px 22px",
                textDecoration: "none",
                marginBottom: 10,
                animation: ready ? "goldGlow 4s ease-in-out 1.5s infinite" : "none",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <p style={{ color: "#000", fontSize: "15px", letterSpacing: "0.18em", fontWeight: 700, marginBottom: 3 }}>ENTER THE GATE →</p>
                <p style={{ color: "rgba(0,0,0,0.5)", fontSize: "13px", lineHeight: 1.4 }}>Aliʻi Founder Seat · $4,997 · 20 seats total</p>
              </div>
              <span style={{ color: "#000", fontSize: "1.3rem", flexShrink: 0, marginLeft: 12 }}>◈</span>
            </a>
          </div>
        </div>

        {/* Bottom nav */}
        <div style={{
          position: "absolute", bottom: 24, left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: ready ? 1 : 0, transition: "opacity 0.7s ease 1.1s",
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "center", padding: "0 16px" }}>
            {[
              { href: "/palapala", label: "PALAPALA" },
              { href: "/founding48", label: "MAYDAY" },
              { href: "/trade", label: "TRADE CO." },
              { href: "/sponsor", label: "SPONSOR" },
              { href: "/portal", label: "PORTAL" },
            ].map((link, i, arr) => (
              <span key={link.href} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <a href={link.href} className="nav-link" style={{ color: link.href === "/palapala" ? "rgba(255,78,31,0.5)" : "rgba(176,142,80,0.28)", fontSize: "11px", letterSpacing: "0.15em", textDecoration: "none", transition: "color 0.2s" }}>
                  {link.label}
                </a>
                {i < arr.length - 1 && <span style={{ color: "rgba(176,142,80,0.1)", fontSize: "11px" }}>·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATEMENT ────────────────────────────────────────────────────────── */}
      <div style={{ background: "#04060a", borderTop: `1px solid ${GOLD_20}`, padding: "64px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "clamp(1.2rem, 3.5vw, 1.5rem)",
            lineHeight: 1.85,
            marginBottom: 16,
          }}>
            Mākoa is a brotherhood of men who build real things together.
          </p>
          <p style={{
            color: "rgba(232,224,208,0.45)",
            fontSize: "15px",
            lineHeight: 1.85,
          }}>
            Not a gym. Not a podcast. Not a men's group that talks about doing things.
          </p>
        </div>
      </div>

      {/* ── PITCH ────────────────────────────────────────────────────────────── */}
      <div style={{
        borderTop: `1px solid ${GOLD_20}`,
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "56px 24px",
        background: "linear-gradient(180deg, #04060a 0%, #060810 100%)",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD,
            fontSize: "clamp(1.15rem, 3vw, 1.4rem)",
            lineHeight: 2.0,
          }}>
            Mayday 48 is a once-ever founding event.<br />
            20 Aliʻi team leaders across the month.<br />
            48 brothers take the oath. Then the gate closes forever.
          </p>
        </div>
      </div>

      {/* ── 48-HOUR WEEKEND RHYTHM ───────────────────────────────────────────── */}
      <div style={{ background: "#04060a", borderTop: `1px solid ${GOLD_20}`, padding: "56px 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
            <p style={{ color: GOLD_DIM, fontSize: "11px", letterSpacing: "0.28em", whiteSpace: "nowrap" }}>THE 48-HOUR WEEKEND RHYTHM</p>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          </div>

          <div style={{
            background: "rgba(176,142,80,0.03)",
            border: `1px solid ${GOLD_20}`,
            borderRadius: 10,
            overflow: "hidden",
          }}>
            {SCHEDULE.map((row, i) => (
              <div key={i} style={{
                display: "flex", gap: 0,
                borderBottom: i < SCHEDULE.length - 1 ? "1px solid rgba(176,142,80,0.06)" : "none",
              }}>
                <div style={{
                  width: 110, flexShrink: 0,
                  padding: "11px 16px",
                  background: "rgba(0,0,0,0.25)",
                  borderRight: "1px solid rgba(176,142,80,0.08)",
                }}>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: GOLD_DIM,
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                  }}>{row.time}</p>
                </div>
                <div style={{ padding: "11px 16px", flex: 1 }}>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    color: "rgba(232,224,208,0.65)",
                    lineHeight: 1.5,
                  }}>{row.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── THE FOUR WEEKENDS ────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(180deg, #04060a 0%, #060810 100%)", borderTop: `1px solid ${GOLD_20}`, padding: "56px 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
            <p style={{ color: GOLD_DIM, fontSize: "11px", letterSpacing: "0.28em", whiteSpace: "nowrap" }}>THE FOUR WEEKENDS</p>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            {WEEKENDS.map((w, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 20px",
                background: w.bookend ? "rgba(176,142,80,0.06)" : "rgba(0,0,0,0.2)",
                border: `1px solid ${w.bookend ? GOLD_40 : "rgba(176,142,80,0.08)"}`,
                borderRadius: 8,
              }}>
                <span style={{ fontSize: "1.1rem", flexShrink: 0, width: 24, textAlign: "center" }}>{w.moon}</span>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  color: GOLD,
                  letterSpacing: "0.1em",
                  minWidth: 90,
                  flexShrink: 0,
                }}>{w.dates}</div>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  color: w.bookend ? "rgba(232,224,208,0.75)" : "rgba(232,224,208,0.4)",
                  letterSpacing: "0.06em",
                }}>{w.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ALIʻI FOUNDER SEAT ───────────────────────────────────────────────── */}
      <div style={{ background: "#04060a", borderTop: `1px solid ${GOLD_20}`, padding: "56px 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
            <p style={{ color: GOLD_DIM, fontSize: "11px", letterSpacing: "0.28em", whiteSpace: "nowrap" }}>THE OFFER</p>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          </div>

          <div style={{
            border: `1px solid ${GOLD_40}`,
            borderRadius: 12,
            background: "linear-gradient(135deg, #0d0f14 0%, #080a0f 100%)",
            padding: "28px 24px",
            position: "relative",
            overflow: "hidden",
            animation: "goldGlow 5s ease-in-out infinite",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* Title + price */}
            <p style={{ color: GOLD_DIM, fontSize: "11px", letterSpacing: "0.28em", marginBottom: 8 }}>ALIʻI · FOUNDER SEAT</p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: GOLD,
              fontSize: "clamp(2rem, 8vw, 2.8rem)",
              lineHeight: 1,
              margin: "0 0 6px",
            }}>$4,997</p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "rgba(232,224,208,0.5)",
              fontSize: "1rem",
              marginBottom: 24,
            }}>Bring your team of 3–5 brothers</p>

            {/* Includes */}
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "10px", letterSpacing: "0.2em", marginBottom: 12 }}>YOUR SEAT INCLUDES</p>
            <div style={{ display: "grid", gap: 7, marginBottom: 24 }}>
              {SEAT_INCLUDES.map(item => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ color: GOLD, fontSize: "0.5rem", flexShrink: 0, marginTop: 3 }}>—</span>
                  <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "13px", lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>

            {/* What you bring */}
            <div style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(176,142,80,0.08)",
              borderRadius: 8,
              padding: "16px 18px",
              marginBottom: 24,
            }}>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "10px", letterSpacing: "0.2em", marginBottom: 10 }}>WHAT YOU BRING</p>
              {[
                "Your team · 3–5 brothers you vouch for",
                "Your own Kapolei lodging (~$200–300/night)",
                "Your gear for the trade circle",
              ].map(item => (
                <p key={item} style={{ color: "rgba(232,224,208,0.5)", fontSize: "13px", lineHeight: 1.7 }}>· {item}</p>
              ))}
            </div>

            {/* Urgency */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              marginBottom: 20,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: FLAME, animation: "pulse 1.4s ease-in-out infinite", flexShrink: 0 }} />
              <p style={{ color: FLAME, fontSize: "12px", letterSpacing: "0.12em" }}>
                ◈ 5 seats open · May 1–3 Flower Moon opening weekend
              </p>
            </div>

            {/* CTA */}
            <a
              href="/gate"
              className="cta-primary"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                background: GOLD, color: "#000",
                borderRadius: 10, padding: "17px",
                fontSize: "15px", letterSpacing: "0.22em",
                textDecoration: "none", fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700, textAlign: "center",
              }}
            >
              ENTER THE GATE →
            </a>
          </div>
        </div>
      </div>

      {/* ── MĀKOA TRADE CO. · INTERNATIONAL ─────────────────────────────────── */}
      <div style={{ background: "linear-gradient(180deg, #04060a 0%, #060810 100%)", borderTop: `1px solid ${GOLD_20}`, padding: "64px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
            <p style={{ color: GOLD_DIM, fontSize: "11px", letterSpacing: "0.28em", whiteSpace: "nowrap" }}>MĀKOA TRADE CO. · INTERNATIONAL</p>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          </div>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "clamp(1.15rem, 3vw, 1.4rem)",
            lineHeight: 1.85,
            textAlign: "center",
            marginBottom: 8,
          }}>
            Mayday 48 opens the first chapters.
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.5)",
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            lineHeight: 1.85,
            textAlign: "center",
            marginBottom: 40,
          }}>
            Aliʻi return home to found their territory.
          </p>

          {/* 3-column split */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 40 }}>
            {TRADE_SPLIT.map(col => (
              <div key={col.label} style={{
                padding: "20px 14px",
                background: "rgba(176,142,80,0.04)",
                border: `1px solid ${GOLD_20}`,
                borderRadius: 10,
                textAlign: "center",
              }}>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "clamp(1.4rem, 5vw, 2rem)",
                  fontWeight: 700,
                  color: GOLD,
                  lineHeight: 1,
                  marginBottom: 8,
                }}>{col.pct}</p>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  color: GOLD_DIM,
                  marginBottom: 8,
                }}>{col.label}</p>
                <p style={{
                  color: "rgba(232,224,208,0.4)",
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}>{col.desc}</p>
              </div>
            ))}
          </div>

          {/* Cities */}
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.18em",
            color: "rgba(232,224,208,0.25)",
            textAlign: "center",
            marginBottom: 32,
          }}>
            Tokyo · Berlin · Vancouver · Lagos · São Paulo · YOUR CITY
          </p>

          {/* Closer */}
          <div style={{
            borderTop: `1px solid ${GOLD_20}`,
            paddingTop: 32,
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "rgba(232,224,208,0.6)",
              fontSize: "1.05rem",
              lineHeight: 2.0,
              marginBottom: 8,
            }}>
              Each Mayday 48 Aliʻi earns 0.5% of global Trade Co. revenue · perpetual · inheritable.
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "rgba(232,224,208,0.35)",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              marginBottom: 20,
            }}>
              100-year mission. Measured in 2126.
            </p>
            <a href="/palapala" style={{
              color: GOLD_DIM,
              fontSize: "13px",
              letterSpacing: "0.12em",
              textDecoration: "none",
              fontFamily: "'JetBrains Mono', monospace",
              borderBottom: `1px solid ${GOLD_20}`,
              paddingBottom: 2,
            }}>
              Read the full Palapala →
            </a>
          </div>
        </div>
      </div>

      {/* ── FOOTER CTAs ──────────────────────────────────────────────────────── */}
      <div style={{ background: "#04060a", borderTop: `1px solid ${GOLD_20}`, padding: "40px 24px" }}>
        <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          <a href="/sponsor" style={{
            color: GOLD_DIM,
            fontSize: "13px",
            letterSpacing: "0.14em",
            textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace",
            transition: "color 0.2s",
          }}>
            Sponsor a brother →
          </a>
          <a href="/waitlist" style={{
            color: "rgba(232,224,208,0.3)",
            fontSize: "13px",
            letterSpacing: "0.12em",
            textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace",
            transition: "color 0.2s",
          }}>
            Not ready? Waitlist →
          </a>
          <p style={{
            color: "rgba(232,224,208,0.2)",
            fontSize: "12px",
            letterSpacing: "0.1em",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            Overseas team? Ask about War Party Concierge
          </p>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${GOLD_20}` }}>
        <SocialFooter />
      </div>
    </div>
  );
}
