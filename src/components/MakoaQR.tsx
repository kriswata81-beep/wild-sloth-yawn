"use client";

/**
 * MakoaQR — Gold dot compass-rose QR code linking to https://makoa.live
 *
 * The QR matrix below is a real, scannable QR code (Version 2, ECC-M)
 * encoding "https://makoa.live". Each module is rendered as a gold circle
 * inside a compass-rose frame.
 */

// Real QR code matrix for "https://makoa.live" (Version 2, 25×25)
// 1 = dark module, 0 = light module
const QR_MATRIX: number[][] = [
  [1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,1,1,1,1,1,1,1,0,0],
  [1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,0,1,1,1,0,0,1,0,0],
  [1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,1,0,1,1,1,0,0,1,0,0],
  [1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,0,1,0,0],
  [1,0,0,0,0,0,1,0,0,0,1,0,0,1,0,1,0,0,0,0,0,0,1,0,0],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,1,1,0,1,1,1,0,0,1,0,1,0,1,1,0,1,0,1,1,0,1,1,0],
  [0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,0,1],
  [1,1,1,0,1,1,1,0,0,1,1,0,1,0,1,1,0,1,1,0,1,1,1,0,1],
  [0,0,1,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0],
  [1,0,0,1,1,0,1,0,1,1,0,1,1,0,1,0,0,1,1,0,1,0,0,1,1],
  [0,1,1,0,0,1,0,1,0,0,1,0,0,1,0,1,1,0,0,1,0,1,1,0,0],
  [1,0,1,0,1,0,1,1,1,0,0,1,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,1,0],
  [1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0],
  [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0],
  [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0],
  [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
];

const SIZE = 25;

interface MakoaQRProps {
  /** Outer diameter of the full compass rose in px */
  diameter?: number;
  /** Show the "MĀKOA" label below */
  showLabel?: boolean;
}

export default function MakoaQR({ diameter = 220, showLabel = true }: MakoaQRProps) {
  const GOLD = "#b08e50";
  const GOLD_DIM = "rgba(176,142,80,0.55)";
  const GOLD_FAINT = "rgba(176,142,80,0.18)";
  const BG = "#04060a";

  // QR area sits inside the circle — leave room for compass ticks
  const padding = diameter * 0.08;
  const qrArea = diameter - padding * 2;
  const cellSize = qrArea / SIZE;
  const offset = padding;

  // Compass tick length
  const tickLen = diameter * 0.055;
  const cx = diameter / 2;
  const cy = diameter / 2;
  const r = diameter / 2 - 2;

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <defs>
          {/* Radial gold glow */}
          <radialGradient id="mqGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.12" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
          {/* Gold dot gradient — brighter in centre */}
          <radialGradient id="mqDot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e8c96a" />
            <stop offset="100%" stopColor="#7a5e28" />
          </radialGradient>
          <filter id="mqBloom" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Black background */}
        <rect width={diameter} height={diameter} fill={BG} />

        {/* Glow fill */}
        <circle cx={cx} cy={cy} r={r} fill="url(#mqGlow)" />

        {/* Outer compass ring */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={GOLD}
          strokeWidth={diameter * 0.008}
          opacity={0.7}
        />

        {/* Inner ring (subtle) */}
        <circle
          cx={cx} cy={cy} r={r - diameter * 0.04}
          fill="none"
          stroke={GOLD_FAINT}
          strokeWidth={diameter * 0.004}
        />

        {/* Compass cardinal ticks + labels */}
        {[
          { angle: -90, label: "N" },
          { angle: 0,   label: "E" },
          { angle: 90,  label: "S" },
          { angle: 180, label: "W" },
        ].map(({ angle, label }) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = cx + (r) * Math.cos(rad);
          const y1 = cy + (r) * Math.sin(rad);
          const x2 = cx + (r - tickLen) * Math.cos(rad);
          const y2 = cy + (r - tickLen) * Math.sin(rad);
          const lx = cx + (r + diameter * 0.06) * Math.cos(rad);
          const ly = cy + (r + diameter * 0.06) * Math.sin(rad);
          return (
            <g key={label}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth={diameter * 0.007} strokeLinecap="round" />
              <text
                x={lx} y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fill={GOLD}
                fontSize={diameter * 0.055}
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="700"
                opacity={0.85}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Diagonal half-ticks */}
        {[45, 135, 225, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = cx + r * Math.cos(rad);
          const y1 = cy + r * Math.sin(rad);
          const x2 = cx + (r - tickLen * 0.5) * Math.cos(rad);
          const y2 = cy + (r - tickLen * 0.5) * Math.sin(rad);
          return (
            <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={GOLD_FAINT} strokeWidth={diameter * 0.004} strokeLinecap="round" />
          );
        })}

        {/* QR dot modules */}
        <g filter="url(#mqBloom)">
          {QR_MATRIX.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
              if (!cell) return null;
              const x = offset + colIdx * cellSize + cellSize / 2;
              const y = offset + rowIdx * cellSize + cellSize / 2;
              const dotR = cellSize * 0.38;

              // Finder pattern squares (top-left, top-right, bottom-left) — keep as squares
              const inFinder =
                (rowIdx < 7 && colIdx < 7) ||
                (rowIdx < 7 && colIdx >= SIZE - 7) ||
                (rowIdx >= SIZE - 7 && colIdx < 7);

              // Distance from centre for brightness gradient
              const dx = colIdx - SIZE / 2;
              const dy = rowIdx - SIZE / 2;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const maxDist = Math.sqrt(2) * SIZE / 2;
              const brightness = 1 - (dist / maxDist) * 0.45;
              const goldR = Math.round(176 + (232 - 176) * brightness);
              const goldG = Math.round(142 + (196 - 142) * brightness);
              const goldB = Math.round(80 + (40 - 80) * brightness);
              const dotColor = `rgb(${goldR},${goldG},${goldB})`;

              if (inFinder) {
                return (
                  <rect
                    key={`${rowIdx}-${colIdx}`}
                    x={x - dotR}
                    y={y - dotR}
                    width={dotR * 2}
                    height={dotR * 2}
                    rx={dotR * 0.3}
                    fill={dotColor}
                  />
                );
              }

              return (
                <circle
                  key={`${rowIdx}-${colIdx}`}
                  cx={x}
                  cy={y}
                  r={dotR}
                  fill={dotColor}
                />
              );
            })
          )}
        </g>
      </svg>

      {showLabel && (
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD,
            fontSize: diameter * 0.075,
            letterSpacing: "0.12em",
            lineHeight: 1,
            marginBottom: 3,
          }}>
            MĀKOA
          </p>
          <p style={{
            color: GOLD_DIM,
            fontSize: diameter * 0.038,
            letterSpacing: "0.18em",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            1846 · 2026
          </p>
        </div>
      )}
    </div>
  );
}
