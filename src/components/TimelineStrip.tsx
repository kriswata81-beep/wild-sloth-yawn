"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TIMELINE } from "@/lib/timeline";

const GOLD = "#D4A668";
const FLAME = "#ff4e1f";

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// Hide on pages that already have their own full-width hero messaging
const HIDDEN_PATHS = ["/", "/welcome-alii", "/seat-claimed"];

export default function TimelineStrip() {
  const pathname = usePathname();
  const now = useNow();

  if (HIDDEN_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))) return null;
  if (!now) return null;

  const gateOpen = TIMELINE.GATE_OPENS;
  const blueMoon = TIMELINE.BLUE_MOON_SEALING;
  const beforeGate = now < gateOpen;
  const afterSealing = now > blueMoon;

  if (afterSealing) return null; // founding window closed — strip no longer needed

  const target = beforeGate ? gateOpen : blueMoon;
  const diff = target.getTime() - now.getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const pad = (n: number) => String(n).padStart(2, "0");

  const label = beforeGate
    ? `🌕 GATE OPENS MAY 1 · 9AM HST (FULL MOON) — ${days}D ${pad(hours)}H ${pad(mins)}M ${pad(secs)}S`
    : `🌕 FOUNDING WINDOW CLOSES MAY 31 · 11:11 PM HST (BLUE MOON) — ${days}D ${pad(hours)}H ${pad(mins)}M ${pad(secs)}S`;

  const color = beforeGate ? GOLD : FLAME;
  const bg = beforeGate ? "rgba(212,166,104,0.05)" : "rgba(255,78,31,0.05)";
  const border = beforeGate ? "rgba(212,166,104,0.15)" : "rgba(255,78,31,0.2)";

  return (
    <div style={{
      background: bg,
      borderBottom: `1px solid ${border}`,
      padding: "9px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    }}>
      <div style={{
        width: 5, height: 5, borderRadius: "50%",
        background: color,
        flexShrink: 0,
        animation: "tspulse 1.4s ease-in-out infinite",
      }} />
      <style>{`@keyframes tspulse { 0%,100%{opacity:1;} 50%{opacity:0.25;} }`}</style>
      <p style={{
        color,
        fontSize: "12px",
        letterSpacing: "0.14em",
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        textAlign: "center",
        lineHeight: 1.4,
      }}>
        {label}
        {" · "}
        <a href="/mayday48/gate" style={{ color, textDecoration: "underline" }}>
          ENTER THE GATE →
        </a>
      </p>
    </div>
  );
}
