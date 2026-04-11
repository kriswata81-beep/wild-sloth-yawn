"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const BG = "#04060a";
const RED = "#f85149";
const GREEN = "#3fb950";
const PURPLE = "#bc8cff";
const ORANGE = "#f0883e";

// ─── Gathering Types ─────────────────────────────────────────────────────────
const GATHERINGS = [
  {
    id: "weight-room",
    name: "The Weight Room",
    subtitle: "Weekly Post-Ice Healing Circle",
    accent: RED,
    accentBg: "rgba(248,81,73,0.1)",
    accentBorder: "rgba(248,81,73,0.25)",
    frequency: "Every Saturday · 5:30 AM",
    duration: "90 minutes",
    location: "Local chapter — outdoor or gym",
    icon: "🔴",
    description:
      "The Weight Room is where brothers carry what they cannot carry alone. After the ice bath, we sit in circle. One brother speaks. The rest hold space. No advice. No fixing. Just presence. This is the heartbeat of the Order.",
    format: [
      "Ice bath or cold exposure (4:00 AM optional)",
      "Circle opens — candle lit, oath spoken",
      "One brother carries the weight (5-10 min uninterrupted)",
      "Circle responds — mirrors only, no advice",
      "Closing — hands in, commitment spoken",
    ],
    whoAttends: "All classes — Nā Koa, Mana, Ali'i",
    cost: "Free with membership",
  },
  {
    id: "ke-ala",
    name: "Ke Ala",
    subtitle: "Weekly Warrior Training",
    accent: GREEN,
    accentBg: "rgba(63,185,80,0.1)",
    accentBorder: "rgba(63,185,80,0.25)",
    frequency: "Every Wednesday · 6:00 PM",
    duration: "2 hours",
    location: "Local chapter — park, beach, or gym",
    icon: "🟢",
    description:
      "Ke Ala means 'The Path.' This is where brothers sharpen the blade — physical training, skill development, and tactical planning for routes and personal missions. Part workout, part war room.",
    format: [
      "Formation — check-in, one-line status from each brother",
      "Physical training block (45 min)",
      "Skill session — route strategy, financial literacy, trade skill",
      "Debrief and weekly commitments",
    ],
    whoAttends: "All classes",
    cost: "Free with membership",
  },
  {
    id: "po-mahina",
    name: "Pō Mahina",
    subtitle: "Monthly Full Moon 72HR",
    accent: GOLD,
    accentBg: GOLD_10,
    accentBorder: GOLD_20,
    frequency: "Once per month · Full moon weekend",
    duration: "72 hours (Friday–Sunday)",
    location: "Regional host chapter",
    icon: "🌕",
    description:
      "Under the full moon, brothers from across the region converge for 72 hours of intensive brotherhood. This is a mini-MAYDAY — ice baths, circles, route workshops, and bonfire. The monthly reset.",
    format: [
      "Friday — Arrival, circle, pūpū",
      "Saturday — 4AM ice bath, Weight Room, workshops, bonfire",
      "Sunday — Sunrise commitments, stones ceremony, send-off",
    ],
    whoAttends: "All classes — hosted by local Ali'i chapter",
    cost: "Included in annual dues · Travel on your own",
  },
  {
    id: "ka-hoike",
    name: "Ka Hoʻike",
    subtitle: "Quarterly Regional Summit",
    accent: PURPLE,
    accentBg: "rgba(188,140,255,0.1)",
    accentBorder: "rgba(188,140,255,0.25)",
    frequency: "4x per year · Regional rotation",
    duration: "Full weekend",
    location: "Rotating regional host city",
    icon: "🟣",
    description:
      "Ka Hoʻike means 'The Presentation.' Quarterly summits where chapters present their growth, routes report revenue, and the Order recognizes rank advancements. This is where patches, coins, and milestone rewards are earned.",
    format: [
      "Friday — Chapter arrivals, Ali'i council pre-session",
      "Saturday — Route presentations, rank ceremonies, workshops",
      "Saturday night — Recognition dinner + bonfire",
      "Sunday — Strategic planning for next quarter",
    ],
    whoAttends: "Mana and Ali'i class · Nā Koa by invitation",
    cost: "+$199 registration",
  },
  {
    id: "makahiki",
    name: "Makahiki",
    subtitle: "Annual Resort Gathering",
    accent: ORANGE,
    accentBg: "rgba(240,136,62,0.1)",
    accentBorder: "rgba(240,136,62,0.25)",
    frequency: "Once per year · May",
    duration: "4 days (Thu–Sun)",
    location: "Hawaii — where the Order was founded",
    icon: "🟠",
    description:
      "Makahiki is the ancient Hawaiian festival of peace, harvest, and renewal. Our annual gathering returns to Hawaii — the birthplace of the Order — for the largest brotherhood event of the year. New co-founders are seated, the charter is renewed, and the next year's mission is set.",
    format: [
      "Thursday — Ali'i arrive, co-founder council",
      "Friday — All classes arrive, War Room opens, 72HR begins",
      "Saturday — The full forge: ice, Weight Room, workshops, bonfire",
      "Sunday — Founding Dinner (Ali'i table), Stones, The Send",
    ],
    whoAttends: "All classes worldwide",
    cost: "+$399 registration · Hotel + travel separate",
  },
];

export default function GatheringsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e5e7eb" }}>
      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "80px 20px 48px",
          borderBottom: `1px solid ${GOLD_20}`,
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: GOLD,
            marginBottom: 16,
          }}
        >
          THE ORDER GATHERS
        </div>
        <h1
          style={{
            fontSize: "clamp(2rem, 6vw, 3.2rem)",
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 16px",
            letterSpacing: "0.04em",
          }}
        >
          GATHERINGS
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            maxWidth: 520,
            margin: "0 auto",
            fontSize: "1rem",
            lineHeight: 1.7,
          }}
        >
          Five rhythms. Weekly circles. Monthly moons. Quarterly summits. One
          annual pilgrimage. This is how brothers stay forged.
        </p>
      </section>

      {/* Calendar Rhythm Visual */}
      <section style={{ padding: "48px 20px", maxWidth: 700, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 12,
            marginBottom: 48,
          }}
        >
          {GATHERINGS.map((g) => (
            <button
              key={g.id}
              onClick={() => setExpanded(expanded === g.id ? null : g.id)}
              style={{
                background: expanded === g.id ? g.accentBg : "rgba(255,255,255,0.03)",
                border: `1px solid ${expanded === g.id ? g.accentBorder : "rgba(255,255,255,0.08)"}`,
                borderRadius: 12,
                padding: "16px 8px",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>{g.icon}</div>
              <div
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: g.accent,
                  fontWeight: 600,
                }}
              >
                {g.name.length > 10 ? g.name.split(" ")[0] : g.name}
              </div>
            </button>
          ))}
        </div>

        {/* Gathering Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {GATHERINGS.map((g) => {
            const isOpen = expanded === g.id;
            return (
              <div
                key={g.id}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${isOpen ? g.accentBorder : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 16,
                  overflow: "hidden",
                  transition: "border-color 0.3s",
                }}
              >
                {/* Header */}
                <button
                  onClick={() => setExpanded(isOpen ? null : g.id)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "24px 24px 20px",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: g.accentBg,
                      border: `1px solid ${g.accentBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.4rem",
                      flexShrink: 0,
                    }}
                  >
                    {g.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        color: g.accent,
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        margin: 0,
                        letterSpacing: "0.03em",
                      }}
                    >
                      {g.name}
                    </h3>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.82rem",
                        marginTop: 4,
                      }}
                    >
                      {g.subtitle}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.35)",
                        fontSize: "0.72rem",
                        marginTop: 6,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {g.frequency}
                    </div>
                  </div>
                  <div
                    style={{
                      color: GOLD,
                      fontSize: "1.2rem",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      marginTop: 4,
                    }}
                  >
                    ▾
                  </div>
                </button>

                {/* Expanded Content */}
                {isOpen && (
                  <div
                    style={{
                      padding: "0 24px 28px",
                      borderTop: `1px solid ${g.accentBorder}`,
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "0.88rem",
                        lineHeight: 1.7,
                        marginTop: 20,
                        marginBottom: 20,
                      }}
                    >
                      {g.description}
                    </p>

                    {/* Details Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginBottom: 20,
                      }}
                    >
                      <div
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 10,
                          padding: "12px 14px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.6rem",
                            color: "rgba(255,255,255,0.4)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: 4,
                          }}
                        >
                          Duration
                        </div>
                        <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 600 }}>
                          {g.duration}
                        </div>
                      </div>
                      <div
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 10,
                          padding: "12px 14px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.6rem",
                            color: "rgba(255,255,255,0.4)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: 4,
                          }}
                        >
                          Cost
                        </div>
                        <div style={{ color: g.accent, fontSize: "0.85rem", fontWeight: 600 }}>
                          {g.cost}
                        </div>
                      </div>
                      <div
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 10,
                          padding: "12px 14px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.6rem",
                            color: "rgba(255,255,255,0.4)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: 4,
                          }}
                        >
                          Location
                        </div>
                        <div style={{ color: "#fff", fontSize: "0.85rem" }}>{g.location}</div>
                      </div>
                      <div
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 10,
                          padding: "12px 14px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.6rem",
                            color: "rgba(255,255,255,0.4)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: 4,
                          }}
                        >
                          Who Attends
                        </div>
                        <div style={{ color: "#fff", fontSize: "0.85rem" }}>{g.whoAttends}</div>
                      </div>
                    </div>

                    {/* Format */}
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: g.accent,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        marginBottom: 10,
                        fontWeight: 600,
                      }}
                    >
                      FORMAT
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {g.format.map((step, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: g.accentBg,
                              border: `1px solid ${g.accentBorder}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.6rem",
                              color: g.accent,
                              fontWeight: 700,
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            {i + 1}
                          </div>
                          <div
                            style={{
                              color: "rgba(255,255,255,0.55)",
                              fontSize: "0.82rem",
                              lineHeight: 1.5,
                            }}
                          >
                            {step}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* MAYDAY CTA */}
      <section
        style={{
          padding: "48px 20px 60px",
          textAlign: "center",
          borderTop: `1px solid ${GOLD_20}`,
        }}
      >
        <div
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: GOLD,
            marginBottom: 12,
          }}
        >
          THE FIRST GATHERING
        </div>
        <h2
          style={{
            fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)",
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 12px",
          }}
        >
          MAYDAY MĀKOA 2026
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "0.9rem",
            marginBottom: 28,
          }}
        >
          72 hours. 3 days. The founding of the Order.
          <br />
          May 1–3, 2026 · Kapolei, Oʻahu
        </p>
        <a
          href="/founding48"
          style={{
            display: "inline-block",
            padding: "14px 40px",
            background: `linear-gradient(135deg, ${GOLD}, #8a6d3b)`,
            color: "#000",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderRadius: 8,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
        >
          SECURE YOUR SEAT
        </a>

        {/* Back Nav */}
        <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 24 }}>
          <a
            href="/gate"
            style={{
              color: GOLD,
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textDecoration: "none",
              opacity: 0.6,
            }}
          >
            ← THE GATE
          </a>
          <a
            href="/stones/alii"
            style={{
              color: GOLD,
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textDecoration: "none",
              opacity: 0.6,
            }}
          >
            ALI'I STONE →
          </a>
        </div>
      </section>
    </div>
  );
}
