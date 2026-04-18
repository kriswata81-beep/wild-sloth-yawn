"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";
const GREEN_10 = "rgba(63,185,80,0.1)";
const AMBER = "#f0883e";
const AMBER_20 = "rgba(240,136,62,0.2)";
const AMBER_10 = "rgba(240,136,62,0.1)";
const PURPLE = "#a78bfa";
const PURPLE_20 = "rgba(167,139,250,0.2)";
const PURPLE_10 = "rgba(167,139,250,0.1)";
const BG = "#04060a";

const SERVICE_TERRITORY = [
  { zip: "96792", area: "Waianae · Mākaha", status: "ACTIVE", icon: "◉" },
  { zip: "96707", area: "Kapolei", status: "ACTIVE", icon: "◉" },
  { zip: "96706", area: "Ewa Beach · Ewa", status: "ACTIVE", icon: "◉" },
  { zip: "96791", area: "Waialua", status: "OPEN", icon: "◇" },
  { zip: "96793", area: "Wailuku adj.", status: "OPEN", icon: "◇" },
];

const SERVICES = [
  {
    icon: "✦",
    color: GREEN,
    bg: GREEN_10,
    border: GREEN_20,
    title: "Lawn Maintenance",
    desc: "Regular mowing, edging, trimming. Weekly or bi-weekly schedule. Your lawn on the route.",
    price: "$65–$120",
    priceLabel: "per visit",
  },
  {
    icon: "◉",
    color: PURPLE,
    bg: PURPLE_10,
    border: PURPLE_20,
    title: "Entryway Plant Rentals",
    desc: "Tropical potted plants — birds of paradise, ti leaf, heliconias, anthuriums — delivered, staged, and swapped monthly. Make your entrance unforgettable.",
    price: "$75–$250",
    priceLabel: "per month",
    badge: "SIGNATURE SERVICE",
  },
  {
    icon: "◈",
    color: GOLD,
    bg: GOLD_10,
    border: GOLD_20,
    title: "Yard Cleanup",
    desc: "Full property debris removal, leaf blowing, weed pulling, haul-away included.",
    price: "$150–$350",
    priceLabel: "per service",
  },
  {
    icon: "⬡",
    color: AMBER,
    bg: AMBER_10,
    border: AMBER_20,
    title: "Hedging & Shaping",
    desc: "Bush trimming, hedge shaping, ornamental pruning. Clean lines, clean property.",
    price: "$85–$200",
    priceLabel: "per visit",
  },
  {
    icon: "◆",
    color: "#58a6ff",
    bg: "rgba(88,166,255,0.1)",
    border: "rgba(88,166,255,0.2)",
    title: "Tree Work",
    desc: "Branch trimming, deadwood removal, palm skirt pruning, stump grinding. Hawaii-safe cuts.",
    price: "$200–$800",
    priceLabel: "per job",
  },
  {
    icon: "▲",
    color: "#c9a050",
    bg: "rgba(201,160,80,0.1)",
    border: "rgba(201,160,80,0.2)",
    title: "Rock & Mulch",
    desc: "Landscape rock delivery + placement, mulch beds, ground cover refresh.",
    price: "$300–$1,200",
    priceLabel: "per project",
  },
  {
    icon: "◌",
    color: "rgba(232,224,208,0.6)",
    bg: "rgba(232,224,208,0.03)",
    border: "rgba(232,224,208,0.08)",
    title: "One-Time Projects",
    desc: "Custom quotes for fencing, grading, retaining walls, new planting installs.",
    price: "Custom",
    priceLabel: "quote",
  },
];

const ROUTE_PROTOCOL = [
  { step: "01", title: "Request a Quote", desc: "Drop your address and what you need. XI dispatches a territory check within 24 hours." },
  { step: "02", title: "Territory Match", desc: "Your zip code maps to the active Land Route. You're assigned Steward 0001's crew — West Oahu." },
  { step: "03", title: "Scheduled Service", desc: "One-time or recurring. Same crew. Consistent. Brother-operated, not a random contractor." },
  { step: "04", title: "Revenue Split", desc: "80% to the brother who did the work. 10% to the house. 10% to the order. Transparent." },
];

interface QuoteForm {
  name: string;
  phone: string;
  address: string;
  zip: string;
  service: string;
  notes: string;
}

export default function YardServicePage() {
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<QuoteForm>({ name: "", phone: "", address: "", zip: "", service: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  function handleChange(field: keyof QuoteForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.zip) {
      alert("Fill in your name, phone, address, and zip to continue.");
      return;
    }
    setSending(true);
    // Post to contact/quote channel — XI routes internally
    try {
      await fetch("/api/yard-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "yard_landing", timestamp: new Date().toISOString() }),
      }).catch(() => {});
    } catch {}
    setSending(false);
    setSubmitted(true);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      fontFamily: "'JetBrains Mono', monospace",
      padding: "40px 20px 80px",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        input, select, textarea { outline: none; }
        input:focus, select:focus, textarea:focus { border-color: rgba(176,142,80,0.35) !important; }
        .svc-card:hover { border-color: rgba(176,142,80,0.2) !important; transform: translateY(-1px); }
        .quote-btn:hover { background: rgba(176,142,80,0.12) !important; }
      `}</style>

      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "40px",
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>
        {/* Trust badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: GREEN_10,
          border: `1px solid ${GREEN_20}`,
          borderRadius: "4px",
          padding: "5px 12px",
          marginBottom: "16px",
        }}>
          <span style={{ color: GREEN, fontSize: "0.38rem", animation: "pulse 2s infinite" }}>◉</span>
          <span style={{ color: GREEN, fontSize: "0.4rem", letterSpacing: "0.18em" }}>LAND ROUTE · WEST OAHU ACTIVE</span>
        </div>

        <p style={{ fontSize: "0.44rem", letterSpacing: "0.3em", color: GOLD_40, marginBottom: "10px" }}>
          MĀKOA TRADE CO. · MALU TRUST
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "2.6rem",
          color: GOLD,
          margin: "0 0 6px",
          fontWeight: 300,
          lineHeight: 1.1,
        }}>
          Kaala Lush Services
        </h1>
        <p style={{
          fontSize: "0.46rem",
          color: "rgba(176,142,80,0.35)",
          marginBottom: "10px",
          letterSpacing: "0.12em",
        }}>
          Yard Service · Entryway Plant Rentals
        </p>
        <p style={{
          fontSize: "0.5rem",
          color: "rgba(176,142,80,0.45)",
          maxWidth: "400px",
          margin: "0 auto 10px",
          lineHeight: 1.8,
        }}>
          Operated by Mana Steward 0001 · West Oahu Cluster<br />
          Brother-dispatched. Backed by the order.
        </p>
        <p style={{ color: "rgba(232,224,208,0.18)", fontSize: "0.4rem", letterSpacing: "0.12em" }}>
          Part of the 808 7G Net — Land Routes
        </p>
      </div>

      {/* Territory Map */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 40px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.7s ease 0.15s",
      }}>
        <p style={{ color: GOLD_40, fontSize: "0.42rem", letterSpacing: "0.22em", textAlign: "center", marginBottom: "14px" }}>
          SERVICE TERRITORY
        </p>
        <div style={{ display: "grid", gap: "8px" }}>
          {SERVICE_TERRITORY.map((t) => (
            <div key={t.zip} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: t.status === "ACTIVE" ? GREEN_10 : "rgba(176,142,80,0.03)",
              border: `1px solid ${t.status === "ACTIVE" ? GREEN_20 : "rgba(176,142,80,0.08)"}`,
              borderRadius: "5px",
              padding: "10px 14px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: t.status === "ACTIVE" ? GREEN : GOLD_40, fontSize: "0.5rem" }}>{t.icon}</span>
                <div>
                  <p style={{ color: t.status === "ACTIVE" ? "#e8e0d0" : "rgba(232,224,208,0.4)", fontSize: "0.48rem", marginBottom: "1px" }}>
                    {t.area}
                  </p>
                  <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.36rem" }}>{t.zip}</p>
                </div>
              </div>
              <span style={{
                color: t.status === "ACTIVE" ? GREEN : GOLD_40,
                fontSize: "0.36rem",
                letterSpacing: "0.15em",
                background: t.status === "ACTIVE" ? GREEN_10 : "transparent",
                padding: "2px 8px",
                borderRadius: "2px",
              }}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
        <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.38rem", textAlign: "center", marginTop: "10px" }}>
          Outside West Oahu? <a href="/808" style={{ color: GOLD_40, textDecoration: "none" }}>Find your zip cluster →</a>
        </p>
      </div>

      {/* Services Grid */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 48px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.7s ease 0.25s",
      }}>
        <p style={{ color: GOLD_40, fontSize: "0.42rem", letterSpacing: "0.22em", textAlign: "center", marginBottom: "16px" }}>
          SERVICES
        </p>
        <div style={{ display: "grid", gap: "10px" }}>
          {SERVICES.map((s, i) => (
            <div key={i} className="svc-card" style={{
              background: s.bg,
              border: `1px solid ${"badge" in s ? s.color + "40" : s.border}`,
              borderRadius: "7px",
              padding: "16px",
              display: "flex",
              gap: "14px",
              alignItems: "flex-start",
              transition: "all 0.2s ease",
              position: "relative",
            }}>
              {"badge" in s && s.badge && (
                <span style={{
                  position: "absolute",
                  top: "-8px",
                  right: "12px",
                  background: s.color,
                  color: "#000",
                  fontSize: "0.32rem",
                  letterSpacing: "0.15em",
                  padding: "2px 8px",
                  borderRadius: "2px",
                  fontWeight: 700,
                }}>{s.badge as string}</span>
              )}
              <span style={{ color: s.color, fontSize: "1rem", flexShrink: 0, marginTop: "2px" }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5px" }}>
                  <p style={{ color: s.color, fontSize: "0.5rem", letterSpacing: "0.08em" }}>{s.title}</p>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#e8e0d0", fontSize: "0.52rem" }}>{s.price}</p>
                    <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.36rem" }}>{s.priceLabel}</p>
                  </div>
                </div>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Split Call-out */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 48px",
        background: GOLD_10,
        border: `1px solid ${GOLD_20}`,
        borderRadius: "8px",
        padding: "20px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.7s ease 0.35s",
      }}>
        <p style={{ color: GOLD, fontSize: "0.44rem", letterSpacing: "0.2em", marginBottom: "14px", textAlign: "center" }}>
          THE ROUTE ECONOMY
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", textAlign: "center" }}>
          {[
            { pct: "80%", label: "To the Brother", sub: "who did the work" },
            { pct: "10%", label: "To the House", sub: "Trade Co operations" },
            { pct: "10%", label: "To the Order", sub: "brotherhood fund" },
          ].map((r, i) => (
            <div key={i}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.8rem",
                color: GOLD,
                fontWeight: 300,
                lineHeight: 1,
                marginBottom: "4px",
              }}>{r.pct}</p>
              <p style={{ color: "#e8e0d0", fontSize: "0.42rem", marginBottom: "3px" }}>{r.label}</p>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem" }}>{r.sub}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: `1px solid ${GOLD_20}` }}>
          <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.4rem", textAlign: "center", lineHeight: 1.7 }}>
            Every job on the route is logged by XI. Revenue flows transparently.<br />
            Managed under Malu Trust · Run by Mākoa Trade Co.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 48px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.7s ease 0.4s",
      }}>
        <p style={{ color: GOLD_40, fontSize: "0.42rem", letterSpacing: "0.22em", textAlign: "center", marginBottom: "16px" }}>
          HOW IT WORKS
        </p>
        {ROUTE_PROTOCOL.map((s, i) => (
          <div key={i} style={{
            display: "flex",
            gap: "14px",
            padding: "14px 0",
            borderBottom: `1px solid rgba(176,142,80,0.06)`,
          }}>
            <span style={{ color: GOLD, fontSize: "0.52rem", fontWeight: 600, flexShrink: 0, opacity: 0.5, minWidth: "24px" }}>{s.step}</span>
            <div>
              <p style={{ color: "#e8e0d0", fontSize: "0.52rem", marginBottom: "3px" }}>{s.title}</p>
              <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem", lineHeight: 1.55 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Form */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 48px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.7s ease 0.5s",
      }}>
        <p style={{ color: GOLD_40, fontSize: "0.42rem", letterSpacing: "0.22em", textAlign: "center", marginBottom: "6px" }}>
          REQUEST A QUOTE
        </p>
        <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.4rem", textAlign: "center", marginBottom: "24px" }}>
          XI dispatches. Brother delivers. Usually within 24–48 hrs.
        </p>

        {submitted ? (
          <div style={{
            background: GREEN_10,
            border: `1px solid ${GREEN_20}`,
            borderRadius: "8px",
            padding: "32px 24px",
            textAlign: "center",
            animation: "fadeUp 0.4s ease forwards",
          }}>
            <p style={{ color: GREEN, fontSize: "0.52rem", letterSpacing: "0.15em", marginBottom: "10px" }}>◉ QUOTE RECEIVED</p>
            <p style={{ color: "#e8e0d0", fontSize: "0.5rem", marginBottom: "8px" }}>XI is routing your request.</p>
            <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem", lineHeight: 1.7, marginBottom: "20px" }}>
              A brother from the West Oahu cluster will reach out within 24–48 hours to confirm your service window.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/808" style={{
                background: GOLD_10,
                border: `1px solid ${GOLD_20}`,
                color: GOLD,
                fontSize: "0.42rem",
                letterSpacing: "0.15em",
                padding: "10px 18px",
                textDecoration: "none",
                borderRadius: "4px",
              }}>VIEW 808 NETWORK →</a>
              <a href="/gate" style={{
                background: "rgba(232,224,208,0.03)",
                border: "1px solid rgba(232,224,208,0.08)",
                color: "rgba(232,224,208,0.4)",
                fontSize: "0.42rem",
                letterSpacing: "0.15em",
                padding: "10px 18px",
                textDecoration: "none",
                borderRadius: "4px",
              }}>JOIN THE ORDER</a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: "5px" }}>YOUR NAME *</p>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Full name"
                  required
                  style={{
                    width: "100%",
                    background: "rgba(176,142,80,0.04)",
                    border: "1px solid rgba(176,142,80,0.15)",
                    borderRadius: "4px",
                    padding: "10px 12px",
                    color: "#e8e0d0",
                    fontSize: "0.48rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
              <div>
                <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: "5px" }}>PHONE *</p>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="(808) 555-0000"
                  required
                  style={{
                    width: "100%",
                    background: "rgba(176,142,80,0.04)",
                    border: "1px solid rgba(176,142,80,0.15)",
                    borderRadius: "4px",
                    padding: "10px 12px",
                    color: "#e8e0d0",
                    fontSize: "0.48rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
            </div>

            <div>
              <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: "5px" }}>SERVICE ADDRESS *</p>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Street address"
                required
                style={{
                  width: "100%",
                  background: "rgba(176,142,80,0.04)",
                  border: "1px solid rgba(176,142,80,0.15)",
                  borderRadius: "4px",
                  padding: "10px 12px",
                  color: "#e8e0d0",
                  fontSize: "0.48rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: "5px" }}>ZIP CODE *</p>
                <select
                  value={form.zip}
                  onChange={(e) => handleChange("zip", e.target.value)}
                  required
                  style={{
                    width: "100%",
                    background: "#04060a",
                    border: "1px solid rgba(176,142,80,0.15)",
                    borderRadius: "4px",
                    padding: "10px 12px",
                    color: form.zip ? "#e8e0d0" : "rgba(232,224,208,0.3)",
                    fontSize: "0.48rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    appearance: "none",
                  }}
                >
                  <option value="">Select zip</option>
                  <option value="96792">96792 — Waianae / Mākaha</option>
                  <option value="96707">96707 — Kapolei</option>
                  <option value="96706">96706 — Ewa Beach</option>
                  <option value="96791">96791 — Waialua</option>
                  <option value="other">Other (we&apos;ll check)</option>
                </select>
              </div>
              <div>
                <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: "5px" }}>SERVICE TYPE</p>
                <select
                  value={form.service}
                  onChange={(e) => handleChange("service", e.target.value)}
                  style={{
                    width: "100%",
                    background: "#04060a",
                    border: "1px solid rgba(176,142,80,0.15)",
                    borderRadius: "4px",
                    padding: "10px 12px",
                    color: form.service ? "#e8e0d0" : "rgba(232,224,208,0.3)",
                    fontSize: "0.48rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    appearance: "none",
                  }}
                >
                  <option value="">Select service</option>
                  <option value="plant_rental">Entryway Plant Rentals (monthly)</option>
                  <option value="lawn">Lawn Maintenance</option>
                  <option value="cleanup">Yard Cleanup</option>
                  <option value="hedging">Hedging & Shaping</option>
                  <option value="trees">Tree Work</option>
                  <option value="rock_mulch">Rock & Mulch</option>
                  <option value="project">One-Time Project</option>
                </select>
              </div>
            </div>

            <div>
              <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: "5px" }}>NOTES (optional)</p>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Property size, frequency preference, anything we should know..."
                rows={3}
                style={{
                  width: "100%",
                  background: "rgba(176,142,80,0.04)",
                  border: "1px solid rgba(176,142,80,0.15)",
                  borderRadius: "4px",
                  padding: "10px 12px",
                  color: "#e8e0d0",
                  fontSize: "0.46rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  resize: "vertical",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  lineHeight: 1.6,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="quote-btn"
              style={{
                width: "100%",
                background: GOLD_10,
                border: `1px solid ${GOLD_40}`,
                color: GOLD,
                fontSize: "0.5rem",
                letterSpacing: "0.25em",
                padding: "14px",
                cursor: sending ? "wait" : "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                borderRadius: "5px",
                marginTop: "4px",
                transition: "all 0.2s ease",
                opacity: sending ? 0.6 : 1,
              }}
            >
              {sending ? "ROUTING REQUEST..." : "REQUEST A QUOTE →"}
            </button>
          </form>
        )}
      </div>

      {/* 7G Net Link */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 16px",
        background: "rgba(176,142,80,0.03)",
        border: "1px solid rgba(176,142,80,0.08)",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.7s ease 0.6s",
      }}>
        <p style={{ color: GOLD, fontSize: "0.5rem", letterSpacing: "0.15em", marginBottom: "8px" }}>
          808 7G NET — LAND ROUTE ACTIVE
        </p>
        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", lineHeight: 1.7, marginBottom: "16px" }}>
          Kaala Lush Services is a live Land Route node in the West Oahu zip cluster.<br />
          Operated under Mana Steward 0001 · Mākoa Trade Co · Malu Trust.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/808" style={{
            background: GOLD_10,
            border: `1px solid ${GOLD_20}`,
            color: GOLD,
            fontSize: "0.42rem",
            letterSpacing: "0.15em",
            padding: "9px 16px",
            textDecoration: "none",
            borderRadius: "4px",
          }}>VIEW 808 PORTAL →</a>
          <a href="/claim" style={{
            background: "rgba(63,185,80,0.06)",
            border: "1px solid rgba(63,185,80,0.2)",
            color: GREEN,
            fontSize: "0.42rem",
            letterSpacing: "0.15em",
            padding: "9px 16px",
            textDecoration: "none",
            borderRadius: "4px",
          }}>CLAIM YOUR BUSINESS</a>
        </div>
      </div>

      {/* Footer nav */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "GATE", href: "/" },
            { label: "TRADE CO", href: "/trade" },
            { label: "808 NET", href: "/808" },
            { label: "MAYDAY", href: "/founding48" },
          ].map((link, i) => (
            <a key={i} href={link.href} style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>
              {link.label}
            </a>
          ))}
        </div>
        <p style={{ color: "rgba(176,142,80,0.1)", fontSize: "0.36rem", letterSpacing: "0.12em", marginTop: "12px" }}>
          Kaala Lush Services · Malu Trust · Mākoa Trade Co. · West Oahu · Est. 2026
        </p>
      </div>
    </div>
  );
}
