"use client";

import { useState } from "react";
import { TIER_CONFIG, STRIPE_LINKS, LEGAL_TEXT, type Tier } from "@/lib/makoa";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const BG = "#04060a";

interface PaymentPageProps {
  tier: Tier;
  name: string;
  email: string;
  applicationId: string;
  onPaid: () => void;
  onBack: () => void;
}

export default function PaymentPage({ tier, name, email, applicationId, onPaid, onBack }: PaymentPageProps) {
  const cfg = TIER_CONFIG[tier];
  const [method, setMethod] = useState<"card" | "xrp">("card");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);

  const formatCard = (val: string) => val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (val: string) => {
    const d = val.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const canPay = method === "card"
    ? cardNum.replace(/\s/g, "").length === 16 && expiry.length === 5 && cvc.length >= 3
    : true;

  const handleStripeRedirect = () => {
    const stripeUrl = cfg.depositLink.url;
    const isRealStripe = stripeUrl.includes("buy.stripe.com") && !stripeUrl.includes("placeholder");

    if (isRealStripe) {
      // Build Stripe URL with prefilled metadata
      const params = new URLSearchParams({
        prefilled_email: email,
        client_reference_id: applicationId,
        "metadata[full_name]": name,
        "metadata[tier]": tier,
        "metadata[application_id]": applicationId,
      });
      window.location.href = `${stripeUrl}?${params.toString()}`;
    } else {
      // Simulated mode
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        onPaid();
      }, 2200);
    }
  };

  const handleXrpConfirm = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPaid();
    }, 1500);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#080c10", border: "0.5px solid #1a2030",
    borderRadius: 6, padding: "13px 14px", fontSize: "0.68rem",
    color: GOLD, fontFamily: "var(--font-jetbrains)", outline: "none",
    boxSizing: "border-box", letterSpacing: "0.08em",
  };

  return (
    <div style={{ background: BG, minHeight: "100dvh", fontFamily: "var(--font-jetbrains)", overflowX: "hidden" }}>

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 20%, ${cfg.color}08 0%, transparent 60%)`,
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

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px 48px", position: "relative", zIndex: 1 }}>

        {/* Order summary */}
        <div style={{ background: "#060810", border: `1px solid ${cfg.color}33`, borderRadius: 12, padding: "18px 16px", marginBottom: 20 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>
            Order Summary · {cfg.depositLink.internalName}
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1rem" }}>{cfg.icon}</span>
              <div>
                <p className="font-cormorant" style={{ fontStyle: "italic", color: cfg.color, fontSize: "1.2rem", margin: 0 }}>
                  {cfg.depositLink.displayTitle}
                </p>
                <p style={{ color: GOLD_DIM, fontSize: "0.55rem", margin: 0 }}>May 1–4 · Kapolei · West Oahu</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: cfg.color, fontSize: "1.6rem", fontWeight: 700, margin: 0, lineHeight: 1 }}>${cfg.deposit}</p>
              <p style={{ color: GOLD_DIM, fontSize: "0.5rem", margin: "2px 0 0" }}>deposit today</p>
            </div>
          </div>

          {/* Subscription plan */}
          <div style={{ background: "rgba(176,142,80,0.04)", border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 8, padding: "10px 12px" }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.5rem", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>
              Formation Plan · {cfg.monthlyLink.internalName}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.58rem" }}>Monthly subscription</span>
              <span style={{ color: cfg.color, fontSize: "0.58rem", fontWeight: 600 }}>${cfg.monthly}/month</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.58rem" }}>Duration</span>
              <span style={{ color: GOLD_DIM, fontSize: "0.58rem" }}>{cfg.months} months max</span>
            </div>
            <div style={{ height: 1, background: "rgba(176,142,80,0.08)", margin: "8px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.58rem" }}>Total formation</span>
              <span style={{ color: GOLD, fontSize: "0.58rem", fontWeight: 700 }}>${cfg.total}</span>
            </div>
            <p style={{ color: "rgba(176,142,80,0.22)", fontSize: "0.5rem", margin: "6px 0 0", lineHeight: 1.5 }}>
              Subscription auto-activates after deposit · {cfg.monthlyLink.note}
            </p>
          </div>

          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.52rem" }}>Application ID</span>
            <span style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.52rem", fontFamily: "var(--font-jetbrains)" }}>{applicationId}</span>
          </div>
          <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.52rem", margin: "4px 0 0" }}>
            Seat held for {name || "you"} · {email}
          </p>
        </div>

        {/* Payment method toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => setMethod("card")}
            style={{
              flex: 2, padding: "11px", borderRadius: 8, cursor: "pointer",
              background: method === "card" ? "rgba(176,142,80,0.08)" : "#060810",
              border: `1px solid ${method === "card" ? "rgba(176,142,80,0.35)" : "rgba(176,142,80,0.08)"}`,
              color: method === "card" ? GOLD : GOLD_DIM,
              fontFamily: "var(--font-jetbrains)", fontSize: "0.58rem",
              letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.2s",
            }}
          >
            💳 Card · Apple Pay · Google Pay
          </button>
          <button
            onClick={() => setMethod("xrp")}
            style={{
              flex: 1, padding: "11px", borderRadius: 8, cursor: "pointer",
              background: method === "xrp" ? "rgba(176,142,80,0.08)" : "#060810",
              border: `1px solid ${method === "xrp" ? "rgba(176,142,80,0.35)" : "rgba(176,142,80,0.08)"}`,
              color: method === "xrp" ? GOLD : GOLD_DIM,
              fontFamily: "var(--font-jetbrains)", fontSize: "0.58rem",
              letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.2s",
            }}
          >
            ◈ XRP
          </button>
        </div>

        {method === "card" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            <div>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>Card Number</p>
              <input style={inputStyle} placeholder="0000 0000 0000 0000" value={cardNum} onChange={(e) => setCardNum(formatCard(e.target.value))} maxLength={19} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>Expiry</p>
                <input style={inputStyle} placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} maxLength={5} />
              </div>
              <div>
                <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>CVC</p>
                <input style={inputStyle} placeholder="000" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} maxLength={4} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {["🍎 Apple Pay", "G Pay"].map((label) => (
                <button key={label} onClick={handleStripeRedirect} style={{ background: "#0a0c14", border: "0.5px solid #1a2030", borderRadius: 8, padding: "12px", cursor: "pointer", color: "rgba(176,142,80,0.6)", fontFamily: "var(--font-jetbrains)", fontSize: "0.62rem", letterSpacing: "0.08em" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {method === "xrp" && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(176,142,80,0.1)" }} />
              <span style={{ color: GOLD_DIM, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Advanced Sovereign Payment Option
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(176,142,80,0.1)" }} />
            </div>
            <div style={{ background: "#060810", border: "1px solid rgba(176,142,80,0.12)", borderRadius: 12, padding: "18px 16px", textAlign: "center", marginBottom: 12 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>XRP · Manual Confirmation</p>
              <div style={{ background: "#0a0c14", border: "1px solid rgba(176,142,80,0.12)", borderRadius: 8, padding: "12px", marginBottom: 10 }}>
                <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.5rem", margin: "0 0 4px" }}>Send to wallet address</p>
                <p style={{ color: GOLD, fontSize: "0.58rem", wordBreak: "break-all", margin: 0 }}>rMakoa1stOrderXRPWalletAddress808</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: GOLD_DIM, fontSize: "0.58rem" }}>Amount (XRP)</span>
                <span style={{ color: GOLD, fontSize: "0.58rem", fontWeight: 700 }}>≈ {Math.round(cfg.deposit * 1.8)} XRP</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: GOLD_DIM, fontSize: "0.58rem" }}>Memo / Tag</span>
                <span style={{ color: GOLD, fontSize: "0.58rem", fontWeight: 700 }}>MAKOA-{tier.toUpperCase()}-{applicationId}</span>
              </div>
              <p style={{ color: "rgba(176,142,80,0.28)", fontSize: "0.52rem", lineHeight: 1.7, margin: 0 }}>
                XI confirms within 2 hours via Telegram.<br />Seat held 4 hours pending confirmation.
              </p>
            </div>
            <button onClick={handleXrpConfirm} style={{ width: "100%", background: "rgba(176,142,80,0.08)", border: "1px solid rgba(176,142,80,0.25)", color: GOLD, padding: "14px", borderRadius: 8, fontFamily: "var(--font-jetbrains)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
              I HAVE SENT THE XRP →
            </button>
          </div>
        )}

        {method === "card" && (
          <button
            onClick={handleStripeRedirect}
            disabled={!canPay || processing}
            style={{
              width: "100%",
              background: processing ? "rgba(176,142,80,0.3)" : canPay ? cfg.color : "rgba(176,142,80,0.12)",
              color: canPay && !processing ? "#000" : "rgba(176,142,80,0.3)",
              border: "none", padding: "17px", borderRadius: 8,
              fontFamily: "var(--font-jetbrains)", fontSize: "0.72rem",
              fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
              cursor: canPay && !processing ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            {processing ? "PROCESSING..." : `PAY $${cfg.deposit} · SECURE SEAT`}
          </button>
        )}

        {/* Legal */}
        <div style={{ marginTop: 16, background: "rgba(176,142,80,0.02)", border: "0.5px solid rgba(176,142,80,0.06)", borderRadius: 8, padding: "10px 12px" }}>
          <p style={{ color: "rgba(176,142,80,0.22)", fontSize: "0.5rem", lineHeight: 1.7, margin: 0 }}>{LEGAL_TEXT}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14 }}>
          <span style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.7rem" }}>🔒</span>
          <p style={{ color: "rgba(176,142,80,0.18)", fontSize: "0.52rem", margin: 0 }}>
            Secured by Stripe · 256-bit encryption · Apple Pay · Google Pay
          </p>
        </div>
      </div>
    </div>
  );
}
