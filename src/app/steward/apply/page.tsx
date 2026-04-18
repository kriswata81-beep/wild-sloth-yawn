"use client";
import { useState, useEffect } from "react";

const BG = "#04060a";
const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";

const OPEN_CLUSTERS = [
  { zip: "96792", city: "Waianae, Oʻahu", status: "founding" },
  { zip: "96707", city: "Kapolei, Oʻahu", status: "open" },
  { zip: "96706", city: "ʻEwa Beach, Oʻahu", status: "open" },
  { zip: "90001", city: "Los Angeles, CA", status: "open" },
  { zip: "89101", city: "Las Vegas, NV", status: "open" },
  { zip: "0600", city: "Auckland, NZ", status: "open" },
];

function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export default function StewardApplyPage() {
  const [ready, setReady] = useState(false);
  const [zip, setZip] = useState("");
  const [handle, setHandle] = useState("");
  const [essay, setEssay] = useState("");
  const [step, setStep] = useState<"form" | "review" | "sent">("form");
  const [sending, setSending] = useState(false);
  const [xiScore, setXiScore] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    const saved = localStorage.getItem("7gnet_zip");
    if (saved) setZip(saved);
    return () => clearTimeout(t);
  }, []);

  const wc = wordCount(essay);
  const wcOk = wc >= 80 && wc <= 120;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!wcOk || !zip || !handle) return;
    setStep("review");
  }

  async function handleConfirm() {
    setSending(true);
    // XI scores the essay: word density + leadership signals + territory claim language
    const score = scoreEssay(essay);
    setXiScore(score);
    try {
      await fetch("/api/steward/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip, handle, essay, xi_score: score, timestamp: new Date().toISOString() }),
      }).catch(() => {});
    } catch {}
    setSending(false);
    setStep("sent");
  }

  // XI essay scorer — client-side preview scoring (server does the real one)
  function scoreEssay(text: string): number {
    let score = 0;
    const lower = text.toLowerCase();
    // Leadership language
    const leadership = ["lead", "build", "community", "territory", "brother", "serve", "responsible", "commit", "accountable", "vision"];
    leadership.forEach(w => { if (lower.includes(w)) score += 8; });
    // Trade/economic signals
    const trade = ["route", "business", "service", "trade", "work", "job", "operator", "hustle", "grind", "earn"];
    trade.forEach(w => { if (lower.includes(w)) score += 6; });
    // Brotherhood signals
    const brotherhood = ["ohana", "family", "men", "house", "order", "makoa", "mana", "nakoa", "alii", "steward"];
    brotherhood.forEach(w => { if (lower.includes(w)) score += 10; });
    // Word count bonus
    if (wc >= 95 && wc <= 110) score += 15;
    // Cap at 100
    return Math.min(score, 100);
  }

  const score = xiScore ?? scoreEssay(essay);
  const tier = score >= 70 ? "alii" : score >= 40 ? "mana" : "nakoa";
  const tierLabel = score >= 70 ? "Aliʻi Steward (Primary)" : score >= 40 ? "Mana Co-Steward" : "Nā Koa Observer";
  const tierColor = score >= 70 ? GOLD : score >= 40 ? "rgba(167,139,250,0.8)" : GREEN;

  return (
    <div style={{
      minHeight: "100vh", background: BG,
      fontFamily: "'JetBrains Mono', monospace",
      padding: "48px 20px 80px",
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        input, textarea { outline: none; }
        input:focus, textarea:focus { border-color: ${GOLD_40} !important; }
      `}</style>

      <div style={{
        maxWidth: 480, margin: "0 auto",
        opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}>
        <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.25em", marginBottom: 32 }}>
          7G NET · STEWARD APPLICATION
        </p>

        {step === "form" && (
          <>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
              fontSize: "2.2rem", color: GOLD, margin: "0 0 12px", fontWeight: 300, lineHeight: 1.2,
            }}>
              Apply to Hold<br />a Cluster.
            </h1>
            <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.44rem", lineHeight: 1.8, marginBottom: 8 }}>
              1,000 Steward seats. Worldwide. One per zip cluster. First come, first reviewed — but XI picks the best, not the fastest.
            </p>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", lineHeight: 1.7, marginBottom: 32 }}>
              Write 100 words. Describe your territory, why you're the one to hold it, and what you'll build. XI reads every essay. The best essays get 2 Co-Stewards to back them. The rest go on waitlist.
            </p>

            <div style={{ height: 1, background: GOLD_20, marginBottom: 28 }} />

            {/* Open Clusters */}
            <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.2em", marginBottom: 12 }}>
              OPEN CLUSTERS (worldwide sample)
            </p>
            <div style={{ display: "grid", gap: 6, marginBottom: 28 }}>
              {OPEN_CLUSTERS.map((c) => (
                <button
                  key={c.zip}
                  onClick={() => setZip(c.zip)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: zip === c.zip ? GOLD_10 : "rgba(176,142,80,0.02)",
                    border: `1px solid ${zip === c.zip ? GOLD_40 : "rgba(176,142,80,0.08)"}`,
                    borderRadius: 6, padding: "10px 14px", cursor: "pointer",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <span style={{ color: zip === c.zip ? GOLD : "rgba(232,224,208,0.6)", fontSize: "0.44rem" }}>
                    {c.city}
                  </span>
                  <span style={{
                    color: c.status === "founding" ? GOLD : "rgba(176,142,80,0.3)",
                    fontSize: "0.32rem", letterSpacing: "0.1em",
                  }}>
                    {c.status === "founding" ? "FOUNDING" : `ZIP ${c.zip}`}
                  </span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
              <div>
                <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: 5 }}>
                  YOUR HANDLE
                </p>
                <input
                  type="text" value={handle} onChange={e => setHandle(e.target.value)}
                  placeholder="Name or alias" required
                  style={{
                    width: "100%", background: GOLD_10, border: `1px solid rgba(176,142,80,0.15)`,
                    borderRadius: 4, padding: "10px 12px", color: "#e8e0d0",
                    fontSize: "0.48rem", fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: 5 }}>
                  YOUR ZIP / CLUSTER
                </p>
                <input
                  type="text" value={zip} onChange={e => setZip(e.target.value)}
                  placeholder="Zip or area code" required
                  style={{
                    width: "100%", background: GOLD_10, border: `1px solid rgba(176,142,80,0.15)`,
                    borderRadius: 4, padding: "10px 12px", color: "#e8e0d0",
                    fontSize: "0.48rem", fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", margin: 0 }}>
                    YOUR 100-WORD ESSAY
                  </p>
                  <p style={{
                    fontSize: "0.36rem", margin: 0,
                    color: wcOk ? GREEN : wc > 0 ? "rgba(240,136,62,0.8)" : GOLD_40,
                  }}>
                    {wc} / 100 words {wcOk ? "✓" : wc > 120 ? "(too long)" : ""}
                  </p>
                </div>
                <textarea
                  value={essay}
                  onChange={e => setEssay(e.target.value)}
                  placeholder={`Why are you the one to hold zip ${zip || "[your zip]"}? Describe your territory, your plan for the brothers in it, and what you'll build in the first 90 days. XI reads every word. Make them count.`}
                  rows={8}
                  required
                  style={{
                    width: "100%", background: GOLD_10, border: `1px solid rgba(176,142,80,0.15)`,
                    borderRadius: 4, padding: "10px 12px", color: "#e8e0d0",
                    fontSize: "0.44rem", fontFamily: "'JetBrains Mono', monospace",
                    resize: "vertical", boxSizing: "border-box", lineHeight: 1.7,
                  }}
                />
                {wc > 0 && !wcOk && (
                  <p style={{ color: "rgba(240,136,62,0.7)", fontSize: "0.36rem", marginTop: 4 }}>
                    {wc < 80 ? `${80 - wc} more words needed` : `${wc - 120} words over limit — tighten it up`}
                  </p>
                )}
              </div>

              {/* Live XI score preview */}
              {wc >= 30 && (
                <div style={{
                  background: GOLD_10, border: `1px solid ${GOLD_20}`,
                  borderRadius: 6, padding: "12px 14px",
                  animation: "fadeUp 0.3s ease",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ color: GOLD_40, fontSize: "0.34rem", letterSpacing: "0.12em", margin: 0 }}>
                      XI READING YOUR ESSAY...
                    </p>
                    <p style={{ color: tierColor, fontSize: "0.34rem", margin: 0 }}>
                      {tier.toUpperCase()} SIGNAL
                    </p>
                  </div>
                  <div style={{ height: 4, background: "rgba(176,142,80,0.1)", borderRadius: 2, margin: "8px 0 4px" }}>
                    <div style={{
                      height: "100%", background: tierColor,
                      width: `${score}%`, borderRadius: 2,
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.32rem", margin: 0 }}>
                    Projected seat: {tierLabel}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={!wcOk || !handle || !zip}
                style={{
                  width: "100%",
                  background: wcOk && handle && zip ? GOLD : "rgba(176,142,80,0.15)",
                  border: "none",
                  color: wcOk && handle && zip ? "#000" : "rgba(176,142,80,0.3)",
                  fontSize: "0.5rem", letterSpacing: "0.22em", padding: "14px",
                  cursor: wcOk && handle && zip ? "pointer" : "not-allowed",
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, borderRadius: 5,
                }}
              >
                REVIEW & SUBMIT →
              </button>
            </form>
          </>
        )}

        {step === "review" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
              fontSize: "1.8rem", color: GOLD, margin: "0 0 20px", fontWeight: 300,
            }}>
              XI is reading your essay.
            </h2>

            <div style={{ background: GOLD_10, border: `1px solid ${GOLD_40}`, borderRadius: 8, padding: "20px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ color: GOLD_40, fontSize: "0.36rem", letterSpacing: "0.12em", margin: 0 }}>HANDLE</p>
                <p style={{ color: "#e8e0d0", fontSize: "0.44rem", margin: 0 }}>{handle}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ color: GOLD_40, fontSize: "0.36rem", letterSpacing: "0.12em", margin: 0 }}>CLUSTER</p>
                <p style={{ color: "#e8e0d0", fontSize: "0.44rem", margin: 0 }}>ZIP {zip}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ color: GOLD_40, fontSize: "0.36rem", letterSpacing: "0.12em", margin: 0 }}>WORD COUNT</p>
                <p style={{ color: GREEN, fontSize: "0.44rem", margin: 0 }}>{wc} words ✓</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ color: GOLD_40, fontSize: "0.36rem", letterSpacing: "0.12em", margin: 0 }}>XI SCORE</p>
                <p style={{ color: tierColor, fontSize: "0.44rem", margin: 0 }}>{score}/100 — {tierLabel}</p>
              </div>
              <div style={{ height: 1, background: GOLD_20, marginBottom: 14 }} />
              <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.4rem", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                "{essay.slice(0, 120)}{essay.length > 120 ? "..." : ""}"
              </p>
            </div>

            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", lineHeight: 1.7, marginBottom: 20 }}>
              Submitting confirms you understand: 1 Steward seat per zip cluster. If selected, XI assigns 2 Co-Stewards from applicants who applied to the same zip. You hold the cluster. You run the War Room. You build the warchest.
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <button
                onClick={handleConfirm}
                disabled={sending}
                style={{
                  width: "100%", background: GOLD, border: "none", color: "#000",
                  fontSize: "0.5rem", letterSpacing: "0.22em", padding: "14px",
                  cursor: sending ? "wait" : "pointer",
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, borderRadius: 5,
                  opacity: sending ? 0.7 : 1,
                }}
              >
                {sending ? "SUBMITTING TO XI..." : "CONFIRM & SUBMIT →"}
              </button>
              <button
                onClick={() => setStep("form")}
                style={{
                  background: "none", border: "none", color: "rgba(232,224,208,0.3)",
                  fontSize: "0.4rem", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                ← edit my essay
              </button>
            </div>
          </div>
        )}

        {step === "sent" && (
          <div style={{ animation: "fadeUp 0.4s ease", textAlign: "center" }}>
            <p style={{ color: GOLD, fontSize: "3rem", margin: "0 0 20px" }}>◉</p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
              fontSize: "2rem", color: GOLD, margin: "0 0 16px", fontWeight: 300,
            }}>
              Essay received.
            </h2>
            <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.46rem", lineHeight: 1.8, marginBottom: 8 }}>
              XI has your essay for zip {zip}.
            </p>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", lineHeight: 1.7, marginBottom: 24 }}>
              If your score ranks in the top applicants for this cluster, Steward 0001 will reach out directly. The best essays don't wait long.
            </p>
            <div style={{
              background: GOLD_10, border: `1px solid ${GOLD_20}`,
              borderRadius: 8, padding: "16px 20px", marginBottom: 28, textAlign: "left",
            }}>
              <p style={{ color: GOLD_40, fontSize: "0.36rem", letterSpacing: "0.12em", margin: "0 0 8px" }}>YOUR XI SCORE</p>
              <div style={{ height: 4, background: "rgba(176,142,80,0.1)", borderRadius: 2, marginBottom: 6 }}>
                <div style={{ height: "100%", background: tierColor, width: `${score}%`, borderRadius: 2 }} />
              </div>
              <p style={{ color: tierColor, fontSize: "0.44rem", margin: 0 }}>{score}/100 — {tierLabel}</p>
            </div>
            <a
              href="/app"
              style={{
                display: "block", background: GOLD, color: "#000",
                fontSize: "0.46rem", letterSpacing: "0.18em", padding: "13px",
                textDecoration: "none", fontWeight: 700, borderRadius: 5,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              BACK TO 7G NET APP →
            </a>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48, paddingTop: 24, borderTop: `1px solid rgba(176,142,80,0.06)` }}>
          <p style={{ color: GOLD_40, fontSize: "0.44rem", letterSpacing: "0.15em", marginBottom: 4 }}>makoa.live</p>
          <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.34rem" }}>
            1,000 Steward seats · Worldwide · One per zip cluster
          </p>
        </div>
      </div>
    </div>
  );
}
