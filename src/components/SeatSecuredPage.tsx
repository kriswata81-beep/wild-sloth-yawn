"use client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const BG = "#04060a";

const TIER_INFO = {
  alii: { label: "Aliʻi", color: GOLD, icon: "👑", hotel: "Hotel · Kapolei", event: "72hr War Room · Boardroom" },
  mana: { label: "Mana", color: "#58a6ff", icon: "🌀", hotel: "Hotel · Kapolei", event: "72hr Mastermind" },
  nakoa: { label: "Nā Koa", color: "#3fb950", icon: "⚔", hotel: "Beach Training · Kapolei", event: "2-Day Founding Pass" },
};

const WHAT_TO_BRING = [
  "Government-issued ID",
  "Swimwear for ice bath",
  "Workout clothes (2 sets)",
  "Journal + pen",
  "Business cards (Aliʻi/Mana)",
  "Open mind. No ego.",
];

interface SeatSecuredPageProps {
  tier: "alii" | "mana" | "nakoa";
  name: string;
}

export default function SeatSecuredPage({ tier, name }: SeatSecuredPageProps) {
  const info = TIER_INFO[tier];
  const displayName = name.trim() || "brother";

  return (
    <div style={{ background: BG, minHeight: "100dvh", fontFamily: "var(--font-jetbrains)", overflowX: "hidden" }}>

      {/* Radial glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 25%, ${info.color}09 0%, transparent 60%)`,
      }} />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "56px 20px 48px", position: "relative", zIndex: 1, textAlign: "center" }}>

        {/* Confirmation badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: `${info.color}15`, border: `1px solid ${info.color}44`,
          borderRadius: 20, padding: "6px 16px", marginBottom: 24,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: info.color, boxShadow: `0 0 8px ${info.color}` }} />
          <span style={{ color: info.color, fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Seat Secured
          </span>
        </div>

        {/* Moon */}
        <div style={{ fontSize: "3rem", marginBottom: 20, opacity: 0.8 }}>🌕</div>

        <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 10px" }}>
          {info.icon} {info.label} · Founding Member
        </p>
        <h1 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "2.2rem", margin: "0 0 12px", lineHeight: 1.15 }}>
          You stand with<br />the Order, {displayName}.
        </h1>
        <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.65rem", lineHeight: 1.8, margin: "0 0 32px" }}>
          Your seat is confirmed.<br />
          XI will reach you on Telegram within 24 hours.
        </p>

        {/* Event details */}
        <div style={{ background: "#060810", border: `1px solid ${info.color}22`, borderRadius: 12, padding: "18px 16px", marginBottom: 20, textAlign: "left" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>
            Event Details
          </p>
          {[
            { label: "Event", value: "Mākoa 1st Roundup · The 72" },
            { label: "Dates", value: "May 1–4, 2026" },
            { label: "Location", value: "Kapolei · West Oahu" },
            { label: "Accommodation", value: info.hotel },
            { label: "Your Track", value: info.event },
            { label: "Check-in", value: "May 1 · 6:00pm" },
            { label: "First Formation", value: "May 2 · 4:00am" },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 12 }}>
              <span style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.6rem", flexShrink: 0 }}>{label}</span>
              <span style={{ color: GOLD, fontSize: "0.6rem", textAlign: "right" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Telegram CTA */}
        <div style={{ background: "rgba(88,166,255,0.04)", border: "1px solid rgba(88,166,255,0.2)", borderRadius: 12, padding: "18px 16px", marginBottom: 20 }}>
          <p style={{ color: "#58a6ff", fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 8px" }}>
            Join the Signal
          </p>
          <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.62rem", lineHeight: 1.7, margin: "0 0 14px" }}>
            All event instructions, location details, and brotherhood updates are distributed exclusively via Telegram.
          </p>
          <a
            href="https://t.me/makoaorder"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", width: "100%", background: "#58a6ff",
              color: "#000", border: "none", padding: "13px",
              borderRadius: 8, fontFamily: "var(--font-jetbrains)",
              fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", cursor: "pointer",
              textDecoration: "none", textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            JOIN TELEGRAM →
          </a>
        </div>

        {/* What to bring */}
        <div style={{ background: "#060810", border: "1px solid rgba(176,142,80,0.08)", borderRadius: 12, padding: "18px 16px", marginBottom: 28, textAlign: "left" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>
            What to Bring
          </p>
          {WHAT_TO_BRING.map((item) => (
            <div key={item} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <span style={{ color: GOLD, fontSize: "0.55rem", flexShrink: 0 }}>✦</span>
              <span style={{ color: "rgba(176,142,80,0.6)", fontSize: "0.62rem" }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Overflow / waitlist note */}
        <div style={{ background: "rgba(176,142,80,0.02)", border: "1px solid rgba(176,142,80,0.08)", borderRadius: 10, padding: "14px 16px", marginBottom: 24 }}>
          <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.58rem", lineHeight: 1.8, margin: 0 }}>
            Know a brother who should be here?<br />
            <span style={{ color: GOLD_DIM }}>Share the gate. The order grows by recognition, not recruitment.</span>
          </p>
        </div>

        {/* Footer */}
        <p className="font-cormorant" style={{ fontStyle: "italic", color: "rgba(176,142,80,0.2)", fontSize: "1rem", margin: "0 0 6px" }}>
          Hana · Pale · Ola
        </p>
        <p style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.52rem", letterSpacing: "0.18em", margin: 0 }}>
          Malu Trust · West Oahu · 2026 · All Faiths · Service First
        </p>
      </div>
    </div>
  );
}
