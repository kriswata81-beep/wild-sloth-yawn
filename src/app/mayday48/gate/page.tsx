"use client";
import { useState } from "react";
import { usePageTracker } from "@/hooks/use-page-tracker";

const GOLD = "#D4A668";
const GOLD_40 = "rgba(212,166,104,0.4)";
const GOLD_20 = "rgba(212,166,104,0.2)";
const GOLD_10 = "rgba(212,166,104,0.1)";
const GOLD_DIM = "rgba(212,166,104,0.6)";
const FLAME = "#ff4e1f";
const BG = "#04060a";
const TEXT = "#e8e0d0";
const TEXT_DIM = "rgba(232,224,208,0.55)";

const WEEKENDS = [
  { value: "may1-3", label: "May 1–3 · Flower Moon opening" },
  { value: "may8-10", label: "May 8–10 · Weekend 2" },
  { value: "may15-17", label: "May 15–17 · Weekend 3" },
  { value: "may29-31", label: "May 29–31 · Blue Moon sealing" },
  { value: "unsure", label: "Not sure yet" },
];

const NEXT_STEPS = [
  {
    n: "1",
    title: "XI logs your entry in the XI.TRUST vault.",
    desc: "Your info is encrypted. Only XI can read it.",
  },
  {
    n: "2",
    title: "XI sends a text to your phone with a link to /mayday48/paywall",
    desc: "The page where the price of the founder seat is revealed and the application begins.",
  },
  {
    n: "3",
    title: "If you pay, a Mākoa profile page is minted for you",
    desc: "at makoa.live/m/{your-avatar} — your home in the order. Your private notebook (Lock Trunk), your charter, your book reader with notes alongside.",
  },
  {
    n: "4",
    title: "The Steward (makoa0001) is notified.",
    desc: "He will meet you before the weekend.",
  },
];

export default function Mayday48GatePage() {
  usePageTracker("mayday48-gate");
  const [avatarName, setAvatarName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [weekend, setWeekend] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const formReady = avatarName.trim() && email.trim() && phone.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formReady) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/gate-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarName, email, phone, weekend }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Try again or email wakachief@gmail.com");
      }
    } catch {
      setError("Something went wrong. Try again or email wakachief@gmail.com");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "16px 18px",
    background: "rgba(212,166,104,0.04)",
    border: `1px solid ${GOLD_20}`,
    borderRadius: 8,
    color: TEXT,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "17px",
    outline: "none",
    boxSizing: "border-box",
    letterSpacing: "0.03em",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    letterSpacing: "0.22em",
    color: GOLD_DIM,
    marginBottom: 8,
    fontFamily: "'JetBrains Mono', monospace",
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100%{opacity:0.5;}50%{opacity:1;} }
        @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.35;} }
        @keyframes goldGlow { 0%,100% { box-shadow:0 0 16px rgba(212,166,104,0.15); } 50% { box-shadow:0 0 48px rgba(212,166,104,0.45); } }
        input::placeholder, textarea::placeholder { color: rgba(212,166,104,0.2); }
        input:focus { border-color: rgba(212,166,104,0.5) !important; }
        .radio-option { cursor: pointer; transition: background 0.15s, border-color 0.15s; }
        .radio-option:hover { background: rgba(212,166,104,0.05) !important; }
        .cta-btn { transition: transform 0.15s, box-shadow 0.15s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(212,166,104,0.4); }
        .cta-btn:active { transform: translateY(0); }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "72px 24px 56px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(212,166,104,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_40}, transparent)`, marginBottom: 48 }} />

        <p style={{
          color: GOLD_DIM, fontSize: "14px", letterSpacing: "0.35em",
          marginBottom: 20, animation: "fadeUp 0.7s ease 0.1s both",
        }}>
          ◈ MAYDAY 48 GATE
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: GOLD,
          fontSize: "clamp(2.8rem, 10vw, 5rem)",
          lineHeight: 1.05,
          margin: "0 0 20px",
          letterSpacing: "-0.02em",
          fontWeight: 400,
          animation: "fadeUp 0.8s ease 0.2s both",
        }}>
          The Oracle&apos;s Ear
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "rgba(232,224,208,0.6)",
          fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
          lineHeight: 1.6,
          animation: "fadeUp 0.8s ease 0.35s both",
        }}>
          Three answers. Then I text you.
        </p>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px 0" }}>

        {/* ── PRICE REVEAL ──────────────────────────────────────────────────── */}
        <div style={{
          border: `2px solid ${GOLD_40}`,
          borderRadius: 14,
          background: "linear-gradient(135deg, #0f1018 0%, #080a0f 100%)",
          padding: "32px 28px",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden",
          animation: "goldGlow 5s ease-in-out infinite",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(212,166,104,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.28em", marginBottom: 20 }}>
            ALIʻI FOUNDER SEAT · MAYDAY 48
          </p>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: GOLD,
              fontSize: "clamp(3rem, 12vw, 4.5rem)",
              fontWeight: 400,
              lineHeight: 1,
              margin: 0,
            }}>$4,997</p>
            <p style={{
              color: "rgba(232,224,208,0.5)",
              fontSize: "17px",
              lineHeight: 1.5,
              paddingBottom: 6,
            }}>one-time · founding seat</p>
          </div>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.6)",
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            lineHeight: 1.7,
            marginBottom: 24,
          }}>
            1% equity in Mākoa Trade Co. · 0.5% of global revenue forever · inheritable
          </p>

          <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
            {[
              "5 days · Tue–Sun · Embassy Suites Kapolei",
              "All meals at the table",
              "HNL airport pickup + dropoff",
              "Both ice baths · Ko Olina",
              "All War Room + Trade Co. sessions",
              "Founding fire + Palapala oath",
              "Aliʻi gear pack — ring · patch · coin · manual",
              "Territorial charter rights",
              "Aliʻi Council seat for life",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ color: GOLD, fontSize: "16px", flexShrink: 0, marginTop: 1 }}>◈</span>
                <p style={{ color: "rgba(232,224,208,0.75)", fontSize: "17px", lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>

          <div style={{
            background: "rgba(0,0,0,0.3)",
            border: `1px solid rgba(212,166,104,0.1)`,
            borderRadius: 8,
            padding: "14px 18px",
          }}>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "15px", lineHeight: 1.7 }}>
              Team of 3–5 brothers required · Cannot be sponsored · 20 seats total · 5 per weekend
            </p>
          </div>
        </div>

        {/* ── INTRO ─────────────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(212,166,104,0.03)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "28px 24px",
          marginBottom: 40,
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
            lineHeight: 2.0,
            marginBottom: 16,
          }}>
            You are standing at the gate. XI is listening.
          </p>
          <p style={{ color: TEXT_DIM, fontSize: "18px", lineHeight: 1.9 }}>
            Enter your name, your signal line, and your phone. I will text you a link to the next step — where you&apos;ll see the price of the seat and the path forward.
          </p>
          <div style={{ height: 1, background: GOLD_20, margin: "20px 0" }} />
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
            lineHeight: 1.7,
          }}>
            I do not email. I text. Phones are closer to hands than inboxes are.
          </p>
        </div>

        {/* ── FORM ──────────────────────────────────────────────────────────── */}
        {submitted ? (
          <div style={{
            background: "rgba(212,166,104,0.05)",
            border: `1px solid ${GOLD_40}`,
            borderRadius: 12,
            padding: "48px 28px",
            textAlign: "center",
            marginBottom: 40,
            animation: "goldGlow 4s ease-in-out infinite",
          }}>
            <span style={{ color: GOLD, fontSize: "2.5rem", display: "block", marginBottom: 20, animation: "breathe 2s ease-in-out infinite" }}>◈</span>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: GOLD,
              fontSize: "clamp(1.3rem, 3vw, 1.6rem)",
              lineHeight: 1.6,
              marginBottom: 16,
            }}>
              XI has your signal.
            </p>
            <p style={{ color: TEXT_DIM, fontSize: "18px", lineHeight: 1.9, marginBottom: 8 }}>
              A text is on its way to your phone.
            </p>
            <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "16px", lineHeight: 1.7 }}>
              If you don&apos;t receive it within 5 minutes,<br />check your number and try again.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
            <div style={{
              background: "rgba(212,166,104,0.03)",
              border: `1px solid ${GOLD_20}`,
              borderRadius: 12,
              padding: "32px 24px",
              display: "grid",
              gap: 24,
            }}>

              {/* Avatar Name */}
              <div>
                <label style={labelStyle}>YOUR AVATAR NAME (what the order should call you)</label>
                <input
                  type="text"
                  value={avatarName}
                  onChange={e => setAvatarName(e.target.value)}
                  placeholder="e.g. Makoa · Koa · Brother K."
                  required
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>YOUR EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={labelStyle}>YOUR PHONE (for the text · international OK)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 808 555 0100"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Weekend */}
              <div>
                <label style={labelStyle}>WHICH WEEKEND ARE YOU DRAWN TO? (optional)</label>
                <div style={{ display: "grid", gap: 8 }}>
                  {WEEKENDS.map(w => (
                    <div
                      key={w.value}
                      className="radio-option"
                      onClick={() => setWeekend(weekend === w.value ? "" : w.value)}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 16px",
                        background: weekend === w.value ? "rgba(212,166,104,0.08)" : "rgba(0,0,0,0.2)",
                        border: `1px solid ${weekend === w.value ? GOLD_40 : "rgba(212,166,104,0.08)"}`,
                        borderRadius: 8,
                      }}
                    >
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%",
                        border: `2px solid ${weekend === w.value ? GOLD : "rgba(212,166,104,0.25)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        transition: "border-color 0.15s",
                      }}>
                        {weekend === w.value && (
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD }} />
                        )}
                      </div>
                      <p style={{
                        color: weekend === w.value ? TEXT : TEXT_DIM,
                        fontSize: "17px",
                        lineHeight: 1.4,
                        transition: "color 0.15s",
                      }}>{w.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <p style={{ color: FLAME, fontSize: "16px", lineHeight: 1.6 }}>{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !formReady}
                className="cta-btn"
                style={{
                  width: "100%",
                  padding: "20px",
                  background: formReady && !loading ? GOLD : "transparent",
                  color: formReady && !loading ? "#000" : GOLD_DIM,
                  border: `1px solid ${formReady && !loading ? GOLD : GOLD_20}`,
                  borderRadius: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  cursor: formReady && !loading ? "pointer" : "not-allowed",
                  opacity: !formReady ? 0.5 : 1,
                  transition: "all 0.2s",
                  animation: formReady && !loading ? "goldGlow 4s ease-in-out infinite" : "none",
                }}
              >
                {loading ? "SENDING..." : "SEND MY TEXT →"}
              </button>
            </div>

            <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "15px", textAlign: "center", marginTop: 14, lineHeight: 1.7 }}>
              XI will text within 5 minutes.<br />
              If you do not receive a text, check your phone number and try again.
            </p>
          </form>
        )}

        {/* ── WHAT HAPPENS NEXT ─────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(212,166,104,0.03)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "28px 24px",
          marginBottom: 40,
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.22em", marginBottom: 20 }}>
            WHAT HAPPENS NEXT
          </p>
          <div style={{ display: "grid", gap: 16 }}>
            {NEXT_STEPS.map(step => (
              <div key={step.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: `1px solid ${GOLD_40}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  background: GOLD_10,
                }}>
                  <span style={{ color: GOLD, fontSize: "14px", fontWeight: 700 }}>{step.n}</span>
                </div>
                <div>
                  <p style={{ color: TEXT, fontSize: "17px", lineHeight: 1.6, marginBottom: 4 }}>{step.title}</p>
                  <p style={{ color: TEXT_DIM, fontSize: "16px", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: GOLD_20, margin: "24px 0" }} />

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
            lineHeight: 1.9,
          }}>
            At no point does a man collect your payment or handle your private data. XI.TRUST holds it all.
          </p>
        </div>

        {/* ── FOOTER LINKS ──────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", paddingTop: 16, borderTop: `1px solid rgba(255,255,255,0.04)` }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "1rem",
            marginBottom: 16,
          }}>
            Hana · Pale · Ola
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
            {[
              { href: "/palapala", label: "PALAPALA" },
              { href: "/trust", label: "WHAT WE ARE" },
              { href: "/founding48", label: "MAYDAY 48" },
              { href: "/sponsor", label: "SPONSOR" },
              { href: "/waitlist", label: "WAITLIST" },
            ].map(link => (
              <a key={link.href} href={link.href} style={{
                color: "rgba(212,166,104,0.3)",
                fontSize: "13px",
                letterSpacing: "0.15em",
                textDecoration: "none",
              }}>{link.label}</a>
            ))}
          </div>
          <p style={{ color: GOLD_DIM, fontSize: "15px", letterSpacing: "0.14em", marginBottom: 6, fontWeight: 600 }}>
            makoa.live
          </p>
          <p style={{ color: "rgba(212,166,104,0.15)", fontSize: "13px", letterSpacing: "0.15em" }}>
            MĀKOA ORDER · MALU TRUST · WEST OAHU · WORLDWIDE · 2026
          </p>
        </div>

      </div>
    </div>
  );
}
