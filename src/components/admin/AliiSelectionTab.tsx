"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.07)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const RED = "#e05c5c";
const AMBER = "#f0883e";
const PURPLE = "#bc8cff";

/* ─── Types ─────────────────────────────────────────────────────── */

interface AliiProspect {
  id: string;
  name: string;
  region: string;
  gateScore: number;
  leadershipSignals: string[];
  businessOwner: boolean;
  networkStrength: "high" | "medium" | "low";
  financialReady: boolean;
  valuesAlignment: number; // 1-10
  overallRating: "strong" | "promising" | "watch" | "not_ready";
  xiNotes: string;
  stewardOverride: string | null;
  status: "shortlisted" | "observing" | "offered" | "accepted" | "declined" | "pending";
  applicationDate: string;
}

interface SelectionPhase {
  name: string;
  description: string;
  status: "active" | "upcoming" | "completed";
  dateRange: string;
}

/* ─── Scoring Criteria ──────────────────────────────────────────── */

const SCORING_CRITERIA = [
  { criterion: "Gate Application Score", weight: "20%", description: "12-question response quality, depth, honesty", icon: "🚪" },
  { criterion: "Leadership Signals", weight: "25%", description: "Runs a business, leads people, community influence", icon: "👑" },
  { criterion: "Values Alignment", weight: "25%", description: "Mission resonance, brotherhood understanding, long-term commitment", icon: "🛡" },
  { criterion: "Financial Capacity", weight: "15%", description: "Can commit to founding rate + travel. Not about wealth — about readiness", icon: "💰" },
  { criterion: "Network Strength", weight: "15%", description: "Can they bring other strong men into the Order?", icon: "🌐" },
];

const ANTI_BIAS_CHECKS = [
  "Age diversity — not all same generation",
  "Industry diversity — not all same profession",
  "Geographic representation — not all same ZIP",
  "Ethnic diversity — brotherhood reflects Hawaii",
  "Experience diversity — mix of seasoned + hungry",
];

const PHASES: SelectionPhase[] = [
  { name: "GATE SCORING", description: "XI scores all applications blind. Flags Ali'i-caliber candidates.", status: "active", dateRange: "Now → April 30" },
  { name: "SHORTLIST REVIEW", description: "Steward reviews XI shortlist. Override up or down with reasoning.", status: "upcoming", dateRange: "April 25-30" },
  { name: "MAYDAY OBSERVATION", description: "All 48 brothers attend. Ali'i prospects observed for 72 hours.", status: "upcoming", dateRange: "May 1-3" },
  { name: "FOUNDING DINNER", description: "12-seat dinner at Moani Island Bistro. Final Ali'i vote.", status: "upcoming", dateRange: "May 2 evening" },
  { name: "SEAT OFFER", description: "Selected Ali'i offered seats privately. Accept or decline.", status: "upcoming", dateRange: "May 3" },
];

/* ─── Component ─────────────────────────────────────────────────── */

interface AliiSelectionTabProps {
  applicants: Array<{
    id: string;
    application_id: string;
    full_name: string;
    email: string;
    region: string;
    tier: string;
    membership_status: string;
    rank_points_total: number;
    created_at: string;
  }>;
}

export default function AliiSelectionTab({ applicants }: AliiSelectionTabProps) {
  const [view, setView] = useState<"pipeline" | "criteria" | "fairness" | "prospects">("pipeline");

  // Derive prospect data from real applicants
  const aliiTier = applicants.filter(a => a.tier === "alii");
  const totalApplicants = applicants.length;
  const highScorers = applicants.filter(a => a.rank_points_total >= 200);

  const views = [
    { key: "pipeline" as const, label: "SELECTION PIPELINE", icon: "📋" },
    { key: "prospects" as const, label: "PROSPECT BOARD", icon: "👥" },
    { key: "criteria" as const, label: "SCORING CRITERIA", icon: "⚖" },
    { key: "fairness" as const, label: "FAIRNESS PROTOCOL", icon: "🛡" },
  ];

  const RATING_COLORS: Record<string, string> = {
    strong: GREEN,
    promising: BLUE,
    watch: AMBER,
    not_ready: RED,
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <p style={{ color: GOLD, fontSize: "0.7rem", letterSpacing: "0.15em" }}>ALI'I SELECTION</p>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginTop: "4px" }}>
            CO-FOUNDER IDENTIFICATION · MAYDAY 2026
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{
            background: "rgba(63,185,80,0.06)",
            border: "1px solid rgba(63,185,80,0.2)",
            borderRadius: "8px",
            padding: "8px 12px",
            textAlign: "center",
          }}>
            <p style={{ color: GREEN, fontSize: "0.65rem" }}>{totalApplicants}</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.32rem", letterSpacing: "0.1em" }}>APPLICANTS</p>
          </div>
          <div style={{
            background: "rgba(176,142,80,0.06)",
            border: "1px solid rgba(176,142,80,0.15)",
            borderRadius: "8px",
            padding: "8px 12px",
            textAlign: "center",
          }}>
            <p style={{ color: GOLD, fontSize: "0.65rem" }}>{aliiTier.length}</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.32rem", letterSpacing: "0.1em" }}>ALI'I TIER</p>
          </div>
          <div style={{
            background: "rgba(88,166,255,0.06)",
            border: "1px solid rgba(88,166,255,0.15)",
            borderRadius: "8px",
            padding: "8px 12px",
            textAlign: "center",
          }}>
            <p style={{ color: BLUE, fontSize: "0.65rem" }}>12</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.32rem", letterSpacing: "0.1em" }}>SEATS</p>
          </div>
        </div>
      </div>

      {/* View nav */}
      <div style={{
        display: "flex",
        gap: "4px",
        marginBottom: "20px",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {views.map(v => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            style={{
              background: view === v.key ? "rgba(176,142,80,0.12)" : "transparent",
              border: `1px solid ${view === v.key ? "rgba(176,142,80,0.3)" : "rgba(176,142,80,0.08)"}`,
              color: view === v.key ? GOLD : GOLD_DIM,
              fontSize: "0.4rem",
              letterSpacing: "0.1em",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            {v.icon} {v.label}
          </button>
        ))}
      </div>

      {/* ─── SELECTION PIPELINE ──────────────────────────────── */}
      {view === "pipeline" && (
        <div>
          <div style={{ display: "grid", gap: "10px" }}>
            {PHASES.map((phase, i) => (
              <div key={phase.name} style={{
                background: phase.status === "active" ? "rgba(176,142,80,0.08)" : GOLD_FAINT,
                border: `1px solid ${phase.status === "active" ? "rgba(176,142,80,0.25)" : "rgba(176,142,80,0.08)"}`,
                borderRadius: "10px",
                padding: "16px",
                position: "relative",
                overflow: "hidden",
              }}>
                {phase.status === "active" && (
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "3px",
                    height: "100%",
                    background: GOLD,
                    borderRadius: "3px 0 0 3px",
                  }} />
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      color: phase.status === "active" ? GOLD : phase.status === "completed" ? GREEN : GOLD_DIM,
                      fontSize: "0.65rem",
                      fontWeight: 500,
                      minWidth: "20px",
                    }}>
                      {phase.status === "completed" ? "✓" : `${i + 1}`}
                    </span>
                    <div>
                      <p style={{
                        color: phase.status === "active" ? GOLD : "#e8e0d0",
                        fontSize: "0.55rem",
                        letterSpacing: "0.08em",
                        marginBottom: "3px",
                      }}>
                        {phase.name}
                      </p>
                      <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.43rem", lineHeight: 1.5 }}>
                        {phase.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      color: phase.status === "active" ? GREEN : phase.status === "completed" ? GREEN : GOLD_DIM,
                      fontSize: "0.36rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}>
                      {phase.status}
                    </span>
                    <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.38rem", marginTop: "2px" }}>{phase.dateRange}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline funnel */}
          <div style={{
            marginTop: "24px",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(176,142,80,0.1)",
            borderRadius: "10px",
            padding: "20px",
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "16px" }}>SELECTION FUNNEL</p>
            {[
              { stage: "Gate Applications", count: totalApplicants, width: "100%", color: "rgba(232,224,208,0.15)" },
              { stage: "XI Score 8+ (Ali'i Caliber)", count: highScorers.length || "—", width: "60%", color: "rgba(176,142,80,0.2)" },
              { stage: "Steward Shortlist", count: "—", width: "40%", color: "rgba(176,142,80,0.3)" },
              { stage: "MAYDAY Observation", count: "48 max", width: "30%", color: "rgba(88,166,255,0.2)" },
              { stage: "Founding Dinner Vote", count: "12 seats", width: "15%", color: "rgba(176,142,80,0.5)" },
            ].map(stage => (
              <div key={stage.stage} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <span style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.42rem" }}>{stage.stage}</span>
                  <span style={{ color: GOLD_DIM, fontSize: "0.42rem" }}>{stage.count}</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.04)", borderRadius: "3px" }}>
                  <div style={{ height: "100%", width: stage.width, background: stage.color, borderRadius: "3px", transition: "width 0.5s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── PROSPECT BOARD ──────────────────────────────────── */}
      {view === "prospects" && (
        <div>
          {applicants.length === 0 ? (
            <div style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(176,142,80,0.1)",
              borderRadius: "10px",
              padding: "40px 20px",
              textAlign: "center",
            }}>
              <p style={{ color: GOLD, fontSize: "0.65rem", marginBottom: "8px" }}>AWAITING APPLICATIONS</p>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.45rem", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto" }}>
                When gate applications come in, XI will automatically score them and flag
                Ali'i-caliber candidates here. The board populates as brothers apply.
              </p>
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
                <div>
                  <p style={{ color: GREEN, fontSize: "0.7rem" }}>0</p>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem" }}>STRONG</p>
                </div>
                <div>
                  <p style={{ color: BLUE, fontSize: "0.7rem" }}>0</p>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem" }}>PROMISING</p>
                </div>
                <div>
                  <p style={{ color: AMBER, fontSize: "0.7rem" }}>0</p>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem" }}>WATCH</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "8px" }}>
              {applicants.map(app => {
                const score = app.rank_points_total || 0;
                const rating = score >= 250 ? "strong" : score >= 150 ? "promising" : score >= 50 ? "watch" : "not_ready";
                return (
                  <div key={app.id} style={{
                    background: GOLD_FAINT,
                    border: `1px solid ${RATING_COLORS[rating]}25`,
                    borderRadius: "8px",
                    padding: "14px 16px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ color: "#e8e0d0", fontSize: "0.55rem", marginBottom: "3px" }}>{app.full_name}</p>
                        <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem" }}>
                          {app.region} · {app.application_id} · Applied {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{
                          color: RATING_COLORS[rating],
                          fontSize: "0.38rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          background: `${RATING_COLORS[rating]}15`,
                          border: `1px solid ${RATING_COLORS[rating]}30`,
                          padding: "2px 8px",
                          borderRadius: "3px",
                        }}>
                          {rating.replace("_", " ")}
                        </span>
                        <span style={{ color: GOLD, fontSize: "0.55rem" }}>{score} pts</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── SCORING CRITERIA ────────────────────────────────── */}
      {view === "criteria" && (
        <div>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "16px" }}>
            XI BLIND SCORING — 5 WEIGHTED CRITERIA
          </p>
          <div style={{ display: "grid", gap: "10px" }}>
            {SCORING_CRITERIA.map(c => (
              <div key={c.criterion} style={{
                background: GOLD_FAINT,
                border: "1px solid rgba(176,142,80,0.1)",
                borderRadius: "10px",
                padding: "16px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "0.8rem" }}>{c.icon}</span>
                    <p style={{ color: "#e8e0d0", fontSize: "0.55rem" }}>{c.criterion}</p>
                  </div>
                  <span style={{
                    color: GOLD,
                    fontSize: "0.5rem",
                    fontWeight: 500,
                    background: "rgba(176,142,80,0.1)",
                    padding: "3px 10px",
                    borderRadius: "4px",
                  }}>
                    {c.weight}
                  </span>
                </div>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.43rem", lineHeight: 1.5, marginLeft: "34px" }}>
                  {c.description}
                </p>
              </div>
            ))}
          </div>

          {/* Score interpretation */}
          <div style={{
            marginTop: "20px",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(176,142,80,0.1)",
            borderRadius: "8px",
            padding: "16px",
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "12px" }}>SCORE INTERPRETATION</p>
            {[
              { range: "8–10", label: "Ali'i Prospect", description: "Flagged for co-founder consideration", color: GREEN },
              { range: "5–7", label: "Mana Prospect", description: "Strong brother, builder potential", color: BLUE },
              { range: "4", label: "Accepted (Na Koa)", description: "Welcome to the Order", color: GOLD },
              { range: "1–3", label: "Hold", description: "A brother reaches out personally", color: AMBER },
              { range: "0", label: "Not Yet", description: "Come back when ready — not 'never'", color: RED },
            ].map(tier => (
              <div key={tier.range} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 0",
                borderBottom: "1px solid rgba(176,142,80,0.06)",
              }}>
                <span style={{
                  color: tier.color,
                  fontSize: "0.5rem",
                  fontWeight: 500,
                  minWidth: "36px",
                  textAlign: "center",
                }}>
                  {tier.range}
                </span>
                <div>
                  <p style={{ color: "#e8e0d0", fontSize: "0.48rem" }}>{tier.label}</p>
                  <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.4rem" }}>{tier.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── FAIRNESS PROTOCOL ───────────────────────────────── */}
      {view === "fairness" && (
        <div>
          <div style={{
            background: "rgba(63,185,80,0.06)",
            border: "1px solid rgba(63,185,80,0.15)",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
          }}>
            <p style={{ color: GREEN, fontSize: "0.55rem", marginBottom: "8px", letterSpacing: "0.1em" }}>
              🛡 XI SCORES BLIND
            </p>
            <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.45rem", lineHeight: 1.7 }}>
              XI does not see race, income, job title, or social media following when scoring.
              XI scores based on: clarity of purpose, commitment signals, values alignment,
              leadership indicators, and vulnerability/honesty in answers. Every score has
              written reasoning. Every decision is auditable through git history.
            </p>
          </div>

          {/* Anti-bias checks */}
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "12px" }}>ANTI-BIAS CHECKS</p>
          <div style={{ display: "grid", gap: "6px", marginBottom: "24px" }}>
            {ANTI_BIAS_CHECKS.map((check, i) => (
              <div key={i} style={{
                background: GOLD_FAINT,
                border: "1px solid rgba(176,142,80,0.08)",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <span style={{ color: GOLD, fontSize: "0.5rem" }}>⬡</span>
                <span style={{ color: "#e8e0d0", fontSize: "0.48rem" }}>{check}</span>
              </div>
            ))}
          </div>

          {/* Safeguards */}
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "12px" }}>SELECTION SAFEGUARDS</p>
          <div style={{ display: "grid", gap: "10px" }}>
            {[
              { title: "Multiple Checkpoints", description: "Application → Score → Shortlist → Observation → Vote → Offer. No single gate decides.", icon: "🔗" },
              { title: "No Single Decider", description: "XI recommends. Steward reviews. Council votes. Three layers, no rubber stamps.", icon: "⚖" },
              { title: "Performance Over Promise", description: "MAYDAY is the real test. 72 hours of observation beats any application form.", icon: "🔥" },
              { title: "Transparent Criteria", description: "Every brother can see what Ali'i requires. It's in the Ali'i Stone. No hidden rules.", icon: "📖" },
              { title: "Full Audit Trail", description: "XI logs every score, every vote, every reason. Auditable forever through git history.", icon: "📋" },
              { title: "Seats Open Later", description: "Not getting Ali'i at MAYDAY doesn't mean never. New seats open as the Order grows.", icon: "🚪" },
              { title: "Override Accountability", description: "Steward can override XI's score — but must provide written reasoning. No silent overrides.", icon: "✍" },
            ].map(guard => (
              <div key={guard.title} style={{
                background: GOLD_FAINT,
                border: "1px solid rgba(176,142,80,0.1)",
                borderRadius: "10px",
                padding: "14px 16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.7rem" }}>{guard.icon}</span>
                  <p style={{ color: "#e8e0d0", fontSize: "0.52rem" }}>{guard.title}</p>
                </div>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.43rem", lineHeight: 1.5, marginLeft: "30px" }}>
                  {guard.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
