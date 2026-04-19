"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";

const TIER_CONFIG: Record<string, { label: string; color: string; rank: string; symbol: string; tagline: string }> = {
  alii: {
    label: "Aliʻi",
    color: "#b08e50",
    rank: "LEADERSHIP CLASS",
    symbol: "◈",
    tagline: "You lead. The order needs men like you.",
  },
  mana: {
    label: "Mana",
    color: "#58a6ff",
    rank: "BUILDER CLASS",
    symbol: "◉",
    tagline: "You build. The order runs on men like you.",
  },
  nakoa: {
    label: "Nā Koa",
    color: "#3fb950",
    rank: "WARRIOR CLASS",
    symbol: "▲",
    tagline: "You show up. The order is built by men like you.",
  },
};

function ShareCard({ handle, tier, tierConfig }: { handle: string; tier: string; tierConfig: typeof TIER_CONFIG[string] }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0a0d12 0%, #060810 100%)",
      border: `1px solid ${tierConfig.color}40`,
      borderRadius: 12,
      padding: "28px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Corner accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(to right, transparent, ${tierConfig.color}60, transparent)`,
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: `${tierConfig.color}15`,
          border: `1px solid ${tierConfig.color}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.2rem", color: tierConfig.color,
        }}>
          {tierConfig.symbol}
        </div>
        <div>
          <p style={{ color: tierConfig.color, fontSize: "0.38rem", letterSpacing: "0.22em", margin: 0 }}>
            MĀKOA ORDER · {tierConfig.rank}
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            color: "#e8e0d0", fontSize: "1.1rem", margin: "2px 0 0", lineHeight: 1.2,
          }}>
            {handle ? handle : "A Brother"} has passed the gate
          </p>
        </div>
      </div>

      {/* Tagline */}
      <p style={{
        color: "rgba(232,224,208,0.5)", fontSize: "0.52rem", lineHeight: 1.7,
        borderLeft: `2px solid ${tierConfig.color}40`, paddingLeft: 12, marginBottom: 18,
      }}>
        {tierConfig.tagline}
      </p>

      {/* Rank badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: `${tierConfig.color}10`, border: `1px solid ${tierConfig.color}30`,
        borderRadius: 6, padding: "8px 14px",
      }}>
        <span style={{ color: tierConfig.color, fontSize: "0.44rem", letterSpacing: "0.15em" }}>
          {tierConfig.label} · Founding Member
        </span>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid rgba(176,142,80,0.08)` }}>
        <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.36rem", letterSpacing: "0.15em" }}>
          makoa.live · West Oahu · Est. 2026
        </p>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [xiMessage, setXiMessage] = useState("");
  const [xiTier, setXiTier] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharePhase, setSharePhase] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHandle(sessionStorage.getItem("makoa_handle") || "");
      setXiMessage(sessionStorage.getItem("makoa_xi_message") || "");
      setXiTier(sessionStorage.getItem("makoa_xi_tier") || "");
    }
    const t1 = setTimeout(() => setRevealed(true), 1200);
    const t2 = setTimeout(() => setBtnVisible(true), 4000);
    const t3 = setTimeout(() => setSharePhase(true), 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const tierConfig = TIER_CONFIG[xiTier] || TIER_CONFIG.nakoa;
  const tierColor = tierConfig.color;

  // Build referral link using handle
  const refCode = handle
    ? handle.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16)
    : "brother";
  const referralLink = `https://makoa.live/gate?ref=${refCode}`;

  function copyLink() {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // fallback: select text
    });
  }

  function shareNative() {
    if (navigator.share) {
      navigator.share({
        title: "Mākoa Order — The Gate is Open",
        text: `I just passed the gate at Mākoa Order. West Oahu brotherhood. Real men. Real training. If you're ready — use my link:`,
        url: referralLink,
      }).catch(() => {});
    } else {
      copyLink();
    }
  }

  const shareMessages = [
    `Just passed the gate at Mākoa Order. West Oahu brotherhood — real men, real training, 4am ice baths. If you're built for this: ${referralLink}`,
    `I'm in. Mākoa Order — founding member. West Oahu. If you've been waiting for something real: ${referralLink}`,
    `Brotherhood isn't a luxury. It's medicine. I just joined Mākoa Order. Use my link if you're ready: ${referralLink}`,
  ];
  const [msgIdx, setMsgIdx] = useState(0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
      textAlign: "center",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes breathe { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes btnGlow { 0%,100% { box-shadow: 0 0 12px rgba(176,142,80,0.2); } 50% { box-shadow: 0 0 28px rgba(176,142,80,0.5); } }
        @keyframes shareGlow { 0%,100% { box-shadow: 0 0 8px rgba(63,185,80,0.15); } 50% { box-shadow: 0 0 22px rgba(63,185,80,0.4); } }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&display=swap');
      `}</style>

      {/* Crest */}
      <div style={{
        width: 60, height: 60,
        border: `1px solid ${GOLD_20}`,
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 32px",
        animation: "fadeIn 1s ease forwards",
      }}>
        <span style={{ color: GOLD_DIM, fontSize: "1.4rem", animation: "breathe 3s ease-in-out infinite" }}>◈</span>
      </div>

      {/* Main greeting */}
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontSize: "2.8rem",
        color: GOLD,
        marginBottom: 20,
        lineHeight: 1.2,
        animation: "fadeUp 0.8s ease 0.3s both",
      }}>
        ʻAe{handle ? `, ${handle}` : ""}.
      </p>

      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        color: "rgba(232,224,208,0.6)",
        fontSize: "1.05rem",
        lineHeight: 1.9,
        maxWidth: 320,
        marginBottom: 36,
        animation: "fadeUp 0.8s ease 0.5s both",
      }}>
        Your signal has been received.
      </p>

      {/* XI Message */}
      {xiMessage && (
        <div style={{
          maxWidth: 360,
          marginBottom: 32,
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ height: 1, flex: 1, background: `${tierColor}30` }} />
            <span style={{ color: tierColor, fontSize: "0.4rem", letterSpacing: "0.3em" }}>XI · GATE AGENT</span>
            <div style={{ height: 1, flex: 1, background: `${tierColor}30` }} />
          </div>
          <div style={{
            background: `${tierColor}08`,
            border: `1px solid ${tierColor}25`,
            borderRadius: 10,
            padding: "22px 20px",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "#e8e0d0",
              fontSize: "1.05rem",
              lineHeight: 1.9,
              whiteSpace: "pre-line",
            }}>
              {xiMessage}
            </p>
          </div>
        </div>
      )}

      {/* The 808 explanation */}
      <div style={{
        maxWidth: 340,
        background: GOLD_10,
        border: `1px solid ${GOLD_20}`,
        borderRadius: 10,
        padding: "22px 20px",
        marginBottom: 32,
        animation: "fadeUp 0.8s ease 0.7s both",
      }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 12 }}>THE MAKOA 808</p>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "rgba(232,224,208,0.65)",
          fontSize: "0.95rem",
          lineHeight: 1.9,
        }}>
          The Makoa 808 is the brotherhood's private brother-to-brother network — connecting men across Oahu who are building, healing, and showing up at 4am.
        </p>
        <div style={{ height: 1, background: GOLD_20, margin: "16px 0" }} />
        <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.78rem", lineHeight: 1.7 }}>
          XI has reviewed your answers.<br />Your path forward is below.
        </p>
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, width: "100%", maxWidth: 340, animation: "fadeUp 0.8s ease 0.9s both" }}>
        <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
        <span style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.2em" }}>UNDER THE MALU</span>
        <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
      </div>

      {/* Footer lines */}
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        color: GOLD_DIM,
        fontSize: "1rem",
        letterSpacing: "0.1em",
        marginBottom: 24,
        animation: "fadeUp 0.8s ease 1.0s both",
      }}>
        Hana · Pale · Ola
      </p>

      {/* ── CONTINUE BUTTON ─────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 340,
        width: "100%",
        opacity: btnVisible ? 1 : 0,
        transform: btnVisible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 1s ease, transform 1s ease",
        marginBottom: 16,
      }}>
        <button
          onClick={() => router.push("/accepted")}
          style={{
            width: "100%",
            background: GOLD,
            color: "#000",
            border: "none",
            padding: "16px",
            fontSize: "0.56rem",
            letterSpacing: "0.22em",
            cursor: "pointer",
            borderRadius: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            animation: btnVisible ? "btnGlow 3s ease-in-out infinite" : "none",
          }}
        >
          CONTINUE — SEE YOUR ACCEPTANCE →
        </button>
      </div>

      {/* ── VIRAL SHARE SECTION ──────────────────────────────────────────── */}
      <div style={{
        maxWidth: 360,
        width: "100%",
        opacity: sharePhase ? 1 : 0,
        transform: sharePhase ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 1s ease, transform 1s ease",
        marginBottom: 32,
      }}>
        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "32px 0 20px" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(63,185,80,0.2)" }} />
          <span style={{ color: "rgba(63,185,80,0.6)", fontSize: "0.38rem", letterSpacing: "0.22em" }}>BRING A BROTHER</span>
          <div style={{ flex: 1, height: 1, background: "rgba(63,185,80,0.2)" }} />
        </div>

        <p style={{
          color: "rgba(232,224,208,0.5)", fontSize: "0.52rem", lineHeight: 1.7,
          marginBottom: 20, textAlign: "center",
        }}>
          The gate is open. Every man you bring in earns you standing in the order.
          Share your link — brothers who use it are tied to you.
        </p>

        {/* Share card */}
        <ShareCard handle={handle} tier={xiTier} tierConfig={tierConfig} />

        {/* Referral link box */}
        <div style={{
          marginTop: 16,
          background: "rgba(63,185,80,0.05)",
          border: "1px solid rgba(63,185,80,0.2)",
          borderRadius: 8,
          padding: "14px 16px",
        }}>
          <p style={{ color: "rgba(63,185,80,0.6)", fontSize: "0.36rem", letterSpacing: "0.15em", marginBottom: 8 }}>
            YOUR REFERRAL LINK
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <p style={{
              color: "rgba(232,224,208,0.7)", fontSize: "0.44rem",
              flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {referralLink}
            </p>
            <button
              onClick={copyLink}
              style={{
                background: copied ? "rgba(63,185,80,0.2)" : "rgba(176,142,80,0.1)",
                border: `1px solid ${copied ? "rgba(63,185,80,0.4)" : "rgba(176,142,80,0.3)"}`,
                color: copied ? "#3fb950" : GOLD,
                fontSize: "0.38rem", letterSpacing: "0.1em",
                padding: "6px 12px", borderRadius: 4, cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace", flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              {copied ? "COPIED ✓" : "COPY"}
            </button>
          </div>
        </div>

        {/* Message templates */}
        <div style={{ marginTop: 14 }}>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem", letterSpacing: "0.12em", marginBottom: 8 }}>
            READY-TO-SEND MESSAGE
          </p>
          <div style={{
            background: "rgba(176,142,80,0.04)", border: "1px solid rgba(176,142,80,0.12)",
            borderRadius: 8, padding: "14px 16px", marginBottom: 10,
          }}>
            <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.46rem", lineHeight: 1.7, margin: 0 }}>
              {shareMessages[msgIdx]}
            </p>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {shareMessages.map((_, i) => (
              <button
                key={i}
                onClick={() => setMsgIdx(i)}
                style={{
                  flex: 1, padding: "6px", borderRadius: 4, cursor: "pointer",
                  background: msgIdx === i ? "rgba(176,142,80,0.15)" : "transparent",
                  border: `1px solid ${msgIdx === i ? "rgba(176,142,80,0.4)" : "rgba(176,142,80,0.1)"}`,
                  color: msgIdx === i ? GOLD : "rgba(176,142,80,0.3)",
                  fontSize: "0.34rem", fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Share buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button
            onClick={shareNative}
            style={{
              background: "rgba(63,185,80,0.1)", border: "1px solid rgba(63,185,80,0.3)",
              color: "#3fb950", fontSize: "0.44rem", letterSpacing: "0.12em",
              padding: "13px", borderRadius: 6, cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              animation: sharePhase ? "shareGlow 3s ease-in-out infinite" : "none",
            }}
          >
            ↑ SHARE LINK
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareMessages[msgIdx]).catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 2500);
            }}
            style={{
              background: "rgba(176,142,80,0.08)", border: "1px solid rgba(176,142,80,0.25)",
              color: GOLD, fontSize: "0.44rem", letterSpacing: "0.12em",
              padding: "13px", borderRadius: 6, cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            }}
          >
            ◈ COPY MSG
          </button>
        </div>

        {/* Telegram share */}
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("I just passed the gate at Mākoa Order. West Oahu brotherhood. Real men. Real training. If you're ready:")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            marginTop: 10, padding: "12px",
            background: "rgba(41,182,246,0.06)", border: "1px solid rgba(41,182,246,0.2)",
            borderRadius: 6, textDecoration: "none",
            color: "rgba(41,182,246,0.8)", fontSize: "0.42rem", letterSpacing: "0.1em",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          ✈ SHARE ON TELEGRAM
        </a>

        <p style={{
          color: "rgba(232,224,208,0.2)", fontSize: "0.38rem",
          textAlign: "center", marginTop: 14, lineHeight: 1.6,
        }}>
          Every brother you bring in is tied to your name in the order.
          Referrals build your standing.
        </p>
      </div>

      {/* Return Home link */}
      <div style={{
        opacity: btnVisible ? 1 : 0,
        transition: "opacity 1s ease 0.2s",
        marginBottom: 24,
      }}>
        <a
          href="/"
          style={{
            color: "rgba(232,224,208,0.25)",
            fontSize: "0.44rem",
            letterSpacing: "0.15em",
            textDecoration: "none",
            borderBottom: "1px solid rgba(232,224,208,0.1)",
            paddingBottom: 2,
          }}
        >
          ← Return Home
        </a>
      </div>

      <p style={{
        color: "rgba(232,224,208,0.2)",
        fontSize: "0.42rem",
        marginBottom: 8,
        animation: "fadeUp 0.8s ease 1.1s both",
      }}>
        Questions: wakachief@gmail.com
      </p>

      <p style={{
        color: "rgba(176,142,80,0.15)",
        fontSize: "0.4rem",
        letterSpacing: "0.15em",
        animation: "fadeUp 0.8s ease 1.2s both",
      }}>
        MĀKOA ORDER · MALU TRUST · WEST OAHU
      </p>
    </div>
  );
}
