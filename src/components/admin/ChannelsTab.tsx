"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.07)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const RED = "#e05c5c";
const AMBER = "#f0883e";
const PURPLE = "#a78bfa";
const WHITE = "rgba(232,224,208,0.9)";

interface Channel {
  id: string;
  number: string;
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
  description: string;
  activeCount: number;
  lastActivity: string;
  items: string[];
  statusLabel: string;
  statusColor: string;
}

const CHANNELS: Channel[] = [
  {
    id: "911",
    number: "808-911",
    name: "Emergency",
    icon: "🚨",
    color: RED,
    borderColor: `${RED}40`,
    bgColor: "rgba(224,92,92,0.06)",
    description: "Peer response · nearest brothers dispatched",
    activeCount: 0,
    lastActivity: "No active alerts",
    items: [
      "Last alert: 14 days ago",
      "Avg response: 8 min",
      "Escalation: 0 pending",
      "Protocol: XI direct outreach",
    ],
    statusLabel: "ALL CLEAR",
    statusColor: GREEN,
  },
  {
    id: "411",
    number: "808-411",
    name: "Knowledge",
    icon: "📚",
    color: BLUE,
    borderColor: `${BLUE}40`,
    bgColor: "rgba(88,166,255,0.06)",
    description: "Questions matched to skilled brothers",
    activeCount: 3,
    lastActivity: "2 hrs ago",
    items: [
      "Open questions: 3",
      "Matched: 2 brothers",
      "Unfulfilled queue: 1",
      "Top topic: Real Estate",
    ],
    statusLabel: "3 OPEN",
    statusColor: BLUE,
  },
  {
    id: "311",
    number: "808-311",
    name: "Dispatch",
    icon: "🚛",
    color: GREEN,
    borderColor: `${GREEN}40`,
    bgColor: "rgba(63,185,80,0.06)",
    description: "Service routes · crew assignments · job status",
    activeCount: 7,
    lastActivity: "Active now",
    items: [
      "Routes today: 7 active",
      "Crew assigned: 14 brothers",
      "Jobs complete: 5/7",
      "Pending: 2 routes",
    ],
    statusLabel: "7 ACTIVE",
    statusColor: GREEN,
  },
  {
    id: "211",
    number: "808-211",
    name: "Formation",
    icon: "⚔",
    color: GOLD,
    borderColor: `${GOLD}40`,
    bgColor: GOLD_FAINT,
    description: "Wednesday schedule · academy roster · degree progress",
    activeCount: 12,
    lastActivity: "Wed 4am",
    items: [
      "Academy roster: 12 active",
      "Next Wed training: 4am",
      "Degree queue: 4 brothers",
      "Formation score avg: 68%",
    ],
    statusLabel: "12 ENROLLED",
    statusColor: GOLD,
  },
  {
    id: "511",
    number: "808-511",
    name: "Signal",
    icon: "📡",
    color: PURPLE,
    borderColor: `${PURPLE}40`,
    bgColor: "rgba(167,139,250,0.06)",
    description: "Scheduled posts · newsletter · Telegram drops",
    activeCount: 5,
    lastActivity: "Today 6am",
    items: [
      "Scheduled posts: 5",
      "Newsletter: draft ready",
      "Telegram drops: daily",
      "Next drop: Tomorrow 6am",
    ],
    statusLabel: "5 QUEUED",
    statusColor: PURPLE,
  },
  {
    id: "611",
    number: "808-611",
    name: "Treasury",
    icon: "💰",
    color: AMBER,
    borderColor: `${AMBER}40`,
    bgColor: "rgba(240,136,62,0.06)",
    description: "Dues collection · overdue list · revenue split",
    activeCount: 2,
    lastActivity: "Today",
    items: [
      "Collection rate: 87%",
      "Overdue: 2 brothers",
      "MRR: $9,700",
      "Split: 80/10/10 active",
    ],
    statusLabel: "2 OVERDUE",
    statusColor: AMBER,
  },
  {
    id: "711",
    number: "808-711",
    name: "Council",
    icon: "👑",
    color: GOLD,
    borderColor: `${GOLD}60`,
    bgColor: GOLD_FAINT,
    description: "Elevation votes · house motions · discipline queue",
    activeCount: 1,
    lastActivity: "3 days ago",
    items: [
      "Pending votes: 1",
      "House motions: 0",
      "Discipline queue: 0",
      "Next council: Full Moon",
    ],
    statusLabel: "1 PENDING",
    statusColor: GOLD,
  },
  {
    id: "811",
    number: "808-811",
    name: "Exchange",
    icon: "🤝",
    color: BLUE,
    borderColor: `${BLUE}40`,
    bgColor: "rgba(88,166,255,0.06)",
    description: "B2B/B2C contracts · job board · pending matches",
    activeCount: 4,
    lastActivity: "Yesterday",
    items: [
      "Open contracts: 4",
      "Job board: 6 listings",
      "Pending matches: 2",
      "Closed this week: 1",
    ],
    statusLabel: "4 OPEN",
    statusColor: BLUE,
  },
  {
    id: "111",
    number: "808-111",
    name: "Gate",
    icon: "🚪",
    color: GREEN,
    borderColor: `${GREEN}40`,
    bgColor: "rgba(63,185,80,0.06)",
    description: "New submissions · XI assignment queue · referral tracker",
    activeCount: 3,
    lastActivity: "Today",
    items: [
      "New today: 3 submissions",
      "XI queue: 2 pending",
      "Referral tracker: 8 active",
      "Conversion rate: 34%",
    ],
    statusLabel: "3 NEW",
    statusColor: GREEN,
  },
  {
    id: "011",
    number: "808-011",
    name: "Command",
    icon: "⚡",
    color: WHITE,
    borderColor: "rgba(232,224,208,0.3)",
    bgColor: "rgba(232,224,208,0.03)",
    description: "XI system status · API health · daily log summary",
    activeCount: 1,
    lastActivity: "Live",
    items: [
      "XI status: ONLINE",
      "API health: 99.9%",
      "Daily log: 12 entries",
      "Last sync: 4 min ago",
    ],
    statusLabel: "ONLINE",
    statusColor: GREEN,
  },
];

interface ChannelCardProps {
  channel: Channel;
  expanded: boolean;
  onToggle: () => void;
}

function ChannelCard({ channel, expanded, onToggle }: ChannelCardProps) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: channel.bgColor,
        border: `1px solid ${channel.borderColor}`,
        borderRadius: "10px",
        padding: "14px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1rem" }}>{channel.icon}</span>
          <div>
            <p style={{ color: channel.color, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "1px" }}>
              {channel.number}
            </p>
            <p style={{ color: "#e8e0d0", fontSize: "0.55rem", lineHeight: 1 }}>{channel.name}</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{
            color: channel.statusColor,
            fontSize: "0.38rem",
            letterSpacing: "0.1em",
            background: `${channel.statusColor}12`,
            border: `1px solid ${channel.statusColor}30`,
            padding: "2px 6px",
            borderRadius: "3px",
          }}>
            {channel.statusLabel}
          </span>
        </div>
      </div>

      <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", lineHeight: 1.5, marginBottom: "8px" }}>
        {channel.description}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.38rem" }}>
          Last: {channel.lastActivity}
        </p>
        <span style={{ color: channel.color, fontSize: "0.38rem", opacity: 0.6 }}>
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          marginTop: "12px",
          paddingTop: "12px",
          borderTop: `1px solid ${channel.color}15`,
          animation: "fadeUp 0.2s ease forwards",
        }}>
          {channel.items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ color: channel.color, fontSize: "0.38rem", opacity: 0.5 }}>◆</span>
              <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.44rem" }}>{item}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChannelsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalActive = CHANNELS.reduce((sum, c) => sum + c.activeCount, 0);

  return (
    <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "4px" }}>
          808 CHANNEL SYSTEM — 10 ACTIVE CHANNELS
        </p>
        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.44rem", lineHeight: 1.6 }}>
          All 808 channels monitored by XI. Tap any channel to expand status.
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
          <span style={{ color: GREEN, fontSize: "0.42rem" }}>{totalActive} active items</span>
          <span style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.42rem" }}>·</span>
          <span style={{ color: GOLD_DIM, fontSize: "0.42rem" }}>10 channels online</span>
        </div>
      </div>

      {/* Channel grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "10px",
      }}>
        {CHANNELS.map(channel => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            expanded={expanded === channel.id}
            onToggle={() => setExpanded(expanded === channel.id ? null : channel.id)}
          />
        ))}
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: "20px",
        padding: "12px 16px",
        background: GOLD_FAINT,
        border: `1px solid rgba(176,142,80,0.1)`,
        borderRadius: "8px",
        textAlign: "center",
      }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", lineHeight: 1.8 }}>
          808 channels are monitored by XI 24/7.<br />
          <span style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem" }}>
            Emergency escalation: 808-911 → nearest Aliʻi → Chief Makoa
          </span>
        </p>
      </div>
    </div>
  );
}
