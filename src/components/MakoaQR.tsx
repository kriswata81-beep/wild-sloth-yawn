"use client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.55)";
const GOLD_FAINT = "rgba(176,142,80,0.18)";
const BG = "#04060a";

// QuickChart API — generates a real scannable QR, gold dots on black background
const QR_URL =
  "https://quickchart.io/qr?text=https%3A%2F%2Fmakoa.live&size=300&dark=b08e50&light=04060a&ecLevel=M&margin=1";

interface MakoaQRProps {
  diameter?: number;
  showLabel?: boolean;
}

export default function MakoaQR({ diameter = 220, showLabel = true }: MakoaQRProps) {
  const cx = diameter / 2;
  const cy = diameter / 2;
  const r = diameter / 2 - 2;
  const tickLen = diameter * 0.055;

  // QR image sits inside the compass ring with padding
  const qrPad = diameter * 0.12;
  const qrSize = diameter - qrPad * 2;

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: diameter, height: diameter }}>

        {/* Compass rose SVG — sits on top as overlay */}
        <svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
        >
          <defs>
            <radialGradient id="mqGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.1" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glow */}
          <circle cx={cx} cy={cy} r={r * 0.9} fill="url(#mqGlow)" />

          {/* Outer ring */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={GOLD} strokeWidth={diameter * 0.008} opacity={0.8} />

          {/* Inner ring */}
          <circle cx={cx} cy={cy} r={r - diameter * 0.038} fill="none" stroke={GOLD_FAINT} strokeWidth={diameter * 0.003} />

          {/* Cardinal ticks + labels */}
          {[
            { angle: -90, label: "N" },
            { angle: 0,   label: "E" },
            { angle: 90,  label: "S" },
            { angle: 180, label: "W" },
          ].map(({ angle, label }) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = cx + r * Math.cos(rad);
            const y1 = cy + r * Math.sin(rad);
            const x2 = cx + (r - tickLen) * Math.cos(rad);
            const y2 = cy + (r - tickLen) * Math.sin(rad);
            const lx = cx + (r + diameter * 0.07) * Math.cos(rad);
            const ly = cy + (r + diameter * 0.07) * Math.sin(rad);
            return (
              <g key={label}>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={GOLD} strokeWidth={diameter * 0.008} strokeLinecap="round" />
                <text
                  x={lx} y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={GOLD}
                  fontSize={diameter * 0.055}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
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
            const x2 = cx + (r - tickLen * 0.45) * Math.cos(rad);
            const y2 = cy + (r - tickLen * 0.45) * Math.sin(rad);
            return (
              <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={GOLD_FAINT} strokeWidth={diameter * 0.004} strokeLinecap="round" />
            );
          })}
        </svg>

        {/* Black background circle */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          borderRadius: "50%",
          background: BG,
        }} />

        {/* The actual QR image — centered inside the compass ring */}
        <div style={{
          position: "absolute",
          top: qrPad, left: qrPad,
          width: qrSize, height: qrSize,
          zIndex: 1,
          borderRadius: 8,
          overflow: "hidden",
        }}>
          <img
            src={QR_URL}
            alt="Mākoa QR Code — scan to visit makoa.live"
            width={qrSize}
            height={qrSize}
            style={{ display: "block", width: "100%", height: "100%" }}
          />
        </div>
      </div>

      {showLabel && (
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD,
            fontSize: diameter * 0.072,
            letterSpacing: "0.14em",
            lineHeight: 1,
            marginBottom: 3,
          }}>
            MĀKOA
          </p>
          <p style={{
            color: GOLD_DIM,
            fontSize: diameter * 0.036,
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
