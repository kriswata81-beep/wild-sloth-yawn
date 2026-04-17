"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.6)";
const GOLD_FAINT = "rgba(176,142,80,0.08)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const BG = "#04060a";

// Gate closes April 25 — countdown to that
function useGateCountdown() {
  const gateClose = new Date("2026-04-25T23:59:59-10:00").getTime();
  const eventStart = new Date("2026-05-01T18:00:00-10:00").getTime();
  const calc = () => {
    const now = Date.now();
    const gateDiff = gateClose - now;
    const eventDiff = eventStart - now;
    const gateDone = gateDiff <= 0;
    const diff = gateDone ? eventDiff : gateDiff;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, gateDone, eventDone: eventDiff <= 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      gateDone,
      eventDone: eventDiff <= 0,
    };
  };
  const [time, setTime] = useState<ReturnType<typeof calc> | null>(null);
  useEffect(() => {
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const PROGRAM = [
  { icon: "🧊", label: "4AM ICE BATH", desc: "Both mornings. Ko Olina. No excuses." },
  { icon: "⚔", label: "ELITE TRAINING", desc: "Formation run. Combat fitness. Breathwork." },
  { icon: "🧠", label: "MASTERMIND", desc: "Mana class. Build together. Trade + business." },
  { icon: "🔗", label: "NETWORK 2 NETWORK", desc: "Aliʻi class. Room to room. B2B deal flow." },
  { icon: "🏗", label: "B2B · B2C", desc: "Route contracts. Client pipeline. Trade ops." },
  { icon: "🤝", label: "PEER 2 PEER", desc: "Nā Koa class. Skills shared. Brotherhood built." },
  { icon: "🔥", label: "FOUNDERS SUMMIT", desc: "All classes. One table. The order is born." },
  { icon: "🌅", label: "FOUNDING FIRE", desc: "Sunday sunrise. The oath. The order begins." },
];

export default function PosterPage() {
  const time = useGateCountdown();
  const days = time?.days ?? 0;
  const hours = time?.hours ?? 0;
  const minutes = time?.minutes ?? 0;
  const seconds = time?.seconds ?? 0;
  const gateDone = time?.gateDone ?? false;
  const eventDone = time?.eventDone ?? false;

  const [ready, setReady] = useState(false);
  const [variant, setVariant] = useState<"countdown" | "program">("countdown");

  useEffect(() => { setTimeout(() => setReady(true), 200); }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  const countdownLabel = gateDone ? "UNTIL THE FIRE" : "GATE CLOSES IN";

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
        @keyframes coronaPulse { 0%,100% { opacity:0.75; transform:scale(1); } 50% { opacity:1; transform:scale(1.03); } }
        @keyframes flicker { 0%,100% { opacity:1; } 45% { opacity:0.8; } 55% { opacity:0.95; } }
      `}</style>

      {/* Variant toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, animation: "fadeUp 0.4s ease forwards" }}>
        {([
          { id: "countdown", label: "⏱ COUNTDOWN DROP" },
          { id: "program",   label: "📋 PROGRAM DROP" },
        ] as const).map(v => (
          <button key={v.id} onClick={() => setVariant(v.id)} style={{
            background: variant === v.id ? GOLD_FAINT : "transparent",
            border: `1px solid ${variant === v.id ? GOLD : "rgba(176,142,80,0.2)"}`,
            color: variant === v.id ? GOLD : "rgba(176,142,80,0.3)",
            padding: "7px 14px", borderRadius: 6, cursor: "pointer",
            fontSize: "0.36rem", letterSpacing: "0.12em",
            fontFamily: "'JetBrains Mono', monospace",
            transition: "all 0.2s",
          }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* ── THE POSTER ── screenshot this whole card */}
      <div style={{
        width: "100%", maxWidth: 400,
        background: BG,
        border: `1px solid rgba(176,142,80,0.28)`,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        animation: "fadeUp 0.5s ease 0.1s both",
      }}>
        {/* Top glow */}
        <div style={{
          position: "absolute", top: -80, left: "50%",
          transform: "translateX(-50%)",
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(176,142,80,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ padding: "32px 24px 28px", position: "relative" }}>

          {/* Order mark */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.3em", marginBottom: 14 }}>
              MĀKOA ORDER · WEST OAHUʻ
            </p>

            {/* Eclipse corona */}
            <div style={{
              width: 90, height: 90, borderRadius: "50%",
              border: `2px solid ${GOLD}`,
              margin: "0 auto 4px",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
              animation: "coronaPulse 4s ease-in-out infinite",
              boxShadow: "0 0 40px rgba(176,142,80,0.18)",
            }}>
              <div style={{ position: "absolute", inset: 7, borderRadius: "50%", border: "1px solid rgba(176,142,80,0.25)" }} />
              <span style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                color: GOLD, fontSize: "1.7rem", lineHeight: 1,
                animation: "flicker 6s ease-in-out infinite",
              }}>XI</span>
            </div>
          </div>

          {/* MAYDAY headline */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
              fontSize: "3.4rem", color: GOLD,
              margin: "0 0 2px", fontWeight: 300, lineHeight: 1, letterSpacing: "0.04em",
            }}>
              MAYDAY
            </h1>
            <p style={{
              color: GOLD, fontSize: "1.4rem",
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "0.22em", lineHeight: 1, opacity: 0.65,
            }}>2026</p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, marginBottom: 20, opacity: 0.35 }} />

          {/* ── COUNTDOWN VARIANT ── */}
          {variant === "countdown" && (
            <>
              <div style={{ marginBottom: 20 }}>
                <p style={{ color: GOLD_DIM, fontSize: "0.32rem", letterSpacing: "0.25em", textAlign: "center", marginBottom: 12 }}>
                  {countdownLabel}
                </p>
                {!eventDone ? (
                  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    {[
                      { val: days, label: "DAYS" },
                      { val: hours, label: "HRS" },
                      { val: minutes, label: "MIN" },
                      { val: seconds, label: "SEC" },
                    ].map(({ val, label }) => (
                      <div key={label} style={{
                        flex: 1, textAlign: "center",
                        background: GOLD_FAINT,
                        border: `1px solid rgba(176,142,80,0.2)`,
                        borderRadius: 8, padding: "10px 4px",
                      }}>
                        <p style={{ color: GOLD, fontSize: "1.5rem", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1, marginBottom: 4 }}>
                          {pad(val)}
                        </p>
                        <p style={{ color: GOLD_DIM, fontSize: "0.28rem", letterSpacing: "0.12em" }}>{label}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: GOLD, textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.2rem" }}>
                    The fire is lit.
                  </p>
                )}
              </div>

              {/* What's happening — teaser */}
              <div style={{
                background: GOLD_FAINT, border: `1px solid ${GOLD_20}`,
                borderRadius: 10, padding: "14px", marginBottom: 18,
              }}>
                <p style={{ color: GOLD_DIM, fontSize: "0.3rem", letterSpacing: "0.22em", marginBottom: 10 }}>WHAT HAPPENS INSIDE</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 10px" }}>
                  {PROGRAM.map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: "0.55rem" }}>{p.icon}</span>
                      <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.32rem", letterSpacing: "0.08em" }}>{p.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── PROGRAM VARIANT ── */}
          {variant === "program" && (
            <div style={{ marginBottom: 18 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.3rem", letterSpacing: "0.25em", textAlign: "center", marginBottom: 14 }}>
                WEST OAHU · MAY 1–3 · WHAT YOU'RE WALKING INTO
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                {PROGRAM.map((p, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    padding: "9px 12px",
                    background: GOLD_FAINT,
                    border: `1px solid rgba(176,142,80,0.12)`,
                    borderRadius: 8,
                  }}>
                    <span style={{ fontSize: "0.8rem", flexShrink: 0 }}>{p.icon}</span>
                    <div>
                      <p style={{ color: GOLD, fontSize: "0.34rem", letterSpacing: "0.12em", marginBottom: 2 }}>{p.label}</p>
                      <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.32rem", lineHeight: 1.5 }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event details */}
          <div style={{
            background: GOLD_FAINT, border: `1px solid rgba(176,142,80,0.12)`,
            borderRadius: 10, padding: "12px 14px", marginBottom: 18,
          }}>
            {[
              { label: "DATE", value: "May 1–4, 2026" },
              { label: "LOCATION", value: "West Oahuʻ, Hawaii" },
              { label: "GATE CLOSES", value: "April 25 · Final call" },
              { label: "SEATS", value: "48 Brothers · Founding only" },
            ].map((row, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                padding: "5px 0",
                borderBottom: i < 3 ? "1px solid rgba(176,142,80,0.07)" : "none",
              }}>
                <p style={{ color: GOLD_DIM, fontSize: "0.32rem", letterSpacing: "0.1em" }}>{row.label}</p>
                <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.34rem" }}>{row.value}</p>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
              color: "rgba(232,224,208,0.45)", fontSize: "0.85rem", lineHeight: 1.7,
            }}>
              Not a gym. Not a podcast.<br />
              A brotherhood of men who build real things.<br />
              <span style={{ color: GOLD }}>The founding fire burns the first weekend of every month.</span>
            </p>
          </div>

          {/* CTA bar */}
          <div style={{ background: GOLD, borderRadius: 8, padding: "11px 0", textAlign: "center" }}>
            <p style={{
              color: BG, fontSize: "0.38rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700, letterSpacing: "0.16em",
            }}>
              ENTER THE GATE → MAKOA.LIVE
            </p>
          </div>

          {/* Bottom mark */}
          <p style={{ textAlign: "center", color: "rgba(176,142,80,0.18)", fontSize: "0.28rem", letterSpacing: "0.2em", marginTop: 14 }}>
            MĀKOA ORDER · 1846 · 2026
          </p>
        </div>
      </div>

      {/* Day 12 generated poster — tap and hold to save */}
      <div style={{ maxWidth: 400, width: "100%", marginTop: 16, animation: "fadeUp 0.5s ease 0.25s both" }}>
        <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.34rem", letterSpacing: "0.14em", textAlign: "center", marginBottom: 10 }}>
          📸 DAY 12 POSTER · HOLD TO SAVE IMAGE
        </p>
        <img
          src="/mayday-poster-20seats.png"
          alt="MAYDAY 2026 — Only 20 Seats Remaining"
          style={{ width: "100%", borderRadius: 12, border: "1px solid rgba(176,142,80,0.2)", display: "block" }}
        />
      </div>

      {/* Instructions */}
      <div style={{ maxWidth: 400, width: "100%", marginTop: 16, animation: "fadeUp 0.5s ease 0.3s both" }}>
        <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.34rem", letterSpacing: "0.14em", textAlign: "center", marginBottom: 12 }}>
          SCREENSHOT THE POSTER · DROP DAILY · GATE CLOSES APR 25
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {[
            {
              label: "COUNTDOWN DROP",
              icon: "⏱",
              text: `${days} days until the gate closes.\n\nWest Oahu. May 1–4.\n\n4am ice bath. Elite training. Mastermind. Network 2 Network. B2B. B2C. P2P. Founders Summit.\n\nThe founding fire burns the first weekend of every month.\n\nENTER THE GATE → makoa.live\n\n#Mākoa #Brotherhood #WestOahu #MAYDAY2026`,
            },
            {
              label: "PROGRAM DROP",
              icon: "📋",
              text: `Here's what you're walking into.\n\n🧊 4am Ice Bath — both mornings\n⚔ Elite Training — formation + combat fitness\n🧠 Mastermind — build together\n🔗 Network 2 Network — room to room\n🏗 B2B · B2C — route contracts + client pipeline\n🤝 Peer 2 Peer — skills shared\n🔥 Founders Summit — all classes, one table\n🌅 Founding Fire — the oath. The order begins.\n\nWest Oahu. May 1–4.\n\nmakoa.live\n\n#MAYDAY2026 #Mākoa`,
            },
            {
              label: "GATE CLOSING DROP",
              icon: "🚨",
              text: `The gate closes April 25.\n\nAfter that — no entry. No exceptions.\n\nWest Oahu. May 1–4.\n\nIf you've been watching — now is the time.\n\nmakoa.live\n\n#Mākoa #Brotherhood #WestOahu`,
            },
            {
              label: "MYSTERY DROP",
              icon: "🔥",
              text: "👁\n\nmakoa.live\n\n.",
            },
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
      onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
      style={{
        width: "100%", background: copied ? "rgba(176,142,80,0.1)" : "rgba(176,142,80,0.03)",
        border: `1px solid ${copied ? "rgba(176,142,80,0.4)" : "rgba(176,142,80,0.12)"}`,
        borderRadius: 8, padding: "10px 14px", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        transition: "all 0.2s", textAlign: "left",
      }}
    >
      <div>
        <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.34rem", letterSpacing: "0.14em", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
          {icon} {label}
        </p>
        <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.36rem", lineHeight: 1.6, whiteSpace: "pre-line", fontFamily: "'JetBrains Mono', monospace" }}>
          {text}
        </p>
      </div>
      <p style={{ color: copied ? "#b08e50" : "rgba(176,142,80,0.25)", fontSize: "0.34rem", flexShrink: 0, marginLeft: 10, fontFamily: "'JetBrains Mono', monospace", transition: "color 0.2s" }}>
        {copied ? "✓ COPIED" : "TAP"}
      </p>
    </button>
  );
}