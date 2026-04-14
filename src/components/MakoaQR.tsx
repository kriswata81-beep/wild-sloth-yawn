"use client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.55)";
const GOLD_FAINT = "rgba(176,142,80,0.18)";
const BG = "#04060a";

/**
 * QR encodes https://makoa.live
 * - Black modules on WHITE background = maximum camera contrast = guaranteed scan
 * - Compass rose decorates OUTSIDE the QR, never overlapping it
 * - White quiet zone (margin) preserved so scanners can find the code
 */
const QR_URL =
  "https://quickchart.io/qr?text=https%3A%2F%2Fmakoa.live&size=400&dark=000000&light=ffffff&ecLevel=H&margin=2";

interface MakoaQRProps {
  diameter?: number;
  showLabel?: boolean;
}

export default function MakoaQR({ diameter = 240, showLabel = true }: MakoaQRProps) {
  const cx = diameter / 2;
  const cy = diameter / 2;
  const tickLen = diameter * 0.05;

  // QR sits in a white square in the centre — compass ring goes OUTSIDE
  const qrSize = diameter * 0.72;
  const qrOffset = (diameter - qrSize) / 2;

  // Compass ring radius — just outside the QR square corners
  const ringR = (diameter / 2) * 0.98;

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>

      {/* Outer wrapper — black background, compass ring drawn in SVG */}
      <div style={{ position: "relative", width: diameter, height: diameter, background: BG, borderRadius: "50%" }}>

        {/* Compass rose SVG — purely decorative, OUTSIDE the QR area */}
        <svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
        >
          <defs>
            <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.08" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={cx} cy={cy} r={ringR} fill="url(#glow2)" />
          <circle cx={cx} cy={cy} r={ringR} fill="none" stroke={GOLD} strokeWidth={diameter * 0.009} opacity={0.85} />
          <circle cx={cx} cy={cy} r={ringR - diameter * 0.032} fill="none" stroke={GOLD_FAINT} strokeWidth={diameter * 0.003} />

          {/* Cardinal ticks + labels — outside the ring */}
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
            const lx = cx + (ringR - tickLen * 1.9) * Math.cos(rad);
            const ly = cy + (ringR - tickLen * 1.9) * Math.sin(rad);
            return (
              <g key={label}>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={GOLD} strokeWidth={diameter * 0.009} strokeLinecap="round" />
                <text
                  x={lx} y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={GOLD}
                  fontSize={diameter * 0.06}
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
            const x2 = cx + (ringR - tickLen * 0.5) * Math.cos(rad);
            const y2 = cy + (ringR - tickLen * 0.5) * Math.sin(rad);
            return (
              <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={GOLD_FAINT} strokeWidth={diameter * 0.004} strokeLinecap="round" />
            );
          })}
        </svg>

        {/* QR code — white background, black modules, NO overlay on top of it */}
        <div style={{
          position: "absolute",
          top: qrOffset,
          left: qrOffset,
          width: qrSize,
          height: qrSize,
          zIndex: 1,
          background: "#ffffff",
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "0 0 0 3px #ffffff", // extra white quiet zone
        }}>
          <img
            src={QR_URL}
            alt="Scan to visit makoa.live"
            style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
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
