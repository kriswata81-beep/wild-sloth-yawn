import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Palapala", href: "/palapala" },
  { label: "Gate", href: "/gate" },
  { label: "Fire", href: "/fire" },
  { label: "Trade", href: "/trade" },
  { label: "Sponsor", href: "/sponsor" },
  { label: "Wahine", href: "/wahine" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer style={{
      background: "#0a0606",
      borderTop: "1px solid rgba(212,175,55,0.12)",
      padding: "40px 24px 32px",
      textAlign: "center",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", justifyContent: "center", marginBottom: 28 }}>
          {FOOTER_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{ color: "#d4af37", fontSize: "0.48rem", letterSpacing: "0.18em", textDecoration: "none", opacity: 0.7 }}>
              {l.label.toUpperCase()}
            </Link>
          ))}
        </div>
        <p style={{ color: "#9d7fff", fontSize: "0.45rem", letterSpacing: "0.15em", marginBottom: 8, opacity: 0.8 }}>
          HELD UNDER THE MALU TRUST · WEST OʻAHU · 2026
        </p>
        <p style={{ color: "rgba(212,175,55,0.4)", fontSize: "0.42rem", letterSpacing: "0.12em", marginBottom: 12 }}>
          POWERED BY XI · EXTENDED INTELLIGENCE
        </p>
        <p style={{ color: "rgba(245,236,217,0.2)", fontSize: "0.4rem", letterSpacing: "0.1em" }}>
          © 2026 MĀKOA BROTHERHOOD · ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
}
