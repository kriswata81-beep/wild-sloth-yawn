"use client";
import { useEffect, useRef, useState } from "react";

// ── Cluster nodes — the 7G Net constellation ────────────────────────────────
// Phase 1 seeds. Each node is a zip cluster. Lines = trade routes.
const NODES = [
  // ── FOUNDING — West Oahu ──
  { id: "96792", label: "Waianae", sub: "FOUNDING", phase: 1, x: 50, y: 50, alii: "Kris W." },
  { id: "96707", label: "Kapolei", sub: "Steward Seat Open", phase: 1, x: 62, y: 52 },
  { id: "96706", label: "ʻEwa Beach", sub: "Steward Seat Open", phase: 1, x: 65, y: 60 },
  { id: "96782", label: "Pearl City", sub: "Steward Seat Open", phase: 1, x: 68, y: 46 },
  // ── USA Mainland ──
  { id: "90001", label: "Los Angeles", sub: "Steward Seat Open", phase: 2, x: 20, y: 62 },
  { id: "89101", label: "Las Vegas", sub: "Steward Seat Open", phase: 2, x: 25, y: 55 },
  { id: "77001", label: "Houston", sub: "Steward Seat Open", phase: 2, x: 40, y: 68 },
  { id: "33101", label: "Miami", sub: "Steward Seat Open", phase: 2, x: 55, y: 75 },
  { id: "10001", label: "New York", sub: "Steward Seat Open", phase: 2, x: 72, y: 40 },
  // ── Pacific ──
  { id: "AKL", label: "Auckland", sub: "International POC", phase: 2, x: 80, y: 80 },
  { id: "SYD", label: "Sydney", sub: "Steward Seat Open", phase: 3, x: 85, y: 70 },
  { id: "GUM", label: "Guam", sub: "Steward Seat Open", phase: 3, x: 78, y: 48 },
  // ── Future ──
  { id: "LDN", label: "London", sub: "Coming 2027", phase: 3, x: 78, y: 25 },
  { id: "TKY", label: "Tokyo", sub: "Coming 2027", phase: 3, x: 90, y: 35 },
  { id: "JNB", label: "Johannesburg", sub: "Coming 2028", phase: 3, x: 68, y: 82 },
];

// Trade route connections [fromId, toId]
const ROUTES = [
  ["96792", "96707"], ["96792", "96706"], ["96792", "96782"],
  ["96792", "AKL"],
  ["96707", "90001"], ["90001", "89101"], ["89101", "77001"],
  ["77001", "33101"], ["33101", "10001"],
  ["AKL", "SYD"], ["AKL", "GUM"],
  ["GUM", "TKY"], ["10001", "LDN"],
  ["SYD", "JNB"],
  ["96792", "90001"],
];

const PHASE_COLORS: Record<number, string> = {
  1: "#b08e50",  // gold — founding
  2: "#7c6fd0",  // purple — phase 2
  3: "#2a4a6e",  // deep blue — future
};

const PHASE_LABELS: Record<number, string> = {
  1: "Phase 1 · Live",
  2: "Phase 2 · 2026-2027",
  3: "Phase 3 · 2027+",
};

export default function NetPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const getNode = (id: string) => NODES.find(n => n.id === id);

  const hoveredNode = hovered ? NODES.find(n => n.id === hovered) : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#04060a",
      color: "#e8dfc8",
      fontFamily: "'Georgia', serif",
      overflowX: "hidden",
    }}>

      {/* Header */}
      <div style={{
        textAlign: "center",
        padding: "48px 24px 24px",
        borderBottom: "1px solid #1a1a1a",
      }}>
        <div style={{ fontSize: 11, letterSpacing: "0.3em", color: "#b08e50", marginBottom: 8 }}>
          THE MĀKOA ORDER
        </div>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 700,
          margin: "0 0 8px",
          color: "#e8dfc8",
          letterSpacing: "0.05em",
        }}>
          The 7G Net
        </h1>
        <p style={{ fontSize: 14, color: "#888", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
          Brotherhood-owned trade infrastructure. One Steward per zip. 1,000 clusters worldwide.
          Trade routes that stay in the community.
        </p>
      </div>

      {/* Live stats bar */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 32,
        padding: "16px 24px",
        background: "#080b10",
        flexWrap: "wrap",
      }}>
        {[
          { label: "Active Clusters", value: "1" },
          { label: "Seats Open", value: "2,999" },
          { label: "Phase 1 Zips", value: "4" },
          { label: "Network Value", value: "$2M–$4M" },
          { label: "Launch", value: "May 1, 2026" },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#b08e50" }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: "#666", letterSpacing: "0.1em", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Constellation SVG */}
      <div style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: "24px 16px",
        position: "relative",
      }}>
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        >
          {/* Background grid faint */}
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#b08e50" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#b08e50" stopOpacity="0" />
            </radialGradient>
            <filter id="blur">
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
          </defs>

          {/* Ambient glow around founding cluster */}
          <circle cx="50" cy="50" r="12" fill="url(#glow)" />

          {/* Trade routes */}
          {ROUTES.map(([fromId, toId], i) => {
            const from = getNode(fromId);
            const to = getNode(toId);
            if (!from || !to) return null;
            const isActive = hovered === fromId || hovered === toId;
            const isPhase1 = from.phase === 1 && to.phase === 1;
            return (
              <line
                key={i}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke={isActive ? "#b08e50" : isPhase1 ? "#b08e5044" : "#ffffff11"}
                strokeWidth={isActive ? 0.4 : 0.15}
                strokeDasharray={from.phase === 3 || to.phase === 3 ? "0.8 0.4" : undefined}
                style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
              />
            );
          })}

          {/* Cluster nodes */}
          {NODES.map(node => {
            const isHovered = hovered === node.id;
            const isFounding = node.id === "96792";
            const color = PHASE_COLORS[node.phase];
            const r = isFounding ? 2.2 : node.phase === 1 ? 1.5 : node.phase === 2 ? 1.2 : 0.9;
            const opacity = animated ? 1 : 0;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                style={{ cursor: "pointer", opacity, transition: `opacity 0.8s ${node.phase * 0.2}s` }}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Outer ring for founding */}
                {isFounding && (
                  <circle r={r + 1.5} fill="none" stroke="#b08e50" strokeWidth={0.2} opacity={0.4} />
                )}
                {/* Glow */}
                {isHovered && (
                  <circle r={r + 1} fill={color} opacity={0.2} filter="url(#blur)" />
                )}
                {/* Node */}
                <circle
                  r={isHovered ? r + 0.4 : r}
                  fill={isHovered ? color : `${color}cc`}
                  stroke={color}
                  strokeWidth={isFounding ? 0.3 : 0.15}
                  style={{ transition: "r 0.15s, fill 0.15s" }}
                />
                {/* Founding star */}
                {isFounding && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={1.4}
                    fill="#04060a"
                    fontWeight="bold"
                  >⬡</text>
                )}
                {/* Label */}
                <text
                  y={r + 1.8}
                  textAnchor="middle"
                  fontSize={node.phase === 1 ? 1.4 : 1.1}
                  fill={isHovered ? "#e8dfc8" : "#aaa"}
                  style={{ transition: "fill 0.15s", pointerEvents: "none" }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered node detail card */}
        {hoveredNode && (
          <div style={{
            position: "absolute",
            bottom: 48,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#0d0f14",
            border: `1px solid ${PHASE_COLORS[hoveredNode.phase]}44`,
            borderRadius: 8,
            padding: "12px 20px",
            textAlign: "center",
            minWidth: 200,
            pointerEvents: "none",
          }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: PHASE_COLORS[hoveredNode.phase], marginBottom: 4 }}>
              ZIP {hoveredNode.id} · {PHASE_LABELS[hoveredNode.phase]}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#e8dfc8" }}>{hoveredNode.label}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{hoveredNode.sub}</div>
            {hoveredNode.alii && (
              <div style={{ fontSize: 11, color: "#b08e50", marginTop: 6 }}>
                Aliʻi: {hoveredNode.alii}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 24,
        padding: "8px 24px 32px",
        flexWrap: "wrap",
      }}>
        {Object.entries(PHASE_LABELS).map(([phase, label]) => (
          <div key={phase} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: PHASE_COLORS[parseInt(phase)],
            }} />
            <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* 80/10/10 explainer */}
      <div style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "32px 24px",
        borderTop: "1px solid #1a1a1a",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 24,
      }}>
        {[
          { pct: "80%", label: "To the Brother on the Route", desc: "Every job dispatched, 80 cents of every dollar stays with the man who did the work." },
          { pct: "10%", label: "To the Cluster Steward", desc: "The Steward holds the territory, runs the War Room, seals the charter. Compensated for it." },
          { pct: "10%", label: "To the Mākoa Order", desc: "Funds the platform, the house, the summit, the next generation of tools." },
        ].map(item => (
          <div key={item.pct} style={{
            background: "#080b10",
            border: "1px solid #1a2030",
            borderRadius: 8,
            padding: "20px",
          }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#b08e50", marginBottom: 8 }}>{item.pct}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8dfc8", marginBottom: 8 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Moat section */}
      <div style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "0 24px 32px",
        borderTop: "1px solid #1a1a1a",
      }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#b08e50", padding: "24px 0 16px", textAlign: "center" }}>
          THE MOAT NOBODY CAN BUY
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { n: "01", title: "Territory Lock", desc: "One Steward per zip. Competitors cannot enter a sealed cluster." },
            { n: "02", title: "The 90-Day Live-In", desc: "Brotherhood is built in person. Real presence cannot be replicated digitally." },
            { n: "03", title: "The Stone", desc: "The house exists whether the app does or not. Physical anchor. Permanent." },
            { n: "04", title: "XI Data Flywheel", desc: "Gets smarter with every gate submission. Proprietary training data nobody else has." },
            { n: "05", title: "80/10/10 Split", desc: "Uber extracts. We build. Perfect incentive alignment at every level of the net." },
          ].map(item => (
            <div key={item.n} style={{
              display: "flex", gap: 16, alignItems: "flex-start",
              padding: "12px 0",
              borderBottom: "1px solid #0f1015",
            }}>
              <span style={{ fontSize: 11, color: "#b08e50", minWidth: 24, paddingTop: 2 }}>{item.n}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e8dfc8", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Valuation snapshot */}
      <div style={{
        background: "#080b10",
        borderTop: "1px solid #1a1a1a",
        borderBottom: "1px solid #1a1a1a",
        padding: "32px 24px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#b08e50", marginBottom: 20 }}>
          WHAT THIS IS WORTH
        </div>
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
          maxWidth: 700,
          margin: "0 auto",
        }}>
          {[
            { stage: "Pre-Launch", value: "$2M–$4M", note: "Today" },
            { stage: "100 Stewards", value: "$10M–$25M", note: "2026" },
            { stage: "1,000 Stewards", value: "$100M–$500M", note: "2027" },
            { stage: "Full Build-Out", value: "$500M–$1.5B", note: "5 Years" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "#04060a",
              border: "1px solid #1a2030",
              borderRadius: 6,
              padding: "14px 20px",
              minWidth: 140,
            }}>
              <div style={{ fontSize: 10, color: "#666", marginBottom: 4, letterSpacing: "0.1em" }}>{s.stage} · {s.note}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#b08e50" }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#555", marginTop: 16, fontStyle: "italic" }}>
          At 100 years: beyond valuation. Territory value, not market cap.
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "48px 24px 64px" }}>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 20, lineHeight: 1.7 }}>
          1,000 zip clusters. 3,000 Steward seats. One is yours.<br />
          The window closes when the cluster is sealed.
        </div>
        <a
          href="/steward/apply"
          style={{
            display: "inline-block",
            background: "#b08e50",
            color: "#04060a",
            padding: "14px 36px",
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textDecoration: "none",
            marginRight: 12,
          }}
        >
          APPLY FOR A STEWARD SEAT
        </a>
        <a
          href="/app"
          style={{
            display: "inline-block",
            border: "1px solid #b08e5066",
            color: "#b08e50",
            padding: "14px 28px",
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textDecoration: "none",
          }}
        >
          OPEN THE 7G APP
        </a>
      </div>
    </div>
  );
}
