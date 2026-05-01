"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOLD      = "#b08e50";
const GOLD_DIM  = "rgba(176,142,80,0.15)";
const GOLD_BORDER = "rgba(176,142,80,0.25)";
const GOLD_40   = "rgba(176,142,80,0.4)";
const CREAM     = "#e8e0d0";
const FLAME     = "#ff4e1f";
const BG        = "#000";

const ROLES = [
  {
    id: "alii",
    label: "Aliʻi",
    sub: "Leader · Founder · Capital",
    desc: "You've always led. But you've done most of it alone, and you know it.",
    icon: "◈",
  },
  {
    id: "mana",
    label: "Mana",
    sub: "Builder · Operator · Manager",
    desc: "You make everything work. Most people take the credit. We see what you actually do.",
    icon: "◆",
  },
  {
    id: "na_koa",
    label: "Nā Koa",
    sub: "Warrior · Field · Support",
    desc: "You show up when others disappear. You hold the line when it counts. That's rare.",
    icon: "◇",
  },
];

type Stage = "claim" | "badge" | "reveal";

export default function PreGatePage() {
  const [stage, setStage] = useState<Stage>("claim");
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({ name: "", territory: "", email: "", phone: "" });
  const [role, setRole] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [claimData, setClaimData] = useState({ name: "", territory: "", role: "" });
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (stage === "badge") {
      const interval = setInterval(() => setPulseCount(n => n + 1), 1200);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const formReady = form.name.trim() && form.territory.trim() && form.email.trim() && role;

  async function handleClaim() {
    if (!formReady) return;
    setSubmitting(true);
    setError("");

    try {
      const { error: dbError } = await supabase
        .from("pregate_claims")
        .insert({
          name: form.name.trim(),
          territory: form.territory.trim(),
          role,
          email: form.email.trim(),
          phone: form.phone.trim() || null,
        });

      if (dbError) throw dbError;

      setClaimData({
        name: form.name.trim(),
        territory: form.territory.trim(),
        role: ROLES.find(r => r.id === role)?.label || role,
      });
      setStage("badge");
      setTimeout(() => setStage("reveal"), 3200);
    } catch {
      setError("Connection failed. Try again.");
    }
    setSubmitting(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      fontFamily: "'JetBrains Mono', monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingBottom: 80,
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        @keyframes breathe { 0%,100%{opacity:0.6;} 50%{opacity:1;} }
        @keyframes badgePulse { 0%,100%{box-shadow:0 0 0 0 rgba(176,142,80,0.4);} 50%{box-shadow:0 0 0 24px rgba(176,142,80,0);} }
        @keyframes flamePulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        .role-card:hover { border-color: rgba(176,142,80,0.5) !important; background: rgba(176,142,80,0.08) !important; }
        .role-card.selected { border-color: rgba(176,142,80,0.7) !important; background: rgba(176,142,80,0.12) !important; }
        input::placeholder { color: rgba(176,142,80,0.2); }
        input:focus { border-color: rgba(176,142,80,0.5) !important; outline: none; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(176,142,80,0.3); }
        .cta-btn { transition: all 0.2s; }
      `}</style>

      {/* ── STICKY TAGLINE BANNER ──────────────────────────────────────── */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        background: "rgba(0,0,0,0.95)",
        borderBottom: `1px solid ${GOLD_BORDER}`,
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        backdropFilter: "blur(12px)",
        boxSizing: "border-box",
      }}>
        <span style={{ color: GOLD, fontSize: "9px", letterSpacing: "0.1em", opacity: 0.5, flexShrink: 0 }}>◈</span>
        <p style={{
          color: GOLD,
          fontSize: "clamp(9px, 2vw, 12px)",
          letterSpacing: "0.22em",
          textAlign: "center",
          margin: 0,
          lineHeight: 1.5,
        }}>
          THE WORLDWIDE LEADER NETWORK · FOUNDING SEATS OPEN THIS MAY · GATE CLOSES ON THE BLUE MOON
        </p>
        <span style={{ color: FLAME, fontSize: "9px", animation: "flamePulse 1.5s ease-in-out infinite", flexShrink: 0 }}>●</span>
      </div>

      {/* Scanline */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: "none", zIndex: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }} />

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px 0",
        flex: 1,
      }}>

      {/* ── STAGE: CLAIM ─────────────────────────────────────────────── */}
      {stage === "claim" && (
        <div style={{
          width: "100%", maxWidth: "440px",
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
          position: "relative", zIndex: 1,
        }}>

          {/* Oracle eye */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              border: `1px solid ${GOLD_BORDER}`,
              margin: "0 auto 16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "pulse 2.4s ease-in-out infinite",
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: GOLD, opacity: 0.8 }} />
            </div>
            <p style={{ color: GOLD, fontSize: "11px", letterSpacing: "0.35em", opacity: 0.6, marginBottom: 12 }}>
              THE ORACLE · PRE-GATE
            </p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "clamp(2rem, 7vw, 2.8rem)",
              color: CREAM,
              fontWeight: 300,
              margin: "0 0 14px",
              lineHeight: 1.1,
            }}>
              You already knew<br />something was missing.
            </h1>
            <p style={{
              fontSize: "14px",
              color: "rgba(232,224,208,0.4)",
              lineHeight: 1.9,
              maxWidth: 340,
              margin: "0 auto 20px",
            }}>
              You lead people. You hold the line.<br />
              Most days you do it completely alone.<br />
              That ends here. Wherever you are.
            </p>

            {/* 7GNet hook */}
            <div style={{
              border: `1px solid ${GOLD_BORDER}`,
              borderRadius: 8,
              padding: "14px 18px",
              background: "rgba(176,142,80,0.04)",
              textAlign: "left",
              marginBottom: 4,
            }}>
              <p style={{ color: GOLD, fontSize: "10px", letterSpacing: "0.3em", marginBottom: 8, opacity: 0.7 }}>
                FREE WITH EVERY CLAIM
              </p>
              <p style={{ color: CREAM, fontSize: "15px", lineHeight: 1.6, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                Your 7GNet app seat — the signal network we&apos;re building this May and releasing this June.
              </p>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "13px", lineHeight: 1.7, marginTop: 8 }}>
                Worldwide leader network. Private channels by territory. Brother-to-brother intelligence.
                Yours free when the gate opens. Founding-only access.
              </p>
            </div>
          </div>

          {/* Role selector */}
          <p style={{ color: GOLD, fontSize: "11px", letterSpacing: "0.25em", marginBottom: 12, opacity: 0.7 }}>
            WHO ARE YOU IN THE ROOM
          </p>
          <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
            {ROLES.map(r => (
              <div
                key={r.id}
                className={`role-card${role === r.id ? " selected" : ""}`}
                onClick={() => setRole(r.id)}
                style={{
                  border: `1px solid ${role === r.id ? "rgba(176,142,80,0.7)" : GOLD_BORDER}`,
                  background: role === r.id ? "rgba(176,142,80,0.12)" : "rgba(176,142,80,0.03)",
                  borderRadius: 6,
                  padding: "14px 16px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span style={{ color: GOLD, fontSize: "1.1rem", flexShrink: 0, opacity: 0.8 }}>{r.icon}</span>
                <div>
                  <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 3 }}>
                    <span style={{ color: CREAM, fontSize: "14px", fontWeight: 700 }}>{r.label}</span>
                    <span style={{ color: GOLD, fontSize: "11px", opacity: 0.6 }}>{r.sub}</span>
                  </div>
                  <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "13px", lineHeight: 1.5 }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form fields */}
          <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
            {[
              { key: "name", placeholder: "Your full name", type: "text", required: true },
              { key: "territory", placeholder: "Your territory — city, region, or country", type: "text", required: true },
              { key: "email", placeholder: "Your email — required to receive your 7GNet seat", type: "email", required: true },
              { key: "phone", placeholder: "Phone (optional — for gate text from the Steward)", type: "tel", required: false },
            ].map(f => (
              <div key={f.key}>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    border: `1px solid ${f.required && !form[f.key as keyof typeof form] && form.name ? "rgba(176,142,80,0.15)" : GOLD_BORDER}`,
                    color: GOLD,
                    fontSize: "14px",
                    fontFamily: "'JetBrains Mono', monospace",
                    padding: "13px 16px",
                    width: "100%",
                    borderRadius: 4,
                    letterSpacing: "0.04em",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Two paths */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 20,
            padding: "14px 16px",
            background: "rgba(176,142,80,0.03)",
            border: `1px solid ${GOLD_BORDER}`,
            borderRadius: 6,
          }}>
            <div>
              <p style={{ color: GOLD, fontSize: "10px", letterSpacing: "0.2em", marginBottom: 6, opacity: 0.7 }}>WORLDWIDE</p>
              <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "12px", lineHeight: 1.6 }}>
                Join the waiting list. 7GNet app seat secured. Gate opens to your territory.
              </p>
            </div>
            <div style={{ borderLeft: `1px solid ${GOLD_BORDER}`, paddingLeft: 14 }}>
              <p style={{ color: FLAME, fontSize: "10px", letterSpacing: "0.2em", marginBottom: 6, opacity: 0.85 }}>IN PERSON · HAWAII</p>
              <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "12px", lineHeight: 1.6 }}>
                Join us this May. Bring a team. Founding Aliʻi seat. 48 hours West Oʻahu.
              </p>
            </div>
          </div>

          {error && (
            <p style={{ color: "#e05c5c", fontSize: "13px", marginBottom: 12, textAlign: "center" }}>{error}</p>
          )}

          <button
            onClick={handleClaim}
            disabled={submitting || !formReady}
            className="cta-btn"
            style={{
              width: "100%",
              background: formReady ? GOLD_DIM : "transparent",
              border: `1px solid ${formReady ? GOLD_40 : GOLD_BORDER}`,
              color: GOLD,
              fontSize: "14px",
              letterSpacing: "0.22em",
              padding: "16px",
              cursor: (!formReady || submitting) ? "not-allowed" : "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              borderRadius: 4,
              opacity: !formReady ? 0.35 : 1,
              fontWeight: 700,
            }}
          >
            {submitting ? "CLAIMING..." : "CLAIM YOUR TERRITORY →"}
          </button>

          <p style={{
            textAlign: "center",
            color: "rgba(176,142,80,0.25)",
            fontSize: "12px",
            marginTop: 20,
            lineHeight: 1.9,
          }}>
            No payment. No pitch.<br />
            Real leaders don&apos;t need another network.<br />
            They need a room where they can speak freely.
          </p>
        </div>
      )}

      {/* ── STAGE: BADGE ─────────────────────────────────────────────── */}
      {stage === "badge" && (
        <div style={{
          textAlign: "center",
          animation: "fadeUp 0.6s ease forwards",
          position: "relative", zIndex: 1,
        }}>
          <div style={{
            width: 160, height: 160, borderRadius: "50%",
            border: `1px solid ${GOLD}`,
            margin: "0 auto 32px",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column",
            animation: "badgePulse 1.6s ease-in-out infinite",
            background: "rgba(176,142,80,0.05)",
          }}>
            <span style={{ color: GOLD, fontSize: "2rem", marginBottom: 6 }}>
              {ROLES.find(r => r.id === role)?.icon}
            </span>
            <span style={{ color: GOLD, fontSize: "11px", letterSpacing: "0.2em" }}>CLAIMED</span>
          </div>

          <p style={{ color: GOLD, fontSize: "11px", letterSpacing: "0.3em", marginBottom: 10, opacity: 0.6 }}>
            TERRITORY CLAIMED
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "2rem",
            color: CREAM,
            fontWeight: 300,
            margin: "0 0 8px",
          }}>
            {claimData.name}
          </h2>
          <p style={{ color: GOLD, fontSize: "14px", letterSpacing: "0.15em", marginBottom: 6 }}>
            {claimData.territory.toUpperCase()}
          </p>
          <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "12px", letterSpacing: "0.2em" }}>
            {claimData.role.toUpperCase()} · MĀKOA ORDER
          </p>

          <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 8 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: GOLD,
                opacity: pulseCount % 3 === i ? 1 : 0.2,
                transition: "opacity 0.3s",
              }} />
            ))}
          </div>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "11px", marginTop: 16, letterSpacing: "0.2em" }}>
            THE ORACLE IS WATCHING
          </p>
        </div>
      )}

      {/* ── STAGE: REVEAL ─────────────────────────────────────────────── */}
      {stage === "reveal" && (
        <div style={{
          width: "100%", maxWidth: "460px",
          animation: "fadeUp 0.8s ease forwards",
          position: "relative", zIndex: 1,
        }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p style={{ color: GOLD, fontSize: "11px", letterSpacing: "0.35em", opacity: 0.5, marginBottom: 16 }}>
              THE ORACLE SPEAKS
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.8rem, 6vw, 2.4rem)",
              color: CREAM,
              fontWeight: 300,
              margin: "0 0 16px",
              lineHeight: 1.15,
            }}>
              You knew before<br />you got here.
            </h2>
            <div style={{
              width: 60, height: 1,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              margin: "0 auto 24px",
            }} />
            <p style={{
              fontSize: "15px",
              color: "rgba(232,224,208,0.55)",
              lineHeight: 1.9,
              maxWidth: 360,
              margin: "0 auto",
            }}>
              Your territory is claimed. Your 7GNet seat is reserved.<br />
              Watch for the email