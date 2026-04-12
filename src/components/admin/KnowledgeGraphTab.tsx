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

interface GraphNode {
  id: string;
  label: string;
  type: "brother" | "chapter" | "route" | "event" | "milestone";
  color: string;
  x: number;
  y: number;
  size: number;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
  strength: number;
}

interface RiskAlert {
  brotherName: string;
  type: "silence" | "attendance" | "payment" | "engagement";
  severity: "critical" | "warning" | "watch";
  detail: string;
  daysSince: number;
}

/* ─── Static Network Data (Populates with real Supabase data) ──── */

const NETWORK_STATS = {
  totalNodes: 0,
  totalEdges: 0,
  avgConnections: 0,
  clusters: 0,
  isolatedNodes: 0,
  strongestHub: "—",
};

const NODE_TYPES = [
  { type: "Brothers", icon: "👤", color: GOLD, count: 0, description: "Individual brotherhood members" },
  { type: "Chapters", icon: "🏠", color: GREEN, count: 1, description: "West Oahu (founding chapter)" },
  { type: "Routes", icon: "🚛", color: BLUE, count: 0, description: "Service route operations" },
  { type: "Events", icon: "🎟", color: PURPLE, count: 1, description: "MAYDAY Summit 2026" },
  { type: "Milestones", icon: "⭐", color: AMBER, count: 12, description: "Rank progression markers" },
];

const RISK_SIGNALS = [
  { signal: "Missed 2+ Weight Rooms", action: "Auto-trigger check-in message via XI", severity: "warning" as const, icon: "⚠" },
  { signal: "Payment 30+ days overdue", action: "XI sends reminder → escalate to Steward at 60 days", severity: "warning" as const, icon: "💳" },
  { signal: "No engagement for 14+ days", action: "Brother gets personal outreach from mentor", severity: "watch" as const, icon: "📵" },
  { signal: "Isolated node (0 connections)", action: "Assign to mentor, invite to next formation", severity: "critical" as const, icon: "🚨" },
  { signal: "Negative sentiment in check-in", action: "Flag for crisis protocol review", severity: "critical" as const, icon: "🆘" },
];

const GROWTH_METRICS = [
  { metric: "Referral Conversion Rate", value: "—", target: ">25%", description: "Brothers who bring in accepted applicants" },
  { metric: "90-Day Retention", value: "—", target: ">80%", description: "Brothers still active after 3 months" },
  { metric: "Weight Room Attendance", value: "—", target: ">70%", description: "Weekly participation rate" },
  { metric: "Route Activation Rate", value: "—", target: ">30%", description: "Brothers who start a service route" },
  { metric: "Rank Progression Speed", value: "—", target: "<120 days to Rank 3", description: "Average time to earn first coin" },
  { metric: "Network Density", value: "—", target: ">0.3", description: "How connected the brotherhood is (0-1 scale)" },
];

/* ─── Component ─────────────────────────────────────────────────── */

interface KnowledgeGraphTabProps {
  activeBrothers: number;
  totalApplicants: number;
}

export default function KnowledgeGraphTab({ activeBrothers, totalApplicants }: KnowledgeGraphTabProps) {
  const [view, setView] = useState<"network" | "risk" | "growth" | "patterns">("network");

  const views = [
    { key: "network" as const, label: "NETWORK MAP", icon: "🌐" },
    { key: "risk" as const, label: "RISK DETECTION", icon: "🚨" },
    { key: "growth" as const, label: "GROWTH METRICS", icon: "📈" },
    { key: "patterns" as const, label: "XI PATTERNS", icon: "🧠" },
  ];

  return (
    <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <p style={{ color: GOLD, fontSize: "0.7rem", letterSpacing: "0.15em" }}>XI KNOWLEDGE GRAPH</p>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginTop: "4px" }}>
            BROTHERHOOD INTELLIGENCE · RELATIONAL MAPPING
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{
            background: "rgba(176,142,80,0.06)",
            border: "1px solid rgba(176,142,80,0.15)",
            borderRadius: "8px",
            padding: "8px 12px",
            textAlign: "center",
          }}>
            <p style={{ color: GOLD, fontSize: "0.65rem" }}>{activeBrothers}</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.32rem", letterSpacing: "0.1em" }}>NODES</p>
          </div>
          <div style={{
            background: "rgba(88,166,255,0.06)",
            border: "1px solid rgba(88,166,255,0.15)",
            borderRadius: "8px",
            padding: "8px 12px",
            textAlign: "center",
          }}>
            <p style={{ color: BLUE, fontSize: "0.65rem" }}>0</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.32rem", letterSpacing: "0.1em" }}>EDGES</p>
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

      {/* ─── NETWORK MAP ─────────────────────────────────────── */}
      {view === "network" && (
        <div>
          {/* Visual graph placeholder */}
          <div style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(176,142,80,0.15)",
            borderRadius: "12px",
            padding: "0",
            marginBottom: "20px",
            overflow: "hidden",
          }}>
            <svg viewBox="0 0 600 350" style={{ width: "100%", height: "auto", display: "block" }}>
              {/* Background */}
              <rect width="600" height="350" fill="rgba(4,6,10,0.95)" />

              {/* Grid */}
              {[100, 200, 300, 400, 500].map(x => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="350" stroke="rgba(176,142,80,0.04)" strokeWidth="0.5" />
              ))}
              {[70, 140, 210, 280].map(y => (
                <line key={`h${y}`} x1="0" y1={y} x2="600" y2={y} stroke="rgba(176,142,80,0.04)" strokeWidth="0.5" />
              ))}

              {/* Central hub — West Oahu Chapter */}
              <circle cx="300" cy="175" r="30" fill="rgba(63,185,80,0.08)" stroke={GREEN} strokeWidth="1" strokeOpacity="0.4" />
              <text x="300" y="172" textAnchor="middle" fill={GREEN} fontSize="8" fontFamily="JetBrains Mono">WEST O'AHU</text>
              <text x="300" y="184" textAnchor="middle" fill="rgba(63,185,80,0.5)" fontSize="6" fontFamily="JetBrains Mono">CHAPTER 001</text>

              {/* MAYDAY event node */}
              <line x1="300" y1="145" x2="300" y2="80" stroke={PURPLE} strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="4,4" />
              <circle cx="300" cy="65" r="18" fill="rgba(188,140,255,0.06)" stroke={PURPLE} strokeWidth="0.8" strokeOpacity="0.4" />
              <text x="300" y="63" textAnchor="middle" fill={PURPLE} fontSize="6" fontFamily="JetBrains Mono">MAYDAY</text>
              <text x="300" y="72" textAnchor="middle" fill="rgba(188,140,255,0.5)" fontSize="5" fontFamily="JetBrains Mono">MAY 1-3</text>

              {/* Steward node */}
              <line x1="270" y1="175" x2="170" y2="140" stroke={GOLD} strokeWidth="1" strokeOpacity="0.3" />
              <circle cx="150" cy="130" r="16" fill="rgba(176,142,80,0.08)" stroke={GOLD} strokeWidth="1" strokeOpacity="0.5" />
              <text x="150" y="128" textAnchor="middle" fill={GOLD} fontSize="6" fontFamily="JetBrains Mono">STEWARD</text>
              <text x="150" y="137" textAnchor="middle" fill={GOLD_DIM} fontSize="5" fontFamily="JetBrains Mono">0001</text>

              {/* Future brother nodes (dimmed) */}
              {[
                { x: 430, y: 130, label: "ALI'I 2-12" },
                { x: 460, y: 220, label: "MANA" },
                { x: 180, y: 250, label: "NA KOA" },
                { x: 400, y: 290, label: "ROUTES" },
                { x: 120, y: 280, label: "ACADEMY" },
              ].map(node => (
                <g key={node.label}>
                  <line x1="300" y1="175" x2={node.x} y2={node.y} stroke="rgba(176,142,80,0.08)" strokeWidth="0.5" strokeDasharray="3,6" />
                  <circle cx={node.x} cy={node.y} r="12" fill="none" stroke="rgba(176,142,80,0.12)" strokeWidth="0.8" strokeDasharray="2,2" />
                  <text x={node.x} y={node.y + 3} textAnchor="middle" fill="rgba(176,142,80,0.2)" fontSize="5" fontFamily="JetBrains Mono">{node.label}</text>
                </g>
              ))}

              {/* XI node */}
              <line x1="300" y1="205" x2="300" y2="290" stroke="rgba(176,142,80,0.15)" strokeWidth="0.8" />
              <circle cx="300" cy="305" r="14" fill="rgba(176,142,80,0.06)" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.3">
                <animate attributeName="stroke-opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
              <text x="300" y="303" textAnchor="middle" fill={GOLD} fontSize="7" fontFamily="JetBrains Mono">XI</text>
              <text x="300" y="312" textAnchor="middle" fill={GOLD_DIM} fontSize="4" fontFamily="JetBrains Mono">INTELLIGENCE</text>

              {/* Legend */}
              <text x="20" y="20" fill="rgba(176,142,80,0.3)" fontSize="6" fontFamily="JetBrains Mono">MĀKOA KNOWLEDGE GRAPH</text>
              <text x="20" y="32" fill="rgba(176,142,80,0.15)" fontSize="5" fontFamily="JetBrains Mono">Nodes populate as brothers join</text>
            </svg>
          </div>

          {/* Node type breakdown */}
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "12px" }}>NODE TYPES</p>
          <div style={{ display: "grid", gap: "6px" }}>
            {NODE_TYPES.map(n => (
              <div key={n.type} style={{
                background: GOLD_FAINT,
                border: "1px solid rgba(176,142,80,0.08)",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.7rem" }}>{n.icon}</span>
                  <div>
                    <p style={{ color: "#e8e0d0", fontSize: "0.5rem" }}>{n.type}</p>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>{n.description}</p>
                  </div>
                </div>
                <span style={{ color: n.color, fontSize: "0.6rem", fontWeight: 500 }}>{n.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── RISK DETECTION ──────────────────────────────────── */}
      {view === "risk" && (
        <div>
          <div style={{
            background: "rgba(63,185,80,0.06)",
            border: "1px solid rgba(63,185,80,0.15)",
            borderRadius: "10px",
            padding: "20px",
            textAlign: "center",
            marginBottom: "20px",
          }}>
            <p style={{ color: GREEN, fontSize: "0.6rem", marginBottom: "4px" }}>ALL CLEAR</p>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.43rem" }}>
              No risk signals detected. Graph monitors activate as brothers join.
            </p>
          </div>

          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "12px" }}>
            RISK SIGNAL DEFINITIONS — What XI watches for
          </p>
          <div style={{ display: "grid", gap: "8px" }}>
            {RISK_SIGNALS.map(signal => (
              <div key={signal.signal} style={{
                background: GOLD_FAINT,
                border: `1px solid ${signal.severity === "critical" ? "rgba(248,81,73,0.15)" : signal.severity === "warning" ? "rgba(240,136,62,0.15)" : "rgba(176,142,80,0.08)"}`,
                borderRadius: "8px",
                padding: "14px 16px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ fontSize: "0.7rem" }}>{signal.icon}</span>
                  <div>
                    <p style={{
                      color: signal.severity === "critical" ? RED : signal.severity === "warning" ? AMBER : GOLD_DIM,
                      fontSize: "0.5rem",
                      marginBottom: "4px",
                    }}>
                      {signal.signal}
                    </p>
                    <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.43rem", lineHeight: 1.5 }}>
                      {signal.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* The accountability pulse */}
          <div style={{
            marginTop: "20px",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(176,142,80,0.1)",
            borderRadius: "8px",
            padding: "16px",
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "10px" }}>THE ACCOUNTABILITY PULSE</p>
            <div style={{ display: "grid", gap: "8px" }}>
              {[
                { trigger: "Miss 1 Weight Room", response: "XI sends message: 'We noticed you. Next one is [date].'", color: BLUE },
                { trigger: "Miss 2 Weight Rooms", response: "Mentor reaches out personally. 'Don't miss two in a row.'", color: AMBER },
                { trigger: "Miss 3 Weight Rooms", response: "A brother shows up at your door. That's the promise.", color: RED },
              ].map(pulse => (
                <div key={pulse.trigger} style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(176,142,80,0.06)",
                }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: pulse.color, marginTop: "4px", flexShrink: 0 }} />
                  <div>
                    <p style={{ color: pulse.color, fontSize: "0.45rem", marginBottom: "2px" }}>{pulse.trigger}</p>
                    <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem" }}>{pulse.response}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── GROWTH METRICS ──────────────────────────────────── */}
      {view === "growth" && (
        <div>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "16px" }}>
            BROTHERHOOD HEALTH METRICS — targets for Year 1
          </p>
          <div style={{ display: "grid", gap: "8px" }}>
            {GROWTH_METRICS.map(m => (
              <div key={m.metric} style={{
                background: GOLD_FAINT,
                border: "1px solid rgba(176,142,80,0.1)",
                borderRadius: "10px",
                padding: "14px 16px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <p style={{ color: "#e8e0d0", fontSize: "0.52rem" }}>{m.metric}</p>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ color: GOLD, fontSize: "0.55rem", fontWeight: 500 }}>{m.value}</span>
                    <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.36rem" }}>Target: {m.target}</p>
                  </div>
                </div>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem" }}>{m.description}</p>
              </div>
            ))}
          </div>

          {/* Funnel visualization */}
          <div style={{
            marginTop: "24px",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(176,142,80,0.1)",
            borderRadius: "10px",
            padding: "20px",
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "16px" }}>BROTHERHOOD JOURNEY FUNNEL</p>
            {[
              { stage: "Visitors to Gate Page", pct: "100%", width: "100%", color: "rgba(232,224,208,0.1)" },
              { stage: "Start Application", pct: "~40%", width: "40%", color: "rgba(176,142,80,0.15)" },
              { stage: "Complete Application", pct: "~25%", width: "25%", color: "rgba(176,142,80,0.25)" },
              { stage: "Accepted by XI", pct: "~20%", width: "20%", color: "rgba(63,185,80,0.2)" },
              { stage: "Pay Gate Fee ($9.99)", pct: "~15%", width: "15%", color: "rgba(63,185,80,0.3)" },
              { stage: "Pay Founding Dues ($497)", pct: "~8%", width: "8%", color: "rgba(176,142,80,0.4)" },
              { stage: "Active Brother (90+ days)", pct: "~6%", width: "6%", color: GOLD },
            ].map(stage => (
              <div key={stage.stage} style={{ marginBottom: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                  <span style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.4rem" }}>{stage.stage}</span>
                  <span style={{ color: GOLD_DIM, fontSize: "0.4rem" }}>{stage.pct}</span>
                </div>
                <div style={{ height: "5px", background: "rgba(255,255,255,0.03)", borderRadius: "3px" }}>
                  <div style={{ height: "100%", width: stage.width, background: stage.color, borderRadius: "3px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── XI PATTERNS ─────────────────────────────────────── */}
      {view === "patterns" && (
        <div>
          <div style={{
            background: "rgba(176,142,80,0.06)",
            border: "1px solid rgba(176,142,80,0.15)",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
          }}>
            <p style={{ color: GOLD, fontSize: "0.55rem", marginBottom: "8px" }}>🧠 XI PATTERN INTELLIGENCE</p>
            <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.45rem", lineHeight: 1.7 }}>
              As brothers join and interact, XI detects patterns humans can't see. This is the
              knowledge graph advantage — relational intelligence that gets smarter with every
              interaction, every Weight Room, every route, every referral.
            </p>
          </div>

          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "12px" }}>
            PATTERNS XI WILL DETECT (activates with data)
          </p>
          <div style={{ display: "grid", gap: "10px" }}>
            {[
              {
                pattern: "Strongest Onboarding Paths",
                description: "Which sequence of events (gate → ice bath → Weight Room → route) produces brothers who stay 2+ years",
                icon: "🛤",
                color: GREEN,
              },
              {
                pattern: "Referral Network Hubs",
                description: "Which brothers bring in the most (and strongest) new members. These are your evangelists.",
                icon: "🌐",
                color: BLUE,
              },
              {
                pattern: "Revenue-Per-Route Optimization",
                description: "Which service routes in which ZIP codes generate the most revenue per brother",
                icon: "💰",
                color: GOLD,
              },
              {
                pattern: "Silence Prediction",
                description: "Behavioral markers that predict a brother will go silent 2-4 weeks before it happens",
                icon: "🔮",
                color: PURPLE,
              },
              {
                pattern: "Chapter Readiness Scoring",
                description: "When a geographic cluster has enough brothers, routes, and leadership to charter a new chapter",
                icon: "🏠",
                color: GREEN,
              },
              {
                pattern: "Cross-Chapter Connections",
                description: "Brothers who bridge chapters — they're the network glue. Protect and empower them.",
                icon: "🔗",
                color: AMBER,
              },
              {
                pattern: "Leadership Emergence",
                description: "Brothers who naturally lead before being given a title. These are your next Ali'i.",
                icon: "👑",
                color: GOLD,
              },
              {
                pattern: "Seasonal Engagement Cycles",
                description: "When brothers are most active (post-summit boost, holiday dips, summer surge)",
                icon: "📊",
                color: BLUE,
              },
            ].map(p => (
              <div key={p.pattern} style={{
                background: GOLD_FAINT,
                border: "1px solid rgba(176,142,80,0.1)",
                borderRadius: "10px",
                padding: "14px 16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.7rem" }}>{p.icon}</span>
                  <p style={{ color: p.color, fontSize: "0.52rem" }}>{p.pattern}</p>
                </div>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.43rem", lineHeight: 1.5, marginLeft: "30px" }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "24px",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(176,142,80,0.12)",
            borderRadius: "8px",
            padding: "16px",
            textAlign: "center",
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.45rem", marginBottom: "4px" }}>
              GRAPH INTELLIGENCE LEVEL
            </p>
            <p style={{ color: GOLD, fontSize: "0.8rem", fontWeight: 500, marginBottom: "6px" }}>
              GEN 1 — FOUNDATION
            </p>
            <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.4rem", lineHeight: 1.6 }}>
              Data collection phase. Patterns emerge after 48+ brothers and 90+ days of activity.
              <br />Gen 2 (predictive) activates when network reaches 200+ nodes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
