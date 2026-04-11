const GOLD = "#b08e50";
const BG = "#04060a";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#e5e7eb",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "4rem",
          fontWeight: 800,
          color: GOLD,
          letterSpacing: "0.1em",
          marginBottom: 8,
        }}
      >
        404
      </div>
      <div
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(176,142,80,0.6)",
          marginBottom: 32,
        }}
      >
        THIS PATH DOES NOT EXIST
      </div>
      <p
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.9rem",
          maxWidth: 400,
          lineHeight: 1.7,
          marginBottom: 40,
        }}
      >
        The page you are looking for has not been built, or has been moved. Return
        to the Gate.
      </p>
      <a
        href="/gate"
        style={{
          display: "inline-block",
          padding: "12px 36px",
          background: `linear-gradient(135deg, ${GOLD}, #8a6d3b)`,
          color: "#000",
          fontWeight: 700,
          fontSize: "0.8rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        RETURN TO THE GATE
      </a>
      <div style={{ marginTop: 24 }}>
        <a
          href="/"
          style={{
            color: GOLD,
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            textDecoration: "none",
            opacity: 0.5,
          }}
        >
          ← HOME
        </a>
      </div>
    </div>
  );
}
