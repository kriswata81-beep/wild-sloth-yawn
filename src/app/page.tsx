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

// April 20 hotel deadline / April 25 sold out target
const HOTEL_DEADLINE = new Date("2026-04-20T23:59:59-10:00");
const SOLD_OUT_TARGET = new Date("2026-04-25T23:59:59-10:00");

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
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return mounted ? time : { days: 0, hours: 0, minutes: 0, seconds: 0 };
}

function MakoaCrest() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/makoa_eclipse_crest.png"
      alt="Mākoa Order Crest"
      width={96}
      height={96}
      style={{ borderRadius: "50%", display: "block" }}
    />
  );
}

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<"landing" | "gate">("landing");
  const [tapCount, setTapCount] = useState(0);
  const [tapFlash, setTapFlash] = useState(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hotelTime = useCountdown(HOTEL_DEADLINE);
  const soldOutTime = useCountdown(SOLD_OUT_TARGET);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  function handleCrestTap() {
    const next = tapCount + 1;
    setTapCount(next);
    setTapFlash(true);
    setTimeout(() => setTapFlash(false), 120);
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (next >= 5) {
      setTapCount(0);
      router.push("/steward");
      return;
    }
    tapTimer.current = setTimeout(() => setTapCount(0), 2000);
  }

  function handleEnter() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("makoa_handle", name);
      sessionStorage.setItem("makoa_phone", phone);
    }
    router.push("/gate");
  }

  const inputStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${GOLD_20}`,
    color: GOLD,
    fontSize: "0.85rem",
    fontFamily: "'JetBrains Mono', monospace",
    textAlign: "center",
    padding: "10px 0",
    width: "100%",
    outline: "none",
    letterSpacing: "0.08em",
  };

  const seatsLeft = { cofounder: 12, mana: 24, nakoa: 12 };

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      color: "#e8e0d0",
      fontFamily: "'JetBrains Mono', monospace",
      overflowX: "hidden",
    }}>
      <style>{`
        @keyframes crestFadeIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
        @keyframes breatheGlow { 0%,100% { box-shadow:0 0 0 0 rgba(176,142,80,0); } 50% { box-shadow:0 0 40px 12px rgba(176,142,80,0.12); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes urgencyPulse { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.4); } }
        @keyframes goldGlow { 0%,100% { box-shadow:0 0 12px rgba(176,142,80,0.1); } 50% { box-shadow:0 0 40px rgba(176,142,80,0.35); } }
        @keyframes breathe { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        input::placeholder { color: rgba(176,142,80,0.3); }
        .path-card { transition: border-color 0.2s, background 0.2s; cursor: pointer; }
        .path-card:hover { border-color: rgba(176,142,80,0.6) !important; background: rgba(176,142,80,0.06) !important; }
        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: rgba(176,142,80,0.8) !important; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px 120px",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 30%, rgba(176,142,80,0.06) 0%, transparent 65%)",
      }}>

        {/* Urgency bar — top */}
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          background: "rgba(248,81,73,0.08)",
          borderBottom: "1px solid rgba(248,81,73,0.2)",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          zIndex: 100,
          opacity: ready ? 1 : 0,
          transition: "opacity 0.6s ease 0.8s",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED, animation: "urgencyPulse 1.5s ease-in-out infinite", flexShrink: 0 }} />
          <p style={{ color: RED, fontSize: "0.42rem", letterSpacing: "0.15em" }}>
            HOTEL DEADLINE: APR 20 · SOLD OUT TARGET: APR 25 · {soldOutTime.days}D {soldOutTime.hours}H {soldOutTime.minutes}M REMAINING
          </p>
        </div>

        {/* Crest */}
        <div
          style={{
            marginBottom: 28,
            animation: "crestFadeIn 1.8s cubic-bezier(0.16,1,0.3,1) forwards",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={handleCrestTap}
        >
          <div style={{
            borderRadius: "50%",
            animation: "breatheGlow 4s ease-in-out 2s infinite",
            opacity: tapFlash ? 0.7 : 1,
            transition: "opacity 0.1s",
          }}>
            <MakoaCrest />
          </div>
          {tapCount > 0 && tapCount < 5 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 8 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: i <= tapCount ? GOLD : "rgba(176,142,80,0.15)",
                  transition: "background 0.15s",
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Hook */}
        <div style={{
          textAlign: "center",
          maxWidth: 360,
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(2.2rem, 8vw, 3rem)",
            color: GOLD,
            margin: "0 0 6px",
            lineHeight: 1.05,
          }}>MĀKOA</p>

          <p style={{
            fontSize: "0.52rem",
            letterSpacing: "0.28em",
            color: "rgba(176,142,80,0.4)",
            margin: "0 0 24px",
          }}>A BROTHERHOOD OF MEN</p>

          {/* The one-sentence hook */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.85)",
            fontSize: "1.15rem",
            lineHeight: 1.9,
            marginBottom: 8,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}>
            72 men. West Oahu. May 1–3.<br />
            The founding fire happens once.
          </p>

          <p style={{
            color: "rgba(232,224,208,0.35)",
            fontSize: "0.48rem",
            lineHeight: 1.8,
            marginBottom: 32,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.8s ease 0.65s",
          }}>
            4am ice bath. Brotherhood circle. The oath.<br />
            A trade network built by men who show up.
          </p>

          {/* Seat counts */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            marginBottom: 28,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.8s ease 0.75s",
          }}>
            {[
              { label: "CO-FOUNDER", count: seatsLeft.cofounder, color: GOLD },
              { label: "MANA", count: seatsLeft.mana, color: BLUE },
              { label: "NĀ KOA", count: seatsLeft.nakoa, color: GREEN },
            ].map(s => (
              <div key={s.label} style={{
                padding: "10px 6px",
                background: `${s.color}08`,
                border: `1px solid ${s.color}25`,
                borderRadius: 6,
                textAlign: "center",
              }}>
                <p style={{ color: s.color, fontSize: "1.1rem", fontWeight: 700, lineHeight: 1, marginBottom: 3 }}>{s.count}</p>
                <p style={{ color: `${s.color}80`, fontSize: "0.34rem", letterSpacing: "0.12em" }}>{s.label}</p>
                <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.32rem", marginTop: 1 }}>SEATS LEFT</p>
              </div>
            ))}
          </div>

          {/* TWO PATHS */}
          <div style={{
            display: "grid",
            gap: 10,
            marginBottom: 24,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.8s ease 0.85s",
          }}>
            {/* Path 1 — I'm the man */}
            <div
              className="path-card"
              onClick={() => setView("gate")}
              style={{
                background: GOLD,
                borderRadius: 8,
                padding: "16px 20px",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <p style={{ color: "#000", fontSize: "0.52rem", letterSpacing: "0.18em", fontWeight: 700, marginBottom: 3 }}>I'M THE MAN</p>
                <p style={{ color: "rgba(0,0,0,0.55)", fontSize: "0.44rem", lineHeight: 1.4 }}>Enter the gate. Get your tier.</p>
              </div>
              <span style={{ color: "#000", fontSize: "1.1rem", flexShrink: 0 }}>→</span>
            </div>

            {/* Path 2 — I know a man */}
            <a
              href="/sponsor"
              style={{
                background: "transparent",
                border: `1px solid ${GOLD_40}`,
                borderRadius: 8,
                padding: "16px 20px",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                textDecoration: "none",
              }}
              className="path-card"
            >
              <div>
                <p style={{ color: GOLD, fontSize: "0.52rem", letterSpacing: "0.18em", fontWeight: 700, marginBottom: 3 }}>I KNOW A MAN</p>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem", lineHeight: 1.4 }}>Sponsor him in. He never has to know who.</p>
              </div>
              <span style={{ color: GOLD_DIM, fontSize: "1.1rem", flexShrink: 0 }}>→</span>
            </a>
          </div>

          {/* Deadline mini-countdown */}
          <div style={{
            background: "rgba(248,81,73,0.06)",
            border: "1px solid rgba(248,81,73,0.15)",
            borderRadius: 6,
            padding: "10px 14px",
            marginBottom: 24,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.8s ease 0.95s",
          }}>
            <p style={{ color: "rgba(248,81,73,0.7)", fontSize: "0.4rem", letterSpacing: "0.15em", marginBottom: 6 }}>HOTEL ROOMS HELD UNTIL APR 20</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {[
                { val: hotelTime.days, label: "DAYS" },
                { val: hotelTime.hours, label: "HRS" },
                { val: hotelTime.minutes, label: "MIN" },
                { val: hotelTime.seconds, label: "SEC" },
              ].map(t => (
                <div key={t.label} style={{ textAlign: "center", minWidth: 36 }}>
                  <p style={{ color: RED, fontSize: "1.1rem", fontWeight: 700, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>
                    {String(t.val).padStart(2, "0")}
                  </p>
                  <p style={{ color: "rgba(248,81,73,0.4)", fontSize: "0.32rem", letterSpacing: "0.1em" }}>{t.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gate form — slides in when "I'M THE MAN" is clicked */}
        {view === "gate" && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(4,6,10,0.97)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 24px",
            zIndex: 200,
            animation: "fadeUp 0.3s ease forwards",
          }}>
            <button
              onClick={() => setView("landing")}
              style={{
                position: "absolute", top: 20, right: 20,
                background: "transparent", border: "none",
                color: GOLD_DIM, fontSize: "1.2rem", cursor: "pointer",
              }}
            >✕</button>

            <div style={{ textAlign: "center", width: "100%", maxWidth: 320 }}>
              <div style={{ marginBottom: 24, cursor: "pointer" }} onClick={handleCrestTap}>
                <div style={{ borderRadius: "50%", animation: "breatheGlow 4s ease-in-out infinite", display: "inline-block" }}>
                  <MakoaCrest />
                </div>
              </div>

              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "2rem",
                color: GOLD,
                margin: "0 0 6px",
              }}>MĀKOA</p>

              <p style={{
                fontSize: "0.48rem",
                letterSpacing: "0.22em",
                color: "rgba(176,142,80,0.35)",
                margin: "0 0 28px",
              }}>Under the Malu</p>

              <div style={{ display: "grid", gap: 16, marginBottom: 28 }}>
                <div>
                  <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.45rem", letterSpacing: "0.2em", marginBottom: 6 }}>YOUR NAME IN THE ORDER</p>
                  <input
                    style={inputStyle}
                    placeholder="Handle name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div>
                  <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.45rem", letterSpacing: "0.2em", marginBottom: 6 }}>YOUR SIGNAL</p>
                  <input
                    style={inputStyle}
                    placeholder="808 · · · · · · ·"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handleEnter}
                style={{
                  background: "transparent",
                  border: `1px solid ${GOLD_40}`,
                  color: GOLD,
                  fontSize: "0.55rem",
                  letterSpacing: "0.3em",
                  padding: "13px 40px",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  width: "100%",
                  borderRadius: 4,
                }}
              >
                ENTER
              </button>
            </div>
          </div>
        )}

        {/* Bottom nav */}
        <div style={{
          position: "absolute",
          bottom: 60,
          left: 0, right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: ready ? 1 : 0,
          transition: "opacity 0.8s ease 1.1s",
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center", padding: "0 16px" }}>
            {[
              { href: "/founding48", label: "MAYDAY" },
              { href: "/trade", label: "TRADE CO." },
              { href: "/cofounder", label: "CO-FOUNDER" },
              { href: "/mana-makoa", label: "MANA MAKOA" },
              { href: "/portal", label: "PORTAL" },
            ].map((link, i, arr) => (
              <span key={link.href} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <a href={link.href} className="nav-link" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", letterSpacing: "0.15em", textDecoration: "none" }}>
                  {link.label}
                </a>
                {i < arr.length - 1 && <span style={{ color: "rgba(176,142,80,0.1)", fontSize: "0.38rem" }}>·</span>}
              </span>
            ))}
          </div>
          <p style={{ color: "rgba(176,142,80,0.1)", fontSize: "0.36rem", letterSpacing: "0.15em" }}>
            Malu Trust · West Oahu · 2026
          </p>
        </div>
      </div>

      {/* ── WHAT IS MĀKOA — for the cold lead ────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #04060a 0%, #060810 100%)",
        borderTop: `1px solid ${GOLD_20}`,
        padding: "56px 24px",
      }}>
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
            <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.28em", whiteSpace: "nowrap" }}>WHAT IS MĀKOA</p>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          </div>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "1.3rem",
            lineHeight: 1.9,
            marginBottom: 20,
          }}>
            A brotherhood of men who show up<br />
            at 4am when no one is watching.
          </p>

          <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.5rem", lineHeight: 1.9, marginBottom: 28 }}>
            Not a gym. Not a podcast. Not a men's group that talks about doing things. Mākoa is a structured order — with ranks, territory, a trade network, and a 100-year mission. You earn your place. You hold your brothers. You build something that outlasts you.
          </p>

          <div style={{ display: "grid", gap: 8, marginBottom: 32 }}>
            {[
              { icon: "⚒", label: "A real trade", detail: "Labor, knowledge, territory. The route moves men." },
              { icon: "🏠", label: "A real house", detail: "Mākoa House — West Oahu. Physical. Permanent." },
              { icon: "◈", label: "A real rank", detail: "Nā Koa → Mana → Aliʻi. Earned, not bought." },
              { icon: "🔥", label: "A real founding", detail: "72 men. May 1–3. The fire happens once." },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "14px 16px",
                background: GOLD_10,
                border: `1px solid ${GOLD_20}`,
                borderRadius: 8,
              }}>
                <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ color: GOLD, fontSize: "0.48rem", marginBottom: 3 }}>{item.label}</p>
                  <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.44rem", lineHeight: 1.5 }}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <a href="/founding48" style={{
            display: "block",
            background: GOLD,
            color: "#000",
            borderRadius: 6,
            padding: "15px",
            fontSize: "0.52rem",
            letterSpacing: "0.2em",
            textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 10,
          }}>
            SEE THE FULL EVENT — MAYDAY
          </a>
          <a href="/trade" style={{
            display: "block",
            background: "transparent",
            color: GOLD_DIM,
            border: `1px solid ${GOLD_20}`,
            borderRadius: 6,
            padding: "13px",
            fontSize: "0.46rem",
            letterSpacing: "0.15em",
            textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace",
            textAlign: "center",
          }}>
            READ THE TRADE CO. DOCTRINE
          </a>
        </div>
      </div>

      {/* ── FOR THE WOMAN / SPONSOR ───────────────────────────────────────────── */}
      <div style={{
        background: "#04060a",
        borderTop: `1px solid ${GOLD_20}`,
        padding: "56px 24px",
      }}>
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
            <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.28em", whiteSpace: "nowrap" }}>KNOW A MAN WHO NEEDS THIS?</p>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          </div>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "1.2rem",
            lineHeight: 1.9,
            marginBottom: 16,
          }}>
            Send him through the gate.<br />
            He never has to know who sent him.
          </p>

          <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.48rem", lineHeight: 1.9, marginBottom: 24 }}>
            A wife. A mother. A brother. A friend. If you see something in a man that he can't see in himself — this is how you act on it. You choose his tier. You pay his way. He receives a message: <span style={{ color: GOLD, fontStyle: "italic" }}>"Someone believes in you. You've been sponsored into Mākoa."</span>
          </p>

          <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
            {[
              { tier: "DAY PASS", price: "$97", detail: "12 hours. One day that changes everything.", color: GREEN },
              { tier: "MASTERMIND", price: "$197", detail: "24 hours. Deep work. Real brotherhood.", color: BLUE },
              { tier: "WAR ROOM", price: "$397 deposit", detail: "The full 48 hours. All in.", color: GOLD },
            ].map(t => (
              <div key={t.tier} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: `${t.color}08`,
                border: `1px solid ${t.color}25`,
                borderRadius: 8,
              }}>
                <div>
                  <p style={{ color: t.color, fontSize: "0.44rem", letterSpacing: "0.15em", marginBottom: 2 }}>{t.tier}</p>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem" }}>{t.detail}</p>
                </div>
                <p style={{ color: t.color, fontSize: "0.75rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginLeft: 12 }}>{t.price}</p>
              </div>
            ))}
          </div>

          <a href="/sponsor" style={{
            display: "block",
            background: "transparent",
            color: GOLD,
            border: `1px solid ${GOLD_40}`,
            borderRadius: 6,
            padding: "15px",
            fontSize: "0.52rem",
            letterSpacing: "0.2em",
            textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            textAlign: "center",
            animation: "goldGlow 4s ease-in-out infinite",
          }}>
            SPONSOR A BROTHER →
          </a>
        </div>
      </div>

      {/* ── THE NUMBERS ───────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #04060a 0%, #060810 100%)",
        borderTop: `1px solid ${GOLD_20}`,
        padding: "48px 24px",
      }}>
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.28em", textAlign: "center", marginBottom: 24 }}>
            THE FOUNDING NUMBERS
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
            {[
              { val: "72", label: "Founding Brothers", sub: "Total seats" },
              { val: "12", label: "Co-Founders", sub: "Aliʻi · 1% equity each" },
              { val: "24", label: "Mana Brothers", sub: "24HR Mastermind" },
              { val: "APR 25", label: "Sold Out Target", sub: "12 days from now" },
            ].map(s => (
              <div key={s.label} style={{
                textAlign: "center",
                padding: "16px 12px",
                background: GOLD_10,
                border: `1px solid ${GOLD_20}`,
                borderRadius: 8,
              }}>
                <p style={{ color: GOLD, fontSize: "1.5rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1, marginBottom: 4 }}>{s.val}</p>
                <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.42rem", marginBottom: 2 }}>{s.label}</p>
                <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.38rem" }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div style={{
            background: "rgba(176,142,80,0.04)",
            border: `1px solid ${GOLD_40}`,
            borderRadius: 10,
            padding: "20px",
            textAlign: "center",
            animation: "goldGlow 5s ease-in-out infinite",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "#e8e0d0",
              fontSize: "1.05rem",
              lineHeight: 1.9,
              marginBottom: 16,
            }}>
              We don't need hundreds.<br />
              We need 72 men who are ready.
            </p>
            <button
              onClick={() => setView("gate")}
              style={{
                background: GOLD,
                color: "#000",
                border: "none",
                borderRadius: 6,
                padding: "14px 32px",
                fontSize: "0.52rem",
                letterSpacing: "0.2em",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                width: "100%",
              }}
            >
              ENTER THE GATE
            </button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${GOLD_20}` }}>
        <SocialFooter />
      </div>
    </div>
  );
}
