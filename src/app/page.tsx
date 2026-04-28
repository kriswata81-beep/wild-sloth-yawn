"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SocialFooter from "@/components/SocialFooter";
import { TIMELINE } from "@/lib/timeline";
import { usePageTracker } from "@/hooks/use-page-tracker";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#D4A668";
const GOLD_40 = "rgba(212,166,104,0.4)";
const GOLD_20 = "rgba(212,166,104,0.2)";
const GOLD_10 = "rgba(212,166,104,0.1)";
const GOLD_DIM = "rgba(212,166,104,0.6)";
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
  { moon: "🌕", dates: "MAY 1–3",   label: "FLOWER MOON · Opening · 3 teams",  bookend: true },
  { moon: "◦",  dates: "MAY 8–10",  label: "Weekend 2 · 3 teams",              bookend: false },
  { moon: "◦",  dates: "MAY 15–17", label: "Weekend 3 · 3 teams",              bookend: false },
  { moon: "🌕", dates: "MAY 29–31", label: "BLUE MOON · Sealing · 3 teams",   bookend: true },
];

const SEAT_INCLUDES = [
  "Fri–Sun · Kapolei · 808-757-6985",
  "VIP War Van · HNL pickup + weekend transport",
  "Warroom + Warchest · B2B mastermind sessions",
  "All shared meals · Fri pūpū · Sat dinner · Sun beach luau",
  "4am ice bath under the full moon · elite rest training",
  "Your name on the Palapala · permanent · inheritable",
  "1% equity in Mākoa Trade Co.",
  "Charter rights to open your territory's chapter",
  "Your share of the Mayday 48 Aliʻi pool · forever",
];

const TRADE_SPLIT = [
  { pct: "80%", label: "TERRITORY", desc: "Stays in your chapter · labor, goods, services" },
  { pct: "10%", label: "THE ORDER", desc: "Mākoa treasury · infrastructure · 7G Net" },
  { pct: "10%", label: "MAYDAY 48 POOL", desc: "Split among the 12 founding Aliʻi · forever" },
];

const XI_LINES = [
  {
    icon: "🔥",
    name: "XI.FIRE",
    role: "Aliʻi Command Line",
    desc: "Council · territory registry · founding scroll · cross-chapter messaging · treasury rollups · 80/10/10 live visualization",
  },
  {
    icon: "💧",
    name: "XI.WATER",
    role: "Mana Operations Line",
    desc: "Smart contracts · ZIP zone intel · SaaS bundle templates · labor route builder · revenue tracking",
  },
  {
    icon: "🌬",
    name: "XI.WIND",
    role: "Nakoa Field Line",
    desc: "411 intel requests · 911 urgent dispatch · peer-to-peer cohort formation · fastest movement between chapters",
  },
];

const divider = (label: string) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
    <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
    <p style={{ color: GOLD_DIM, fontSize: "15px", letterSpacing: "0.2em", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace" }}>{label}</p>
    <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
  </div>
);

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [tapFlash, setTapFlash] = useState(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gateTime = useCountdown(TIMELINE.GATE_OPENS);
  const [seatsClaimed, setSeatsClaimed] = useState(1);

  usePageTracker("home");

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    supabase.from("seats_counter").select("seats_claimed").eq("id", 1).single()
      .then(({ data }) => { if (data) setSeatsClaimed(data.seats_claimed); });
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
        @keyframes breatheGlow { 0%,100% { box-shadow:0 0 0 0 rgba(212,166,104,0); } 50% { box-shadow:0 0 56px 16px rgba(212,166,104,0.16); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:1; transform:scale(1.5); } }
        @keyframes goldGlow { 0%,100% { box-shadow:0 0 16px rgba(212,166,104,0.15); } 50% { box-shadow:0 0 56px rgba(212,166,104,0.5); } }
        @keyframes breathe { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        .cta-primary { transition: transform 0.15s, box-shadow 0.15s; }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(212,166,104,0.4); }
        .cta-primary:active { transform: translateY(0); }
        .cta-secondary { transition: border-color 0.2s, background 0.2s; }
        .cta-secondary:hover { border-color: rgba(212,166,104,0.7) !important; background: rgba(212,166,104,0.07) !important; }
        .nav-link:hover { color: rgba(212,166,104,0.8) !important; }
        .split-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .xi-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        @media (max-width: 600px) {
          .split-grid { grid-template-columns: 1fr !important; }
          .xi-grid { grid-template-columns: 1fr !important; }
          .schedule-time { width: 90px !important; }
        }
      `}</style>

      {/* ── ANNOUNCEMENT BANNER ──────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 52, left: 0, right: 0, zIndex: 100,
        background: FLAME,
        padding: "10px 16px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        opacity: ready ? 1 : 0,
        transition: "opacity 0.5s ease 0.3s",
      }}>
        <p style={{ color: "#fff", fontSize: "13px", letterSpacing: "0.12em", fontWeight: 700, textAlign: "center", lineHeight: 1.4 }}>
          🌕 GATE OPENS MAY 1 · 9AM HST (FULL MOON) · FOUNDING WINDOW CLOSES MAY 31 · 11:11 PM HST (BLUE MOON SEALING) ·{" "}
          <a href="/palapala" style={{ color: "#fff", textDecoration: "underline" }}>READ THE PALAPALA™</a>
        </p>
      </div>

      {/* ── URGENCY BAR ──────────────────────────────────────────────────────── */}
      {gateTime && (
        <div style={{
          position: "fixed", top: 90, left: 0, right: 0, zIndex: 99,
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
        padding: gateTime ? "180px 24px 100px" : "130px 24px 100px",
        position: "relative",
        background: "radial-gradient(ellipse at 50% 25%, rgba(212,166,104,0.08) 0%, transparent 60%)",
      }}>

        {/* Crest */}
        <div
          style={{ marginBottom: 28, animation: "crestFadeIn 1.6s cubic-bezier(0.16,1,0.3,1) forwards", cursor: "pointer", userSelect: "none" }}
          onClick={handleCrestTap}
        >
          <div style={{ borderRadius: "50%", animation: "breatheGlow 4s ease-in-out 1.8s infinite", opacity: tapFlash ? 0.6 : 1, transition: "opacity 0.1s" }}>
            <MakoaCrest size={96} />
          </div>
          {tapCount > 0 && tapCount < 5 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 8 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: i <= tapCount ? GOLD : "rgba(212,166,104,0.15)", transition: "background 0.15s" }} />
              ))}
            </div>
          )}
        </div>

        {/* Hero copy */}
        <div style={{
          textAlign: "center", maxWidth: 560,
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
        }}>
          {/* Eyebrow */}
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "14px", letterSpacing: "0.28em",
            color: GOLD, margin: "0 0 20px",
          }}>
            ◈ FOUNDING MONTH · MAY 2026 · WEST OʻAHU
          </p>

          {/* H1 */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(4rem, 14vw, 6rem)",
            color: "#e8e0d0",
            margin: "0 0 16px",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            fontWeight: 400,
          }}>MAYDAY 48™</h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(1.3rem, 4vw, 1.75rem)",
            color: GOLD,
            margin: "0 0 16px",
            lineHeight: 1.5,
          }}>
            A Men&apos;s Crowdfunding for a 100-Year Brotherhood
          </p>

          {/* Meta */}
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "14px", letterSpacing: "0.18em",
            color: "rgba(232,224,208,0.4)",
            margin: "0 0 20px",
          }}>
            4 weekends · 2 full moons · 12 Aliʻi seats · one oath
          </p>

          {/* Seats counter */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(212,166,104,0.06)",
            border: `1px solid ${GOLD_40}`,
            borderRadius: 8,
            padding: "10px 20px",
            marginBottom: 36,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD, animation: "pulse 2s ease-in-out infinite" }} />
            <p style={{ color: GOLD, fontSize: "14px", letterSpacing: "0.18em", fontWeight: 700 }}>
              SEATS CLAIMED: {seatsClaimed} OF 12
            </p>
            <p style={{ color: "rgba(212,166,104,0.4)", fontSize: "13px", letterSpacing: "0.1em" }}>
              · {12 - seatsClaimed} REMAINING
            </p>
          </div>

          {/* Primary CTA */}
          <div style={{ opacity: ready ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}>
            <a
              href="/mayday48/gate"
              className="cta-primary"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                background: GOLD,
                borderRadius: 10,
                padding: "20px 28px",
                textDecoration: "none",
                marginBottom: 12,
                animation: ready ? "goldGlow 4s ease-in-out 1.5s infinite" : "none",
                gap: 10,
              }}
            >
              <p style={{ color: "#000", fontSize: "17px", letterSpacing: "0.18em", fontWeight: 700 }}>ENTER THE GATE →</p>
            </a>
            <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "14px", letterSpacing: "0.1em" }}>
              see what it costs inside · after you&apos;ve read the Palapala™
            </p>
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
              { href: "/palapala", label: "PALAPALA™" },
              { href: "/founding48", label: "MAYDAY 48™" },
              { href: "/trust", label: "WHAT WE ARE" },
              { href: "/trade", label: "TRADE CO." },
              { href: "/sponsor", label: "SPONSOR" },
            ].map((link, i, arr) => (
              <span key={link.href} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <a href={link.href} className="nav-link" style={{ color: link.href === "/palapala" ? "rgba(255,78,31,0.7)" : "rgba(212,166,104,0.5)", fontSize: "15px", letterSpacing: "0.15em", textDecoration: "none", transition: "color 0.2s" }}>
                  {link.label}
                </a>
                {i < arr.length - 1 && <span style={{ color: "rgba(212,166,104,0.15)", fontSize: "15px" }}>·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── PERMANENT CLOSING STATEMENT ─────────────────────────────────────── */}
      <div style={{
        background: "rgba(255,78,31,0.04)",
        borderTop: `1px solid rgba(255,78,31,0.15)`,
        borderBottom: `1px solid rgba(255,78,31,0.15)`,
        padding: "22px 24px",
        textAlign: "center",
      }}>
        <p style={{
          color: "rgba(255,78,31,0.85)",
          fontSize: "clamp(13px, 2vw, 15px)",
          letterSpacing: "0.16em",
          lineHeight: 1.8,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 600,
        }}>
          The Founding 48 closes permanently at the Blue Moon on May 31, 2026 at 11:11 PM HST.
        </p>
        <p style={{
          color: "rgba(232,224,208,0.3)",
          fontSize: "13px",
          letterSpacing: "0.12em",
          marginTop: 6,
        }}>
          After this date, the 12 Aliʻi founding seats will never open again. Next cohort (Ka Lani 48) begins June 1.
        </p>
      </div>

      {/* ── LOYALTY LINE ─────────────────────────────────────────────────────── */}
      <div style={{ background: "#04060a", borderTop: `1px solid ${GOLD_20}`, padding: "72px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            lineHeight: 1.6,
            marginBottom: 16,
          }}>
            Loyalty to men. For one hundred years.
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            lineHeight: 1.7,
          }}>
            Under the Malu Trust™. Sealed on the Palapala™.
          </p>
        </div>
      </div>

      {/* ── STATEMENT ────────────────────────────────────────────────────────── */}
      <div style={{ background: "#04060a", borderTop: `1px solid ${GOLD_20}`, padding: "64px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)",
            lineHeight: 1.85,
            marginBottom: 16,
          }}>
            Mākoa™ is a brotherhood of men who build real things together.
          </p>
          <p style={{
            color: "rgba(232,224,208,0.5)",
            fontSize: "18px",
            lineHeight: 1.85,
          }}>
            Not a retreat. Not a podcast. Not a men&apos;s group that talks about doing things.
          </p>
        </div>
      </div>

      {/* ── PITCH ────────────────────────────────────────────────────────────── */}
      <div style={{
        borderTop: `1px solid ${GOLD_20}`,
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "64px 24px",
        background: "linear-gradient(180deg, #04060a 0%, #060810 100%)",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD,
            fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
            lineHeight: 2.0,
          }}>
            Mayday 48™ is a once-ever founding event.<br />
            Twelve Aliʻi take the oath in May 2026 on West Oʻahu.<br />
            They become the founding chiefs of a 100-year trade brotherhood<br />
            that opens chapters in every city on earth.
          </p>
        </div>
      </div>

      {/* ── FOUNDING WINDOW BANNER ───────────────────────────────────────────── */}
      <div style={{
        background: "rgba(212,166,104,0.04)",
        borderTop: `1px solid ${GOLD_20}`,
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "28px 24px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: GOLD,
          fontSize: "clamp(13px, 2.5vw, 15px)",
          letterSpacing: "0.2em",
          lineHeight: 1.8,
          fontWeight: 700,
        }}>
          🌕 GATE OPENS MAY 1 · 9AM HST (FULL MOON)<br />
          FOUNDING WINDOW CLOSES MAY 31 · 11:11 PM HST (BLUE MOON SEALING)
        </p>
        <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "14px", letterSpacing: "0.12em", marginTop: 10 }}>
          Founding period runs the full month of May 2026 · After the Blue Moon, the Founding 48 closes permanently · Next cohort (Ka Lani 48) opens June 1
        </p>
      </div>

      {/* ── WAR PARTY TRAVEL PACKS ───────────────────────────────────────────── */}
      <div style={{ background: "#04060a", borderTop: `1px solid ${GOLD_20}`, padding: "64px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {divider("🌬 WAR PARTY TRAVEL PACKS")}

          <div style={{
            border: `2px solid ${GOLD_40}`,
            borderRadius: 14,
            background: "linear-gradient(135deg, #0f1018 0%, #080a0f 100%)",
            padding: "36px 28px",
            position: "relative",
            overflow: "hidden",
            animation: "goldGlow 5s ease-in-out infinite",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 0%, rgba(212,166,104,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "#e8e0d0",
              fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
              lineHeight: 1.7,
              marginBottom: 24,
            }}>
              For men coming from anywhere on earth.<br />
              One pickup. One van. One weekend. No logistics.
            </p>

            <div style={{ display: "grid", gap: 10, marginBottom: 28 }}>
              {[
                "HNL airport pickup · VIP war van",
                "2 nights lodging included in the Overseas Bundle",
                "Private founder dinner Friday night",
                "Concierge check-in · local guide on Oʻahu",
              ].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ color: GOLD, fontSize: "18px", flexShrink: 0, marginTop: 1 }}>—</span>
                  <p style={{ color: "rgba(232,224,208,0.75)", fontSize: "18px", lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>

            <p style={{
              color: "rgba(232,224,208,0.55)",
              fontSize: "18px",
              lineHeight: 1.8,
              marginBottom: 28,
            }}>
              Whether you&apos;re flying from Tokyo, Berlin, Lagos, or the Mainland — you land, and the brotherhood takes you from there. The weekend starts at HNL gate. It ends at the Blue Moon.
            </p>

            <a
              href="/mayday48/gate"
              className="cta-primary"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                background: GOLD, color: "#000",
                borderRadius: 10, padding: "18px",
                fontSize: "17px", letterSpacing: "0.18em",
                textDecoration: "none", fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700, textAlign: "center",
              }}
            >
              APPLY TO FLY IN →
            </a>
          </div>
        </div>
      </div>

      {/* ── 48-HOUR WEEKEND RHYTHM ───────────────────────────────────────────── */}
      <div style={{ background: "#04060a", borderTop: `1px solid ${GOLD_20}`, padding: "64px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {divider("THE 48-HOUR WEEKEND RHYTHM")}

          <div style={{
            background: "rgba(212,166,104,0.03)",
            border: `1px solid ${GOLD_20}`,
            borderRadius: 10,
            overflow: "hidden",
          }}>
            {SCHEDULE.map((row, i) => (
              <div key={i} style={{
                display: "flex", gap: 0,
                borderBottom: i < SCHEDULE.length - 1 ? "1px solid rgba(212,166,104,0.06)" : "none",
              }}>
                <div className="schedule-time" style={{
                  width: 110, flexShrink: 0,
                  padding: "14px 14px",
                  background: "rgba(0,0,0,0.25)",
                  borderRight: "1px solid rgba(212,166,104,0.08)",
                }}>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "14px",
                    color: GOLD_DIM,
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                  }}>{row.time}</p>
                </div>
                <div style={{ padding: "14px 16px", flex: 1 }}>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "16px",
                    color: "rgba(232,224,208,0.8)",
                    lineHeight: 1.6,
                  }}>{row.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── THE FOUR WEEKENDS ────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(180deg, #04060a 0%, #060810 100%)", borderTop: `1px solid ${GOLD_20}`, padding: "64px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {divider("THE FOUR WEEKENDS")}

          <div style={{ display: "grid", gap: 10 }}>
            {WEEKENDS.map((w, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 18,
                padding: "20px 24px",
                background: w.bookend ? "rgba(212,166,104,0.06)" : "rgba(0,0,0,0.2)",
                border: `1px solid ${w.bookend ? GOLD_40 : "rgba(212,166,104,0.08)"}`,
                borderRadius: 8,
              }}>
                <span style={{ fontSize: "1.3rem", flexShrink: 0, width: 28, textAlign: "center" }}>{w.moon}</span>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "15px",
                  color: GOLD,
                  letterSpacing: "0.1em",
                  minWidth: 100,
                  flexShrink: 0,
                }}>{w.dates}</div>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "15px",
                  color: w.bookend ? "rgba(232,224,208,0.8)" : "rgba(232,224,208,0.45)",
                  letterSpacing: "0.06em",
                  lineHeight: 1.6,
                }}>{w.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── THE FOUNDER SEAT ─────────────────────────────────────────────────── */}
      <div style={{ background: "#04060a", borderTop: `1px solid ${GOLD_20}`, padding: "64px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {divider("🔥 THE FOUNDER SEAT")}

          <div style={{
            border: `1px solid ${GOLD_40}`,
            borderRadius: 12,
            background: "linear-gradient(135deg, #0d0f14 0%, #080a0f 100%)",
            padding: "32px 28px",
            position: "relative",
            overflow: "hidden",
            animation: "goldGlow 5s ease-in-out infinite",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 0%, rgba(212,166,104,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: GOLD,
              fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
              lineHeight: 1.4,
              marginBottom: 16,
            }}>
              12 Aliʻi. One oath. Forever.
            </p>

            {/* Equity tease — prominent */}
            <div style={{
              background: "rgba(212,166,104,0.08)",
              border: `1px solid ${GOLD_40}`,
              borderRadius: 8,
              padding: "16px 20px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}>
              <span style={{ color: GOLD, fontSize: "1.5rem", flexShrink: 0 }}>◈</span>
              <div>
                <p style={{ color: GOLD, fontSize: "17px", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>
                  1% EQUITY IN MĀKOA TRADE CO.
                </p>
                <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "15px", lineHeight: 1.5 }}>
                  0.5% of global revenue · perpetual · inheritable · passes to your family
                </p>
              </div>
            </div>

            {/* Includes */}
            <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "13px", letterSpacing: "0.22em", marginBottom: 16 }}>YOUR SEAT INCLUDES</p>
            <div style={{ display: "grid", gap: 10, marginBottom: 28 }}>
              {SEAT_INCLUDES.map(item => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ color: GOLD, fontSize: "18px", flexShrink: 0, marginTop: 1 }}>◈</span>
                  <p style={{ color: "rgba(232,224,208,0.75)", fontSize: "18px", lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>

            {/* What you bring */}
            <div style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(212,166,104,0.08)",
              borderRadius: 8,
              padding: "20px 22px",
              marginBottom: 28,
            }}>
              <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "13px", letterSpacing: "0.22em", marginBottom: 14 }}>YOU BRING</p>
              {[
                "Your team of 3–5 brothers you vouch for",
                "Your own lodging in Kapolei (or use an Overseas Bundle)",
                "Your gear for the trade circle",
              ].map(item => (
                <p key={item} style={{ color: "rgba(232,224,208,0.55)", fontSize: "18px", lineHeight: 1.8 }}>· {item}</p>
              ))}
            </div>

            {/* CTA */}
            <a
              href="/mayday48/gate"
              className="cta-primary"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                background: GOLD, color: "#000",
                borderRadius: 10, padding: "20px",
                fontSize: "17px", letterSpacing: "0.22em",
                textDecoration: "none", fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700, textAlign: "center",
                marginBottom: 14,
              }}
            >
              ENTER THE GATE →
            </a>
            <p style={{ textAlign: "center", color: "rgba(232,224,208,0.25)", fontSize: "15px", lineHeight: 1.7 }}>
              see what it costs inside · after you&apos;ve<br />read the Palapala™ and chosen to step through
            </p>
          </div>
        </div>
      </div>

      {/* ── WHAT MĀKOA STANDS FOR ────────────────────────────────────────────── */}
      <div style={{
        borderTop: `1px solid ${GOLD_20}`,
        padding: "64px 24px",
        background: "linear-gradient(180deg, #04060a 0%, #060810 100%)",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {divider("WHAT MĀKOA™ STANDS FOR")}

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "clamp(1.15rem, 3vw, 1.4rem)",
            lineHeight: 2.0,
            marginBottom: 28,
            textAlign: "center",
          }}>
            Loyalty to men. Not to markets. Not to metrics. Not to media.
          </p>

          <p style={{
            color: "rgba(232,224,208,0.75)",
            fontSize: "18px",
            lineHeight: 1.9,
            marginBottom: 32,
          }}>
            We build what outlives us. We trade in our territory. We hold our brothers. We sign the Palapala™.
          </p>

          <p style={{
            color: "rgba(232,224,208,0.75)",
            fontSize: "18px",
            lineHeight: 1.9,
            marginBottom: 32,
          }}>
            Mākoa™ is a men&apos;s crowdfunding — twelve founders pooling into a 100-year trade order. Every dollar routed through a Mākoa chapter follows the same split:
          </p>

          {/* 80/10/10 */}
          <div className="split-grid" style={{ marginBottom: 32 }}>
            {TRADE_SPLIT.map(col => (
              <div key={col.label} style={{
                padding: "22px 16px",
                background: "rgba(212,166,104,0.04)",
                border: `1px solid ${GOLD_20}`,
                borderRadius: 10,
                textAlign: "center",
              }}>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
                  fontWeight: 700,
                  color: GOLD,
                  lineHeight: 1,
                  marginBottom: 8,
                }}>{col.pct}</p>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "13px",
                  letterSpacing: "0.14em",
                  color: GOLD_DIM,
                  marginBottom: 8,
                }}>{col.label}</p>
                <p style={{
                  color: "rgba(232,224,208,0.6)",
                  fontSize: "15px",
                  lineHeight: 1.6,
                }}>{col.desc}</p>
              </div>
            ))}
          </div>

          <p style={{
            color: "rgba(232,224,208,0.75)",
            fontSize: "18px",
            lineHeight: 1.9,
            marginBottom: 28,
          }}>
            Not a charity. Not a course. A chapter system for men who want to build real things where they live.
          </p>

          <div style={{ textAlign: "center" }}>
            <a href="/trust" style={{
              color: GOLD,
              fontSize: "17px",
              letterSpacing: "0.14em",
              textDecoration: "none",
              fontFamily: "'JetBrains Mono', monospace",
              borderBottom: `1px solid ${GOLD_20}`,
              paddingBottom: 3,
            }}>
              READ WHAT WE ARE → /trust
            </a>
          </div>
        </div>
      </div>

      {/* ── THREE XI LINES ───────────────────────────────────────────────────── */}
      <div style={{ background: "#04060a", borderTop: `1px solid ${GOLD_20}`, padding: "64px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {divider("THE 7G NET · THREE LINES")}

          <div className="xi-grid" style={{ marginBottom: 20 }}>
            {XI_LINES.map(line => (
              <div key={line.name} style={{
                padding: "22px 18px",
                background: "rgba(212,166,104,0.03)",
                border: `1px solid ${GOLD_20}`,
                borderRadius: 10,
              }}>
                <p style={{ fontSize: "1.6rem", marginBottom: 10 }}>{line.icon}</p>
                <p style={{ color: GOLD, fontSize: "15px", letterSpacing: "0.12em", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>{line.name}</p>
                <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "14px", letterSpacing: "0.06em", marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>{line.role}</p>
                <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "15px", lineHeight: 1.7 }}>{line.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <a href="/trust" style={{
              color: GOLD_DIM,
              fontSize: "16px",
              letterSpacing: "0.12em",
              textDecoration: "none",
              fontFamily: "'JetBrains Mono', monospace",
              borderBottom: `1px solid ${GOLD_20}`,
              paddingBottom: 2,
            }}>
              How the 7G Net works → /trust
            </a>
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <div style={{
        borderTop: `1px solid ${GOLD_20}`,
        padding: "72px 24px",
        background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.6)",
            fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
            lineHeight: 2.0,
            marginBottom: 40,
          }}>
            If the Palapala™ moves you, step through the gate.<br />
            If not, close the page and go build your own thing.<br />
            We&apos;ll be here either way.
          </p>

          <a
            href="/mayday48/gate"
            className="cta-primary"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              background: GOLD, color: "#000",
              borderRadius: 10, padding: "22px",
              fontSize: "18px", letterSpacing: "0.22em",
              textDecoration: "none", fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700, textAlign: "center",
              marginBottom: 40,
              animation: "goldGlow 4s ease-in-out infinite",
            }}
          >
            ENTER THE GATE → /mayday48/gate
          </a>

          {/* Footer CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            {[
              { href: "/palapala", label: "Read the Palapala™ →" },
              { href: "/book", label: "Read the Mākoa™ Book (open) →" },
              { href: "/sponsor", label: "Sponsor a brother →" },
              { href: "/waitlist", label: "Not ready? Waitlist →" },
              { href: "/mayday48/gate", label: "Overseas teams → War Party" },
            ].map(link => (
              <a key={link.href} href={link.href} style={{
                color: "rgba(232,224,208,0.5)",
                fontSize: "17px",
                letterSpacing: "0.1em",
                textDecoration: "none",
                fontFamily: "'JetBrains Mono', monospace",
                transition: "color 0.2s",
              }}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${GOLD_20}` }}>
        <SocialFooter />
      </div>

      {/* ── TRADEMARK FOOTER ─────────────────────────────────────────────────── */}
      <div style={{
        borderTop: `1px solid rgba(212,166,104,0.06)`,
        padding: "20px 24px",
        textAlign: "center",
        background: BG,
      }}>
        <p style={{ color: "rgba(212,166,104,0.2)", fontSize: "13px", letterSpacing: "0.1em", lineHeight: 1.8 }}>
          Mākoa™, Malu Trust™, Mayday 48™, and Palapala™ are trademarks of the Malu Trust. All rights reserved. © 2026 Malu Trust.
        </p>
      </div>
    </div>
  );
}