"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";
const GREEN_10 = "rgba(63,185,80,0.1)";
const BG = "#04060a";

// What MAYDAY is — in language Gary Vee's brain decodes instantly
const PROOF_POINTS = [
  { n: "7G", label: "Net levels", desc: "Nā Koa → Mana → Aliʻi. Land routes, sea routes, air routes. Not metaphors. Real territory." },
  { n: "80%", label: "To the operator", desc: "Every job on the route. 10% to the house. 10% to the order. No middleman. No corporation. Transparent split." },
  { n: "1,000", label: "Mana Steward seats", desc: "Worldwide. First 100 are Founders. One per zip cluster. B2C territory locked to that brother forever." },
  { n: "4AM", label: "Wednesday calls", desc: "Global. Every week. Brothers from every continent. No agenda handed down. Just men who chose to show up." },
  { n: "90", label: "Day live-in path", desc: "Mana → live in the house → manage the Trade Co → complete day 90 → Aliʻi elevation. Non-negotiable." },
  { n: "May 31", label: "Blue Moon founding", desc: "Second full moon of May. Co-Founders Charter sealed. Every house worldwide founded on the same night." },
];

const MAY_WEEKEND = [
  { date: "May 1–4", label: "Weekend 1", desc: "Opening fire. First arrivals. War Room begins. 4AM Wednesday global call." },
  { date: "May 8–11", label: "Weekend 2", desc: "Elite reset training. Nakoa Trade Academy live sessions. Small groups." },
  { date: "May 15–18", label: "Weekend 3", desc: "Team leader mastermind. B2B route planning. Ambassador seated." },
  { date: "May 22–25", label: "Weekend 4", desc: "Co-founder dinners. Final war room. Charter documents prepared." },
  { date: "May 29–31", label: "BLUE MOON FOUNDING", desc: "Co-Founders Founding. The charter is sealed. The stone is placed. The order is founded.", highlight: true },
];

export default function VipPage() {
  const [ready, setReady] = useState(false);
  const [interest, setInterest] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    setSending(true);
    try {
      await fetch("/api/yard-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone: email, address: interest || "VIP invite response",
          zip: "VIP", service: "vip_mayday_invite",
          notes: `VIP MAYDAY response — ${name} / ${email} / "${interest}"`,
          source: "vip_page", timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {}
    setSending(false);
    setSent(true);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      fontFamily: "'JetBrains Mono', monospace",
      padding: "48px 20px 80px",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        input, textarea { outline: none; }
        input:focus, textarea:focus { border-color: rgba(176,142,80,0.35) !important; }
      `}</style>

      <div style={{
        maxWidth: "480px",
        margin: "0 auto",
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}>

        {/* Private tag */}
        <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.38rem", letterSpacing: "0.25em", marginBottom: "32px" }}>
          PRIVATE · MĀKOA ORDER · NOT LISTED
        </p>

        {/* Opening */}
        <p style={{ color: GOLD_40, fontSize: "0.44rem", letterSpacing: "0.2em", marginBottom: "14px" }}>
          AN INVITE — NOT A PITCH
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "2.4rem",
          color: GOLD,
          margin: "0 0 20px",
          fontWeight: 300,
          lineHeight: 1.2,
        }}>
          MAYDAY.<br />West Oahu.<br />May 2026.
        </h1>

        <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.5rem", lineHeight: 1.9, marginBottom: "14px" }}>
          You've been talking about real community, local business, and men who actually show up — for years.
        </p>
        <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.5rem", lineHeight: 1.9, marginBottom: "14px" }}>
          We built it. In Hawaii. With routes, territory, trade, and a law of the house.
        </p>
        <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.5rem", lineHeight: 1.9, marginBottom: "32px" }}>
          This page was built for you to see what we built — before you decide if you want to witness the founding.
        </p>

        <div style={{ height: "1px", background: GOLD_20, marginBottom: "32px" }} />

        {/* What It Is */}
        <p style={{ color: GOLD_40, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "16px" }}>
          WHAT THIS IS
        </p>
        <div style={{ display: "grid", gap: "12px", marginBottom: "32px" }}>
          {PROOF_POINTS.map((p, i) => (
            <div key={i} style={{
              display: "flex",
              gap: "16px",
              padding: "14px",
              background: "rgba(176,142,80,0.03)",
              border: "1px solid rgba(176,142,80,0.08)",
              borderRadius: "6px",
              alignItems: "flex-start",
            }}>
              <div style={{ flexShrink: 0, minWidth: "44px" }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: GOLD,
                  fontSize: "1.4rem",
                  fontWeight: 300,
                  lineHeight: 1,
                }}>{p.n}</p>
                <p style={{ color: GOLD_40, fontSize: "0.34rem", lineHeight: 1.3, marginTop: "2px" }}>{p.label}</p>
              </div>
              <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.44rem", lineHeight: 1.65 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ height: "1px", background: GOLD_20, marginBottom: "32px" }} />

        {/* The Month */}
        <p style={{ color: GOLD_40, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "16px" }}>
          THE ENTIRE MONTH OF MAY
        </p>
        <div style={{ display: "grid", gap: "8px", marginBottom: "32px" }}>
          {MAY_WEEKEND.map((w, i) => (
            <div key={i} style={{
              display: "flex",
              gap: "14px",
              padding: w.highlight ? "14px" : "12px 14px",
              background: w.highlight ? GOLD_10 : "rgba(176,142,80,0.02)",
              border: `1px solid ${w.highlight ? GOLD_40 : "rgba(176,142,80,0.07)"}`,
              borderRadius: "6px",
              alignItems: "flex-start",
            }}>
              <div style={{ flexShrink: 0, minWidth: "60px" }}>
                <p style={{ color: w.highlight ? GOLD : GOLD_40, fontSize: "0.4rem", lineHeight: 1.4 }}>{w.date}</p>
                <p style={{ color: w.highlight ? GOLD_40 : "rgba(176,142,80,0.25)", fontSize: "0.34rem", marginTop: "2px" }}>{w.label}</p>
              </div>
              <p style={{ color: w.highlight ? "rgba(232,224,208,0.65)" : "rgba(232,224,208,0.35)", fontSize: "0.42rem", lineHeight: 1.6 }}>
                {w.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ height: "1px", background: GOLD_20, marginBottom: "32px" }} />

        {/* The Invite */}
        <div style={{
          background: GOLD_10,
          border: `1px solid ${GOLD_40}`,
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "28px",
        }}>
          <p style={{ color: GOLD, fontSize: "0.48rem", letterSpacing: "0.15em", marginBottom: "14px" }}>
            THE INVITE
          </p>
          <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.46rem", lineHeight: 1.85, marginBottom: "14px" }}>
            We're not asking for a keynote. We're not offering a speaking fee. We're inviting you as a Co-Founding witness — a seat at the table on the night the charter is sealed.
          </p>
          <div style={{ display: "grid", gap: "8px", marginBottom: "16px" }}>
            {[
              "May 29–31 · West Oahu, Hawaiʻi",
              "2-person travel + accommodation fully covered",
              "No camera crew required — your call",
              "No public announcement without your approval",
              "Co-Founders Founding dinner · May 30",
              "Blue Moon Charter Sealing · May 31",
            ].map((line, i) => (
              <div key={i} style={{ display: "flex", gap: "8px" }}>
                <span style={{ color: GOLD_40, fontSize: "0.44rem", flexShrink: 0 }}>+</span>
                <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.44rem", lineHeight: 1.5 }}>{line}</p>
              </div>
            ))}
          </div>
          <p style={{
            color: "rgba(232,224,208,0.35)",
            fontSize: "0.42rem",
            fontStyle: "italic",
            lineHeight: 1.7,
            borderTop: "1px solid rgba(176,142,80,0.1)",
            paddingTop: "12px",
          }}>
            If this is something you want to witness — respond below. If not, no follow-up, no pitch deck, no newsletter. I respect your time more than that.
          </p>
        </div>

        {/* Response form */}
        {sent ? (
          <div style={{
            background: GREEN_10,
            border: `1px solid ${GREEN_20}`,
            borderRadius: "8px",
            padding: "28px",
            textAlign: "center",
            animation: "fadeUp 0.4s ease forwards",
          }}>
            <p style={{ color: GREEN, fontSize: "0.52rem", letterSpacing: "0.15em", marginBottom: "8px" }}>◉ RECEIVED</p>
            <p style={{ color: "#e8e0d0", fontSize: "0.48rem", marginBottom: "8px" }}>XI will route your response directly to Steward 0001.</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem" }}>
              No team. No assistant. One brother to another.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} style={{ display: "grid", gap: "12px" }}>
            <div>
              <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: "5px" }}>YOUR NAME</p>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="First name is fine"
                required
                style={{
                  width: "100%", background: "rgba(176,142,80,0.04)", border: "1px solid rgba(176,142,80,0.15)",
                  borderRadius: "4px", padding: "10px 12px", color: "#e8e0d0", fontSize: "0.48rem",
                  fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box", transition: "border-color 0.2s",
                }}
              />
            </div>
            <div>
              <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: "5px" }}>BEST EMAIL OR DM</p>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email or @handle"
                required
                style={{
                  width: "100%", background: "rgba(176,142,80,0.04)", border: "1px solid rgba(176,142,80,0.15)",
                  borderRadius: "4px", padding: "10px 12px", color: "#e8e0d0", fontSize: "0.48rem",
                  fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box", transition: "border-color 0.2s",
                }}
              />
            </div>
            <div>
              <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: "5px" }}>
                ANYTHING YOU WANT TO SAY (optional)
              </p>
              <textarea
                value={interest}
                onChange={e => setInterest(e.target.value)}
                placeholder="What stood out. What you want to know. Or just 'I'm in.'"
                rows={3}
                style={{
                  width: "100%", background: "rgba(176,142,80,0.04)", border: "1px solid rgba(176,142,80,0.15)",
                  borderRadius: "4px", padding: "10px 12px", color: "#e8e0d0", fontSize: "0.46rem",
                  fontFamily: "'JetBrains Mono', monospace", resize: "vertical", boxSizing: "border-box",
                  lineHeight: 1.6, transition: "border-color 0.2s",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              style={{
                width: "100%", background: GOLD, border: "none", color: "#000",
                fontSize: "0.5rem", letterSpacing: "0.22em", padding: "14px",
                cursor: sending ? "wait" : "pointer", fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700, borderRadius: "5px", opacity: sending ? 0.7 : 1,
              }}
            >
              {sending ? "SENDING..." : "I'M INTERESTED →"}
            </button>
            <p style={{ color: "rgba(232,224,208,0.15)", fontSize: "0.38rem", textAlign: "center" }}>
              Goes directly to Steward 0001. No team. No list.
            </p>
          </form>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "48px", paddingTop: "24px", borderTop: "1px solid rgba(176,142,80,0.06)" }}>
          <p style={{ color: GOLD_40, fontSize: "0.52rem", letterSpacing: "0.15em", marginBottom: "6px" }}>makoa.live</p>
          <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.36rem", letterSpacing: "0.12em" }}>
            Mākoa Order · West Oahu · Est. 2026 · Private Page
          </p>
        </div>

      </div>
    </div>
  );
}
