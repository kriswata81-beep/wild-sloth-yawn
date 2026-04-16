"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { callXIAgent } from "@/lib/xi-agent";
import MakoaQR from "@/components/MakoaQR";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const BG = "#04060a";

// ─── Countdown ───────────────────────────────────────────────────────────────
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

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────
function BottomSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0a0d12", border: `1px solid ${GOLD_20}`, borderRadius: "16px 16px 0 0",
          padding: "28px 24px 48px", width: "100%", maxWidth: 480,
          animation: "slideUp 0.3s ease forwards",
        }}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: GOLD_DIM, fontSize: "1.2rem", cursor: "pointer" }}>×</button>
        {children}
      </div>
    </div>
  );
}

// ─── Overlay ──────────────────────────────────────────────────────────────────
function Overlay({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0a0d12", border: `1px solid ${GOLD_20}`, borderRadius: 12,
          padding: "32px 24px", width: "100%", maxWidth: 420,
          animation: "fadeIn 0.3s ease forwards",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Class Sheet ──────────────────────────────────────────────────────────────
function ClassSheet({ eyebrow, eyebrowColor, headline, identity, bring, receive }: {
  eyebrow: string; eyebrowColor: string; headline: string;
  identity: string; bring: string[]; receive: string[];
}) {
  return (
    <div>
      <p style={{ color: eyebrowColor, fontSize: "0.46rem", letterSpacing: "0.22em", marginBottom: 10 }}>{eyebrow}</p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#e8e0d0", fontSize: "1.2rem", lineHeight: 1.4, marginBottom: 12 }}>{headline}</p>
      <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.5rem", lineHeight: 1.8, marginBottom: 18, borderLeft: `2px solid ${eyebrowColor}40`, paddingLeft: 12 }}>{identity}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 8 }}>
        <div>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem", letterSpacing: "0.15em", marginBottom: 8 }}>YOU BRING</p>
          {bring.map(b => <p key={b} style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.48rem", marginBottom: 5, lineHeight: 1.5 }}>— {b}</p>)}
        </div>
        <div>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem", letterSpacing: "0.15em", marginBottom: 8 }}>YOU RECEIVE</p>
          {receive.map(r => <p key={r} style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.48rem", marginBottom: 5, lineHeight: 1.5 }}>— {r}</p>)}
        </div>
      </div>
    </div>
  );
}

// ─── Pledge Popup ─────────────────────────────────────────────────────────────
function PledgePopup({ onConfirm, onClose, submitting }: { onConfirm: () => void; onClose: () => void; submitting?: boolean }) {
  return (
    <div>
      <p style={{ color: GOLD_DIM, fontSize: "0.44rem", letterSpacing: "0.22em", marginBottom: 10 }}>THE PLEDGE · MALU TRUST</p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#e8e0d0", fontSize: "1.25rem", lineHeight: 1.4, marginBottom: 14 }}>
        This is your entry into the order.
      </p>
      <div style={{ background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 8, padding: "18px", marginBottom: 18, textAlign: "center" }}>
        <p style={{ color: GOLD, fontSize: "2rem", fontWeight: 700, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>$9.99</p>
        <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.46rem", marginTop: 6, lineHeight: 1.7 }}>
          Your pledge signals to the order that you are serious.<br />
          This is a one-time gate entry fee.<br />
          XI will review your 12 answers and respond<br />
          within moments. Stand by.
        </p>
      </div>
      {submitting ? (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 16, height: 16, border: `1px solid ${GOLD}`, borderTop: "1px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: GOLD, fontSize: "0.5rem", letterSpacing: "0.15em" }}>XI is reviewing your submission...</p>
          </div>
          <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.42rem" }}>This takes a moment. Stand by.</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          <button onClick={onConfirm} style={{
            background: GOLD, color: "#000", border: "none",
            padding: "14px", fontSize: "0.56rem", letterSpacing: "0.22em",
            cursor: "pointer", borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          }}>I PLEDGE</button>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(232,224,208,0.35)", padding: "12px", fontSize: "0.5rem",
            letterSpacing: "0.15em", cursor: "pointer", borderRadius: 6,
            fontFamily: "'JetBrains Mono', monospace",
          }}>NOT TODAY</button>
        </div>
      )}
    </div>
  );
}

// ─── Option Button ────────────────────────────────────────────────────────────
function OptBtn({ val, cur, onSelect, color = GOLD }: { val: string; cur: string; onSelect: (v: string) => void; color?: string }) {
  const active = cur === val;
  return (
    <button
      onClick={() => onSelect(val)}
      style={{
        background: active ? `${color}12` : "transparent",
        border: `1px solid ${active ? color : "rgba(255,255,255,0.08)"}`,
        color: active ? color : "rgba(232,224,208,0.45)",
        fontSize: "0.5rem", padding: "10px 14px", borderRadius: 6,
        cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
        width: "100%", textAlign: "left", transition: "all 0.15s",
        marginBottom: 6,
      }}
    >{val}</button>
  );
}

// ─── Text Input ───────────────────────────────────────────────────────────────
function TextQ({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
        color: "#e8e0d0", fontSize: "0.55rem", padding: "11px 14px",
        borderRadius: 6, width: "100%", outline: "none",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    />
  );
}

// ─── Question Block ───────────────────────────────────────────────────────────
function QBlock({ num, label, children }: { num: number; label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
        <span style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", flexShrink: 0 }}>Q{num}</span>
        <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.52rem", lineHeight: 1.5 }}>{label}</p>
      </div>
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GatePageRoute() {
  const router = useRouter();
  const { days, hours, minutes } = useCountdown();
  const questionsRef = useRef<HTMLDivElement>(null);

  const [sheet, setSheet] = useState<null | "network" | "build" | "serve">(null);
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Session data
  const [handle, setHandle] = useState("");
  const [phone, setPhone] = useState("");

  // 12 Questions
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");
  const [q5, setQ5] = useState("");
  const [q6, setQ6] = useState("");
  const [q7, setQ7] = useState("");
  const [q8, setQ8] = useState("");
  const [q9, setQ9] = useState("");
  const [q10, setQ10] = useState("");
  const [q11, setQ11] = useState("");
  const [q12, setQ12] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHandle(sessionStorage.getItem("makoa_handle") || "");
      setPhone(sessionStorage.getItem("makoa_phone") || "");
    }
  }, []);

  function scrollToQuestions() {
    questionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleConfirm() {
    setSubmitting(true);
    const tier_flag = q1 === "Leadership and vision" ? "alii" : q1 === "Skills and service" ? "mana" : "nakoa";

    let xiMessage = "";
    let xiTier = tier_flag;
    try {
      const xiResponse = await callXIAgent({ handle, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, tier_flag });
      xiMessage = xiResponse.message;
      xiTier = xiResponse.tier;
    } catch (err) {
      console.error("[GatePage] XI Agent error:", err);
    }

    try {
      const { error } = await supabase.from("gate_submissions").insert({
        handle,
        phone,
        q1, q2, q3, q4, q5, q6, q7, q8, q9,
        q10, q11, q12,
        zip: q10,
        referral_code: q11,
        pledge_amount: 9.99,
        tier_flag: xiTier || tier_flag,
      });
      if (error) console.error("[GatePage] Supabase insert error:", error);
    } catch (err) {
      console.error("[GatePage] Unexpected error saving gate submission:", err);
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("makoa_xi_message", xiMessage);
      sessionStorage.setItem("makoa_xi_tier", xiTier);
    }

    setSubmitting(false);
    setPledgeOpen(false);
    router.push("/confirm");
  }

  const cardStyle = (color: string): React.CSSProperties => ({
    flex: 1, background: "#0a0d12", border: `1px solid ${color}22`,
    borderRadius: 10, padding: "16px 10px", cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    transition: "border-color 0.2s",
  });

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dotPulse { 0%,100% { opacity:0.85; transform:scale(1); } 50% { opacity:1; transform:scale(1.35); } }
        @keyframes ringExpand { 0% { opacity:0.5; transform:scale(1); } 100% { opacity:0; transform:scale(2.8); } }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&display=swap');
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", height: 380, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/hero-waianae-moon.png"
          alt="Hawaiian moonrise over the mountains"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(4,6,10,0.5) 0%, rgba(4,6,10,0.05) 40%, rgba(4,6,10,0.05) 55%, rgba(4,6,10,0.96) 100%)",
        }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(176,142,80,0.3), transparent)" }} />
        <div style={{ position: "absolute", bottom: 32, left: 0, right: 0, textAlign: "center", padding: "0 24px" }}>
          {/* Crest Mark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/makoa_eclipse_crest.png"
            alt="Mākoa Order Crest"
            style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 14px", display: "block", border: "1px solid rgba(176,142,80,0.25)" }}
          />
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            color: GOLD, fontSize: "1.55rem", lineHeight: 1.35,
            margin: "0 0 8px", textShadow: "0 2px 24px rgba(0,0,0,0.9)",
          }}>
            For the men who build things —<br />and the men rebuilding themselves
          </p>
          <p style={{ fontSize: "0.42rem", color: "rgba(232,224,208,0.4)", letterSpacing: "0.28em", textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
            MĀKOA ORDER · MALU TRUST · WEST OAHU
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>

        {/* ── BRUTAL CLEAR LINE — What this is ──────────────────────────────── */}
        <p style={{
          color: "rgba(232,224,208,0.7)", fontSize: "0.88rem", lineHeight: 1.7,
          textAlign: "center", padding: "28px 8px 0", margin: 0,
        }}>
          A private brotherhood and training system based in West Oahu.
          Apply below. If accepted, you get access to events, training, and founding membership for life.
        </p>

        {/* ── GROUNDING ELEMENT — Real place, real people ──────────────────── */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center", gap: 6,
          padding: "14px 0 24px", flexWrap: "wrap",
        }}>
          <span style={{ color: GOLD, fontSize: "0.44rem", letterSpacing: "0.1em" }}>📍 Kapolei, Oʻahu</span>
          <span style={{ color: "rgba(176,142,80,0.2)" }}>·</span>
          <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.44rem" }}>Real location</span>
          <span style={{ color: "rgba(176,142,80,0.2)" }}>·</span>
          <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.44rem" }}>Real men</span>
          <span style={{ color: "rgba(176,142,80,0.2)" }}>·</span>
          <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.44rem" }}>Real training</span>
          <span style={{ color: "rgba(176,142,80,0.2)" }}>·</span>
          <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.44rem" }}>Lifetime membership</span>
        </div>

        {/* ── WHAT YOU GET — Plain language ─────────────────────────────────── */}
        <div style={{
          background: "rgba(176,142,80,0.04)", border: `1px solid ${GOLD_20}`, borderRadius: 10,
          padding: "22px 20px", marginBottom: 24,
        }}>
          <p style={{ color: GOLD, fontSize: "0.5rem", letterSpacing: "0.18em", fontWeight: 700, marginBottom: 14 }}>WHAT YOU GET AS A FOUNDING MEMBER</p>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              "Weekly 4am ice bath + healing circle (The Weight Room)",
              "Weekly warrior training — fitness, skills, route strategy",
              "Monthly full moon brotherhood gathering (72 hours)",
              "Access to the Mākoa 808 network — brothers worldwide",
              "Service route income (you keep 80% of what you earn)",
              "Trade skill training through Nā Koa Academy",
              "Founding member status — locked for life, never repeated",
              "MAYDAY Summit Founders Event — May 2026, Kapolei",
            ].map(item => (
              <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: GREEN, fontSize: "0.65rem", flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.76rem", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 16, padding: "12px 14px",
            background: "rgba(0,0,0,0.3)", border: `1px solid ${GOLD_10}`, borderRadius: 6,
            textAlign: "center",
          }}>
            <p style={{ color: GOLD, fontSize: "0.78rem", fontWeight: 700, marginBottom: 2 }}>$497/year · Founding rate locked for life</p>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.62rem" }}>Standard rate after MAYDAY: $997/year. You will never pay that.</p>
          </div>
        </div>

        {/* ── THE PATH — 4 steps, no confusion ─────────────────────────────── */}
        <div style={{
          border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 10,
          padding: "22px 20px", marginBottom: 28,
        }}>
          <p style={{ color: GOLD, fontSize: "0.5rem", letterSpacing: "0.18em", fontWeight: 700, marginBottom: 14 }}>HOW TO JOIN — ONE PATH</p>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              { num: "1", text: "Answer 12 questions below", sub: "Takes 3 minutes. Be honest — this is how XI places you." },
              { num: "2", text: "XI reviews and places you in a class", sub: "Ali'i (leaders), Mana (builders), or Nā Koa (warriors)." },
              { num: "3", text: "Pay $9.99 gate entry to confirm", sub: "This is not a donation. This is your entry into the order." },
              { num: "4", text: "Receive founding member access", sub: "Event details, Mākoa 808 brotherhood channel, and payment instructions for annual dues." },
            ].map(s => (
              <div key={s.num} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: `${GOLD}15`, border: `1px solid ${GOLD}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 2,
                }}>
                  <span style={{ color: GOLD, fontSize: "0.72rem", fontWeight: 700 }}>{s.num}</span>
                </div>
                <div>
                  <p style={{ color: "#e8e0d0", fontSize: "0.78rem", fontWeight: 600, marginBottom: 2 }}>{s.text}</p>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.65rem", lineHeight: 1.5 }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── THE MISSION ──────────────────────────────────────────────────── */}
        <div style={{ padding: "32px 0 36px", textAlign: "center", borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.28em", marginBottom: 20 }}>THE MISSION</p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            color: "rgba(232,224,208,0.65)", fontSize: "1.05rem", lineHeight: 2.1,
          }}>
            Makoa exists because men are dying in silence.<br />
            Not from bullets — from isolation.<br />
            From carrying weight no one sees.<br />
            From performing strength while breaking inside.<br /><br />
            This order was built so no man carries alone.<br />
            Brotherhood is not a luxury. It is medicine.<br />
            The 808 is how brothers find each other.<br />
            The oath is how they stay.
          </p>
        </div>

        {/* ── THE OATH ─────────────────────────────────────────────────────── */}
        <div style={{
          borderLeft: `3px solid ${GOLD_40}`, background: "rgba(176,142,80,0.04)",
          borderRadius: "0 8px 8px 0", padding: "24px 20px", marginBottom: 36,
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 16 }}>THE OATH</p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            color: "rgba(232,224,208,0.7)", fontSize: "1rem", lineHeight: 2.2,
          }}>
            I stand with the order.<br />
            I carry my brother's weight as my own.<br />
            I show up at 4am when no one is watching.<br />
            I serve before I lead.<br />
            I build what will outlast me.<br />
            Under the Malu — I am Makoa.
          </p>
        </div>

        {/* ── THE THREE CLASSES ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ textAlign: "center", color: "rgba(232,224,208,0.3)", fontSize: "0.44rem", letterSpacing: "0.22em", marginBottom: 16 }}>
            THE THREE CLASSES
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { key: "network" as const, label: "Network", sub: "Aliʻi", color: GOLD },
              { key: "build" as const, label: "Build", sub: "Mana", color: BLUE },
              { key: "serve" as const, label: "Serve", sub: "Nā Koa", color: GREEN },
            ].map(c => (
              <div key={c.key} style={cardStyle(c.color)} onClick={() => setSheet(c.key)}>
                <p style={{ color: c.color, fontSize: "0.65rem", fontWeight: 600 }}>{c.label}</p>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem", letterSpacing: "0.1em" }}>{c.sub}</p>
                <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem", marginTop: 2 }}>tap to learn →</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── THE 48 TEASE ─────────────────────────────────────────────────── */}
        <div style={{
          border: `1px solid ${GOLD_40}`, borderRadius: 10,
          background: "linear-gradient(135deg, #0a0d12 0%, #060810 100%)",
          padding: "22px 20px", marginBottom: 36, position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 14, right: 14,
            background: GOLD, color: "#000", fontSize: "0.38rem",
            letterSpacing: "0.15em", padding: "3px 8px", borderRadius: 3,
          }}>FOUNDING EVENT</div>

          <p style={{ color: GOLD_DIM, fontSize: "0.44rem", letterSpacing: "0.2em", marginBottom: 8 }}>THE MAKOA 48</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD, fontSize: "1.4rem", margin: "0 0 4px" }}>
            May 1st · Kapolei · A Hotel
          </p>
          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.5rem", marginBottom: 16 }}>
            48 brothers. 48 hours. Friday dusk to Sunday dusk.
          </p>

          <div style={{ borderLeft: `2px solid ${GOLD_20}`, paddingLeft: 14, marginBottom: 20 }}>
            {[
              "War Room. Mastermind. 4am ice bath.",
              "Founding fire. Brothers sworn in.",
              "The only event where brothers are elevated.",
            ].map(line => (
              <p key={line} style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                color: "rgba(232,224,208,0.6)", fontSize: "0.9rem", lineHeight: 2.1, margin: 0,
              }}>{line}</p>
            ))}
          </div>

          {/* Countdown */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {[{ label: "DAYS", val: days }, { label: "HRS", val: hours }, { label: "MIN", val: minutes }].map(t => (
              <div key={t.label} style={{
                flex: 1, background: "rgba(0,0,0,0.4)", border: `1px solid ${GOLD_10}`,
                borderRadius: 6, padding: "10px 4px", textAlign: "center",
              }}>
                <p style={{ color: GOLD, fontSize: "1.3rem", fontWeight: 600, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{t.val}</p>
                <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.38rem", letterSpacing: "0.15em", marginTop: 4 }}>{t.label}</p>
              </div>
            ))}
          </div>

          <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.46rem", textAlign: "center", marginBottom: 14 }}>
            Founding membership + event access unlocked after application.
          </p>
          <a href="/fire" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.14em",
            textDecoration: "none", opacity: 0.7,
          }}>
            🔥 What actually happens inside the 48 hours →
          </a>
        </div>

        {/* ── CTA → SCROLL TO QUESTIONS (ONE PRIMARY ACTION) ─────────────── */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <button
            onClick={scrollToQuestions}
            style={{
              background: GOLD, color: "#000", border: "none",
              padding: "18px 32px", fontSize: "0.62rem", letterSpacing: "0.2em",
              cursor: "pointer", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              width: "100%",
            }}
          >
            START YOUR APPLICATION
          </button>
          <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.42rem", marginTop: 10 }}>12 questions · 3 minutes · one path in</p>
        </div>

        {/* ── THE 12 QUESTIONS ─────────────────────────────────────────────── */}
        <div ref={questionsRef} style={{ paddingTop: 8 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.44rem", letterSpacing: "0.25em", marginBottom: 8 }}>THE 12 QUESTIONS</p>
          <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.72rem", lineHeight: 1.6, marginBottom: 28 }}>
            This is the application for the MAYDAY Summit Founders Event and West Oahu chapter placement.
            XI reads every answer. Be honest — that is how you get placed correctly.
          </p>

          <QBlock num={1} label="What do you bring to a room of men?">
            <OptBtn val="Leadership and vision" cur={q1} onSelect={setQ1} />
            <OptBtn val="Skills and service" cur={q1} onSelect={setQ1} />
            <OptBtn val="Energy and hustle" cur={q1} onSelect={setQ1} />
          </QBlock>

          <QBlock num={2} label="What's the hardest thing you've built?">
            <TextQ placeholder="Tell XI..." value={q2} onChange={setQ2} />
          </QBlock>

          <QBlock num={3} label="Can you commit to 4am–6am, 5–6 days a month for Makoa elite reset training with Makoa meetup hotspots in your community?">
            <OptBtn val="Yes I'm ready" cur={q3} onSelect={setQ3} />
            <OptBtn val="Working toward it" cur={q3} onSelect={setQ3} />
            <OptBtn val="Not yet" cur={q3} onSelect={setQ3} />
          </QBlock>

          <QBlock num={4} label="Do you have a trade or professional skill?">
            <TextQ placeholder="e.g. electrician, contractor, nurse, developer..." value={q4} onChange={setQ4} />
          </QBlock>

          <QBlock num={5} label="How many men can you call at 2am?">
            <OptBtn val="0" cur={q5} onSelect={setQ5} />
            <OptBtn val="1–3" cur={q5} onSelect={setQ5} />
            <OptBtn val="4+" cur={q5} onSelect={setQ5} />
          </QBlock>

          <QBlock num={6} label="What are you willing to give 5 days a month to?">
            <OptBtn val="Service" cur={q6} onSelect={setQ6} />
            <OptBtn val="Training" cur={q6} onSelect={setQ6} />
            <OptBtn val="Both" cur={q6} onSelect={setQ6} />
          </QBlock>

          <QBlock num={7} label="Do you have a vehicle?">
            <OptBtn val="Own truck/van" cur={q7} onSelect={setQ7} />
            <OptBtn val="Car" cur={q7} onSelect={setQ7} />
            <OptBtn val="No vehicle" cur={q7} onSelect={setQ7} />
            <OptBtn val="Special license — CDL / forklift / warehouse" cur={q7} onSelect={setQ7} />
          </QBlock>

          <QBlock num={8} label="What challenge keeps you up at night?">
            <TextQ placeholder="Be honest with XI..." value={q8} onChange={setQ8} />
          </QBlock>

          <QBlock num={9} label="Would you open your home to a brother for 30 days?">
            <OptBtn val="Yes" cur={q9} onSelect={setQ9} />
            <OptBtn val="Maybe" cur={q9} onSelect={setQ9} />
            <OptBtn val="Not now" cur={q9} onSelect={setQ9} />
          </QBlock>

          <QBlock num={10} label="Where are you?">
            <TextQ placeholder="ZIP code" value={q10} onChange={setQ10} />
          </QBlock>

          <QBlock num={11} label="Who sent you?">
            <TextQ placeholder="Referral code — or type: I found the mark" value={q11} onChange={setQ11} />
          </QBlock>

          <QBlock num={12} label="One word that describes why you're here.">
            <TextQ placeholder="One word." value={q12} onChange={setQ12} />
          </QBlock>

          {/* ── PLEDGE CTA — ONE ACTION ─────────────────────────────────── */}
          <button
            onClick={() => setPledgeOpen(true)}
            style={{
              width: "100%", background: GOLD, color: "#000",
              border: "none", padding: "18px", fontSize: "0.62rem",
              letterSpacing: "0.2em", cursor: "pointer", borderRadius: 8,
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              marginTop: 8, marginBottom: 12,
            }}
          >
            SUBMIT APPLICATION
          </button>
          <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.42rem", textAlign: "center", marginBottom: 32 }}>
            $9.99 gate entry · XI responds within moments · founding access unlocked after acceptance
          </p>
        </div>

        {/* Telegram access is given AFTER acceptance — not on the gate page */}

        {/* ── QR CODE ─────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", padding: "28px 0 12px" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.2em", marginBottom: 16 }}>
            SCAN TO SHARE THE GATE
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <MakoaQR size={220} showLabel={true} />
          </div>
          <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.36rem", marginTop: 14, letterSpacing: "0.1em" }}>
            makoa.live
          </p>
        </div>

      </div>

      {/* ── CLASS BOTTOM SHEETS ───────────────────────────────────────────── */}
      <BottomSheet open={sheet === "network"} onClose={() => setSheet(null)}>
        <ClassSheet
          eyebrow="ALIʻI · NETWORK"
          eyebrowColor={GOLD}
          headline="You already lead. This is the room that matches you."
          identity="The Aliʻi class is for men who move rooms. You carry vision, access, and the weight of others. You don't need to be told what to do — you need brothers who can keep up."
          bring={["Leadership and vision", "B2B access and referrals", "Presence at the founding council"]}
          receive={["12-man founding council seat", "808 Command access", "Net-to-net referral pool", "Brotherhood at every 48"]}
        />
      </BottomSheet>

      <BottomSheet open={sheet === "build"} onClose={() => setSheet(null)}>
        <ClassSheet
          eyebrow="MANA · BUILD"
          eyebrowColor={BLUE}
          headline="You have the skills. This is the network that needs them."
          identity="The Mana class is for men who build with their hands and their minds. Tradesmen, craftsmen, professionals. You teach. You create. You are the backbone of what the order builds."
          bring={["Trade and craft", "Ability to teach", "B2B services"]}
          receive={["Brotherhood council seat", "Wednesday school and job queue", "War Room access", "48 Mastermind"]}
        />
      </BottomSheet>

      <BottomSheet open={sheet === "serve"} onClose={() => setSheet(null)}>
        <ClassSheet
          eyebrow="NĀ KOA · SERVE"
          eyebrowColor={GREEN}
          headline="You are ready to build something worth belonging to."
          identity="The Nā Koa class is for men who show up. You may not have the network yet — but you have the hunger. You serve first. You train first. You earn your place in the order through action."
          bring={["Time and hustle", "Community presence", "Hunger to grow"]}
          receive={["Free 4am elite training", "Ice and sauna per cluster", "808 peer channels", "Service route income 80%"]}
        />
      </BottomSheet>

      {/* ── PLEDGE POPUP ─────────────────────────────────────────────────── */}
      <Overlay open={pledgeOpen} onClose={() => !submitting && setPledgeOpen(false)}>
        <PledgePopup
          onConfirm={handleConfirm}
          onClose={() => setPledgeOpen(false)}
          submitting={submitting}
        />
      </Overlay>
    </div>
  );
}

