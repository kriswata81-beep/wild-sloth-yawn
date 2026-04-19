"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SocialFooter from "@/components/SocialFooter";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const RED = "#f85149";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const BG = "#04060a";

const SOLD_OUT_TARGET = new Date("2026-04-25T23:59:59-10:00");
const HOTEL_DEADLINE = new Date("2026-04-25T23:59:59-10:00");

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

const PROOF = [
  {
    quote: "I built this because I was the man who needed it. No one told me what to do with the weight I was carrying. Brotherhood isn't therapy — it's showing up at 4am when a brother calls. That's Mākoa.",
    name: "Kris W.",
    role: "Founder · West Oahu",
  },
  {
    quote: "My wife sent me. I didn't want to go. I came back a different man. She knew before I did.",
    name: "D.K.",
    role: "Mana Brother",
  },
  {
    quote: "This isn't therapy. It's not a gym. It's the thing I didn't know I was missing for 15 years.",
    name: "J.A.",
    role: "Nā Koa · Day Pass",
  },
];

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [tapFlash, setTapFlash] = useState(false);
  const [activeProof, setActiveProof] = useState(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soldOutTime = useCountdown(SOLD_OUT_TARGET);
  const hotelTime = useCountdown(HOTEL_DEADLINE);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Auto-rotate proof
  useEffect(() => {
    const id = setInterval(() => setActiveProof(p => (p + 1) % PROOF.length), 5000);
    return () => clearInterval(id);
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

  const seatsLeft = { cofounder: 4, mana: 6, nakoa: 10 };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", overflowX: "hidden" }}>
      <style>{`
        @keyframes crestFadeIn { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:scale(1); } }
        @keyframes breatheGlow { 0%,100% { box-shadow:0 0 0 0 rgba(176,142,80,0); } 50% { box-shadow:0 0 48px 14px rgba(176,142,80,0.14); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:1; transform:scale(1.5); } }
        @keyframes goldGlow { 0%,100% { box-shadow:0 0 16px rgba(176,142,80,0.15); } 50% { box-shadow:0 0 48px rgba(176,142,80,0.45); } }
        @keyframes slideProof { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        .cta-primary { transition: transform 0.15s, box-shadow 0.15s; }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(176,142,80,0.35); }
        .cta-primary:active { transform: translateY(0); }
        .cta-secondary { transition: border-color 0.2s, background 0.2s; }
        .cta-secondary:hover { border-color: rgba(176,142,80,0.7) !important; background: rgba(176,142,80,0.07) !important; }
        .nav-link:hover { color: rgba(176,142,80,0.75) !important; }
        input::placeholder { color: rgba(176,142,80,0.3); }
      `}</style>

      {/* ── URGENCY BAR ──────────────────────────────────────────────────────── */}
      {soldOutTime && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(4,6,10,0.96)",
          borderBottom: "1px solid rgba(248,81,73,0.25)",
          padding: "9px 16px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          opacity: ready ? 1 : 0,
          transition: "opacity 0.5s ease 0.6s",
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED, animation: "pulse 1.4s ease-in-out infinite", flexShrink: 0 }} />
          <p style={{ color: RED, fontSize: "13px", letterSpacing: "0.1em", fontWeight: 600 }}>
            GATE CLOSES APR 25 — {soldOutTime.days}D {soldOutTime.hours}H {soldOutTime.minutes}M {soldOutTime.seconds}S
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
        padding: "80px 24px 100px",
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

        {/* Brand */}
        <div style={{
          textAlign: "center", maxWidth: 380,
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(2.6rem, 10vw, 3.4rem)",
            color: GOLD,
            margin: "0 0 4px",
            lineHeight: 1,
            letterSpacing: "0.04em",
          }}>MĀKOA</p>

          <p style={{ fontSize: "11px", letterSpacing: "0.32em", color: "rgba(176,142,80,0.38)", margin: "0 0 28px" }}>
            A BROTHERHOOD OF MEN
          </p>

          {/* THE OUTCOME LINE — what you get, then the mood */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "clamp(1.15rem, 4vw, 1.35rem)",
            lineHeight: 1.75,
            marginBottom: 10,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.7s ease 0.4s",
          }}>
            A brotherhood of men who build<br />
            real things together.
          </p>

          <p style={{
            color: "rgba(232,224,208,0.4)",
            fontSize: "15px",
            lineHeight: 1.8,
            marginBottom: 10,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.7s ease 0.5s",
          }}>
            Not a gym. Not a podcast. Not a men's group<br />
            that talks about doing things.
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "1.05rem",
            marginBottom: 32,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.7s ease 0.6s",
          }}>
            West Oahu. May 1–4. Co-Founders Weekend — every month.
          </p>

          {/* SEAT COUNTS */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24,
            opacity: ready ? 1 : 0, transition: "opacity 0.7s ease 0.65s",
          }}>
            {[
              { label: "CO-FOUNDER", count: seatsLeft.cofounder, color: GOLD, sub: "Aliʻi · 1% equity" },
              { label: "MANA", count: seatsLeft.mana, color: BLUE, sub: "Mastermind" },
              { label: "NĀ KOA", count: seatsLeft.nakoa, color: GREEN, sub: "Day Pass" },
            ].map(s => (
              <div key={s.label} style={{
                padding: "12px 6px",
                background: `${s.color}08`,
                border: `1px solid ${s.color}30`,
                borderRadius: 8,
                textAlign: "center",
              }}>
                <p style={{ color: s.color, fontSize: "1.5rem", fontWeight: 700, lineHeight: 1, marginBottom: 3, fontFamily: "'JetBrains Mono', monospace" }}>{s.count}</p>
                <p style={{ color: `${s.color}90`, fontSize: "10px", letterSpacing: "0.14em", marginBottom: 2 }}>{s.label}</p>
                <p style={{ color: "rgba(232,224,208,0.22)", fontSize: "10px" }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* TIER LADDER */}
          <div style={{
            background: "rgba(176,142,80,0.04)",
            border: "1px solid rgba(176,142,80,0.1)",
            borderRadius: 8,
            padding: "14px 16px",
            marginBottom: 16,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.7s ease 0.7s",
          }}>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "10px", letterSpacing: "0.2em", marginBottom: 10, textAlign: "center" }}>MAYDAY ENTRY TIERS</p>
            {[
              { tier: "NĀ KOA", price: "$97", desc: "Day Pass · 12 hrs · meet the brothers", color: GREEN },
              { tier: "MANA", price: "$197", desc: "Mastermind · 24 hrs · deep work", color: BLUE },
              { tier: "ALIʻI", price: "$4,997", desc: "Co-Founder · 48 hrs · 1% equity", color: GOLD },
            ].map((t, i, arr) => (
              <div key={t.tier} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "6px 0",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ color: t.color, fontSize: "10px", letterSpacing: "0.12em", fontWeight: 600 }}>{t.tier}</span>
                  <span style={{ color: "rgba(232,224,208,0.25)", fontSize: "10px" }}>{t.desc}</span>
                </div>
                <span style={{ color: t.color, fontSize: "13px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginLeft: 8 }}>{t.price}</span>
              </div>
            ))}
          </div>

          {/* TWO PATHS — PRIMARY CTAs */}
          <div style={{
            display: "grid", gap: 10, marginBottom: 20,
            opacity: ready ? 1 : 0, transition: "opacity 0.7s ease 0.75s",
          }}>
            {/* I'M THE MAN — goes straight to /gate, no modal */}
            <a
              href="/gate"
              className="cta-primary"
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: GOLD,
                borderRadius: 10,
                padding: "18px 22px",
                textDecoration: "none",
                animation: ready ? "goldGlow 4s ease-in-out 1.5s infinite" : "none",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <p style={{ color: "#000", fontSize: "15px", letterSpacing: "0.18em", fontWeight: 700, marginBottom: 3 }}>I'M THE MAN</p>
                <p style={{ color: "rgba(0,0,0,0.5)", fontSize: "13px", lineHeight: 1.4 }}>Enter the gate. Get your tier. 12 questions.</p>
              </div>
              <span style={{ color: "#000", fontSize: "1.3rem", flexShrink: 0, marginLeft: 12 }}>→</span>
            </a>

            {/* I KNOW A MAN */}
            <a
              href="/sponsor"
              className="cta-secondary"
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "transparent",
                border: `1px solid ${GOLD_40}`,
                borderRadius: 10,
                padding: "18px 22px",
                textDecoration: "none",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <p style={{ color: GOLD, fontSize: "15px", letterSpacing: "0.18em", fontWeight: 700, marginBottom: 3 }}>I KNOW A MAN</p>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "13px", lineHeight: 1.4 }}>Sponsor him in. He never has to know who.</p>
              </div>
              <span style={{ color: GOLD_DIM, fontSize: "1.3rem", flexShrink: 0, marginLeft: 12 }}>→</span>
            </a>
          </div>

          {/* Hotel deadline — only show if still active */}
          {hotelTime && (
            <div style={{
              background: "rgba(248,81,73,0.05)",
              border: "1px solid rgba(248,81,73,0.18)",
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 20,
              opacity: ready ? 1 : 0,
              transition: "opacity 0.7s ease 0.85s",
            }}>
              <p style={{ color: "rgba(248,81,73,0.65)", fontSize: "11px", letterSpacing: "0.15em", marginBottom: 8, textAlign: "center" }}>
                ⚡ HOTEL ROOMS HELD UNTIL APR 25
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {[
                  { val: hotelTime.days, label: "DAYS" },
                  { val: hotelTime.hours, label: "HRS" },
                  { val: hotelTime.minutes, label: "MIN" },
                  { val: hotelTime.seconds, label: "SEC" },
                ].map(t => (
                  <div key={t.label} style={{ textAlign: "center", minWidth: 40 }}>
                    <p style={{ color: RED, fontSize: "1.3rem", fontWeight: 700, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>
                      {String(t.val).padStart(2, "0")}
                    </p>
                    <p style={{ color: "rgba(248,81,73,0.4)", fontSize: "10px", letterSpacing: "0.1em", marginTop: 2 }}>{t.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div style={{
          position: "absolute", bottom: 24, left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: ready ? 1 : 0, transition: "opacity 0.7s ease 1.1s",
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "center", padding: "0 16px" }}>
            {[
              { href: "/net", label: "7G NET" },
              { href: "/founding48", label: "MAYDAY" },
              { href: "/trade", label: "TRADE CO." },
              { href: "/cofounder", label: "CO-FOUNDER" },
              { href: "/mana-makoa", label: "MANA MAKOA" },
              { href: "/portal", label: "PORTAL" },
            ].map((link, i, arr) => (
              <span key={link.href} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <a href={link.href} className="nav-link" style={{ color: "rgba(176,142,80,0.28)", fontSize: "11px", letterSpacing: "0.15em", textDecoration: "none", transition: "color 0.2s" }}>
                  {link.label}
                </a>
                {i < arr.length - 1 && <span style={{ color: "rgba(176,142,80,0.1)", fontSize: "11px" }}>·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── SOCIAL PROOF ─────────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(180deg, #04060a 0%, #060810 100%)", borderTop: `1px solid ${GOLD_20}`, padding: "56px 24px" }}>
        <div style={{ maxWidth: 400, margin: "0 auto" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
            <p style={{ color: GOLD_DIM, fontSize: "11px", letterSpacing: "0.28em", whiteSpace: "nowrap" }}>BROTHERS SPEAK</p>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          </div>

          {/* Rotating testimonial */}
          <div style={{
            background: GOLD_10,
            border: `1px solid ${GOLD_40}`,
            borderRadius: 12,
            padding: "28px 24px",
            marginBottom: 16,
            position: "relative",
            overflow: "hidden",
            minHeight: 140,
            animation: "goldGlow 5s ease-in-out infinite",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <span style={{ color: GOLD_40, fontSize: "2.5rem", lineHeight: 1, display: "block", marginBottom: 12, fontFamily: "Georgia, serif" }}>"</span>
            <p
              key={activeProof}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                color: "#e8e0d0",
                fontSize: "1.1rem",
                lineHeight: 1.8,
                marginBottom: 16,
                animation: "slideProof 0.5s ease forwards",
              }}
            >
              {PROOF[activeProof].quote}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: GOLD, fontSize: "13px", letterSpacing: "0.1em" }}>{PROOF[activeProof].name}</p>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "12px", marginTop: 2 }}>{PROOF[activeProof].role}</p>
              </div>
              {/* Dots */}
              <div style={{ display: "flex", gap: 6 }}>
                {PROOF.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveProof(i)}
                    style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: i === activeProof ? GOLD : "rgba(176,142,80,0.2)",
                      border: "none", cursor: "pointer", padding: 0,
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CTA after proof */}
          <a href="/gate" className="cta-primary" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            background: GOLD, color: "#000", borderRadius: 10, padding: "16px",
            fontSize: "14px", letterSpacing: "0.2em", textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          }}>
            ENTER THE GATE →
          </a>
        </div>
      </div>

      {/* ── WHAT IS MĀKOA ────────────────────────────────────────────────────── */}
      <div style={{ background: "#04060a", borderTop: `1px solid ${GOLD_20}`, padding: "56px 24px" }}>
        <div style={{ maxWidth: 400, margin: "0 auto" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
            <p style={{ color: GOLD_DIM, fontSize: "11px", letterSpacing: "0.28em", whiteSpace: "nowrap" }}>WHAT IS MĀKOA</p>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          </div>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "1.35rem",
            lineHeight: 1.85,
            marginBottom: 16,
          }}>
            A brotherhood of men who show up<br />
            at 4am when no one is watching.
          </p>

          <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "15px", lineHeight: 1.85, marginBottom: 32 }}>
            Mākoa is a structured order — with ranks, territory, a trade network, and a 100-year mission. You earn your place. You hold your brothers. You build something that outlasts you.
          </p>

          <div style={{ display: "grid", gap: 10, marginBottom: 32 }}>
            {[
              { icon: "⚒", label: "A real trade", detail: "Labor, knowledge, territory. The route moves men — not products." },
              { icon: "🏠", label: "A real house", detail: "Mākoa House — West Oahu. Physical. Permanent. Yours." },
              { icon: "◈", label: "A real rank", detail: "Nā Koa → Mana → Aliʻi. Earned through the work, not bought." },
              { icon: "🔥", label: "A real founding", detail: "West Oahu. The entire month of May. 4 weekends. Team leaders worldwide. Co-Founders Founding — May 31, Blue Moon." },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex", alignItems: "flex-start", gap: 16,
                padding: "16px 18px",
                background: GOLD_10,
                border: `1px solid ${GOLD_20}`,
                borderRadius: 10,
              }}>
                <span style={{ fontSize: "1.2rem", flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <div>
                  <p style={{ color: GOLD, fontSize: "14px", marginBottom: 4, fontWeight: 600 }}>{item.label}</p>
                  <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "13px", lineHeight: 1.6 }}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <a href="/founding48" className="cta-primary" style={{
            display: "block", background: GOLD, color: "#000", borderRadius: 10,
            padding: "16px", fontSize: "14px", letterSpacing: "0.2em",
            textDecoration: "none", fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700, textAlign: "center", marginBottom: 10,
          }}>
            SEE THE FULL EVENT — MAYDAY →
          </a>
          <a href="/trade" className="cta-secondary" style={{
            display: "block", background: "transparent", color: GOLD_DIM,
            border: `1px solid ${GOLD_20}`, borderRadius: 10, padding: "14px",
            fontSize: "13px", letterSpacing: "0.15em", textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace", textAlign: "center",
          }}>
            READ THE TRADE CO. DOCTRINE
          </a>
        </div>
      </div>

      {/* ── SPONSOR SECTION ──────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(180deg, #04060a 0%, #060810 100%)", borderTop: `1px solid ${GOLD_20}`, padding: "56px 24px" }}>
        <div style={{ maxWidth: 400, margin: "0 auto" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
            <p style={{ color: GOLD_DIM, fontSize: "11px", letterSpacing: "0.28em", whiteSpace: "nowrap" }}>KNOW A MAN WHO NEEDS THIS?</p>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          </div>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "1.3rem",
            lineHeight: 1.85,
            marginBottom: 16,
          }}>
            Send him through the gate.<br />
            He never has to know who sent him.
          </p>

          <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "15px", lineHeight: 1.85, marginBottom: 24 }}>
            A wife. A mother. A brother. A friend. You choose his tier. You pay his way. He receives a message:
          </p>

          <div style={{
            background: GOLD_10,
            border: `1px solid ${GOLD_40}`,
            borderRadius: 10,
            padding: "20px 22px",
            marginBottom: 24,
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: GOLD,
              fontSize: "1.1rem",
              lineHeight: 1.9,
            }}>
              "Someone believes in you.<br />
              You've been sponsored into Mākoa."
            </p>
          </div>

          <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
            {[
              { tier: "DAY PASS", price: "$97", detail: "12 hours. One day that changes everything.", color: GREEN },
              { tier: "MASTERMIND", price: "$197", detail: "24 hours. Deep work. Real brotherhood.", color: BLUE },
              { tier: "WAR ROOM", price: "$397 deposit", detail: "The full 48 hours. All in.", color: GOLD },
            ].map(t => (
              <div key={t.tier} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px",
                background: `${t.color}08`,
                border: `1px solid ${t.color}28`,
                borderRadius: 8,
              }}>
                <div>
                  <p style={{ color: t.color, fontSize: "13px", letterSpacing: "0.15em", marginBottom: 3, fontWeight: 600 }}>{t.tier}</p>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "13px" }}>{t.detail}</p>
                </div>
                <p style={{ color: t.color, fontSize: "1.1rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginLeft: 16 }}>{t.price}</p>
              </div>
            ))}
          </div>

          <a href="/sponsor" className="cta-primary" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: "transparent", color: GOLD,
            border: `1px solid ${GOLD_40}`, borderRadius: 10, padding: "16px",
            fontSize: "14px", letterSpacing: "0.2em", textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            animation: "goldGlow 4s ease-in-out infinite",
          }}>
            SPONSOR A BROTHER →
          </a>
        </div>
      </div>

      {/* ── THE NUMBERS + FINAL CTA ───────────────────────────────────────────── */}
      <div style={{ background: "#04060a", borderTop: `1px solid ${GOLD_20}`, padding: "56px 24px" }}>
        <div style={{ maxWidth: 400, margin: "0 auto" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
            <p style={{ color: GOLD_DIM, fontSize: "11px", letterSpacing: "0.28em", whiteSpace: "nowrap" }}>THE FOUNDING NUMBERS</p>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
            {[
              { val: `${seatsLeft.cofounder} LEFT`, label: "Co-Founder seats", sub: "Aliʻi · $4,997 · 1% equity", color: GOLD },
              { val: `${seatsLeft.mana} of 24`, label: "Mastermind seats", sub: "Mana · $197 · 24hr", color: BLUE },
              { val: `${seatsLeft.nakoa} of 20`, label: "Day Pass seats", sub: "Nā Koa · $97 · 12hr", color: GREEN },
              { val: "APR 25", label: "Gate Closes", sub: soldOutTime ? `${soldOutTime.days} days left` : "closing soon", color: RED },
            ].map(s => (
              <div key={s.label} style={{
                textAlign: "center", padding: "18px 12px",
                background: `${s.color}06`,
                border: `1px solid ${s.color}25`,
                borderRadius: 10,
              }}>
                <p style={{ color: s.color, fontSize: "1.7rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1, marginBottom: 5 }}>{s.val}</p>
                <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "13px", marginBottom: 3 }}>{s.label}</p>
                <p style={{ color: "rgba(232,224,208,0.28)", fontSize: "12px" }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Final close */}
          <div style={{
            background: GOLD_10,
            border: `1px solid ${GOLD_40}`,
            borderRadius: 12,
            padding: "28px 24px",
            textAlign: "center",
            animation: "goldGlow 5s ease-in-out infinite",
            marginBottom: 16,
          }}>
            <span style={{ color: GOLD_DIM, fontSize: "1.8rem", display: "block", marginBottom: 16, animation: "breathe 3s ease-in-out infinite" }}>◈</span>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "#e8e0d0",
              fontSize: "1.2rem",
              lineHeight: 1.9,
              marginBottom: 24,
            }}>
              We don't need hundreds.<br />
              We need the right men.<br />
              <span style={{ color: GOLD }}>Are you one of them?</span>
            </p>
            <a href="/gate" className="cta-primary" style={{
              display: "block", background: GOLD, color: "#000",
              borderRadius: 10, padding: "17px",
              fontSize: "15px", letterSpacing: "0.22em",
              textDecoration: "none", fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700, textAlign: "center", marginBottom: 10,
            }}>
              ENTER THE GATE
            </a>
            <a href="/sponsor" style={{
              display: "block", color: "rgba(232,224,208,0.3)",
              fontSize: "13px", letterSpacing: "0.12em",
              textDecoration: "none", textAlign: "center",
              padding: "8px",
            }}>
              or sponsor a brother →
            </a>
            <a href="/fire" style={{
              display: "block", color: "rgba(176,142,80,0.4)",
              fontSize: "13px", letterSpacing: "0.1em",
              textDecoration: "none", textAlign: "center",
              padding: "6px",
            }}>
              🔥 What actually happens inside →
            </a>
          </div>

          <p style={{ textAlign: "center", color: "rgba(232,224,208,0.18)", fontSize: "12px", letterSpacing: "0.12em" }}>
            Malu Trust · West Oahu · 2026
          </p>
          <p style={{ textAlign: "center", color: "rgba(176,142,80,0.35)", fontSize: "13px", letterSpacing: "0.1em", marginTop: 6 }}>
            makoa.live
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
