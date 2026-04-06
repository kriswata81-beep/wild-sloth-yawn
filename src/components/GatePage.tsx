"use client";

import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const GOLD_BORDER = "rgba(176,142,80,0.25)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const PURPLE = "#534AB7";
const BG = "#04060a";
const CARD_BG = "#080b10";

// ── Countdown ──────────────────────────────────────────────
function useCountdown() {
  const target = new Date("2026-05-01T18:00:00-10:00").getTime();
  const calc = () => {
    const diff = target - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return { days, hours, minutes };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 60000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ── Bottom Sheet ───────────────────────────────────────────
function BottomSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet-panel anim-slide-up" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "1.2rem" }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Center Overlay ─────────────────────────────────────────
function CenterOverlay({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="center-overlay" onClick={onClose}>
      <div className="center-panel anim-fade-in-scale" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ── Tier Card ──────────────────────────────────────────────
function TierCard({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        background: CARD_BG,
        border: `1px solid ${color}33`,
        borderRadius: 10,
        padding: "16px 8px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = color + "88"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = color + "33"; }}
    >
      <span style={{ color, fontSize: "0.65rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ color: color + "99", fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)" }}>tap to open</span>
    </button>
  );
}

// ── Popup Content ──────────────────────────────────────────
function AliiContent({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <p style={{ color: GOLD, fontSize: "0.6rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>
        Aliʻi · Network to Network
      </p>
      <h2 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.6rem", margin: "0 0 16px", lineHeight: 1.2 }}>
        You already lead. This is the room that matches you.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <p style={{ color: GOLD_DIM, fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>You bring</p>
          {["Leadership and vision", "Your B2B access and referrals", "Your presence at the founding council"].map((item) => (
            <p key={item} style={{ color: GOLD, fontSize: "0.7rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 6px" }}>· {item}</p>
          ))}
        </div>
        <div>
          <p style={{ color: GOLD_DIM, fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>You get</p>
          {["12-man founding council seat", "Zello 808 Command access", "Net-to-net B2B referral pool", "Aliʻi gear at every 72"].map((item) => (
            <p key={item} style={{ color: GOLD, fontSize: "0.7rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 6px" }}>· {item}</p>
          ))}
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          width: "100%", background: GOLD, color: "#000", border: "none",
          fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", letterSpacing: "0.2em",
          padding: "14px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase",
        }}
      >
        THIS IS MY LEVEL
      </button>
    </div>
  );
}

function ManaContent({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <p style={{ color: BLUE, fontSize: "0.6rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>
        Mana · Build · B2B
      </p>
      <h2 className="font-cormorant" style={{ fontStyle: "italic", color: BLUE, fontSize: "1.6rem", margin: "0 0 16px", lineHeight: 1.2 }}>
        You have the skills. This is the network that needs them.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <p style={{ color: BLUE + "88", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>You bring</p>
          {["Trade and craft", "Ability to teach", "B2B services"].map((item) => (
            <p key={item} style={{ color: BLUE, fontSize: "0.7rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 6px" }}>· {item}</p>
          ))}
        </div>
        <div>
          <p style={{ color: BLUE + "88", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>You get</p>
          {["Brotherhood council seat", "Wednesday school and job queue", "Aliʻi War Room with 5k stone", "72 Mastermind"].map((item) => (
            <p key={item} style={{ color: BLUE, fontSize: "0.7rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 6px" }}>· {item}</p>
          ))}
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          width: "100%", background: BLUE, color: "#000", border: "none",
          fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", letterSpacing: "0.2em",
          padding: "14px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase",
        }}
      >
        THIS IS MY LEVEL
      </button>
    </div>
  );
}

function NaKoaContent({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <p style={{ color: GREEN, fontSize: "0.6rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>
        Nā Koa · Serve
      </p>
      <h2 className="font-cormorant" style={{ fontStyle: "italic", color: GREEN, fontSize: "1.6rem", margin: "0 0 16px", lineHeight: 1.2 }}>
        You are ready to build something worth belonging to.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <p style={{ color: GREEN + "88", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>You bring</p>
          {["Time and hustle", "Community presence", "Hunger to grow"].map((item) => (
            <p key={item} style={{ color: GREEN, fontSize: "0.7rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 6px" }}>· {item}</p>
          ))}
        </div>
        <div>
          <p style={{ color: GREEN + "88", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>You get</p>
          {["Free 4am elite training", "Ice and sauna per cluster", "808 911 and 411 peer channels", "Service route income 80 percent"].map((item) => (
            <p key={item} style={{ color: GREEN, fontSize: "0.7rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 6px" }}>· {item}</p>
          ))}
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          width: "100%", background: GREEN, color: "#000", border: "none",
          fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", letterSpacing: "0.2em",
          padding: "14px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase",
        }}
      >
        THIS IS MY LEVEL
      </button>
    </div>
  );
}

// ── Pledge Popup ───────────────────────────────────────────
function PledgePopup({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <CenterOverlay open={open} onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
      </div>
      <p style={{ color: PURPLE, fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>
        The Pledge · Malu Trust
      </p>
      <h2 className="font-cormorant" style={{ fontStyle: "italic", color: "#e8e0d0", fontSize: "1.5rem", margin: "0 0 16px", lineHeight: 1.25 }}>
        Before you stand with the order — understand what you are pledging.
      </h2>
      <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.72rem", fontFamily: "var(--font-jetbrains)", lineHeight: 1.7, margin: "0 0 24px" }}>
        Your $9.99 pledge gets you into the May 1 Mākoa 1st Roundup — War Room for Aliʻi, Mastermind for Mana, Elite Training for Nā Koa — OR join our first 4am Wednesday elite training April 15. This pledge supports the order and covers XI daily gate monitoring. Your tier benefits and yearly dues unlock within 24 hours via Telegram. If you are not ready that is honored.
      </p>
      <div style={{
        background: "rgba(83,74,183,0.1)", border: "1px solid rgba(83,74,183,0.3)",
        borderRadius: 10, padding: "20px", textAlign: "center", marginBottom: 24,
      }}>
        <p style={{ color: PURPLE, fontSize: "2rem", fontFamily: "var(--font-cormorant)", fontWeight: 600, margin: "0 0 6px" }}>$9.99</p>
        <p style={{ color: "rgba(83,74,183,0.7)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 4px" }}>Processing pledge — no charge today</p>
        <p style={{ color: "rgba(83,74,183,0.5)", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", margin: 0 }}>Confirmed on platform in 24 hours</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={onConfirm}
          style={{
            width: "100%", background: GOLD, color: "#000", border: "none",
            fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", letterSpacing: "0.2em",
            padding: "14px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase",
          }}
        >
          I AM CALLED
        </button>
        <button
          onClick={onClose}
          style={{
            width: "100%", background: "transparent", color: GOLD_DIM,
            border: "1px solid rgba(176,142,80,0.25)",
            fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", letterSpacing: "0.15em",
            padding: "12px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase",
          }}
        >
          NOT TODAY
        </button>
      </div>
    </CenterOverlay>
  );
}

// ── Question Option Button ─────────────────────────────────
function QOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? "rgba(176,142,80,0.08)" : CARD_BG,
        border: `1px solid ${selected ? GOLD : "rgba(176,142,80,0.2)"}`,
        color: selected ? GOLD : "rgba(176,142,80,0.5)",
        fontFamily: "var(--font-jetbrains)",
        fontSize: "0.68rem",
        letterSpacing: "0.05em",
        padding: "10px 12px",
        borderRadius: 8,
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

// ── Seat Bar ───────────────────────────────────────────────
function SeatBar({ label, filled, total, color, note }: { label: string; filled: number; total: number; color: string; note?: string }) {
  const pct = total > 0 ? (filled / total) * 100 : 100;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: GOLD, fontSize: "0.65rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.1em" }}>{label}</span>
        <span style={{ color: note ? color : "rgba(176,142,80,0.5)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)" }}>
          {note || `${total - filled} of ${total} open`}
        </span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

// ── Main Gate Page ─────────────────────────────────────────
interface GatePageProps {
  handle: string;
  phone: string;
  onConfirm: () => void;
}

export default function GatePage({ handle, phone, onConfirm }: GatePageProps) {
  const { days, hours, minutes } = useCountdown();
  const [sheet, setSheet] = useState<"alii" | "mana" | "nakoa" | null>(null);
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [zip, setZip] = useState("");

  const handleConfirm = () => {
    const data = {
      handle,
      phone,
      q1,
      q2,
      zip,
      timestamp: new Date().toISOString(),
    };
    console.log("🌕 Mākoa Pledge Submitted:", data);
    setPledgeOpen(false);
    onConfirm();
  };

  return (
    <div style={{ background: BG, minHeight: "100dvh", color: GOLD, overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <div style={{ position: "relative", width: "100%", height: 260, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
          alt="Mākoa Brotherhood"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(4,6,10,0.3) 0%, rgba(4,6,10,0.85) 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
          padding: "0 20px 28px",
        }}>
          <h1 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.7rem", margin: "0 0 6px", textAlign: "center", lineHeight: 1.2 }}>
            For the men who build things
          </h1>
          <p style={{ color: "rgba(176,142,80,0.45)", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.2em", margin: 0, textAlign: "center" }}>
            Mākoa Order · Malu Trust · West Oahu
          </p>
        </div>
      </div>

      <div style={{ padding: "0 16px", maxWidth: 480, margin: "0 auto" }}>

        {/* ── TIER CARDS ── */}
        <div style={{ marginTop: 32 }}>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.2em", textAlign: "center", textTransform: "uppercase", margin: "0 0 14px" }}>
            Where do you stand
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <TierCard label="Network" color={GOLD} onClick={() => setSheet("alii")} />
            <TierCard label="Build" color={BLUE} onClick={() => setSheet("mana")} />
            <TierCard label="Serve" color={GREEN} onClick={() => setSheet("nakoa")} />
          </div>
        </div>

        {/* ── THE 72 BOX ── */}
        <div style={{
          marginTop: 28,
          border: `1px solid ${GOLD_BORDER}`,
          borderRadius: 12,
          background: "linear-gradient(135deg, #0a0c10 0%, #060810 100%)",
          padding: "20px 18px 22px",
          position: "relative",
        }}>
          {/* Badge */}
          <div style={{
            position: "absolute", top: 14, right: 14,
            background: GOLD, color: "#000",
            fontSize: "0.5rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em",
            padding: "3px 8px", borderRadius: 3, textTransform: "uppercase",
          }}>
            FOUNDING EVENT
          </div>

          <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 8px" }}>
            🌕 Flower Moon · May 2026
          </p>
          <h2 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.5rem", margin: "0 0 6px", lineHeight: 1.2 }}>
            Mākoa 1st Roundup
          </h2>
          <p style={{ color: "rgba(176,142,80,0.55)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 14px", letterSpacing: "0.08em" }}>
            May 1–4 · 2026 · Kapolei · West Oahu · Embassy Suites
          </p>
          <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.65rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 20px", lineHeight: 1.6 }}>
            War Room · Mastermind · Elite Training · Founding Circle.<br />
            The only event where new brothers are elevated and sworn in.
          </p>

          {/* Countdown */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
            {[{ label: "DAYS", val: days }, { label: "HOURS", val: hours }, { label: "MINUTES", val: minutes }].map(({ label, val }) => (
              <div key={label} style={{
                flex: 1, background: "rgba(176,142,80,0.05)", border: `1px solid ${GOLD_BORDER}`,
                borderRadius: 8, padding: "12px 6px", textAlign: "center",
              }}>
                <div style={{ color: GOLD, fontSize: "1.6rem", fontFamily: "var(--font-cormorant)", fontWeight: 600, lineHeight: 1 }}>
                  {String(val).padStart(2, "0")}
                </div>
                <div style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.5rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", marginTop: 4 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Seat Bars */}
          <SeatBar label="Aliʻi" filled={0} total={12} color="#ef4444" />
          <SeatBar label="Mana" filled={0} total={20} color="#f59e0b" />
          <SeatBar label="Nā Koa" filled={20} total={20} color={GREEN + "55"} note="Day pass · FREE 4am training" />

          {/* CTA */}
          <button
            onClick={() => setPledgeOpen(true)}
            style={{
              width: "100%", background: GOLD, color: "#000", border: "none",
              fontFamily: "var(--font-jetbrains)", fontSize: "0.72rem", letterSpacing: "0.2em",
              padding: "15px", cursor: "pointer", borderRadius: 8, textTransform: "uppercase",
              marginTop: 6, fontWeight: 600,
            }}
          >
            PLEDGE YOUR SEAT · MAY 1
          </button>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", textAlign: "center", margin: "10px 0 0", lineHeight: 1.5 }}>
            Or join our first 4am Wednesday elite training · April 15
          </p>
        </div>

        {/* ── THREE QUESTIONS ── */}
        <div style={{ marginTop: 28 }}>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.2em", textAlign: "center", textTransform: "uppercase", margin: "0 0 20px" }}>
            Tell XI who you are
          </p>

          {/* Q1 */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: "rgba(176,142,80,0.6)", fontSize: "0.68rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 10px" }}>
              What do you bring to a room?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Leadership and vision", "Skills and service", "Energy and hustle"].map((opt) => (
                <QOption key={opt} label={opt} selected={q1 === opt} onClick={() => setQ1(opt)} />
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: "rgba(176,142,80,0.6)", fontSize: "0.68rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 10px" }}>
              What challenge are you facing?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Scaling what I built", "Getting the right clients", "Building my foundation"].map((opt) => (
                <QOption key={opt} label={opt} selected={q2 === opt} onClick={() => setQ2(opt)} />
              ))}
            </div>
          </div>

          {/* Q3 */}
          <div style={{ marginBottom: 8 }}>
            <p style={{ color: "rgba(176,142,80,0.6)", fontSize: "0.68rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 10px" }}>
              Where are you?
            </p>
            <input
              className="gate-input"
              type="text"
              placeholder="ZIP CODE"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              maxLength={10}
              style={{ textAlign: "left", paddingLeft: 0 }}
            />
          </div>
        </div>

        {/* ── PLEDGE TAB ── */}
        <div
          onClick={() => setPledgeOpen(true)}
          style={{
            marginTop: 24,
            background: CARD_BG,
            border: `1px solid rgba(83,74,183,0.25)`,
            borderRadius: 10,
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <div>
            <p style={{ color: "#e8e0d0", fontSize: "0.8rem", fontFamily: "var(--font-jetbrains)", fontWeight: 600, margin: "0 0 4px" }}>
              The Pledge — $9.99 processing
            </p>
            <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", margin: 0 }}>
              Understand what you are committing to →
            </p>
          </div>
          <span style={{ color: PURPLE, fontSize: "1.4rem", fontFamily: "var(--font-cormorant)" }}>›</span>
        </div>

        {/* ── MAIN CTA ── */}
        <button
          onClick={() => setPledgeOpen(true)}
          style={{
            width: "100%", background: GOLD, color: "#000", border: "none",
            fontFamily: "var(--font-jetbrains)", fontSize: "0.75rem", letterSpacing: "0.2em",
            padding: "17px", cursor: "pointer", borderRadius: 8, textTransform: "uppercase",
            marginTop: 16, fontWeight: 700,
          }}
        >
          I STAND WITH THE ORDER
        </button>

        {/* ── TELEGRAM STRIP ── */}
        <div style={{
          marginTop: 24,
          marginBottom: 32,
          background: "#060810",
          border: `1px solid rgba(88,166,255,0.15)`,
          borderRadius: 10,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", margin: 0, lineHeight: 1.5 }}>
            Follow the 72<br />
            <span style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.55rem" }}>updates drop on Telegram</span>
          </p>
          <button
            style={{
              background: "transparent", border: `1px solid ${BLUE}55`,
              color: BLUE, fontFamily: "var(--font-jetbrains)", fontSize: "0.62rem",
              letterSpacing: "0.12em", padding: "8px 14px", cursor: "pointer", borderRadius: 6,
              textTransform: "uppercase",
            }}
          >
            JOIN THE SIGNAL
          </button>
        </div>

      </div>

      {/* ── BOTTOM SHEETS ── */}
      <BottomSheet open={sheet === "alii"} onClose={() => setSheet(null)}>
        <AliiContent onClose={() => setSheet(null)} />
      </BottomSheet>
      <BottomSheet open={sheet === "mana"} onClose={() => setSheet(null)}>
        <ManaContent onClose={() => setSheet(null)} />
      </BottomSheet>
      <BottomSheet open={sheet === "nakoa"} onClose={() => setSheet(null)}>
        <NaKoaContent onClose={() => setSheet(null)} />
      </BottomSheet>

      {/* ── PLEDGE POPUP ── */}
      <PledgePopup open={pledgeOpen} onClose={() => setPledgeOpen(false)} onConfirm={handleConfirm} />
    </div>
  );
}
