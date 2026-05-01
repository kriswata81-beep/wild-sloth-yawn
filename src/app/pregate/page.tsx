"use client";
import { useState, useEffect } from "react";
import { usePageTracker } from "@/hooks/use-page-tracker";

const GOLD = "#b08e50";
const GOLD_BRIGHT = "#D4A668";
const GOLD_BORDER = "rgba(176,142,80,0.35)";
const GOLD_DIM = "#6e582f";
const CREAM = "#e8e0d0";
const BG = "#04060a";
const FLAME = "#ff4e1f";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5NTI2MDAsImV4cCI6MjAzMDUyODYwMH0.Rnl5VRrpFIVvCi-eE9DomfX8X5SXDoLVxDjf0LA5WNs";

type Role = "founder" | "builder" | "ally";

export default function PregatePage() {
  usePageTracker("pregate");

  const [stage, setStage] = useState<"intro" | "form" | "claimed">("intro");
  const [form, setForm] = useState({ name: "", territory: "", email: "", phone: "" });
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seatsLeft, setSeatsLeft] = useState(12);

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/pregate_claims?select=id&status=eq.claimed`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSeatsLeft(Math.max(0, 12 - data.length));
      })
      .catch(() => {});
  }, []);

  const formReady = form.name.trim() && form.territory.trim() && form.email.trim() && role;

  const handleClaim = async () => {
    if (!formReady) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/pregate_claims`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          avatar_name: form.name,
          territory: form.territory,
          email: form.email,
          phone: form.phone || null,
          role,
          status: "claimed",
        }),
      });
      if (res.ok || res.status === 201) {
        setStage("claimed");
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.message || "Something went wrong. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(176,142,80,0.04)",
    border: `1px solid ${GOLD_BORDER}`,
    borderRadius: 8,
    color: CREAM,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
    letterSpacing: "0.02em",
  };

  const lbl: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    letterSpacing: "0.24em",
    color: GOLD_DIM,
    marginBottom: 7,
    fontFamily: "'JetBrains Mono', monospace",
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: CREAM, fontFamily: "'JetBrains Mono', monospace" }}>

      {/* ── STICKY TAGLINE ──────────────────────────────────────────────────── */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(4,6,10,0.97)",
        borderBottom: `1px solid ${GOLD_BORDER}`,
        padding: "10px 24px",
        textAlign: "center",
        backdropFilter: "blur(8px)",
      }}>
        <p style={{
          fontSize: "clamp(9px, 1.8vw, 12px)",
          letterSpacing: "0.28em",
          color: GOLD,
          margin: 0,
          lineHeight: 1.5,
        }}>
          THE WORLDWIDE LEADER NETWORK &nbsp;·&nbsp; FOUNDING SEATS OPEN THIS MAY &nbsp;·&nbsp; GATE CLOSES ON THE BLUE MOON
        </p>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100%{opacity:0.55;}50%{opacity:1;} }
        @keyframes goldGlow { 0%,100%{box-shadow:0 0 12px rgba(176,142,80,0.12);}50%{box-shadow:0 0 40px rgba(176,142,80,0.4);} }
        input::placeholder { color: rgba(176,142,80,0.18); }
        input:focus { border-color: rgba(176,142,80,0.5) !important; outline: none; }
        .role-card { cursor:pointer; transition: background 0.15s, border-color 0.15s; }
        .role-card:hover { background: rgba(176,142,80,0.06) !important; }
        .cta { transition: transform 0.15s, box-shadow 0.15s; }
        .cta:hover { transform:translateY(-2px); box-shadow:0 8px 36px rgba(176,142,80,0.35); }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        padding: "64px 24px 52px",
        textAlign: "center",
        borderBottom: `1px solid rgba(176,142,80,0.1)`,
        background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <p style={{
          fontSize: "11px", letterSpacing: "0.35em", color: GOLD_DIM,
          marginBottom: 24, animation: "fadeUp 0.7s ease 0.1s both",
        }}>
          ◈ MĀKOA BROTHERHOOD
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: GOLD_BRIGHT,
          fontSize: "clamp(2.6rem, 10vw, 4.8rem)",
          fontWeight: 400,
          lineHeight: 1.08,
          margin: "0 0 20px",
          letterSpacing: "-0.01em",
          animation: "fadeUp 0.8s ease 0.2s both",
        }}>
          Claim Your Seat
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "rgba(232,224,208,0.6)",
          fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
          lineHeight: 1.7,
          maxWidth: 520,
          margin: "0 auto 32px",
          animation: "fadeUp 0.8s ease 0.3s both",
        }}>
          The worldwide leader network — built for men who build, lead, and carry territory.
          Founding seats open this May. Gate closes on the Blue Moon.
        </p>

        {/* seats counter */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          border: `1px solid rgba(255,78,31,0.4)`,
          borderRadius: 6,
          padding: "8px 18px",
          background: "rgba(255,78,31,0.06)",
          animation: "fadeUp 0.8s ease 0.4s both",
        }}>
          <span style={{ color: FLAME, fontSize: "10px", animation: "breathe 1.5s ease-in-out infinite" }}>●</span>
          <span style={{ color: "rgba(232,224,208,0.7)", fontSize: "13px", letterSpacing: "0.15em" }}>
            {seatsLeft} OF 12 FOUNDING SEATS REMAIN
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "44px 24px 80px" }}>

        {/* ── TWO PATHS ────────────────────────────────────────────────────────── */}
        {stage === "intro" && (
          <div style={{ animation: "fadeUp 0.7s ease both" }}>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "11px", letterSpacing: "0.28em", textAlign: "center", marginBottom: 20 }}>
              TWO WAYS TO JOIN
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: `1px solid ${GOLD_BORDER}`, borderRadius: 12, overflow: "hidden", marginBottom: 36 }}>
              {/* Worldwide */}
              <div style={{ padding: "28px 20px", background: "rgba(176,142,80,0.03)" }}>
                <p style={{ color: GOLD, fontSize: "11px", letterSpacing: "0.3em", marginBottom: 12 }}>WORLDWIDE</p>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  color: CREAM,
                  fontSize: "1.15rem",
                  lineHeight: 1.6,
                  marginBottom: 12,
                }}>
                  Get on the waiting list
                </p>
                <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "14px", lineHeight: 1.8 }}>
                  Claim your free 7GNet app seat now. We&apos;re building this May, releasing this June. You&apos;ll be first in.
                </p>
              </div>

              {/* In Person */}
              <div style={{ padding: "28px 20px", borderLeft: `1px solid ${GOLD_BORDER}`, background: "rgba(176,142,80,0.05)" }}>
                <p style={{ color: GOLD, fontSize: "11px", letterSpacing: "0.3em", marginBottom: 12 }}>IN PERSON · HAWAIʻI</p>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  color: CREAM,
                  fontSize: "1.15rem",
                  lineHeight: 1.6,
                  marginBottom: 12,
                }}>
                  Join us this May
                </p>
                <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "14px", lineHeight: 1.8 }}>
                  Bring a team of 3–5. West Oʻahu. Four weekends. 12 founding seats. This is where the order is built.
                </p>
                <a href="/mayday48/gate" style={{
                  display: "inline-block",
                  marginTop: 14,
                  color: GOLD,
                  fontSize: "12px",
                  letterSpacing: "0.2em",
                  textDecoration: "none",
                  borderBottom: `1px solid rgba(176,142,80,0.3)`,
                  paddingBottom: 2,
                }}>
                  JOIN IN PERSON →
                </a>
              </div>
            </div>

            <button
              onClick={() => setStage("form")}
              className="cta"
              style={{
                width: "100%",
                padding: "18px",
                background: GOLD,
                color: "#000",
                border: "none",
                borderRadius: 10,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                cursor: "pointer",
                animation: "goldGlow 4s ease-in-out infinite",
              }}
            >
              CLAIM YOUR FREE 7GNET SEAT →
            </button>

            <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "13px", textAlign: "center", marginTop: 12 }}>
              No payment. No commitment. First access to the network.
            </p>
          </div>
        )}

        {/* ── CLAIM FORM ───────────────────────────────────────────────────────── */}
        {stage === "form" && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <p style={{ color: GOLD_DIM, fontSize: "11px", letterSpacing: "0.28em", marginBottom: 24, textAlign: "center" }}>
              CLAIM YOUR SEAT
            </p>

            {/* 7GNet block */}
            <div style={{
              border: `1px solid ${GOLD_BORDER}`,
              borderRadius: 10,
              padding: "20px 20px",
              marginBottom: 28,
              background: "rgba(176,142,80,0.04)",
            }}>
              <p style={{ color: GOLD, fontSize: "10px", letterSpacing: "0.3em", marginBottom: 8 }}>FREE WITH EVERY CLAIM</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                color: CREAM,
                fontSize: "1.1rem",
                lineHeight: 1.6,
                marginBottom: 6,
              }}>
                Your 7GNet founding app seat
              </p>
              <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "14px", lineHeight: 1.8 }}>
                The signal network we&apos;re building this May and releasing this June. Founders get in first, free, for life.
              </p>
            </div>

            <div style={{ display: "grid", gap: 20, marginBottom: 24 }}>
              <div>
                <label style={lbl}>YOUR NAME *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="What the order calls you" style={inp} />
              </div>

              <div>
                <label style={lbl}>YOUR TERRITORY *</label>
                <input type="text" value={form.territory} onChange={e => setForm(f => ({ ...f, territory: e.target.value }))}
                  placeholder="City · State · Country" style={inp} />
              </div>

              <div>
                <label style={lbl}>YOUR EMAIL * (to receive your 7GNet seat)</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com" style={inp} />
              </div>

              <div>
                <label style={lbl}>YOUR PHONE (optional · for in-person inquiries)</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 808 555 0100" style={inp} />
              </div>
            </div>

            {/* Role */}
            <p style={{ ...lbl, marginBottom: 12 }}>HOW DO YOU LEAD? *</p>
            <div style={{ display: "grid", gap: 8, marginBottom: 28 }}>
              {([
                { v: "founder", label: "FOUNDER", desc: "I build companies and carry teams" },
                { v: "builder", label: "BUILDER", desc: "I build systems, products, and communities" },
                { v: "ally", label: "ALLY", desc: "I support and amplify the men who build" },
              ] as { v: Role; label: string; desc: string }[]).map(r => (
                <div
                  key={r.v}
                  className="role-card"
                  onClick={() => setRole(r.v)}
                  style={{
                    padding: "14px 16px",
                    border: `1px solid ${role === r.v ? "rgba(176,142,80,0.6)" : GOLD_BORDER}`,
                    borderRadius: 8,
                    background: role === r.v ? "rgba(176,142,80,0.08)" : "rgba(176,142,80,0.02)",
                    display: "flex", alignItems: "center", gap: 14,
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%",
                    border: `2px solid ${role === r.v ? GOLD_BRIGHT : "rgba(176,142,80,0.3)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {role === r.v && <div style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD_BRIGHT }} />}
                  </div>
                  <div>
                    <p style={{ color: role === r.v ? CREAM : "rgba(232,224,208,0.6)", fontSize: "13px", letterSpacing: "0.12em", marginBottom: 2 }}>{r.label}</p>
                    <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "13px" }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {error && <p style={{ color: FLAME, fontSize: "14px", marginBottom: 16, lineHeight: 1.6 }}>{error}</p>}

            <button
              onClick={handleClaim}
              disabled={!formReady || loading}
              className="cta"
              style={{
                width: "100%",
                padding: "18px",
                background: formReady && !loading ? GOLD_BRIGHT : "transparent",
                color: formReady && !loading ? "#000" : GOLD_DIM,
                border: `1px solid ${formReady && !loading ? GOLD_BRIGHT : GOLD_BORDER}`,
                borderRadius: 10,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                cursor: formReady && !loading ? "pointer" : "not-allowed",
                opacity: !formReady ? 0.5 : 1,
                transition: "all 0.2s",
                animation: formReady && !loading ? "goldGlow 4s ease-in-out infinite" : "none",
                marginBottom: 16,
              }}
            >
              {loading ? "CLAIMING..." : "CLAIM MY SEAT →"}
            </button>

            <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "13px", textAlign: "center", lineHeight: 1.7 }}>
              No payment required. Your seat is held by your name.
            </p>
          </div>
        )}

        {/* ── CLAIMED CONFIRMATION ─────────────────────────────────────────────── */}
        {stage === "claimed" && (
          <div style={{
            textAlign: "center",
            animation: "fadeUp 0.7s ease both",
            border: `1px solid ${GOLD_BORDER}`,
            borderRadius: 12,
            padding: "48px 28px",
            background: "rgba(176,142,80,0.04)",
          }}>
            <span style={{ color: GOLD_BRIGHT, fontSize: "2.5rem", display: "block", marginBottom: 20, animation: "breathe 2s ease-in-out infinite" }}>◈</span>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: GOLD_BRIGHT,
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 400,
              marginBottom: 16,
              lineHeight: 1.4,
            }}>
              Your territory is claimed.
            </h2>
            <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "16px", lineHeight: 1.9, marginBottom: 8 }}>
              Your 7GNet founding seat is reserved.
            </p>
            <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "14px", lineHeight: 1.8, marginBottom: 28 }}>
              Watch for the email — 7GNet builds this May and releases this June.<br />
              Founders get first access, free, for life.
            </p>
            <a href="/mayday48/gate" style={{
              display: "inline-block",
              padding: "14px 28px",
              border: `1px solid ${GOLD_BORDER}`,
              borderRadius: 8,
              color: GOLD,
              fontSize: "13px",
              letterSpacing: "0.2em",
              textDecoration: "none",
            }}>
              JOIN US IN PERSON THIS MAY →
            </a>
          </div>
        )}

        {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginTop: 56, paddingTop: 20, borderTop: `1px solid rgba(176,142,80,0.08)` }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "0.95rem",
            marginBottom: 14,
          }}>
            7GNet builds this May · Releases this June
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 10 }}>
            {[
              { href: "/mayday48/gate", label: "IN PERSON · HAWAIʻI" },
              { href: "/palapala", label: "PALAPALA" },
              { href: "/", label: "HOME" },
            ].map(l => (
              <a key={l.href} href={l.href} style={{ color: "rgba(176,142,80,0.4)", fontSize: "12px", letterSpacing: "0.15em", textDecoration: "none" }}>
                {l.label}
              </a>
            ))}
          </div>
          <p style={{ color: "rgba(232,224,208,0.15)", fontSize: "12px" }}>
            Mākoa Brotherhood · West Oʻahu · Est. 2026
          </p>
        </div>

      </div>
    </div>
  );
}
