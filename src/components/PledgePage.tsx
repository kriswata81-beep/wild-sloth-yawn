"use client";

import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const PURPLE = "#534AB7";
const BG = "#04060a";

interface PledgePageProps {
  handle: string;
  phone: string;
  onSubmit: (data: PledgeData) => void;
  onBack: () => void;
}

export interface PledgeData {
  name: string;
  email: string;
  phone: string;
  zip: string;
  q1: string;
  q2: string;
  q3: string;
}

function QOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? "#0a0e14" : "#080c10",
        border: `0.5px solid ${selected ? "#b08e5055" : "#141820"}`,
        borderRadius: 4, padding: "10px 12px", fontSize: "0.62rem",
        color: selected ? GOLD : "#4a5060",
        fontFamily: "var(--font-jetbrains)", cursor: "pointer",
        display: "block", width: "100%", textAlign: "left",
        marginBottom: 6, transition: "all 0.15s",
      }}
    >
      {selected ? "◆" : "◇"} {label}
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#080c10",
  border: "0.5px solid #141820",
  borderRadius: 6,
  padding: "12px 14px",
  fontSize: "0.65rem",
  color: GOLD,
  fontFamily: "var(--font-jetbrains)",
  outline: "none",
  boxSizing: "border-box",
  letterSpacing: "0.05em",
};

// Live activity feed items
const ACTIVITY = [
  { region: "West Oahu", action: "Aliʻi pledged", time: "2h ago", color: GOLD },
  { region: "Maui", action: "Mana accepted", time: "5h ago", color: "#58a6ff" },
  { region: "East Oahu", action: "Nā Koa entry", time: "9h ago", color: "#3fb950" },
];

export default function PledgePage({ handle, phone, onSubmit, onBack }: PledgePageProps) {
  const [name, setName] = useState(handle || "");
  const [email, setEmail] = useState("");
  const [phoneVal, setPhoneVal] = useState(phone || "");
  const [zip, setZip] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  const canProceed1 = name.trim() && email.trim() && phoneVal.trim() && zip.trim();
  const canSubmit = canProceed1 && q1 && q2 && q3;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ name, email, phone: phoneVal, zip, q1, q2, q3 });
  };

  return (
    <div style={{ background: BG, minHeight: "100dvh", fontFamily: "var(--font-jetbrains)", overflowX: "hidden" }}>

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
        <span className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1rem" }}>Mākoa</span>
        <div style={{ width: 48 }} />
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "rgba(176,142,80,0.08)" }}>
        <div style={{ height: "100%", width: step === 1 ? "50%" : "100%", background: GOLD, transition: "width 0.4s ease" }} />
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px 40px" }}>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 8px" }}>
            Step {step} of 2 · The Pledge
          </p>
          <h1 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.8rem", margin: "0 0 8px", lineHeight: 1.2 }}>
            {step === 1 ? "Who are you?" : "Tell XI who you are"}
          </h1>
          <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.6rem", margin: 0, lineHeight: 1.6 }}>
            {step === 1 ? "XI reviews every application within 24 hours" : "Three questions. Honest answers only."}
          </p>
        </div>

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <p style={{ color: GOLD_DIM, fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>Full Name</p>
              <input
                style={inputStyle}
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <p style={{ color: GOLD_DIM, fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>Email</p>
              <input
                style={inputStyle}
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <p style={{ color: GOLD_DIM, fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>Phone / Signal</p>
              <input
                style={inputStyle}
                type="tel"
                placeholder="+1 (808) 000-0000"
                value={phoneVal}
                onChange={(e) => setPhoneVal(e.target.value)}
              />
            </div>
            <div>
              <p style={{ color: GOLD_DIM, fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>ZIP Code</p>
              <input
                style={inputStyle}
                type="text"
                placeholder="96707"
                value={zip}
                onChange={(e) => setZip(e.target.value.slice(0, 10))}
                maxLength={10}
              />
            </div>

            {/* Live activity */}
            <div style={{ marginTop: 8, background: "#060810", border: "0.5px solid rgba(176,142,80,0.08)", borderRadius: 8, padding: "12px 14px" }}>
              <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.5rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 10px" }}>Live · Brotherhood Signal</p>
              {ACTIVITY.map(({ region, action, time, color }) => (
                <div key={region} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0, boxShadow: `0 0 5px ${color}88` }} />
                  <span style={{ color: "rgba(176,142,80,0.45)", fontSize: "0.58rem", flex: 1 }}>
                    <span style={{ color: GOLD }}>{region}</span> · {action}
                  </span>
                  <span style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.52rem" }}>{time}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceed1}
              style={{
                width: "100%", background: canProceed1 ? GOLD : "rgba(176,142,80,0.15)",
                color: canProceed1 ? "#000" : "rgba(176,142,80,0.3)",
                border: "none", padding: "15px", borderRadius: 8,
                fontFamily: "var(--font-jetbrains)", fontSize: "0.68rem",
                fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                cursor: canProceed1 ? "pointer" : "not-allowed", marginTop: 4,
                transition: "all 0.2s",
              }}
            >
              CONTINUE →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ marginBottom: 22 }}>
              <p style={{ color: "rgba(176,142,80,0.7)", fontSize: "0.68rem", margin: "0 0 10px", lineHeight: 1.5 }}>
                What do you bring to a room?
              </p>
              {["Leadership and vision", "Skills and service", "Energy and hustle"].map((opt) => (
                <QOption key={opt} label={opt} selected={q1 === opt} onClick={() => setQ1(opt)} />
              ))}
            </div>

            <div style={{ marginBottom: 22 }}>
              <p style={{ color: "rgba(176,142,80,0.7)", fontSize: "0.68rem", margin: "0 0 10px", lineHeight: 1.5 }}>
                What challenge are you facing right now?
              </p>
              {["Scaling what I built", "Getting the right clients", "Building my foundation"].map((opt) => (
                <QOption key={opt} label={opt} selected={q2 === opt} onClick={() => setQ2(opt)} />
              ))}
            </div>

            <div style={{ marginBottom: 22 }}>
              <p style={{ color: "rgba(176,142,80,0.7)", fontSize: "0.68rem", margin: "0 0 10px", lineHeight: 1.5 }}>
                Where do you see yourself in the Order?
              </p>
              {["Leading — I am Aliʻi", "Building — I am Mana", "Serving — I am Nā Koa"].map((opt) => (
                <QOption key={opt} label={opt} selected={q3 === opt} onClick={() => setQ3(opt)} />
              ))}
            </div>

            {/* Pledge amount box */}
            <div style={{ background: "#0a0c14", border: `1px solid ${PURPLE}33`, borderRadius: 10, padding: "16px", textAlign: "center", marginBottom: 20 }}>
              <p style={{ color: PURPLE, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>Processing Pledge</p>
              <div className="font-cormorant" style={{ fontStyle: "italic", fontSize: "2rem", color: GOLD, margin: "0 0 4px" }}>$9.99</div>
              <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.55rem", margin: 0, lineHeight: 1.6 }}>
                Secures your application · No charge today<br />
                Formation path revealed after acceptance
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1, background: "transparent", border: "0.5px solid #141820",
                  color: GOLD_DIM, padding: "14px", borderRadius: 8,
                  fontFamily: "var(--font-jetbrains)", fontSize: "0.62rem",
                  letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
                }}
              >
                ← BACK
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                style={{
                  flex: 2, background: canSubmit ? GOLD : "rgba(176,142,80,0.15)",
                  color: canSubmit ? "#000" : "rgba(176,142,80,0.3)",
                  border: "none", padding: "14px", borderRadius: 8,
                  fontFamily: "var(--font-jetbrains)", fontSize: "0.68rem",
                  fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                I AM CALLED →
              </button>
            </div>

            <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.52rem", textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
              The order does not chase men.<br />
              If you are not called — that is honored.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
