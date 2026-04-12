"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SocialFooter from "@/components/SocialFooter";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";

function MakoaCrest() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/makoa_eclipse_crest.png"
      alt="Mākoa Order Crest"
      width={200}
      height={200}
      style={{ borderRadius: "50%", display: "block" }}
    />
  );
}

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ready, setReady] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [tapFlash, setTapFlash] = useState(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2600);
    return () => clearTimeout(t);
  }, []);

  function handleCrestTap() {
    const next = tapCount + 1;
    setTapCount(next);
    setTapFlash(true);
    setTimeout(() => setTapFlash(false), 120);

    if (tapTimer.current) clearTimeout(tapTimer.current);

    if (next >= 5) {
      setTapCount(0);
      router.push("/steward");
      return;
    }

    tapTimer.current = setTimeout(() => setTapCount(0), 2000);
  }

  function handleEnter() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("makoa_handle", name);
      sessionStorage.setItem("makoa_phone", phone);
    }
    router.push("/gate");
  }

  const inputStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${GOLD_20}`,
    color: GOLD,
    fontSize: "0.75rem",
    fontFamily: "'JetBrains Mono', monospace",
    textAlign: "center",
    padding: "10px 0",
    width: "100%",
    outline: "none",
    letterSpacing: "0.08em",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "32px 24px",
      fontFamily: "'JetBrains Mono', monospace", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes crestFadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes breatheGlow {
          0%, 100% { box-shadow: 0 0 0px 0px rgba(176,142,80,0); }
          50% { box-shadow: 0 0 40px 12px rgba(176,142,80,0.12); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        input::placeholder { color: rgba(176,142,80,0.3); }
        .home-nav-link:hover { color: rgba(176,142,80,0.7) !important; }
      `}</style>

      <div
        style={{ marginBottom: "32px", animation: "crestFadeIn 2.5s cubic-bezier(0.16,1,0.3,1) forwards", cursor: "pointer", userSelect: "none" }}
        onClick={handleCrestTap}
      >
        <div style={{
          borderRadius: "50%",
          animation: "breatheGlow 4s ease-in-out 2.5s infinite",
          opacity: tapFlash ? 0.7 : 1,
          transition: "opacity 0.1s",
        }}>
          <MakoaCrest />
        </div>
        {tapCount > 0 && tapCount < 5 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "10px" }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: i <= tapCount ? GOLD : "rgba(176,142,80,0.15)",
                transition: "background 0.15s",
              }} />
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", width: "100%", maxWidth: 340 }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "2.6rem",
          color: GOLD,
          margin: "0 0 8px",
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.8s ease 0s, transform 0.8s ease 0s",
        }}>MĀKOA</p>

        <p style={{
          fontSize: "0.58rem",
          letterSpacing: "0.25em",
          color: "#4a3a20",
          margin: "0 0 6px",
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s",
        }}>Under the Malu</p>

        <p style={{
          fontSize: "0.5rem",
          color: "rgba(176,142,80,0.35)",
          margin: "0 0 32px",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}>🌕 Full Moon · The 72 Rises</p>

        <div style={{
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.8s ease 0.45s, transform 0.8s ease 0.45s",
          display: "grid", gap: "16px", marginBottom: "28px",
        }}>
          <div>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.45rem", letterSpacing: "0.2em", marginBottom: "6px" }}>YOUR NAME IN THE ORDER</p>
            <input
              style={inputStyle}
              placeholder="Handle name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.45rem", letterSpacing: "0.2em", marginBottom: "6px" }}>YOUR SIGNAL</p>
            <input
              style={inputStyle}
              placeholder="808 · · · · · · ·"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleEnter}
          style={{
            opacity: ready ? 1 : 0,
            transition: "opacity 0.8s ease 0.6s",
            background: "transparent",
            border: `1px solid ${GOLD_40}`,
            color: GOLD,
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            padding: "13px 40px",
            cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            width: "100%",
          }}
        >
          ENTER
        </button>
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "absolute", bottom: "20px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.8s ease 0.9s",
      }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <a href="/founding48" className="home-nav-link" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", letterSpacing: "0.15em", textDecoration: "none", transition: "color 0.2s" }}>MAYDAY</a>
          <span style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.38rem" }}>·</span>
          <a href="/mana-makoa" className="home-nav-link" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", letterSpacing: "0.15em", textDecoration: "none", transition: "color 0.2s" }}>MANA MAKOA</a>
          <span style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.38rem" }}>·</span>
          <a href="/portal" className="home-nav-link" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", letterSpacing: "0.15em", textDecoration: "none", transition: "color 0.2s" }}>PORTAL</a>
        </div>
        <p style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.36rem", letterSpacing: "0.15em", margin: 0 }}>
          Malu Trust · West Oahu · 2026
        </p>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity: ready ? 1 : 0, transition: "opacity 0.8s ease 1.2s" }}>
        <SocialFooter />
      </div>
    </div>
  );
}
