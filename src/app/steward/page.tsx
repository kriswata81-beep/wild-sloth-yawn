"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminPage from "@/components/AdminPage";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_DIM = "rgba(176,142,80,0.5)";

const SESSION_KEY = "makoa_steward_auth";

export default function StewardPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored === "true") setAuthed(true);
    }
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/steward/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(SESSION_KEY, "true");
        }
        setAuthed(true);
        setError("");
      } else {
        setError("Access denied.");
        setShake(true);
        setPassword("");
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setError("Connection error. Try again.");
    }
  }

  function handleExit() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY);
    }
    setAuthed(false);
    router.push("/");
  }

  if (authed) {
    return <AdminPage onExit={handleExit} />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#04060a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 24px",
      fontFamily: "'JetBrains Mono', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes breatheGlow {
          0%, 100% { box-shadow: 0 0 0px 0px rgba(176,142,80,0); }
          50% { box-shadow: 0 0 30px 8px rgba(176,142,80,0.08); }
        }
        @keyframes scanPulse {
          0% { opacity: 0; transform: translateY(-100%); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(100vh); }
        }
        .steward-input::placeholder { color: rgba(176,142,80,0.2); }
        .steward-input:focus { border-bottom-color: rgba(176,142,80,0.6) !important; }
      `}</style>

      {/* Scanline */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }} />

      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(176,142,80,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%", maxWidth: "360px",
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        position: "relative", zIndex: 1,
      }}>
        {/* Crest mark */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            width: "72px", height: "72px",
            border: `1px solid ${GOLD_20}`,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            animation: "breatheGlow 4s ease-in-out infinite",
            position: "relative",
          }}>
            {/* Inner ring */}
            <div style={{
              position: "absolute",
              width: "58px", height: "58px",
              border: `1px solid rgba(176,142,80,0.08)`,
              borderRadius: "50%",
            }} />
            <span style={{ color: GOLD_DIM, fontSize: "1.6rem" }}>⚔</span>
          </div>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "2rem",
            color: GOLD,
            margin: "0 0 8px",
            letterSpacing: "0.05em",
            lineHeight: 1,
          }}>
            Steward 0001
          </p>

          <p style={{
            color: "rgba(176,142,80,0.25)",
            fontSize: "0.4rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}>
            Command Center · Malu Trust
          </p>

          <p style={{
            color: "rgba(176,142,80,0.12)",
            fontSize: "0.36rem",
            letterSpacing: "0.2em",
          }}>
            10-DEPARTMENT OPERATIONS
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ animation: shake ? "shake 0.5s ease" : "none" }}>
          <div style={{ marginBottom: "28px" }}>
            <p style={{
              color: "rgba(176,142,80,0.35)",
              fontSize: "0.4rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "12px",
              textAlign: "center",
            }}>
              Steward Key
            </p>
            <input
              className="steward-input"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              placeholder="· · · · · · · ·"
              autoComplete="off"
              style={{
                background: "transparent",
                border: "none",
                borderBottom: `1px solid ${GOLD_20}`,
                color: GOLD,
                fontSize: "1.2rem",
                fontFamily: "'JetBrains Mono', monospace",
                textAlign: "center",
                padding: "12px 0",
                width: "100%",
                outline: "none",
                letterSpacing: "0.4em",
                transition: "border-bottom-color 0.2s",
                borderRadius: 0,
              }}
            />
          </div>

          {error && (
            <p style={{
              color: "#e05c5c",
              fontSize: "0.48rem",
              textAlign: "center",
              marginBottom: "16px",
              letterSpacing: "0.1em",
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              background: "transparent",
              border: `1px solid ${GOLD_40}`,
              color: GOLD,
              fontSize: "0.5rem",
              letterSpacing: "0.3em",
              padding: "14px 40px",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: "uppercase",
              transition: "border-color 0.2s, background 0.2s",
              borderRadius: "4px",
            }}
          >
            Enter Command Center
          </button>
        </form>

        <button
          onClick={() => router.push("/")}
          style={{
            display: "block", width: "100%", marginTop: "16px",
            background: "transparent", border: "none",
            color: "rgba(176,142,80,0.15)", fontSize: "0.4rem",
            cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.15em", padding: "8px",
          }}
        >
          ← Return
        </button>
      </div>

      <p style={{
        position: "absolute", bottom: "20px",
        color: "rgba(176,142,80,0.08)", fontSize: "0.36rem", letterSpacing: "0.2em",
      }}>
        Mākoa Order · Steward Access Only · 10 Departments
      </p>
    </div>
  );
}
