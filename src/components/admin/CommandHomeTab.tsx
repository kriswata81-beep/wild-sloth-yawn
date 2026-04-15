"use client";
import { useState, useEffect, useRef } from "react";
import MakoaQR from "@/components/MakoaQR";

const GOLD = "#b08e50";

function CopyButton({ label, icon, text, gold, goldDim }: {
  label: string; icon: string; text: string; gold: string; goldDim: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      style={{
        width: "100%",
        background: copied ? "rgba(176,142,80,0.12)" : "rgba(176,142,80,0.04)",
        border: `1px solid ${copied ? gold : "rgba(176,142,80,0.15)"}`,
        borderRadius: 8,
        padding: "10px 12px",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <div>
        <p style={{ color: goldDim, fontSize: "0.36rem", letterSpacing: "0.14em", marginBottom: 3 }}>
          {icon} {label}
        </p>
        <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.38rem", lineHeight: 1.5, whiteSpace: "pre-line" }}>
          {text}
        </p>
      </div>
      <p style={{
        color: copied ? gold : "rgba(176,142,80,0.3)",
        fontSize: "0.36rem",
        letterSpacing: "0.1em",
        flexShrink: 0,
        fontFamily: "'JetBrains Mono', monospace",
        transition: "color 0.2s",
      }}>
        {copied ? "✓ COPIED" : "TAP"}
      </p>
    </button>
  );
}
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.07)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const RED = "#e05c5c";
const AMBER = "#f0883e";

// Oahu ZIP cluster data (approximate lat/lng mapped to SVG coords)
const OAHU_CLUSTERS = [
  { zip: "96707", label: "Kapolei", x: 95, y: 195, alii: 3, mana: 5, nakoa: 12 },
  { zip: "96706", label: "Ewa Beach", x: 115, y: 210, alii: 1, mana: 3, nakoa: 8 },
  { zip: "96792", label: "Waianae", x: 55, y: 165, alii: 0, mana: 2, nakoa: 6 },
  { zip: "96791", label: "Haleiwa", x: 130, y: 75, alii: 1, mana: 1, nakoa: 4 },
  { zip: "96813", label: "Honolulu", x: 230, y: 195, alii: 2, mana: 4, nakoa: 9 },
  { zip: "96816", label: "Kaimuki", x: 245, y: 205, alii: 1, mana: 2, nakoa: 5 },
  { zip: "96744", label: "Kaneohe", x: 270, y: 145, alii: 1, mana: 3, nakoa: 7 },
  { zip: "96734", label: "Kailua", x: 295, y: 160, alii: 2, mana: 2, nakoa: 4 },
  { zip: "96782", label: "Pearl City", x: 175, y: 175, alii: 1, mana: 3, nakoa: 6 },
  { zip: "96786", label: "Wahiawa", x: 165, y: 120, alii: 0, mana: 1, nakoa: 3 },
];

interface HeatMapProps {
  hoveredZip: string | null;
  setHoveredZip: (zip: string | null) => void;
}

function OahuHeatMap({ hoveredZip, setHoveredZip }: HeatMapProps) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "380px", margin: "0 auto" }}>
      <svg
        viewBox="0 0 380 280"
        style={{ width: "100%", height: "auto" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Oahu island outline — simplified polygon */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ocean background */}
        <rect width="380" height="280" fill="rgba(4,6,10,0.8)" rx="8" />

        {/* Oahu island shape — simplified */}
        <path
          d="M 60 160 L 70 130 L 90 100 L 120 80 L 150 65 L 180 60 L 210 62 L 240 70 L 270 85 L 295 105 L 310 130 L 315 155 L 310 175 L 295 195 L 270 210 L 240 220 L 210 225 L 180 222 L 150 215 L 120 205 L 95 195 L 75 180 Z"
          fill="rgba(20,30,20,0.6)"
          stroke="rgba(63,185,80,0.15)"
          strokeWidth="1"
        />

        {/* Mountain ridge */}
        <path
          d="M 120 80 L 150 65 L 180 60 L 210 62 L 240 70 L 270 85"
          fill="none"
          stroke="rgba(176,142,80,0.1)"
          strokeWidth="1"
          strokeDasharray="3,3"
        />

        {/* Grid lines */}
        {[80, 120, 160, 200, 240].map(x => (
          <line key={`vx${x}`} x1={x} y1="40" x2={x} y2="260" stroke="rgba(176,142,80,0.04)" strokeWidth="0.5" />
        ))}
        {[80, 120, 160, 200, 240].map(y => (
          <line key={`hy${y}`} x1="40" y1={y} x2="340" y2={y} stroke="rgba(176,142,80,0.04)" strokeWidth="0.5" />
        ))}

        {/* Cluster dots */}
        {OAHU_CLUSTERS.map(cluster => {
          const total = cluster.alii + cluster.mana + cluster.nakoa;
          const isHovered = hoveredZip === cluster.zip;
          const radius = Math.max(6, Math.min(14, 5 + total * 0.5));

          return (
            <g key={cluster.zip}>
              {/* Pulse ring */}
              {isHovered && (
                <circle
                  cx={cluster.x}
                  cy={cluster.y}
                  r={radius + 8}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth="1"
                  opacity="0.4"
                />
              )}

              {/* Alii dot (gold) */}
              {cluster.alii > 0 && (
                <circle
                  cx={cluster.x - 4}
                  cy={cluster.y}
                  r={3 + cluster.alii * 0.5}
                  fill={GOLD}
                  opacity={isHovered ? 1 : 0.7}
                  filter={isHovered ? "url(#glow)" : undefined}
                />
              )}

              {/* Mana dot (blue) */}
              {cluster.mana > 0 && (
                <circle
                  cx={cluster.x + 2}
                  cy={cluster.y - 3}
                  r={3 + cluster.mana * 0.4}
                  fill={BLUE}
                  opacity={isHovered ? 1 : 0.7}
                  filter={isHovered ? "url(#glow)" : undefined}
                />
              )}

              {/* Na Koa dot (green) */}
              {cluster.nakoa > 0 && (
                <circle
                  cx={cluster.x + 3}
                  cy={cluster.y + 3}
                  r={3 + cluster.nakoa * 0.35}
                  fill={GREEN}
                  opacity={isHovered ? 1 : 0.7}
                  filter={isHovered ? "url(#glow)" : undefined}
                />
              )}

              {/* Invisible hit area */}
              <circle
                cx={cluster.x}
                cy={cluster.y}
                r={radius + 6}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredZip(cluster.zip)}
                onMouseLeave={() => setHoveredZip(null)}
              />

              {/* Count label */}
              {total >= 8 && (
                <text
                  x={cluster.x}
                  y={cluster.y + radius + 10}
                  textAnchor="middle"
                  fill="rgba(232,224,208,0.4)"
                  fontSize="6"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {total}
                </text>
              )}
            </g>
          );
        })}

        {/* Compass */}
        <text x="350" y="55" textAnchor="middle" fill="rgba(176,142,80,0.3)" fontSize="8" fontFamily="JetBrains Mono, monospace">N</text>
        <line x1="350" y1="42" x2="350" y2="58" stroke="rgba(176,142,80,0.2)" strokeWidth="0.5" />

        {/* Map label */}
        <text x="20" y="268" fill="rgba(176,142,80,0.2)" fontSize="6" fontFamily="JetBrains Mono, monospace">
          OAHU · STEWARD EYES ONLY
        </text>
      </svg>

      {/* Tooltip */}
      {hoveredZip && (() => {
        const c = OAHU_CLUSTERS.find(cl => cl.zip === hoveredZip);
        if (!c) return null;
        return (
          <div style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "rgba(4,6,10,0.95)",
            border: `1px solid ${GOLD}40`,
            borderRadius: "6px",
            padding: "10px 12px",
            minWidth: "130px",
          }}>
            <p style={{ color: GOLD, fontSize: "0.5rem", letterSpacing: "0.1em", marginBottom: "6px" }}>
              ZIP {c.zip}
            </p>
            <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.45rem", marginBottom: "4px" }}>{c.label}</p>
            <div style={{ display: "grid", gap: "3px" }}>
              {c.alii > 0 && <p style={{ color: GOLD, fontSize: "0.42rem" }}>Aliʻi: {c.alii}</p>}
              {c.mana > 0 && <p style={{ color: BLUE, fontSize: "0.42rem" }}>Mana: {c.mana}</p>}
              {c.nakoa > 0 && <p style={{ color: GREEN, fontSize: "0.42rem" }}>Nā Koa: {c.nakoa}</p>}
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem", marginTop: "2px", borderTop: "1px solid rgba(176,142,80,0.1)", paddingTop: "3px" }}>
                Total: {c.alii + c.mana + c.nakoa}
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

interface CommandHomeTabProps {
  activeBrothers: number;
  pendingPledges: number;
  revenueMTD: number;
  alertCount: number;
}

export default function CommandHomeTab({ activeBrothers, pendingPledges, revenueMTD, alertCount }: CommandHomeTabProps) {
  const [now, setNow] = useState(new Date());
  const [hoveredZip, setHoveredZip] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setNow(new Date()), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const todayDay = now.getDay(); // 0=Sun, 1=Mon...5=Fri

  const DAYS = [
    { label: "MON", day: 1 },
    { label: "TUE", day: 2 },
    { label: "WED", day: 3 },
    { label: "THU", day: 4 },
    { label: "FRI", day: 5 },
  ];

  const statCards = [
    { label: "ACTIVE BROTHERS", value: activeBrothers, color: GREEN, sub: "confirmed members" },
    { label: "PENDING PLEDGES", value: pendingPledges, color: AMBER, sub: "awaiting review" },
    { label: "REVENUE MTD", value: `$${revenueMTD.toLocaleString()}`, color: GOLD, sub: "month to date" },
    { label: "808 ALERTS", value: alertCount, color: alertCount > 0 ? RED : GREEN, sub: alertCount > 0 ? "active alerts" : "all clear" },
  ];

  return (
    <div style={{ animation: "fadeUp 0.4s ease forwards" }}>

      {/* ── SOCIAL DROP ASSET ── */}
      <div style={{
        marginBottom: "20px",
        background: "#04060a",
        border: `1px solid ${GOLD}30`,
        borderRadius: "14px",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "14px 16px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.2em" }}>
            📲 SOCIAL DROP · QR + CAPTIONS
          </p>
          <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.34rem", letterSpacing: "0.1em" }}>
            HOLD IMAGE TO SAVE
          </p>
        </div>

        {/* QR card — this is what you screenshot or hold-to-save */}
        <div style={{
          margin: "12px 16px 0",
          background: "#04060a",
          border: `1px solid ${GOLD}35`,
          borderRadius: "12px",
          padding: "20px 16px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}>
          {/* Eyebrow */}
          <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.22em" }}>
            MĀKOA ORDER · WEST OAHUʻ
          </p>

          {/* QR — hold to save on mobile */}
          <MakoaQR size={220} showLabel={false} />

          {/* Tagline */}
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: GOLD,
              fontSize: "1.05rem",
              lineHeight: 1.25,
              marginBottom: 4,
            }}>
              You Found the Gate.
            </p>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.38rem", letterSpacing: "0.14em" }}>
              Mākoa Brotherhood — West Oʻahu's founding order of men.
            </p>
          </div>

          {/* CTA bar */}
          <div style={{
            width: "100%",
            background: GOLD,
            borderRadius: 8,
            padding: "10px 0",
            textAlign: "center",
          }}>
            <p style={{
              color: "#04060a",
              fontSize: "0.42rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              letterSpacing: "0.18em",
            }}>
              ENTER THE GATE →
            </p>
          </div>
        </div>

        {/* Poster link */}
        <div style={{ padding: "10px 16px 0" }}>
          <a
            href="/poster"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", width: "100%", padding: "11px 0",
              background: GOLD_FAINT,
              border: `1px solid ${GOLD}50`,
              borderRadius: 8, textAlign: "center", textDecoration: "none",
              color: GOLD, fontSize: "0.4rem",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.16em",
            }}
          >
            🔥 OPEN LIVE COUNTDOWN POSTER
          </a>
        </div>

        {/* Download button — saves the raw QR image */}
        <div style={{ padding: "10px 16px 0" }}>
          <a
            href="https://quickchart.io/qr?text=https%3A%2F%2Fmakoa.live&size=800&dark=000000&light=ffffff&ecLevel=H&margin=2"
            download="makoa-qr.png"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              width: "100%",
              padding: "11px 0",
              background: "rgba(176,142,80,0.08)",
              border: `1px solid ${GOLD}40`,
              borderRadius: 8,
              textAlign: "center",
              textDecoration: "none",
              color: GOLD,
              fontSize: "0.4rem",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.16em",
            }}
          >
            ⬇ DOWNLOAD QR IMAGE (800px)
          </a>
        </div>

        {/* Caption copy buttons */}
        <div style={{ padding: "10px 16px 16px", display: "grid", gap: "8px" }}>
          {[
            {
              label: "IG / FB",
              icon: "📸",
              text: "The founding fire happens once.\n\nWest Oahu. May 1–3.\n\nScan if you're one of them. 🔥\n\n#Mākoa #Brotherhood #WestOahu #MAYDAY2026",
            },
            {
              label: "STORY / REEL",
              icon: "🎬",
              text: "Not a gym. Not a podcast.\n\nA brotherhood of men who build real things.\n\nScan the mark. 🤙 makoa.live",
            },
            {
              label: "TELEGRAM / SMS",
              icon: "💬",
              text: "Mākoa Brotherhood — West Oahu. May 1–3. The gate is open. Scan or go to makoa.live",
            },
            {
              label: "MYSTERY DROP",
              icon: "🔥",
              text: "👁\n\nmakoa.live\n\n.",
            },
          ].map(item => {
            return (
              <CopyButton key={item.label} label={item.label} icon={item.icon} text={item.text} gold={GOLD} goldDim={GOLD_DIM} />
            );
          })}
        </div>
      </div>

      {/* Live clock block */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "24px",
        padding: "20px",
        background: GOLD_FAINT,
        border: `1px solid rgba(176,142,80,0.12)`,
        borderRadius: "12px",
      }}>
        <div>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD,
            fontSize: "1.5rem",
            lineHeight: 1,
            marginBottom: "6px",
          }}>
            STEWARD 0001 · COMMAND CENTER
          </p>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", letterSpacing: "0.2em" }}>
            MĀKOA ORDER · RESTRICTED ACCESS
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "16px" }}>
          <p style={{
            color: GOLD,
            fontSize: "1.1rem",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.08em",
            lineHeight: 1,
          }}>
            {timeStr}
          </p>
          <p style={{ color: GOLD_DIM, fontSize: "0.38rem", marginTop: "4px", letterSpacing: "0.1em" }}>
            {dateStr}
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "10px",
        marginBottom: "20px",
      }}>
        {statCards.map(card => (
          <div key={card.label} style={{
            background: `rgba(${card.color === GREEN ? "63,185,80" : card.color === AMBER ? "240,136,62" : card.color === RED ? "224,92,92" : "176,142,80"},0.06)`,
            border: `1px solid ${card.color}25`,
            borderRadius: "10px",
            padding: "16px 14px",
          }}>
            <p style={{
              color: card.color,
              fontSize: typeof card.value === "string" ? "1rem" : "1.4rem",
              fontFamily: "'JetBrains Mono', monospace",
              lineHeight: 1,
              marginBottom: "6px",
            }}>
              {card.value}
            </p>
            <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: "2px" }}>
              {card.label}
            </p>
            <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.36rem" }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* System health warnings */}
      <div style={{ display: "grid", gap: 6, marginBottom: 16 }}>
        {[
          {
            key: "resend",
            label: "RESEND API KEY",
            status: process.env.NEXT_PUBLIC_RESEND_CONFIGURED === "true" ? "ok" : "warn",
            ok: "Sponsor emails firing",
            warn: "⚠ Set RESEND_API_KEY — sponsor notification emails are NOT sending",
          },
          {
            key: "stripe_webhook",
            label: "STRIPE WEBHOOK",
            status: process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_CONFIGURED === "true" ? "ok" : "warn",
            ok: "Webhook verified",
            warn: "⚠ Set STRIPE_WEBHOOK_SECRET — seat counts may not auto-update",
          },
        ].map(item => (
          <div key={item.key} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px",
            background: item.status === "warn" ? "rgba(248,81,73,0.06)" : "rgba(63,185,80,0.06)",
            border: `1px solid ${item.status === "warn" ? "rgba(248,81,73,0.25)" : "rgba(63,185,80,0.2)"}`,
            borderRadius: 6,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.status === "warn" ? RED : GREEN, flexShrink: 0 }} />
            <div>
              <p style={{ color: item.status === "warn" ? RED : GREEN, fontSize: "0.38rem", letterSpacing: "0.12em" }}>{item.label}</p>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.38rem" }}>{item.status === "warn" ? item.warn : item.ok}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Week at a glance */}
      <div style={{
        background: "rgba(0,0,0,0.3)",
        border: `1px solid rgba(176,142,80,0.1)`,
        borderRadius: "10px",
        padding: "14px 16px",
        marginBottom: "16px",
      }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.2em", marginBottom: "12px" }}>
          WEEK AT A GLANCE
        </p>
        <div style={{ display: "flex", gap: "6px" }}>
          {DAYS.map(d => {
            const isToday = todayDay === d.day;
            return (
              <div key={d.day} style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 4px",
                background: isToday ? `rgba(176,142,80,0.12)` : "transparent",
                border: `1px solid ${isToday ? GOLD : "rgba(176,142,80,0.08)"}`,
                borderRadius: "6px",
                transition: "all 0.2s",
              }}>
                <p style={{
                  color: isToday ? GOLD : "rgba(232,224,208,0.3)",
                  fontSize: "0.42rem",
                  letterSpacing: "0.1em",
                  fontWeight: isToday ? 600 : 400,
                }}>
                  {d.label}
                </p>
                {isToday && (
                  <div style={{
                    width: "4px", height: "4px", borderRadius: "50%",
                    background: GOLD, margin: "4px auto 0",
                  }} />
                )}
              </div>
            );
          })}
        </div>
        <p style={{
          color: "rgba(232,224,208,0.2)",
          fontSize: "0.38rem",
          letterSpacing: "0.12em",
          marginTop: "10px",
          fontFamily: "'JetBrains Mono', monospace",
          textAlign: "center",
        }}>
          OPERATIONS: 4AM–6PM · MON TUE THU FRI · WED TRAINING
        </p>
      </div>

      {/* Oahu Heat Map */}
      <div style={{
        background: "rgba(4,6,10,0.8)",
        border: `1px solid rgba(176,142,80,0.1)`,
        borderRadius: "10px",
        padding: "14px",
        marginBottom: "16px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.2em" }}>
            BROTHER LOCATION CLUSTER · OAHU
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { label: "Aliʻi", color: GOLD },
              { label: "Mana", color: BLUE },
              { label: "Nā Koa", color: GREEN },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: l.color }} />
                <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.36rem" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <OahuHeatMap hoveredZip={hoveredZip} setHoveredZip={setHoveredZip} />
        <p style={{ color: "rgba(232,224,208,0.15)", fontSize: "0.36rem", textAlign: "center", marginTop: "8px", letterSpacing: "0.1em" }}>
          STEWARD EYES ONLY · ZIP CLUSTER DATA
        </p>
      </div>

      {/* Operations footer */}
      <div style={{
        padding: "12px 16px",
        background: "rgba(0,0,0,0.2)",
        border: "1px solid rgba(176,142,80,0.06)",
        borderRadius: "8px",
        textAlign: "center",
      }}>
        <p style={{
          color: "rgba(232,224,208,0.2)",
          fontSize: "0.4rem",
          letterSpacing: "0.15em",
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 1.8,
        }}>
          OPERATIONS: 4AM–6PM · MON TUE THU FRI · WED TRAINING<br />
          <span style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.36rem" }}>
            COMMAND DARK: SAT · SUN · ROUTES ACTIVE
          </span>
        </p>
      </div>
    </div>
  );
}
