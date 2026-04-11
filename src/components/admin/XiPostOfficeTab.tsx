"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.08)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const RED = "#e05c5c";

type MailLog = {
  id: string;
  timestamp: string;
  template: string;
  to: string;
  subject: string;
  status: "sent" | "failed" | "queued";
};

const TEMPLATES = [
  { id: "sponsor_notify", name: "Sponsor Notification", desc: "Sent to a brother when someone sponsors them", icon: "🎁" },
  { id: "welcome_pledge", name: "Welcome Pledge", desc: "Sent when a new brother walks through the gate", icon: "🚪" },
  { id: "mayday_confirm", name: "MAYDAY Confirmation", desc: "Sent when a MAYDAY ticket is purchased", icon: "🎫" },
  { id: "dinner_reservation", name: "Dinner Reservation", desc: "XI sends to restaurants for group bookings", icon: "🍽️" },
  { id: "hotel_block", name: "Hotel Block Request", desc: "XI sends to hotels for group room blocks", icon: "🏨" },
];

export default function XiPostOfficeTab() {
  const [view, setView] = useState<"compose" | "templates" | "outbox">("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [mailLog] = useState<MailLog[]>([]);

  // Compose form state
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  // Template data fields
  const [templateData, setTemplateData] = useState<Record<string, string>>({});
  const [templateTo, setTemplateTo] = useState("");

  const inputStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(176,142,80,0.15)",
    color: "#e8e0d0",
    padding: "8px 12px",
    borderRadius: "4px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.48rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  async function sendTemplate() {
    if (!templateTo || !selectedTemplate) return;
    setSending(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/xi-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: selectedTemplate,
          to: templateTo,
          data: templateData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLastResult(`✓ Sent via template "${selectedTemplate}" to ${templateTo}`);
        setTemplateTo("");
        setTemplateData({});
      } else {
        setLastResult(`✕ Failed: ${data.error || "Unknown error"}`);
      }
    } catch {
      setLastResult("✕ Connection error");
    }
    setSending(false);
  }

  async function sendCustom() {
    if (!composeTo || !composeSubject) return;
    setSending(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/xi-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: composeTo,
          subject: composeSubject,
          html: `<div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:24px;color:#333;">${composeBody.replace(/\n/g, "<br/>")}</div>`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLastResult(`✓ Sent to ${composeTo}`);
        setComposeTo("");
        setComposeSubject("");
        setComposeBody("");
      } else {
        setLastResult(`✕ Failed: ${data.error || "Unknown error"}`);
      }
    } catch {
      setLastResult("✕ Connection error");
    }
    setSending(false);
  }

  const templateFields: Record<string, string[]> = {
    sponsor_notify: ["brother_name", "sponsor_relation", "ticket_type", "message"],
    welcome_pledge: ["name"],
    mayday_confirm: ["name", "ticket_type"],
    dinner_reservation: ["date", "time", "party_size", "type", "contact_name", "contact_phone"],
    hotel_block: ["checkin", "checkout", "rooms", "location", "contact_name"],
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}>
        <div>
          <p style={{ color: GOLD, fontSize: "0.55rem", letterSpacing: "0.2em" }}>XI POST OFFICE</p>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem", marginTop: "4px" }}>
            xi@makoaorder.com · {process.env.NEXT_PUBLIC_RESEND_STATUS === "active" ? "ACTIVE" : "AWAITING DOMAIN"}
          </p>
        </div>
        <div style={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
        }}>
          <div style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: GREEN,
            animation: "pulse 2s ease infinite",
          }} />
          <span style={{ color: GREEN, fontSize: "0.38rem", letterSpacing: "0.1em" }}>XI CORE</span>
        </div>
      </div>

      {/* View Toggle */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[
          { key: "templates", label: "TEMPLATES" },
          { key: "compose", label: "COMPOSE" },
          { key: "outbox", label: "OUTBOX" },
        ].map(v => (
          <button
            key={v.key}
            onClick={() => setView(v.key as typeof view)}
            style={{
              background: view === v.key ? "rgba(176,142,80,0.12)" : "transparent",
              border: `1px solid ${view === v.key ? GOLD + "40" : "rgba(176,142,80,0.1)"}`,
              color: view === v.key ? GOLD : GOLD_DIM,
              fontSize: "0.38rem",
              letterSpacing: "0.12em",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >{v.label}</button>
        ))}
      </div>

      {/* Result banner */}
      {lastResult && (
        <div style={{
          padding: "10px 14px",
          background: lastResult.startsWith("✓") ? "rgba(63,185,80,0.08)" : "rgba(224,92,92,0.08)",
          border: `1px solid ${lastResult.startsWith("✓") ? GREEN + "30" : RED + "30"}`,
          borderRadius: "6px",
          marginBottom: "16px",
          color: lastResult.startsWith("✓") ? GREEN : RED,
          fontSize: "0.42rem",
        }}>
          {lastResult}
        </div>
      )}

      {/* TEMPLATES VIEW */}
      {view === "templates" && (
        <div style={{ display: "grid", gap: "10px" }}>
          {TEMPLATES.map(t => (
            <div key={t.id} style={{
              background: GOLD_FAINT,
              border: `1px solid ${selectedTemplate === t.id ? GOLD + "30" : "rgba(176,142,80,0.08)"}`,
              borderRadius: "8px",
              padding: "16px",
              cursor: "pointer",
              transition: "border-color 0.2s",
            }} onClick={() => setSelectedTemplate(selectedTemplate === t.id ? null : t.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "1rem" }}>{t.icon}</span>
                  <div>
                    <p style={{ color: GOLD, fontSize: "0.48rem", letterSpacing: "0.1em" }}>{t.name}</p>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", marginTop: "2px" }}>{t.desc}</p>
                  </div>
                </div>
                <span style={{ color: GOLD_DIM, fontSize: "0.36rem" }}>{t.id}</span>
              </div>

              {/* Expanded template form */}
              {selectedTemplate === t.id && (
                <div style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid rgba(176,142,80,0.08)",
                }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: "grid", gap: "8px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.1em", display: "block", marginBottom: "4px" }}>TO (email)</label>
                      <input
                        style={inputStyle}
                        placeholder="recipient@email.com"
                        value={templateTo}
                        onChange={e => setTemplateTo(e.target.value)}
                      />
                    </div>
                    {(templateFields[t.id] || []).map(field => (
                      <div key={field}>
                        <label style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.1em", display: "block", marginBottom: "4px" }}>
                          {field.replace(/_/g, " ").toUpperCase()}
                        </label>
                        <input
                          style={inputStyle}
                          placeholder={field.replace(/_/g, " ")}
                          value={templateData[field] || ""}
                          onChange={e => setTemplateData({ ...templateData, [field]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={sendTemplate}
                    disabled={sending || !templateTo}
                    style={{
                      width: "100%",
                      background: sending ? "transparent" : "rgba(176,142,80,0.1)",
                      border: `1px solid ${GOLD}40`,
                      color: GOLD,
                      fontSize: "0.42rem",
                      letterSpacing: "0.2em",
                      padding: "10px",
                      cursor: sending ? "wait" : "pointer",
                      fontFamily: "'JetBrains Mono', monospace",
                      borderRadius: "4px",
                      opacity: !templateTo ? 0.4 : 1,
                    }}
                  >
                    {sending ? "SENDING..." : "SEND VIA XI"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* COMPOSE VIEW */}
      {view === "compose" && (
        <div style={{
          background: GOLD_FAINT,
          border: "1px solid rgba(176,142,80,0.08)",
          borderRadius: "8px",
          padding: "20px",
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.2em", marginBottom: "14px" }}>
            COMPOSE — FROM: XI &lt;xi@makoaorder.com&gt;
          </p>
          <div style={{ display: "grid", gap: "10px", marginBottom: "16px" }}>
            <div>
              <label style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.1em", display: "block", marginBottom: "4px" }}>TO</label>
              <input style={inputStyle} placeholder="recipient@email.com" value={composeTo} onChange={e => setComposeTo(e.target.value)} />
            </div>
            <div>
              <label style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.1em", display: "block", marginBottom: "4px" }}>SUBJECT</label>
              <input style={inputStyle} placeholder="Subject line" value={composeSubject} onChange={e => setComposeSubject(e.target.value)} />
            </div>
            <div>
              <label style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.1em", display: "block", marginBottom: "4px" }}>BODY</label>
              <textarea
                style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
                placeholder="Write your message..."
                value={composeBody}
                onChange={e => setComposeBody(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={sendCustom}
            disabled={sending || !composeTo || !composeSubject}
            style={{
              width: "100%",
              background: sending ? "transparent" : "rgba(176,142,80,0.1)",
              border: `1px solid ${GOLD}40`,
              color: GOLD,
              fontSize: "0.42rem",
              letterSpacing: "0.2em",
              padding: "10px",
              cursor: sending ? "wait" : "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              borderRadius: "4px",
              opacity: (!composeTo || !composeSubject) ? 0.4 : 1,
            }}
          >
            {sending ? "SENDING..." : "SEND"}
          </button>
        </div>
      )}

      {/* OUTBOX VIEW */}
      {view === "outbox" && (
        <div>
          {mailLog.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "40px 20px",
              background: GOLD_FAINT,
              borderRadius: "8px",
              border: "1px solid rgba(176,142,80,0.06)",
            }}>
              <p style={{ color: GOLD, fontSize: "0.55rem", marginBottom: "8px" }}>No outbound mail yet</p>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", lineHeight: 1.6 }}>
                Mail sent through XI will appear here.<br />
                Templates auto-log. Custom mail auto-logs.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "8px" }}>
              {mailLog.map(m => (
                <div key={m.id} style={{
                  background: GOLD_FAINT,
                  border: "1px solid rgba(176,142,80,0.08)",
                  borderRadius: "6px",
                  padding: "12px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div>
                    <p style={{ color: "#e8e0d0", fontSize: "0.48rem" }}>{m.subject}</p>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", marginTop: "2px" }}>
                      → {m.to} · {m.template} · {m.timestamp}
                    </p>
                  </div>
                  <span style={{
                    color: m.status === "sent" ? GREEN : m.status === "failed" ? RED : BLUE,
                    fontSize: "0.36rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}>{m.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* XI Agent Info */}
      <div style={{
        marginTop: "24px",
        background: GOLD_FAINT,
        border: "1px solid rgba(176,142,80,0.06)",
        borderRadius: "8px",
        padding: "16px",
      }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.2em", marginBottom: "10px" }}>XI CORE · MAIL AGENTS</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {[
            { name: "ALPHA", role: "Strategy — outreach, partnerships, hotel/venue comms", status: "ready" },
            { name: "ECHO", role: "Marketing — sponsor notifications, drip sequences", status: "ready" },
            { name: "OMEGA", role: "Operations — confirmations, logistics, scheduling", status: "ready" },
          ].map(agent => (
            <div key={agent.name} style={{
              background: "rgba(0,0,0,0.3)",
              borderRadius: "4px",
              padding: "10px",
            }}>
              <div style={{ display: "flex", gap: "4px", alignItems: "center", marginBottom: "4px" }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: GREEN }} />
                <span style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.1em" }}>{agent.name}</span>
              </div>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.35rem", lineHeight: 1.4 }}>{agent.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
