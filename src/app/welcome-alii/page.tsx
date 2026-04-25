"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { usePageTracker } from "@/hooks/use-page-tracker";

const GOLD = "#D4A668";
const GOLD_40 = "rgba(212,166,104,0.4)";
const GOLD_20 = "rgba(212,166,104,0.2)";
const GOLD_DIM = "rgba(212,166,104,0.6)";
const GOLD_10 = "rgba(212,166,104,0.1)";
const BG = "#04060a";
const TEXT = "#e8e0d0";
const TEXT_DIM = "rgba(232,224,208,0.65)";

function WelcomeContent() {
  usePageTracker("welcome-alii");
  const searchParams = useSearchParams();
  const [name, setName] = useState("Brother");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const n = searchParams.get("name") || searchParams.get("handle") || "";
    if (n) setName(n);
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, [searchParams]);

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      color: TEXT,
      fontFamily: "'JetBrains Mono', monospace",
      paddingBottom: 80,
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes goldGlow { 0%,100% { box-shadow:0 0 20px rgba(212,166,104,0.15); } 50% { box-shadow:0 0 60px rgba(212,166,104,0.45); } }
        @keyframes breathe { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        @keyframes sealPulse { 0%,100% { transform:scale(1); opacity:0.8; } 50% { transform:scale(1.06); opacity:1; } }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "80px 24px 64px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(212,166,104,0.1) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_40}, transparent)`, marginBottom: 48 }} />

        {/* Seal */}
        <div style={{
          width: 72, height: 72,
          borderRadius: "50%",
          border: `2px solid ${GOLD_40}`,
          background: GOLD_10,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px",
          animation: "sealPulse 3s ease-in-out infinite",
        }}>
          <span style={{ color: GOLD, fontSize: "1.8rem" }}>◈</span>
        </div>

        <p style={{
          color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.35em",
          marginBottom: 16, animation: "fadeUp 0.7s ease 0.1s both",
        }}>
          MĀKOA™ BROTHERHOOD · MALU TRUST™ · FOUNDING 48
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: GOLD,
          fontSize: "clamp(2.4rem, 9vw, 4rem)",
          lineHeight: 1.1,
          margin: "0 0 16px",
          fontWeight: 400,
          animation: "fadeUp 0.8s ease 0.2s both",
        }}>
          Welcome, Aliʻi {name}
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "rgba(232,224,208,0.6)",
          fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
          lineHeight: 1.6,
          animation: "fadeUp 0.8s ease 0.35s both",
        }}>
          Your seat is claimed.
        </p>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 0" }}>

        {/* ── SEALED CONFIRMATION ──────────────────────────────────────────────── */}
        <div style={{
          border: `2px solid ${GOLD_40}`,
          borderRadius: 14,
          background: "linear-gradient(135deg, #0f1018 0%, #080a0f 100%)",
          padding: "36px 28px",
          marginBottom: 40,
          position: "relative",
          overflow: "hidden",
          animation: "goldGlow 5s ease-in-out infinite",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(212,166,104,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.28em", marginBottom: 20 }}>
            ◈ YOUR NAME IS NOW SEALED ON THE PALAPALA™
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: TEXT,
            fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
            lineHeight: 2.0,
            marginBottom: 24,
          }}>
            Brother,<br /><br />
            You are one of the 20 founding Aliʻi of the Mākoa Brotherhood under the Malu Trust™. Your name is permanent. Your seat is inheritable. The order does not take back what was given.
          </p>

          <div style={{ height: 1, background: GOLD_20, margin: "24px 0" }} />

          <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.22em", marginBottom: 16 }}>
            YOU ENTER WITH
          </p>

          <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
            {[
              "Lifelong seat on the Aliʻi Council",
              "1% equity in Mākoa Trade Co.",
              "0.5% of global revenue · perpetual · inheritable",
              "Territorial charter rights",
              "Perpetual share of the Mayday 48™ Aliʻi pool",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ color: GOLD, fontSize: "16px", flexShrink: 0, marginTop: 2 }}>◈</span>
                <p style={{ color: TEXT_DIM, fontSize: "18px", lineHeight: 1.5 }}>{item}</p>
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
            The founding window runs May 1 – May 31 (Blue Moon sealing at 11:11 PM HST). After that, it closes permanently.
          </p>
        </div>

        {/* ── VALUATION CONTEXT ────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(212,166,104,0.03)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "28px 24px",
          marginBottom: 40,
          opacity: revealed ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.22em", marginBottom: 16 }}>
            WHAT YOU ARE CO-FOUNDING
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: TEXT,
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            lineHeight: 1.9,
            marginBottom: 20,
          }}>
            As we build together, know this: using standard pre-revenue valuation methods (Berkus and Scorecard), the entire platform currently holds a speculative pre-money value of{" "}
            <span style={{ color: GOLD, fontWeight: 700 }}>$1,000,000 – $1,500,000</span>.
          </p>

          <p style={{ color: TEXT_DIM, fontSize: "17px", lineHeight: 1.9, marginBottom: 16 }}>
            This is not cash in hand — it reflects the strength of our 100-year vision, anti-capture governance under the Malu Trust™, and the XI keeper layer. The number will grow as we execute Mayday 48™ and build real chapters and trade.
          </p>

          <div style={{
            background: "rgba(0,0,0,0.3)",
            border: `1px solid rgba(212,166,104,0.08)`,
            borderRadius: 8,
            padding: "16px 20px",
          }}>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "15px", lineHeight: 1.7 }}>
              Your 1% equity is not a token. It is a founding stake in a sovereign trade order designed to last generations. It passes to your family. It cannot be sold to outside markets.
            </p>
          </div>
        </div>

        {/* ── NEXT STEPS ───────────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(212,166,104,0.03)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "28px 24px",
          marginBottom: 40,
          opacity: revealed ? 1 : 0,
          transition: "opacity 1s ease 0.5s",
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.22em", marginBottom: 20 }}>
            NEXT STEPS
          </p>

          <div style={{ display: "grid", gap: 16 }}>
            {[
              {
                n: "1",
                title: "Confirm your Mayday 48™ weekend",
                desc: "May 1–3 (Flower Moon) · May 8–10 · May 15–17 · May 29–31 (Blue Moon Sealing). Reply to your text with your weekend.",
              },
              {
                n: "2",
                title: "Form your war party",
                desc: "3–5 brothers who will stand with you. They do not need to be Aliʻi. They need to be men you vouch for.",
              },
              {
                n: "3",
                title: "Prepare for West Oʻahu",
                desc: "Embassy Suites Kapolei. Red shirt, solid. Black slacks. Notebook. Pack light. The brotherhood handles the rest.",
              },
              {
                n: "4",
                title: "Read the Palapala™ again",
                desc: "Once more, before you arrive. Then read it to a brother.",
              },
            ].map(step => (
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
                  <p style={{ color: TEXT, fontSize: "17px", lineHeight: 1.5, marginBottom: 4 }}>{step.title}</p>
                  <p style={{ color: TEXT_DIM, fontSize: "16px", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── STEWARD MESSAGE ──────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(212,166,104,0.04)",
          border: `1px solid ${GOLD_40}`,
          borderRadius: 12,
          padding: "28px 24px",
          marginBottom: 40,
          opacity: revealed ? 1 : 0,
          transition: "opacity 1s ease 0.7s",
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: TEXT,
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            lineHeight: 2.0,
            marginBottom: 20,
          }}>
            If anything in the Palapala™ or Trust does not feel pono, speak now. Otherwise, we stand together as ʻohana under Malu.
          </p>

          <div style={{ height: 1, background: GOLD_20, margin: "20px 0" }} />

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
            lineHeight: 1.7,
            marginBottom: 4,
          }}>
            Mālama pono, brother.
          </p>
          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "14px", letterSpacing: "0.12em" }}>
            — Steward 0001 · Mākoa™ Brotherhood · Malu Trust™
          </p>
        </div>

        {/* ── LINKS ────────────────────────────────────────────────────────────── */}
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
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
            {[
              { href: "/palapala", label: "PALAPALA™" },
              { href: "/trust", label: "WHAT WE ARE" },
              { href: "/founding48", label: "MAYDAY 48™" },
            ].map(link => (
              <a key={link.href} href={link.href} style={{
                color: "rgba(212,166,104,0.35)",
                fontSize: "13px",
                letterSpacing: "0.15em",
                textDecoration: "none",
              }}>{link.label}</a>
            ))}
          </div>
          <p style={{ color: GOLD_DIM, fontSize: "15px", letterSpacing: "0.14em", marginBottom: 6, fontWeight: 600 }}>
            makoa.live
          </p>
          <p style={{ color: "rgba(212,166,104,0.15)", fontSize: "13px", letterSpacing: "0.12em", lineHeight: 1.8 }}>
            Mākoa™, Malu Trust™, Mayday 48™, and Palapala™ are trademarks of the Malu Trust.<br />
            All rights reserved. © 2026 Malu Trust.
          </p>
        </div>

      </div>
    </div>
  );
}

export default function WelcomeAliiPage() {
  return (
    <Suspense fallback={
      <div style={{ background: "#04060a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(212,166,104,0.4)", fontFamily: "'JetBrains Mono', monospace", fontSize: "16px", letterSpacing: "0.2em" }}>
          LOADING...
        </p>
      </div>
    }>
      <WelcomeContent />
    </Suspense>
  );
}
