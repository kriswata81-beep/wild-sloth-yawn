"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const RED = "#f85149";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const PURPLE = "#bc8cff";
const ORANGE = "#f0883e";
const BG = "#04060a";

// ── The Mākoa Year — same every year for the next 100 years ──────────────────

const WEEKLY = [
  {
    day: "Wednesday",
    time: "3:33 AM",
    name: "Wake Call",
    detail: "The 3:33 signal. Brothers receive the wake call. Darkness. Discipline. The day starts before the world wakes up.",
    accent: RED,
  },
  {
    day: "Wednesday",
    time: "4:30 AM",
    name: "Elite Reset Training",
    detail: "Ice bath or cold exposure + physical training. The body is the first battlefield. Show up, do the work, reset the mind.",
    accent: RED,
  },
  {
    day: "Saturday",
    time: "5:30 AM",
    name: "The Weight Room",
    detail: "Post-ice healing circle. One brother carries the weight. The rest hold space. No advice. No fixing. Just presence. This is the heartbeat of the Order.",
    accent: RED,
  },
  {
    day: "Saturday",
    time: "9:00 AM – 2:00 PM",
    name: "Nā Koa Academy",
    detail: "Trade skills, financial literacy, route operations, business building. Brother teaches brother. This is where Nā Koa rise to Mana.",
    accent: GREEN,
  },
];

const MONTHLY = {
  name: "Mākoa House — Community War Room & Outreach",
  detail: "Monthly chapter meeting. Route reports, community service planning, brother intake, rank advancement reviews. Every chapter runs the same format.",
  accent: BLUE,
  format: [
    "Route revenue reports (Mana class presents)",
    "New brother introductions",
    "Community outreach planning",
    "Rank advancement nominations",
    "Weight Room — extended circle",
  ],
};

const QUARTERLY = {
  name: "Ka Hoʻike — Regional Mākoa 72HR",
  detail: "Quarterly regional gathering at a hotel. Chapters converge for 72 hours. War Room sessions, rank ceremonies, route presentations, bonfire.",
  accent: PURPLE,
  cost: "+$199 registration",
  format: [
    "Friday — Chapter arrivals, Ali'i council pre-session",
    "Saturday — Route presentations, rank ceremonies, workshops",
    "Saturday night — Recognition dinner + bonfire",
    "Sunday — Strategic planning for next quarter",
  ],
};

const ANNUAL = {
  name: "Makahiki — Annual Resort Gathering",
  detail: "The Order returns to Hawaiʻi — where it was founded. 4 days at a resort. Bring your ʻohana. November–December, during the traditional Hawaiian Makahiki season (winter harvest). New Ali'i are recognized, the charter is renewed, and the next year's mission is set. Always in Hawaiʻi.",
  accent: ORANGE,
  cost: "+$399 registration · Hotel + travel separate",
  format: [
    "Thursday — Ali'i arrive, director council",
    "Friday — All classes arrive, War Room opens, 72HR begins",
    "Saturday — The full forge: ice, Weight Room, workshops, bonfire",
    "Sunday — Founding Dinner (Ali'i table), Stones, The Send",
    "ʻOhana Day — Family activities, beach day, lūʻau",
  ],
};

// MAYDAY is separate — founding event only (May 2026), never repeated
const MAYDAY = {
  name: "MAYDAY — The Founding (2026 Only)",
  detail: "The founding of the Order. May 1–3, 2026, Kapolei, Oʻahu. 48 brothers. Charter signed. Ali'i class seated. This event never repeats — it becomes Makahiki starting winter 2026.",
  accent: GOLD,
  cost: "$149–$999 (founding tickets)",
};

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const QUARTER_MONTHS = [2, 5, 8]; // Mar, Jun, Sep — quarterly Ka Hoʻike
const MAKAHIKI_MONTH = 10; // November — Makahiki (traditional Hawaiian winter harvest season)
const MAYDAY_MONTH = 4; // May — MAYDAY 2026 founding only

export default function CalendarPage() {
  const [activeMonth, setActiveMonth] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e5e7eb" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 20px 40px", borderBottom: `1px solid ${GOLD_20}` }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
          THE MĀKOA YEAR
        </div>
        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 700, color: "#fff", margin: "0 0 12px", letterSpacing: "0.04em" }}>
          12-MONTH FORMATION
        </h1>
        <p style={{ color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "0 auto", fontSize: "0.9rem", lineHeight: 1.7 }}>
          Same rhythm. Every year. For the next 100 years.<br />
          Weekly discipline. Monthly formation. Quarterly summits. Annual pilgrimage.
        </p>
      </section>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px" }}>

        {/* ── WEEKLY RHYTHM ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: RED, marginBottom: 20, fontWeight: 600 }}>
            WEEKLY — EVERY WEEK
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {WEEKLY.map((w, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid rgba(248,81,73,0.12)`,
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}>
                <div style={{
                  minWidth: 56,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>{w.day}</div>
                  <div style={{ fontSize: "0.9rem", color: w.accent, fontWeight: 700 }}>{w.time}</div>
                </div>
                <div>
                  <div style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600, marginBottom: 4 }}>{w.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", lineHeight: 1.6 }}>{w.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Commitment callout */}
          <div style={{
            marginTop: 16,
            background: "rgba(248,81,73,0.05)",
            border: `1px solid rgba(248,81,73,0.15)`,
            borderRadius: 10,
            padding: "14px 18px",
            textAlign: "center",
          }}>
            <div style={{ color: RED, fontSize: "0.7rem", fontWeight: 700, marginBottom: 4 }}>
              5 DAYS A MONTH · 5 HOURS A DAY
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", lineHeight: 1.6 }}>
              Wednesday training (2 hrs) + Saturday circle & academy (5 hrs) = ~8-12 hrs/month.<br />
              Sustainable. Consistent. Enough to change your life.
            </div>
          </div>
        </div>

        {/* ── MONTHLY RHYTHM ────────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: BLUE, marginBottom: 20, fontWeight: 600 }}>
            MONTHLY — MĀKOA HOUSE
          </div>
          <div style={{
            background: "rgba(88,166,255,0.04)",
            border: `1px solid rgba(88,166,255,0.15)`,
            borderRadius: 14,
            padding: "20px 22px",
          }}>
            <div style={{ color: "#fff", fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>{MONTHLY.name}</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", lineHeight: 1.7, marginBottom: 16 }}>{MONTHLY.detail}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {MONTHLY.format.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE, flexShrink: 0 }} />
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>{f}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 12-MONTH GRID ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: GOLD, marginBottom: 20, fontWeight: 600 }}>
            THE YEAR AT A GLANCE
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {MONTHS.map((m, i) => {
              const isQuarter = QUARTER_MONTHS.includes(i);
              const isMakahiki = i === MAKAHIKI_MONTH;
              const isMayday = i === MAYDAY_MONTH;
              const accent = isMakahiki ? ORANGE : isMayday ? GOLD : isQuarter ? PURPLE : "rgba(255,255,255,0.08)";
              const bg = isMakahiki ? "rgba(240,136,62,0.08)" : isMayday ? GOLD_10 : isQuarter ? "rgba(188,140,255,0.06)" : "rgba(255,255,255,0.02)";

              return (
                <button
                  key={m}
                  onClick={() => setActiveMonth(activeMonth === i ? null : i)}
                  style={{
                    background: bg,
                    border: `1px solid ${accent}`,
                    borderRadius: 10,
                    padding: "12px 8px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: isMakahiki ? ORANGE : isMayday ? GOLD : isQuarter ? PURPLE : "rgba(255,255,255,0.5)" }}>
                    {m}
                  </div>
                  {isMakahiki && <div style={{ fontSize: "0.45rem", color: ORANGE, marginTop: 4 }}>MAKAHIKI</div>}
                  {isMayday && <div style={{ fontSize: "0.45rem", color: GOLD, marginTop: 4 }}>MAYDAY</div>}
                  {isQuarter && !isMakahiki && !isMayday && <div style={{ fontSize: "0.45rem", color: PURPLE, marginTop: 4 }}>KA HOʻIKE</div>}
                  <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: RED }} title="Weekly" />
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: BLUE }} title="Monthly" />
                    {isQuarter && <div style={{ width: 4, height: 4, borderRadius: "50%", background: PURPLE }} title="Quarterly" />}
                    {isMakahiki && <div style={{ width: 4, height: 4, borderRadius: "50%", background: ORANGE }} title="Makahiki" />}
                    {isMayday && <div style={{ width: 4, height: 4, borderRadius: "50%", background: GOLD }} title="MAYDAY" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── QUARTERLY ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: PURPLE, marginBottom: 20, fontWeight: 600 }}>
            QUARTERLY — KA HOʻIKE REGIONAL 72HR
          </div>
          <div style={{
            background: "rgba(188,140,255,0.04)",
            border: `1px solid rgba(188,140,255,0.15)`,
            borderRadius: 14,
            padding: "20px 22px",
          }}>
            <div style={{ color: "#fff", fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>{QUARTERLY.name}</div>
            <div style={{ color: PURPLE, fontSize: "0.75rem", marginBottom: 10 }}>{QUARTERLY.cost}</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", lineHeight: 1.7, marginBottom: 16 }}>{QUARTERLY.detail}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {QUARTERLY.format.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: PURPLE, flexShrink: 0 }} />
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>{f}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ANNUAL — MAKAHIKI ─────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: ORANGE, marginBottom: 20, fontWeight: 600 }}>
            ANNUAL — MAKAHIKI · ALWAYS IN HAWAIʻI
          </div>
          <div style={{
            background: "rgba(240,136,62,0.04)",
            border: `1px solid rgba(240,136,62,0.15)`,
            borderRadius: 14,
            padding: "20px 22px",
          }}>
            <div style={{ color: "#fff", fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>{ANNUAL.name}</div>
            <div style={{ color: ORANGE, fontSize: "0.75rem", marginBottom: 10 }}>{ANNUAL.cost}</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", lineHeight: 1.7, marginBottom: 16 }}>{ANNUAL.detail}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {ANNUAL.format.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>{f}</div>
                </div>
              ))}
            </div>

            {/* Hawaii anchor */}
            <div style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "rgba(240,136,62,0.06)",
              borderRadius: 8,
              border: `1px solid rgba(240,136,62,0.1)`,
            }}>
              <div style={{ color: ORANGE, fontSize: "0.65rem", fontWeight: 700, marginBottom: 4 }}>
                WHY ALWAYS HAWAIʻI?
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", lineHeight: 1.7 }}>
                The Order was founded in Hawaiʻi. Makahiki returns to the source — every year. This is the pilgrimage. Brothers from every chapter, every region, every country converge where it all began. Bring your ʻohana. This is home.
              </div>
            </div>
          </div>
        </div>

        {/* ── 5x5 GROWTH ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: GREEN, marginBottom: 20, fontWeight: 600 }}>
            THE 5x5 — BROTHER BRINGS BROTHER
          </div>
          <div style={{
            background: "rgba(63,185,80,0.04)",
            border: `1px solid rgba(63,185,80,0.15)`,
            borderRadius: 14,
            padding: "20px 22px",
          }}>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", lineHeight: 1.8, marginBottom: 16 }}>
              Every brother commits to bringing <strong style={{ color: "#fff" }}>one brother per year</strong> into the Order. Not 5. Not 10. One man you believe in. One man who needs this. That&apos;s how the Order grows — brother by brother, not by marketing.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { label: "YEAR 1", val: "48 → 96", sub: "Founding doubles" },
                { label: "YEAR 3", val: "~200", sub: "4 chapters" },
                { label: "YEAR 5", val: "~500", sub: "10+ chapters" },
              ].map((g, i) => (
                <div key={i} style={{
                  background: "rgba(63,185,80,0.06)",
                  borderRadius: 8,
                  padding: "12px 10px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "0.5rem", color: GREEN, letterSpacing: "0.1em", marginBottom: 4 }}>{g.label}</div>
                  <div style={{ fontSize: "1rem", color: "#fff", fontWeight: 700 }}>{g.val}</div>
                  <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{g.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <section style={{ padding: "40px 20px 60px", textAlign: "center", borderTop: `1px solid ${GOLD_20}` }}>
        <a href="/founding48" style={{
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
        }}>
          JOIN THE FOUNDING
        </a>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 24 }}>
          <a href="/gatherings" style={{ color: GOLD, fontSize: "0.72rem", letterSpacing: "0.08em", textDecoration: "none", opacity: 0.5 }}>
            ← GATHERINGS
          </a>
          <a href="/gate" style={{ color: GOLD, fontSize: "0.72rem", letterSpacing: "0.08em", textDecoration: "none", opacity: 0.5 }}>
            THE GATE →
          </a>
        </div>
      </section>
    </div>
  );
}
