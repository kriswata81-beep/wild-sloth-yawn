"use client";
import { useEffect, useState } from "react";

interface CountdownProps {
  target: Date;
  label: string;
  variant?: "flame" | "gold" | "malu";
}

const COLORS = {
  flame: "#ff4e1f",
  gold:  "#d4af37",
  malu:  "#9d7fff",
};

export default function Countdown({ target, label, variant = "gold" }: CountdownProps) {
  const color = COLORS[variant];

  const calc = () => {
    const ms = target.getTime() - Date.now();
    if (ms <= 0) return { d: 0, h: 0, m: 0, past: true };
    return {
      d: Math.floor(ms / 86400000),
      h: Math.floor((ms % 86400000) / 3600000),
      m: Math.floor((ms % 3600000) / 60000),
      past: false,
    };
  };

  const [time, setTime] = useState<ReturnType<typeof calc> | null>(null);

  useEffect(() => {
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 60000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!time) return null;

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <p style={{
        color: `${color}99`,
        fontSize: "0.38rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        margin: 0,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        {label}
      </p>
      {time.past ? (
        <p style={{ color, fontSize: "0.9rem", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
          NOW
        </p>
      ) : (
        <p style={{
          color,
          fontSize: "1.1rem",
          fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.08em",
          margin: 0,
        }}>
          {time.d}d {String(time.h).padStart(2, "0")}h {String(time.m).padStart(2, "0")}m
        </p>
      )}
    </div>
  );
}
