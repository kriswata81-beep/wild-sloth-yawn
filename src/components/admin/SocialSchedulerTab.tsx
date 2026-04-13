"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.07)";
const GREEN = "#3fb950";
const PURPLE = "#a78bfa";
const AMBER = "#f0883e";

type Platform = "facebook" | "telegram";

interface PostHistory {
  date: string;
  preview: string;
  status: "sent" | "scheduled" | "draft";
}

interface PlatformConfig {
  id: Platform;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  schedule: string;
  days: string[];
  nextDrop: string;
  history: PostHistory[];
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: "facebook",
    name: "Facebook",
    icon: "f",
    color: "#4267B2",
    bgColor: "rgba(66,103,178,0.06)",
    borderColor: "rgba(66,103,178,0.3)",
    schedule: "MON + WED + FRI",
    days: ["MON", "WED", "FRI"],
    nextDrop: "Monday 8:00 AM",
    history: [
      { date: "Fri Jun 6", preview: "Service routes active. Brothers on the ground in West...", status: "sent" },
      { date: "Wed Jun 4", preview: "Wednesday training recap. 14 brothers showed up at 4am...", status: "sent" },
      { date: "Mon Jun 2", preview: "New week. New routes. New pledges under review...", status: "sent" },
      { date: "Fri May 30", preview: "Mākoa 1st Roundup — May 1–4, 2026. Kapolei. All...", status: "sent" },
      { date: "Wed May 28", preview: "Ice bath. Sauna. Brotherhood circle. No phones...", status: "sent" },
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "✈",
    color: PURPLE,
    bgColor: "rgba(167,139,250,0.06)",
    borderColor: "rgba(167,139,250,0.3)",
    schedule: "DAILY SIGNAL",
    days: ["MON", "TUE", "WED", "THU", "FRI"],
    nextDrop: "Tomorrow 6:00 AM",
    history: [
      { date: "Today 6am", preview: "808 SIGNAL · Active: 6 · Quiet: 2 · Silent: 0 · Routes...", status: "sent" },
      { date: "Yesterday 6am", preview: "808 SIGNAL · Wednesday training complete. 14 brothers...", status: "sent" },
      { date: "Tue 6am", preview: "808 SIGNAL · Route review complete. B2B pipeline...", status: "sent" },
      { date: "Mon 6am", preview: "808 SIGNAL · Week begins. Signal check complete...", status: "sent" },
      { date: "Fri 6am", preview: "808 SIGNAL · Week close. Steward dispatch sent...", status: "sent" },
    ],
  },
];

const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI"];

interface PlatformColumnProps {
  platform: PlatformConfig;
  activeBrothers: number;
  pendingPledges: number;
}

function PlatformColumn({ platform, activeBrothers, pendingPledges }: PlatformColumnProps) {
  const [draft, setDraft] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  async function generateWithXI() {
    setGenerating(true);
    const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

    const platformContext = {
      facebook: "community-focused, warm, service-oriented, local Hawaii pride",
      telegram: "direct signal drop, brief, operational, brotherhood pulse check",
    };

    const contextData = `Platform: ${platform.name}
Schedule: ${platform.schedule}
Active brothers: ${activeBrothers}
Pending pledges: ${pendingPledges}
Tone: ${platformContext[platform.id]}
Order: Mākoa — Hawaii brotherhood, service cooperative, warrior formation
Rules: NO DM · NO REPLY · DROP THE MARK · WALK AWAY`;

    if (!apiKey) {
      const fallbacks: Record<Platform, string> = {
        facebook: `Wednesday 4am. Ko Olina Beach. ${activeBrothers} brothers showed up.\\n\\nNo excuses. No phones. Just the work.\\n\\nThis is what Mākoa looks like.\\n\\n🌊⚔`,
        telegram: `808 SIGNAL · ${new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}\\n\\nActive: ${activeBrothers} · Pending: ${pendingPledges}\\nRoutes: ACTIVE · Training: WED 4AM\\n\\nDROP THE MARK · WALK AWAY`,
      };
      setDraft(fallbacks[platform.id]);
      setGenerating(false);
      return;
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system: `You are XI, the AI agent of the Mākoa Order. Generate a social media post for ${platform.name}. 
Rules: NO DM · NO REPLY · DROP THE MARK · WALK AWAY. 
Keep it under 150 words. Tone: ${platformContext[platform.id]}. 
Voice: direct, purposeful, warrior brotherhood. No fluff. No hashtag spam.`,
          messages: [{ role: "user", content: `Generate a ${platform.name} post using this data:\n\n${contextData}` }],
        }),
      });

      if (!response.ok) throw new Error(`API error ${response.status}`);
      const data = await response.json();
      setDraft(data?.content?.[0]?.text || "");
    } catch {
      setDraft("Error generating post. Check API key.");
    }

    setGenerating(false);
  }

  async function approveAndSchedule() {
    if (!draft.trim()) return;
    setSendError("");

    if (platform.id === "telegram") {
      setSending(true);
      try {
        const res = await fetch(
          "https://flzivjhxtbolcfaniskv.supabase.co/functions/v1/telegram-send",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: draft.trim() }),
          }
        );
        const data = await res.json();
        if (!data.ok) {
          setSendError(data.error || "Failed to send");
        } else {
          setSent(true);
          setDraft("");
          setTimeout(() => setSent(false), 4000);
        }
      } catch {
        setSendError("Network error. Try again.");
      }
      setSending(false);
    } else {
      // Facebook — copy to clipboard for manual posting
      try {
        await navigator.clipboard.writeText(draft.trim());
      } catch {
        // fallback: still show confirmation
      }
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }
  }

  const buttonLabel = () => {
    if (sending) return "SENDING TO TELEGRAM...";
    if (sent) return platform.id === "telegram" ? "✓ SENT TO TELEGRAM" : "✓ COPIED TO CLIPBOARD";
    return platform.id === "telegram" ? "⚡ SEND TO TELEGRAM" : "📋 COPY FOR FACEBOOK";
  };

  return (
    <div style={{
      background: platform.bgColor,
      border: `1px solid ${platform.borderColor}`,
      borderRadius: "12px",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}>
      {/* Platform header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "32px", height: "32px",
          background: platform.color,
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#000",
          fontSize: "0.7rem",
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {platform.icon}
        </div>
        <div>
          <p style={{ color: "#e8e0d0", fontSize: "0.6rem", lineHeight: 1 }}>{platform.name}</p>
          <p style={{ color: platform.color, fontSize: "0.38rem", letterSpacing: "0.12em", marginTop: "2px" }}>
            {platform.schedule}
          </p>
        </div>
      </div>

      {/* Next drop */}
      <div style={{
        background: "rgba(0,0,0,0.3)",
        borderRadius: "6px",
        padding: "8px 10px",
      }}>
        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem", letterSpacing: "0.12em", marginBottom: "2px" }}>
          NEXT DROP
        </p>
        <p style={{ color: platform.color, fontSize: "0.48rem" }}>{platform.nextDrop}</p>
      </div>

      {/* Week calendar */}
      <div>
        <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.36rem", letterSpacing: "0.12em", marginBottom: "6px" }}>
          SCHEDULE
        </p>
        <div style={{ display: "flex", gap: "4px" }}>
          {WEEK_DAYS.map(day => {
            const isActive = platform.days.includes(day);
            return (
              <div key={day} style={{
                flex: 1,
                textAlign: "center",
                padding: "5px 2px",
                background: isActive ? `${platform.color}15` : "rgba(0,0,0,0.2)",
                border: `1px solid ${isActive ? platform.color + "40" : "rgba(255,255,255,0.04)"}`,
                borderRadius: "4px",
              }}>
                <p style={{
                  color: isActive ? platform.color : "rgba(232,224,208,0.2)",
                  fontSize: "0.34rem",
                  letterSpacing: "0.05em",
                }}>
                  {day}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Draft area */}
      <div>
        <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.36rem", letterSpacing: "0.12em", marginBottom: "6px" }}>
          DRAFT CONTENT
        </p>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder={`Write ${platform.name} post or generate with XI...`}
          rows={5}
          style={{
            width: "100%",
            background: "rgba(0,0,0,0.4)",
            border: `1px solid ${platform.color}20`,
            borderRadius: "6px",
            color: "#e8e0d0",
            fontSize: "0.44rem",
            fontFamily: "'JetBrains Mono', monospace",
            padding: "10px",
            resize: "vertical",
            outline: "none",
            lineHeight: 1.7,
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <button
          onClick={generateWithXI}
          disabled={generating}
          style={{
            background: "transparent",
            border: `1px solid ${platform.color}40`,
            color: platform.color,
            fontSize: "0.42rem",
            letterSpacing: "0.15em",
            padding: "9px 12px",
            cursor: generating ? "not-allowed" : "pointer",
            borderRadius: "6px",
            fontFamily: "'JetBrains Mono', monospace",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            opacity: generating ? 0.6 : 1,
          }}
        >
          {generating ? (
            <>
              <div style={{ width: "10px", height: "10px", border: `1px solid ${platform.color}`, borderTop: "1px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              GENERATING...
            </>
          ) : (
            "⚡ GENERATE WITH XI"
          )}
        </button>

        <button
          onClick={approveAndSchedule}
          disabled={!draft.trim() || sending}
          style={{
            background: sent ? GREEN : draft.trim() && !sending ? GOLD : "transparent",
            border: `1px solid ${sent ? GREEN : draft.trim() ? GOLD : "rgba(176,142,80,0.2)"}`,
            color: sent ? "#fff" : draft.trim() && !sending ? "#000" : GOLD_DIM,
            fontSize: "0.42rem",
            letterSpacing: "0.15em",
            padding: "9px 12px",
            cursor: draft.trim() && !sending ? "pointer" : "not-allowed",
            borderRadius: "6px",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: draft.trim() ? 700 : 400,
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          {sending && (
            <div style={{ width: "10px", height: "10px", border: `1px solid #000`, borderTop: "1px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          )}
          {buttonLabel()}
        </button>
        {sendError && (
          <p style={{ color: "#f85149", fontSize: "0.38rem", textAlign: "center", margin: 0 }}>
            ⚠ {sendError}
          </p>
        )}
      </div>

      {/* Post history */}
      <div>
        <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.36rem", letterSpacing: "0.12em", marginBottom: "8px" }}>
          POST HISTORY
        </p>
        <div style={{ display: "grid", gap: "5px" }}>
          {platform.history.map((post, i) => (
            <div key={i} style={{
              background: "rgba(0,0,0,0.25)",
              borderRadius: "5px",
              padding: "7px 9px",
              borderLeft: `2px solid ${platform.color}30`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ color: platform.color, fontSize: "0.36rem" }}>{post.date}</span>
                <span style={{ color: GREEN, fontSize: "0.34rem" }}>✓ {post.status}</span>
              </div>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem", lineHeight: 1.4 }}>
                {post.preview}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SocialSchedulerTabProps {
  activeBrothers: number;
  pendingPledges: number;
}

export default function SocialSchedulerTab({ activeBrothers, pendingPledges }: SocialSchedulerTabProps) {
  return (
    <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "4px" }}>
          SOCIAL MEDIA SCHEDULER — XI POWERED
        </p>
        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.44rem", lineHeight: 1.6, marginBottom: "10px" }}>
          Schedule and generate posts across all platforms. XI drafts from live Supabase data.
        </p>

        {/* Rules banner */}
        <div style={{
          background: GOLD_FAINT,
          border: `1px solid rgba(176,142,80,0.2)`,
          borderRadius: "8px",
          padding: "10px 14px",
          textAlign: "center",
        }}>
          <p style={{
            color: GOLD,
            fontSize: "0.48rem",
            letterSpacing: "0.2em",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            NO DM · NO REPLY · DROP THE MARK · WALK AWAY
          </p>
        </div>
      </div>

      {/* Platform columns — stacked on mobile, 3-col on desktop */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(1, 1fr)",
        gap: "16px",
      }}>
        {PLATFORMS.map(platform => (
          <PlatformColumn
            key={platform.id}
            platform={platform}
            activeBrothers={activeBrothers}
            pendingPledges={pendingPledges}
          />
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: "20px",
        padding: "12px 16px",
        background: "rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.04)",
        borderRadius: "8px",
      }}>
        <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.4rem", lineHeight: 1.8, textAlign: "center" }}>
          LinkedIn: Tue + Thu · Facebook: Mon + Wed + Fri · Telegram: Daily 6am<br />
          <span style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.36rem" }}>
            XI generates and schedules all content. Review available in Command Center.
          </span>
        </p>
      </div>
    </div>
  );
}