"use client";
import { useEffect, useState } from "react";

const GOLD = "#b08e50";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";

// West Oahu presence dots — mock data, no names, no real data
// Positions mapped to SVG viewBox 0 0 380 240
const PRESENCE_DOTS = [
  // Kapolei cluster
  { x: 98,  y: 188, tier: "nakoa" as const, delay: 0 },
  { x: 108, y: 195, tier: "mana"  as const, delay: 0.4 },
  { x: 92,  y: 200, tier: "nakoa" as const, delay: 0.8 },
  { x: 115, y: 185, tier: "nakoa" as const, delay: 1.2 },
  { x: 103, y: 208, tier: "alii"  as const, delay: 0.6 },

  // Ewa Beach cluster
  { x: 128, y: 205, tier: "nakoa" as const, delay: 0.3 },
  { x: 138, y: 212, tier: "nakoa" as const, delay: 0.9 },
  { x: 122, y: 215, tier: "mana"  as const, delay: 1.5 },

  // Makakilo cluster
  { x: 118, y: 175, tier: "nakoa" as const, delay: 0.2 },
  { x: 128, y: 168, tier: "mana"  as const, delay: 0.7 },
  { x: 112, y: 162, tier: "nakoa" as const, delay: 1.1 },

  // Waianae cluster
  { x: 58,  y: 158, tier: "nakoa" as const, delay: 0.5 },
  { x: 68,  y: 165, tier: "nakoa" as const, delay: 1.0 },
  { x: 52,  y: 170, tier: "alii"  as const, delay: 1.4 },
  { x: 62,  y: 148, tier: "nakoa" as const, delay: 0.1 },

  // Ko Olina / Kapolei West
  { x: 82,  y: 198, tier: "mana"  as const, delay: 0.8 },
  { x: 75,  y: 190, tier: "nakoa" as const, delay: 1.3 },

  // Nanakuli
  { x: 45,  y: 178, tier: "nakoa" as const, delay: 0.6 },
  { x: 38,  y: 185, tier: "nakoa" as const, delay: 1.1 },
];

const TIER_COLOR = { alii: GOLD, mana: BLUE, nakoa: GREEN };
const TIER_GLOW = {
  alii: "rgba(176,142,80,0.6)",
  mana: "rgba(88,166,255,0.6)",
  nakoa: "rgba(63,185,80,0.6)",
};

export default function BrotherhoodHotspotMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const aliiCount = PRESENCE_DOTS.filter(d => d.tier === "alii").length;
  const manaCount = PRESENCE_DOTS.filter(d => d.tier === "mana").length;
  const nakaoCount = PRESENCE_DOTS.filter(d => d.tier === "nakoa").length;
  const total = PRESENCE_DOTS.length;

  return (
    <div style={{
      margin: "0 auto",
      maxWidth: "480px",
      padding: "0 20px",
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.8s ease, transform 0.8s ease",
    }}>
      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.35); }
        }
        @keyframes ringExpand {
          0% { opacity: 0.5; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.8); }
        }
      `}</style>

      {/* Label above */}
      <p style={{
        color: "rgba(176,142,80,0.35)",
        fontSize: "0.4rem",
        letterSpacing: "0.3em",
        textAlign: "center",
        marginBottom: "12px",
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: "uppercase",
      }}>
        BROTHERS ACTIVE NOW
      </p>

      {/* Map container */}
      <div style={{
        background: "rgba(4,6,10,0.9)",
        border: "1px solid rgba(176,142,80,0.1)",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
      }}>
        <svg
          viewBox="0 0 380 240"
          style={{ width: "100%", height: "auto", display: "block" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="mapBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(10,15,20,0.9)" />
              <stop offset="100%" stopColor="rgba(4,6,10,0.95)" />
            </radialGradient>
            <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect width="380" height="240" fill="url(#mapBg)" />

          {/* Subtle grid */}
          {[60, 120, 180, 240, 300].map(x => (
            <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="240" stroke="rgba(176,142,80,0.03)" strokeWidth="0.5" />
          ))}
          {[60, 120, 180].map(y => (
            <line key={`gy${y}`} x1="0" y1={y} x2="380" y2={y} stroke="rgba(176,142,80,0.03)" strokeWidth="0.5" />
          ))}

          {/* Oahu island outline — West Oahu focused */}
          <path
            d="M 20 200 L 28 175 L 35 155 L 45 138 L 58 120 L 75 105 L 95 92 L 118 82 L 145 75 L 172 72 L 200 74 L 228 80 L 255 92 L 278 108 L 295 128 L 305 150 L 308 172 L 302 192 L 288 208 L 268 218 L 245 224 L 218 228 L 190 228 L 162 224 L 135 216 L 110 206 L 88 200 L 65 198 L 42 200 Z"
            fill="rgba(15,22,15,0.7)"
            stroke="rgba(63,185,80,0.08)"
            strokeWidth="1"
          />

          {/* West Oahu highlight zone */}
          <ellipse
            cx="90"
            cy="185"
            rx="75"
            ry="45"
            fill="rgba(176,142,80,0.03)"
            stroke="rgba(176,142,80,0.06)"
            strokeWidth="0.5"
            strokeDasharray="4,4"
          />

          {/* "WEST OAHU" label on map */}
          <text
            x="90"
            y="235"
            textAnchor="middle"
            fill="rgba(176,142,80,0.15)"
            fontSize="7"
            fontFamily="JetBrains Mono, monospace"
            letterSpacing="2"
          >
            WEST OAHU
          </text>

          {/* Presence dots with pulse rings */}
          {PRESENCE_DOTS.map((dot, i) => {
            const color = TIER_COLOR[dot.tier];
            const glow = TIER_GLOW[dot.tier];
            const pulseDuration = 2.5 + (dot.delay % 1.5);
            const ringDuration = 3 + (dot.delay % 1);

            return (
              <g key={i}>
                {/* Expanding ring */}
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r="5"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.8"
                  opacity="0"
                  style={{
                    animation: `ringExpand ${ringDuration}s ease-out ${dot.delay}s infinite`,
                    transformOrigin: `${dot.x}px ${dot.y}px`,
                  }}
                />
                {/* Core dot */}
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r="3.5"
                  fill={color}
                  filter="url(#dotGlow)"
                  style={{
                    animation: `dotPulse ${pulseDuration}s ease-in-out ${dot.delay}s infinite`,
                    transformOrigin: `${dot.x}px ${dot.y}px`,
                  }}
                />
                {/* Inner bright core */}
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r="1.5"
                  fill="white"
                  opacity="0.6"
                />
              </g>
            );
          })}

          {/* Compass */}
          <text x="358" y="22" textAnchor="middle" fill="rgba(176,142,80,0.2)" fontSize="8" fontFamily="JetBrains Mono, monospace">N</text>
          <line x1="358" y1="10" x2="358" y2="24" stroke="rgba(176,142,80,0.15)" strokeWidth="0.5" />
        </svg>

        {/* Legend overlay */}
        <div style={{
          position: "absolute",
          top: "10px",
          left: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}>
          {[
            { label: "Aliʻi", color: GOLD, count: aliiCount },
            { label: "Mana", color: BLUE, count: manaCount },
            { label: "Nā Koa", color: GREEN, count: nakaoCount },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: l.color,
                boxShadow: `0 0 4px ${l.color}`,
                flexShrink: 0,
              }} />
              <span style={{
                color: "rgba(232,224,208,0.4)",
                fontSize: "0.34rem",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.05em",
              }}>
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats below map */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        marginTop: "12px",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: GREEN,
            animation: "dotPulse 2s ease-in-out infinite",
          }} />
          <span style={{
            color: "rgba(232,224,208,0.5)",
            fontSize: "0.42rem",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {total} brothers
          </span>
        </div>
        <span style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.42rem" }}>·</span>
        <span style={{
          color: "rgba(232,224,208,0.35)",
          fontSize: "0.42rem",
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          8 ZIP clusters
        </span>
        <span style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.42rem" }}>·</span>
        <span style={{
          color: "rgba(176,142,80,0.4)",
          fontSize: "0.42rem",
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          West Oahu
        </span>
      </div>
    </div>
  );
}
