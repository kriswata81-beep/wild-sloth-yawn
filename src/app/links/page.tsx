"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const BG = "#04060a";

const LINKS = [
  {
    href: "/gate",
    label: "ENTER THE GATE",
    sub: "Apply to the brotherhood — free, 3 minutes",
    color: GOLD,
    bg: "rgba(176,142,80,0.08)",
    border: "rgba(176,142,80,0.4)",
    primary: true,
    icon: "◈",
  },
  {
    href: "/founding48",
    label: "MAYDAY 2026",
    sub: "May 1–3 · West Oahu · Founding event",
    color: GOLD,
    bg: "rgba(176,142,80,0.05)",
    border: "rgba(176,142,80,0.2)",
    primary: false,
    icon: "🔥",
  },
  {
    href: "https://t.me/+dsS4Mz0p5wM4OGYx",
    label: "JOIN TELEGRAM",
    sub: "Private brotherhood channel — brothers only",
    color: BLUE,
    bg: "rgba(88,166,255,0.06)",
    border: "rgba(88,166,255,0.25)",
    primary: false,
    icon: "✈",
    external: true,
  },
  {
    href: "/sponsor",
    label: "SPONSOR A BROTHER",
    sub: "Put a man in the room — gift a seat",
    color: GREEN,
    bg: "rgba(63,185,80,0.06)",
    border: "rgba(63,185,80,0.25)",
    primary: false,
    icon: "◉",
  },
  {
    href: "/fire",
    label: "WHAT HAPPENS INSIDE",
    sub: "The 48 hours — what actually goes down",
    color: GOLD_DIM,
    bg: "rgba(176,142,80,0.03)",
    border: "rgba(176,142,80,0.12)",
    primary: false,
    icon: "▲",
  },
  {
    href: "/xi",
    label: "MEET XI",
    sub: "The intelligence of the order — not a chatbot",
    color: GOLD_DIM,
    bg: "rgba(176,142,80,0.03)",
    border: "rgba(176,142,80,0.12)",
    primary: false,
    icon: "XI",
  },
  {
    href: "/trade",
    label: "MĀKOA TRADE CO.",
    sub: "The route network — 80/10/10 cooperative",
    color: GOLD_DIM,
    bg: "rgba(176,142,80,0.03)",
    border: "rgba(176,142,80,0.12)",
    primary: false,
    icon: "⬡",
  },
  {
    href: "/services",
    label: "BOOK A SERVICE",
    sub: "Yard, cleaning, hauling — West Oahu",
    color: GOLD_DIM,
    bg: "rgba(176,142,80,0.03)",
    border: "rgba(176,142,80,0.12)",
    primary: false,
    icon: "🌿",
  },
  {
    href: "/faceless",
    label: "FACELESS VIDEO SYSTEM",
    sub: "6 formats · shot lists · scripts · captions",
    color: GOLD_DIM,
    bg: "rgba(176,142,80,0.03)",
    border: "rgba(176,142,80,0.12)",
    primary: false,
    icon: "👁",
  },
  {
    href: "/drops",
    label: "100 MESSAGE DROPS",
    sub: "Copy · post · repeat — Gary Vee model",
    color: GOLD_DIM,
    bg: "rgba(176,142,80,0.03)",
    border: "rgba(176,142,80,0.12)",
    primary: false,
    icon: "⚡",
  },
];

export default function LinksPage() {
  const [brotherCount, setBrotherCount] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 100);
    supabase
      .from("gate_submissions")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => { if (count !== null) setBrotherCount(count); });
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: BG,
      fontFamily: "'JetBrains Mono', monospace",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "48px 20px 80px",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
        @keyframes dotPulse { 0%,100% { opacity:0.85; transform:scale(1); } 50% { opacity:1; transform:scale(1.35); } }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 400,
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/makoa_eclipse_crest.png"
            alt="Mākoa"
            style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 16px", display: "block", border: `1px solid ${GOLD_20}` }}
          />
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            color: GOLD, fontSize: "1.6rem", margin: "0 0 6px", fontWeight: 300,
          }}>
            Mākoa Order
          </p>
          <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.22em" }}>
            WEST OAHU · BROTHERHOOD · EST. 2026
          </p>

          {/* Live count */}
          {brotherCount !== null && brotherCount > 0 && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginTop: 14, padding: "6px 14px",
              background: "rgba(63,185,80,0.06)", border: "1px solid rgba(63,185,80,0.2)",
              borderRadius: 20,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", background: GREEN,
                boxShadow: "0 0 6px rgba(63,185,80,0.6)",
                animation: "dotPulse 2s ease-in-out infinite",
                flexShrink: 0,
              }} />
              <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.38rem", margin: 0 }}>
                <span style={{ color: GREEN, fontWeight: 700 }}>{brotherCount}</span> brothers have passed the gate
              </p>
            </div>
          )}
        </div>

        {/* Links */}
        <div style={{ display: "grid", gap: 10 }}>
          {LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: link.bg,
                border: `1px solid ${link.border}`,
                borderRadius: 10, padding: "16px 18px",
                textDecoration: "none",
                animation: `fadeUp ${0.2 + i * 0.07}s ease both`,
                transition: "transform 0.15s ease, border-color 0.15s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                background: `${link.color}12`,
                border: `1px solid ${link.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: link.icon.length > 1 ? "0.7rem" : "1rem",
                color: link.color,
                fontFamily: link.icon === "XI" ? "'Cormorant Garamond', serif" : undefined,
                fontStyle: link.icon === "XI" ? "italic" : undefined,
              }}>
                {link.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  color: link.primary ? link.color : "#e8e0d0",
                  fontSize: "0.48rem", fontWeight: link.primary ? 700 : 500,
                  letterSpacing: "0.1em", margin: "0 0 3px",
                }}>
                  {link.label}
                </p>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.38rem", margin: 0, lineHeight: 1.4 }}>
                  {link.sub}
                </p>
              </div>
              <span style={{ color: link.color, fontSize: "0.7rem", opacity: 0.5, flexShrink: 0 }}>→</span>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 36 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.44rem", letterSpacing: "0.15em", marginBottom: 4 }}>makoa.live</p>
          <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.34rem", letterSpacing: "0.12em" }}>
            Mākoa Order · West Oahu · Private Brotherhood
          </p>
        </div>
      </div>
    </div>
  );
}
