"use client";
import { useEffect, useState } from "react";
import Countdown from "@/components/Countdown";
import { TIMELINE } from "@/lib/timeline";

const GOLD = "#d4af37";
const FLAME = "#ff4e1f";
const BG = "#0a0606";
const CREAM = "rgba(245,236,217,0.85)";
const CREAM_DIM = "rgba(245,236,217,0.35)";

function useHonoluluTime() {
  const [display, setDisplay] = useState({ date: "", time: "" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: "Pacific/Honolulu",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const timeOpts: Intl.DateTimeFormatOptions = {
        timeZone: "Pacific/Honolulu",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setDisplay({
        date: new Intl.DateTimeFormat("en-US", opts).format(now),
        time: new Intl.DateTimeFormat("en-US", timeOpts).format(now),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return display;
}

const TABS = [
  { icon: "🌅", label: "BRIEF", href: "/ember/brief" },
  { icon: "🗣", label: "ASK XI", href: "/ember/xi" },
  { icon: "📋", label: "TASKS", href: "/ember/tasks" },
  { icon: "🚨", label: "ALERTS", href: "/ember/alerts" },
];

export default function EmberPage() {
  const { date, time } = useHonoluluTime();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: BG,
        color: CREAM,
        fontFamily: "'JetBrains Mono', monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "env(safe-area-inset-top, 20px) 0 env(safe-area-inset-bottom, 20px)",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Cormorant+Garamond:ital,wght@1,400;1,600&display=swap');
        @keyframes breathe { 0%,100%{opacity:0.6;} 50%{opacity:1;} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
        .ember-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px 8px;
          background: transparent;
          border: 1px solid rgba(212,175,55,0.12);
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
          color: rgba(245,236,217,0.5);
        }
        .ember-tab:hover {
          background: rgba(212,175,55,0.06);
          border-color: rgba(212,175,55,0.3);
          color: ${GOLD};
        }
      `}</style>

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        padding: "32px 24px 0",
        textAlign: "center",
        animation: mounted ? "fadeIn 0.6s ease both" : "none",
      }}>
        {/* Crest */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/makoa_eclipse_crest.png"
          alt="Mākoa Crest"
          style={{
            width: 52, height: 52, borderRadius: "50%",
            margin: "0 auto 12px", display: "block",
            border: "1px solid rgba(212,175,55,0.2)",
            animation: "breathe 4s ease-in-out infinite",
          }}
        />
        <p style={{
          fontSize: "0.62rem",
          letterSpacing: "0.32em",
          color: GOLD,
          fontWeight: 700,
          margin: "0 0 4px",
        }}>
          XI · EMBER
        </p>
        <p style={{
          fontSize: "0.5rem",
          letterSpacing: "0.18em",
          color: CREAM_DIM,
          margin: 0,
        }}>
          Commander Interface
        </p>
      </div>

      {/* ── HONOLULU CLOCK ───────────────────────────────────────────────── */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        padding: "28px 24px 0",
        textAlign: "center",
        animation: mounted ? "fadeIn 0.6s ease 0.1s both" : "none",
      }}>
        <p style={{
          fontSize: "clamp(2rem, 8vw, 2.8rem)",
          fontWeight: 700,
          color: CREAM,
          letterSpacing: "0.06em",
          lineHeight: 1,
          margin: "0 0 6px",
          fontVariantNumeric: "tabular-nums",
        }}>
          {time || "—"}
        </p>
        <p style={{
          fontSize: "0.52rem",
          color: CREAM_DIM,
          letterSpacing: "0.12em",
          margin: 0,
        }}>
          {date || "Honolulu, Hawaiʻi"}
        </p>
        <p style={{
          fontSize: "0.44rem",
          color: "rgba(245,236,217,0.2)",
          letterSpacing: "0.1em",
          marginTop: 4,
        }}>
          HST · UTC−10
        </p>
      </div>

      {/* ── COUNTDOWN TO GATE OPENS ──────────────────────────────────────── */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        padding: "32px 24px 0",
        animation: mounted ? "fadeIn 0.6s ease 0.2s both" : "none",
      }}>
        <div style={{
          background: "rgba(255,78,31,0.06)",
          border: "1px solid rgba(255,78,31,0.2)",
          borderRadius: 12,
          padding: "20px",
          textAlign: "center",
        }}>
          <Countdown
            targetIso={TIMELINE.GATE_OPENS.toISOString()}
            label="🌕 GATE OPENS · MAY 1 FULL MOON"
            variant="flame"
          />
        </div>
      </div>

      {/* ── BLUE MOON SEALING ────────────────────────────────────────────── */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        padding: "12px 24px 0",
        animation: mounted ? "fadeIn 0.6s ease 0.25s both" : "none",
      }}>
        <div style={{
          background: "rgba(212,175,55,0.04)",
          border: "1px solid rgba(212,175,55,0.12)",
          borderRadius: 12,
          padding: "16px 20px",
          textAlign: "center",
        }}>
          <Countdown
            targetIso={TIMELINE.BLUE_MOON_SEALING.toISOString()}
            label="🌕 BLUE MOON SEALING · MAY 31"
            variant="gold"
          />
        </div>
      </div>

      {/* ── TAB BUTTONS ──────────────────────────────────────────────────── */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        padding: "32px 24px 0",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        animation: mounted ? "fadeIn 0.6s ease 0.3s both" : "none",
      }}>
        {TABS.map((tab) => (
          <a key={tab.href} href={tab.href} className="ember-tab">
            <span style={{ fontSize: "1.4rem" }}>{tab.icon}</span>
            <span style={{
              fontSize: "0.52rem",
              letterSpacing: "0.18em",
              fontWeight: 700,
            }}>
              {tab.label}
            </span>
          </a>
        ))}
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <div style={{
        marginTop: "auto",
        paddingTop: 40,
        paddingBottom: 16,
        textAlign: "center",
        animation: mounted ? "fadeIn 0.6s ease 0.4s both" : "none",
      }}>
        <p style={{
          fontSize: "0.44rem",
          letterSpacing: "0.2em",
          color: "rgba(245,236,217,0.2)",
        }}>
          Under the Malu · 100-Year Mission
        </p>
        <p style={{
          fontSize: "0.38rem",
          letterSpacing: "0.15em",
          color: "rgba(212,175,55,0.2)",
          marginTop: 4,
        }}>
          ROOT · SNAP · PEG · DNA · ECHO
        </p>
      </div>
    </div>
  );
}
