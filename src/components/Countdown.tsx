"use client";
import { useEffect, useState } from "react";

interface CountdownProps {
  targetIso: string; // ISO string — pass from server
  label: string;
  variant?: "flame" | "gold" | "malu";
}

function calc(targetIso: string) {
  const ms = new Date(targetIso).getTime() - Date.now();
  if (ms <= 0) return { d: 0, h: 0, m: 0, past: true };
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms % 86400000) / 3600000),
    m: Math.floor((ms % 3600000) / 60000),
    past: false,
  };
}

export default function Countdown({ targetIso, label, variant = "gold" }: CountdownProps) {
  const colors = {
    flame: { num: "#ff4e1f", text: "#f5ecd9" },
    gold:  { num: "#d4af37", text: "#f5ecd9" },
    malu:  { num: "#9d7fff", text: "#f5ecd9" },
  };
  const c = colors[variant];
  const [time, setTime] = useState(() => calc(targetIso));

  useEffect(() => {
    setTime(calc(targetIso));
    const id = setInterval(() => setTime(calc(targetIso)), 60000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (time.past) return (
    <div style={{ textAlign: "center", color: c.num, fontSize: "0.8rem", letterSpacing: "0.2em" }}>
      {label.toUpperCase()} · NOW
    </div>
  );

  return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <div style={{ color: c.text, fontSize: "0.5rem", letterSpacing: "0.25em", marginBottom: 8, opacity: 0.5 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "baseline" }}>
        {[{ val: time.d, unit: "d" }, { val: time.h, unit: "h" }, { val: time.m, unit: "m" }].map(({ val, unit }) => (
          <div key={unit} style={{ textAlign: "center" }}>
            <span style={{ color: c.num, fontSize: "2.2rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
              {String(val).padStart(2, "0")}
            </span>
            <span style={{ color: c.text, fontSize: "0.55rem", marginLeft: 3, opacity: 0.45 }}>{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
