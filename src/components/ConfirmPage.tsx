"use client";

interface ConfirmPageProps {
  handle: string;
}

export default function ConfirmPage({ handle }: ConfirmPageProps) {
  const name = handle.trim() || "brother";

  return (
    <div
      className="anim-fade-in-scale"
      style={{
        background: "#000",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 28px",
        position: "relative",
        textAlign: "center",
      }}
    >
      {/* Subtle radial glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, rgba(176,142,80,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Moon */}
      <div style={{ fontSize: "2.5rem", marginBottom: 28, opacity: 0.8 }}>🌕</div>

      {/* Main greeting */}
      <h1
        className="font-cormorant"
        style={{
          fontStyle: "italic",
          fontSize: "2.6rem",
          color: "#b08e50",
          margin: "0 0 20px",
          lineHeight: 1.15,
          letterSpacing: "0.02em",
        }}
      >
        ʻAe, {name}.
      </h1>

      {/* XI message */}
      <p
        style={{
          color: "rgba(176,142,80,0.45)",
          fontSize: "0.72rem",
          fontFamily: "var(--font-jetbrains)",
          lineHeight: 1.8,
          margin: "0 0 40px",
          maxWidth: 320,
          letterSpacing: "0.05em",
        }}
      >
        XI will reach you on Telegram within 24 hours.<br />
        Keep your signal open.
      </p>

      {/* Divider */}
      <div style={{
        width: 60,
        height: 1,
        background: "rgba(176,142,80,0.2)",
        marginBottom: 28,
      }} />

      {/* Under the Malu */}
      <p
        style={{
          color: "rgba(176,142,80,0.18)",
          fontSize: "0.55rem",
          fontFamily: "var(--font-jetbrains)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          margin: "0 0 6px",
        }}
      >
        Under the Malu · Malu Trust · West Oahu · 2026
      </p>

      {/* Hana · Pale · Ola */}
      <p
        className="font-cormorant"
        style={{
          fontStyle: "italic",
          color: "rgba(176,142,80,0.28)",
          fontSize: "1rem",
          margin: 0,
          letterSpacing: "0.08em",
          position: "absolute",
          bottom: 28,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        Hana · Pale · Ola
      </p>
    </div>
  );
}
