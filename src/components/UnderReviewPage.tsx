"use client";

import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const BG = "#04060a";

interface UnderReviewPageProps {
  name: string;
  // For demo: simulate acceptance after a delay
  onAccepted: () => void;
}

function useReviewCountdown() {
  // Next review window: 24 hours from now
  const [target] = useState(() => Date.now() + 24 * 60 * 60 * 1000);
  const calc = () => {
    const diff = target - Date.now();
    if (diff <= 0) return { hours: 0, mins: 0, secs: 0 };
    return {
      hours: Math.floor(diff / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
      secs: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

function CountBox({ value, label }: { value: number; label: string }) {
  return (
    <div style={{
      background: "#080c10", border: "0.5px solid rgba(176,142,80,0.15)",
      borderRadius: 8, padding: "14px 8px", textAlign: "center", flex: 1,
    }}>
      <div style={{ fontSize: "2rem", fontWeight: 700, color: GOLD, lineHeight: 1, fontFamily: "var(--font-jetbrains)" }}>
        {String(value).padStart(2, "0")}
      </div>
      <div style={{ fontSize: "0.48rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(176,142,80,0.3)", marginTop: 5, fontFamily: "var(--font-jetbrains)" }}>
        {label}
      </div>
    </div>
  );
}

const STEPS = [
  { label: "Pledge received", done: true, active: false },
  { label: "XI Admissions reviewing", done: false, active: true },
  { label: "Formation Committee contact", done: false, active: false },
  { label: "Seat secured", done: false, active: false },
];

export default function UnderReviewPage({ name, onAccepted }: UnderReviewPageProps) {
  const { hours, mins, secs } = useReviewCountdown();
  const displayName = name.trim() || "brother";

  return (
    <div style={{ background: BG, minHeight: "100dvh", fontFamily: "var(--font-jetbrains)", overflowX: "hidden" }}>

      {/* Radial glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 30%, rgba(176,142,80,0.05) 0%, transparent 65%)",
      }} />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "60px 20px 40px", position: "relative", zIndex: 1 }}>

        {/* Moon */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "2.8rem", marginBottom: 16, opacity: 0.75 }}>🌕</div>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 10px" }}>
            Application Under Review
          </p>
          <h1 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "2rem", margin: "0 0 10px", lineHeight: 1.2 }}>
            ʻAe, {displayName}.
          </h1>
          <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.65rem", lineHeight: 1.8, margin: 0 }}>
            Your pledge has been received.<br />
            XI is reviewing your application.
          </p>
        </div>

        {/* Countdown to next review */}
        <div style={{ background: "#060810", border: "1px solid rgba(176,142,80,0.12)", borderRadius: 12, padding: "20px 16px", marginBottom: 24 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center", margin: "0 0 14px" }}>
            Next review window closes in
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <CountBox value={hours} label="hours" />
            <CountBox value={mins} label="minutes" />
            <CountBox value={secs} label="seconds" />
          </div>
          <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.55rem", textAlign: "center", margin: "12px 0 0", lineHeight: 1.6 }}>
            Applications reviewed within 24 hours<br />
            Formation Committee reaches out within 48
          </p>
        </div>

        {/* Progress steps */}
        <div style={{ background: "#060810", border: "1px solid rgba(176,142,80,0.08)", borderRadius: 12, padding: "20px 16px", marginBottom: 24 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 16px" }}>
            Your Formation Path
          </p>
          {STEPS.map(({ label, done, active }, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < STEPS.length - 1 ? 16 : 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: done ? GOLD : active ? "rgba(176,142,80,0.1)" : "rgba(176,142,80,0.04)",
                border: `1px solid ${done ? GOLD : active ? "rgba(176,142,80,0.4)" : "rgba(176,142,80,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem",
              }}>
                {done ? <span style={{ color: "#000" }}>✓</span> : active ? <span style={{ color: GOLD, fontSize: "0.5rem" }}>●</span> : <span style={{ color: "rgba(176,142,80,0.2)" }}>{i + 1}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  color: done ? GOLD : active ? "rgba(176,142,80,0.8)" : "rgba(176,142,80,0.3)",
                  fontSize: "0.65rem", margin: 0, fontWeight: active ? 600 : 400,
                }}>
                  {label}
                </p>
                {active && (
                  <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.55rem", margin: "2px 0 0" }}>
                    In progress · within 24 hours
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* What to expect */}
        <div style={{ background: "rgba(176,142,80,0.02)", border: "1px solid rgba(176,142,80,0.1)", borderRadius: 12, padding: "18px 16px", marginBottom: 24 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>
            What happens next
          </p>
          {[
            { icon: "📱", text: "XI will contact you via Telegram within 24 hours of your pledge." },
            { icon: "🤝", text: "If accepted, the Formation Committee reaches out within 48 hours to connect you with brothers in your zone." },
            { icon: "🌕", text: "Your seat at the May 1 founding event is held pending acceptance." },
            { icon: "✦", text: "Keep your signal open. The order moves when it moves." },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: "0.8rem", flexShrink: 0 }}>{icon}</span>
              <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.62rem", lineHeight: 1.7, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Demo: simulate acceptance */}
        <button
          onClick={onAccepted}
          style={{
            width: "100%", background: "transparent",
            border: "1px solid rgba(176,142,80,0.2)", color: GOLD_DIM,
            padding: "14px", borderRadius: 8,
            fontFamily: "var(--font-jetbrains)", fontSize: "0.62rem",
            letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer",
            marginBottom: 12,
          }}
        >
          SIMULATE ACCEPTANCE →
        </button>

        <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.52rem", textAlign: "center", lineHeight: 1.6 }}>
          Mākoa Order · Malu Trust · West Oahu · 2026
        </p>
      </div>
    </div>
  );
}
