"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const BLUE = "#58a6ff";

export default function ManaStonePage() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 400); }, []);

  const sections = [
    {
      title: "THE MANA STONE",
      body: "Mana is the builder's stone. The operator. The man who takes the blueprint and makes it real. Mana brothers are the engine of Mākoa — they run the routes, close the contracts, train the crews, and generate the revenue that feeds the order. Mana is not a stepping stone to Ali'i. It is its own path. Many brothers will spend their entire journey at Mana rank — and build generational wealth doing it.",
    },
    {
      title: "QUALIFICATIONS",
      items: [
        "90-day formation completed",
        "Active brotherhood standing (dues current)",
        "Completed at least 1 service route training",
        "Demonstrated reliability — 80%+ attendance over 90 days",
        "Vouched by 1 Ali'i or 2 active brothers",
        "Passed basic trade competency (any 1 service category)",
      ],
    },
    {
      title: "RESPONSIBILITIES",
      items: [
        "Route operation — own your route, serve your clients",
        "Service quality — maintain 4.5+ rating across all stops",
        "Brotherhood attendance — weekly circles, monthly moon gatherings",
        "Mentorship — guide at least 1 Nā Koa through formation",
        "Revenue targets — minimum $2,000/month gross route revenue",
        "Equipment stewardship — maintain and inventory your kit",
        "Client relationships — you are the face of Mākoa on your route",
      ],
    },
    {
      title: "THE ROUTE ECONOMY",
      body: "Every Mana brother operates a route. A route is a geographic loop of 15-25 service stops. You visit each stop on a recurring schedule — weekly, bi-weekly, or monthly depending on the client's tier. Revenue split: 80% to you (the operator), 10% to the house (local chapter), 10% to the order (central). A full route at Koa Plus density generates $3,750-$6,225/month. Your take: $3,000-$4,980/month. That's operator money. No boss. No office. Just your route.",
    },
    {
      title: "RANK PROGRESSION",
      items: [
        "Mana Builder — Route assigned, first 90 days of operation",
        "Mana Operator — 90+ days active, route at 60%+ capacity",
        "Mana Strategist — Multiple routes or $5K+/month, mentoring Nā Koa",
        "Mana Circle Lead — Running local brotherhood circles, route training instructor",
      ],
    },
    {
      title: "TOOLS & SUPPORT",
      items: [
        "XI route optimization — AI-powered scheduling and density mapping",
        "Inventory tracking — equipment, supplies, vehicle maintenance",
        "Client portal — scheduling, communication, payment (all handled)",
        "Training library — video courses for every service category",
        "Brotherhood network — emergency coverage, skill sharing, equipment loans",
        "Insurance umbrella — liability coverage under Mākoa Trade Co.",
      ],
    },
    {
      title: "THE OATH OF MANA",
      body: "\"I build. Not for recognition, but for what stands after I leave. My route is my territory. My clients are my responsibility. My brothers are my safety net. I show up when it rains. I show up when it's easy. I show up. The work is the worship. The route is the ritual. I am Mana — the force that moves things forward.\"",
      italic: true,
    },
    {
      title: "PATH TO ALI'I",
      body: "Not every Mana brother will become Ali'i — and that's by design. Ali'i is a leadership burden, not a promotion. But for those called to it: maintain Mana Strategist rank for 6+ months, mentor 3+ brothers through formation, demonstrate council-level judgment, and receive the nod from sitting Ali'i. The council recognizes. The stone finds you.",
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      fontFamily: "'JetBrains Mono', monospace",
      padding: "40px 20px 60px",
    }}>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>

      <div style={{
        maxWidth: "560px",
        margin: "0 auto",
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "50%",
            border: `1.5px solid ${BLUE}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <span style={{ color: BLUE, fontSize: "1.2rem" }}>◆</span>
          </div>
          <p style={{ fontSize: "0.42rem", letterSpacing: "0.3em", color: GOLD_40, marginBottom: "10px" }}>
            WHITE PAPER · RANK STONE
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "2.4rem",
            color: BLUE,
            margin: "0 0 8px",
            fontWeight: 300,
          }}>Mana</h1>
          <p style={{ color: "rgba(88,166,255,0.5)", fontSize: "0.48rem" }}>The Builder Stone</p>
        </div>

        {/* Sections */}
        {sections.map((s, i) => (
          <div key={i} style={{
            marginBottom: "32px",
            paddingBottom: "32px",
            borderBottom: "1px solid rgba(176,142,80,0.06)",
            opacity: ready ? 1 : 0,
            transition: `opacity 0.6s ease ${0.3 + i * 0.1}s`,
          }}>
            <p style={{ color: BLUE, fontSize: "0.42rem", letterSpacing: "0.25em", marginBottom: "14px" }}>
              {s.title}
            </p>
            {s.body && (
              <p style={{
                color: "rgba(232,224,208,0.6)",
                fontSize: "0.52rem",
                lineHeight: 1.8,
                fontStyle: s.italic ? "italic" : "normal",
                fontFamily: s.italic ? "'Cormorant Garamond', serif" : undefined,
              }}>{s.body}</p>
            )}
            {s.items && (
              <div style={{ display: "grid", gap: "8px" }}>
                {s.items.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: BLUE, fontSize: "0.4rem", flexShrink: 0, marginTop: "2px", opacity: 0.5 }}>◆</span>
                    <span style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.48rem", lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/stones/nakoa" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>NĀ KOA STONE</a>
            <span style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.38rem" }}>·</span>
            <a href="/stones/alii" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>ALIʻI STONE</a>
            <span style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.38rem" }}>·</span>
            <a href="/circle" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>CIRCLE</a>
            <span style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.38rem" }}>·</span>
            <a href="/gate" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>GATE</a>
          </div>
          <p style={{ color: "rgba(176,142,80,0.1)", fontSize: "0.36rem", letterSpacing: "0.15em", marginTop: "12px" }}>
            Mākoa Order · The Stones · 2026
          </p>
        </div>
      </div>
    </div>
  );
}
