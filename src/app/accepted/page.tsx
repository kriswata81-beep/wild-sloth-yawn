"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductId } from "@/lib/stripe";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const BG = "#04060a";

const TIER_LABELS: Record<string, string> = {
  alii: "Aliʻi",
  mana: "Mana",
  nakoa: "Nā Koa",
};
const TIER_COLORS: Record<string, string> = {
  alii: GOLD,
  mana: BLUE,
  nakoa: GREEN,
};
const TIER_MESSAGES: Record<string, string> = {
  alii: "You lead rooms. You carry vision. The Aliʻi class is where men like you find the brothers who can keep up. Your seat at the founding council is waiting.",
  mana: "You build with your hands and your mind. The Mana class needs what you carry. Your skills become the backbone of what this order creates.",
  nakoa: "You show up. That is the rarest thing. The Nā Koa class is where men earn their place through action — and the order gives back tenfold.",
};

const COMMITMENTS = [
  "52 Wednesday 4am–6am elite reset trainings at community hotspots",
  "12 monthly trade and skills academies (9am–2pm)",
  "12 full moon Pō Mahina gatherings at the Makoa House",
  "4 quarterly Makoa 48 hotel gatherings — included",
  "Full 808 channel access (10 brother-to-brother channels)",
  "Makoa portal + DiceBear identity",
  "Tool library + Makoa Ride access",
  "Mentor pairing with an Aliʻi professional",
];

function useCountdown() {
  const target = new Date("2026-05-01T18:00:00-10:00").getTime();
  const zero = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const calc = () => {
    const diff = target - Date.now();
    if (diff <= 0) return zero;
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(zero);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return mounted ? time : zero;
}

function DiceBearAvatar({ seed }: { seed: string }) {
  const url = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0a0d12&radius=50`;
  return (
    <div style={{
      width: 72, height: 72, borderRadius: "50%",
      border: `2px solid ${GOLD_40}`,
      overflow: "hidden", margin: "0 auto",
      background: "#0a0d12",
      boxShadow: `0 0 24px ${GOLD_20}`,
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="Brother avatar" width={72} height={72} style={{ display: "block" }} />
    </div>
  );
}

function AcceptedContent() {
  const searchParams = useSearchParams();
  const [handle, setHandle] = useState("");
  const [tier, setTier] = useState("nakoa");
  const [revealed, setRevealed] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const { days, hours, minutes, seconds } = useCountdown();

  useEffect(() => {
    const urlHandle = searchParams.get("h") || searchParams.get("handle") || "";
    const urlTier = searchParams.get("t") || searchParams.get("tier") || "";
    const storedHandle = typeof window !== "undefined" ? sessionStorage.getItem("makoa_handle") || "" : "";
    const storedTier = typeof window !== "undefined" ? sessionStorage.getItem("makoa_xi_tier") || "" : "";
    setHandle(urlHandle || storedHandle || "Brother");
    setTier(urlTier || storedTier || "nakoa");
    const t = setTimeout(() => setRevealed(true), 800);
    return () => clearTimeout(t);
  }, [searchParams]);

  async function handleDuesCheckout() {
    setLoadingCheckout(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: "DUES_DOWN" as ProductId, handle }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned", data);
        setLoadingCheckout(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setLoadingCheckout(false);
    }
  }

  const tierColor = TIER_COLORS[tier] || GOLD;
  const tierLabel = TIER_LABELS[tier] || "Nā Koa";
  const tierMessage = TIER_MESSAGES[tier] || TIER_MESSAGES.nakoa;

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes pulse { 0%,100% { opacity:0.7; transform:scale(1); } 50% { opacity:1; transform:scale(1.02); } }
        @keyframes countFlip { 0% { transform:translateY(-4px); opacity:0; } 100% { transform:translateY(0); opacity:1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes teaseGlow { 0%,100% { box-shadow: 0 0 16px rgba(176,142,80,0.1); } 50% { box-shadow: 0 0 36px rgba(176,142,80,0.3); } }
      `}</style>

      {/* ── ACCEPTANCE BANNER ─────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, #0a0d12 0%, #060810 100%)`,
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "48px 24px 40px",
        textAlign: "center",
      }}>
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_40}, transparent)`, marginBottom: 32 }} />

        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em", marginBottom: 20 }}>
          MĀKOA ORDER · ACCEPTANCE
        </p>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: GOLD,
          fontSize: "2.4rem",
          lineHeight: 1.25,
          marginBottom: 24,
          animation: "fadeUp 0.9s ease 0.2s both",
        }}>
          ʻAe, {handle}.<br />
          You have been accepted<br />
          into the order.
        </p>

        <div style={{ animation: "fadeIn 1s ease 0.6s both", marginBottom: 16 }}>
          <DiceBearAvatar seed={handle} />
        </div>

        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", letterSpacing: "0.15em", animation: "fadeIn 1s ease 0.9s both" }}>
          {handle.toUpperCase()} · {tierLabel.toUpperCase()} CLASS
        </p>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>

        {/* ── XI MESSAGE ───────────────────────────────────────────────────── */}
        <div style={{
          margin: "32px 0",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ height: 1, flex: 1, background: `${tierColor}30` }} />
            <span style={{ color: tierColor, fontSize: "0.4rem", letterSpacing: "0.28em" }}>XI · GATE AGENT</span>
            <div style={{ height: 1, flex: 1, background: `${tierColor}30` }} />
          </div>
          <div style={{
            background: `${tierColor}08`,
            border: `1px solid ${tierColor}30`,
            borderLeft: `3px solid ${tierColor}`,
            borderRadius: "0 8px 8px 0",
            padding: "22px 20px",
          }}>
            <p style={{ color: tierColor, fontSize: "0.4rem", letterSpacing: "0.2em", marginBottom: 10 }}>
              XI HAS REVIEWED YOUR 12 ANSWERS
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "#e8e0d0",
              fontSize: "1.05rem",
              lineHeight: 1.9,
              marginBottom: 12,
            }}>
              You are called to the {tierLabel} class.<br />
              Your path begins now.
            </p>
            <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.5rem", lineHeight: 1.8 }}>
              {tierMessage}
            </p>
          </div>
        </div>

        {/* ── YOUR MAKOA COMMITMENT ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.25em", marginBottom: 20 }}>
            YOUR MAKOA COMMITMENT
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.65)",
            fontSize: "1.05rem",
            lineHeight: 2.0,
            marginBottom: 24,
            borderLeft: `2px solid ${GOLD_40}`,
            paddingLeft: 16,
          }}>
            The order asks one thing: $497 per year.<br />
            This is the founding rate — locked for life.<br />
            This is your commitment to the brotherhood —<br />
            and the brotherhood's commitment to you.
          </p>

          <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
            {COMMITMENTS.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "10px 14px",
                background: "rgba(176,142,80,0.04)",
                border: "1px solid rgba(176,142,80,0.08)",
                borderRadius: 6,
                animation: `fadeUp 0.6s ease ${0.1 + i * 0.06}s both`,
              }}>
                <span style={{ color: GOLD, fontSize: "0.55rem", flexShrink: 0, marginTop: 1 }}>✓</span>
                <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.5rem", lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>

          <div style={{
            background: "rgba(176,142,80,0.06)",
            border: `1px solid ${GOLD_20}`,
            borderRadius: 8,
            padding: "16px 18px",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "rgba(232,224,208,0.6)",
              fontSize: "1rem",
              lineHeight: 1.9,
            }}>
              This is healing. This is service.<br />
              This is what men need.
            </p>
          </div>
        </div>

        {/* ── PAYMENT SECTION ───────────────────────────────────────────────── */}
        <div style={{
          background: "#0a0d12",
          border: `1px solid ${GOLD_40}`,
          borderRadius: 12,
          padding: "28px 22px",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(176,142,80,0.04) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />

          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 16 }}>
            ANNUAL DUES · MALU TRUST · FOUNDING RATE
          </p>

          {/* Price display */}
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <p style={{ color: GOLD, fontSize: "3rem", fontWeight: 700, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>
              $497
            </p>
            <p style={{ color: GOLD_DIM, fontSize: "0.44rem", marginTop: 6 }}>per year · founding rate · locked for life</p>
          </div>

          {/* Payment breakdown */}
          <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
            {[
              { label: "25% down today", value: "$124.25", highlight: true },
              { label: "Then $31.06/mo for 12 months", value: "$372.75", highlight: false },
              { label: "Or pay in full", value: "$497", highlight: false },
            ].map(row => (
              <div key={row.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px",
                background: row.highlight ? "rgba(176,142,80,0.08)" : "transparent",
                border: `1px solid ${row.highlight ? GOLD_40 : "rgba(255,255,255,0.05)"}`,
                borderRadius: 6,
              }}>
                <span style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.48rem" }}>{row.label}</span>
                <span style={{
                  color: row.highlight ? GOLD : "#e8e0d0",
                  fontSize: row.highlight ? "0.75rem" : "0.55rem",
                  fontWeight: row.highlight ? 700 : 400,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleDuesCheckout}
            disabled={loadingCheckout}
            style={{
              width: "100%",
              background: GOLD,
              color: "#000",
              border: "none",
              padding: "16px",
              fontSize: "0.56rem",
              letterSpacing: "0.22em",
              cursor: loadingCheckout ? "not-allowed" : "pointer",
              borderRadius: 6,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              marginBottom: 10,
              opacity: loadingCheckout ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loadingCheckout ? (
              <>
                <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #000", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                SECURING...
              </>
            ) : "I COMMIT TO THE ORDER — $124.25 TODAY"}
          </button>
          <p style={{ textAlign: "center", color: "rgba(232,224,208,0.25)", fontSize: "0.42rem", lineHeight: 1.6 }}>
            Founding rate: $497/yr locked for life.<br />
            Your first quarterly 48 hotel gathering is covered.
          </p>
        </div>

        {/* ── THE MAKOA 48 TEASE ────────────────────────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.5)",
            fontSize: "0.95rem",
            textAlign: "center",
            marginBottom: 20,
          }}>
            Your first gathering is waiting.
          </p>

          <div style={{
            border: `1px solid ${GOLD_40}`,
            borderRadius: 10,
            background: "linear-gradient(135deg, #0a0d12 0%, #060810 100%)",
            padding: "24px 20px",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: 14, right: 14,
              background: GOLD, color: "#000",
              fontSize: "0.38rem", letterSpacing: "0.15em",
              padding: "3px 8px", borderRadius: 3,
            }}>FOUNDING EVENT</div>

            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 8 }}>
              MAYDAY MAKOA 2026
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: GOLD,
              fontSize: "1.5rem",
              margin: "0 0 6px",
            }}>
              May 1–3 · Kapolei, Hawaii
            </p>
            <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.5rem", marginBottom: 18, lineHeight: 1.7 }}>
              Your first gathering is 17 days away.<br />
              24 founding seats.
            </p>

            <div style={{ borderLeft: `2px solid ${GOLD_20}`, paddingLeft: 14, marginBottom: 20 }}>
              {[
                "War Room. Mastermind. 4am ice bath.",
                "Founding fire. Brothers sworn in.",
                "The only event where elevation happens.",
              ].map(line => (
                <p key={line} style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  color: "rgba(232,224,208,0.6)",
                  fontSize: "0.9rem",
                  lineHeight: 2.1,
                  margin: 0,
                }}>{line}</p>
              ))}
            </div>

            {/* Countdown */}
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: 12, textAlign: "center" }}>
              FOUNDING FIRE IN
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              {[
                { label: "DAYS", val: days },
                { label: "HRS", val: hours },
                { label: "MIN", val: minutes },
                { label: "SEC", val: seconds },
              ].map(t => (
                <div key={t.label} style={{
                  flex: 1, background: "rgba(0,0,0,0.5)",
                  border: `1px solid rgba(176,142,80,0.1)`,
                  borderRadius: 6, padding: "10px 4px", textAlign: "center",
                }}>
                  <p style={{
                    color: GOLD, fontSize: "1.2rem", fontWeight: 600, lineHeight: 1,
                    fontFamily: "'JetBrains Mono', monospace",
                    animation: "countFlip 0.3s ease",
                  }}>{String(t.val).padStart(2, "0")}</p>
                  <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.36rem", letterSpacing: "0.15em", marginTop: 4 }}>{t.label}</p>
                </div>
              ))}
            </div>

            <div style={{
              background: "rgba(176,142,80,0.06)",
              border: `1px solid ${GOLD_20}`,
              borderRadius: 6,
              padding: "12px 16px",
              textAlign: "center",
            }}>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.48rem", lineHeight: 1.7 }}>
                Full details drop tomorrow at 4am.<br />
                Your commitment unlocks access.
              </p>
            </div>
          </div>
        </div>

        {/* ── MAKAHIKI LAHAINA TEASE ────────────────────────────────────────── */}
        <div style={{
          marginBottom: 36,
          border: `1px solid rgba(176,142,80,0.25)`,
          borderRadius: 12,
          background: "linear-gradient(135deg, #0c0e10 0%, #080a0c 100%)",
          padding: "26px 22px",
          position: "relative",
          overflow: "hidden",
          animation: "teaseGlow 5s ease-in-out infinite",
        }}>
          {/* Subtle radial glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 100%, rgba(176,142,80,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Coming Soon badge */}
          <div style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(176,142,80,0.12)",
            border: `1px solid ${GOLD_40}`,
            color: GOLD_DIM,
            fontSize: "0.36rem", letterSpacing: "0.18em",
            padding: "3px 9px", borderRadius: 3,
          }}>COMING 2026</div>

          <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.28em", marginBottom: 12 }}>
            NEXT GATHERING · MAKAHIKI SEASON
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD,
            fontSize: "1.7rem",
            lineHeight: 1.2,
            marginBottom: 10,
          }}>
            Makahiki Lahaina
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.5)",
            fontSize: "0.95rem",
            lineHeight: 2.0,
            marginBottom: 18,
          }}>
            The ancient Makahiki season returns.<br />
            Brotherhood. Ceremony. The Valley of Lahaina.<br />
            West Maui. The land that remembers.
          </p>

          <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_20}, transparent)`, marginBottom: 18 }} />

          <p style={{
            color: "rgba(232,224,208,0.3)",
            fontSize: "0.46rem",
            lineHeight: 1.8,
            fontStyle: "italic",
          }}>
            Founding Brothers get first access.<br />
            Details drop after MAYDAY.
          </p>

          {/* Lock icon */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
            <span style={{ color: GOLD_DIM, fontSize: "0.8rem" }}>🔒</span>
            <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.42rem", letterSpacing: "0.12em" }}>
              FOUNDING BROTHERS ONLY · LOCKED UNTIL MAYDAY
            </p>
          </div>
        </div>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "0.95rem",
            marginBottom: 12,
          }}>
            Hana · Pale · Ola
          </p>
          <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.42rem", marginBottom: 6 }}>
            Questions: wakachief@gmail.com
          </p>
          <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.4rem", letterSpacing: "0.15em" }}>
            UNDER THE MALU · MALU TRUST · WEST OAHU · 2026
          </p>
        </div>

      </div>
    </div>
  );
}

export default function AcceptedPage() {
  return (
    <Suspense fallback={
      <div style={{ background: "#04060a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(176,142,80,0.4)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.2em" }}>
          LOADING...
        </p>
      </div>
    }>
      <AcceptedContent />
    </Suspense>
  );
}
