"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#b08e50";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";

const TIER_COLOR = { alii: GOLD, mana: BLUE, nakoa: GREEN };
const TIER_GLOW = {
  alii: "rgba(176,142,80,0.6)",
  mana: "rgba(88,166,255,0.6)",
  nakoa: "rgba(63,185,80,0.6)",
};

// West Oahu ZIP → SVG coordinate mapping (real ZIP codes)
const ZIP_TO_XY: Record<string, { x: number; y: number; label: string }> = {
  "96707": { x: 98,  y: 188, label: "Kapolei" },
  "96706": { x: 128, y: 205, label: "Ewa Beach" },
  "96792": { x: 58,  y: 158, label: "Waianae" },
  "96793": { x: 45,  y: 170, label: "Waiʻanae" },
  "96791": { x: 38,  y: 185, label: "Makaha" },
  "96789": { x: 118, y: 175, label: "Mililani" },
  "96797": { x: 138, y: 195, label: "Waipahu" },
  "96701": { x: 155, y: 185, label: "Aiea" },
  "96813": { x: 200, y: 160, label: "Honolulu" },
  "96814": { x: 210, y: 165, label: "Honolulu" },
  "96815": { x: 220, y: 170, label: "Waikiki" },
  "96816": { x: 230, y: 155, label: "Kaimuki" },
  "96817": { x: 195, y: 148, label: "Kalihi" },
  "96818": { x: 175, y: 155, label: "Pearl City" },
  "96819": { x: 185, y: 150, label: "Moanalua" },
  "96821": { x: 240, y: 148, label: "Hawaii Kai" },
  "96825": { x: 255, y: 155, label: "Maunalua" },
};

// Jitter so overlapping ZIPs don't stack exactly
function jitter(val: number, seed: number): number {
  return val + ((seed * 7919) % 14) - 7;
}

type Tier = "alii" | "mana" | "nakoa";

interface Dot {
  x: number;
  y: number;
  tier: Tier;
  delay: number;
  handle: string;
  zip: string;
}

export default function BrotherhoodHotspotMap() {
  const [mounted, setMounted] = useState(false);
  const [dots, setDots] = useState<Dot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    supabase
      .from("gate_submissions")
      .select("handle, tier_flag, zip")
      .order("created_at", { ascending: false })
      .limit(40)
      .then(({ data }) => {
        setLoading(false);
        if (!data || data.length === 0) { setDots([]); return; }

        const built: Dot[] = [];
        data.forEach((row, i) => {
          const zip = (row.zip || "96707").trim();
          const coords = ZIP_TO_XY[zip] || ZIP_TO_XY["96707"];
          const tier = (row.tier_flag === "alii" || row.tier_flag === "mana" || row.tier_flag === "nakoa")
            ? row.tier_flag as Tier
            : "nakoa";
          built.push({
            x: jitter(coords.x, i * 3 + 1),
            y: jitter(coords.y, i * 3 + 2),
            tier,
            delay: (i * 0.3) % 2.5,
            handle: row.handle || "Brother",
            zip,
          });
        });
        setDots(built);
      });
  }, []);

  const aliiCount = dots.filter(d => d.tier === "alii").length;
  const manaCount = dots.filter(d => d.tier === "mana").length;
  const nakaoCount = dots.filter(d => d.tier === "nakoa").length;
  const total = dots.length;

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

      <p style={{
        color: "rgba(176,142,80,0.35)",
        fontSize: "0.4rem",
        letterSpacing: "0.3em",
        textAlign: "center",
        marginBottom: "12px",
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: "uppercase",
      }}>
        {loading ? "LOADING FORMATION..." : total > 0 ? "BROTHERS WHO PLEDGED · BY ZIP" : "FORMATION MAP · WEST OAHU"}
      </p>

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

          <rect width="380" height="240" fill="url(#mapBg)" />

          {[60, 120, 180, 240, 300].map(x => (
            <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="240" stroke="rgba(176,142,80,0.03)" strokeWidth="0.5" />
          ))}
          {[60, 120, 180].map(y => (
            <line key={`gy${y}`} x1="0" y1={y} x2="380" y2={y} stroke="rgba(176,142,80,0.03)" strokeWidth="0.5" />
          ))}

          {/* Oahu island outline */}
          <path
            d="M 20 200 L 28 175 L 35 155 L 45 138 L 58 120 L 75 105 L 95 92 L 118 82 L 145 75 L 172 72 L 200 74 L 228 80 L 255 92 L 278 108 L 295 128 L 305 150 L 308 172 L 302 192 L 288 208 L 268 218 L 245 224 L 218 228 L 190 228 L 162 224 L 135 216 L 110 206 L 88 200 L 65 198 L 42 200 Z"
            fill="rgba(15,22,15,0.7)"
            stroke="rgba(63,185,80,0.08)"
            strokeWidth="1"
          />

          {/* West Oahu highlight zone */}
          <ellipse
            cx="90" cy="185" rx="75" ry="45"
            fill="rgba(176,142,80,0.03)"
            stroke="rgba(176,142,80,0.06)"
            strokeWidth="0.5"
            strokeDasharray="4,4"
          />

          <text x="90" y="235" textAnchor="middle" fill="rgba(176,142,80,0.15)" fontSize="7" fontFamily="JetBrains Mono, monospace" letterSpacing="2">
            WEST OAHU
          </text>

          {/* Real dots from Supabase */}
          {dots.map((dot, i) => {
            const color = TIER_COLOR[dot.tier];
            const pulseDuration = 2.5 + (dot.delay % 1.5);
            const ringDuration = 3 + (dot.delay % 1);
            return (
              <g key={i}>
                <circle
                  cx={dot.x} cy={dot.y} r="5"
                  fill="none" stroke={color} strokeWidth="0.8" opacity="0"
                  style={{
                    animation: `ringExpand ${ringDuration}s ease-out ${dot.delay}s infinite`,
                    transformOrigin: `${dot.x}px ${dot.y}px`,
                  }}
                />
                <circle
                  cx={dot.x} cy={dot.y} r="3.5"
                  fill={color} filter="url(#dotGlow)"
                  style={{
                    animation: `dotPulse ${pulseDuration}s ease-in-out ${dot.delay}s infinite`,
                    transformOrigin: `${dot.x}px ${dot.y}px`,
                  }}
                />
                <circle cx={dot.x} cy={dot.y} r="1.5" fill="white" opacity="0.6" />
              </g>
            );
          })}

          {/* Empty state placeholder dots (shown only when no real data) */}
          {!loading && total === 0 && [
            { x: 98, y: 188 }, { x: 108, y: 195 }, { x: 58, y: 158 },
          ].map((dot, i) => (
            <g key={`placeholder-${i}`}>
              <circle cx={dot.x} cy={dot.y} r="3.5" fill="rgba(176,142,80,0.15)" />
              <circle cx={dot.x} cy={dot.y} r="1.5" fill="rgba(176,142,80,0.3)" />
            </g>
          ))}

          <text x="358" y="22" textAnchor="middle" fill="rgba(176,142,80,0.2)" fontSize="8" fontFamily="JetBrains Mono, monospace">N</text>
          <line x1="358" y1="10" x2="358" y2="24" stroke="rgba(176,142,80,0.15)" strokeWidth="0.5" />
        </svg>

        {/* Legend */}
        <div style={{ position: "absolute", top: "10px", left: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {[
            { label: "Aliʻi", color: GOLD, count: aliiCount },
            { label: "Mana", color: BLUE, count: manaCount },
            { label: "Nā Koa", color: GREEN, count: nakaoCount },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: l.color, boxShadow: `0 0 4px ${l.color}`, flexShrink: 0,
              }} />
              <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.34rem", fontFamily: "'JetBrains Mono', monospace" }}>
                {l.label}{total > 0 ? ` (${l.count})` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
        {total > 0 ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: GREEN, animation: "dotPulse 2s ease-in-out infinite" }} />
              <span style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.42rem", fontFamily: "'JetBrains Mono', monospace" }}>
                {total} brother{total !== 1 ? "s" : ""} pledged
              </span>
            </div>
            <span style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.42rem" }}>·</span>
            <span style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.42rem", fontFamily: "'JetBrains Mono', monospace" }}>West Oahu</span>
          </>
        ) : (
          <span style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.42rem", fontFamily: "'JetBrains Mono', monospace" }}>
            {loading ? "Loading..." : "Be the first to pledge — your dot appears here"}
          </span>
        )}
      </div>
    </div>
  );
}
