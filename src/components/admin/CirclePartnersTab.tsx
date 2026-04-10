"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.08)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const STEEL = "#8b9aaa";

type CirclePartner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  circle: "cofounder" | "cofounding_circle" | "founding";
  status: "active" | "pending" | "completed";
  paidAt: string;
  amount: number;
  equity: string;
  territory: string;
};

const MOCK_PARTNERS: CirclePartner[] = [];

const CIRCLE_CONFIG = {
  cofounder: { label: "CO-FOUNDING STEWARD", color: GOLD, seats: 12, price: "$4,997", equity: "1%" },
  cofounding_circle: { label: "CO-FOUNDER CIRCLE", color: BLUE, seats: 12, price: "$997/mo", equity: "—" },
  founding: { label: "FOUNDING CIRCLE", color: STEEL, seats: 48, price: "$297", equity: "—" },
};

export default function CirclePartnersTab() {
  const [partners] = useState<CirclePartner[]>(MOCK_PARTNERS);
  const [filter, setFilter] = useState<"all" | "cofounder" | "cofounding_circle" | "founding">("all");

  const filtered = filter === "all" ? partners : partners.filter(p => p.circle === filter);

  const cofounderCount = partners.filter(p => p.circle === "cofounder").length;
  const circleCount = partners.filter(p => p.circle === "cofounding_circle").length;
  const foundingCount = partners.filter(p => p.circle === "founding").length;
  const totalRevenue = partners.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
        {[
          { label: "Co-Founding Stewards", value: `${cofounderCount}/12`, color: GOLD },
          { label: "Co-Founder Circle", value: `${circleCount}/12`, color: BLUE },
          { label: "Founding Circle", value: `${foundingCount}/48`, color: STEEL },
          { label: "Circle Revenue", value: `$${totalRevenue.toLocaleString()}`, color: GREEN },
        ].map(s => (
          <div key={s.label} style={{
            background: GOLD_FAINT,
            border: "1px solid rgba(176,142,80,0.08)",
            borderRadius: "6px",
            padding: "14px 12px",
          }}>
            <p style={{ color: s.color, fontSize: "0.8rem", fontWeight: 500 }}>{s.value}</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", letterSpacing: "0.1em", marginTop: "4px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Seat Progress Bars */}
      <div style={{ display: "grid", gap: "10px", marginBottom: "24px" }}>
        {Object.entries(CIRCLE_CONFIG).map(([key, config]) => {
          const count = partners.filter(p => p.circle === key).length;
          const pct = Math.round((count / config.seats) * 100);
          return (
            <div key={key} style={{
              background: GOLD_FAINT,
              border: "1px solid rgba(176,142,80,0.06)",
              borderRadius: "6px",
              padding: "12px 14px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: config.color, fontSize: "0.42rem", letterSpacing: "0.15em" }}>{config.label}</span>
                <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem" }}>
                  {count}/{config.seats} · {config.price} {config.equity !== "—" ? `· ${config.equity} equity` : ""}
                </span>
              </div>
              <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: config.color,
                  borderRadius: "2px",
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[
          { key: "all", label: "ALL" },
          { key: "cofounder", label: "STEWARDS" },
          { key: "cofounding_circle", label: "CO-FOUNDER" },
          { key: "founding", label: "FOUNDING" },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            style={{
              background: filter === f.key ? "rgba(176,142,80,0.12)" : "transparent",
              border: `1px solid ${filter === f.key ? GOLD + "40" : "rgba(176,142,80,0.1)"}`,
              color: filter === f.key ? GOLD : GOLD_DIM,
              fontSize: "0.38rem",
              letterSpacing: "0.12em",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Partners List */}
      <div style={{ display: "grid", gap: "8px" }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            background: GOLD_FAINT,
            borderRadius: "8px",
            border: "1px solid rgba(176,142,80,0.06)",
          }}>
            <p style={{ color: GOLD, fontSize: "0.55rem", marginBottom: "8px" }}>No circle partners yet</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", lineHeight: 1.6 }}>
              Partners who register at <span style={{ color: GOLD_DIM }}>/circle</span> will appear here.<br />
              Share the link — 12 co-founding steward seats worldwide.
            </p>
          </div>
        ) : (
          filtered.map(p => {
            const config = CIRCLE_CONFIG[p.circle];
            return (
              <div key={p.id} style={{
                background: GOLD_FAINT,
                border: `1px solid rgba(176,142,80,0.1)`,
                borderRadius: "8px",
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <p style={{ color: "#e8e0d0", fontSize: "0.6rem", marginBottom: "2px" }}>{p.name}</p>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem" }}>
                    {p.email} · {p.region}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{
                    background: `${config.color}15`,
                    color: config.color,
                    border: `1px solid ${config.color}40`,
                    fontSize: "0.38rem",
                    padding: "3px 8px",
                    borderRadius: "3px",
                    letterSpacing: "0.1em",
                  }}>{config.label}</span>
                  <span style={{ color: GREEN, fontSize: "0.4rem" }}>✓ PAID</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Worldwide Map Placeholder */}
      <div style={{
        marginTop: "24px",
        background: GOLD_FAINT,
        border: "1px solid rgba(176,142,80,0.06)",
        borderRadius: "8px",
        padding: "24px",
        textAlign: "center",
      }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "8px" }}>WORLDWIDE PARTNER MAP</p>
        <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem" }}>
          Partner regions will populate as seats fill · 12 co-founders · Global reach
        </p>
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginTop: "16px",
        }}>
          {["Hawaii", "West Coast", "East Coast", "International"].map(r => (
            <div key={r} style={{
              background: "rgba(0,0,0,0.3)",
              padding: "8px 14px",
              borderRadius: "4px",
              border: "1px solid rgba(176,142,80,0.06)",
            }}>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem" }}>{r}</p>
              <p style={{ color: GOLD, fontSize: "0.55rem", marginTop: "2px" }}>0</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
