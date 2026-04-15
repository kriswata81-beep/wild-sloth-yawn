"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.6)";
const GOLD_FAINT = "rgba(176,142,80,0.08)";
const BG = "#04060a";

function useCountdown() {
  const target = new Date("2026-05-01T18:00:00-10:00").getTime();
  const calc = () => {
    const diff = target - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      done: false,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function PosterPage() {
  const { days, hours, minutes, seconds, done } = useCountdown();
  const [ready, setReady] = useState(false);
  const [variant, setVariant] = useState<"dark" | "fire">("dark");

  useEffect(() => { setTimeout(() => setReady(true), 200); }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "20px 16px 40px",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes coronaPulse { 0%,100% { opacity:0.7; transform:scale(1); } 50% { opacity:1; transform:scale(1.03); } }
        @keyframes flicker { 0%,100% { opacity:1; } 45% { opacity:0.85; } 55% { opacity:0.95; } }
        @keyframes countTick { 0% { transform:translateY(-4px); opacity:0; } 100% { transform:translateY(0); opacity:1; } }
      `}</style>

      {/* Variant toggle */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 20,
        animation: "fadeUp 0.4s ease forwards",
      }}>
        {(["dark", "fire"] as const).map(v => (
          <button key={v} onClick={() => setVariant(v)} style={{
            background: variant === v ? GOLD_FAINT : "transparent",
            border: `1px solid ${variant === v ? GOLD : "rgba(176,142,80,0.2)"}`,
            color: variant === v ? GOLD : "rgba(176,142,80,0.3)",
            padding: "6px 14px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: "0.36rem",
            letterSpacing: "0.14em",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {v === "dark" ? "DARK DROP" : "FIRE DROP"}
          </button>
        ))}
      </div>

      {/* ── THE POSTER ── screenshot this */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: variant === "fire"
          ? "linear-gradient(180deg, #0a0500 0%, #04060a 40%, #04060a 100%)"
          : BG,
        border: `1px solid rgba(176,142,80,0.25)`,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        animation: "fadeUp 0.5s ease 0.1s both",
      }}>

        {/* Top glow */}
        <div style={{
          position: "absolute", top: -60, left: "50%",
          transform: "translateX(-50%)",
          width: 300, height: 300,
          borderRadius: "50%",
          background: variant === "fire"
            ? "radial-gradient(circle, rgba(255,120,20,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(176,142,80,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ padding: "36px 28px 32px", position: "relative" }}>

          {/* Order mark */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.3em", marginBottom: 16 }}>
              MĀKOA ORDER · WEST OAHUʻ
            </p>

            {/* Eclipse corona */}
            <div style={{
              width: 110, height: 110,
              borderRadius: "50%",
              border: `2px solid ${GOLD}`,
              margin: "0 auto 6px",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
              animation: "coronaPulse 4s ease-in-out infinite",
              boxShadow: variant === "fire"
                ? `0 0 40px rgba(255,120,20,0.2), 0 0 80px rgba(176,142,80,0.1)`
                : `0 0 40px rgba(176,142,80,0.15)`,
            }}>
              {/* Inner ring */}
              <div style={{
                position: "absolute", inset: 8,
                borderRadius: "50%",
                border: `1px solid rgba(176,142,80,0.3)`,
              }} />
              {/* XI mark */}
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                color: GOLD,
                fontSize: "2rem",
                lineHeight: 1,
                animation: "flicker 6s ease-in-out infinite",
              }}>XI</span>
            </div>
          </div>

          {/* MAYDAY headline */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "3.8rem",
              color: GOLD,
              margin: "0 0 4px",
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: "0.04em",
              textShadow: variant === "fire" ? "0 0 40px rgba(255,140,0,0.4)" : "none",
            }}>
              MAYDAY
            </h1>
            <p style={{
              color: GOLD,
              fontSize: "1.6rem",
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "0.2em",
              lineHeight: 1,
              opacity: 0.7,
            }}>
              2026
            </p>
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
            marginBottom: 24,
            opacity: 0.4,
          }} />

          {/* Countdown */}
          {!done ? (
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.25em", textAlign: "center", marginBottom: 14 }}>
                THE GATE CLOSES IN
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {[
                  { val: days, label: "DAYS" },
                  { val: hours, label: "HRS" },
                  { val: minutes, label: "MIN" },
                  { val: seconds, label: "SEC" },
                ].map(({ val, label }) => (
                  <div key={label} style={{
                    flex: 1,
                    textAlign: "center",
                    background: GOLD_FAINT,
                    border: `1px solid rgba(176,142,80,0.2)`,
                    borderRadius: 8,
                    padding: "10px 4px",
                  }}>
                    <p style={{
                      color: GOLD,
                      fontSize: "1.6rem",
                      fontFamily: "'Cormorant Garamond', serif",
                      lineHeight: 1,
                      marginBottom: 4,
                      animation: "countTick 0.15s ease",
                    }}>
                      {pad(val)}
                    </p>
                    <p style={{ color: GOLD_DIM, fontSize: "0.3rem", letterSpacing: "0.14em" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <p style={{ color: GOLD, fontSize: "1.2rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                The fire is lit.
              </p>
            </div>
          )}

          {/* Event details */}
          <div style={{
            background: GOLD_FAINT,
            border: `1px solid rgba(176,142,80,0.15)`,
            borderRadius: 10,
            padding: "16px",
            marginBottom: 20,
          }}>
            {[
              { label: "DATE", value: "May 1–3, 2026" },
              { label: "LOCATION", value: "West Oahuʻ, Hawaii" },
              { label: "FORMAT", value: "48-Hour Founding Event" },
              { label: "SEATS", value: "48 Brothers · Founding Only" },
            ].map((row, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: i < 3 ? "1px solid rgba(176,142,80,0.07)" : "none",
              }}>
                <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.12em" }}>{row.label}</p>
                <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "0.38rem" }}>{row.value}</p>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "rgba(232,224,208,0.5)",
              fontSize: "0.9rem",
              lineHeight: 1.7,
            }}>
              Not a gym. Not a podcast.<br />
              A brotherhood of men who build real things.<br />
              <span style={{ color: GOLD }}>The founding fire happens once.</span>
            </p>
          </div>

          {/* CTA */}
          <div style={{
            background: GOLD,
            borderRadius: 8,
            padding: "12px 0",
            textAlign: "center",
          }}>
            <p style={{
              color: BG,
              fontSize: "0.42rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              letterSpacing: "0.18em",
            }}>
              ENTER THE GATE → MAKOA.LIVE
            </p>
          </div>

          {/* Bottom mark */}
          <p style={{
            textAlign: "center",
            color: "rgba(176,142,80,0.2)",
            fontSize: "0.32rem",
            letterSpacing: "0.2em",
            marginTop: 16,
          }}>
            MĀKOA ORDER · 1846 · 2026
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        maxWidth: 420, width: "100%", marginTop: 16,
        animation: "fadeUp 0.5s ease 0.3s both",
      }}>
        <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.36rem", letterSpacing: "0.14em", textAlign: "center", marginBottom: 12 }}>
          SCREENSHOT THE POSTER ABOVE · DROP DAILY
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {[
            { label: "IG / FB", icon: "📸", text: "The founding fire happens once.\n\nWest Oahu. May 1–3.\n\nScan if you're one of them. 🔥\n\nmakoa.live\n\n#Mākoa #Brotherhood #WestOahu #MAYDAY2026" },
            { label: "STORY", icon: "🎬", text: "Not a gym. Not a podcast.\n\nA brotherhood of men who build real things.\n\nWest Oahu. May 1–3. 🤙\n\nmakoa.live" },
            { label: "MYSTERY DROP", icon: "🔥", text: "👁\n\nmakoa.live\n\n." },
          ].map(item => (
            <CopyBtn key={item.label} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CopyBtn({ label, icon, text }: { label: string; icon: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{
        background: copied ? "rgba(176,142,80,0.1)" : "rgba(176,142,80,0.03)",
        border: `1px solid ${copied ? "rgba(176,142,80,0.4)" : "rgba(176,142,80,0.12)"}`,
        borderRadius: 8, padding: "10px 14px", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        transition: "all 0.2s",
      }}
    >
      <div style={{ textAlign: "left" }}>
        <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.34rem", letterSpacing: "0.14em", marginBottom: 3, fontFamily: "'JetBrains Mono', monospace" }}>
          {icon} {label}
        </p>
        <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.38rem", lineHeight: 1.5, whiteSpace: "pre-line", fontFamily: "'JetBrains Mono', monospace" }}>
          {text}
        </p>
      </div>
      <p style={{ color: copied ? "#b08e50" : "rgba(176,142,80,0.25)", fontSize: "0.34rem", flexShrink: 0, marginLeft: 10, fontFamily: "'JetBrains Mono', monospace", transition: "color 0.2s" }}>
        {copied ? "✓ COPIED" : "TAP"}
      </p>
    </button>
  );
}
