"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminPage from "@/components/AdminPage";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_DIM = "rgba(176,142,80,0.5)";

const STEWARD_PASSWORD = "makoa0001";
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === STEWARD_PASSWORD) {
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
      background: "#000",
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
        .steward-input::placeholder { color: rgba(176,142,80,0.2); }
        .steward-input:focus { border-bottom-color: rgba(176,142,80,0.6) !important; }
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(176,142,80,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: "360px",
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}>
        {/* Crest mark */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            border: `1px solid ${GOLD_20}`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            animation: "breatheGlow 4s ease-in-out infinite",
          }}>
            <span style={{ color: GOLD_DIM, fontSize: "1.4rem" }}>⚔</span>
          </div>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "1.8rem",
            color: GOLD,
            margin: "0 0 8px",
            letterSpacing: "0.05em",
          }}>
            Steward Command Center
          </p>

          <p style={{
            color: "rgba(176,142,80,0.25)",
            fontSize: "0.42rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}>
            Restricted Access · Malu Trust
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            animation: shake ? "shake 0.5s ease" : "none",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <p style={{
              color: "rgba(176,142,80,0.35)",
              fontSize: "0.42rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "10px",
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
                fontSize: "1rem",
                fontFamily: "'JetBrains Mono', monospace",
                textAlign: "center",
                padding: "12px 0",
                width: "100%",
                outline: "none",
                letterSpacing: "0.3em",
                transition: "border-bottom-color 0.2s",
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
              fontSize: "0.52rem",
              letterSpacing: "0.3em",
              padding: "13px 40px",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: "uppercase",
              transition: "border-color 0.2s, color 0.2s",
            }}
          >
            Enter
          </button>
        </form>

        <button
          onClick={() => router.push("/")}
          style={{
            display: "block",
            width: "100%",
            marginTop: "16px",
            background: "transparent",
            border: "none",
            color: "rgba(176,142,80,0.15)",
            fontSize: "0.42rem",
            cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.15em",
            padding: "8px",
          }}
        >
          ← Return
        </button>
      </div>

      <p style={{
        position: "absolute",
        bottom: "20px",
        color: "rgba(176,142,80,0.1)",
        fontSize: "0.38rem",
        letterSpacing: "0.2em",
      }}>
        Mākoa Order · Steward Access Only
      </p>
    </div>
  );
}
