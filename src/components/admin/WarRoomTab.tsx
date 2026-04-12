"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.07)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const RED = "#e05c5c";
const AMBER = "#f0883e";
const PURPLE = "#bc8cff";

/* ─── 5D Framework ──────────────────────────────────────────────── */

const FRAMEWORK_5D = [
  {
    phase: "D1",
    name: "DECLARE",
    subtitle: "The Why",
    pct: "10%",
    color: GOLD,
    description: "Mission. Roll call. XI brief. The Oath. ONE clear session objective.",
    rule: "No phones. Presence required.",
  },
  {
    phase: "D2",
    name: "DIAGNOSE",
    subtitle: "The Truth",
    pct: "20%",
    color: BLUE,
    description: "60-second status from every brother. One carries the weight. XI data review. Problems named — no fixing yet.",
    rule: "Listen. No advice. Just hold space.",
  },
  {
    phase: "D3",
    name: "DESIGN",
    subtitle: "The Plan",
    pct: "30%",
    color: GREEN,
    description: "SOP proposals. Growth strategy. Resource allocation. Ali'i vote (2/3 majority). Action items with names and deadlines.",
    rule: "Every item gets a name, deadline, and deliverable.",
  },
  {
    phase: "D4",
    name: "DEPLOY",
    subtitle: "The Commitment",
    pct: "25%",
    color: AMBER,
    description: "Each brother states ONE commitment. Logged by XI. Accountability pairs. Next War Room confirmed.",
    rule: "No commit = sit out next formation.",
  },
  {
    phase: "D5",
    name: "DEFEND",
    subtitle: "The Close",
    pct: "15%",
    color: PURPLE,
    description: "Acknowledgments. The Promise. Closing words. What's said stays in the War Room.",
    rule: "The circle breaks. Always.",
  },
];

/* ─── War Room Types ────────────────────────────────────────────── */

interface AgendaItem {
  time: string;
  event: string;
  phase: string;
  detail: string;
  phaseColor: string;
}

const WEEKLY_AGENDA: AgendaItem[] = [
  { time: "0:00", event: "Roll Call & Oath", phase: "D1", detail: "Abbreviated oath. XI weekly brief: platform health, revenue, risk flags.", phaseColor: GOLD },
  { time: "0:10", event: "Round Robin Status", phase: "D2", detail: "Every brother: 60 seconds. What I committed. What I did. Where I'm stuck.", phaseColor: BLUE },
  { time: "0:25", event: "The Weight Room", phase: "D2", detail: "One brother carries the weight. The rest hold space. No advice. Just presence.", phaseColor: BLUE },
  { time: "0:35", event: "Growth & Proposals", phase: "D3", detail: "Any SOP proposals? Action items from last week. New assignments.", phaseColor: GREEN },
  { time: "0:55", event: "Weekly Commitments", phase: "D4", detail: "Each brother: ONE thing this week. Accountability pair check-in.", phaseColor: AMBER },
  { time: "1:15", event: "Acknowledgments & Close", phase: "D5", detail: "Call out one brother. The Promise. Circle breaks.", phaseColor: PURPLE },
];

const MONTHLY_AGENDA: AgendaItem[] = [
  { time: "0:00", event: "Full Oath & Moon Phase", phase: "D1", detail: "Complete oath spoken together. XI monthly report. Significance of this moon.", phaseColor: GOLD },
  { time: "0:15", event: "Deep Round Robin", phase: "D2", detail: "Every brother reports. Two brothers carry the weight (deeper session).", phaseColor: BLUE },
  { time: "0:45", event: "Monthly Strategy", phase: "D3", detail: "SOP votes. Revenue review. Growth targets. Circle Partner updates.", phaseColor: GREEN },
  { time: "1:30", event: "30-Day Commitments", phase: "D4", detail: "Monthly goals. Rank progression check. Route performance targets.", phaseColor: AMBER },
  { time: "2:00", event: "Ice Bath & Brotherhood", phase: "D5", detail: "Cold exposure (if available). Bonfire. Brotherhood circle. Close.", phaseColor: PURPLE },
];

const MAYDAY_FRIDAY: AgendaItem[] = [
  { time: "5:00 PM", event: "Gates Open — Check-In", phase: "—", detail: "Embassy Suites (Ali'i/Mana) + Hampton Inn (Na Koa). Welcome packet: field manual, patch, schedule.", phaseColor: "rgba(232,224,208,0.3)" },
  { time: "5:30 PM", event: "Brothers Meet", phase: "—", detail: "Lobby gathering. Name tags with callsign + class color. No formal session.", phaseColor: "rgba(232,224,208,0.3)" },
  { time: "6:00 PM", event: "War Room Roll Call", phase: "D1", detail: "All classes seated. XI opens founding session. The Steward speaks the mission. First Oath together.", phaseColor: GOLD },
  { time: "6:30 PM", event: "State of the Order", phase: "D1", detail: "XI presents: live platform demo, economy breakdown, what's built, the 100-year vision.", phaseColor: GOLD },
  { time: "7:00 PM", event: "Round Robin", phase: "D2", detail: "Every brother: 'My name is ___. I'm here because ___.' 60 seconds each.", phaseColor: BLUE },
  { time: "8:00 PM", event: "The Weight Room", phase: "D2", detail: "First circle. No phones. Steward goes first to set the standard.", phaseColor: BLUE },
  { time: "9:00 PM", event: "Break — Pupu", phase: "—", detail: "Lite food. Water. Brotherhood bonding.", phaseColor: "rgba(232,224,208,0.3)" },
  { time: "9:30 PM", event: "Brotherhood Circle", phase: "D5", detail: "Informal. Bonfire or lobby. Stories. The brotherhood forms here.", phaseColor: PURPLE },
];

const MAYDAY_SATURDAY: AgendaItem[] = [
  { time: "3:00 AM", event: "Wake Call", phase: "—", detail: "The van is running. No alarm. You know.", phaseColor: "rgba(232,224,208,0.3)" },
  { time: "4:00 AM", event: "Ice Bath", phase: "D2", detail: "Flower Moon sets over the Pacific. You go in. Cold reveals character.", phaseColor: BLUE },
  { time: "5:00 AM", event: "Sunrise Formation", phase: "D1", detail: "On the beach. Oath at sunrise. Ko'olau behind you.", phaseColor: GOLD },
  { time: "5:30 AM", event: "Weight Room — Deep", phase: "D2", detail: "'What I've been carrying alone.' Guided circle. The real session.", phaseColor: BLUE },
  { time: "7:00 AM", event: "Breakfast", phase: "—", detail: "Embassy Suites. Brothers eat together.", phaseColor: "rgba(232,224,208,0.3)" },
  { time: "9:00 AM", event: "War Room — The Order", phase: "D3", detail: "Platform. Economy. Ranks. 808 network. Routes. 80/10/10 with real numbers.", phaseColor: GREEN },
  { time: "10:00 AM", event: "War Room — Growth", phase: "D3", detail: "Where do we grow? Who do we recruit? 90-day target. Ali'i lead.", phaseColor: GREEN },
  { time: "11:00 AM", event: "Team Formation", phase: "D4", detail: "War parties assigned. Accountability pairs. Your team for 90 days.", phaseColor: AMBER },
  { time: "12:00 PM", event: "Lunch", phase: "—", detail: "Kapolei town. Brothers eat in teams.", phaseColor: "rgba(232,224,208,0.3)" },
  { time: "1:00 PM", event: "Route Workshop", phase: "D3", detail: "Trade academies. Skills mapping. Business planning. Real routes.", phaseColor: GREEN },
  { time: "2:30 PM", event: "Free Time", phase: "—", detail: "Beach. Kapolei. Rest. Bond.", phaseColor: "rgba(232,224,208,0.3)" },
  { time: "5:00 PM", event: "Ali'i Council Session", phase: "D3", detail: "Ali'i only. Charter review. Founding votes. XI proposals. 2/3 majority.", phaseColor: GREEN },
  { time: "6:00 PM", event: "Ali'i Fire Ceremony", phase: "D5", detail: "Co-founders only. Fire ceremony. Charter signed. Order legally founded.", phaseColor: PURPLE },
  { time: "7:00 PM", event: "Bonfire — All Classes", phase: "D5", detail: "Everyone. Open bonfire. Pupu. Stories. Music. Brotherhood is one.", phaseColor: PURPLE },
];

const MAYDAY_SUNDAY: AgendaItem[] = [
  { time: "4:00 AM", event: "Ice Bath — Day 2", phase: "D2", detail: "Who comes back? Second morning reveals true character.", phaseColor: BLUE },
  { time: "5:00 AM", event: "Sunrise Commitments", phase: "D4", detail: "Each brother declares 90-day build. Public. Recorded. Binding.", phaseColor: AMBER },
  { time: "6:00 AM", event: "Weight Room — Closing", phase: "D2", detail: "Last circle. What shifted? What are you taking home?", phaseColor: BLUE },
  { time: "7:30 AM", event: "Breakfast", phase: "—", detail: "Last meal together as the full order.", phaseColor: "rgba(232,224,208,0.3)" },
  { time: "9:00 AM", event: "War Room — Charter", phase: "D3", detail: "Ali'i and Mana. Charter signed. Operations confirmed. Academies announced.", phaseColor: GREEN },
  { time: "10:30 AM", event: "War Room — Road Ahead", phase: "D4", detail: "90-day deployment. Next Ka Ho'ike. Next Weight Room schedule. Locked.", phaseColor: AMBER },
  { time: "12:00 PM", event: "The Stones Ceremony", phase: "D5", detail: "Rank stones and challenge coins. Your place in the order is sealed.", phaseColor: PURPLE },
  { time: "1:00 PM", event: "Lunch — Pupu Party", phase: "—", detail: "Mana hosts. Na Koa welcome. Casual. Kapolei town.", phaseColor: "rgba(232,224,208,0.3)" },
  { time: "3:00 PM", event: "Na Koa Departure", phase: "—", detail: "Day-pass brothers depart. Ali'i and Mana continue.", phaseColor: "rgba(232,224,208,0.3)" },
  { time: "5:00 PM", event: "Founding Dinner", phase: "D5", detail: "Moani Island Bistro. 12 seats. Ali'i table. Seat offers made.", phaseColor: PURPLE },
  { time: "7:00 PM", event: "The Send", phase: "D5", detail: "Final circle. All classes. Bonfire. Departure blessing. Fire never goes out.", phaseColor: PURPLE },
];

/* ─── War Room Rules ────────────────────────────────────────────── */

const RULES = [
  { rule: "No phones", detail: "Not on silent. Not face down. In the car or the bag." },
  { rule: "What's said stays", detail: "Circle is sacred. Violation = standing review." },
  { rule: "Everyone speaks", detail: "No spectators. In the room = in the circle." },
  { rule: "60-second rule", detail: "Status updates are 60 seconds. Weight Room is unlimited." },
  { rule: "No advice in Diagnose", detail: "Listen. Hold space. Fixing comes in Design." },
  { rule: "XI runs the clock", detail: "When time's up, time's up. Respect the protocol." },
  { rule: "Commitments are binding", detail: "Say it in Deploy, do it. Miss two = intervention." },
  { rule: "Ali'i speak last in Diagnose", detail: "First in Design. But they still speak." },
  { rule: "This is not a meeting", detail: "It's a formation. Treat it accordingly." },
];

/* ─── Component ─────────────────────────────────────────────────── */

export default function WarRoomTab() {
  const [view, setView] = useState<"5d" | "weekly" | "monthly" | "mayday" | "rules">("5d");
  const [maydayDay, setMaydayDay] = useState<"fri" | "sat" | "sun">("fri");

  const views = [
    { key: "5d" as const, label: "5D FRAMEWORK", icon: "⬡" },
    { key: "weekly" as const, label: "WEEKLY", icon: "📅" },
    { key: "monthly" as const, label: "MONTHLY", icon: "🌕" },
    { key: "mayday" as const, label: "MAYDAY 72HR", icon: "🔥" },
    { key: "rules" as const, label: "RULES", icon: "📜" },
  ];

  function AgendaRow({ item, index }: { item: AgendaItem; index: number }) {
    return (
      <div style={{
        display: "flex",
        gap: "12px",
        padding: "12px 0",
        borderBottom: "1px solid rgba(176,142,80,0.06)",
        animation: `fadeUp 0.3s ease ${index * 0.03}s both`,
      }}>
        <div style={{ minWidth: "54px", textAlign: "right" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.48rem", fontWeight: 500 }}>{item.time}</p>
        </div>
        <div style={{
          width: "3px",
          borderRadius: "2px",
          background: item.phaseColor,
          opacity: 0.6,
          flexShrink: 0,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
            <p style={{ color: "#e8e0d0", fontSize: "0.52rem" }}>{item.event}</p>
            {item.phase !== "—" && (
              <span style={{
                color: item.phaseColor,
                fontSize: "0.34rem",
                letterSpacing: "0.1em",
                background: `${item.phaseColor}15`,
                border: `1px solid ${item.phaseColor}30`,
                padding: "1px 6px",
                borderRadius: "3px",
              }}>
                {item.phase}
              </span>
            )}
          </div>
          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", lineHeight: 1.5 }}>{item.detail}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <p style={{ color: GOLD, fontSize: "0.7rem", letterSpacing: "0.15em" }}>WAR ROOM PROTOCOL</p>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginTop: "4px" }}>
            5D FRAMEWORK · CLOCKWORK AGENDA · ZERO IMPROVISATION
          </p>
        </div>
      </div>

      {/* View nav */}
      <div style={{
        display: "flex",
        gap: "4px",
        marginBottom: "20px",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {views.map(v => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            style={{
              background: view === v.key ? "rgba(176,142,80,0.12)" : "transparent",
              border: `1px solid ${view === v.key ? "rgba(176,142,80,0.3)" : "rgba(176,142,80,0.08)"}`,
              color: view === v.key ? GOLD : GOLD_DIM,
              fontSize: "0.4rem",
              letterSpacing: "0.1em",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            {v.icon} {v.label}
          </button>
        ))}
      </div>

      {/* ─── 5D FRAMEWORK ────────────────────────────────────── */}
      {view === "5d" && (
        <div>
          {/* Visual bar */}
          <div style={{ display: "flex", gap: "2px", height: "12px", borderRadius: "6px", overflow: "hidden", marginBottom: "24px" }}>
            {FRAMEWORK_5D.map(d => (
              <div key={d.phase} style={{
                width: d.pct,
                background: d.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.8,
              }}>
                <span style={{ color: "#000", fontSize: "0.3rem", fontWeight: 700 }}>{d.phase}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {FRAMEWORK_5D.map((d, i) => (
              <div key={d.phase} style={{
                background: GOLD_FAINT,
                border: `1px solid ${d.color}25`,
                borderRadius: "10px",
                padding: "16px",
                borderLeft: `3px solid ${d.color}`,
                animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      color: d.color,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      minWidth: "28px",
                    }}>
                      {d.phase}
                    </span>
                    <div>
                      <p style={{ color: "#e8e0d0", fontSize: "0.55rem", marginBottom: "1px" }}>{d.name}</p>
                      <p style={{ color: d.color, fontSize: "0.4rem", opacity: 0.7 }}>{d.subtitle}</p>
                    </div>
                  </div>
                  <span style={{
                    color: d.color,
                    fontSize: "0.45rem",
                    fontWeight: 500,
                    background: `${d.color}15`,
                    padding: "3px 10px",
                    borderRadius: "4px",
                  }}>
                    {d.pct}
                  </span>
                </div>
                <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.44rem", lineHeight: 1.6, marginBottom: "6px" }}>
                  {d.description}
                </p>
                <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.38rem", fontStyle: "italic" }}>
                  Rule: {d.rule}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── WEEKLY WAR ROOM ─────────────────────────────────── */}
      {view === "weekly" && (
        <div>
          <div style={{
            background: "rgba(176,142,80,0.06)",
            border: "1px solid rgba(176,142,80,0.15)",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <p style={{ color: GOLD, fontSize: "0.55rem" }}>WEEKLY WEIGHT ROOM</p>
              <p style={{ color: GOLD_DIM, fontSize: "0.4rem" }}>Every Saturday · 90 minutes</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: GOLD, fontSize: "0.8rem", fontWeight: 500 }}>1:30</p>
              <p style={{ color: GOLD_DIM, fontSize: "0.36rem" }}>DURATION</p>
            </div>
          </div>
          <div>
            {WEEKLY_AGENDA.map((item, i) => (
              <AgendaRow key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ─── MONTHLY GATHERING ───────────────────────────────── */}
      {view === "monthly" && (
        <div>
          <div style={{
            background: "rgba(176,142,80,0.06)",
            border: "1px solid rgba(176,142,80,0.15)",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <p style={{ color: GOLD, fontSize: "0.55rem" }}>PO MAHINA — FULL MOON GATHERING</p>
              <p style={{ color: GOLD_DIM, fontSize: "0.4rem" }}>Monthly · 2.5 hours</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: GOLD, fontSize: "0.8rem", fontWeight: 500 }}>2:30</p>
              <p style={{ color: GOLD_DIM, fontSize: "0.36rem" }}>DURATION</p>
            </div>
          </div>
          <div>
            {MONTHLY_AGENDA.map((item, i) => (
              <AgendaRow key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ─── MAYDAY 72HR ─────────────────────────────────────── */}
      {view === "mayday" && (
        <div>
          <div style={{
            background: "rgba(248,81,73,0.06)",
            border: "1px solid rgba(248,81,73,0.15)",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "16px",
            textAlign: "center",
          }}>
            <p style={{ color: RED, fontSize: "0.6rem", letterSpacing: "0.15em" }}>MAYDAY SUMMIT 2026</p>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", marginTop: "4px" }}>
              May 1-3 · Kapolei, Oahu · 72 Hours · 48 Brothers
            </p>
          </div>

          {/* Day selector */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
            {[
              { key: "fri" as const, label: "FRIDAY", subtitle: "Arrival & Formation" },
              { key: "sat" as const, label: "SATURDAY", subtitle: "The Forge" },
              { key: "sun" as const, label: "SUNDAY", subtitle: "The Founding" },
            ].map(d => (
              <button
                key={d.key}
                onClick={() => setMaydayDay(d.key)}
                style={{
                  flex: 1,
                  background: maydayDay === d.key ? "rgba(176,142,80,0.1)" : GOLD_FAINT,
                  border: `1px solid ${maydayDay === d.key ? "rgba(176,142,80,0.3)" : "rgba(176,142,80,0.08)"}`,
                  borderRadius: "8px",
                  padding: "10px 8px",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  textAlign: "center",
                }}
              >
                <p style={{ color: maydayDay === d.key ? GOLD : GOLD_DIM, fontSize: "0.45rem", letterSpacing: "0.1em" }}>{d.label}</p>
                <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.34rem", marginTop: "2px" }}>{d.subtitle}</p>
              </button>
            ))}
          </div>

          <div>
            {(maydayDay === "fri" ? MAYDAY_FRIDAY : maydayDay === "sat" ? MAYDAY_SATURDAY : MAYDAY_SUNDAY).map((item, i) => (
              <AgendaRow key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ─── RULES ───────────────────────────────────────────── */}
      {view === "rules" && (
        <div>
          <div style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(176,142,80,0.15)",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
            textAlign: "center",
          }}>
            <p style={{ color: GOLD, fontSize: "0.6rem", letterSpacing: "0.15em", marginBottom: "6px" }}>
              WAR ROOM RULES
            </p>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem" }}>
              Posted in every War Room. No exceptions. No negotiations.
            </p>
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            {RULES.map((r, i) => (
              <div key={i} style={{
                background: GOLD_FAINT,
                border: "1px solid rgba(176,142,80,0.1)",
                borderRadius: "10px",
                padding: "14px 16px",
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
              }}>
                <span style={{
                  color: GOLD,
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  minWidth: "20px",
                  textAlign: "center",
                  marginTop: "1px",
                }}>
                  {i + 1}
                </span>
                <div>
                  <p style={{ color: "#e8e0d0", fontSize: "0.52rem", marginBottom: "3px" }}>{r.rule}</p>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem" }}>{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
