"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";

export default function ConfirmPage() {
  const router = useRouter();
  const [handle, setHandle] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHandle(sessionStorage.getItem("makoa_handle") || "");
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "40px 24px",
      textAlign: "center", fontFamily: "'JetBrains Mono', monospace",
      animation: "fadeIn 1s ease forwards",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
        fontSize: "2.6rem", color: GOLD, marginBottom: 16, lineHeight: 1.2,
      }}>
        ʻAe{handle ? `, ${handle}` : ""}.
      </p>
      <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.6rem", lineHeight: 1.9, maxWidth: 300, marginBottom: 12 }}>
        XI will reach you on Telegram within 24 hours.<br />
        Keep your signal open.
      </p>
      <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.45rem", letterSpacing: "0.15em", marginBottom: 40 }}>
        Under the Malu · Malu Trust · West Oahu · 2026
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD_DIM, fontSize: "0.9rem", letterSpacing: "0.1em", marginBottom: 40 }}>
        Hana · Pale · Ola
      </p>
      <button
        onClick={() => router.push("/portal/login")}
        style={{
          background: "transparent",
          border: "1px solid rgba(176,142,80,0.2)",
          color: "rgba(176,142,80,0.4)",
          fontSize: "0.45rem",
          letterSpacing: "0.2em",
          padding: "10px 24px",
          cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        MEMBER PORTAL →
      </button>
    </div>
  );
}
