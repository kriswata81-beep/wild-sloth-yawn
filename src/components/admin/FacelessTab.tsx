"use client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const RED = "#e05c5c";
const AMBER = "#f0883e";

const FORMATS = [
  { emoji: "🤲", title: "The Hands Video", duration: "30–60 sec", difficulty: "easy", desc: "Film your hands at 4am. Coffee, journal, stone. No face. Highest trust format." },
  { emoji: "🌅", title: "The Silhouette", duration: "15–45 sec", difficulty: "easy", desc: "Stand in a doorway at sunrise. Film from behind. Cinematic. Zero production." },
  { emoji: "🎬", title: "The B-Roll Drop", duration: "30–60 sec", difficulty: "medium", desc: "6 clips of West Oahu + voiceover. Truck, boots, ocean, journal. Highest share rate." },
  { emoji: "✍️", title: "The Text Drop", duration: "Static or 15 sec", difficulty: "easy", desc: "Black background. Gold text. One sentence per screen. The mystery drop format." },
  { emoji: "👁", title: "The POV Video", duration: "30–60 sec", difficulty: "easy", desc: "Film what you see — not yourself. Walking to your truck at 4am. TikTok's top format." },
  { emoji: "🎙", title: "The Voice Drop", duration: "60–90 sec", difficulty: "easy", desc: "Record in your truck. No face. Just truth. Most intimate format online." },
];

const WEEKLY_PLAN = [
  { day: "MON", format: "Text Drop", action: "Post '👁' + makoa.live. Nothing else.", color: GOLD },
  { day: "WED", format: "Hands Video", action: "Film your hands at 4am. 30 sec. No filter.", color: BLUE },
  { day: "FRI", format: "B-Roll Drop", action: "6 West Oahu clips + voiceover. Film Thu, post Fri.", color: GREEN },
  { day: "SUN", format: "Voice Drop", action: "Truck. Earbuds. 60 sec. Raw truth.", color: AMBER },
];

export default function FacelessTab() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.28em", marginBottom: 8 }}>
          FACELESS VIDEO SYSTEM · MĀKOA CONTENT
        </p>

        {/* Core truth */}
        <div style={{
          background: GOLD_10, border: `1px solid ${GOLD_20}`,
          borderRadius: 10, padding: "16px 18px", marginBottom: 16,
        }}>
          <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: 10 }}>
            WHY FACELESS WORKS FOR MĀKOA
          </p>
          <div style={{ display: "grid", gap: 7 }}>
            {[
              "XI is the face of the order — not you. The movement is bigger than any one man.",
              "Mystery drives curiosity. Curiosity drives clicks. Clicks drive gate submissions.",
              "Faceless content gets shared more — men share what they feel, not who they see.",
              "The algorithm treats silhouettes and hands the same as face videos. Same reach.",
              "You can post daily without burning out. No makeup. No lighting. No performance.",
            ].map((line, i) => (
              <div key={i} style={{ display: "flex", gap: 8 }}>
                <span style={{ color: GREEN, fontSize: "0.44rem", flexShrink: 0 }}>✓</span>
                <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.44rem", lineHeight: 1.5, margin: 0 }}>{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open full page CTA */}
        <a
          href="/faceless"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: GOLD, color: "#000", borderRadius: 8,
            padding: "14px 20px", textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            fontSize: "0.5rem", letterSpacing: "0.18em",
            marginBottom: 20,
          }}
        >
          👁 OPEN FULL FACELESS SYSTEM →
        </a>
        <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.38rem", textAlign: "center", marginBottom: 20 }}>
          Full shot lists · voiceovers · captions · hashtags — all 6 formats
        </p>
      </div>

      {/* Format grid */}
      <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.22em", marginBottom: 10 }}>
        THE 6 FORMATS
      </p>
      <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
        {FORMATS.map(f => (
          <div key={f.title} style={{
            background: "rgba(0,0,0,0.3)", border: "1px solid rgba(176,142,80,0.08)",
            borderRadius: 8, padding: "12px 14px",
            display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{f.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <p style={{ color: "#e8e0d0", fontSize: "0.46rem", fontWeight: 600, margin: 0 }}>{f.title}</p>
                <span style={{
                  background: f.difficulty === "easy" ? "rgba(63,185,80,0.1)" : "rgba(240,136,62,0.1)",
                  border: `1px solid ${f.difficulty === "easy" ? "rgba(63,185,80,0.3)" : "rgba(240,136,62,0.3)"}`,
                  color: f.difficulty === "easy" ? GREEN : AMBER,
                  fontSize: "0.3rem", letterSpacing: "0.1em", padding: "1px 6px", borderRadius: 3,
                }}>
                  {f.difficulty === "easy" ? "EASY" : "MEDIUM"}
                </span>
              </div>
              <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.38rem", margin: "0 0 4px" }}>{f.duration}</p>
              <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.42rem", lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly plan */}
      <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.22em", marginBottom: 10 }}>
        WEEKLY POSTING PLAN — FACELESS
      </p>
      <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
        {WEEKLY_PLAN.map(item => (
          <div key={item.day} style={{
            background: "rgba(0,0,0,0.3)", border: "1px solid rgba(176,142,80,0.08)",
            borderRadius: 8, padding: "12px 14px",
            display: "flex", gap: 12, alignItems: "center",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 6, flexShrink: 0,
              background: `${item.color}12`, border: `1px solid ${item.color}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: item.color, fontSize: "0.36rem", fontWeight: 700 }}>{item.day}</span>
            </div>
            <div>
              <p style={{ color: "#e8e0d0", fontSize: "0.46rem", fontWeight: 600, marginBottom: 2 }}>{item.format}</p>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem", margin: 0 }}>{item.action}</p>
            </div>
          </div>
        ))}
      </div>

      {/* The 3 plays */}
      <div style={{
        background: GOLD_10, border: `1px solid ${GOLD_20}`,
        borderRadius: 10, padding: "16px 18px",
      }}>
        <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.18em", marginBottom: 14 }}>
          DO THESE 3 THINGS THIS WEEK
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {[
            { num: "1", title: "Post the mystery drop", sub: "Right now. Just '👁' and 'makoa.live'. Reply to every comment: 'you'll know when you're ready.'", color: GOLD },
            { num: "2", title: "Film the Hands Video", sub: "Tomorrow at 4am. Your hands on a coffee mug. 30 seconds. One take. No filter. Post it.", color: RED },
            { num: "3", title: "Record a Voice Drop", sub: "Sit in your truck. Earbuds in. Talk for 60 seconds. Don't read a script. Just tell the truth.", color: GREEN },
          ].map(p => (
            <div key={p.num} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: `${p.color}15`, border: `1px solid ${p.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ color: p.color, fontSize: "0.6rem", fontWeight: 700 }}>{p.num}</span>
              </div>
              <div>
                <p style={{ color: "#e8e0d0", fontSize: "0.46rem", fontWeight: 600, marginBottom: 2 }}>{p.title}</p>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem", lineHeight: 1.5, margin: 0 }}>{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
