"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const GATE_OPEN = new Date("2026-05-01T09:00:00-10:00").getTime();
const BANNER_START_DAYS = 9; // show banner when 9 or fewer days until gate opens

export default function LastChanceBanner() {
  const pathname = usePathname();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = GATE_OPEN - Date.now();
      if (diff <= 0) { setDaysLeft(0); return; }
      setDaysLeft(Math.ceil(diff / 86400000));
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, []);

  if (dismissed) return null;
  if (daysLeft === null) return null;
  if (daysLeft > BANNER_START_DAYS) return null;
  if (pathname.startsWith("/welcome-alii") || pathname.startsWith("/seat-claimed")) return null;

  const urgent = daysLeft <= 3;
  const color = urgent ? "#e05c5c" : "#b08e50";
  const bg = urgent ? "rgba(224,92,92,0.08)" : "rgba(176,142,80,0.07)";
  const border = urgent ? "rgba(224,92,92,0.35)" : "rgba(176,142,80,0.3)";

  const label = daysLeft === 0
    ? "🌕 THE GATE IS OPEN — MAY 1 FULL MOON"
    : daysLeft === 1
    ? "GATE OPENS TOMORROW — MAY 1 FULL MOON"
    : `${daysLeft} DAYS UNTIL THE GATE OPENS — MAY 1 FULL MOON`;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 9999,
      background: bg,
      borderBottom: `1px solid ${border}`,
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      padding: "10px 16px",
    }}>
      <div style={{
        width: 6, height: 6, borderRadius: "50%",
        background: color,
        animation: "bannerPulse 1.2s ease-in-out infinite",
        flexShrink: 0,
      }} />
      <style>{`@keyframes bannerPulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }`}</style>

      <a href="/mayday48/gate" style={{ textDecoration: "none", flex: 1, textAlign: "center" }}>
        <p style={{
          color,
          fontSize: "14px",
          letterSpacing: "0.18em",
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
        }}>
          {label} · 12 FOUNDING SEATS · <span style={{ textDecoration: "underline" }}>ENTER THE GATE →</span>
        </p>
      </a>

      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: `${color}60`, fontSize: "1rem", flexShrink: 0,
          fontFamily: "'JetBrains Mono', monospace",
          padding: "0 4px",
        }}
      >✕</button>
    </div>
  );
}
