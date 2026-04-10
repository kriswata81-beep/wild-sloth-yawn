"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";

export default function AliiStonePage() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 400); }, []);

  const sections = [
    {
      title: "THE ALI'I STONE",
      body: "The Ali'i are the council. The seated elders. The men who carry the weight of the order — not because they are told to, but because they cannot put it down. The Ali'i Stone is not awarded. It is recognized. When the order sees a man who leads without asking permission, who serves without keeping score, who builds without needing credit — that man is Ali'i.",
    },
    {
      title: "QUALIFICATIONS",
      items: [
        "Minimum 6 months active brotherhood standing",
        "90-day formation completed with no gaps",
        "Demonstrated leadership in at least 2 circles",
        "Vouched by 3 active brothers",
        "Revenue-generating route operator OR active mentor",
        "Attended at least 1 MAYDAY summit",
        "No standing violations or delinquency",
      ],
    },
    {
      title: "RESPONSIBILITIES",
      items: [
        "Seat on the Ali'i Council — quarterly strategy sessions",
        "Vote on all order-level decisions (expansion, treasury, discipline)",
        "Mentor assignment — 2 Nā Koa minimum under guidance",
        "Route oversight — quality and service standard enforcement",
        "House anchor — stabilize or plant a Mākoa house in your region",
        "Culture keeper — uphold the oath, protect the circle",
      ],
    },
    {
      title: "THE COUNCIL",
      body: "The Ali'i Council meets quarterly. Remote brothers attend via secure channel. Decisions require 2/3 majority. Steward 0001 holds tie-breaker authority during founding period (first 24 months). After that, the council governs itself. XI provides intelligence. The brothers decide.",
    },
    {
      title: "RANK PROGRESSION",
      items: [
        "Ali'i Seated — Council recognized, stone received",
        "Ali'i Council — Active voting member, 1+ year seated",
        "Ali'i Steward — Regional anchor, house founder",
        "Ali'i Chapter Anchor — Multi-house oversight, expansion lead",
      ],
    },
    {
      title: "THE OATH OF THE ALI'I",
      body: "\"I do not lead because I am above. I lead because I am beneath — carrying what others cannot yet hold. I will sit at the council table and speak truth. I will hold the circle sacred. I will build what lasts beyond me. I am Ali'i not by title, but by action. The order watches. The brothers follow. The stone remembers.\"",
      italic: true,
    },
    {
      title: "ECONOMICS",
      body: "Ali'i brothers operate at the highest revenue tier. Route operators at Ali'i rank receive priority territory assignment, higher service density, and access to B2B contract routes (hotels, property managers, commercial). Ali'i also earn ambassador commission on every brother they bring into the order who completes formation. The stone is not just honor — it is infrastructure.",
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
            border: `1.5px solid ${GOLD}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <span style={{ color: GOLD, fontSize: "1.2rem" }}>◉</span>
          </div>
          <p style={{ fontSize: "0.42rem", letterSpacing: "0.3em", color: GOLD_40, marginBottom: "10px" }}>
            WHITE PAPER · RANK STONE
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "2.4rem",
            color: GOLD,
            margin: "0 0 8px",
            fontWeight: 300,
          }}>Ali'i</h1>
          <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.48rem" }}>The Council Stone</p>
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
            <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.25em", marginBottom: "14px" }}>
              {s.title}
            </p>
            {s.body && (
              <p style={{
                color: "rgba(232,224,208,0.6)",
                fontSize: s.italic ? "0.62rem" : "0.52rem",
                lineHeight: 1.8,
                fontStyle: s.italic ? "italic" : "normal",
                fontFamily: s.italic ? "'Cormorant Garamond', serif" : undefined,
              }}>{s.body}</p>
            )}
            {s.items && (
              <div style={{ display: "grid", gap: "8px" }}>
                {s.items.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: GOLD, fontSize: "0.4rem", flexShrink: 0, marginTop: "2px", opacity: 0.5 }}>◆</span>
                    <span style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.48rem", lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
            <a href="/stones/mana" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>MANA STONE</a>
            <span style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.38rem" }}>·</span>
            <a href="/circle" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>CIRCLE</a>
            <span style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.38rem" }}>·</span>
            <a href="/" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>GATE</a>
          </div>
          <p style={{ color: "rgba(176,142,80,0.1)", fontSize: "0.36rem", letterSpacing: "0.15em", marginTop: "12px" }}>
            Mākoa Order · The Stones · 2026
          </p>
        </div>
      </div>
    </div>
  );
}
