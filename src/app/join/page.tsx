"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://flzivjhxtbolcfaniskv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps"
);

export default function JoinPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#04060a" }} />}>
      <JoinContent />
    </Suspense>
  );
}

function JoinContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "direct";

  const [crestVisible, setCrestVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    // Fade-in sequence
    setCrestVisible(true);
    const textTimer = setTimeout(() => setTextVisible(true), 500);
    const buttonTimer = setTimeout(() => setButtonVisible(true), 1500);

    // Log scan to Supabase (silently ignore failures)
    (async () => {
      try {
        await supabase.from("qr_scans").insert({
          ref_code: ref,
          scanned_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
        });
      } catch {
        // non-fatal
      }
    })();

    return () => {
      clearTimeout(textTimer);
      clearTimeout(buttonTimer);
    };
  }, [ref]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#04060a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Eclipse Crest */}
      <img
        src="/makoa_eclipse_crest.png"
        alt="Makoa Eclipse Crest"
        style={{
          width: "180px",
          height: "auto",
          marginBottom: "32px",
          opacity: crestVisible ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
        }}
      />

      {/* Headline */}
      <h1
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: "32px",
          fontWeight: 700,
          color: "#b08e50",
          margin: "0 0 16px 0",
          letterSpacing: "1px",
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        You Found the Gate.
      </h1>

      {/* Subtext */}
      <p
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: "16px",
          color: "#a0a0a0",
          margin: "0 0 48px 0",
          lineHeight: 1.6,
          maxWidth: "320px",
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}
      >
        M&#257;koa Brotherhood &mdash; West O&#699;ahu&rsquo;s founding order of men.
      </p>

      {/* CTA Button */}
      <Link href="/gate" style={{ textDecoration: "none" }}>
        <button
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "2px",
            color: "#04060a",
            backgroundColor: "#b08e50",
            border: "none",
            borderRadius: "4px",
            padding: "16px 40px",
            cursor: "pointer",
            opacity: buttonVisible ? 1 : 0,
            transform: buttonVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.8s ease, transform 0.8s ease, background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#c9a45c";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#b08e50";
          }}
        >
          ENTER THE GATE &rarr;
        </button>
      </Link>
    </div>
  );
}
