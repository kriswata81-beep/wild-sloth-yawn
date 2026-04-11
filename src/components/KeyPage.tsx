"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.12)";

// SVG Crest — full moon with Mākoa mark
function MakoaCrest({ size = 180 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring */}
      <circle cx="100" cy="100" r="96" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.4" />
      {/* Middle ring */}
      <circle cx="100" cy="100" r="82" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.25" />
      {/* Moon disc */}
      <circle cx="100" cy="100" r="68" fill="rgba(176,142,80,0.06)" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.7" />
      {/* Inner ring */}
      <circle cx="100" cy="100" r="54" stroke={GOLD} strokeWidth="0.4" strokeOpacity="0.2" />

      {/* Compass points */}
      <line x1="100" y1="4" x2="100" y2="22" stroke={GOLD} strokeWidth="1" strokeOpacity="0.6" />
      <line x1="100" y1="178" x2="100" y2="196" stroke={GOLD} strokeWidth="1" strokeOpacity="0.6" />
      <line x1="4" y1="100" x2="22" y2="100" stroke={GOLD} strokeWidth="1" strokeOpacity="0.6" />
      <line x1="178" y1="100" x2="196" y2="100" stroke={GOLD} strokeWidth="1" strokeOpacity="0.6" />

      {/* Diagonal marks */}
      <line x1="32" y1="32" x2="42" y2="42" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.3" />
      <line x1="158" y1="32" x2="148" y2="42" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.3" />
      <line x1="32" y1="168" x2="42" y2="158" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.3" />
      <line x1="168" y1="168" x2="158" y2="158" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.3" />

      {/* M mark — stylized */}
      <path d="M76 118 L76 88 L100 108 L124 88 L124 118" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeOpacity="0.9" />

      {/* Dot center */}
      <circle cx="100" cy="100" r="2.5" fill={GOLD} fillOpacity="0.8" />

      {/* Star points at cardinal */}
      <polygon points="100,14 102,20 100,18 98,20" fill={GOLD} fillOpacity="0.5" />
      <polygon points="100,186 102,180 100,182 98,180" fill={GOLD} fillOpacity="0.5" />
      <polygon points="14,100 20,98 18,100 20,102" fill={GOLD} fillOpacity="0.5" />
      <polygon points="186,100 180,98 182,100 180,102" fill={GOLD} fillOpacity="0.5" />
    </svg>
  );
}

interface KeyPageProps {
  onEnter: () => void;
}

export default function KeyPage({ onEnter }: KeyPageProps) {
  const [phase, setPhase] = useState<"crest" | "form" | "submitting">("crest");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [tapCount, setTapCount] = useState(0);
  const [lastTap, setLastTap] = useState(0);

  // After crest animation, show form
  useEffect(() => {
    const t = setTimeout(() => setPhase("form"), 3200);
    return () => clearTimeout(t);
  }, []);

  // Admin unlock: 5 taps on crest within 2s
  function handleCrestTap() {
    const now = Date.now();
    if (now - lastTap > 2000) {
      setTapCount(1);
    } else {
      const next = tapCount + 1;
      setTapCount(next);
      if (next >= 5) {
        // Navigate to admin
        window.location.hash = "admin";
        onEnter();
        return;
      }
    }
    setLastTap(now);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Both fields are required.");
      return;
    }
    setError("");
    // Store in sessionStorage for GatePage to use
    sessionStorage.setItem("makoa_name", name.trim());
    sessionStorage.setItem("makoa_phone", phone.trim());
    onEnter();
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050709",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background radial glow */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(176,142,80,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Crest */}
      <div
        onClick={handleCrestTap}
        style={{
          animation: "crestReveal 2.2s cubic-bezier(0.16,1,0.3,1) forwards",
          cursor: "default",
          marginBottom: phase === "form" ? "32px" : "0",
          transition: "margin 0.6s ease",
        }}
      >
        <MakoaCrest size={phase === "form" ? 120 : 180} />
      </div>

      {/* Order name */}
      <div style={{
        animation: "textReveal 1.4s ease 0.8s both",
        textAlign: "center",
        marginBottom: phase === "form" ? "28px" : "0",
      }}>
        <p className="font-cormorant" style={{
          fontSize: phase === "form" ? "1.6rem" : "2.2rem",
          color: GOLD,
          letterSpacing: "0.2em",
          fontWeight: 300,
          transition: "font-size 0.6s ease",
        }}>
          MĀKOA
        </p>
        <p style={{
          fontSize: "0.5rem",
          color: GOLD_DIM,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          marginTop: "4px",
        }}>
          The Order · Est. May 1, 2026
        </p>
      </div>

      {/* Form — appears after crest animation */}
      {phase === "form" && (
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: "340px",
            animation: "fadeUp 0.7s ease forwards",
          }}
        >
          <p style={{
            color: "rgba(232,224,208,0.4)",
            fontSize: "0.55rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: "20px",
          }}>
            Identify yourself to enter
          </p>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", color: GOLD_DIM, fontSize: "0.5rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: GOLD_DIM, fontSize: "0.5rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(808) 000-0000"
              autoComplete="tel"
            />
          </div>

          {error && (
            <p style={{ color: "#e05c5c", fontSize: "0.55rem", marginBottom: "12px", textAlign: "center" }}>{error}</p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              background: "transparent",
              border: `1px solid ${GOLD}`,
              color: GOLD,
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: "4px",
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.background = GOLD_FAINT;
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.background = "transparent";
            }}
          >
            Enter the Gate
          </button>

          <p style={{
            color: "rgba(232,224,208,0.2)",
            fontSize: "0.48rem",
            textAlign: "center",
            marginTop: "16px",
            lineHeight: 1.6,
          }}>
            By entering you acknowledge this is a private order.<br />
            Invitation only. Not a public membership.
          </p>
        </form>
      )}

      {/* Loading crest phase text */}
      {phase === "crest" && (
        <p style={{
          position: "absolute",
          bottom: "40px",
          color: "rgba(176,142,80,0.3)",
          fontSize: "0.48rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          animation: "glowPulse 2s ease-in-out infinite",
        }}>
          Under the Malu
        </p>
      )}
    </div>
  );
}
