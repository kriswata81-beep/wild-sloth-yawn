"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { usePageTracker } from "@/hooks/use-page-tracker";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#D4A668";
const GOLD_40 = "rgba(212,166,104,0.4)";
const GOLD_20 = "rgba(212,166,104,0.2)";
const GOLD_DIM = "rgba(212,166,104,0.6)";
const GOLD_10 = "rgba(212,166,104,0.1)";
const BG = "#04060a";
const TEXT = "#e8e0d0";
const TEXT_DIM = "rgba(232,224,208,0.65)";
const TEXT_FAINT = "rgba(232,224,208,0.35)";

// Berkus breakdown — shown transparently
const BERKUS_ROWS = [
  { factor: "Sound Idea", score: "$400,000–$450,000", note: "100-year vision · Hawaiian sovereignty · anti-capture doctrine" },
  { factor: "Prototype / Working Product", score: "$150,000–$200,000", note: "makoa.live live · XI keeper layer · gate + intake flow operational" },
  { factor: "Quality Management Team", score: "$100,000–$150,000", note: "Steward 0001 · XI autonomous layer · Aliʻi Council structure" },
  { factor: "Strategic Relationships", score: "$50,000–$100,000", note: "West Oʻahu territory · Kapolei · founding cohort" },
  { factor: "Product Rollout / Sales", score: "$100,000–$150,000", note: "Mayday 48 gate open · 4 gate submissions · founding window live" },
];

const NEXT_STEPS = [
  {
    n: "1",
    title: "Confirm your Mayday 48™ weekend",
    desc: "May 1–3 (Flower Moon) · May 8–10 · May 15–17 · May 29–31 (Blue Moon Sealing). Reply to your text with your weekend choice.",
    action: null,
  },
  {
    n: "2",
    title: "Form your war party",
    desc: "3–5 brothers who will stand with you. They do not need to be Aliʻi. They need to be men you vouch for. Name them before you arrive.",
    action: null,
  },
  {
    n: "3",
    title: "Prepare for West Oʻahu",
    desc: "Kapolei · 808-757-6985. Red shirt, solid. Black slacks. Notebook. Pack light. The brotherhood handles the rest.",
    action: null,
  },
  {
    n: "4",
    title: "Read the Palapala™ again",
    desc: "Once more, before you arrive. Then read it to a brother. The words land differently the second time.",
    action: { label: "READ THE PALAPALA™ →", href: "/palapala" },
  },
];

function WelcomeContent() {
  usePageTracker("welcome-alii");
  const searchParams = useSearchParams();
  const [name, setName] = useState("Brother");
  const [phase, setPhase] = useState(0); // staggered reveal phases
  const [showBerkus, setShowBerkus] = useState(false);
  const [seatsClaimed, setSeatsClaimed] = useState(1);

  useEffect(() => {
    supabase.from("seats_counter").select("seats_claimed").eq("id", 1).single()
      .then(({ data }) => { if (data) setSeatsClaimed(data.seats_claimed); });
  }, []);

  useEffect(() => {
    const n = searchParams.get("name") || searchParams.get("handle") || "";
    if (n) setName(n);

    // Staggered entrance — feels ceremonial, not instant
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 700);
    const t3 = setTimeout(() => setPhase(3), 1100);
    const t4 = setTimeout(() => setPhase(4), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [searchParams]);

  const fadeIn = (p: number): React.CSSProperties => ({
    opacity: phase >= p ? 1 : 0,
    transform: phase >= p ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.8s ease, transform 0.8s ease",
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      color: TEXT,
      fontFamily: "'JetBrains Mono', monospace",
      paddingBottom: 100,
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes goldGlow { 0%,100% { box-shadow:0 0 24px rgba(212,166,104,0.18); } 50% { box-shadow:0 0 64px rgba(212,166,104,0.5); } }
        @keyframes sealSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes sealPulse { 0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(212,166,104,0.3); } 50% { transform:scale(1.04); box-shadow:0 0 0 16px rgba(212,166,104,0); } }
        @keyframes breathe { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .berkus-row:hover { background: rgba(212,166,104,0.06) !important; }
        .next-action:hover { background: rgba(212,166,104,0.12) !important; border-color: rgba(212,166,104,0.5) !important; }
        .reveal-btn:hover { background: rgba(212,166,104,0.1) !important; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "88px 24px 72px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Radial glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(212,166,104,0.12) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_40}, transparent)`, marginBottom: 52 }} />

        {/* Seal */}
        <div style={{
          width: 80, height: 80,
          borderRadius: "50%",
          border: `2px solid ${GOLD_40}`,
          background: GOLD_10,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px",
          animation: "sealPulse 3.5s ease-in-out infinite",
          ...fadeIn(1),
        }}>
          <span style={{ color: GOLD, fontSize: "2rem" }}>◈</span>
        </div>

        {/* Eyebrow */}
        <p style={{
          color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.35em",
          marginBottom: 20,
          ...fadeIn(1),
        }}>
          MĀKOA™ BROTHERHOOD · MALU TRUST™ · FOUNDING 48
        </p>

        {/* Main headline */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: GOLD,
          fontSize: "clamp(2.6rem, 10vw, 4.5rem)",
          lineHeight: 1.05,
          margin: "0 0 20px",
          fontWeight: 400,
          letterSpacing: "-0.01em",
          ...fadeIn(2),
        }}>
          Welcome, Aliʻi {name}
        </h1>

        {/* Sub */}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "rgba(232,224,208,0.55)",
          fontSize: "clamp(1.15rem, 3vw, 1.5rem)",
          lineHeight: 1.6,
          marginBottom: 32,
          ...fadeIn(2),
        }}>
          Your seat is claimed. Your name is sealed.
        </p>

        {/* Founding window pill */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(212,166,104,0.07)",
          border: `1px solid ${GOLD_40}`,
          borderRadius: 100,
          padding: "10px 22px",
          ...fadeIn(3),
        }}>
          <span style={{ color: GOLD, fontSize: "14px", animation: "breathe 2s ease-in-out infinite" }}>🌕</span>
          <p style={{ color: GOLD, fontSize: "13px", letterSpacing: "0.18em", fontWeight: 700 }}>
            FOUNDING WINDOW · MAY 1 – MAY 31 · BLUE MOON SEALING
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: "0 auto", padding: "52px 24px 0" }}>

        {/* ── SEALED CONFIRMATION ──────────────────────────────────────────────── */}
        <div style={{
          border: `2px solid ${GOLD_40}`,
          borderRadius: 16,
          background: "linear-gradient(160deg, #0f1018 0%, #080a0f 100%)",
          padding: "40px 32px",
          marginBottom: 40,
          position: "relative",
          overflow: "hidden",
          animation: "goldGlow 5s ease-in-out infinite",
          ...fadeIn(2),
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(212,166,104,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <p style={{ color: GOLD_DIM, fontSize: "12px", letterSpacing: "0.3em", marginBottom: 24 }}>
            ◈ YOUR NAME IS NOW SEALED ON THE PALAPALA™
          </p>

          {/* Letter */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: TEXT,
            fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
            lineHeight: 2.1,
            marginBottom: 28,
          }}>
            Brother,
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: TEXT,
            fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)",
            lineHeight: 2.0,
            marginBottom: 28,
          }}>
            You are one of the 20 founding Aliʻi of the Mākoa Brotherhood under the Malu Trust™. Your name is permanent. Your seat is inheritable. The order does not take back what was given.
          </p>

          <div style={{ height: 1, background: GOLD_20, margin: "28px 0" }} />

          {/* What you enter with */}
          <p style={{ color: GOLD_DIM, fontSize: "12px", letterSpacing: "0.28em", marginBottom: 20 }}>
            YOU ENTER WITH
          </p>

          <div style={{ display: "grid", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Lifelong seat on the Aliʻi Council", sub: "permanent · non-revocable except by Council vote" },
              { label: "1% equity in Mākoa Trade Co.", sub: "0.5% of global revenue · perpetual · inheritable" },
              { label: "Territorial charter rights", sub: "first-mover in your city · your chapter · your territory" },
              { label: "Perpetual share of the Mayday 48™ Aliʻi pool", sub: "10% of all Trade Co. revenue split among the 20 founding Aliʻi · forever" },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "14px 16px",
                background: "rgba(212,166,104,0.04)",
                border: `1px solid rgba(212,166,104,0.1)`,
                borderRadius: 8,
              }}>
                <span style={{ color: GOLD, fontSize: "18px", flexShrink: 0, marginTop: 2 }}>◈</span>
                <div>
                  <p style={{ color: TEXT, fontSize: "17px", lineHeight: 1.4, marginBottom: 3 }}>{item.label}</p>
                  <p style={{ color: TEXT_FAINT, fontSize: "14px", lineHeight: 1.5 }}>{item.sub}</p>
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
            The founding window runs May 1 – May 31 (Blue Moon sealing at 11:11 PM HST). After that, it closes permanently. There will be cohorts after. There will be no second Founding 48.
          </p>
        </div>

        {/* ── VALUATION SECTION ────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(212,166,104,0.03)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 14,
          padding: "32px 28px",
          marginBottom: 40,
          ...fadeIn(3),
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "12px", letterSpacing: "0.28em", marginBottom: 20 }}>
            WHAT YOU ARE CO-FOUNDING · INDICATIVE VALUATION
          </p>

          {/* The number — big and clear */}
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 16,
            marginBottom: 20,
            flexWrap: "wrap",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: GOLD,
              fontSize: "clamp(2.8rem, 10vw, 4rem)",
              fontWeight: 400,
              lineHeight: 1,
              margin: 0,
            }}>$1M – $1.5M</p>
            <p style={{
              color: TEXT_FAINT,
              fontSize: "15px",
              lineHeight: 1.5,
              paddingBottom: 6,
            }}>speculative pre-money · Berkus + Scorecard methods</p>
          </div>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: TEXT,
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            lineHeight: 1.9,
            marginBottom: 20,
          }}>
            As we build together, know this: using standard pre-revenue valuation methods (Berkus and Scorecard), the entire platform currently holds a speculative pre-money value of{" "}
            <span style={{ color: GOLD }}>$1,000,000 – $1,500,000</span>.
          </p>

          <p style={{ color: TEXT_DIM, fontSize: "17px", lineHeight: 1.9, marginBottom: 20 }}>
            This is not cash in hand — it reflects the strength of our 100-year vision and anti-capture governance. The number will grow as we execute Mayday 48™ and build real chapters and trade.
          </p>

          {/* Equity math box */}
          <div style={{
            background: "rgba(212,166,104,0.07)",
            border: `1px solid ${GOLD_40}`,
            borderRadius: 10,
            padding: "20px 22px",
            marginBottom: 20,
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "12px", letterSpacing: "0.22em", marginBottom: 14 }}>
              YOUR 1% — WHAT IT MEANS TODAY
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { label: "1% of $1M–$1.5M indicative value", value: "$10,000–$15,000 today" },
                { label: "0.5% of global Trade Co. revenue", value: "perpetual · every chapter · every territory" },
                { label: "Inheritable", value: "passes to your family · not to outside markets" },
                { label: "Non-dilutable by design", value: "Malu Trust™ structure protects founding equity" },
              ].map(row => (
                <div key={row.label} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  flexWrap: "wrap",
                }}>
                  <p style={{ color: TEXT_DIM, fontSize: "15px", lineHeight: 1.5 }}>{row.label}</p>
                  <p style={{ color: GOLD, fontSize: "15px", fontWeight: 700, whiteSpace: "nowrap" }}>{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Berkus breakdown — expandable */}
          {!showBerkus ? (
            <button
              className="reveal-btn"
              onClick={() => setShowBerkus(true)}
              style={{
                width: "100%",
                background: "transparent",
                border: `1px solid rgba(212,166,104,0.15)`,
                borderRadius: 8,
                padding: "12px 16px",
                color: GOLD_DIM,
                fontSize: "13px",
                letterSpacing: "0.18em",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                transition: "background 0.2s",
                marginBottom: 20,
              }}
            >
              SEE THE BERKUS BREAKDOWN →
            </button>
          ) : (
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: GOLD_DIM, fontSize: "12px", letterSpacing: "0.22em", marginBottom: 14 }}>
                BERKUS METHOD · FACTOR BREAKDOWN
              </p>
              <div style={{ display: "grid", gap: 2 }}>
                {BERKUS_ROWS.map((row, i) => (
                  <div
                    key={row.factor}
                    className="berkus-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 12,
                      padding: "14px 16px",
                      background: "rgba(0,0,0,0.2)",
                      border: `1px solid rgba(212,166,104,0.06)`,
                      borderRadius: i === 0 ? "8px 8px 0 0" : i === BERKUS_ROWS.length - 1 ? "0 0 8px 8px" : "0",
                      transition: "background 0.15s",
                    }}
                  >
                    <div>
                      <p style={{ color: TEXT, fontSize: "15px", marginBottom: 3 }}>{row.factor}</p>
                      <p style={{ color: TEXT_FAINT, fontSize: "13px", lineHeight: 1.5 }}>{row.note}</p>
                    </div>
                    <p style={{ color: GOLD, fontSize: "14px", fontWeight: 700, whiteSpace: "nowrap", textAlign: "right" }}>{row.score}</p>
                  </div>
                ))}
                {/* Total */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 16px",
                  background: "rgba(212,166,104,0.06)",
                  border: `1px solid ${GOLD_20}`,
                  borderRadius: 8,
                  marginTop: 4,
                }}>
                  <p style={{ color: GOLD, fontSize: "15px", letterSpacing: "0.1em" }}>INDICATIVE TOTAL</p>
                  <p style={{ color: GOLD, fontSize: "18px", fontWeight: 700 }}>$800K – $1.05M</p>
                </div>
              </div>
              <p style={{ color: TEXT_FAINT, fontSize: "13px", lineHeight: 1.7, marginTop: 12 }}>
                Scorecard method adds additional weight for governance structure, 100-year horizon, and anti-capture design — bringing the combined indicative range to $1M–$1.5M.
              </p>
            </div>
          )}

          {/* Legal disclaimer — prominent, not buried */}
          <div style={{
            background: "rgba(0,0,0,0.35)",
            border: `1px solid rgba(212,166,104,0.08)`,
            borderRadius: 8,
            padding: "16px 20px",
          }}>
            <p style={{ color: TEXT_FAINT, fontSize: "13px", lineHeight: 1.8 }}>
              <strong style={{ color: "rgba(232,224,208,0.5)" }}>Indicative valuation disclosure:</strong> This range is a speculative, illustrative estimate prepared using Berkus-method and Scorecard heuristics. It is not a formal appraisal, investment advice, or guarantee of future performance or transaction price. These are private, restricted interests in a pre-revenue order — not publicly traded securities. Seek independent legal and financial advice before relying on any valuation. Prepared by Steward 0001 · April 2026 · USD.
            </p>
          </div>
        </div>

        {/* ── NEXT STEPS ───────────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(212,166,104,0.03)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 14,
          padding: "32px 28px",
          marginBottom: 40,
          ...fadeIn(3),
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "12px", letterSpacing: "0.28em", marginBottom: 24 }}>
            YOUR NEXT FOUR MOVES
          </p>

          <div style={{ display: "grid", gap: 16 }}>
            {NEXT_STEPS.map(step => (
              <div key={step.n} style={{
                display: "flex", gap: 18, alignItems: "flex-start",
                padding: "18px 16px",
                background: "rgba(0,0,0,0.2)",
                border: `1px solid rgba(212,166,104,0.08)`,
                borderRadius: 10,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  border: `1px solid ${GOLD_40}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  background: GOLD_10,
                }}>
                  <span style={{ color: GOLD, fontSize: "15px", fontWeight: 700 }}>{step.n}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: TEXT, fontSize: "17px", lineHeight: 1.4, marginBottom: 6 }}>{step.title}</p>
                  <p style={{ color: TEXT_DIM, fontSize: "15px", lineHeight: 1.7, marginBottom: step.action ? 14 : 0 }}>{step.desc}</p>
                  {step.action && (
                    <a href={step.action.href} style={{
                      display: "inline-block",
                      color: GOLD,
                      fontSize: "13px",
                      letterSpacing: "0.16em",
                      textDecoration: "none",
                      borderBottom: `1px solid ${GOLD_20}`,
                      paddingBottom: 2,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {step.action.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── STEWARD LETTER ───────────────────────────────────────────────────── */}
        <div style={{
          border: `1px solid ${GOLD_40}`,
          borderRadius: 14,
          background: "linear-gradient(160deg, #0a0c12 0%, #04060a 100%)",
          padding: "36px 32px",
          marginBottom: 40,
          position: "relative",
          overflow: "hidden",
          ...fadeIn(4),
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 30% 50%, rgba(212,166,104,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <p style={{ color: GOLD_DIM, fontSize: "12px", letterSpacing: "0.28em", marginBottom: 24 }}>
            FROM STEWARD 0001
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: TEXT,
            fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)",
            lineHeight: 2.1,
            marginBottom: 24,
          }}>
            You are co-founding a sovereign trade order designed to last generations.
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: TEXT_DIM,
            fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
            lineHeight: 2.0,
            marginBottom: 24,
          }}>
            If anything in the Palapala™ or Trust does not feel pono, speak now. Otherwise, we stand together as ʻohana under Malu.
          </p>

          <div style={{ height: 1, background: GOLD_20, margin: "28px 0" }} />

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
            lineHeight: 1.7,
            marginBottom: 8,
          }}>
            Mālama pono, brother.
          </p>
          <p style={{ color: TEXT_FAINT, fontSize: "14px", letterSpacing: "0.1em" }}>
            — Steward 0001 · Mākoa™ Brotherhood · Malu Trust™
          </p>
        </div>

        {/* ── SHARE / SPREAD ───────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(212,166,104,0.04)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "24px 24px",
          marginBottom: 40,
          textAlign: "center",
          ...fadeIn(4),
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "12px", letterSpacing: "0.22em", marginBottom: 12 }}>
            KNOW A MAN WHO BELONGS HERE?
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: TEXT_DIM,
            fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
            lineHeight: 1.8,
            marginBottom: 20,
          }}>
            {20 - seatsClaimed} seats remain. The gate closes May 31 at 11:11 PM HST.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/founding48" style={{
              background: GOLD, color: "#000",
              borderRadius: 8, padding: "12px 22px",
              fontSize: "13px", letterSpacing: "0.16em",
              textDecoration: "none", fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
            }}>
              SHARE THE 48 PAGE →
            </a>
            <a href="/sponsor" style={{
              border: `1px solid ${GOLD_20}`, color: GOLD_DIM,
              borderRadius: 8, padding: "12px 22px",
              fontSize: "13px", letterSpacing: "0.16em",
              textDecoration: "none", fontFamily: "'JetBrains Mono', monospace",
            }}>
              SPONSOR A BROTHER →
            </a>
          </div>
        </div>

        {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", paddingTop: 20, borderTop: `1px solid rgba(255,255,255,0.04)` }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "1.1rem",
            marginBottom: 20,
          }}>
            Hana · Pale · Ola
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
            {[
              { href: "/palapala", label: "PALAPALA™" },
              { href: "/trust", label: "WHAT WE ARE" },
              { href: "/founding48", label: "MAYDAY 48™" },
              { href: "/sponsor", label: "SPONSOR" },
            ].map(link => (
              <a key={link.href} href={link.href} style={{
                color: "rgba(212,166,104,0.3)",
                fontSize: "13px",
                letterSpacing: "0.15em",
                textDecoration: "none",
              }}>{link.label}</a>
            ))}
          </div>
          <p style={{ color: GOLD_DIM, fontSize: "15px", letterSpacing: "0.14em", marginBottom: 8, fontWeight: 600 }}>
            makoa.live
          </p>
          <p style={{ color: "rgba(212,166,104,0.15)", fontSize: "12px", letterSpacing: "0.1em", lineHeight: 1.9 }}>
            Mākoa™, Malu Trust™, Mayday 48™, and Palapala™ are trademarks of the Malu Trust.<br />
            All rights reserved. © 2026 Malu Trust / Steward 0001.<br />
            Unauthorized reproduction or derivative works prohibited.
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
