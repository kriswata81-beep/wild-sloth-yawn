"use client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const RED = "#e05c5c";

export default function DropsTab() {
  return (
    <div>
      <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.28em", marginBottom: 16 }}>
        100 MESSAGE DROPS · GARY VEE MODEL
      </p>

      {/* The model */}
      <div style={{
        background: "rgba(176,142,80,0.04)", border: `1px solid ${GOLD_20}`,
        borderRadius: 10, padding: "16px 18px", marginBottom: 16,
      }}>
        <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: 10 }}>
          THE MODEL — HOW GARY VEE DOES IT
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {[
            { icon: "1", text: "He talks. His team clips it into 100 posts. You don't have a team — so we pre-wrote 100 posts for you.", color: GOLD },
            { icon: "2", text: "Every post is a different angle on the same truth. Isolation. Brotherhood. West Oahu. 4am. The gate.", color: BLUE },
            { icon: "3", text: "Post 5 a day. Different platforms. Different times. The algorithm rewards volume.", color: GREEN },
            { icon: "4", text: "Don't overthink it. Copy. Paste. Post. Move on. The next one is already written.", color: GOLD },
            { icon: "5", text: "The man who needs this will see it on the 7th post. Not the 1st. Volume is the strategy.", color: RED },
          ].map(item => (
            <div key={item.icon} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                background: `${item.color}15`, border: `1px solid ${item.color}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: item.color, fontSize: "0.5rem", fontWeight: 700 }}>{item.icon}</span>
              </div>
              <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.44rem", lineHeight: 1.6, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Daily plan */}
      <div style={{
        background: "rgba(0,0,0,0.3)", border: "1px solid rgba(176,142,80,0.1)",
        borderRadius: 10, padding: "16px 18px", marginBottom: 16,
      }}>
        <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: 12 }}>
          DAILY POSTING PLAN
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {[
            { time: "6AM", action: "Post 1 TRUTH drop on Facebook. Long form. No hashtags.", color: RED },
            { time: "9AM", action: "Post 1 PUNCH drop on IG. Short. 3 lines max.", color: GOLD },
            { time: "12PM", action: "Post 1 ENGAGE drop. Ask a question. Reply to every comment.", color: BLUE },
            { time: "3PM", action: "Post 1 MYSTERY drop on IG + X. Just the text. Nothing else.", color: GOLD_DIM },
            { time: "6PM", action: "Post 1 STORY or DEEP drop on Facebook. This is your best reach window.", color: GREEN },
          ].map(item => (
            <div key={item.time} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              padding: "10px 12px", background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(176,142,80,0.06)", borderRadius: 6,
            }}>
              <span style={{
                color: item.color, fontSize: "0.4rem", fontWeight: 700,
                letterSpacing: "0.08em", flexShrink: 0, width: 32,
              }}>{item.time}</span>
              <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.42rem", lineHeight: 1.5, margin: 0 }}>{item.action}</p>
            </div>
          ))}
        </div>
        <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem", marginTop: 12, lineHeight: 1.6 }}>
          5 posts a day = 35 posts a week = 140 posts a month. At that volume, the right man will find the gate.
        </p>
      </div>

      {/* Open full page */}
      <a
        href="/drops"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          background: GOLD, color: "#000", borderRadius: 8,
          padding: "14px 20px", textDecoration: "none",
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          fontSize: "0.5rem", letterSpacing: "0.18em",
          marginBottom: 12,
        }}
      >
        ⚡ OPEN ALL 100 DROPS →
      </a>
      <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem", textAlign: "center" }}>
        Filter by angle · Copy individual drops · Copy all at once · Shuffle for variety
      </p>
    </div>
  );
}
