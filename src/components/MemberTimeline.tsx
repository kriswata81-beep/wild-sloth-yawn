"use client";

import { type TimelineEvent } from "@/lib/db";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const GREEN = "#3fb950";
const RED = "#f85149";

const TYPE_COLORS: Record<string, string> = {
  pledge_submitted: GOLD,
  pledge_paid: GOLD,
  reviewed: "#58a6ff",
  accepted: GREEN,
  declined: RED,
  waitlisted: "#f0a030",
  deposit_paid: GOLD,
  subscription_activated: "#58a6ff",
  telegram_verified: "#58a6ff",
  first_event_reserved: GREEN,
  onboarding_complete: GREEN,
};

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
}

interface MemberTimelineProps {
  events: TimelineEvent[];
  compact?: boolean;
}

export default function MemberTimeline({ events, compact = false }: MemberTimelineProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 10 : 14 }}>
      {events.map((ev, i) => {
        const color = TYPE_COLORS[ev.type] || GOLD;
        const isLast = i === events.length - 1;
        return (
          <div key={ev.type} style={{ display: "flex", gap: 12, alignItems: "flex-start", position: "relative" }}>
            {/* Connector line */}
            {!isLast && (
              <div style={{
                position: "absolute", left: 13, top: 26, width: 1,
                height: compact ? 20 : 28,
                background: ev.done ? `${color}30` : "rgba(176,142,80,0.06)",
              }} />
            )}

            {/* Node */}
            <div style={{
              width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
              background: ev.done ? `${color}18` : "rgba(176,142,80,0.04)",
              border: `1.5px solid ${ev.done ? color : ev.active ? `${color}44` : "rgba(176,142,80,0.1)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>
              {ev.done
                ? <span style={{ color, fontSize: "0.55rem", fontWeight: 700 }}>✓</span>
                : ev.active
                ? <span style={{ color, fontSize: "0.4rem" }}>●</span>
                : <span style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.45rem" }}>{i + 1}</span>
              }
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingTop: 3 }}>
              <p style={{
                color: ev.done ? (ev.type === "declined" ? RED : GOLD) : ev.active ? "rgba(176,142,80,0.7)" : "rgba(176,142,80,0.25)",
                fontSize: compact ? "0.6rem" : "0.65rem",
                margin: "0 0 2px",
                fontWeight: ev.active ? 600 : 400,
                fontFamily: "var(--font-jetbrains)",
              }}>
                {ev.label}
              </p>
              {ev.date && (
                <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.5rem", margin: 0, fontFamily: "var(--font-jetbrains)" }}>
                  {formatDate(ev.date)}
                </p>
              )}
              {ev.active && !ev.done && (
                <p style={{ color: `${color}66`, fontSize: "0.5rem", margin: "2px 0 0", fontFamily: "var(--font-jetbrains)" }}>
                  In progress
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
