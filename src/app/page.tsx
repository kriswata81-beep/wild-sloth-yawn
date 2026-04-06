"use client";
import { useState, useEffect, useRef } from "react";

// ─── COLORS ───────────────────────────────────────────────────────────────────
const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const PURPLE = "#534AB7";
const BG_GATE = "#04060a";

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
function useCountdown() {
  const target = new Date("2026-05-01T18:00:00-10:00").getTime();
  const calc = () => {
    const diff = target - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 60000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─── SVG CREST ────────────────────────────────────────────────────────────────
function MakoaCrest() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer circle */}
      <circle cx="100" cy="100" r="95" stroke={GOLD} strokeWidth="1.2" />
      {/* Inner circle */}
      <circle cx="100" cy="100" r="72" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Compass arms */}
      <rect x="98.5" y="10" width="3" height="30" fill={GOLD} fillOpacity="0.25" />
      <rect x="98.5" y="160" width="3" height="30" fill={GOLD} fillOpacity="0.25" />
      <rect x="10" y="98.5" width="30" height="3" fill={GOLD} fillOpacity="0.25" />
      <rect x="160" y="98.5" width="30" height="3" fill={GOLD} fillOpacity="0.25" />
      {/* Diamond points N E S W */}
      <polygon points="100,5 104,14 100,10 96,14" fill={GOLD} />
      <polygon points="195,100 186,104 190,100 186,96" fill={GOLD} />
      <polygon points="100,195 104,186 100,190 96,186" fill={GOLD} />
      <polygon points="5,100 14,104 10,100 14,96" fill={GOLD} />
      {/* Center QR-style box 80x80 */}
      <rect x="60" y="60" width="80" height="80" fill="#000" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.3" />
      {/* QR corner squares */}
      {/* Top-left */}
      <rect x="65" y="65" width="18" height="18" stroke={GOLD} strokeWidth="1.2" fill="none" />
      <rect x="69" y="69" width="10" height="10" fill={GOLD} />
      {/* Top-right */}
      <rect x="117" y="65" width="18" height="18" stroke={GOLD} strokeWidth="1.2" fill="none" />
      <rect x="121" y="69" width="10" height="10" fill={GOLD} />
      {/* Bottom-left */}
      <rect x="65" y="117" width="18" height="18" stroke={GOLD} strokeWidth="1.2" fill="none" />
      <rect x="69" y="121" width="10" height="10" fill={GOLD} />
      {/* Center dots */}
      <rect x="90" y="90" width="4" height="4" fill={GOLD} fillOpacity="0.8" />
      <rect x="96" y="90" width="4" height="4" fill={GOLD} fillOpacity="0.5" />
      <rect x="102" y="90" width="4" height="4" fill={GOLD} fillOpacity="0.8" />
      <rect x="90" y="96" width="4" height="4" fill={GOLD} fillOpacity="0.5" />
      <rect x="96" y="96" width="4" height="4" fill={GOLD} fillOpacity="0.9" />
      <rect x="102" y="96" width="4" height="4" fill={GOLD} fillOpacity="0.5" />
      <rect x="90" y="102" width="4" height="4" fill={GOLD} fillOpacity="0.8" />
      <rect x="96" y="102" width="4" height="4" fill={GOLD} fillOpacity="0.5" />
      <rect x="102" y="102" width="4" height="4" fill={GOLD} fillOpacity="0.8" />
      {/* Compass labels */}
      <text x="100" y="22" textAnchor="middle" fill={GOLD} fontSize="8" fontFamily="monospace">N</text>
      <text x="100" y="186" textAnchor="middle" fill={GOLD} fontSize="8" fontFamily="monospace">S</text>
      <text x="178" y="103" textAnchor="middle" fill={GOLD} fontSize="8" fontFamily="monospace">E</text>
      <text x="22" y="103" textAnchor="middle" fill={GOLD} fontSize="8" fontFamily="monospace">W</text>
      {/* H·P·O */}
      <text x="100" y="152" textAnchor="middle" fill={GOLD} fontSize="7" fontFamily="monospace" opacity="0.6">H·P·O</text>
    </svg>
  );
}

// ─── BOTTOM SHEET ─────────────────────────────────────────────────────────────
function BottomSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0a0d12", border: `1px solid ${GOLD_20}`, borderRadius: "16px 16px 0 0",
          padding: "28px 24px 40px", width: "100%", maxWidth: 480,
          animation: "slideUp 0.3s ease forwards",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── OVERLAY POPUP ────────────────────────────────────────────────────────────
function Overlay({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 300,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0a0d12", border: `1px solid ${GOLD_20}`, borderRadius: 12,
          padding: "28px 24px", width: "100%", maxWidth: 420,
          animation: "fadeIn 0.3s ease forwards",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── SCREEN 1: KEY PAGE ───────────────────────────────────────────────────────
function KeyPage({ onEnter }: { onEnter: (name: string, phone: string) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2600);
    return () => clearTimeout(t);
  }, []);

  const inputStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${GOLD_20}`,
    color: GOLD,
    fontSize: "0.75rem",
    fontFamily: "'JetBrains Mono', monospace",
    textAlign: "center",
    padding: "10px 0",
    width: "100%",
    outline: "none",
    letterSpacing: "0.08em",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "32px 24px",
      fontFamily: "'JetBrains Mono', monospace", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes crestFadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes breatheGlow {
          0%, 100% { box-shadow: 0 0 0px 0px rgba(176,142,80,0); }
          50% { box-shadow: 0 0 40px 12px rgba(176,142,80,0.12); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(176,142,80,0.3); }
        select { appearance: none; }
      `}</style>

      {/* Crest */}
      <div style={{ marginBottom: "32px", animation: "crestFadeIn 2.5s cubic-bezier(0.16,1,0.3,1) forwards" }}>
        <div style={{ borderRadius: "50%", animation: "breatheGlow 4s ease-in-out 2.5s infinite" }}>
          <MakoaCrest />
        </div>
      </div>

      {/* Staggered text */}
      <div style={{ textAlign: "center", width: "100%", maxWidth: 340 }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "2.6rem",
          color: GOLD,
          margin: "0 0 8px",
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.8s ease 0s, transform 0.8s ease 0s",
        }}>MĀKOA</p>

        <p style={{
          fontSize: "0.58rem",
          letterSpacing: "0.25em",
          color: "#4a3a20",
          margin: "0 0 6px",
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s",
        }}>Under the Malu</p>

        <p style={{
          fontSize: "0.5rem",
          color: "rgba(176,142,80,0.35)",
          margin: "0 0 32px",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}>🌕 Full Moon · The 72 Rises</p>

        <div style={{
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.8s ease 0.45s, transform 0.8s ease 0.45s",
          display: "grid", gap: "16px", marginBottom: "28px",
        }}>
          <div>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.45rem", letterSpacing: "0.2em", marginBottom: "6px" }}>YOUR NAME IN THE ORDER</p>
            <input
              style={inputStyle}
              placeholder="Handle name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.45rem", letterSpacing: "0.2em", marginBottom: "6px" }}>YOUR SIGNAL</p>
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
          onClick={() => onEnter(name, phone)}
          style={{
            opacity: ready ? 1 : 0,
            transition: "opacity 0.8s ease 0.6s",
            background: "transparent",
            border: `1px solid ${GOLD_40}`,
            color: GOLD,
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            padding: "13px 40px",
            cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            width: "100%",
          }}
        >
          ENTER
        </button>
      </div>

      <p style={{
        position: "absolute", bottom: "20px",
        color: "rgba(176,142,80,0.15)", fontSize: "0.42rem", letterSpacing: "0.15em",
      }}>
        Malu Trust · West Oahu · 2026
      </p>
    </div>
  );
}

// ─── SCREEN 2: GATE PAGE ──────────────────────────────────────────────────────
function GatePage({ handle, onConfirm }: { handle: string; onConfirm: () => void }) {
  const { days, hours, minutes } = useCountdown();
  const [sheet, setSheet] = useState<null | "alii" | "mana" | "nakoa">(null);
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [zip, setZip] = useState("");

  const cardStyle = (border: string): React.CSSProperties => ({
    flex: 1, background: "#0a0d12", border: `1px solid ${border}22`,
    borderRadius: 10, padding: "14px 10px", cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    transition: "border-color 0.2s",
  });

  const optBtn = (val: string, cur: string, set: (v: string) => void, color = GOLD): React.CSSProperties => ({
    background: "transparent",
    border: `1px solid ${cur === val ? color : "rgba(255,255,255,0.08)"}`,
    color: cur === val ? color : "rgba(232,224,208,0.45)",
    fontSize: "0.52rem", padding: "9px 12px", borderRadius: 6,
    cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
    width: "100%", textAlign: "left", transition: "all 0.15s",
  });

  return (
    <div style={{ background: BG_GATE, minHeight: "100vh", color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>

      {/* Hero image */}
      <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
          alt="Mākoa"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(4,6,10,0.3) 0%, rgba(4,6,10,0.85) 100%)",
        }} />
        <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, textAlign: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD, fontSize: "1.5rem", margin: "0 0 4px" }}>
            For the men who build things
          </p>
          <p style={{ fontSize: "0.45rem", color: "rgba(232,224,208,0.4)", letterSpacing: "0.2em" }}>
            Mākoa Order · Malu Trust · West Oahu
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>

        {/* Three cards */}
        <div style={{ marginTop: 28, marginBottom: 28 }}>
          <p style={{ textAlign: "center", color: "rgba(232,224,208,0.3)", fontSize: "0.48rem", letterSpacing: "0.2em", marginBottom: 14 }}>
            WHERE DO YOU STAND
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { key: "alii", label: "Network", sub: "Aliʻi", color: GOLD },
              { key: "mana", label: "Build", sub: "Mana", color: BLUE },
              { key: "nakoa", label: "Serve", sub: "Nā Koa", color: GREEN },
            ].map(c => (
              <div key={c.key} style={cardStyle(c.color)} onClick={() => setSheet(c.key as "alii" | "mana" | "nakoa")}>
                <p style={{ color: c.color, fontSize: "0.65rem", fontWeight: 600 }}>{c.label}</p>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem", letterSpacing: "0.1em" }}>{c.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The 72 Box */}
        <div style={{
          border: `1px solid ${GOLD_40}`, borderRadius: 10,
          background: "linear-gradient(135deg, #0a0d12 0%, #060810 100%)",
          padding: "20px 18px", marginBottom: 28, position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 14, right: 14,
            background: GOLD, color: "#000", fontSize: "0.4rem",
            letterSpacing: "0.15em", padding: "3px 8px", borderRadius: 3,
          }}>FOUNDING EVENT</div>

          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.48rem", marginBottom: 6 }}>🌕 Flower Moon · May 2026</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD, fontSize: "1.5rem", margin: "0 0 4px" }}>
            Mākoa 1st Roundup
          </p>
          <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.52rem", marginBottom: 8 }}>
            May 1–4 · 2026 · Kapolei · West Oahu · Embassy Suites
          </p>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.5rem", lineHeight: 1.7, marginBottom: 18 }}>
            War Room · Mastermind · Elite Training · Founding Circle.<br />
            The only event where new brothers are elevated and sworn in.
          </p>

          {/* Countdown */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {[{ label: "DAYS", val: days }, { label: "HOURS", val: hours }, { label: "MINUTES", val: minutes }].map(t => (
              <div key={t.label} style={{
                flex: 1, background: "rgba(0,0,0,0.4)", border: `1px solid ${GOLD_10}`,
                borderRadius: 6, padding: "10px 4px", textAlign: "center",
              }}>
                <p style={{ color: GOLD, fontSize: "1.3rem", fontWeight: 600, lineHeight: 1 }}>{t.val}</p>
                <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.4rem", letterSpacing: "0.15em", marginTop: 4 }}>{t.label}</p>
              </div>
            ))}
          </div>

          {/* Seat bars */}
          <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
            <SeatBar label="Aliʻi" filled={0} total={12} color="#e05c5c" openLabel="12 of 12 open" />
            <SeatBar label="Mana" filled={0} total={20} color="#f0883e" openLabel="20 of 20 open" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.5rem" }}>Nā Koa</span>
              <div style={{ flex: 1, height: 4, background: "rgba(63,185,80,0.2)", borderRadius: 2, margin: "0 10px" }}>
                <div style={{ width: "100%", height: "100%", background: "rgba(63,185,80,0.4)", borderRadius: 2 }} />
              </div>
              <span style={{ color: GREEN, fontSize: "0.45rem" }}>Day pass · FREE 4am</span>
            </div>
          </div>

          <button
            onClick={() => setPledgeOpen(true)}
            style={{
              width: "100%", background: GOLD, color: "#000",
              border: "none", padding: "13px", fontSize: "0.55rem",
              letterSpacing: "0.2em", cursor: "pointer", borderRadius: 6,
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              marginBottom: 8,
            }}
          >
            PLEDGE YOUR SEAT · MAY 1
          </button>
          <p style={{ textAlign: "center", color: "rgba(232,224,208,0.25)", fontSize: "0.45rem" }}>
            Or join our first 4am Wednesday elite training · April 15
          </p>
        </div>

        {/* Three questions */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.48rem", letterSpacing: "0.2em", marginBottom: 18 }}>
            TELL XI WHO YOU ARE
          </p>

          <div style={{ marginBottom: 18 }}>
            <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.52rem", marginBottom: 10 }}>What do you bring to a room?</p>
            {["Leadership and vision", "Skills and service", "Energy and hustle"].map(o => (
              <button key={o} style={{ ...optBtn(o, q1, setQ1), marginBottom: 6 }} onClick={() => setQ1(o)}>{o}</button>
            ))}
          </div>

          <div style={{ marginBottom: 18 }}>
            <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.52rem", marginBottom: 10 }}>What challenge are you facing?</p>
            {["Scaling what I built", "Getting the right clients", "Building my foundation"].map(o => (
              <button key={o} style={{ ...optBtn(o, q2, setQ2), marginBottom: 6 }} onClick={() => setQ2(o)}>{o}</button>
            ))}
          </div>

          <div>
            <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.52rem", marginBottom: 10 }}>Where are you?</p>
            <input
              type="text"
              placeholder="ZIP code"
              value={zip}
              onChange={e => setZip(e.target.value)}
              style={{
                background: "transparent", border: `1px solid rgba(255,255,255,0.1)`,
                color: "#e8e0d0", fontSize: "0.6rem", padding: "10px 14px",
                borderRadius: 6, width: "100%", outline: "none",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
          </div>
        </div>

        {/* Pledge tab */}
        <div
          onClick={() => setPledgeOpen(true)}
          style={{
            background: "#0a0d12", border: `1px solid rgba(83,74,183,0.3)`,
            borderRadius: 10, padding: "16px 18px", display: "flex",
            justifyContent: "space-between", alignItems: "center",
            cursor: "pointer", marginBottom: 20,
          }}
        >
          <div>
            <p style={{ color: "#e8e0d0", fontSize: "0.62rem", fontWeight: 700, marginBottom: 3 }}>The Pledge — $9.99 processing</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.48rem" }}>Understand what you are committing to →</p>
          </div>
          <span style={{ color: PURPLE, fontSize: "1.2rem" }}>›</span>
        </div>

        {/* Main CTA */}
        <button
          onClick={() => setPledgeOpen(true)}
          style={{
            width: "100%", background: GOLD, color: "#000",
            border: "none", padding: "15px", fontSize: "0.58rem",
            letterSpacing: "0.2em", cursor: "pointer", borderRadius: 6,
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            marginBottom: 28,
          }}
        >
          I STAND WITH THE ORDER
        </button>

        {/* Telegram strip */}
        <div style={{
          background: "#080b10", borderTop: `1px solid rgba(255,255,255,0.05)`,
          borderRadius: 8, padding: "14px 16px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.5rem" }}>
            Follow the 72 — updates drop on Telegram
          </p>
          <a
            href="https://t.me/makoa_order"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              border: `1px solid ${BLUE}`, color: BLUE, fontSize: "0.45rem",
              padding: "6px 12px", borderRadius: 4, textDecoration: "none",
              letterSpacing: "0.1em", whiteSpace: "nowrap",
            }}
          >
            JOIN THE SIGNAL
          </a>
        </div>
      </div>

      {/* Bottom sheets */}
      <BottomSheet open={sheet === "alii"} onClose={() => setSheet(null)}>
        <TierSheet
          eyebrow="Aliʻi · Network to Network"
          eyebrowColor={GOLD}
          headline="You already lead. This is the room that matches you."
          bring={["Leadership and vision", "Your B2B access and referrals", "Your presence at the founding council"]}
          get={["12-man founding council seat", "Zello 808 Command access", "Net-to-net B2B referral pool", "Aliʻi gear at every 72"]}
          btnLabel="THIS IS MY LEVEL"
          btnColor={GOLD}
          onSelect={() => { setSheet(null); setPledgeOpen(true); }}
        />
      </BottomSheet>

      <BottomSheet open={sheet === "mana"} onClose={() => setSheet(null)}>
        <TierSheet
          eyebrow="Mana · Build · B2B"
          eyebrowColor={BLUE}
          headline="You have the skills. This is the network that needs them."
          bring={["Trade and craft", "Ability to teach", "B2B services"]}
          get={["Brotherhood council seat", "Wednesday school and job queue", "Aliʻi War Room with 5k stone", "72 Mastermind"]}
          btnLabel="THIS IS MY LEVEL"
          btnColor={BLUE}
          onSelect={() => { setSheet(null); setPledgeOpen(true); }}
        />
      </BottomSheet>

      <BottomSheet open={sheet === "nakoa"} onClose={() => setSheet(null)}>
        <TierSheet
          eyebrow="Nā Koa · Serve"
          eyebrowColor={GREEN}
          headline="You are ready to build something worth belonging to."
          bring={["Time and hustle", "Community presence", "Hunger to grow"]}
          get={["Free 4am elite training", "Ice and sauna per cluster", "808 911 and 411 peer channels", "Service route income 80%"]}
          btnLabel="THIS IS MY LEVEL"
          btnColor={GREEN}
          onSelect={() => { setSheet(null); setPledgeOpen(true); }}
        />
      </BottomSheet>

      {/* Pledge popup */}
      <Overlay open={pledgeOpen} onClose={() => setPledgeOpen(false)}>
        <PledgePopup
          onConfirm={() => {
            console.log({
              handle,
              q1, q2, zip,
              timestamp: new Date().toISOString(),
            });
            setPledgeOpen(false);
            onConfirm();
          }}
          onClose={() => setPledgeOpen(false)}
        />
      </Overlay>
    </div>
  );
}

// ─── SEAT BAR ─────────────────────────────────────────────────────────────────
function SeatBar({ label, filled, total, color, openLabel }: { label: string; filled: number; total: number; color: string; openLabel: string }) {
  const pct = (filled / total) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.5rem", width: 40, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2 }} />
      </div>
      <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.45rem", whiteSpace: "nowrap" }}>{openLabel}</span>
    </div>
  );
}

// ─── TIER SHEET ───────────────────────────────────────────────────────────────
function TierSheet({ eyebrow, eyebrowColor, headline, bring, get, btnLabel, btnColor, onSelect }: {
  eyebrow: string; eyebrowColor: string; headline: string;
  bring: string[]; get: string[]; btnLabel: string; btnColor: string; onSelect: () => void;
}) {
  return (
    <div>
      <p style={{ color: eyebrowColor, fontSize: "0.48rem", letterSpacing: "0.2em", marginBottom: 10 }}>{eyebrow}</p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#e8e0d0", fontSize: "1.15rem", lineHeight: 1.4, marginBottom: 18 }}>{headline}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: 8 }}>YOU BRING</p>
          {bring.map(b => <p key={b} style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.5rem", marginBottom: 5, lineHeight: 1.5 }}>— {b}</p>)}
        </div>
        <div>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: 8 }}>YOU GET</p>
          {get.map(g => <p key={g} style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.5rem", marginBottom: 5, lineHeight: 1.5 }}>— {g}</p>)}
        </div>
      </div>
      <button onClick={onSelect} style={{
        width: "100%", background: "transparent", border: `1px solid ${btnColor}`,
        color: btnColor, fontSize: "0.52rem", letterSpacing: "0.2em",
        padding: "12px", cursor: "pointer", borderRadius: 6,
        fontFamily: "'JetBrains Mono', monospace",
      }}>{btnLabel}</button>
    </div>
  );
}

// ─── PLEDGE POPUP ─────────────────────────────────────────────────────────────
function PledgePopup({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <div>
      <p style={{ color: PURPLE, fontSize: "0.45rem", letterSpacing: "0.2em", marginBottom: 10 }}>The Pledge · Malu Trust</p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#e8e0d0", fontSize: "1.2rem", lineHeight: 1.4, marginBottom: 14 }}>
        Before you stand with the order — understand what you are pledging.
      </p>
      <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.52rem", lineHeight: 1.8, marginBottom: 18 }}>
        Your $9.99 pledge gets you into the May 1 Mākoa 1st Roundup — War Room for Aliʻi, Mastermind for Mana, Elite Training for Nā Koa — OR join our first 4am Wednesday elite training April 15. This pledge supports the order and covers XI daily gate monitoring. Your tier benefits and yearly dues unlock within 24 hours via Telegram. If you are not ready that is honored.
      </p>
      <div style={{
        background: "rgba(83,74,183,0.08)", border: `1px solid rgba(83,74,183,0.25)`,
        borderRadius: 8, padding: "14px", textAlign: "center", marginBottom: 20,
      }}>
        <p style={{ color: PURPLE, fontSize: "1.6rem", fontWeight: 700, lineHeight: 1 }}>$9.99</p>
        <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.48rem", marginTop: 4 }}>Processing pledge — no charge today</p>
        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.45rem", marginTop: 2 }}>Confirmed on platform in 24 hours</p>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        <button onClick={onConfirm} style={{
          background: GOLD, color: "#000", border: "none",
          padding: "13px", fontSize: "0.55rem", letterSpacing: "0.2em",
          cursor: "pointer", borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
        }}>I AM CALLED</button>
        <button onClick={onClose} style={{
          background: "transparent", border: `1px solid rgba(255,255,255,0.12)`,
          color: "rgba(232,224,208,0.4)", padding: "12px", fontSize: "0.52rem",
          letterSpacing: "0.15em", cursor: "pointer", borderRadius: 6,
          fontFamily: "'JetBrains Mono', monospace",
        }}>NOT TODAY</button>
      </div>
    </div>
  );
}

// ─── SCREEN 3: CONFIRM ────────────────────────────────────────────────────────
function ConfirmPage({ handle }: { handle: string }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "40px 24px",
      textAlign: "center", fontFamily: "'JetBrains Mono', monospace",
      animation: "fadeIn 1s ease forwards",
    }}>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
        fontSize: "2.6rem", color: GOLD, marginBottom: 16, lineHeight: 1.2,
      }}>
        ʻAe{handle ? `, ${handle}` : ""}.
      </p>
      <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.6rem", lineHeight: 1.9, maxWidth: 300, marginBottom: 12 }}>
        XI will reach you on Telegram within 24 hours.<br />
        Keep your signal open.
      </p>
      <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.45rem", letterSpacing: "0.15em", marginBottom: 40 }}>
        Under the Malu · Malu Trust · West Oahu · 2026
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD_DIM, fontSize: "0.9rem", letterSpacing: "0.1em" }}>
        Hana · Pale · Ola
      </p>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [screen, setScreen] = useState<"key" | "gate" | "confirm">("key");
  const [handle, setHandle] = useState("");

  function handleEnter(name: string, phone: string) {
    setHandle(name);
    // Store for later use
    if (typeof window !== "undefined") {
      sessionStorage.setItem("makoa_handle", name);
      sessionStorage.setItem("makoa_phone", phone);
    }
    setScreen("gate");
  }

  return (
    <>
      {screen === "key" && <KeyPage onEnter={handleEnter} />}
      {screen === "gate" && <GatePage handle={handle} onConfirm={() => setScreen("confirm")} />}
      {screen === "confirm" && <ConfirmPage handle={handle} />}
    </>
  );
}
