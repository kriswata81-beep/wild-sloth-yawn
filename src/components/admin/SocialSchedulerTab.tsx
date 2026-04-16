"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SOCIAL_ACCOUNTS, type SocialPlatform } from "@/lib/constants";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.07)";
const GREEN = "#3fb950";
const RED = "#e05c5c";
const BLUE = "#58a6ff";
const AMBER = "#f0883e";
const TEXT = "rgba(232,224,208,0.78)";
const TEXT_DIM = "rgba(232,224,208,0.45)";

const PLATFORM_ORDER: SocialPlatform[] = ["facebook", "instagram", "tiktok", "youtube"];

interface SocialPost {
  id: string;
  platform: SocialPlatform;
  text: string;
  media_urls: string[];
  scheduled_for: string | null;
  status: "draft" | "scheduled" | "firing" | "fired" | "failed";
  fired_by: string | null;
  fired_at: string | null;
  blotato_submission_id: string | null;
  error_message: string | null;
  created_at: string;
  created_by: string;
}

interface BlotatoStatus {
  blotatoApiKey: "ACTIVE" | "AWAITING_BLOTATO_API_KEY";
  channels: Array<{
    platform: SocialPlatform;
    label: string;
    username: string;
    connected: boolean;
    accountId: string;
  }>;
}

const STATUS_COLOR: Record<SocialPost["status"], string> = {
  draft: TEXT_DIM,
  scheduled: BLUE,
  firing: AMBER,
  fired: GREEN,
  failed: RED,
};

const STATUS_LABEL: Record<SocialPost["status"], string> = {
  draft: "DRAFT",
  scheduled: "SCHEDULED",
  firing: "FIRING…",
  fired: "FIRED",
  failed: "FAILED",
};

export default function SocialSchedulerTab() {
  const [platform, setPlatform] = useState<SocialPlatform>("facebook");
  const [text, setText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<{ ok: boolean; msg: string } | null>(null);
  const [history, setHistory] = useState<SocialPost[]>([]);
  const [blotatoStatus, setBlotatoStatus] = useState<BlotatoStatus | null>(null);

  // Load Blotato connection status + post history
  const loadHistory = useCallback(async () => {
    const { data } = await supabase
      .from("social_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    setHistory((data || []) as SocialPost[]);
  }, []);

  useEffect(() => {
    fetch("/api/social/post")
      .then((r) => r.json())
      .then((d) => setBlotatoStatus(d))
      .catch(() => setBlotatoStatus(null));
    loadHistory();
    const id = setInterval(loadHistory, 15000);
    return () => clearInterval(id);
  }, [loadHistory]);

  const flashFor = (ms: number, payload: { ok: boolean; msg: string }) => {
    setFlash(payload);
    setTimeout(() => setFlash(null), ms);
  };

  async function postNow() {
    if (!text.trim()) return flashFor(3000, { ok: false, msg: "Text is empty" });
    setBusy(true);
    try {
      const res = await fetch("/api/social/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          text: text.trim(),
          mediaUrls: mediaUrl.trim() ? [mediaUrl.trim()] : [],
          createdBy: "steward",
          firedBy: "steward_manual",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        flashFor(6000, { ok: false, msg: data.error || `HTTP ${res.status}` });
      } else {
        flashFor(4000, { ok: true, msg: `Fired to ${platform} · ${data.blotatoSubmissionId}` });
        setText("");
        setMediaUrl("");
        loadHistory();
      }
    } catch (e) {
      flashFor(6000, { ok: false, msg: e instanceof Error ? e.message : "Network error" });
    }
    setBusy(false);
  }

  async function scheduleIt() {
    if (!text.trim()) return flashFor(3000, { ok: false, msg: "Text is empty" });
    if (!scheduledFor) return flashFor(3000, { ok: false, msg: "Pick a future time" });
    const when = new Date(scheduledFor);
    if (isNaN(when.getTime()) || when.getTime() <= Date.now() + 60000) {
      return flashFor(3000, { ok: false, msg: "Time must be at least 1 min in future" });
    }
    setBusy(true);
    try {
      const res = await fetch("/api/social/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          text: text.trim(),
          mediaUrls: mediaUrl.trim() ? [mediaUrl.trim()] : [],
          scheduledFor: when.toISOString(),
          createdBy: "steward",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        flashFor(6000, { ok: false, msg: data.error || `HTTP ${res.status}` });
      } else {
        flashFor(4000, { ok: true, msg: `Queued for ${when.toLocaleString()}` });
        setText("");
        setMediaUrl("");
        setScheduledFor("");
        loadHistory();
      }
    } catch (e) {
      flashFor(6000, { ok: false, msg: e instanceof Error ? e.message : "Network error" });
    }
    setBusy(false);
  }

  async function cancelScheduled(id: string) {
    if (!confirm("Cancel this scheduled post?")) return;
    const res = await fetch(`/api/social/schedule?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      flashFor(3000, { ok: true, msg: "Cancelled" });
      loadHistory();
    } else {
      flashFor(5000, { ok: false, msg: data.error || "Cancel failed" });
    }
  }

  const account = SOCIAL_ACCOUNTS[platform];

  return (
    <div style={{ padding: "20px 0" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.5rem", letterSpacing: "0.22em", marginBottom: 6 }}>
          SOCIAL — DROP & SCHEDULE
        </p>
        <p style={{ color: TEXT_DIM, fontSize: "0.78rem", lineHeight: 1.6 }}>
          Posts fire through Blotato to the connected order accounts. Steward composes here,
          XI ad-hoc from the terminal, Vercel cron drains the schedule queue daily.
        </p>
      </div>

      {/* Connection status */}
      <div
        style={{
          background: blotatoStatus?.blotatoApiKey === "ACTIVE" ? "rgba(63,185,80,0.06)" : "rgba(224,92,92,0.06)",
          border: `1px solid ${blotatoStatus?.blotatoApiKey === "ACTIVE" ? GREEN : RED}40`,
          borderRadius: 8,
          padding: "12px 14px",
          marginBottom: 18,
        }}
      >
        <p
          style={{
            color: blotatoStatus?.blotatoApiKey === "ACTIVE" ? GREEN : RED,
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            marginBottom: 8,
            fontWeight: 700,
          }}
        >
          {blotatoStatus?.blotatoApiKey === "ACTIVE" ? "● BLOTATO API · ACTIVE" : "⚠ BLOTATO_API_KEY MISSING"}
        </p>
        {blotatoStatus?.blotatoApiKey !== "ACTIVE" && (
          <p style={{ color: TEXT, fontSize: "0.72rem", lineHeight: 1.6 }}>
            Set <code style={{ color: GOLD }}>BLOTATO_API_KEY</code> in Vercel → Settings → Environment Variables, then redeploy.
            Until then posts will fail. Channels themselves are connected at my.blotato.com.
          </p>
        )}
        {blotatoStatus && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            {blotatoStatus.channels
              .filter((c) => PLATFORM_ORDER.includes(c.platform))
              .map((c) => (
                <span
                  key={c.platform}
                  style={{
                    fontSize: "0.65rem",
                    padding: "4px 10px",
                    borderRadius: 4,
                    border: `1px solid ${c.connected ? GREEN : RED}40`,
                    color: c.connected ? GREEN : RED,
                    letterSpacing: "0.1em",
                  }}
                >
                  {c.connected ? "✓" : "✗"} {c.label.toUpperCase()}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Compose */}
      <div
        style={{
          background: GOLD_FAINT,
          border: `1px solid ${GOLD_DIM}40`,
          borderRadius: 10,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <p style={{ color: GOLD_DIM, fontSize: "0.66rem", letterSpacing: "0.18em", marginBottom: 12 }}>
          COMPOSE
        </p>

        {/* Platform picker */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {PLATFORM_ORDER.map((p) => {
            const a = SOCIAL_ACCOUNTS[p];
            const active = platform === p;
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                disabled={!a.connected}
                style={{
                  padding: "8px 14px",
                  background: active ? a.color : "transparent",
                  color: active ? "#fff" : a.connected ? a.color : "rgba(232,224,208,0.25)",
                  border: `1px solid ${active ? a.color : "rgba(232,224,208,0.15)"}`,
                  borderRadius: 6,
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  fontWeight: 600,
                  cursor: a.connected ? "pointer" : "not-allowed",
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: "uppercase",
                  transition: "all 0.15s",
                }}
              >
                {a.label}
              </button>
            );
          })}
        </div>
        <p style={{ color: TEXT_DIM, fontSize: "0.66rem", marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" }}>
          → Posting as <span style={{ color: account.color }}>{account.username || "(not connected)"}</span>
        </p>

        {/* Text */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Drop the mark. No DMs. Walk away."
          style={{
            width: "100%",
            minHeight: 110,
            padding: 12,
            background: "#0a0d12",
            border: "1px solid rgba(232,224,208,0.12)",
            borderRadius: 6,
            color: TEXT,
            fontSize: "0.82rem",
            lineHeight: 1.6,
            fontFamily: "'JetBrains Mono', monospace",
            resize: "vertical",
            marginBottom: 10,
          }}
        />
        <p style={{ color: TEXT_DIM, fontSize: "0.66rem", marginBottom: 12, textAlign: "right" }}>
          {text.length} chars
        </p>

        {/* Media URL */}
        <input
          type="url"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="Optional: media URL (image or video, public)"
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#0a0d12",
            border: "1px solid rgba(232,224,208,0.12)",
            borderRadius: 6,
            color: TEXT,
            fontSize: "0.74rem",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 12,
          }}
        />

        {/* Schedule time */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
          <p style={{ color: TEXT_DIM, fontSize: "0.7rem", letterSpacing: "0.1em" }}>
            SCHEDULE FOR (optional):
          </p>
          <input
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            style={{
              padding: "8px 10px",
              background: "#0a0d12",
              border: "1px solid rgba(232,224,208,0.12)",
              borderRadius: 6,
              color: TEXT,
              fontSize: "0.72rem",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />
          {scheduledFor && (
            <button
              onClick={() => setScheduledFor("")}
              style={{
                padding: "6px 10px",
                background: "transparent",
                color: TEXT_DIM,
                border: "1px solid rgba(232,224,208,0.15)",
                borderRadius: 4,
                fontSize: "0.66rem",
                cursor: "pointer",
              }}
            >
              ✕ clear
            </button>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={postNow}
            disabled={busy || !text.trim() || !account.connected}
            style={{
              flex: "1 1 200px",
              padding: "14px 20px",
              background: account.color,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: "0.78rem",
              letterSpacing: "0.16em",
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: busy || !text.trim() ? "not-allowed" : "pointer",
              opacity: busy || !text.trim() ? 0.4 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {busy ? "FIRING…" : `▲ POST NOW → ${account.label.toUpperCase()}`}
          </button>
          <button
            onClick={scheduleIt}
            disabled={busy || !text.trim() || !scheduledFor || !account.connected}
            style={{
              flex: "1 1 200px",
              padding: "14px 20px",
              background: "transparent",
              color: GOLD,
              border: `1px solid ${GOLD}`,
              borderRadius: 6,
              fontSize: "0.78rem",
              letterSpacing: "0.16em",
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: busy || !text.trim() || !scheduledFor ? "not-allowed" : "pointer",
              opacity: busy || !text.trim() || !scheduledFor ? 0.4 : 1,
              transition: "opacity 0.15s",
            }}
          >
            ⏱ SCHEDULE
          </button>
        </div>

        {flash && (
          <p
            style={{
              marginTop: 12,
              color: flash.ok ? GREEN : RED,
              fontSize: "0.72rem",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {flash.ok ? "✓" : "⚠"} {flash.msg}
          </p>
        )}
      </div>

      {/* History */}
      <div>
        <p style={{ color: GOLD_DIM, fontSize: "0.66rem", letterSpacing: "0.18em", marginBottom: 12 }}>
          RECENT POSTS · LAST 30
        </p>
        {history.length === 0 && (
          <p style={{ color: TEXT_DIM, fontSize: "0.74rem", padding: "16px 0" }}>
            No posts yet. Compose one above.
          </p>
        )}
        <div style={{ display: "grid", gap: 8 }}>
          {history.map((p) => {
            const account = SOCIAL_ACCOUNTS[p.platform];
            const time = p.scheduled_for
              ? new Date(p.scheduled_for).toLocaleString()
              : new Date(p.created_at).toLocaleString();
            return (
              <div
                key={p.id}
                style={{
                  background: "#0a0d12",
                  border: `1px solid rgba(232,224,208,0.06)`,
                  borderLeft: `3px solid ${account?.color || GOLD}`,
                  borderRadius: 6,
                  padding: "12px 14px",
                  display: "grid",
                  gap: 6,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ color: account?.color || GOLD, fontSize: "0.7rem", letterSpacing: "0.12em", fontWeight: 700 }}>
                    {(account?.label || p.platform).toUpperCase()}
                  </span>
                  <span style={{ color: STATUS_COLOR[p.status], fontSize: "0.66rem", letterSpacing: "0.14em", fontWeight: 600 }}>
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
                <p style={{ color: TEXT, fontSize: "0.78rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                  {p.text.length > 220 ? p.text.slice(0, 220) + "…" : p.text}
                </p>
                {p.media_urls && p.media_urls.length > 0 && (
                  <p style={{ color: TEXT_DIM, fontSize: "0.66rem" }}>
                    📎 {p.media_urls.length} media
                  </p>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ color: TEXT_DIM, fontSize: "0.66rem" }}>
                    {p.scheduled_for ? `for ${time}` : time} · by {p.created_by || "—"}
                    {p.fired_by ? ` · fired by ${p.fired_by}` : ""}
                  </span>
                  {p.status === "scheduled" && (
                    <button
                      onClick={() => cancelScheduled(p.id)}
                      style={{
                        padding: "4px 10px",
                        background: "transparent",
                        color: RED,
                        border: `1px solid ${RED}40`,
                        borderRadius: 4,
                        fontSize: "0.62rem",
                        cursor: "pointer",
                        letterSpacing: "0.1em",
                      }}
                    >
                      ✕ CANCEL
                    </button>
                  )}
                </div>
                {p.error_message && (
                  <p style={{ color: RED, fontSize: "0.7rem", lineHeight: 1.5 }}>
                    {p.error_message}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div
        style={{
          marginTop: 20,
          padding: "12px 14px",
          background: "rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: 6,
        }}
      >
        <p style={{ color: TEXT_DIM, fontSize: "0.66rem", lineHeight: 1.6 }}>
          <span style={{ color: GOLD }}>NOTE:</span> Vercel Hobby plan only allows daily crons —
          scheduled posts fire once per day at 08:05 UTC. For 15-minute granularity, upgrade to
          Vercel Pro or hit{" "}
          <code style={{ color: GOLD }}>/api/cron/post-scheduled</code> from an external cron
          (cron-job.org free tier) with the <code>CRON_SECRET</code> bearer.
        </p>
      </div>
    </div>
  );
}
