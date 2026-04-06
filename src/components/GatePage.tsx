"use client";

import { useState, useEffect, useRef } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const GOLD_BORDER = "rgba(176,142,80,0.25)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const PURPLE = "#534AB7";
const BG = "#04060a";
const CARD_BG = "#080b10";
const SECTION_BG = "#060810";

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
          <button onClick={onClose} style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
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

// ── Divider ────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "32px 0" }}>
      <div style={{ flex: 1, height: 1, background: "rgba(176,142,80,0.12)" }} />
      <span style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.6rem", fontFamily: "var(--font-jetbrains)" }}>✦</span>
      <div style={{ flex: 1, height: 1, background: "rgba(176,142,80,0.12)" }} />
    </div>
  );
}

// ── Section Label ──────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.28em", textAlign: "center", textTransform: "uppercase", margin: "0 0 6px" }}>
      {children}
    </p>
  );
}

// ── Tier Card ──────────────────────────────────────────────
function TierCard({ label, sub, color, onClick }: { label: string; sub: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, background: CARD_BG, border: `1px solid ${color}33`,
        borderRadius: 10, padding: "18px 8px", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = color + "88"; (e.currentTarget as HTMLButtonElement).style.background = color + "08"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = color + "33"; (e.currentTarget as HTMLButtonElement).style.background = CARD_BG; }}
    >
      <span style={{ color, fontSize: "0.65rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ color: color + "77", fontSize: "0.52rem", fontFamily: "var(--font-jetbrains)", textAlign: "center", lineHeight: 1.4 }}>{sub}</span>
    </button>
  );
}

// ── Tier Popup Contents ────────────────────────────────────
function AliiContent({ onClose, onPledge }: { onClose: () => void; onPledge: () => void }) {
  return (
    <div>
      <p style={{ color: GOLD, fontSize: "0.6rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>Aliʻi · Network to Network</p>
      <h2 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.6rem", margin: "0 0 16px", lineHeight: 1.2 }}>
        You already lead. This is the room that matches you.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <p style={{ color: GOLD_DIM, fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>You bring</p>
          {["Leadership and vision", "B2B access and referrals", "Presence at the founding council"].map((item) => (
            <p key={item} style={{ color: GOLD, fontSize: "0.68rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 6px", lineHeight: 1.5 }}>· {item}</p>
          ))}
        </div>
        <div>
          <p style={{ color: GOLD_DIM, fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>You get</p>
          {["12-man founding council seat", "Zello 808 Command access", "Net-to-net B2B referral pool", "Aliʻi gear at every 72"].map((item) => (
            <p key={item} style={{ color: GOLD, fontSize: "0.68rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 6px", lineHeight: 1.5 }}>· {item}</p>
          ))}
        </div>
      </div>
      <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", lineHeight: 1.7, margin: "0 0 18px" }}>
        Aliʻi applicants must have achieved distinction in their professional field — business, law, medicine, military, government, or philanthropy — and be recognized as a leader in their community.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={onPledge} style={{ width: "100%", background: GOLD, color: "#000", border: "none", fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", letterSpacing: "0.2em", padding: "14px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase", fontWeight: 700 }}>
          PLEDGE MY SEAT — ALIĪ
        </button>
        <button onClick={onClose} style={{ width: "100%", background: "transparent", color: GOLD_DIM, border: "1px solid rgba(176,142,80,0.2)", fontFamily: "var(--font-jetbrains)", fontSize: "0.62rem", letterSpacing: "0.1em", padding: "10px", cursor: "pointer", borderRadius: 6 }}>
          Not my level
        </button>
      </div>
    </div>
  );
}

function ManaContent({ onClose, onPledge }: { onClose: () => void; onPledge: () => void }) {
  return (
    <div>
      <p style={{ color: BLUE, fontSize: "0.6rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>Mana · Build · B2B</p>
      <h2 className="font-cormorant" style={{ fontStyle: "italic", color: BLUE, fontSize: "1.6rem", margin: "0 0 16px", lineHeight: 1.2 }}>
        You have the skills. This is the network that needs them.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <p style={{ color: BLUE + "88", fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>You bring</p>
          {["Trade and craft", "Ability to teach", "B2B services"].map((item) => (
            <p key={item} style={{ color: BLUE, fontSize: "0.68rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 6px", lineHeight: 1.5 }}>· {item}</p>
          ))}
        </div>
        <div>
          <p style={{ color: BLUE + "88", fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>You get</p>
          {["Brotherhood council seat", "Wednesday school and job queue", "Aliʻi War Room with 5k stone", "72 Mastermind"].map((item) => (
            <p key={item} style={{ color: BLUE, fontSize: "0.68rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 6px", lineHeight: 1.5 }}>· {item}</p>
          ))}
        </div>
      </div>
      <p style={{ color: "rgba(88,166,255,0.4)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", lineHeight: 1.7, margin: "0 0 18px" }}>
        Mana brothers bring their trade, craft, or professional service to the network. Every chapter house is committed to serve its region — and Mana is the engine that makes that possible.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={onPledge} style={{ width: "100%", background: BLUE, color: "#000", border: "none", fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", letterSpacing: "0.2em", padding: "14px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase", fontWeight: 700 }}>
          PLEDGE MY SEAT — MANA
        </button>
        <button onClick={onClose} style={{ width: "100%", background: "transparent", color: BLUE + "66", border: `1px solid ${BLUE}22`, fontFamily: "var(--font-jetbrains)", fontSize: "0.62rem", letterSpacing: "0.1em", padding: "10px", cursor: "pointer", borderRadius: 6 }}>
          Not my level
        </button>
      </div>
    </div>
  );
}

function NaKoaContent({ onClose, onPledge }: { onClose: () => void; onPledge: () => void }) {
  return (
    <div>
      <p style={{ color: GREEN, fontSize: "0.6rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>Nā Koa · Serve</p>
      <h2 className="font-cormorant" style={{ fontStyle: "italic", color: GREEN, fontSize: "1.6rem", margin: "0 0 16px", lineHeight: 1.2 }}>
        You are ready to build something worth belonging to.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <p style={{ color: GREEN + "88", fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>You bring</p>
          {["Time and hustle", "Community presence", "Hunger to grow"].map((item) => (
            <p key={item} style={{ color: GREEN, fontSize: "0.68rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 6px", lineHeight: 1.5 }}>· {item}</p>
          ))}
        </div>
        <div>
          <p style={{ color: GREEN + "88", fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>You get</p>
          {["Free 4am elite training", "Ice and sauna per cluster", "808 911 and 411 peer channels", "Service route income — 80%"].map((item) => (
            <p key={item} style={{ color: GREEN, fontSize: "0.68rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 6px", lineHeight: 1.5 }}>· {item}</p>
          ))}
        </div>
      </div>
      <p style={{ color: "rgba(63,185,80,0.4)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", lineHeight: 1.7, margin: "0 0 18px" }}>
        Nā Koa applicants must be 18+, in good community standing, with a record of hands-on volunteer service. Entry is open to all men of faith and good character. Service to all comes first.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={onPledge} style={{ width: "100%", background: GREEN, color: "#000", border: "none", fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", letterSpacing: "0.2em", padding: "14px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase", fontWeight: 700 }}>
          PLEDGE MY SEAT — NĀ KOA
        </button>
        <button onClick={onClose} style={{ width: "100%", background: "transparent", color: GREEN + "66", border: `1px solid ${GREEN}22`, fontFamily: "var(--font-jetbrains)", fontSize: "0.62rem", letterSpacing: "0.1em", padding: "10px", cursor: "pointer", borderRadius: 6 }}>
          Not my level
        </button>
      </div>
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
      <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.72rem", fontFamily: "var(--font-jetbrains)", lineHeight: 1.8, margin: "0 0 24px" }}>
        Your $9.99 pledge secures your seat at the May 1 Mākoa 1st Roundup — War Room for Aliʻi, Mastermind for Mana, Elite Training for Nā Koa — or our first 4am Wednesday elite training on April 15. This pledge supports the Order and covers XI daily gate monitoring. Your tier benefits and annual dues unlock within 24 hours via Telegram. If you are not ready, that is honored.
      </p>
      <div style={{ background: "rgba(83,74,183,0.1)", border: "1px solid rgba(83,74,183,0.3)", borderRadius: 10, padding: "20px", textAlign: "center", marginBottom: 24 }}>
        <p style={{ color: PURPLE, fontSize: "2rem", fontFamily: "var(--font-cormorant)", fontWeight: 600, margin: "0 0 6px" }}>$9.99</p>
        <p style={{ color: "rgba(83,74,183,0.7)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 4px" }}>Processing pledge — no charge today</p>
        <p style={{ color: "rgba(83,74,183,0.5)", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", margin: 0 }}>Confirmed on platform within 24 hours</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={onConfirm} style={{ width: "100%", background: GOLD, color: "#000", border: "none", fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", letterSpacing: "0.2em", padding: "14px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase", fontWeight: 700 }}>
          I AM CALLED
        </button>
        <button onClick={onClose} style={{ width: "100%", background: "transparent", color: GOLD_DIM, border: "1px solid rgba(176,142,80,0.25)", fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", letterSpacing: "0.15em", padding: "12px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase" }}>
          NOT TODAY
        </button>
      </div>
    </CenterOverlay>
  );
}

// ── Question Option ────────────────────────────────────────
function QOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? "rgba(176,142,80,0.08)" : CARD_BG,
        border: `1px solid ${selected ? GOLD : "rgba(176,142,80,0.18)"}`,
        color: selected ? GOLD : "rgba(176,142,80,0.45)",
        fontFamily: "var(--font-jetbrains)", fontSize: "0.68rem", letterSpacing: "0.05em",
        padding: "11px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left",
        width: "100%", transition: "all 0.15s",
      }}
    >
      {selected && <span style={{ marginRight: 8 }}>✦</span>}{label}
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

// ── Criteria Row ───────────────────────────────────────────
function CriteriaRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
      <span style={{ color: GOLD, fontSize: "0.75rem", marginTop: 1, flexShrink: 0 }}>{icon}</span>
      <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.7rem", fontFamily: "var(--font-jetbrains)", lineHeight: 1.7, margin: 0 }}>{text}</p>
    </div>
  );
}

// ── Full Moon Calendar ─────────────────────────────────────
const MOONS = [
  { name: "Flower Moon", date: "May 12, 2026", event: "Mākoa 1st Roundup · 72hr War Room", highlight: true },
  { name: "Strawberry Moon", date: "Jun 11, 2026", event: "Elite Reset Training · Chapter Houses" },
  { name: "Buck Moon", date: "Jul 10, 2026", event: "72hr Mastermind · Mana Strategy" },
  { name: "Sturgeon Moon", date: "Aug 9, 2026", event: "Service Projects · Regional Zones" },
  { name: "Harvest Moon", date: "Sep 7, 2026", event: "Aliʻi Council · Annual Appeal" },
  { name: "Hunter's Moon", date: "Oct 6, 2026", event: "Formation Orientation · New Candidates" },
];

// ── Nav ────────────────────────────────────────────────────
const NAV_ITEMS = ["Home", "About", "Regions", "Publications"];

// ── Main Gate Page ─────────────────────────────────────────
interface GatePageProps {
  handle: string;
  phone: string;
  onConfirm: () => void;
}

export default function GatePage({ handle, phone, onConfirm }: GatePageProps) {
  const { days, hours, minutes } = useCountdown();
  const [activeNav, setActiveNav] = useState("Home");
  const [sheet, setSheet] = useState<"alii" | "mana" | "nakoa" | null>(null);
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [zip, setZip] = useState("");

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    Home: useRef<HTMLDivElement>(null),
    About: useRef<HTMLDivElement>(null),
    Regions: useRef<HTMLDivElement>(null),
    Publications: useRef<HTMLDivElement>(null),
  };

  const scrollTo = (key: string) => {
    setActiveNav(key);
    sectionRefs[key]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openPledge = () => {
    if (sheet) setSheet(null);
    setPledgeOpen(true);
  };

  const handleConfirm = () => {
    const data = { handle, phone, q1, q2, zip, timestamp: new Date().toISOString() };
    console.log("🌕 Mākoa Pledge Submitted:", data);
    setPledgeOpen(false);
    onConfirm();
  };

  return (
    <div style={{ background: BG, minHeight: "100dvh", color: GOLD, overflowX: "hidden" }}>

      {/* ── STICKY NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(4,6,10,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(176,142,80,0.1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", height: 48,
      }}>
        <span className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1rem", letterSpacing: "0.04em" }}>
          Mākoa
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: activeNav === item ? GOLD : "rgba(176,142,80,0.35)",
                fontFamily: "var(--font-jetbrains)", fontSize: "0.55rem",
                letterSpacing: "0.12em", textTransform: "uppercase", padding: "6px 8px",
                borderBottom: activeNav === item ? `1px solid ${GOLD}` : "1px solid transparent",
                transition: "color 0.2s",
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          onClick={openPledge}
          style={{
            background: GOLD, color: "#000", border: "none",
            fontFamily: "var(--font-jetbrains)", fontSize: "0.52rem",
            letterSpacing: "0.12em", padding: "6px 12px", cursor: "pointer",
            borderRadius: 4, textTransform: "uppercase", fontWeight: 700,
          }}
        >
          PLEDGE
        </button>
      </nav>

      {/* ── HOME SECTION ── */}
      <div ref={sectionRefs.Home as React.RefObject<HTMLDivElement>}>

        {/* HERO */}
        <div style={{ position: "relative", width: "100%", height: 300, overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
            alt="Mākoa Brotherhood"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(4,6,10,0.45) 0%, rgba(4,6,10,0.92) 100%)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
            padding: "0 24px 32px",
          }}>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 10px" }}>
              Founded Easter Sunday · 2026
            </p>
            <h1 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "2rem", margin: "0 0 8px", textAlign: "center", lineHeight: 1.15 }}>
              For the men who build things
            </h1>
            <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.6rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.18em", margin: "0 0 22px", textAlign: "center" }}>
              Mākoa Order · Malu Trust · West Oahu
            </p>
            <button
              onClick={openPledge}
              style={{
                background: GOLD, color: "#000", border: "none",
                fontFamily: "var(--font-jetbrains)", fontSize: "0.68rem", letterSpacing: "0.2em",
                padding: "13px 32px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase", fontWeight: 700,
              }}
            >
              PLEDGE YOUR SEAT
            </button>
          </div>
        </div>

        {/* CORE VALUES STRIP */}
        <div style={{ background: SECTION_BG, borderBottom: "1px solid rgba(176,142,80,0.08)", padding: "16px 0" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 0, maxWidth: 480, margin: "0 auto", flexWrap: "wrap" }}>
            {[
              { label: "All Faiths Welcome", icon: "✦" },
              { label: "Conservative Order", icon: "⚔" },
              { label: "Service to All First", icon: "🤝" },
              { label: "Community & Brotherhood", icon: "🌕" },
            ].map(({ label, icon }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRight: "1px solid rgba(176,142,80,0.1)" }}>
                <span style={{ fontSize: "0.7rem" }}>{icon}</span>
                <span style={{ color: "rgba(176,142,80,0.45)", fontSize: "0.52rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "0 16px", maxWidth: 480, margin: "0 auto" }}>

          {/* TIER CARDS */}
          <div style={{ marginTop: 32 }}>
            <SectionLabel>Where do you stand</SectionLabel>
            <p className="font-cormorant" style={{ fontStyle: "italic", color: "rgba(176,142,80,0.6)", fontSize: "1.1rem", textAlign: "center", margin: "4px 0 16px" }}>
              Every man enters at his level
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <TierCard label="Aliʻi" sub={"Network\nto Network"} color={GOLD} onClick={() => setSheet("alii")} />
              <TierCard label="Mana" sub={"Build\nB2B"} color={BLUE} onClick={() => setSheet("mana")} />
              <TierCard label="Nā Koa" sub={"Serve\nthe Order"} color={GREEN} onClick={() => setSheet("nakoa")} />
            </div>
          </div>

          {/* THE 72 BOX */}
          <div style={{
            marginTop: 28, border: `1px solid ${GOLD_BORDER}`, borderRadius: 12,
            background: "linear-gradient(135deg, #0a0c10 0%, #060810 100%)",
            padding: "20px 18px 22px", position: "relative",
          }}>
            <div style={{
              position: "absolute", top: 14, right: 14, background: GOLD, color: "#000",
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
            <p style={{ color: "rgba(176,142,80,0.55)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 10px", letterSpacing: "0.08em" }}>
              May 1–4 · 2026 · Kapolei · West Oahu · Embassy Suites
            </p>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.65rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 20px", lineHeight: 1.7 }}>
              Aliʻi War Room · Mana Mastermind · Elite Reset Training · Founding Circle.<br />
              The only event where new brothers are elevated and sworn in under the full moon.
            </p>

            {/* Countdown */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
              {[{ label: "DAYS", val: days }, { label: "HOURS", val: hours }, { label: "MINUTES", val: minutes }].map(({ label, val }) => (
                <div key={label} style={{ flex: 1, background: "rgba(176,142,80,0.05)", border: `1px solid ${GOLD_BORDER}`, borderRadius: 8, padding: "14px 6px", textAlign: "center" }}>
                  <div style={{ color: GOLD, fontSize: "1.8rem", fontFamily: "var(--font-cormorant)", fontWeight: 600, lineHeight: 1 }}>
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

            <button
              onClick={openPledge}
              style={{
                width: "100%", background: GOLD, color: "#000", border: "none",
                fontFamily: "var(--font-jetbrains)", fontSize: "0.72rem", letterSpacing: "0.2em",
                padding: "15px", cursor: "pointer", borderRadius: 8, textTransform: "uppercase",
                marginTop: 6, fontWeight: 700,
              }}
            >
              PLEDGE YOUR SEAT · MAY 1
            </button>
            <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", textAlign: "center", margin: "10px 0 0", lineHeight: 1.5 }}>
              Or join our first 4am Wednesday elite training · April 15
            </p>
          </div>

          {/* QUESTIONS */}
          <div style={{ marginTop: 32 }}>
            <SectionLabel>Tell XI who you are</SectionLabel>
            <p className="font-cormorant" style={{ fontStyle: "italic", color: "rgba(176,142,80,0.55)", fontSize: "1rem", textAlign: "center", margin: "4px 0 20px" }}>
              XI reviews every application within 24 hours
            </p>

            <div style={{ marginBottom: 20 }}>
              <p style={{ color: "rgba(176,142,80,0.6)", fontSize: "0.68rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 10px" }}>What do you bring to a room?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Leadership and vision", "Skills and service", "Energy and hustle"].map((opt) => (
                  <QOption key={opt} label={opt} selected={q1 === opt} onClick={() => setQ1(opt)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ color: "rgba(176,142,80,0.6)", fontSize: "0.68rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 10px" }}>What challenge are you facing?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Scaling what I built", "Getting the right clients", "Building my foundation"].map((opt) => (
                  <QOption key={opt} label={opt} selected={q2 === opt} onClick={() => setQ2(opt)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <p style={{ color: "rgba(176,142,80,0.6)", fontSize: "0.68rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 10px" }}>Where are you?</p>
              <input className="gate-input" type="text" placeholder="ZIP CODE" value={zip} onChange={(e) => setZip(e.target.value)} maxLength={10} style={{ textAlign: "left", paddingLeft: 0 }} />
            </div>
          </div>

          {/* PLEDGE TAB */}
          <div
            onClick={openPledge}
            style={{
              marginTop: 24, background: CARD_BG, border: `1px solid rgba(83,74,183,0.25)`,
              borderRadius: 10, padding: "16px 18px", display: "flex",
              alignItems: "center", justifyContent: "space-between", cursor: "pointer",
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

          {/* MAIN CTA */}
          <button
            onClick={openPledge}
            style={{
              width: "100%", background: GOLD, color: "#000", border: "none",
              fontFamily: "var(--font-jetbrains)", fontSize: "0.75rem", letterSpacing: "0.2em",
              padding: "17px", cursor: "pointer", borderRadius: 8, textTransform: "uppercase",
              marginTop: 14, fontWeight: 700,
            }}
          >
            I STAND WITH THE ORDER
          </button>

          {/* TELEGRAM */}
          <div style={{
            marginTop: 20, marginBottom: 8, background: "#060810",
            border: `1px solid rgba(88,166,255,0.15)`, borderRadius: 10,
            padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", margin: 0, lineHeight: 1.5 }}>
              Follow the 72<br />
              <span style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.55rem" }}>updates drop on Telegram</span>
            </p>
            <button style={{ background: "transparent", border: `1px solid ${BLUE}55`, color: BLUE, fontFamily: "var(--font-jetbrains)", fontSize: "0.62rem", letterSpacing: "0.12em", padding: "8px 14px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase" }}>
              JOIN THE SIGNAL
            </button>
          </div>
        </div>
      </div>

      {/* ── ABOUT SECTION ── */}
      <div ref={sectionRefs.About as React.RefObject<HTMLDivElement>} style={{ marginTop: 8 }}>
        <div style={{ background: SECTION_BG, borderTop: "1px solid rgba(176,142,80,0.08)", borderBottom: "1px solid rgba(176,142,80,0.08)", padding: "40px 16px" }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>

            <SectionLabel>The Mākoa Order</SectionLabel>
            <h2 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.8rem", textAlign: "center", margin: "8px 0 24px", lineHeight: 1.2 }}>
              A Sovereign Order.<br />Born Easter Sunday, 2026.
            </h2>

            <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.72rem", fontFamily: "var(--font-jetbrains)", lineHeight: 1.9, margin: "0 0 20px" }}>
              Mākoa is a Sovereign Order founded on Easter Sunday, 2026. The pilgrimage was manifested — and the First Order of the Mākoa was sealed. Our first 72-hour gathering, the Aliʻi War Room and Mana Mastermind, takes place May 1 in Kapolei, West Oahu. Under every full moon, the Order plants, resets, and rises.
            </p>
            <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.7rem", fontFamily: "var(--font-jetbrains)", lineHeight: 1.9, margin: "0 0 28px" }}>
              Becoming a member of the Mākoa Order is an honor and a significant responsibility. The full formation process is thorough and takes 18–24 months. Every applicant is carefully reviewed by the XI Admissions Committee within 24 hours. If initially approved, the XI Formation Committee reaches out within 48 hours to connect each brother with others in his regional zone.
            </p>

            {/* Conversion pull-quote */}
            <div style={{ border: `1px solid ${GOLD_BORDER}`, borderRadius: 10, padding: "20px 18px", marginBottom: 28, background: "rgba(176,142,80,0.03)", textAlign: "center" }}>
              <p className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.3rem", margin: "0 0 10px", lineHeight: 1.3 }}>
                "The Order does not recruit. It recognizes."
              </p>
              <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", margin: 0 }}>
                — Chief Mākoa XI
              </p>
            </div>

            <GoldDivider />

            {/* ADMISSIONS */}
            <SectionLabel>Admissions Criteria</SectionLabel>
            <h3 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.2rem", margin: "8px 0 18px" }}>
              Who is called to the Order
            </h3>
            <CriteriaRow icon="✦" text="Nā Koa applicants must be 18+ males in active good standing within their community, with a demonstrated record of hands-on volunteer service and support for the Order's teachings and values." />
            <CriteriaRow icon="✦" text="Aliʻi and Mana applicants must have achieved distinction in their professional field — business, law, medicine, academics, military, government, or philanthropy — and be recognized as leaders in their field and community." />
            <CriteriaRow icon="✦" text="All faiths are welcomed. The Mākoa Order is a conservative order. Service to all comes first." />

            <GoldDivider />

            {/* SPONSORSHIP */}
            <SectionLabel>Sponsorship</SectionLabel>
            <h3 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.2rem", margin: "8px 0 18px" }}>
              How you enter the gate
            </h3>
            <CriteriaRow icon="◈" text="Applicants must be sponsored by a Nā Koa brother — or must have encountered the Mākoa crest QR code. The applicant should review all admission criteria before requesting an application." />
            <CriteriaRow icon="◈" text="Once accepted into formation, each candidate is guided through the process and encouraged to participate actively in the Order's service projects and spiritual activities." />

            <GoldDivider />

            {/* FINANCIAL */}
            <SectionLabel>Financial</SectionLabel>
            <h3 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.2rem", margin: "8px 0 18px" }}>
              Passage Fees & Annual Dues
            </h3>
            <CriteriaRow icon="◇" text="Prior to Investiture, every candidate pays an initiation fee known as Passage Fees. After investiture, Annual Dues are required." />
            <CriteriaRow icon="◇" text="Members are encouraged to contribute to the Order's Annual Appeal, which supports the defense and advancement of our projects and community commitments." />

            {/* Pledge CTA mid-page */}
            <button
              onClick={openPledge}
              style={{
                width: "100%", background: "transparent", color: GOLD,
                border: `1px solid ${GOLD_BORDER}`, fontFamily: "var(--font-jetbrains)",
                fontSize: "0.7rem", letterSpacing: "0.2em", padding: "14px",
                cursor: "pointer", borderRadius: 8, textTransform: "uppercase", marginTop: 8,
              }}
            >
              BEGIN WITH THE $9.99 PLEDGE →
            </button>

            <GoldDivider />

            {/* FORMATION */}
            <SectionLabel>Formation</SectionLabel>
            <h3 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.2rem", margin: "8px 0 18px" }}>
              The path from candidate to brother
            </h3>
            <CriteriaRow icon="⬡" text="Once approved by the XI Admissions Committee, members are required to participate in Order service projects. This begins with attendance at the 72-hour War Room and Mastermind seminar held under each full moon." />
            <CriteriaRow icon="⬡" text="During the Year of Formation, each candidate participates in the Order's service projects and spiritual activities sponsored by the Order." />
            <CriteriaRow icon="⬡" text="Formation includes lunches, receptions, and presentations hosted at regional chapter houses and partner venues — designed to integrate each brother into his zone and the wider Order." />

            <button
              onClick={openPledge}
              style={{
                width: "100%", background: GOLD, color: "#000", border: "none",
                fontFamily: "var(--font-jetbrains)", fontSize: "0.72rem", letterSpacing: "0.2em",
                padding: "15px", cursor: "pointer", borderRadius: 8, textTransform: "uppercase",
                marginTop: 16, fontWeight: 700,
              }}
            >
              I AM READY — PLEDGE NOW
            </button>
          </div>
        </div>
      </div>

      {/* ── REGIONS SECTION ── */}
      <div ref={sectionRefs.Regions as React.RefObject<HTMLDivElement>}>
        <div style={{ padding: "40px 16px", maxWidth: 480, margin: "0 auto" }}>
          <SectionLabel>Regions</SectionLabel>
          <h2 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.8rem", textAlign: "center", margin: "8px 0 8px", lineHeight: 1.2 }}>
            Easter 2026 · The Call Goes Out
          </h2>
          <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", textAlign: "center", margin: "0 0 28px", letterSpacing: "0.1em" }}>
            Each chapter house is committed to serve its region
          </p>

          {[
            { region: "West Oahu", status: "FOUNDING", color: GOLD, desc: "Kapolei · Ewa · Waianae · Pearl City — Home of the First Order. The 72 begins here." },
            { region: "East Oahu", status: "FORMING", color: BLUE, desc: "Honolulu · Kailua · Hawaii Kai — Regional zone forming. Brothers being identified." },
            { region: "Maui Nui", status: "FORMING", color: BLUE, desc: "Maui · Molokai · Lanai — Island chapter in early formation. Seeking founding Aliʻi." },
            { region: "Big Island", status: "OPEN", color: GREEN, desc: "Hilo · Kona · Waimea — Open for Nā Koa entry. Regional Aliʻi seat available." },
            { region: "Mainland West", status: "OPEN", color: GREEN, desc: "California · Nevada · Arizona — Distance brothers welcome. Zello 808 Command active." },
          ].map(({ region, status, color, desc }) => (
            <div key={region} style={{
              background: CARD_BG, border: `1px solid ${color}22`,
              borderRadius: 10, padding: "16px 16px", marginBottom: 12,
              display: "flex", gap: 14, alignItems: "flex-start",
            }}>
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}88` }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color: GOLD, fontSize: "0.75rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.08em" }}>{region}</span>
                  <span style={{ color, fontSize: "0.5rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", border: `1px solid ${color}44`, padding: "2px 7px", borderRadius: 3 }}>{status}</span>
                </div>
                <p style={{ color: "rgba(176,142,80,0.45)", fontSize: "0.65rem", fontFamily: "var(--font-jetbrains)", margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 20, background: "rgba(176,142,80,0.04)", border: `1px solid ${GOLD_BORDER}`, borderRadius: 10, padding: "18px 16px", textAlign: "center" }}>
            <p className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.1rem", margin: "0 0 8px" }}>
              Don't see your region?
            </p>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.65rem", fontFamily: "var(--font-jetbrains)", margin: "0 0 14px", lineHeight: 1.6 }}>
              Pledge your seat and XI will place you in the nearest active zone. New chapters open under each full moon.
            </p>
            <button
              onClick={openPledge}
              style={{
                background: GOLD, color: "#000", border: "none",
                fontFamily: "var(--font-jetbrains)", fontSize: "0.65rem", letterSpacing: "0.18em",
                padding: "12px 28px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase", fontWeight: 700,
              }}
            >
              CLAIM YOUR REGION
            </button>
          </div>
        </div>
      </div>

      {/* ── PUBLICATIONS SECTION ── */}
      <div ref={sectionRefs.Publications as React.RefObject<HTMLDivElement>}>
        <div style={{ background: SECTION_BG, borderTop: "1px solid rgba(176,142,80,0.08)", padding: "40px 16px 48px" }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <SectionLabel>Publications</SectionLabel>
            <h2 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.8rem", textAlign: "center", margin: "8px 0 6px", lineHeight: 1.2 }}>
              Full Moon Calendar · 2026
            </h2>
            <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.6rem", fontFamily: "var(--font-jetbrains)", textAlign: "center", margin: "0 0 28px", letterSpacing: "0.12em" }}>
              Monthly elite Mākoa training · Every full moon · 72 hours
            </p>

            {MOONS.map(({ name, date, event, highlight }) => (
              <div
                key={name}
                style={{
                  background: highlight ? "rgba(176,142,80,0.06)" : CARD_BG,
                  border: `1px solid ${highlight ? GOLD_BORDER : "rgba(176,142,80,0.1)"}`,
                  borderRadius: 10, padding: "14px 16px", marginBottom: 10,
                  display: "flex", gap: 14, alignItems: "center",
                }}
              >
                <div style={{ textAlign: "center", flexShrink: 0, width: 36 }}>
                  <div style={{ fontSize: highlight ? "1.2rem" : "0.9rem" }}>🌕</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ color: highlight ? GOLD : "rgba(176,142,80,0.7)", fontSize: "0.72rem", fontFamily: "var(--font-jetbrains)", fontWeight: highlight ? 600 : 400 }}>{name}</span>
                    <span style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)" }}>{date}</span>
                  </div>
                  <p style={{ color: highlight ? "rgba(176,142,80,0.7)" : "rgba(176,142,80,0.4)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", margin: 0, lineHeight: 1.5 }}>{event}</p>
                  {highlight && (
                    <p style={{ color: GOLD, fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", margin: "6px 0 0", letterSpacing: "0.1em" }}>← FOUNDING EVENT · PLEDGE NOW</p>
                  )}
                </div>
              </div>
            ))}

            <div style={{ marginTop: 24, padding: "20px 16px", background: "rgba(176,142,80,0.03)", border: `1px solid ${GOLD_BORDER}`, borderRadius: 10 }}>
              <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.65rem", fontFamily: "var(--font-jetbrains)", lineHeight: 1.8, margin: "0 0 16px" }}>
                Every chapter house hosts weekly elite Mākoa training — 4am, Wednesday mornings. The 72-hour full moon gathering is the heartbeat of the Order: we plant, reset, and rise together. Publications and event updates are distributed exclusively via Telegram to active members.
              </p>
              <button
                onClick={openPledge}
                style={{
                  width: "100%", background: GOLD, color: "#000", border: "none",
                  fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", letterSpacing: "0.2em",
                  padding: "14px", cursor: "pointer", borderRadius: 8, textTransform: "uppercase", fontWeight: 700,
                }}
              >
                JOIN THE ORDER · ACCESS ALL EVENTS
              </button>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 40, textAlign: "center" }}>
              <p className="font-cormorant" style={{ fontStyle: "italic", color: "rgba(176,142,80,0.25)", fontSize: "1rem", margin: "0 0 6px" }}>
                Hana · Pale · Ola
              </p>
              <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.52rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.18em", margin: 0 }}>
                Malu Trust · West Oahu · 2026 · All Faiths · Service First
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SHEETS ── */}
      <BottomSheet open={sheet === "alii"} onClose={() => setSheet(null)}>
        <AliiContent onClose={() => setSheet(null)} onPledge={openPledge} />
      </BottomSheet>
      <BottomSheet open={sheet === "mana"} onClose={() => setSheet(null)}>
        <ManaContent onClose={() => setSheet(null)} onPledge={openPledge} />
      </BottomSheet>
      <BottomSheet open={sheet === "nakoa"} onClose={() => setSheet(null)}>
        <NaKoaContent onClose={() => setSheet(null)} onPledge={openPledge} />
      </BottomSheet>

      {/* ── PLEDGE POPUP ── */}
      <PledgePopup open={pledgeOpen} onClose={() => setPledgeOpen(false)} onConfirm={handleConfirm} />
    </div>
  );
}
