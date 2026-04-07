"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.07)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const RED = "#e05c5c";
const AMBER = "#f0883e";

function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed || "makoa")}`;
}

type AttendanceDot = "green" | "amber" | "red" | "gray";

interface NaKoa {
  handle: string;
  degreeProgress: number;
  attendance: AttendanceDot[];
}

interface MentorLane {
  id: string;
  lane: string;
  icon: string;
  color: string;
  alii: string;
  aliiHandle: string;
  naKoa: NaKoa[];
}

const MENTOR_LANES: MentorLane[] = [
  {
    id: "law",
    lane: "Law",
    icon: "⚖",
    color: GOLD,
    alii: "Koa Akana",
    aliiHandle: "KoaAkana",
    naKoa: [
      { handle: "KaiMakoa", degreeProgress: 72, attendance: ["green", "green", "amber", "green"] },
      { handle: "WestOahu7", degreeProgress: 45, attendance: ["green", "amber", "red", "amber"] },
      { handle: "TradeKoa808", degreeProgress: 88, attendance: ["green", "green", "green", "green"] },
    ],
  },
  {
    id: "medicine",
    lane: "Medicine",
    icon: "🩺",
    color: BLUE,
    alii: "Malu Kahananui",
    aliiHandle: "MaluKahananui",
    naKoa: [
      { handle: "AlohaKoa", degreeProgress: 60, attendance: ["green", "green", "green", "amber"] },
      { handle: "HonoluluKoa", degreeProgress: 35, attendance: ["amber", "green", "amber", "red"] },
    ],
  },
  {
    id: "education",
    lane: "Education",
    icon: "📖",
    color: GREEN,
    alii: "Noa Kealoha",
    aliiHandle: "NoaKealoha",
    naKoa: [
      { handle: "BuilderKoa", degreeProgress: 55, attendance: ["green", "amber", "amber", "green"] },
      { handle: "KapoleiXI", degreeProgress: 90, attendance: ["green", "green", "green", "green"] },
      { handle: "MaluBrother", degreeProgress: 28, attendance: ["red", "amber", "red", "amber"] },
    ],
  },
  {
    id: "trades",
    lane: "Trades Master",
    icon: "🔨",
    color: AMBER,
    alii: "Hoku Palama",
    aliiHandle: "HokuPalama",
    naKoa: [
      { handle: "TradeKoa808", degreeProgress: 78, attendance: ["green", "green", "green", "amber"] },
      { handle: "WestOahu7", degreeProgress: 42, attendance: ["amber", "red", "amber", "green"] },
    ],
  },
  {
    id: "lawenforcement",
    lane: "Law Enforcement",
    icon: "🛡",
    color: BLUE,
    alii: "Kai Makoa",
    aliiHandle: "KaiMakoa808",
    naKoa: [
      { handle: "KaiMakoa", degreeProgress: 65, attendance: ["green", "green", "amber", "green"] },
    ],
  },
  {
    id: "realestate",
    lane: "Real Estate",
    icon: "🏠",
    color: GOLD,
    alii: "Lani Akana",
    aliiHandle: "LaniAkana",
    naKoa: [
      { handle: "AlohaKoa", degreeProgress: 50, attendance: ["green", "amber", "green", "green"] },
      { handle: "HonoluluKoa", degreeProgress: 33, attendance: ["amber", "amber", "red", "amber"] },
      { handle: "KapoleiXI", degreeProgress: 82, attendance: ["green", "green", "green", "green"] },
    ],
  },
  {
    id: "finance",
    lane: "Finance",
    icon: "💹",
    color: GREEN,
    alii: "Pono Kahananui",
    aliiHandle: "PonoKahananui",
    naKoa: [
      { handle: "MaluBrother", degreeProgress: 40, attendance: ["green", "amber", "amber", "red"] },
      { handle: "BuilderKoa", degreeProgress: 58, attendance: ["green", "green", "amber", "green"] },
    ],
  },
  {
    id: "tech",
    lane: "Tech",
    icon: "💻",
    color: BLUE,
    alii: "Keoni Palama",
    aliiHandle: "KeoniPalama",
    naKoa: [
      { handle: "KapoleiXI", degreeProgress: 95, attendance: ["green", "green", "green", "green"] },
      { handle: "TradeKoa808", degreeProgress: 62, attendance: ["green", "amber", "green", "green"] },
      { handle: "WestOahu7", degreeProgress: 30, attendance: ["amber", "red", "amber", "amber"] },
    ],
  },
  {
    id: "construction",
    lane: "Construction",
    icon: "🏗",
    color: AMBER,
    alii: "Makoa Kealoha",
    aliiHandle: "MakoaKealoha",
    naKoa: [
      { handle: "BuilderKoa", degreeProgress: 70, attendance: ["green", "green", "green", "amber"] },
      { handle: "HonoluluKoa", degreeProgress: 48, attendance: ["amber", "green", "amber", "green"] },
    ],
  },
  {
    id: "business",
    lane: "Business",
    icon: "📊",
    color: GOLD,
    alii: "Alika Kahananui",
    aliiHandle: "AlikaKahananui",
    naKoa: [
      { handle: "AlohaKoa", degreeProgress: 75, attendance: ["green", "green", "green", "green"] },
      { handle: "KaiMakoa", degreeProgress: 55, attendance: ["green", "amber", "green", "amber"] },
    ],
  },
  {
    id: "ministry",
    lane: "Ministry / Culture",
    icon: "🌺",
    color: "#f472b6",
    alii: "Kaimana Palama",
    aliiHandle: "KaimanaPalama",
    naKoa: [
      { handle: "MaluBrother", degreeProgress: 38, attendance: ["amber", "amber", "red", "amber"] },
    ],
  },
  {
    id: "health",
    lane: "Health / Fitness",
    icon: "💪",
    color: GREEN,
    alii: "Ikaika Kealoha",
    aliiHandle: "IkaikaKealoha",
    naKoa: [
      { handle: "KapoleiXI", degreeProgress: 88, attendance: ["green", "green", "green", "green"] },
      { handle: "TradeKoa808", degreeProgress: 72, attendance: ["green", "green", "amber", "green"] },
      { handle: "WestOahu7", degreeProgress: 44, attendance: ["amber", "amber", "red", "green"] },
    ],
  },
];

const UNMATCHED_NA_KOA = [
  { handle: "NewKoa808", tier: "nakoa", joined: "3 days ago" },
  { handle: "OahuWarrior", tier: "nakoa", joined: "1 week ago" },
  { handle: "KoaBuilder99", tier: "nakoa", joined: "2 weeks ago" },
];

const DOT_COLOR: Record<AttendanceDot, string> = {
  green: GREEN,
  amber: AMBER,
  red: RED,
  gray: "rgba(232,224,208,0.15)",
};

function AttendanceDots({ dots }: { dots: AttendanceDot[] }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {dots.map((dot, i) => (
        <div key={i} style={{
          width: "7px", height: "7px",
          borderRadius: "50%",
          background: DOT_COLOR[dot],
          flexShrink: 0,
        }} />
      ))}
    </div>
  );
}

function DegreeBar({ progress, color }: { progress: number; color: string }) {
  return (
    <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", marginTop: "4px" }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        background: color,
        borderRadius: "2px",
        transition: "width 0.8s ease",
      }} />
    </div>
  );
}

interface LaneCardProps {
  lane: MentorLane;
}

function LaneCard({ lane }: LaneCardProps) {
  return (
    <div style={{
      background: `rgba(${lane.color === GOLD ? "176,142,80" : lane.color === BLUE ? "88,166,255" : lane.color === GREEN ? "63,185,80" : lane.color === AMBER ? "240,136,62" : "244,114,182"},0.05)`,
      border: `1px solid ${lane.color}25`,
      borderRadius: "10px",
      padding: "14px",
    }}>
      {/* Lane header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "1rem" }}>{lane.icon}</span>
        <div>
          <p style={{ color: lane.color, fontSize: "0.42rem", letterSpacing: "0.12em", marginBottom: "1px" }}>
            LANE
          </p>
          <p style={{ color: "#e8e0d0", fontSize: "0.55rem", lineHeight: 1 }}>{lane.lane}</p>
        </div>
      </div>

      {/* Alii mentor */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 10px",
        background: `${lane.color}08`,
        border: `1px solid ${lane.color}20`,
        borderRadius: "6px",
        marginBottom: "10px",
      }}>
        <img
          src={dicebearUrl(lane.aliiHandle)}
          alt={lane.alii}
          style={{ width: "28px", height: "28px", borderRadius: "50%", border: `1px solid ${lane.color}40`, background: "#0a0d12", flexShrink: 0 }}
        />
        <div>
          <p style={{ color: lane.color, fontSize: "0.38rem", letterSpacing: "0.1em", marginBottom: "1px" }}>ALIʻI MENTOR</p>
          <p style={{ color: "#e8e0d0", fontSize: "0.48rem" }}>{lane.alii}</p>
        </div>
      </div>

      {/* Na Koa list */}
      <div style={{ display: "grid", gap: "7px" }}>
        {lane.naKoa.map((koa, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 8px",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "5px",
          }}>
            <img
              src={dicebearUrl(koa.handle)}
              alt={koa.handle}
              style={{ width: "22px", height: "22px", borderRadius: "50%", border: "1px solid rgba(63,185,80,0.3)", background: "#0a0d12", flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "0.42rem" }}>{koa.handle}</p>
                <AttendanceDots dots={koa.attendance} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <DegreeBar progress={koa.degreeProgress} color={lane.color} />
                <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem", flexShrink: 0 }}>
                  {koa.degreeProgress}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lane stats */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", paddingTop: "8px", borderTop: `1px solid ${lane.color}10` }}>
        <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>
          {lane.naKoa.length} Nā Koa paired
        </span>
        <span style={{ color: lane.color, fontSize: "0.38rem" }}>
          Avg: {Math.round(lane.naKoa.reduce((s, k) => s + k.degreeProgress, 0) / lane.naKoa.length)}% degree
        </span>
      </div>
    </div>
  );
}

export default function MentorBoardTab() {
  const [assignTarget, setAssignTarget] = useState<string | null>(null);

  return (
    <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "4px" }}>
          MENTOR BOARD — 12 ALIʻI PROFESSIONAL LANES
        </p>
        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.44rem", lineHeight: 1.6 }}>
          Each Aliʻi leads a professional lane. Nā Koa are paired for mentorship and degree progression.
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: GREEN }} />
            <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>Attended</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: AMBER }} />
            <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>Missed 1</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: RED }} />
            <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>Absent</span>
          </div>
          <span style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem" }}>← last 4 Wednesdays</span>
        </div>
      </div>

      {/* Lane grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "10px",
        marginBottom: "24px",
      }}>
        {MENTOR_LANES.map(lane => (
          <LaneCard key={lane.id} lane={lane} />
        ))}
      </div>

      {/* Unmatched Na Koa */}
      <div style={{
        background: "rgba(224,92,92,0.04)",
        border: "1px solid rgba(224,92,92,0.2)",
        borderRadius: "10px",
        padding: "16px",
      }}>
        <p style={{ color: RED, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "12px" }}>
          ⚠ UNMATCHED NĀ KOA — AWAITING MENTOR ASSIGNMENT
        </p>
        <div style={{ display: "grid", gap: "8px" }}>
          {UNMATCHED_NA_KOA.map(koa => (
            <div key={koa.handle} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "6px",
            }}>
              <img
                src={dicebearUrl(koa.handle)}
                alt={koa.handle}
                style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1px solid rgba(63,185,80,0.3)", background: "#0a0d12", flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ color: "#e8e0d0", fontSize: "0.5rem" }}>{koa.handle}</p>
                <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>
                  {koa.tier.toUpperCase()} · Joined {koa.joined}
                </p>
              </div>
              <button
                onClick={() => setAssignTarget(assignTarget === koa.handle ? null : koa.handle)}
                style={{
                  background: assignTarget === koa.handle ? GOLD : "transparent",
                  border: `1px solid ${GOLD}40`,
                  color: assignTarget === koa.handle ? "#000" : GOLD,
                  fontSize: "0.4rem",
                  letterSpacing: "0.1em",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: assignTarget === koa.handle ? 700 : 400,
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                {assignTarget === koa.handle ? "ASSIGNING..." : "ASSIGN"}
              </button>
            </div>
          ))}
        </div>

        {assignTarget && (
          <div style={{
            marginTop: "12px",
            padding: "12px",
            background: GOLD_FAINT,
            border: `1px solid rgba(176,142,80,0.2)`,
            borderRadius: "6px",
            animation: "fadeUp 0.2s ease forwards",
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.4rem", marginBottom: "8px" }}>
              SELECT LANE FOR {assignTarget}:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {MENTOR_LANES.map(lane => (
                <button
                  key={lane.id}
                  onClick={() => setAssignTarget(null)}
                  style={{
                    background: "transparent",
                    border: `1px solid ${lane.color}30`,
                    color: lane.color,
                    fontSize: "0.38rem",
                    padding: "4px 8px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {lane.icon} {lane.lane}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
