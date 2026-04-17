"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GREEN = "#3fb950";

export default function NaKoaStonePage() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 400); }, []);

  const sections = [
    {
      title: "THE NĀ KOA STONE",
      body: "Nā Koa means 'The Warriors.' This is the entry stone — the first fire. Every brother who has ever stood in the order started here. Nā Koa is not a lesser rank. It is the foundation rank. The man who earns his Nā Koa stone has done what most men never do — he showed up, he stayed, and he proved he belongs. The stone is not given. It is earned through 90 days of formation, service, and brotherhood.",
    },
    {
      title: "QUALIFICATIONS",
      items: [
        "Gate application accepted by XI",
        "Formation fee paid — commitment confirmed",
        "Attended the founding MAYDAY event (May 1–4) or first available 48",
        "Completed 90-day formation period",
        "80%+ attendance at weekly circles and trainings",
        "Completed at least 1 service route shadow shift",
        "Vouched by 1 active brother in good standing",
      ],
    },
    {
      title: "WHAT FORMATION LOOKS LIKE",
      items: [
        "4am Saturday trainings — ice bath, physical conditioning, brotherhood circle",
        "Weekly Wednesday school — trade skills, financial literacy, brotherhood doctrine",
        "Monthly moon gathering — full order convenes, circle opens, oath spoken",
        "808 emergency channel — you are on call for your brothers",
        "Service shadow — ride with a Mana brother on his route for 1 full day",
        "Brotherhood project — contribute to 1 order-wide build or service event",
      ],
    },
    {
      title: "WHAT YOU RECEIVE",
      items: [
        "Nā Koa rank stone — physical and digital",
        "Brotherhood council seat at weekly circles",
        "808 emergency channel access",
        "Trade training library — all service categories",
        "Route shadow access — learn before you operate",
        "Brotherhood network — 24/7 emergency coverage",
        "Path to Mana — route assignment after formation complete",
      ],
    },
    {
      title: "THE WARRIOR'S ECONOMY",
      body: "Nā Koa brothers are in formation — learning the routes, building the skills, proving the character. During formation you shadow Mana operators and earn a training stipend on completed shadow shifts. After formation, you receive your first route assignment. A starter route of 10–15 stops generates $1,500–$3,000/month gross. Your take at Nā Koa rate: 75%. That's $1,125–$2,250/month while you're still learning. The route grows as you do.",
    },
    {
      title: "RANK PROGRESSION",
      items: [
        "Nā Koa Recruit — Formation days 1–30. Learning. Watching. Showing up.",
        "Nā Koa Warrior — Days 31–60. First shadow shifts. Circle leadership emerging.",
        "Nā Koa Proven — Days 61–90. Route-ready. Brotherhood vouched. Stone earned.",
        "Mana Builder — Formation complete. First route assigned. The real work begins.",
      ],
    },
    {
      title: "THE OATH OF NĀ KOA",
      body: "\"I did not come here to be comfortable.\nI came here to be forged.\nI will not quit when it gets hard — I will get harder.\nI serve the order before I serve myself.\nI earn my place. Every week. Every rep. Every 4am.\nI am not yet what I will become.\nBut I am here. I showed up.\nThat is where it begins.\nNā Koa — I am a warrior of this order.\"",
      italic: true,
    },
    {
      title: "PATH TO MANA",
      body: "Nā Koa is a 90-day crucible — not a permanent home. After formation, every brother who has proven his character and reliability receives a route assignment and rises to Mana rank. The path is simple: show up, serve, learn, prove. The order does not promote by time served. It promotes by character demonstrated. When your brothers say you're ready — you're ready.",
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
            border: `1.5px solid ${GREEN}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <span style={{ color: GREEN, fontSize: "1.2rem" }}>⚔</span>
          </div>
          <p style={{ fontSize: "0.42rem", letterSpacing: "0.3em", color: GOLD_40, marginBottom: "10px" }}>
            WHITE PAPER · RANK STONE
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "2.4rem",
            color: GREEN,
            margin: "0 0 8px",
            fontWeight: 300,
          }}>Nā Koa</h1>
          <p style={{ color: "rgba(63,185,80,0.5)", fontSize: "0.48rem" }}>The Warrior Stone</p>
        </div>

        {/* Sections */}
        {sections.map((s, i) => (
          <div key={i} style={{
            marginBottom: "32px",
            paddingBottom: "32px",
            borderBottom: "1px solid rgba(63,185,80,0.06)",
            opacity: ready ? 1 : 0,
            transition: `opacity 0.6s ease ${0.3 + i * 0.1}s`,
          }}>
            <p style={{ color: GREEN, fontSize: "0.42rem", letterSpacing: "0.25em", marginBottom: "14px" }}>
              {s.title}
            </p>
            {s.body && (
              <p style={{
                color: "rgba(232,224,208,0.6)",
                fontSize: "0.52rem",
                lineHeight: 1.8,
                fontStyle: s.italic ? "italic" : "normal",
                fontFamily: s.italic ? "'Cormorant Garamond', serif" : undefined,
                whiteSpace: s.italic ? "pre-line" : undefined,
              }}>{s.body}</p>
            )}
            {s.items && (
              <div style={{ display: "grid", gap: "8px" }}>
                {s.items.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: GREEN, fontSize: "0.4rem", flexShrink: 0, marginTop: "2px", opacity: 0.5 }}>⚔</span>
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
            <a href="/stones/mana" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>MANA STONE</a>
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
