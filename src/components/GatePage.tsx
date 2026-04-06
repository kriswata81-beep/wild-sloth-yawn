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

// ── Scroll tracker ─────────────────────────────────────────
function useScrolled(threshold = 400) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

// ── Star field background ──────────────────────────────────
function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.3,
    opacity: Math.random() * 0.25 + 0.05,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: GOLD,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

// ── Moon glow orb ──────────────────────────────────────────
function MoonGlow({ top, opacity = 0.06 }: { top: number | string; opacity?: number }) {
  return (
    <div style={{
      position: "absolute", left: "50%", top,
      transform: "translateX(-50%)",
      width: 320, height: 320, borderRadius: "50%",
      background: `radial-gradient(circle, rgba(176,142,80,${opacity}) 0%, transparent 70%)`,
      pointerEvents: "none", zIndex: 0,
    }} />
  );
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
        flex: 1, background: "#080c10", border: "0.5px solid #141820",
        borderRadius: 6, padding: "12px 6px", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = color + "50"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#141820"; }}
    >
      <span className="font-cormorant" style={{ fontStyle: "italic", fontSize: "1rem", color, marginBottom: 2 }}>{label}</span>
      <span style={{ color: color + "60", fontSize: "0.46rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.1em" }}>{sub} →</span>
    </button>
  );
}

// ── Tier Popup Contents ────────────────────────────────────
function AliiContent({ onClose, onPledge }: { onClose: () => void; onPledge: () => void }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, fontFamily: "var(--font-jetbrains)" }}>Aliʻi · Network to Network</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a4a4a", cursor: "pointer", fontSize: 14 }}>✕</button>
      </div>
      <div className="font-cormorant" style={{ fontStyle: "italic", fontWeight: 300, fontSize: "1.15rem", color: "#ede8e0", lineHeight: 1.5, marginBottom: 14, whiteSpace: "pre-line" }}>
        {"You already lead.\nThis is the room that matches you."}
      </div>
      <div style={{ fontSize: "0.62rem", color: "#6a7080", lineHeight: 2, whiteSpace: "pre-line", marginBottom: 16, fontFamily: "var(--font-jetbrains)" }}>
        {"You bring your network, your word, and your B2B access.\nYou get 11 men who run at your level — and a seat that no money alone can buy.\n\nAliʻi are selected by the council.\nYour application opens when a seat does."}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={onPledge} style={{ width: "100%", background: GOLD, border: "none", color: "#000", padding: "11px", borderRadius: 4, fontFamily: "var(--font-jetbrains)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
          This is my level
        </button>
        <button onClick={onClose} style={{ width: "100%", background: "transparent", color: GOLD_DIM, border: "1px solid rgba(176,142,80,0.2)", fontFamily: "var(--font-jetbrains)", fontSize: "0.58rem", letterSpacing: "0.1em", padding: "9px", cursor: "pointer", borderRadius: 4 }}>
          Not my level
        </button>
      </div>
    </div>
  );
}

function ManaContent({ onClose, onPledge }: { onClose: () => void; onPledge: () => void }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: BLUE, fontFamily: "var(--font-jetbrains)" }}>Mana · Build · B2B + B2C</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a4a4a", cursor: "pointer", fontSize: 14 }}>✕</button>
      </div>
      <div className="font-cormorant" style={{ fontStyle: "italic", fontWeight: 300, fontSize: "1.15rem", color: "#ede8e0", lineHeight: 1.5, marginBottom: 14, whiteSpace: "pre-line" }}>
        {"You have the skill.\nThis is the network that needs it."}
      </div>
      <div style={{ fontSize: "0.62rem", color: "#6a7080", lineHeight: 2, whiteSpace: "pre-line", marginBottom: 16, fontFamily: "var(--font-jetbrains)" }}>
        {"You bring your trade, your craft, your ability to teach.\nYou get the Wednesday school, the job queue, the B2B pipeline — and brothers who show up when the job calls.\n\nMana run the services.\nMana teach the army.\nMana build the order from the inside."}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={onPledge} style={{ width: "100%", background: BLUE, border: "none", color: "#000", padding: "11px", borderRadius: 4, fontFamily: "var(--font-jetbrains)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
          This is my level
        </button>
        <button onClick={onClose} style={{ width: "100%", background: "transparent", color: BLUE + "66", border: `1px solid ${BLUE}22`, fontFamily: "var(--font-jetbrains)", fontSize: "0.58rem", letterSpacing: "0.1em", padding: "9px", cursor: "pointer", borderRadius: 4 }}>
          Not my level
        </button>
      </div>
    </div>
  );
}

function NaKoaContent({ onClose, onPledge }: { onClose: () => void; onPledge: () => void }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: GREEN, fontFamily: "var(--font-jetbrains)" }}>Nā Koa · Serve · Peer 2 Peer</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a4a4a", cursor: "pointer", fontSize: 14 }}>✕</button>
      </div>
      <div className="font-cormorant" style={{ fontStyle: "italic", fontWeight: 300, fontSize: "1.15rem", color: "#ede8e0", lineHeight: 1.5, marginBottom: 14 }}>
        You are ready to earn your place.
      </div>
      <div style={{ fontSize: "0.62rem", color: "#6a7080", lineHeight: 2, whiteSpace: "pre-line", marginBottom: 16, fontFamily: "var(--font-jetbrains)" }}>
        {"You bring your time, your community, and your willingness to show up at 4am when most men are still asleep.\nYou get the training, the service routes, the 808 network — and a clear path to Mana when the seat opens.\n\nEvery Aliʻi was once a Nā Koa.\nThe order watches who shows up."}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={onPledge} style={{ width: "100%", background: GREEN, border: "none", color: "#000", padding: "11px", borderRadius: 4, fontFamily: "var(--font-jetbrains)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
          This is my level
        </button>
        <button onClick={onClose} style={{ width: "100%", background: "transparent", color: GREEN + "66", border: `1px solid ${GREEN}22`, fontFamily: "var(--font-jetbrains)", fontSize: "0.58rem", letterSpacing: "0.1em", padding: "9px", cursor: "pointer", borderRadius: 4 }}>
          Not my level
        </button>
      </div>
    </div>
  );
}

// ── Seat counters ──────────────────────────────────────────
const SEAT_TOTALS = { alii: 12, mana: 20, nakoa: 72 };
const SEAT_TAKEN = { alii: 0, mana: 0, nakoa: 0 };

// ── Pledge Popup ───────────────────────────────────────────
function PledgePopup({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <CenterOverlay open={open} onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
      </div>
      <p style={{ color: PURPLE, fontSize: "0.5rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>
        The Pledge · Malu Trust
      </p>
      <div className="font-cormorant" style={{ fontStyle: "italic", fontSize: "1.05rem", color: "#ede8e0", lineHeight: 1.5, marginBottom: 14 }}>
        Before you stand with the order — understand what you are pledging.
      </div>
      <div style={{ fontSize: "0.6rem", color: "#6a7080", lineHeight: 1.9, marginBottom: 16, fontFamily: "var(--font-jetbrains)" }}>
        Your $9.99 pledge gets you into the May 1 Mākoa 1st Roundup — War Room for Aliʻi, Mastermind for Mana, Elite Training for Nā Koa — OR join our first 4am Wednesday elite training on April 15.
        <br /><br />
        This pledge supports the order and covers XI daily gate monitoring. Your formation path and financial commitment are revealed after acceptance within 24 hours via Telegram.
        <br /><br />
        The order does not chase men.<br />
        If you are not called — that is honored.<br />
        Come back when you are ready.
      </div>
      <div style={{ background: "#0a0c14", border: "0.5px solid #21262d", borderRadius: 6, padding: "12px", textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: "1.3rem", fontWeight: 700, color: PURPLE, fontFamily: "var(--font-cormorant)" }}>$9.99</div>
        <div style={{ fontSize: "0.5rem", color: "#4a5060", lineHeight: 1.6, marginTop: 3, fontFamily: "var(--font-jetbrains)" }}>
          Processing pledge — no charge today<br />Formation path revealed after acceptance
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <button onClick={onConfirm} style={{ background: GOLD, border: "none", color: "#000", padding: "11px", borderRadius: 4, fontFamily: "var(--font-jetbrains)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer" }}>
          I am called
        </button>
        <button
          onClick={onClose}
          style={{ background: "transparent", border: "0.5px solid #21262d", color: "#4a5060", padding: "11px", borderRadius: 4, fontFamily: "var(--font-jetbrains)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#f8514940"; (e.currentTarget as HTMLButtonElement).style.color = "#f85149"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#21262d"; (e.currentTarget as HTMLButtonElement).style.color = "#4a5060"; }}
        >
          Not today
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
        background: selected ? "#0a0e14" : "#080c10",
        border: `0.5px solid ${selected ? "#b08e5055" : "#141820"}`,
        borderRadius: 4, padding: "8px 10px", fontSize: "0.58rem",
        color: selected ? GOLD : "#4a5060",
        fontFamily: "var(--font-jetbrains)", cursor: "pointer",
        display: "block", width: "100%", textAlign: "left",
        marginBottom: 4, transition: "all 0.15s",
      }}
    >
      → {label}
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
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
      <span style={{ color: GOLD, fontSize: "0.75rem", marginTop: 1, flexShrink: 0 }}>{icon}</span>
      <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.7rem", fontFamily: "var(--font-jetbrains)", lineHeight: 1.75, margin: 0 }}>{text}</p>
    </div>
  );
}

// ── Why Now Block ──────────────────────────────────────────
function WhyNowBlock({ onPledge }: { onPledge: () => void }) {
  return (
    <div style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, #07090e 0%, #04060a 100%)",
      border: `1px solid rgba(176,142,80,0.18)`,
      borderRadius: 12, padding: "24px 18px", marginTop: 28,
    }}>
      <MoonGlow top={-60} opacity={0.08} />
      <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 10px", position: "relative", zIndex: 1 }}>
        Why now
      </p>
      <h3 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.4rem", margin: "0 0 16px", lineHeight: 1.25, position: "relative", zIndex: 1 }}>
        The founding seat is the only seat that carries the full weight of the Order.
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20, position: "relative", zIndex: 1 }}>
        {[
          { icon: "🌕", text: "The Flower Moon rises May 1. The 72 begins May 1. There is no second founding." },
          { icon: "⚔", text: "Aliʻi seats are capped at 12. Mana at 20. Once filled, the gate closes until the next moon cycle." },
          { icon: "✦", text: "Founding brothers carry the Mākoa crest from the first 72. That mark cannot be earned later — only now." },
          { icon: "🤝", text: "XI reviews every pledge within 24 hours. Your Formation Committee reaches out within 48. The process is already moving." },
        ].map(({ icon, text }) => (
          <div key={text} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: "0.8rem", flexShrink: 0, marginTop: 1 }}>{icon}</span>
            <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.68rem", fontFamily: "var(--font-jetbrains)", lineHeight: 1.7, margin: 0 }}>{text}</p>
          </div>
        ))}
      </div>
      <button
        onClick={onPledge}
        style={{
          width: "100%", background: "transparent", color: GOLD,
          border: `1px solid ${GOLD_BORDER}`, fontFamily: "var(--font-jetbrains)",
          fontSize: "0.68rem", letterSpacing: "0.2em", padding: "13px",
          cursor: "pointer", borderRadius: 8, textTransform: "uppercase",
          position: "relative", zIndex: 1,
        }}
      >
        I UNDERSTAND — PLEDGE NOW →
      </button>
    </div>
  );
}

// ── Oath Block ─────────────────────────────────────────────
function OathBlock({ onPledge }: { onPledge: () => void }) {
  return (
    <div style={{
      position: "relative", overflow: "hidden",
      background: "#030508",
      border: `1px solid rgba(176,142,80,0.15)`,
      borderRadius: 12, padding: "28px 20px", marginTop: 28,
      textAlign: "center",
    }}>
      <MoonGlow top={-80} opacity={0.07} />
      <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.52rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 16px", position: "relative", zIndex: 1 }}>
        The oath
      </p>
      <p className="font-cormorant" style={{
        fontStyle: "italic", color: "rgba(176,142,80,0.7)", fontSize: "1.15rem",
        lineHeight: 1.7, margin: "0 0 20px", position: "relative", zIndex: 1,
      }}>
        "I enter under the Malu.<br />
        I serve before I am served.<br />
        I build what lasts.<br />
        I stand with my brothers<br />
        under every full moon."
      </p>
      <div style={{ width: 40, height: 1, background: "rgba(176,142,80,0.2)", margin: "0 auto 16px", position: "relative", zIndex: 1 }} />
      <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", margin: "0 0 22px", position: "relative", zIndex: 1 }}>
        — The Mākoa Oath · Malu Trust
      </p>
      <button
        onClick={onPledge}
        style={{
          background: GOLD, color: "#000", border: "none",
          fontFamily: "var(--font-jetbrains)", fontSize: "0.7rem", letterSpacing: "0.2em",
          padding: "14px 32px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase",
          fontWeight: 700, position: "relative", zIndex: 1,
        }}
      >
        I TAKE THE OATH
      </button>
    </div>
  );
}

// ── Countdown Box ──────────────────────────────────────────
function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ background: "#0a0a00", border: "0.5px solid #1e1a00", borderRadius: 6, padding: "8px 4px", textAlign: "center" }}>
      <div style={{ fontSize: "1.6rem", fontWeight: 700, color: GOLD, lineHeight: 1, fontFamily: "var(--font-jetbrains)" }}>
        {String(value).padStart(2, "0")}
      </div>
      <div style={{ fontSize: "0.45rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a3a10", marginTop: 4, fontFamily: "var(--font-jetbrains)" }}>{label}</div>
    </div>
  );
}

// ── Full Moon Calendar ─────────────────────────────────────
const MOONS = [
  { name: "Flower Moon", date: "May 1, 2026", event: "Mākoa 1st Roundup · 72hr War Room", highlight: true },
  { name: "Strawberry Moon", date: "Jun 11, 2026", event: "Elite Reset Training · Chapter Houses" },
  { name: "Buck Moon", date: "Jul 10, 2026", event: "72hr Mastermind · Mana Strategy" },
  { name: "Sturgeon Moon", date: "Aug 9, 2026", event: "Service Projects · Regional Zones" },
  { name: "Harvest Moon", date: "Sep 7, 2026", event: "Aliʻi Council · Annual Appeal" },
  { name: "Hunter's Moon", date: "Oct 6, 2026", event: "Formation Orientation · New Candidates" },
];

// ── Nav ────────────────────────────────────────────────────
const NAV_ITEMS = ["Home", "About", "Regions", "Publications"];

// ── Sticky Bottom Bar ──────────────────────────────────────
function StickyPledgeBar({ visible, onPledge }: { visible: boolean; onPledge: () => void }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 45,
      background: "rgba(4,6,10,0.97)", backdropFilter: "blur(16px)",
      borderTop: `1px solid rgba(176,142,80,0.2)`,
      padding: "12px 16px 16px",
      transform: visible ? "translateY(0)" : "translateY(100%)",
      transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: GOLD, fontSize: "0.65rem", fontFamily: "var(--font-jetbrains)", fontWeight: 600, margin: "0 0 2px" }}>
              Founding seats are closing
            </p>
            <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", margin: 0 }}>
              Aliʻi: 12 seats · Mana: 20 seats · No second founding
            </p>
          </div>
          <button
            onClick={onPledge}
            style={{
              background: GOLD, color: "#000", border: "none",
              fontFamily: "var(--font-jetbrains)", fontSize: "0.62rem", letterSpacing: "0.15em",
              padding: "11px 20px", cursor: "pointer", borderRadius: 6,
              textTransform: "uppercase", fontWeight: 700, flexShrink: 0,
            }}
          >
            PLEDGE $9.99
          </button>
        </div>
        <p style={{ color: "rgba(176,142,80,0.18)", fontSize: "0.5rem", fontFamily: "var(--font-jetbrains)", margin: 0, textAlign: "center" }}>
          Selection required before access · Seats close each moon cycle
        </p>
      </div>
    </div>
  );
}

// ── Main Gate Page ─────────────────────────────────────────
interface GatePageProps {
  handle: string;
  phone: string;
  onConfirm: () => void;
  onLogoTap?: () => void;
}

export default function GatePage({ handle, phone, onConfirm, onLogoTap }: GatePageProps) {
  const { days, hours, minutes } = useCountdown();
  const [activeNav, setActiveNav] = useState("Home");
  const [sheet, setSheet] = useState<"alii" | "mana" | "nakoa" | null>(null);
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [zip, setZip] = useState("");
  const showStickyBar = useScrolled(500);

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
    <div style={{ background: BG, minHeight: "100dvh", color: GOLD, overflowX: "hidden", paddingBottom: showStickyBar ? 72 : 0 }}>

      {/* ── STAR FIELD ── */}
      <StarField />

      {/* ── STICKY NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(4,6,10,0.96)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(176,142,80,0.1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", height: 48,
      }}>
        <span className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1rem", letterSpacing: "0.04em", cursor: "pointer" }} onClick={onLogoTap}>
          Mākoa
        </span>
        <div style={{ display: "flex", gap: 2 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: activeNav === item ? GOLD : "rgba(176,142,80,0.35)",
                fontFamily: "var(--font-jetbrains)", fontSize: "0.52rem",
                letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 7px",
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
      <div ref={sectionRefs.Home as React.RefObject<HTMLDivElement>} style={{ position: "relative" }}>

        {/* HERO */}
        <div style={{ position: "relative", width: "100%", height: 320, overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
            alt="Mākoa Brotherhood"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
          />
          {/* Deep dark overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(4,6,10,0.55) 0%, rgba(4,6,10,0.97) 100%)",
          }} />
          {/* Moon glow in hero */}
          <div style={{
            position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
            width: 200, height: 200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(176,142,80,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
            padding: "0 24px 36px",
          }}>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 10px" }}>
              Founded Easter Sunday · 2026
            </p>
            <h1 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "2.1rem", margin: "0 0 8px", textAlign: "center", lineHeight: 1.15 }}>
              For the men who build things
            </h1>
            <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.6rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.18em", margin: "0 0 24px", textAlign: "center" }}>
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
              PLEDGE YOUR SEAT — $9.99
            </button>
          </div>
        </div>

        {/* CORE VALUES STRIP */}
        <div style={{ background: "#030508", borderBottom: "1px solid rgba(176,142,80,0.08)", padding: "14px 0" }}>
          <div style={{ display: "flex", justifyContent: "center", maxWidth: 480, margin: "0 auto", flexWrap: "wrap" }}>
            {[
              { label: "All Faiths Welcome", icon: "✦" },
              { label: "Conservative Order", icon: "⚔" },
              { label: "Service to All First", icon: "🤝" },
              { label: "Community & Brotherhood", icon: "🌕" },
            ].map(({ label, icon }, i) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
                borderRight: i < 3 ? "1px solid rgba(176,142,80,0.08)" : "none",
              }}>
                <span style={{ fontSize: "0.65rem" }}>{icon}</span>
                <span style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.5rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DECLARATION */}
        <div style={{ padding: "28px 24px 22px", textAlign: "center", borderBottom: "0.5px solid #0d1020" }}>
          <div className="font-cormorant" style={{ fontStyle: "italic", fontWeight: 300, fontSize: "1rem", color: "rgba(237,232,224,0.52)", lineHeight: 2.2, letterSpacing: "0.02em" }}>
            This is not a club.<br />
            This is not a program.<br /><br />
            This is an order — under the Malu Trust —<br />
            building something that will outlast every man in it.<br /><br />
            Entrance is earned. Not purchased.<br />
            The 72 is where brothers are sworn in.<br />
            The oath is the only authority here.
          </div>
        </div>

        <div style={{ padding: "0 16px", maxWidth: 480, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* TIER CARDS */}
          <div style={{ marginTop: 32 }}>
            <SectionLabel>Where do you stand</SectionLabel>
            <p className="font-cormorant" style={{ fontStyle: "italic", color: "rgba(176,142,80,0.55)", fontSize: "1.1rem", textAlign: "center", margin: "4px 0 16px" }}>
              Every man enters at his level
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <TierCard label="Aliʻi" sub={"Network\nto Network"} color={GOLD} onClick={() => setSheet("alii")} />
              <TierCard label="Mana" sub={"Build\nB2B"} color={BLUE} onClick={() => setSheet("mana")} />
              <TierCard label="Nā Koa" sub={"Serve\nthe Order"} color={GREEN} onClick={() => setSheet("nakoa")} />
            </div>

            {/* SCARCITY BLOCK */}
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { icon: "⚠", text: "No second founding — this event happens once", color: "#f85149" },
                { icon: "🌕", text: "Seats close each moon cycle — gate locks May 1", color: GOLD },
                { icon: "✦", text: "Selection required before access — not open to all", color: "rgba(176,142,80,0.5)" },
              ].map(({ icon, text, color }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, background: "#060810", border: "0.5px solid rgba(176,142,80,0.06)", borderRadius: 6, padding: "8px 10px" }}>
                  <span style={{ fontSize: "0.65rem", flexShrink: 0 }}>{icon}</span>
                  <span style={{ color, fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", lineHeight: 1.4 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* THE 72 BOX */}
          <div style={{
            marginTop: 14, margin: "14px 0 0", background: "linear-gradient(135deg, #0c0900, #06080a)",
            border: "1px solid #BA7517", borderRadius: 10, padding: 14, position: "relative", overflow: "hidden",
          }}>
            <MoonGlow top={-40} opacity={0.07} />
            {/* Founding badge */}
            <div style={{
              position: "absolute", top: -1, right: -1, background: "#BA7517", color: "#000",
              fontSize: "0.46rem", fontWeight: 700, letterSpacing: "0.14em",
              padding: "3px 9px", borderRadius: "0 9px 0 6px", textTransform: "uppercase",
              fontFamily: "var(--font-jetbrains)", zIndex: 1,
            }}>
              Founding Event
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                <span style={{ fontSize: "0.85rem" }}>🌕</span>
                <span style={{ fontSize: "0.5rem", color: "rgba(176,142,80,0.4)", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-jetbrains)" }}>Flower Moon · May 1, 2026</span>
              </div>
              <div className="font-cormorant" style={{ fontStyle: "italic", fontSize: "1.15rem", color: GOLD, marginBottom: 2 }}>
                The 72 — Mākoa 1st Roundup
              </div>
              <div style={{ fontSize: "0.52rem", color: "rgba(237,232,224,0.32)", fontFamily: "var(--font-jetbrains)", marginBottom: 12 }}>
                May 1–4 · Kapolei · West Oahu · Hotel
              </div>

              {/* Left-border quote block */}
              <div style={{ borderLeft: "2px solid rgba(186,117,23,0.38)", paddingLeft: 10, marginBottom: 14 }}>
                <div className="font-cormorant" style={{ fontStyle: "italic", fontWeight: 300, fontSize: "0.95rem", color: "rgba(237,232,224,0.5)", lineHeight: 2.1 }}>
                  4am ice bath as the Flower Moon sets over the Pacific.<br />
                  72 hours of war room and reset.<br />
                  Brothers sworn in at the founding fire.<br />
                  The only event where elevation happens.
                </div>
              </div>

              {/* April 15 Itinerary */}
              <div style={{ background: "rgba(176,142,80,0.04)", border: "0.5px solid rgba(176,142,80,0.15)", borderRadius: 8, padding: "12px 12px", marginBottom: 14 }}>
                <div style={{ fontSize: "0.48rem", letterSpacing: "0.2em", color: "rgba(176,142,80,0.4)", textTransform: "uppercase", fontFamily: "var(--font-jetbrains)", marginBottom: 8 }}>
                  April 15 · First 4am Wednesday Training
                </div>
                {[
                  ["04:00", "Arrive · Ice bath begins"],
                  ["04:30", "Cold plunge + breathwork"],
                  ["05:15", "Brotherhood circle · introductions"],
                  ["06:00", "Sauna reset · debrief"],
                  ["06:45", "Breakfast · zone assignments"],
                  ["07:30", "Dismissed · Telegram onboarding"],
                ].map(([time, desc]) => (
                  <div key={time} style={{ display: "flex", gap: 10, marginBottom: 5, alignItems: "flex-start" }}>
                    <span style={{ color: "#BA7517", fontSize: "0.48rem", fontFamily: "var(--font-jetbrains)", flexShrink: 0, minWidth: 36 }}>{time}</span>
                    <span style={{ color: "rgba(237,232,224,0.4)", fontSize: "0.48rem", fontFamily: "var(--font-jetbrains)", lineHeight: 1.5 }}>{desc}</span>
                  </div>
                ))}
                <div style={{ marginTop: 8, fontSize: "0.46rem", color: "rgba(176,142,80,0.25)", fontFamily: "var(--font-jetbrains)" }}>
                  Location confirmed via Telegram after pledge · your zip cluster
                </div>
              </div>

              {/* Three-column tier breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginBottom: 12 }}>
                <div style={{ background: "#0a0800", border: "0.5px solid rgba(186,117,23,0.25)", borderRadius: 6, padding: "8px 6px" }}>
                  <div style={{ fontSize: "0.52rem", fontWeight: 700, color: GOLD, letterSpacing: "0.08em", marginBottom: 4, textAlign: "center", fontFamily: "var(--font-jetbrains)" }}>👑 Aliʻi</div>
                  <div style={{ fontSize: "0.46rem", color: "#6a5a30", lineHeight: 1.8, textAlign: "center", fontFamily: "var(--font-jetbrains)" }}>
                    Boardroom<br />72hr War Room<br />Hotel<br />Ice bath 4am<br />Founding gear<br />Council seat
                  </div>
                  <div style={{ marginTop: 6, textAlign: "center" }}>
                    <span style={{ fontSize: "0.45rem", color: "#f85149", fontFamily: "var(--font-jetbrains)" }}>{SEAT_TOTALS.alii - SEAT_TAKEN.alii} of {SEAT_TOTALS.alii} open</span>
                  </div>
                </div>
                <div style={{ background: "#080c14", border: "0.5px solid rgba(88,166,255,0.18)", borderRadius: 6, padding: "8px 6px" }}>
                  <div style={{ fontSize: "0.52rem", fontWeight: 700, color: BLUE, letterSpacing: "0.08em", marginBottom: 4, textAlign: "center", fontFamily: "var(--font-jetbrains)" }}>🌀 Mana</div>
                  <div style={{ fontSize: "0.46rem", color: "#304a6a", lineHeight: 1.8, textAlign: "center", fontFamily: "var(--font-jetbrains)" }}>
                    Mastermind<br />72hr reset<br />Hotel<br />Ice bath 4am<br />Brotherhood<br />Sworn in
                  </div>
                  <div style={{ marginTop: 6, textAlign: "center" }}>
                    <span style={{ fontSize: "0.45rem", color: "#f0a030", fontFamily: "var(--font-jetbrains)" }}>{SEAT_TOTALS.mana - SEAT_TAKEN.mana} of {SEAT_TOTALS.mana} open</span>
                  </div>
                </div>
                <div style={{ background: "#080e0a", border: "0.5px solid rgba(63,185,80,0.18)", borderRadius: 6, padding: "8px 6px" }}>
                  <div style={{ fontSize: "0.52rem", fontWeight: 700, color: GREEN, letterSpacing: "0.08em", marginBottom: 4, textAlign: "center", fontFamily: "var(--font-jetbrains)" }}>⚔ Nā Koa</div>
                  <div style={{ fontSize: "0.46rem", color: "#2a4a30", lineHeight: 1.8, textAlign: "center", fontFamily: "var(--font-jetbrains)" }}>
                    2-day pass<br />4am Saturday<br />4am Sunday<br />Ice bath free<br />Beach training<br />Full moon
                  </div>
                  <div style={{ marginTop: 6, textAlign: "center" }}>
                    <span style={{ fontSize: "0.45rem", color: GREEN, fontFamily: "var(--font-jetbrains)" }}>Limited intake</span>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: "0.46rem", letterSpacing: "0.16em", color: "#3a3020", textTransform: "uppercase", textAlign: "center", marginBottom: 6, fontFamily: "var(--font-jetbrains)" }}>
                  Time until the founding
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  <CountdownBox value={days} label="days" />
                  <CountdownBox value={hours} label="hours" />
                  <CountdownBox value={minutes} label="minutes" />
                </div>
              </div>

              <button
                onClick={openPledge}
                style={{
                  width: "100%", background: "#BA7517", border: "none", color: "#000",
                  padding: "11px", borderRadius: 4, fontFamily: "var(--font-jetbrains)",
                  fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em",
                  textTransform: "uppercase", cursor: "pointer", marginTop: 4, transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
              >
                Pledge Your Seat · May 1
              </button>
              <div style={{ fontSize: "0.46rem", color: "rgba(176,142,80,0.28)", textAlign: "center", marginTop: 8, lineHeight: 1.8, fontFamily: "var(--font-jetbrains)" }}>
                Formation path and financial commitment<br />revealed after acceptance
              </div>
            </div>
          </div>

          {/* WHY NOW BLOCK */}
          <WhyNowBlock onPledge={openPledge} />

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

          {/* OATH BLOCK */}
          <OathBlock onPledge={openPledge} />

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
                Formation path revealed after acceptance →
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
            BEGIN FORMATION — $9.99
          </button>
          <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.52rem", textAlign: "center", marginTop: 8, fontFamily: "var(--font-jetbrains)" }}>
            Most seats secured within 48 hours of acceptance
          </p>

          {/* TELEGRAM */}
          <div style={{
            marginTop: 20, marginBottom: 8, background: "#030508",
            border: `1px solid rgba(88,166,255,0.12)`, borderRadius: 10,
            padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", margin: 0, lineHeight: 1.5 }}>
              Follow the 72<br />
              <span style={{ color: "rgba(176,142,80,0.22)", fontSize: "0.55rem" }}>updates drop on Telegram</span>
            </p>
            <a href="https://t.me/makoaorder" target="_blank" rel="noopener noreferrer" style={{ background: "transparent", border: `1px solid ${BLUE}44`, color: BLUE, fontFamily: "var(--font-jetbrains)", fontSize: "0.62rem", letterSpacing: "0.12em", padding: "8px 14px", cursor: "pointer", borderRadius: 6, textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
              JOIN THE SIGNAL
            </a>
          </div>
        </div>
      </div>

      {/* ── ABOUT SECTION ── */}
      <div ref={sectionRefs.About as React.RefObject<HTMLDivElement>} style={{ marginTop: 8, position: "relative" }}>
        <div style={{ background: "#030508", borderTop: "1px solid rgba(176,142,80,0.08)", borderBottom: "1px solid rgba(176,142,80,0.08)", padding: "40px 16px", position: "relative", overflow: "hidden" }}>
          <MoonGlow top={0} opacity={0.05} />
          <div style={{ maxWidth: 480, margin: "0 auto", position: "relative", zIndex: 1 }}>

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

            {/* Pull-quote */}
            <div style={{ border: `1px solid ${GOLD_BORDER}`, borderRadius: 10, padding: "20px 18px", marginBottom: 28, background: "rgba(176,142,80,0.02)", textAlign: "center" }}>
              <p className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.3rem", margin: "0 0 10px", lineHeight: 1.3 }}>
                "The Order does not recruit. It recognizes."
              </p>
              <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.15em", margin: 0 }}>
                — Chief Mākoa XI
              </p>
            </div>

            <GoldDivider />

            <SectionLabel>Admissions Criteria</SectionLabel>
            <h3 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.2rem", margin: "8px 0 18px" }}>
              Who is called to the Order
            </h3>
            <CriteriaRow icon="✦" text="Nā Koa applicants must be 18+ males in active good standing within their community, with a demonstrated record of hands-on volunteer service and support for the Order's teachings and values." />
            <CriteriaRow icon="✦" text="Aliʻi and Mana applicants must have achieved distinction in their professional field — business, law, medicine, academics, military, government, or philanthropy — and be recognized as leaders in their field and community." />
            <CriteriaRow icon="✦" text="All faiths are welcomed. The Mākoa Order is a conservative order. Service to all comes first." />

            <GoldDivider />

            <SectionLabel>Sponsorship</SectionLabel>
            <h3 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.2rem", margin: "8px 0 18px" }}>
              How you enter the gate
            </h3>
            <CriteriaRow icon="◈" text="Applicants must be sponsored by a Nā Koa brother — or must have encountered the Mākoa crest QR code. The applicant should review all admission criteria before requesting an application." />
            <CriteriaRow icon="◈" text="Once accepted into formation, each candidate is guided through the process and encouraged to participate actively in the Order's service projects and spiritual activities." />

            <GoldDivider />

            <SectionLabel>Financial</SectionLabel>
            <h3 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.2rem", margin: "8px 0 18px" }}>
              Passage Fees & Annual Dues
            </h3>
            <CriteriaRow icon="◇" text="Prior to Investiture, every candidate pays an initiation fee known as Passage Fees. After investiture, Annual Dues are required." />
            <CriteriaRow icon="◇" text="Members are encouraged to contribute to the Order's Annual Appeal, which supports the defense and advancement of our projects and community commitments." />

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
      <div ref={sectionRefs.Regions as React.RefObject<HTMLDivElement>} style={{ position: "relative" }}>
        <div style={{ padding: "40px 16px", maxWidth: 480, margin: "0 auto", position: "relative", zIndex: 1 }}>
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
              <div style={{ flexShrink: 0, marginTop: 6 }}>
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

          <div style={{ marginTop: 20, background: "rgba(176,142,80,0.03)", border: `1px solid ${GOLD_BORDER}`, borderRadius: 10, padding: "18px 16px", textAlign: "center" }}>
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
        <div style={{ background: "#030508", borderTop: "1px solid rgba(176,142,80,0.08)", padding: "40px 16px 48px", position: "relative", overflow: "hidden" }}>
          <MoonGlow top={0} opacity={0.05} />
          <div style={{ maxWidth: 480, margin: "0 auto", position: "relative", zIndex: 1 }}>
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
                  background: highlight ? "rgba(176,142,80,0.05)" : CARD_BG,
                  border: `1px solid ${highlight ? GOLD_BORDER : "rgba(176,142,80,0.08)"}`,
                  borderRadius: 10, padding: "14px 16px", marginBottom: 10,
                  display: "flex", gap: 14, alignItems: "center",
                }}
              >
                <div style={{ textAlign: "center", flexShrink: 0, width: 36 }}>
                  <div style={{ fontSize: highlight ? "1.2rem" : "0.9rem" }}>🌕</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ color: highlight ? GOLD : "rgba(176,142,80,0.65)", fontSize: "0.72rem", fontFamily: "var(--font-jetbrains)", fontWeight: highlight ? 600 : 400 }}>{name}</span>
                    <span style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)" }}>{date}</span>
                  </div>
                  <p style={{ color: highlight ? "rgba(176,142,80,0.65)" : "rgba(176,142,80,0.35)", fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", margin: 0, lineHeight: 1.5 }}>{event}</p>
                  {highlight && (
                    <p style={{ color: GOLD, fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)", margin: "6px 0 0", letterSpacing: "0.1em" }}>← FOUNDING EVENT · PLEDGE NOW</p>
                  )}
                </div>
              </div>
            ))}

            <div style={{ marginTop: 24, padding: "20px 16px", background: "rgba(176,142,80,0.02)", border: `1px solid ${GOLD_BORDER}`, borderRadius: 10 }}>
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
              <p className="font-cormorant" style={{ fontStyle: "italic", color: "rgba(176,142,80,0.2)", fontSize: "1rem", margin: "0 0 6px" }}>
                Hana · Pale · Ola
              </p>
              <p style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.52rem", fontFamily: "var(--font-jetbrains)", letterSpacing: "0.18em", margin: 0 }}>
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

      {/* ── STICKY BOTTOM PLEDGE BAR ── */}
      <StickyPledgeBar visible={showStickyBar && !pledgeOpen && !sheet} onPledge={openPledge} />
    </div>
  );
}