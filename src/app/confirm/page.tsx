"use client";
import { useEffect, useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";

export default function ConfirmPage() {
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
    const t = setTimeout(() => setRevealed(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const tierColors: Record<string, string> = {
    alii: "#b08e50",
    mana: "#58a6ff",
    nakoa: "#3fb950",
  };
  const tierColor = tierColors[xiTier] || GOLD;

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
        @keyframes pulse808 { 0%,100% { opacity:0.3; transform:scale(1); } 50% { opacity:0.7; transform:scale(1.04); } }
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
        <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.5rem", lineHeight: 1.8 }}>
          XI will reach you within 24 hours.<br />Keep your signal open.
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
