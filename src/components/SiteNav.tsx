"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const GOLD = "#D4A668";
const GOLD_DIM = "rgba(212,166,104,0.5)";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/palapala", label: "PALAPALA™" },
  { href: "/trust", label: "TRUST" },
  { href: "/founding48", label: "MAYDAY 48™" },
  { href: "/sponsor", label: "SPONSOR" },
  { href: "/waitlist", label: "WAITLIST" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <style>{`
        @keyframes navSlideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .nav-item:hover { color: ${GOLD} !important; }
        .nav-item.active { color: ${GOLD} !important; }
        .mobile-menu-item:hover { background: rgba(212,166,104,0.06) !important; }
      `}</style>

      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 200,
        background: scrolled ? "rgba(4,6,10,0.97)" : "rgba(4,6,10,0.85)",
        borderBottom: `1px solid ${scrolled ? "rgba(212,166,104,0.15)" : "rgba(212,166,104,0.06)"}`,
        backdropFilter: "blur(12px)",
        transition: "background 0.3s, border-color 0.3s",
        animation: "navSlideDown 0.5s ease both",
      }}>
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 20px",
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "15px",
              fontWeight: 700,
              color: GOLD,
              letterSpacing: "0.12em",
            }}>MĀKOA™</span>
          </a>

          {/* Desktop links */}
          <div style={{
            display: "flex",
            gap: 4,
            alignItems: "center",
          }} className="desktop-nav">
            <style>{`
              @media (max-width: 700px) { .desktop-nav { display: none !important; } .mobile-toggle { display: flex !important; } }
              @media (min-width: 701px) { .mobile-toggle { display: none !important; } }
            `}</style>
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-item${pathname === link.href ? " active" : ""}`}
                style={{
                  color: pathname === link.href ? GOLD : GOLD_DIM,
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textDecoration: "none",
                  padding: "6px 10px",
                  borderRadius: 4,
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: "color 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/mayday48/gate"
              style={{
                background: GOLD,
                color: "#000",
                fontSize: "12px",
                letterSpacing: "0.14em",
                textDecoration: "none",
                padding: "7px 14px",
                borderRadius: 5,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                marginLeft: 8,
                whiteSpace: "nowrap",
              }}
            >
              ENTER GATE →
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setOpen(o => !o)}
            style={{
              background: "none",
              border: `1px solid rgba(212,166,104,0.2)`,
              borderRadius: 5,
              padding: "6px 10px",
              cursor: "pointer",
              color: GOLD_DIM,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "13px",
              letterSpacing: "0.1em",
              display: "none",
            }}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div style={{
            borderTop: "1px solid rgba(212,166,104,0.1)",
            background: "rgba(4,6,10,0.98)",
            padding: "8px 0 12px",
          }}>
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="mobile-menu-item"
                style={{
                  display: "block",
                  color: pathname === link.href ? GOLD : GOLD_DIM,
                  fontSize: "14px",
                  letterSpacing: "0.14em",
                  textDecoration: "none",
                  padding: "12px 24px",
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: "background 0.15s",
                }}
              >
                {link.label}
              </a>
            ))}
            <div style={{ padding: "8px 20px 0" }}>
              <a
                href="/mayday48/gate"
                style={{
                  display: "block",
                  background: GOLD,
                  color: "#000",
                  fontSize: "14px",
                  letterSpacing: "0.14em",
                  textDecoration: "none",
                  padding: "13px 20px",
                  borderRadius: 6,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                ENTER THE GATE →
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
