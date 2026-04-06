"use client";

import { useState } from "react";
import { useStore } from "@/lib/store-context";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const BG = "#04060a";

interface PortalLoginProps {
  onAccess: (applicationId: string) => void;
}

export default function PortalLogin({ onAccess }: PortalLoginProps) {
  const { getMemberByEmail, db } = useStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleSubmit = () => {
    setError("");
    setChecking(true);

    setTimeout(() => {
      const applicant = getMemberByEmail(email.trim());
      if (!applicant) {
        setError("No record found for this email. Check your spelling or contact support.");
        setChecking(false);
        return;
      }

      const membership = db.memberships.find(m => m.application_id === applicant.application_id);
      if (!membership || !membership.deposit_paid || !["active", "invited"].includes(membership.membership_status)) {
        setError("Your formation is not yet complete. Deposit payment required to access the portal.");
        setChecking(false);
        return;
      }

      // Simulate magic link — in production this sends an email
      setSent(true);
      setChecking(false);

      // Auto-grant access after 1.5s (simulating link click)
      setTimeout(() => {
        onAccess(applicant.application_id);
      }, 1500);
    }, 800);
  };

  return (
    <div style={{
      background: BG, minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px 20px",
      fontFamily: "var(--font-jetbrains)",
    }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 20%, rgba(176,142,80,0.04) 0%, transparent 60%)" }} />

      <div style={{ width: "100%", maxWidth: 380, position: "relative", zIndex: 1 }}>
        {/* Crest */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: `1px solid ${GOLD}33`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ color: GOLD, fontSize: "1.2rem" }}>⚔</span>
          </div>
          <h1 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.8rem", margin: "0 0 6px", letterSpacing: "0.02em" }}>
            Mākoa Order
          </h1>
          <p style={{ color: GOLD_DIM, fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
            Member Portal · Formation Access
          </p>
        </div>

        {!sent ? (
          <div>
            <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.12)", borderRadius: 12, padding: "24px 20px", marginBottom: 16 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 16px" }}>
                Enter your formation email
              </p>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="your@email.com"
                style={{
                  width: "100%", background: "#030508", border: `1px solid ${error ? "#f85149" : "rgba(176,142,80,0.15)"}`,
                  borderRadius: 8, padding: "12px 14px", fontSize: "0.7rem", color: GOLD,
                  fontFamily: "var(--font-jetbrains)", outline: "none", boxSizing: "border-box",
                  marginBottom: error ? 8 : 16, transition: "border-color 0.2s",
                }}
              />
              {error && (
                <p style={{ color: "#f85149", fontSize: "0.55rem", margin: "0 0 14px", lineHeight: 1.5 }}>{error}</p>
              )}
              <button
                onClick={handleSubmit}
                disabled={!email.trim() || checking}
                style={{
                  width: "100%", background: email.trim() && !checking ? `${GOLD}18` : "rgba(176,142,80,0.04)",
                  border: `1px solid ${email.trim() && !checking ? GOLD : "rgba(176,142,80,0.1)"}`,
                  color: email.trim() && !checking ? GOLD : GOLD_DIM,
                  padding: "13px", borderRadius: 8, cursor: email.trim() && !checking ? "pointer" : "not-allowed",
                  fontFamily: "var(--font-jetbrains)", fontSize: "0.6rem", letterSpacing: "0.18em",
                  textTransform: "uppercase", fontWeight: 600, transition: "all 0.2s",
                }}
              >
                {checking ? "Verifying..." : "Send Access Link"}
              </button>
            </div>

            <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.52rem", textAlign: "center", lineHeight: 1.6 }}>
              Access is restricted to members with confirmed deposit payment.<br />
              Your path is measured by presence.
            </p>
          </div>
        ) : (
          <div style={{ background: "#060810", border: "1px solid rgba(176,142,80,0.2)", borderRadius: 12, padding: "28px 20px", textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(176,142,80,0.08)", border: `1px solid ${GOLD}33`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <span style={{ color: GOLD, fontSize: "1rem" }}>✓</span>
            </div>
            <p style={{ color: GOLD, fontSize: "0.7rem", margin: "0 0 8px", fontWeight: 600 }}>Access Granted</p>
            <p style={{ color: GOLD_DIM, fontSize: "0.58rem", margin: "0 0 4px" }}>Verified: {email}</p>
            <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.52rem", margin: 0 }}>Opening your formation portal...</p>
            <div style={{ marginTop: 20, height: 2, background: "rgba(176,142,80,0.08)", borderRadius: 1, overflow: "hidden" }}>
              <div style={{ height: "100%", background: GOLD, borderRadius: 1, animation: "progress 1.5s linear forwards" }} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  );
}
