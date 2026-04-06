"use client";

import MakoaCrest from "./MakoaCrest";

interface KeyPageProps {
  handle: string;
  phone: string;
  onHandleChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEnter: () => void;
}

export default function KeyPage({ handle, phone, onHandleChange, onPhoneChange, onEnter }: KeyPageProps) {
  return (
    <div
      style={{
        background: "#000",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Breathing glow ring behind crest */}
      <div
        className="anim-fade-in anim-breathe-ring"
        style={{
          position: "absolute",
          width: 240,
          height: 240,
          borderRadius: "50%",
          border: "1px solid rgba(176,142,80,0.15)",
          pointerEvents: "none",
        }}
      />

      {/* Crest */}
      <div className="anim-fade-in" style={{ marginBottom: 32, zIndex: 1 }}>
        <MakoaCrest />
      </div>

      {/* MĀKOA */}
      <div className="anim-fade-up-1" style={{ textAlign: "center", zIndex: 1 }}>
        <h1
          className="font-cormorant"
          style={{
            fontStyle: "italic",
            fontSize: "2.6rem",
            color: "#b08e50",
            margin: 0,
            letterSpacing: "0.06em",
            lineHeight: 1.1,
          }}
        >
          MĀKOA
        </h1>
      </div>

      {/* Under the Malu */}
      <div className="anim-fade-up-2" style={{ textAlign: "center", marginTop: 8, zIndex: 1 }}>
        <p
          className="font-jetbrains"
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.28em",
            color: "#4a3a20",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          Under the Malu
        </p>
      </div>

      {/* Moon line */}
      <div className="anim-fade-up-3" style={{ textAlign: "center", marginTop: 14, zIndex: 1 }}>
        <p
          className="font-jetbrains"
          style={{
            fontSize: "0.6rem",
            color: "rgba(176,142,80,0.35)",
            margin: 0,
            letterSpacing: "0.1em",
          }}
        >
          🌕 Full Moon · The 72 Rises
        </p>
      </div>

      {/* Inputs */}
      <div
        className="anim-fade-up-4"
        style={{
          width: "100%",
          maxWidth: 280,
          marginTop: 32,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          zIndex: 1,
        }}
      >
        <input
          className="gate-input"
          type="text"
          placeholder="YOUR NAME IN THE ORDER"
          value={handle}
          onChange={(e) => onHandleChange(e.target.value)}
          autoComplete="off"
        />
        <input
          className="gate-input"
          type="tel"
          placeholder="808 · · · · · · ·"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          autoComplete="off"
        />
      </div>

      {/* ENTER button */}
      <div className="anim-fade-up-5" style={{ marginTop: 28, zIndex: 1 }}>
        <button
          onClick={onEnter}
          style={{
            background: "transparent",
            border: "1px solid rgba(176,142,80,0.4)",
            color: "#b08e50",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.3em",
            padding: "12px 40px",
            cursor: "pointer",
            textTransform: "uppercase",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(176,142,80,0.8)";
            (e.currentTarget as HTMLButtonElement).style.color = "#d4aa6a";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(176,142,80,0.4)";
            (e.currentTarget as HTMLButtonElement).style.color = "#b08e50";
          }}
        >
          ENTER
        </button>
      </div>

      {/* Footer */}
      <div
        className="anim-fade-up-6"
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <p
          className="font-jetbrains"
          style={{
            fontSize: "0.52rem",
            color: "rgba(176,142,80,0.2)",
            margin: 0,
            letterSpacing: "0.15em",
          }}
        >
          Malu Trust · West Oahu · 2026
        </p>
      </div>
    </div>
  );
}
