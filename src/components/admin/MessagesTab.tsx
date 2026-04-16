"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.07)";
const GREEN = "#3fb950";
const RED = "#e05c5c";
const BLUE = "#58a6ff";
const AMBER = "#f0883e";
const PURPLE = "#bc8cff";
const TEXT = "rgba(232,224,208,0.78)";
const TEXT_DIM = "rgba(232,224,208,0.45)";

interface InboundMessage {
  id: string;
  twilio_message_sid: string | null;
  from_number: string;
  to_number: string | null;
  body: string;
  num_media: number;
  media_urls: string[];
  intent:
    | "gate_inquiry"
    | "sponsor_inquiry"
    | "crisis"
    | "spam"
    | "needs_human"
    | "other"
    | "unscreened";
  severity: "normal" | "crisis";
  classification_confidence: number | null;
  classification_reason: string | null;
  auto_replied: boolean;
  auto_reply_body: string | null;
  auto_reply_sent_at: string | null;
  handled_by: string | null;
  handled_at: string | null;
  steward_reply_body: string | null;
  steward_reply_sent_at: string | null;
  telegram_paged: boolean;
  telegram_paged_at: string | null;
  created_at: string;
}

interface SmsStatus {
  twilio: "ACTIVE" | "AWAITING_TWILIO_CREDS";
  classifier: "ACTIVE" | "AWAITING_ANTHROPIC_API_KEY";
  phoneNumber: string | null;
  webhookUrl: string;
}

const INTENT_COLOR: Record<InboundMessage["intent"], string> = {
  gate_inquiry: GREEN,
  sponsor_inquiry: BLUE,
  crisis: RED,
  spam: TEXT_DIM,
  needs_human: AMBER,
  other: PURPLE,
  unscreened: TEXT_DIM,
};

const INTENT_LABEL: Record<InboundMessage["intent"], string> = {
  gate_inquiry: "GATE",
  sponsor_inquiry: "SPONSOR",
  crisis: "🚨 CRISIS",
  spam: "SPAM",
  needs_human: "NEEDS HUMAN",
  other: "OTHER",
  unscreened: "UNSCREENED",
};

export default function MessagesTab() {
  const [status, setStatus] = useState<SmsStatus | null>(null);
  const [messages, setMessages] = useState<InboundMessage[]>([]);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ ok: boolean; msg: string } | null>(null);

  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from("inbound_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setMessages((data || []) as InboundMessage[]);
  }, []);

  useEffect(() => {
    fetch("/api/sms/inbound")
      .then((r) => r.json())
      .then((d) => setStatus(d))
      .catch(() => setStatus(null));
    loadMessages();
    const id = setInterval(loadMessages, 15000);
    return () => clearInterval(id);
  }, [loadMessages]);

  const flashFor = (ms: number, payload: { ok: boolean; msg: string }) => {
    setFlash(payload);
    setTimeout(() => setFlash(null), ms);
  };

  async function sendReply(inboundId: string) {
    const body = replyDrafts[inboundId]?.trim();
    if (!body) return flashFor(3000, { ok: false, msg: "Reply body empty" });
    setSending(inboundId);
    try {
      const res = await fetch("/api/sms/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inboundId, body }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        flashFor(6000, { ok: false, msg: data.error || `HTTP ${res.status}` });
      } else {
        flashFor(4000, { ok: true, msg: `Reply sent · ${data.twilioMessageSid}` });
        setReplyDrafts((p) => ({ ...p, [inboundId]: "" }));
        loadMessages();
      }
    } catch (e) {
      flashFor(6000, { ok: false, msg: e instanceof Error ? e.message : "Network error" });
    }
    setSending(null);
  }

  const crisisMessages = messages.filter((m) => m.severity === "crisis");
  const unhandledMessages = messages.filter(
    (m) => !m.handled_by || m.handled_by === "unhandled" || m.handled_by === "xi_auto"
  );
  const allMessages = messages;

  return (
    <div style={{ padding: "20px 0" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <p
          style={{
            color: GOLD_DIM,
            fontSize: "0.5rem",
            letterSpacing: "0.22em",
            marginBottom: 6,
          }}
        >
          MESSAGES — INBOUND SMS
        </p>
        <p style={{ color: TEXT_DIM, fontSize: "0.78rem", lineHeight: 1.6 }}>
          Inbound texts to the Mākoa number. XI screens, classifies, auto-replies, escalates
          crisis to Telegram. Steward replies manually below for needs-human cases.
        </p>
      </div>

      {/* Connection status */}
      <div
        style={{
          background:
            status?.twilio === "ACTIVE" ? "rgba(63,185,80,0.06)" : "rgba(224,92,92,0.06)",
          border: `1px solid ${status?.twilio === "ACTIVE" ? GREEN : RED}40`,
          borderRadius: 8,
          padding: "12px 14px",
          marginBottom: 18,
        }}
      >
        <p
          style={{
            color: status?.twilio === "ACTIVE" ? GREEN : RED,
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            marginBottom: 8,
            fontWeight: 700,
          }}
        >
          {status?.twilio === "ACTIVE"
            ? `● TWILIO · ACTIVE · ${status.phoneNumber}`
            : "⚠ TWILIO_* env vars missing — see below"}
        </p>
        {status?.twilio !== "ACTIVE" && (
          <div style={{ color: TEXT, fontSize: "0.72rem", lineHeight: 1.7 }}>
            <p style={{ marginBottom: 8 }}>To enable inbound SMS:</p>
            <ol style={{ paddingLeft: 18, marginBottom: 8 }}>
              <li>Sign up / log in at <code style={{ color: GOLD }}>twilio.com</code></li>
              <li>Buy a phone number (808 area code recommended for Hawaiʻi)</li>
              <li>
                Add <code style={{ color: GOLD }}>TWILIO_ACCOUNT_SID</code>,{" "}
                <code style={{ color: GOLD }}>TWILIO_AUTH_TOKEN</code>,{" "}
                <code style={{ color: GOLD }}>TWILIO_PHONE_NUMBER</code> to Vercel env
              </li>
              <li>
                In Twilio console → Phone Numbers → your number → Messaging webhook → POST{" "}
                <code style={{ color: GOLD }}>https://www.makoa.live/api/sms/inbound</code>
              </li>
              <li>
                Apply{" "}
                <code style={{ color: GOLD }}>supabase_migration_inbound_messages.sql</code>{" "}
                in Supabase SQL editor
              </li>
              <li>Redeploy Vercel to pick up the new env vars</li>
            </ol>
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: "0.65rem",
              padding: "4px 10px",
              borderRadius: 4,
              border: `1px solid ${status?.classifier === "ACTIVE" ? GREEN : AMBER}40`,
              color: status?.classifier === "ACTIVE" ? GREEN : AMBER,
              letterSpacing: "0.1em",
            }}
          >
            {status?.classifier === "ACTIVE" ? "✓ XI CLASSIFIER" : "⚠ ANTHROPIC_API_KEY missing"}
          </span>
        </div>
      </div>

      {flash && (
        <p
          style={{
            marginBottom: 16,
            color: flash.ok ? GREEN : RED,
            fontSize: "0.72rem",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {flash.ok ? "✓" : "⚠"} {flash.msg}
        </p>
      )}

      {/* Crisis bucket */}
      {crisisMessages.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              color: RED,
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              marginBottom: 12,
              fontWeight: 700,
            }}
          >
            🚨 CRISIS · ACT NOW · {crisisMessages.length}
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {crisisMessages.map((m) => (
              <MessageCard
                key={m.id}
                message={m}
                replyDrafts={replyDrafts}
                setReplyDrafts={setReplyDrafts}
                sendReply={sendReply}
                sending={sending}
              />
            ))}
          </div>
        </div>
      )}

      {/* Unhandled queue */}
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            color: GOLD_DIM,
            fontSize: "0.66rem",
            letterSpacing: "0.18em",
            marginBottom: 12,
          }}
        >
          {unhandledMessages.length > 0
            ? `INBOX · ${unhandledMessages.length} unhandled / xi_auto`
            : "INBOX · all clear"}
        </p>
        {unhandledMessages.length === 0 && allMessages.length === 0 && (
          <p style={{ color: TEXT_DIM, fontSize: "0.74rem", padding: "16px 0" }}>
            No messages yet. Once Twilio is wired and someone texts your number, they'll
            appear here.
          </p>
        )}
        <div style={{ display: "grid", gap: 10 }}>
          {unhandledMessages
            .filter((m) => m.severity !== "crisis")
            .map((m) => (
              <MessageCard
                key={m.id}
                message={m}
                replyDrafts={replyDrafts}
                setReplyDrafts={setReplyDrafts}
                sendReply={sendReply}
                sending={sending}
              />
            ))}
        </div>
      </div>

      {/* All recent (collapsed) */}
      {allMessages.length > unhandledMessages.length && (
        <details>
          <summary
            style={{
              color: GOLD_DIM,
              fontSize: "0.66rem",
              letterSpacing: "0.18em",
              marginBottom: 12,
              cursor: "pointer",
            }}
          >
            FULL HISTORY · last 50 ({allMessages.length})
          </summary>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {allMessages.map((m) => (
              <MessageCard
                key={m.id}
                message={m}
                replyDrafts={replyDrafts}
                setReplyDrafts={setReplyDrafts}
                sendReply={sendReply}
                sending={sending}
                compact
              />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

interface MessageCardProps {
  message: InboundMessage;
  replyDrafts: Record<string, string>;
  setReplyDrafts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  sendReply: (id: string) => void;
  sending: string | null;
  compact?: boolean;
}

function MessageCard({
  message: m,
  replyDrafts,
  setReplyDrafts,
  sendReply,
  sending,
  compact,
}: MessageCardProps) {
  const intentColor = INTENT_COLOR[m.intent];
  return (
    <div
      style={{
        background: "#0a0d12",
        border: `1px solid rgba(232,224,208,0.06)`,
        borderLeft: `3px solid ${m.severity === "crisis" ? RED : intentColor}`,
        borderRadius: 6,
        padding: "12px 14px",
        display: "grid",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            color: TEXT,
            fontSize: "0.72rem",
            fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {m.from_number}
        </span>
        <span
          style={{
            color: intentColor,
            fontSize: "0.66rem",
            letterSpacing: "0.14em",
            fontWeight: 600,
          }}
        >
          {INTENT_LABEL[m.intent]}
          {m.classification_confidence != null && (
            <span style={{ opacity: 0.5, marginLeft: 6 }}>
              ({Math.round(m.classification_confidence * 100)}%)
            </span>
          )}
        </span>
      </div>
      <p
        style={{
          color: TEXT,
          fontSize: "0.78rem",
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
        }}
      >
        {m.body}
      </p>
      {m.classification_reason && !compact && (
        <p style={{ color: TEXT_DIM, fontSize: "0.66rem", fontStyle: "italic" }}>
          XI: {m.classification_reason}
        </p>
      )}
      {m.auto_reply_body && (
        <div
          style={{
            background: "rgba(63,185,80,0.05)",
            border: `1px solid ${GREEN}25`,
            borderRadius: 4,
            padding: "8px 10px",
          }}
        >
          <p style={{ color: GREEN, fontSize: "0.66rem", letterSpacing: "0.12em", marginBottom: 4 }}>
            ↳ AUTO-REPLY (XI)
          </p>
          <p style={{ color: TEXT, fontSize: "0.74rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
            {m.auto_reply_body}
          </p>
        </div>
      )}
      {m.steward_reply_body && (
        <div
          style={{
            background: "rgba(176,142,80,0.05)",
            border: `1px solid ${GOLD_DIM}40`,
            borderRadius: 4,
            padding: "8px 10px",
          }}
        >
          <p style={{ color: GOLD, fontSize: "0.66rem", letterSpacing: "0.12em", marginBottom: 4 }}>
            ↳ STEWARD REPLY
          </p>
          <p style={{ color: TEXT, fontSize: "0.74rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
            {m.steward_reply_body}
          </p>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: TEXT_DIM, fontSize: "0.66rem" }}>
          {new Date(m.created_at).toLocaleString()} · handled by {m.handled_by || "—"}
          {m.telegram_paged ? " · 📲 Telegram paged" : ""}
        </span>
      </div>
      {/* Inline reply box for un-steward-replied messages */}
      {!compact && !m.steward_reply_body && (
        <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
          <textarea
            value={replyDrafts[m.id] || ""}
            onChange={(e) => setReplyDrafts((p) => ({ ...p, [m.id]: e.target.value }))}
            placeholder="Type Steward reply…"
            style={{
              flex: 1,
              minHeight: 60,
              padding: 10,
              background: "#04060a",
              border: `1px solid ${GOLD_DIM}30`,
              borderRadius: 4,
              color: TEXT,
              fontSize: "0.74rem",
              lineHeight: 1.5,
              fontFamily: "'JetBrains Mono', monospace",
              resize: "vertical",
            }}
          />
          <button
            onClick={() => sendReply(m.id)}
            disabled={sending === m.id || !(replyDrafts[m.id] || "").trim()}
            style={{
              padding: "10px 14px",
              background: GOLD,
              color: "#000",
              border: "none",
              borderRadius: 4,
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: sending === m.id ? "not-allowed" : "pointer",
              opacity: sending === m.id || !(replyDrafts[m.id] || "").trim() ? 0.4 : 1,
              minWidth: 100,
            }}
          >
            {sending === m.id ? "SENDING…" : "▲ SEND"}
          </button>
        </div>
      )}
    </div>
  );
}
