"use client";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.08)";

interface PortalLoginProps {
  onAccess: (applicationId: string) => void;
  onBack: () => void;
}

export default function PortalLogin({ onAccess, onBack }: PortalLoginProps) {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) { setError("Enter your Application ID or email."); return; }
    setLoading(true);
    setError("");
    setNotFound(false);

    const val = identifier.trim();
    const isAppId = val.toUpperCase().startsWith("MKO-");

    const query = isAppId
      ? supabase.from("applicants").select("application_id, membership_status, deposit_paid").eq("application_id", val.toUpperCase()).single()
      : supabase.from("applicants").select("application_id, membership_status, deposit_paid").eq("email", val.toLowerCase()).single();

    const { data, error: dbErr } = await query;

    if (dbErr || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    if (!data.deposit_paid || !["active", "invited"].includes(data.membership_status)) {
      setLoading(false);
      onAccess("__not_eligible__");
      return;
    }

    setLoading(false);
    onAccess(data.application_id);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050709",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 24px",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ width: "100%", maxWidth: "340px", animation: "fadeUp 0.6s ease forwards" }}>
        {/* Crest mark */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            border: "1px solid rgba(176,142,80,0.3)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <span style={{ color: GOLD_DIM, fontSize: "1.2rem" }}>◈</span>
          </div>
          <p className="font-cormorant" style={{ color: GOLD, fontSize: "1.4rem", letterSpacing: "0.2em", fontWeight: 300 }}>MĀKOA</p>
          <p style={{ color: GOLD_DIM, fontSize: "0.45rem", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: "4px" }}>Member Portal</p>
        </div>

        <form onSubmit={handleLookup}>
          <label style={{ display: "block", color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>
            Application ID or Email
          </label>
          <input
            type="text"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="MKO-XXXXXXXX or your@email.com"
            autoComplete="off"
            style={{ marginBottom: "16px" }}
          />

          {error && <p style={{ color: "#e05c5c", fontSize: "0.52rem", marginBottom: "10px" }}>{error}</p>}

          {notFound && (
            <div style={{
              background: "rgba(224,92,92,0.06)",
              border: "1px solid rgba(224,92,92,0.2)",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "14px",
            }}>
              <p style={{ color: "#e05c5c", fontSize: "0.52rem", lineHeight: 1.7 }}>
                No record found. Verify your Application ID or email. If you have not pledged, return to the gate.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: "transparent",
              border: `1px solid ${loading ? GOLD_DIM : GOLD}`,
              color: loading ? GOLD_DIM : GOLD,
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              borderRadius: "4px",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: "12px",
            }}
          >
            {loading ? "Verifying..." : "Access Portal"}
          </button>

          <button
            type="button"
            onClick={onBack}
            style={{
              width: "100%",
              padding: "10px",
              background: "transparent",
              border: "none",
              color: "rgba(232,224,208,0.2)",
              fontSize: "0.48rem",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            ← Return to Gate
          </button>
        </form>

        <p style={{
          color: "rgba(176,142,80,0.2)",
          fontSize: "0.45rem",
          textAlign: "center",
          marginTop: "24px",
          lineHeight: 1.7,
        }}>
          Access requires confirmed deposit<br />and active membership status.
        </p>
      </div>
    </div>
  );
}
