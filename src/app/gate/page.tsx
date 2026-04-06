"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { callXIAgent } from "@/lib/xi-agent";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const PURPLE = "#534AB7";
const BG_GATE = "#04060a";

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

function PledgePopup({ onConfirm, onClose, submitting }: { onConfirm: () => void; onClose: () => void; submitting?: boolean }) {
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
      {submitting ? (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: "16px", height: "16px", border: `1px solid ${GOLD}`, borderTop: "1px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: GOLD, fontSize: "0.5rem", letterSpacing: "0.15em" }}>XI is reviewing your submission...</p>
          </div>
          <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.42rem" }}>This takes a moment. Stand by.</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default function GatePageRoute() {
  const router = useRouter();
  const { days, hours, minutes } = useCountdown();
  const [sheet, setSheet] = useState<null | "alii" | "mana" | "nakoa">(null);
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [zip, setZip] = useState("");
  const [handle, setHandle] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHandle(sessionStorage.getItem("makoa_handle") || "");
      setPhone(sessionStorage.getItem("makoa_phone") || "");
    }
  }, []);

  async function handleConfirm() {
    setSubmitting(true);
    const tier_flag = q1 === "Leadership and vision" ? "alii" : q1 === "Skills and service" ? "mana" : "nakoa";

    const submissionData = {
      handle,
      phone,
      q1,
      q2,
      zip,
      pledge_amount: 9.99,
      timestamp: new Date().toISOString(),
      tier_flag,
    };

    console.log("[GatePage] Pledge confirmed — saving gate submission:", submissionData);

    // Call XI Agent
    let xiMessage = "";
    let xiTier = tier_flag;
    try {
      const xiResponse = await callXIAgent({ handle, q1, q2, zip, tier_flag });
      xiMessage = xiResponse.message;
      xiTier = xiResponse.tier;
      console.log("[GatePage] XI Agent response:", xiResponse);
    } catch (err) {
      console.error("[GatePage] XI Agent error:", err);
    }

    // Save to Supabase with XI-assigned tier
    try {
      const { data, error } = await supabase.from("gate_submissions").insert({
        handle: submissionData.handle,
        phone: submissionData.phone,
        q1: submissionData.q1,
        q2: submissionData.q2,
        zip: submissionData.zip,
        pledge_amount: submissionData.pledge_amount,
        tier_flag: xiTier || submissionData.tier_flag,
      });
      if (error) {
        console.error("[GatePage] Supabase insert error:", error);
      } else {
        console.log("[GatePage] Gate submission saved successfully:", data);
      }
    } catch (err) {
      console.error("[GatePage] Unexpected error saving gate submission:", err);
    }

    // Store for confirm page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("makoa_q1", q1);
      sessionStorage.setItem("makoa_q2", q2);
      sessionStorage.setItem("makoa_zip", zip);
      sessionStorage.setItem("makoa_xi_message", xiMessage);
      sessionStorage.setItem("makoa_xi_tier", xiTier);
    }

    setSubmitting(false);
    setPledgeOpen(false);
    router.push("/confirm");
  }

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
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

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

      {/* Declaration */}
      <div style={{
        padding: "28px 24px",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "1rem",
          color: "rgba(232,224,208,0.75)",
          lineHeight: 2.2,
          margin: 0,
        }}>
          This is not a club. This is not a program. This is an order — under the Malu Trust — building something that will outlast every man in it. Entrance is earned. Not purchased. The 72 is where brothers are sworn in. The oath is the only authority here.
        </p>
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

          <div style={{
            borderLeft: "2px solid rgba(176,142,80,0.5)",
            paddingLeft: 14,
            marginBottom: 18,
          }}>
            {[
              "4am ice bath as the Flower Moon sets over the Pacific.",
              "72 hours of war room and reset.",
              "Brothers sworn in at the founding fire.",
              "The only event where elevation happens.",
            ].map(line => (
              <p key={line} style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                color: "rgba(232,224,208,0.7)",
                fontSize: "0.95rem",
                lineHeight: 2.2,
                margin: 0,
              }}>{line}</p>
            ))}
          </div>

          {/* Three pack cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
            <div style={{ border: "1px solid rgba(176,142,80,0.4)", borderRadius: 8, padding: "12px 8px", background: "rgba(176,142,80,0.04)" }}>
              <p style={{ color: GOLD, fontSize: "0.6rem", marginBottom: 8, textAlign: "center" }}>👑 Aliʻi</p>
              {["Boardroom", "72hr War Room", "Embassy Suites", "Ice bath 4am", "Founding gear", "Council seat"].map(i => (
                <p key={i} style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", lineHeight: 1.8, textAlign: "center" }}>{i}</p>
              ))}
              <p style={{ color: "#e05c5c", fontSize: "0.4rem", textAlign: "center", marginTop: 6, fontWeight: 600 }}>12 seats open</p>
            </div>
            <div style={{ border: "1px solid rgba(88,166,255,0.3)", borderRadius: 8, padding: "12px 8px", background: "rgba(88,166,255,0.03)" }}>
              <p style={{ color: BLUE, fontSize: "0.6rem", marginBottom: 8, textAlign: "center" }}>🌀 Mana</p>
              {["Mastermind", "72hr reset", "Hampton Inn", "Ice bath 4am", "Brotherhood", "Sworn in"].map(i => (
                <p key={i} style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", lineHeight: 1.8, textAlign: "center" }}>{i}</p>
              ))}
              <p style={{ color: "#f0883e", fontSize: "0.4rem", textAlign: "center", marginTop: 6, fontWeight: 600 }}>20 seats open</p>
            </div>
            <div style={{ border: "1px solid rgba(63,185,80,0.3)", borderRadius: 8, padding: "12px 8px", background: "rgba(63,185,80,0.03)" }}>
              <p style={{ color: GREEN, fontSize: "0.6rem", marginBottom: 8, textAlign: "center" }}>⚔ Nā Koa</p>
              {["2-day pass", "4am Sat+Sun", "Ice bath free", "Beach training", "Full moon"].map(i => (
                <p key={i} style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", lineHeight: 1.8, textAlign: "center" }}>{i}</p>
              ))}
              <p style={{ color: GREEN, fontSize: "0.4rem", textAlign: "center", marginTop: 6, fontWeight: 600 }}>Open · $49.99</p>
            </div>
          </div>

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
            href="https://t.me/+dsS4Mz0p5wM4OGYx"
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
