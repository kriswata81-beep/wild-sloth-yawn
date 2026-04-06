"use client";

import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const PURPLE = "#534AB7";
const BG = "#04060a";

const TIER_INFO = {
  alii: { label: "Aliʻi", deposit: 750, color: GOLD, icon: "👑" },
  mana: { label: "Mana", deposit: 250, color: "#58a6ff", icon: "🌀" },
  nakoa: { label: "Nā Koa", deposit: 125, color: "#3fb950", icon: "⚔" },
};

interface PaymentPageProps {
  tier: "alii" | "mana" | "nakoa";
  name: string;
  email: string;
  onPaid: () => void;
  onBack: () => void;
}

export default function PaymentPage({ tier, name, email, onPaid, onBack }: PaymentPageProps) {
  const info = TIER_INFO[tier];
  const [method, setMethod] = useState<"card" | "xrp">("card");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const canPay = method === "card"
    ? cardNum.replace(/\s/g, "").length === 16 && expiry.length === 5 && cvc.length >= 3
    : true;

  const handlePay = () => {
    if (!canPay) return;
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onPaid();
    }, 2200);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#080c10",
    border: "0.5px solid #1a2030",
    borderRadius: 6,
    padding: "13px 14px",
    fontSize: "0.68rem",
    color: GOLD,
    fontFamily: "var(--font-jetbrains)",
    outline: "none",
    boxSizing: "border-box",
    letterSpacing: "0.08em",
  };

  return (
    <div style={{ background: BG, minHeight: "100dvh", fontFamily: "var(--font-jetbrains)", overflowX: "hidden" }}>

      {/* Radial glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 20%, ${info.color}08 0%, transparent 60%)`,
      }} />

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(4,6,10,0.97)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(176,142,80,0.1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", height: 48,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "0.6rem", letterSpacing: "0.1em", fontFamily: "var(--font-jetbrains)" }}>
          ← BACK
        </button>
        <span className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1rem" }}>Secure Your Seat</span>
        <div style={{ width: 48 }} />
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px 40px", position: "relative", zIndex: 1 }}>

        {/* Order summary */}
        <div style={{
          background: "#060810", border: `1px solid ${info.color}33`,
          borderRadius: 12, padding: "18px 16px", marginBottom: 24,
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>
            Order Summary
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1rem" }}>{info.icon}</span>
              <div>
                <p className="font-cormorant" style={{ fontStyle: "italic", color: info.color, fontSize: "1.2rem", margin: 0 }}>{info.label}</p>
                <p style={{ color: GOLD_DIM, fontSize: "0.55rem", margin: 0 }}>Founding seat · May 1–4 · Kapolei</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: info.color, fontSize: "1.6rem", fontWeight: 700, margin: 0, lineHeight: 1 }}>${info.deposit}</p>
              <p style={{ color: GOLD_DIM, fontSize: "0.5rem", margin: "2px 0 0" }}>deposit today</p>
            </div>
          </div>
          <div style={{ height: 1, background: "rgba(176,142,80,0.08)", margin: "12px 0" }} />
          <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.58rem", lineHeight: 1.7, margin: 0 }}>
            Remaining balance completed over 18-month formation.<br />
            Seat held for {name || "you"} · {email}
          </p>
        </div>

        {/* Payment method toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["card", "xrp"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              style={{
                flex: 1, padding: "11px", borderRadius: 8, cursor: "pointer",
                background: method === m ? "rgba(176,142,80,0.08)" : "#060810",
                border: `1px solid ${method === m ? "rgba(176,142,80,0.35)" : "rgba(176,142,80,0.08)"}`,
                color: method === m ? GOLD : GOLD_DIM,
                fontFamily: "var(--font-jetbrains)", fontSize: "0.6rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                transition: "all 0.2s",
              }}
            >
              {m === "card" ? "💳 Card" : "◈ XRP"}
            </button>
          ))}
        </div>

        {method === "card" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            <div>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>Card Number</p>
              <input
                style={inputStyle}
                placeholder="0000 0000 0000 0000"
                value={cardNum}
                onChange={(e) => setCardNum(formatCard(e.target.value))}
                maxLength={19}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>Expiry</p>
                <input
                  style={inputStyle}
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div>
                <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>CVC</p>
                <input
                  style={inputStyle}
                  placeholder="000"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                />
              </div>
            </div>

            {/* Apple Pay / Google Pay */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {["🍎 Apple Pay", "G Pay"].map((label) => (
                <button
                  key={label}
                  onClick={handlePay}
                  style={{
                    background: "#0a0c14", border: "0.5px solid #1a2030",
                    borderRadius: 8, padding: "12px", cursor: "pointer",
                    color: "rgba(176,142,80,0.6)", fontFamily: "var(--font-jetbrains)",
                    fontSize: "0.62rem", letterSpacing: "0.08em",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(176,142,80,0.3)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1a2030"; }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {method === "xrp" && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ background: "#060810", border: "1px solid rgba(176,142,80,0.12)", borderRadius: 12, padding: "20px 16px", textAlign: "center", marginBottom: 14 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>
                XRP Payment · Manual Confirmation
              </p>
              <div style={{ background: "#0a0c14", border: "1px solid rgba(176,142,80,0.15)", borderRadius: 8, padding: "14px", marginBottom: 12 }}>
                <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.52rem", margin: "0 0 6px" }}>Send to wallet address</p>
                <p style={{ color: GOLD, fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)", wordBreak: "break-all", margin: 0, letterSpacing: "0.04em" }}>
                  rMakoa1stOrderXRPWalletAddress808
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: GOLD_DIM, fontSize: "0.6rem" }}>Amount (XRP)</span>
                <span style={{ color: GOLD, fontSize: "0.6rem", fontWeight: 700 }}>≈ {Math.round(info.deposit * 1.8)} XRP</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: GOLD_DIM, fontSize: "0.6rem" }}>Memo / Tag</span>
                <span style={{ color: GOLD, fontSize: "0.6rem", fontWeight: 700 }}>MAKOA-{tier.toUpperCase()}</span>
              </div>
              <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.55rem", lineHeight: 1.7, margin: 0 }}>
                After sending, XI confirms your payment within 2 hours via Telegram. Your seat is held for 4 hours pending confirmation.
              </p>
            </div>
            <button
              onClick={handlePay}
              style={{
                width: "100%", background: "rgba(176,142,80,0.08)",
                border: "1px solid rgba(176,142,80,0.25)", color: GOLD,
                padding: "14px", borderRadius: 8,
                fontFamily: "var(--font-jetbrains)", fontSize: "0.65rem",
                letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer",
              }}
            >
              I HAVE SENT THE XRP →
            </button>
          </div>
        )}

        {/* Pay button */}
        {method === "card" && (
          <button
            onClick={handlePay}
            disabled={!canPay || processing}
            style={{
              width: "100%",
              background: processing ? "rgba(176,142,80,0.3)" : canPay ? info.color : "rgba(176,142,80,0.12)",
              color: canPay && !processing ? "#000" : "rgba(176,142,80,0.3)",
              border: "none", padding: "17px", borderRadius: 8,
              fontFamily: "var(--font-jetbrains)", fontSize: "0.72rem",
              fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
              cursor: canPay && !processing ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            {processing ? "PROCESSING..." : `PAY $${info.deposit} · SECURE SEAT`}
          </button>
        )}

        {/* Security note */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14 }}>
          <span style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.7rem" }}>🔒</span>
          <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.52rem", margin: 0, letterSpacing: "0.08em" }}>
            Secured by Stripe · 256-bit encryption
          </p>
        </div>
      </div>
    </div>
  );
}
