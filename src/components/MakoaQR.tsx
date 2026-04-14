"use client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.55)";
const GOLD_FAINT = "rgba(176,142,80,0.18)";
const BG = "#04060a";

const QR_URL =
  "https://quickchart.io/qr?text=https%3A%2F%2Fmakoa.live&size=500&dark=000000&light=ffffff&ecLevel=H&margin=2";

interface MakoaQRProps {
  diameter?: number;
  showLabel?: boolean;
}

export default function MakoaQR({ diameter = 260, showLabel = true }: MakoaQRProps) {
  const cx = diameter / 2;
  const cy = diameter / 2;

  // The white circle that holds the QR — slightly inset from the outer ring
  const qrCircleR = diameter * 0.42;
  // Compass ring sits just outside the white circle
  const ringR = diameter * 0.48;
  const tickLen = diameter * 0.05;

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ position: "relative", width: diameter, height: diameter }}>

        {/* ── SVG: black bg + white circle mask + compass ring ── */}
        <svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        >
          <defs>
            {/* Clip the QR image to a circle */}
            <clipPath id="circleClip">
              <circle cx={cx} cy={cy} r={qrCircleR} />
            </clipPath>

            <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor={GOLD} stopOpacity="0" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0.18" />
            </radialGradient>
          </defs>

          {/* Black background */}
          <rect width={diameter} height={diameter} fill={BG} />

          {/* Outer glow ring */}
          <circle cx={cx} cy={cy} r={ringR + diameter * 0.04} fill="url(#outerGlow)" />

          {/* Compass outer ring */}
          <circle cx={cx} cy={cy} r={ringR} fill="none"
            stroke={GOLD} strokeWidth={diameter * 0.009} opacity={0.9} />

          {/* Inner decorative ring */}
          <circle cx={cx} cy={cy} r={ringR - diameter * 0.028} fill="none"
            stroke={GOLD_FAINT} strokeWidth={diameter * 0.003} />

          {/* White circle background for QR */}
          <circle cx={cx} cy={cy} r={qrCircleR} fill="#ffffff" />

          {/* Cardinal ticks — between inner ring and outer ring */}
          {[
            { angle: -90, label: "N" },
            { angle: 0,   label: "E" },
            { angle: 90,  label: "S" },
            { angle: 180, label: "W" },
          ].map(({ angle, label }) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = cx + ringR * Math.cos(rad);
            const y1 = cy + ringR * Math.sin(rad);
            const x2 = cx + (ringR - tickLen) * Math.cos(rad);
            const y2 = cy + (ringR - tickLen) * Math.sin(rad);
            // Labels sit in the gap between white circle and compass ring
            const lx = cx + (ringR - tickLen * 1.7) * Math.cos(rad);
            const ly = cy + (ringR - tickLen * 1.7) * Math.sin(rad);
            return (
              <g key={label}>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={GOLD} strokeWidth={diameter * 0.009} strokeLinecap="round" />
                <text
                  x={lx} y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={GOLD}
                  fontSize={diameter * 0.058}
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
            const x1 = cx + ringR * Math.cos(rad);
            const y1 = cy + ringR * Math.sin(rad);
            const x2 = cx + (ringR - tickLen * 0.45) * Math.cos(rad);
            const y2 = cy + (ringR - tickLen * 0.45) * Math.sin(rad);
            return (
              <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={GOLD_FAINT} strokeWidth={diameter * 0.004} strokeLinecap="round" />
            );
          })}

          {/* Small gold dots at diagonal tick ends — decorative */}
          {[45, 135, 225, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const px = cx + (ringR - tickLen * 0.45) * Math.cos(rad);
            const py = cy + (ringR - tickLen * 0.45) * Math.sin(rad);
            return (
              <circle key={`dot-${angle}`} cx={px} cy={py} r={diameter * 0.008}
                fill={GOLD} opacity={0.5} />
            );
          })}
        </svg>

        {/* ── QR image clipped to circle ── */}
        <div style={{
          position: "absolute",
          top: cy - qrCircleR,
          left: cx - qrCircleR,
          width: qrCircleR * 2,
          height: qrCircleR * 2,
          borderRadius: "50%",
          overflow: "hidden",
          zIndex: 1,
          background: "#ffffff",
        }}>
          <img
            src={QR_URL}
            alt="Scan to visit makoa.live"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            crossOrigin="anonymous"
          />
        </div>

      </div>

      {showLabel && (
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD,
            fontSize: diameter * 0.075,
            letterSpacing: "0.14em",
            lineHeight: 1,
            marginBottom: 4,
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
