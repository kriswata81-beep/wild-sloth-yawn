"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_20 = "rgba(176,142,80,0.2)";

const TIER_LABELS: Record<string, string> = {
  alii: "Aliʻi",
  mana: "Mana",
  nakoa: "Nā Koa",
};

const TIER_COLORS: Record<string, string> = {
  alii: "#b08e50",
  mana: "#58a6ff",
  nakoa: "#3fb950",
};

export default function ConfirmPage() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [xiMessage, setXiMessage] = useState("");
  const [xiTier, setXiTier] = useState("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHandle(sessionStorage.getItem("makoa_handle") || "");
      setXiMessage(sessionStorage.getItem("makoa_xi_message") || "");
      setXiTier(sessionStorage.getItem("makoa_xi_tier") || "");
    }
    // Stagger the XI message reveal
    const t = setTimeout(() => setRevealed(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const tierColor = TIER_COLORS[xiTier] || GOLD;
  const tierLabel = TIER_LABELS[xiTier] || "";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      textAlign: "center",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes breathe {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes xiReveal {
          0% { opacity: 0; transform: translateY(20px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Crest mark */}
      <div style={{
        width: "56px", height: "56px",
        border: `1px solid ${GOLD_20}`,
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 28px",
        animation: "fadeIn 1s ease forwards",
      }}>
        <span style={{ color: GOLD_DIM, fontSize: "1.3rem", animation: "breathe 3s ease-in-out infinite" }}>◈</span>
      </div>

      {/* Main greeting */}
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontSize: "2.6rem",
        color: GOLD,
        marginBottom: 16,
        lineHeight: 1.2,
        animation: "fadeUp 0.8s ease 0.3s both",
      }}>
        ʻAe{handle ? `, ${handle}` : ""}.
      </p>

      {/* XI Message Card */}
      {xiMessage ? (
        <div style={{
          maxWidth: 340,
          marginBottom: 28,
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}>
          {/* XI badge */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", marginBottom: "16px",
          }}>
            <div style={{ height: "1px", flex: 1, background: `${tierColor}30` }} />
            <span style={{ color: tierColor, fontSize: "0.42rem", letterSpacing: "0.3em" }}>XI · GATE AGENT</span>
            <div style={{ height: "1px", flex: 1, background: `${tierColor}30` }} />
          </div>

          {/* Message */}
          <div style={{
            background: `rgba(${xiTier === "alii" ? "176,142,80" : xiTier === "mana" ? "88,166,255" : "63,185,80"},0.06)`,
            border: `1px solid ${tierColor}30`,
            borderRadius: "10px",
            padding: "22px 20px",
            marginBottom: "12px",
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

          {/* Tier badge */}
          {tierLabel && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: `${tierColor}12`,
              border: `1px solid ${tierColor}40`,
              borderRadius: "4px",
              padding: "5px 12px",
            }}>
              <span style={{ color: tierColor, fontSize: "0.45rem", letterSpacing: "0.2em" }}>
                ASSIGNED: {tierLabel.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      ) : (
        <p style={{
          color: "rgba(232,224,208,0.5)",
          fontSize: "0.6rem",
          lineHeight: 1.9,
          maxWidth: 300,
          marginBottom: 28,
          animation: "fadeUp 0.8s ease 0.5s both",
        }}>
          XI will reach you on Telegram within 24 hours.<br />
          Keep your signal open.
        </p>
      )}

      <p style={{
        color: "rgba(176,142,80,0.2)",
        fontSize: "0.45rem",
        letterSpacing: "0.15em",
        marginBottom: 32,
        animation: "fadeUp 0.8s ease 0.7s both",
      }}>
        Under the Malu · Malu Trust · West Oahu · 2026
      </p>

      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        color: GOLD_DIM,
        fontSize: "0.9rem",
        letterSpacing: "0.1em",
        marginBottom: 40,
        animation: "fadeUp 0.8s ease 0.9s both",
      }}>
        Hana · Pale · Ola
      </p>

      <button
        onClick={() => router.push("/portal/login")}
        style={{
          background: "transparent",
          border: `1px solid ${GOLD_20}`,
          color: "rgba(176,142,80,0.4)",
          fontSize: "0.45rem",
          letterSpacing: "0.2em",
          padding: "10px 24px",
          cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          animation: "fadeUp 0.8s ease 1.1s both",
        }}
      >
        MEMBER PORTAL →
      </button>
    </div>
  );
}
