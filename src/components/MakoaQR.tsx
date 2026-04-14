"use client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.55)";
const GOLD_FAINT = "rgba(176,142,80,0.15)";
const BG = "#04060a";

const QR_URL =
  "https://quickchart.io/qr?text=https%3A%2F%2Fmakoa.live&size=500&dark=000000&light=ffffff&ecLevel=H&margin=2";

interface MakoaQRProps {
  size?: number;
  showLabel?: boolean;
}

export default function MakoaQR({ size = 260, showLabel = true }: MakoaQRProps) {
  const qrSize = size * 0.72;
  const pad = (size - qrSize) / 2;

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 14 }}>

      {/* Outer black card */}
      <div style={{
        position: "relative",
        width: size,
        height: size,
        background: BG,
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>

        {/* Corner accent marks — gold L-shapes in each corner */}
        {[
          { top: 10, left: 10, rotate: "0deg" },
          { top: 10, right: 10, rotate: "90deg" },
          { bottom: 10, right: 10, rotate: "180deg" },
          { bottom: 10, left: 10, rotate: "270deg" },
        ].map((pos, i) => (
          <svg
            key={i}
            width={size * 0.1}
            height={size * 0.1}
            viewBox="0 0 20 20"
            style={{
              position: "absolute",
              ...pos,
              transform: `rotate(${pos.rotate})`,
            }}
          >
            <polyline
              points="18,2 2,2 2,18"
              fill="none"
              stroke={GOLD}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.8}
            />
          </svg>
        ))}

        {/* Subtle gold border */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          border: `1px solid rgba(176,142,80,0.25)`,
          pointerEvents: "none",
        }} />

        {/* The QR — white bg, black modules, full square, nothing on top */}
        <div style={{
          width: qrSize,
          height: qrSize,
          background: "#fff",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: `0 0 0 4px #ffffff, 0 0 24px rgba(176,142,80,0.2)`,
        }}>
          <img
            src={QR_URL}
            alt="Scan to visit makoa.live"
            style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
            crossOrigin="anonymous"
          />
        </div>

        {/* Bottom label inside the card */}
        <div style={{
          position: "absolute",
          bottom: 10,
          left: 0, right: 0,
          textAlign: "center",
        }}>
          <p style={{
            color: GOLD_DIM,
            fontSize: size * 0.038,
            letterSpacing: "0.2em",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            SCAN · MAKOA.LIVE
          </p>
        </div>
      </div>

      {showLabel && (
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD,
            fontSize: size * 0.075,
            letterSpacing: "0.14em",
            lineHeight: 1,
            marginBottom: 4,
          }}>
            MĀKOA
          </p>
          <p style={{
            color: GOLD_DIM,
            fontSize: size * 0.038,
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
