"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TIMELINE } from "@/lib/timeline";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const FLAME = "#ff4e1f";
const BG = "#04060a";

function useCountdown(target: Date) {
  const zero = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return zero;
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(zero);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return mounted ? time : zero;
}

function CountdownBlock({ target, label, color = GOLD }: { target: Date; label: string; color?: string }) {
  const { days, hours, minutes, seconds } = useCountdown(target);
  return (
    <div>
      <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "13px", letterSpacing: "0.2em", textAlign: "center", marginBottom: 10 }}>
        {label}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { label: "DAYS", val: days },
          { label: "HRS", val: hours },
          { label: "MIN", val: minutes },
          { label: "SEC", val: seconds },
        ].map(t => (
          <div key={t.label} style={{
            flex: 1, background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(176,142,80,0.12)",
            borderRadius: 6, padding: "12px 4px", textAlign: "center",
          }}>
            <p style={{
              color: color, fontSize: "1.4rem", fontWeight: 700, lineHeight: 1,
              fontFamily: "'JetBrains Mono', monospace",
            }}>{String(t.val).padStart(2, "0")}</p>
            <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "11px", letterSpacing: "0.15em", marginTop: 4 }}>{t.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const WEEKENDS = [
  {
    num: "01",
    dates: "May 1–3",
    moon: "🌕 Flower Moon",
    label: "GATE OPENS · WEEKEND 1",
    detail: "The founding month begins. Gate opens May 1 at 9AM HST. First 5 Aliʻi teams arrive. Ice bath. War Room. Founding fire.",
    color: GOLD,
    border: GOLD_40,
  },
  {
    num: "02",
    dates: "May 8–10",
    moon: "",
    label: "WEEKEND 2",
    detail: "Second cohort of 5 Aliʻi teams. Elite Reset Training. Mastermind. Territory mapping.",
    color: GOLD_DIM,
    border: GOLD_20,
  },
  {
    num: "03",
    dates: "May 15–17",
    moon: "",
    label: "WEEKEND 3",
    detail: "Third cohort of 5 Aliʻi teams. Trade academies. Network sessions. Small group deep work.",
    color: GOLD_DIM,
    border: GOLD_20,
  },
  {
    num: "04",
    dates: "May 29–31",
    moon: "🌕 Blue Moon",
    label: "WEEKEND 4 · SEALING",
    detail: "Final cohort of 5 Aliʻi teams. The Founding 48 is sealed at 11:11 PM HST on the Blue Moon. The order is born.",
    color: GOLD,
    border: GOLD_40,
  },
];

const RHYTHM = [
  { time: "Fri · 12PM", event: "HNL Pickup", detail: "Mākoa van collects the war party from HNL. West Oahu bound." },
  { time: "Fri · 2PM", event: "Check-In · Embassy Suites Kapolei", detail: "Room keys. Class assignment. Gear pack. No phones after this." },
  { time: "Fri · 6PM", event: "War Room Roll Call", detail: "All Aliʻi seated. XI opens the founding session. The order begins." },
  { time: "Fri · 9PM", event: "Brotherhood Circle", detail: "First circle. Lite pūpū. Men speak. No performance. Just truth." },
  { time: "Sat · 3AM", event: "Wake Call", detail: "The van is running. No alarm needed. You know." },
  { time: "Sat · 4AM", event: "Ice Bath · Ko Olina", detail: "The moon sets over the Pacific. You go in. The cold is the ritual." },
  { time: "Sat · 7AM", event: "Morning Formation", detail: "Oath. Silence. The sun rises over the Koʻolau." },
  { time: "Sat · 9AM", event: "The War Room", detail: "Order structure. 80/10/10 doctrine. Territory rights. Trade Co. formation." },
  { time: "Sat · 1PM", event: "Trade Academy", detail: "Labor routes. Knowledge routes. Territory dues. What your chapter builds." },
  { time: "Sat · 6PM", event: "Aliʻi Fire Ceremony", detail: "Founding Aliʻi only. The charter is sealed. The order is founded." },
  { time: "Sat · 7PM", event: "Bonfire · All Brothers", detail: "Open fire. Lite pūpū. Stories. The brotherhood is one." },
  { time: "Sun · 4AM", event: "Second Ice Bath", detail: "Who comes back? The ice reveals character on the second morning." },
  { time: "Sun · 7AM", event: "Sunrise Commitments", detail: "90-day commitments declared. Each Aliʻi states what their chapter will build." },
  { time: "Sun · 9AM", event: "Co-Founders Charter", detail: "Aliʻi Council seated. Palapala signed. Mākoa Trade Co. chapters activated." },
  { time: "Sun · 12PM", event: "Departure · HNL Dropoff", detail: "Each Aliʻi returns home with a rank, a charter, and a team." },
];

const FAQS = [
  {
    q: "What is Mayday 48?",
    a: "Mayday 48 is the once-ever founding event of the Mākoa Brotherhood. Four weekends across May 2026 in West Oʻahu. 20 Aliʻi team leaders take the oath and sign the Palapala. 48 total oath signatures — 20 Aliʻi and the 28 brothers they bring. The Founding 48 closes permanently at the May 31 Blue Moon.",
  },
  {
    q: "Who is this for?",
    a: "Men who lead. Team leaders, business owners, tradesmen, builders — men who carry weight and want a brotherhood that matches that weight. You must bring a team of 3–5 brothers. The Aliʻi seat is not a solo ticket.",
  },
  {
    q: "What's included in the $4,997?",
    a: "Five days (Tue–Sun) at Embassy Suites Kapolei. All meals at the table. Airport pickup and dropoff from HNL. Both ice baths. All War Room and Trade Co. sessions. The founding fire. The Aliʻi gear pack — ring, patch, coin, manual. 1% equity in Mākoa Trade Co. Territorial charter rights. Seat on the Aliʻi Council for life.",
  },
  {
    q: "What do I bring?",
    a: "Red shirt — solid, nothing on it. Black slacks. Your own towel. A notebook. Pack light. No devices during sessions. Everything else is on the table.",
  },
  {
    q: "Can I attend without bringing a team?",
    a: "No. The Aliʻi seat requires a war party of 3–5 brothers. You are not just claiming a seat — you are chartering a chapter. The brothers you bring become your founding team. If you don't have a team yet, the Palapala drop period (Apr 21 – May 1) is your window to form one.",
  },
  {
    q: "What happens after Mayday 48?",
    a: "Each Aliʻi returns home and opens their territory's chapter under the Mākoa Trade Co. framework. The 80/10/10 split activates: 80% stays in your territory, 10% to the Order, 10% to the Mayday 48 Aliʻi pool — split among the 20 founding Aliʻi forever. Your 0.5% of global Mākoa Trade Co. revenue is perpetual and inheritable.",
  },
  {
    q: "Can overseas teams attend?",
    a: "Yes. Tokyo, Berlin, Vancouver, Lagos, São Paulo, Cape Town, Sydney — every city is a potential chapter. Overseas Aliʻi fly themselves to HNL. The Mākoa van picks up from the airport. The War Party Travel Pack (available at /gate) covers logistics coordination for international teams.",
  },
  {
    q: "What is the War Party Travel Pack?",
    a: "An add-on for teams flying in from outside Hawaiʻi. Includes: HNL airport coordination, hotel block access at the Embassy Suites Kapolei group rate, XI pre-arrival briefing, and a dedicated Mākoa channel for your war party before the event. Available when you claim your Aliʻi seat at /gate.",
  },
];

function Founding48Content() {
  const searchParams = useSearchParams();
  const [handle, setHandle] = useState("Brother");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openRhythm, setOpenRhythm] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const urlHandle = searchParams.get("h") || searchParams.get("handle") || "";
    const storedHandle = typeof window !== "undefined" ? sessionStorage.getItem("makoa_handle") || "" : "";
    setHandle(urlHandle || storedHandle || "Brother");
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, [searchParams]);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes goldGlow { 0%,100% { box-shadow: 0 0 16px rgba(176,142,80,0.15); } 50% { box-shadow: 0 0 40px rgba(176,142,80,0.4); } }
        @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.35;} }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "56px 24px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_40}, transparent)`, marginBottom: 40 }} />

        <p style={{
          color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.35em",
          marginBottom: 16, animation: "fadeUp 0.8s ease 0.1s both",
        }}>
          MAYDAY 48 · THE FOUNDING MONTH
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: GOLD,
          fontSize: "clamp(2.4rem, 9vw, 4.2rem)",
          lineHeight: 1.05,
          margin: "0 0 16px",
          animation: "fadeUp 0.8s ease 0.2s both",
        }}>
          West Oʻahu<br />4 Weekends<br />2 Full Moons
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "rgba(232,224,208,0.6)",
          fontSize: "1.15rem",
          marginBottom: 24,
          animation: "fadeUp 0.8s ease 0.35s both",
        }}>
          May 1–31, 2026 · Embassy Suites Kapolei · Hawaiʻi
        </p>

        {/* Core numbers */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10, maxWidth: 380, margin: "0 auto 32px",
          animation: "fadeUp 0.8s ease 0.45s both",
        }}>
          {[
            { val: "20", label: "Aliʻi Teams" },
            { val: "48", label: "Oath Signatures" },
            { val: "1×", label: "Ever" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(176,142,80,0.05)",
              border: `1px solid ${GOLD_20}`,
              borderRadius: 8, padding: "14px 8px", textAlign: "center",
            }}>
              <p style={{ color: GOLD, fontSize: "1.6rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{s.val}</p>
              <p style={{ color: GOLD_DIM, fontSize: "12px", letterSpacing: "0.12em", marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 400, margin: "0 auto", animation: "fadeUp 0.8s ease 0.55s both" }}>
          <CountdownBlock target={TIMELINE.GATE_OPENS} label="🌕 GATE OPENS (MAY 1 FULL MOON) IN" color={GOLD} />
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px" }}>

        {/* ── WHAT IS MAYDAY 48 ─────────────────────────────────────────────── */}
        <div style={{
          margin: "40px 0 32px",
          background: "rgba(176,142,80,0.03)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "28px 22px",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.28em", marginBottom: 16 }}>
            WHAT IS MAYDAY 48?
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "1.15rem",
            lineHeight: 2.0,
            marginBottom: 20,
          }}>
            Mayday 48 is the once-ever founding event of the Mākoa Brotherhood.
          </p>
          <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "17px", lineHeight: 1.9, marginBottom: 16 }}>
            Four weekends across May 2026. West Oʻahu. 20 Aliʻi team leaders take the oath and sign the Palapala. 48 total oath signatures — 20 Aliʻi and the 28 brothers they bring.
          </p>
          <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "17px", lineHeight: 1.9, marginBottom: 16 }}>
            The Founding 48 closes permanently at the May 31 Blue Moon. There will be cohorts after. There will be no second Founding 48.
          </p>
          <div style={{ height: 1, background: GOLD_20, margin: "20px 0" }} />
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "1rem",
            lineHeight: 1.9,
            textAlign: "center",
          }}>
            The Flower Moon opens the month.<br />The Blue Moon seals it.
          </p>
        </div>

        {/* ── 4-WEEKEND TABLE ───────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.22em", whiteSpace: "nowrap" }}>THE 4 WEEKENDS</p>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
        </div>

        <div style={{ display: "grid", gap: 10, marginBottom: 40 }}>
          {WEEKENDS.map((w) => (
            <div key={w.num} style={{
              display: "flex", gap: 16, alignItems: "flex-start",
              padding: "18px 16px",
              background: w.color === GOLD ? "rgba(176,142,80,0.05)" : "rgba(0,0,0,0.2)",
              border: `1px solid ${w.border}`,
              borderRadius: 10,
              animation: w.color === GOLD ? "goldGlow 5s ease-in-out infinite" : "none",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                border: `1px solid ${w.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                background: w.color === GOLD ? "rgba(176,142,80,0.12)" : "transparent",
              }}>
                <span style={{ color: w.color, fontSize: "14px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{w.num}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <p style={{ color: w.color, fontSize: "15px", letterSpacing: "0.1em" }}>{w.dates}</p>
                  {w.moon && (
                    <span style={{
                      background: "rgba(176,142,80,0.1)", border: `1px solid ${GOLD_20}`,
                      color: GOLD, fontSize: "12px", letterSpacing: "0.1em",
                      padding: "2px 8px", borderRadius: 3,
                    }}>{w.moon}</span>
                  )}
                </div>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "12px", letterSpacing: "0.14em", marginBottom: 6 }}>{w.label}</p>
                <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "16px", lineHeight: 1.7 }}>{w.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── 48-HOUR WEEKEND RHYTHM ────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.22em", whiteSpace: "nowrap" }}>THE 48-HOUR RHYTHM</p>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
        </div>

        <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "16px", lineHeight: 1.7, marginBottom: 20 }}>
          Fri 12PM HNL pickup → Sun 12PM departure. Every Aliʻi weekend runs the same rhythm.
        </p>

        <div style={{ position: "relative", marginBottom: 40 }}>
          <div style={{
            position: "absolute", left: 19, top: 0, bottom: 0,
            width: 1, background: `linear-gradient(to bottom, ${GOLD_40}, transparent)`,
          }} />
          {RHYTHM.map((r, i) => (
            <div
              key={i}
              onClick={() => setOpenRhythm(openRhythm === i ? null : i)}
              style={{
                display: "flex", gap: 14, marginBottom: 12,
                cursor: "pointer",
                opacity: revealed ? 1 : 0,
                transition: `opacity 0.5s ease ${i * 0.04}s`,
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                background: openRhythm === i ? "rgba(176,142,80,0.15)" : "rgba(176,142,80,0.04)",
                border: `1px solid ${openRhythm === i ? GOLD_40 : GOLD_20}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 1, transition: "all 0.2s",
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: (i === 4 || i === 10) ? GOLD : "rgba(176,142,80,0.4)",
                }} />
              </div>
              <div style={{
                flex: 1,
                background: openRhythm === i ? "rgba(176,142,80,0.04)" : "transparent",
                border: `1px solid ${openRhythm === i ? GOLD_20 : "transparent"}`,
                borderRadius: 8, padding: openRhythm === i ? "12px 14px" : "8px 0",
                transition: "all 0.2s",
              }}>
                <p style={{ color: GOLD_DIM, fontSize: "12px", letterSpacing: "0.12em", marginBottom: 2 }}>{r.time}</p>
                <p style={{ color: openRhythm === i ? GOLD : "rgba(232,224,208,0.8)", fontSize: "17px", transition: "color 0.2s" }}>{r.event}</p>
                {openRhythm === i && (
                  <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "16px", lineHeight: 1.8, marginTop: 8 }}>{r.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── ALIʻI FOUNDER SEAT ────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.22em", whiteSpace: "nowrap" }}>ALIʻI FOUNDER SEAT</p>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
        </div>

        <div style={{
          border: `2px solid ${GOLD}`,
          borderRadius: 14,
          background: "linear-gradient(135deg, #0f1018 0%, #080a0f 100%)",
          padding: "28px 22px",
          marginBottom: 40,
          position: "relative",
          overflow: "hidden",
          animation: "goldGlow 4s ease-in-out infinite",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(176,142,80,0.07) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />

          <div style={{
            position: "absolute", top: 14, right: 14,
            background: GOLD, color: "#000",
            fontSize: "12px", letterSpacing: "0.12em",
            padding: "4px 10px", borderRadius: 3, fontWeight: 700,
          }}>20 SEATS · 5 PER WEEKEND</div>

          <p style={{ color: GOLD, fontSize: "13px", letterSpacing: "0.22em", marginBottom: 6 }}>ALIʻI · FOUNDING SEAT</p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "1.5rem",
            lineHeight: 1.2,
            marginBottom: 20,
          }}>
            The Full Founding Experience
          </p>

          <div style={{ display: "grid", gap: 7, marginBottom: 24 }}>
            {[
              "5 days · Tue–Sun · Embassy Suites Kapolei",
              "All meals at the table",
              "HNL airport pickup + dropoff",
              "Both ice baths · Ko Olina",
              "All War Room + Trade Co. sessions",
              "Founding fire + Palapala oath",
              "Aliʻi gear pack — ring · patch · coin · manual",
              "1% equity in Mākoa Trade Co.",
              "0.5% of global revenue · perpetual · inheritable",
              "Territorial charter rights",
              "Aliʻi Council seat for life",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ color: GOLD, fontSize: "16px", flexShrink: 0, marginTop: 1 }}>—</span>
                <p style={{ color: "rgba(232,224,208,0.8)", fontSize: "17px", lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>

          <div style={{
            background: "rgba(176,142,80,0.08)",
            border: `1px solid ${GOLD_40}`,
            borderRadius: 8,
            padding: "16px",
            marginBottom: 20,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.14em", marginBottom: 4 }}>ALIʻI FOUNDER SEAT</p>
              <p style={{ color: GOLD, fontSize: "2rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>$4,997</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "14px", marginBottom: 4 }}>Team of 3–5 brothers</p>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "14px" }}>Cannot be sponsored</p>
            </div>
          </div>

          <a href="/gate" style={{
            display: "block",
            background: GOLD,
            color: "#000",
            borderRadius: 8,
            padding: "16px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            fontFamily: "'JetBrains Mono', monospace",
            textAlign: "center",
          }}>
            CLAIM YOUR ALIʻI SEAT → /GATE
          </a>

          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "14px", textAlign: "center", marginTop: 10 }}>
            Gate opens May 1 · Full Moon · 9AM HST · 20 seats total
          </p>
        </div>

        {/* ── 80/10/10 DOCTRINE ─────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(176,142,80,0.03)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "26px 22px",
          marginBottom: 40,
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.28em", marginBottom: 16 }}>
            WHAT YOU BUILD AFTER MAYDAY 48
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "1.05rem",
            lineHeight: 1.9,
            marginBottom: 20,
          }}>
            Each Aliʻi returns home and opens their territory's chapter under the Mākoa Trade Co. framework.
          </p>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { pct: "80%", label: "stays in your territory", desc: "chapter treasury · local ops · brothers doing the work" },
              { pct: "10%", label: "to the Order", desc: "Mākoa Trade Co. general fund · 7G Net · new chapter activation" },
              { pct: "10%", label: "to the Mayday 48 Aliʻi pool", desc: "split among the 20 founding Aliʻi forever · 0.5% per founder · perpetual · inheritable" },
            ].map(row => (
              <div key={row.pct} style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                padding: "10px 14px",
                background: "rgba(0,0,0,0.2)",
                border: `1px solid ${GOLD_20}`,
                borderRadius: 6,
              }}>
                <span style={{ color: GOLD, fontSize: "1.1rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, minWidth: 36 }}>{row.pct}</span>
                <div>
                  <p style={{ color: "#e8e0d0", fontSize: "17px", marginBottom: 2 }}>{row.label}</p>
                  <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "15px", lineHeight: 1.5 }}>{row.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{
            color: "rgba(176,142,80,0.55)",
            fontSize: "16px",
            fontStyle: "italic",
            fontFamily: "'Cormorant Garamond', serif",
            lineHeight: 1.9,
            marginTop: 16,
            textAlign: "center",
          }}>
            This split is the economic constitution.<br />It aligns every chapter toward local sovereignty while funding the 100-year mission.
          </p>
        </div>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.22em", whiteSpace: "nowrap" }}>FREQUENTLY ASKED</p>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
        </div>

        <div style={{ display: "grid", gap: 8, marginBottom: 40 }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                background: openFaq === i ? "rgba(176,142,80,0.05)" : "rgba(0,0,0,0.2)",
                border: `1px solid ${openFaq === i ? GOLD_20 : "rgba(255,255,255,0.04)"}`,
                borderRadius: 8, padding: "14px 16px", cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <p style={{ color: "rgba(232,224,208,0.85)", fontSize: "17px", lineHeight: 1.6 }}>{faq.q}</p>
                <span style={{ color: GOLD_DIM, fontSize: "1.1rem", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
              </div>
              {openFaq === i && (
                <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "17px", lineHeight: 1.9, marginTop: 12 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ── SPONSOR STRIP ─────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(176,142,80,0.04)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 10,
          padding: "20px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <div>
            <p style={{ color: GOLD, fontSize: "15px", letterSpacing: "0.15em", marginBottom: 4 }}>KNOW A MAN WHO NEEDS THIS?</p>
            <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "15px", lineHeight: 1.5 }}>
              Gift him a Nā Koa or Mana seat.<br />He never has to know who.
            </p>
          </div>
          <a href="/sponsor" style={{
            background: GOLD, color: "#000",
            border: "none", borderRadius: 6,
            padding: "10px 16px",
            fontSize: "14px", letterSpacing: "0.15em",
            textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0,
          }}>
            SPONSOR →
          </a>
        </div>

        {/* ── NOT READY STRIP ───────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: 8,
          padding: "14px 16px",
          marginBottom: 32,
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
        }}>
          <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "16px", lineHeight: 1.5 }}>
            Not ready for the founder seat?<br />Mana + Nā Koa open May 2.
          </p>
          <a href="/waitlist" style={{
            border: `1px solid ${GOLD_20}`, color: GOLD_DIM,
            fontSize: "14px", padding: "8px 14px",
            borderRadius: 4, textDecoration: "none",
            letterSpacing: "0.1em", whiteSpace: "nowrap", flexShrink: 0,
          }}>
            WAITLIST →
          </a>
        </div>

        {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <CountdownBlock target={TIMELINE.BLUE_MOON_SEALING} label="🌕 BLUE MOON SEALING (MAY 31) IN" color={GOLD} />
        </div>

        <a href="/gate" style={{
          display: "block",
          background: GOLD,
          color: "#000",
          borderRadius: 8,
          padding: "17px",
          textDecoration: "none",
          fontSize: "17px",
          fontWeight: 700,
          letterSpacing: "0.22em",
          fontFamily: "'JetBrains Mono', monospace",
          textAlign: "center",
          marginBottom: 12,
        }}>
          CLAIM YOUR ALIʻI FOUNDER SEAT
        </a>
        <p style={{ textAlign: "center", color: "rgba(232,224,208,0.3)", fontSize: "14px", marginBottom: 32 }}>
          $4,997 · 1% equity · team of 3–5 · gate opens May 1 · 20 seats total
        </p>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "1rem",
            marginBottom: 12,
          }}>
            Hana · Pale · Ola
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
            {[
              { href: "/gate", label: "THE GATE" },
              { href: "/palapala", label: "THE PALAPALA" },
              { href: "/trade", label: "TRADE CO." },
              { href: "/sponsor", label: "SPONSOR" },
              { href: "/waitlist", label: "WAITLIST" },
            ].map(link => (
              <a key={link.href} href={link.href} style={{
                color: "rgba(176,142,80,0.4)",
                fontSize: "13px",
                letterSpacing: "0.15em",
                textDecoration: "none",
              }}>{link.label}</a>
            ))}
          </div>
          <p style={{ color: GOLD_DIM, fontSize: "15px", letterSpacing: "0.14em", marginBottom: 6, fontWeight: 600 }}>
            makoa.live
          </p>
          <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "13px", letterSpacing: "0.15em" }}>
            MĀKOA ORDER · MALU TRUST · WEST OAHU · WORLDWIDE · 2026
          </p>
        </div>

      </div>
    </div>
  );
}

export default function Founding48Page() {
  return (
    <Suspense fallback={
      <div style={{ background: "#04060a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(176,142,80,0.4)", fontFamily: "'JetBrains Mono', monospace", fontSize: "16px", letterSpacing: "0.2em" }}>
          LOADING...
        </p>
      </div>
    }>
      <Founding48Content />
    </Suspense>
  );
}
