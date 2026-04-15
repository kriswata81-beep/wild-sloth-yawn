"use client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_15 = "rgba(176,142,80,0.15)";
const BG = "#04060a";

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/makoabrotherhood",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61573478863630",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@makoa_brotherhood",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.05a8.27 8.27 0 004.76 1.5V7.1a4.83 4.83 0 01-1-.41z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UC0hl7qo1V0sOWUT1jifrsng",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/+dsS4Mz0p5wM4OGYx",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.613c-.15.678-.546.843-1.107.524l-3.07-2.263-1.48 1.424c-.164.164-.302.302-.618.302l.22-3.12 5.67-5.12c.247-.22-.054-.342-.383-.122L6.48 14.41l-3.02-.944c-.657-.205-.67-.657.137-.973l11.81-4.554c.547-.198 1.025.133.855.97l-.7-.661z" />
      </svg>
    ),
  },
];

export default function SocialFooter() {
  return (
    <footer
      style={{
        background: BG,
        borderTop: `1px solid ${GOLD_15}`,
        padding: "32px 24px 24px",
        textAlign: "center",
      }}
    >
      <style>{`
        .social-icon-link {
          color: ${GOLD_DIM};
          transition: color 0.25s, filter 0.25s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }
        .social-icon-link:hover {
          color: ${GOLD};
          filter: drop-shadow(0 0 8px rgba(176,142,80,0.5));
        }
      `}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {socials.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            className="social-icon-link"
          >
            {s.icon}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
        {[
          { href: "/sponsor", label: "SPONSOR A BROTHER" },
          { href: "/wahine", label: "WAHINE CIRCLE" },
          { href: "/trade", label: "TRADE CO." },
          { href: "/cofounder", label: "CO-FOUNDER" },
          { href: "/services", label: "HOME SERVICES" },
          { href: "/gatherings", label: "GATHERINGS" },
          { href: "/xi", label: "XI · INTELLIGENCE" },
          { href: "/gate", label: "THE GATE" },
        ].map(link => (
          <a key={link.href} href={link.href} style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.12em", textDecoration: "none", opacity: 0.6, transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
          >{link.label}</a>
        ))}
      </div>
      <p
        style={{
          color: GOLD_DIM,
          fontSize: "0.48rem",
          letterSpacing: "0.12em",
          margin: "0 0 6px",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        M&#257;koa Brotherhood &copy; 2026
      </p>
      <p
        style={{
          color: GOLD_15,
          fontSize: "0.38rem",
          letterSpacing: "0.18em",
          margin: 0,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        Powered by XI
      </p>
    </footer>
  );
}
