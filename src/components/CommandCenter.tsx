"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.07)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GREEN = "#3fb950";
const GREEN_DIM = "rgba(63,185,80,0.5)";
const BLUE = "#58a6ff";
const RED = "#e05c5c";
const BG = "#020406";

// ─── Day schedule ─────────────────────────────────────────────────────────────

const DAILY_SCHEDULE: Record<number, { label: string; lead: string; type: "chief" | "xi" | "rest"; color: string; sessions: { time: string; name: string; desc: string }[] }> = {
  1: { // Monday
    label: "Monday",
    lead: "Chief Makoa",
    type: "chief",
    color: GOLD,
    sessions: [
      { time: "4:00 AM", name: "808 Signal Check", desc: "Weekly pulse — who's active, who's gone quiet. XI reviews all 808 channels." },
      { time: "4:15 AM", name: "Order Status Brief", desc: "Member standing, new pledges, route health, house status." },
      { time: "4:45 AM", name: "Week Ahead", desc: "Assignments, events, escalations. Chief Makoa sets the tone." },
      { time: "5:30 AM", name: "Closed", desc: "Command center goes dark. Brothers to their routes." },
    ],
  },
  2: { // Tuesday
    label: "Tuesday",
    lead: "Chief Makoa",
    type: "chief",
    color: GOLD,
    sessions: [
      { time: "4:00 AM", name: "Route Review", desc: "Service route performance. Job completions, client feedback, worker standing." },
      { time: "4:30 AM", name: "B2B Pipeline", desc: "Mana operators report. New contracts, renewals, referrals in motion." },
      { time: "5:00 AM", name: "Formation Check", desc: "Rank points, attendance, waitlist movement. Who's advancing." },
      { time: "5:30 AM", name: "Closed", desc: "Command center goes dark." },
    ],
  },
  3: { // Wednesday
    label: "Wednesday",
    lead: "XI Team",
    type: "xi",
    color: GREEN,
    sessions: [
      { time: "4:00 AM", name: "Ke Ala — Elite Training", desc: "90-minute warrior workout. Ko Olina Beach or Kapolei Community Park. XI team leads." },
      { time: "5:00 AM", name: "Ice Bath + Sauna", desc: "Cold immersion. Brotherhood circle. No phones. XI holds the space." },
      { time: "5:30 AM", name: "Closing Circle", desc: "Formation review. Rank acknowledgments. XI speaks for the order." },
      { time: "6:30 AM", name: "Reset Complete", desc: "Brothers disperse. Wednesday school at 6pm for Mana tier." },
    ],
  },
  4: { // Thursday
    label: "Thursday",
    lead: "Chief Makoa",
    type: "chief",
    color: GOLD,
    sessions: [
      { time: "4:00 AM", name: "Intelligence Brief", desc: "XI reports. 808 channel activity, escalations, member flags." },
      { time: "4:30 AM", name: "House Health", desc: "Per-house review. Payment health, training attendance, retention." },
      { time: "5:00 AM", name: "72 Planning", desc: "Upcoming gatherings. Nā Koa house prep, Mana hotel logistics, Aliʻi resort coordination." },
      { time: "5:30 AM", name: "Closed", desc: "Command center goes dark." },
    ],
  },
  5: { // Friday
    label: "Friday",
    lead: "Chief Makoa",
    type: "chief",
    color: GOLD,
    sessions: [
      { time: "4:00 AM", name: "Week Close", desc: "Final review of the week. What held. What didn't. What the order needs." },
      { time: "4:30 AM", name: "Weekly Dispatch", desc: "XI sends weekly brief to all tier channels. Newsletter generated and distributed." },
      { time: "5:00 AM", name: "Oath Renewal", desc: "Chief Makoa closes the week with the order's oath. Spoken aloud." },
      { time: "5:30 AM", name: "Closed", desc: "Command center goes dark until Monday." },
    ],
  },
  6: { // Saturday
    label: "Saturday",
    lead: "—",
    type: "rest",
    color: GOLD_DIM,
    sessions: [
      { time: "All Day", name: "Service Routes Active", desc: "Nā Koa on route. Mana managing. Aliʻi available by 808 Command only." },
    ],
  },
  0: { // Sunday
    label: "Sunday",
    lead: "—",
    type: "rest",
    color: GOLD_DIM,
    sessions: [
      { time: "All Day", name: "Rest + Preparation", desc: "Brothers rest. Command center dark. Monday 4am signal check begins the new week." },
    ],
  },
};

// ─── 72hr Gathering types ─────────────────────────────────────────────────────

const GATHERINGS_72 = [
  {
    tier: "Nā Koa",
    emoji: "⚔",
    venue: "Mākoa House",
    focus: "Warrior formation, service route assignments, brotherhood bonding",
    color: GREEN,
    colorFaint: "rgba(63,185,80,0.07)",
    freq: "Monthly · Full Moon",
    price: "Included in $97/mo dues",
    details: [
      "Fire ceremony opening night",
      "4am training all 3 mornings",
      "Ice bath + sauna daily",
      "Service route review and assignments",
      "Formation score review by XI",
      "Brotherhood circle — no phones",
    ],
  },
  {
    tier: "Mana",
    emoji: "🌀",
    venue: "Hotel · Regional",
    focus: "B2B strategy, Wednesday school intensive, operator mastermind",
    color: BLUE,
    colorFaint: "rgba(88,166,255,0.06)",
    freq: "Quarterly · Ka Hoʻike",
    price: "+$199/event · a la carte",
    details: [
      "War Room sessions — B2B pipeline review",
      "Wednesday school intensive (full day)",
      "Job queue assignments for next quarter",
      "Mana circle — operator mastermind",
      "Rank ceremonies for advancing brothers",
      "Net-to-net referral exchange",
    ],
  },
  {
    tier: "Aliʻi",
    emoji: "👑",
    venue: "Resort · Island",
    focus: "Council decisions, chapter expansion, Malu Trust review",
    color: GOLD,
    colorFaint: GOLD_FAINT,
    freq: "Annual · Makahiki Mākoa",
    price: "+$399/event · a la carte",
    details: [
      "Full council seated — 12 seats",
      "Malu Trust financial review",
      "New chapter announcements",
      "Annual oath renewal ceremony",
      "Aliʻi rank ceremonies",
      "Resort access — full 72hrs",
    ],
  },
];

// ─── Mock 808 signal data ─────────────────────────────────────────────────────

const MOCK_SIGNAL: { handle: string; tier: string; status: "active" | "quiet" | "silent"; lastSeen: string; zip: string }[] = [
  { handle: "KaiMakoa", tier: "nakoa", status: "active", lastSeen: "Today 3:58am", zip: "96707" },
  { handle: "AlohaKoa", tier: "mana", status: "active", lastSeen: "Today 4:01am", zip: "96707" },
  { handle: "KapoleiXI", tier: "alii", status: "active", lastSeen: "Today 4:00am", zip: "96707" },
  { handle: "WestOahu7", tier: "nakoa", status: "quiet", lastSeen: "3 days ago", zip: "96706" },
  { handle: "MaluBrother", tier: "mana", status: "quiet", lastSeen: "5 days ago", zip: "96707" },
  { handle: "TradeKoa808", tier: "nakoa", status: "active", lastSeen: "Today 3:55am", zip: "96792" },
  { handle: "BuilderKoa", tier: "mana", status: "silent", lastSeen: "12 days ago", zip: "96706" },
  { handle: "HonoluluKoa", tier: "nakoa", status: "active", lastSeen: "Today 4:03am", zip: "96813" },
];

const TIER_COLOR: Record<string, string> = { alii: GOLD, mana: BLUE, nakoa: GREEN };
const STATUS_COLOR: Record<string, string> = { active: GREEN, quiet: "#d29922", silent: RED };
const STATUS_LABEL: Record<string, string> = { active: "ACTIVE", quiet: "QUIET", silent: "SILENT" };

function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed || "makoa")}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CommandCenterProps {
  onExit: () => void;
}

export default function CommandCenter({ onExit }: CommandCenterProps) {
  const [view, setView] = useState<"home" | "schedule" | "signal" | "72" | "intel">("home");
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [memberCount, setMemberCount] = useState({ active: 0, pending: 0, total: 0 });
  const [realSignal, setRealSignal] = useState<{ handle: string; tier: string; status: "active" | "quiet" | "silent"; lastSeen: string; zip: string }[]>([]);
  const [signalLoading, setSignalLoading] = useState(true);
  const clockRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    clockRef.current = setInterval(() => setNow(new Date()), 1000);
    return () => { if (clockRef.current) clearInterval(clockRef.current); };
  }, []);

  // Pull real member counts from gate_submissions
  useEffect(() => {
    supabase.from("gate_submissions").select("status, tier_flag").then(({ data }) => {
      if (!data) return;
      setMemberCount({
        active: data.filter(a => a.status === "committed" || a.status === "active").length,
        pending: data.filter(a => !a.status || a.status === "pending" || a.status === "reviewing").length,
        total: data.length,
      });
    });
  }, []);

  // Pull real 808 signal from gate_submissions
  useEffect(() => {
    setSignalLoading(true);
    supabase
      .from("gate_submissions")
      .select("handle, tier_flag, zip, created_at, status")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setSignalLoading(false);
        if (!data || data.length === 0) {
          setRealSignal([]);
          return;
        }
        const now = Date.now();
        const mapped = data.map(row => {
          const created = new Date(row.created_at || "").getTime();
          const daysSince = (now - created) / (1000 * 60 * 60 * 24);
          let status: "active" | "quiet" | "silent" = "active";
          if (daysSince > 10) status = "silent";
          else if (daysSince > 3) status = "quiet";
          const lastSeen = daysSince < 1
            ? "Today"
            : daysSince < 2
            ? "Yesterday"
            : `${Math.floor(daysSince)} days ago`;
          return {
            handle: row.handle || "Brother",
            tier: row.tier_flag || "nakoa",
            status,
            lastSeen,
            zip: row.zip || "96707",
          };
        });
        setRealSignal(mapped);
      });
  }, []);

  const todaySchedule = DAILY_SCHEDULE[now.getDay()];
  const isMonday = now.getDay() === 1;
  const hour = now.getHours();
  const isCommandHour = hour === 4 || hour === 5;

  const activeSignal = realSignal.filter(m => m.status === "active").length;
  const quietSignal = realSignal.filter(m => m.status === "quiet").length;
  const silentSignal = realSignal.filter(m => m.status === "silent").length;

  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      color: "#e8e0d0",
      fontFamily: "'JetBrains Mono', monospace",
      paddingBottom: 80,
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes goldGlow {
          0%, 100% { box-shadow: 0 0 0px 0px rgba(176,142,80,0); }
          50% { box-shadow: 0 0 20px 4px rgba(176,142,80,0.12); }
        }
        @keyframes redPulse {
          0%, 100% { box-shadow: 0 0 0px 0px rgba(224,92,92,0); }
          50% { box-shadow: 0 0 12px 3px rgba(224,92,92,0.2); }
        }
      `}</style>

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }} />

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "14px 20px",
        background: "rgba(2,4,6,0.98)",
        position: "sticky", top: 0, zIndex: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD, fontSize: "1rem", lineHeight: 1 }}>
            Steward 0001
          </p>
          <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.25em", marginTop: "2px" }}>
            COMMAND CENTER · CHIEF MAKOA
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: GOLD, fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>{timeStr}</p>
          <p style={{ color: GOLD_DIM, fontSize: "0.38rem", marginTop: "2px" }}>{dateStr}</p>
        </div>
      </div>

      {/* Live status bar */}
      <div style={{ display: "flex", gap: "0", borderBottom: `1px solid ${GOLD_20}`, background: "rgba(0,0,0,0.5)" }}>
        {[
          { label: "COMMITTED", value: memberCount.active, color: GREEN },
          { label: "PENDING", value: memberCount.pending, color: GOLD },
          { label: "TOTAL PLEDGES", value: memberCount.total, color: BLUE },
          { label: todaySchedule.label.toUpperCase(), value: todaySchedule.lead, color: todaySchedule.color },
        ].map((s, i) => (
          <div key={s.label} style={{
            flex: 1, padding: "8px 10px",
            borderRight: i < 3 ? `1px solid ${GOLD_20}` : "none",
            textAlign: "center",
          }}>
            <p style={{ color: s.color, fontSize: "0.6rem", fontWeight: 500, lineHeight: 1 }}>{s.value}</p>
            <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.35rem", letterSpacing: "0.1em", marginTop: "2px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Nav */}
      <div style={{
        display: "flex", overflowX: "auto",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "0 16px",
        background: "rgba(0,0,0,0.3)",
      }}>
        {([
          { id: "home", label: "HOME" },
          { id: "schedule", label: "4AM SCHEDULE" },
          { id: "signal", label: "808 SIGNAL" },
          { id: "72", label: "72HR GATHERINGS" },
          { id: "intel", label: "INTEL" },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            style={{
              background: "none", border: "none",
              borderBottom: `2px solid ${view === tab.id ? GOLD : "transparent"}`,
              color: view === tab.id ? GOLD : "rgba(232,224,208,0.3)",
              cursor: "pointer",
              fontSize: "0.42rem",
              letterSpacing: "0.15em",
              padding: "10px 12px",
              whiteSpace: "nowrap",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "color 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px 40px", position: "relative", zIndex: 1 }}>

        {/* ── HOME ── */}
        {view === "home" && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
            {isMonday && (
              <div style={{
                background: "rgba(176,142,80,0.08)",
                border: `1px solid ${GOLD}40`,
                borderRadius: "10px",
                padding: "16px 18px",
                marginBottom: "20px",
                animation: "goldGlow 3s ease-in-out infinite",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: GOLD, animation: "pulse 1s ease-in-out infinite", flexShrink: 0 }} />
                  <p style={{ color: GOLD, fontSize: "0.52rem", letterSpacing: "0.15em" }}>MONDAY 808 SIGNAL CHECK</p>
                </div>
                <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.48rem", lineHeight: 1.7 }}>
                  Weekly pulse active. {activeSignal} brothers on signal. {quietSignal} quiet. {silentSignal} silent.
                  XI reviewing all 808 channels now.
                </p>
              </div>
            )}

            <div style={{
              background: todaySchedule.type === "xi" ? "rgba(63,185,80,0.06)" : GOLD_FAINT,
              border: `1px solid ${todaySchedule.color}30`,
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                <div>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", letterSpacing: "0.2em", marginBottom: "4px" }}>TODAY</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: todaySchedule.color, fontSize: "1.4rem", lineHeight: 1 }}>
                    {todaySchedule.label}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: todaySchedule.color, fontSize: "0.45rem", letterSpacing: "0.1em" }}>LEAD</p>
                  <p style={{ color: "#e8e0d0", fontSize: "0.55rem", marginTop: "2px" }}>{todaySchedule.lead}</p>
                </div>
              </div>
              <div style={{ display: "grid", gap: "8px" }}>
                {todaySchedule.sessions.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "12px",
                    padding: "8px 0",
                    borderBottom: i < todaySchedule.sessions.length - 1 ? `1px solid ${todaySchedule.color}12` : "none",
                  }}>
                    <p style={{ color: todaySchedule.color, fontSize: "0.42rem", flexShrink: 0, width: "52px", marginTop: "1px" }}>{s.time}</p>
                    <div>
                      <p style={{ color: "#e8e0d0", fontSize: "0.5rem", marginBottom: "2px" }}>{s.name}</p>
                      <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem", lineHeight: 1.6 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "20px" }}>
              {[
                { label: "Committed", value: memberCount.active, color: GREEN },
                { label: "Pending", value: memberCount.pending, color: GOLD },
                { label: "Total Pledges", value: memberCount.total, color: BLUE },
              ].map(s => (
                <div key={s.label} style={{
                  background: "rgba(0,0,0,0.4)",
                  border: `1px solid ${s.color}18`,
                  borderRadius: "8px",
                  padding: "12px 10px",
                  textAlign: "center",
                }}>
                  <p style={{ color: s.color, fontSize: "1.1rem", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.38rem", marginTop: "4px", lineHeight: 1.4 }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${GOLD_20}`, borderRadius: "10px", padding: "16px 18px" }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.2em", marginBottom: "12px" }}>WEEK AT A GLANCE</p>
              <div style={{ display: "grid", gap: "6px" }}>
                {[1, 2, 3, 4, 5].map(day => {
                  const d = DAILY_SCHEDULE[day];
                  const isToday = now.getDay() === day;
                  return (
                    <div key={day} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "7px 10px",
                      background: isToday ? `${d.color}10` : "transparent",
                      border: isToday ? `1px solid ${d.color}25` : "1px solid transparent",
                      borderRadius: "6px",
                    }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: d.color, flexShrink: 0, opacity: isToday ? 1 : 0.4 }} />
                      <p style={{ color: isToday ? "#e8e0d0" : "rgba(232,224,208,0.4)", fontSize: "0.48rem", width: "70px" }}>{d.label}</p>
                      <p style={{ color: d.color, fontSize: "0.42rem", opacity: isToday ? 1 : 0.6 }}>4am · {d.lead}</p>
                      {isToday && <span style={{ marginLeft: "auto", color: d.color, fontSize: "0.38rem", letterSpacing: "0.1em" }}>TODAY</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={onExit}
              style={{
                display: "block", width: "100%", marginTop: "24px",
                background: "transparent", border: "none",
                color: "rgba(176,142,80,0.2)", fontSize: "0.42rem",
                cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.15em", padding: "8px",
              }}
            >
              ← EXIT COMMAND CENTER
            </button>
          </div>
        )}

        {/* ── 4AM SCHEDULE ── */}
        {view === "schedule" && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "16px" }}>
              4AM DAILY SCHEDULE — CHIEF MAKOA + XI TEAM
            </p>
            <div style={{ display: "flex", gap: "6px", marginBottom: "20px", overflowX: "auto" }}>
              {[1, 2, 3, 4, 5].map(day => {
                const d = DAILY_SCHEDULE[day];
                const isSelected = selectedDay === day;
                const isToday = now.getDay() === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      background: isSelected ? `${d.color}15` : "transparent",
                      border: `1px solid ${isSelected ? d.color : d.color + "30"}`,
                      color: isSelected ? d.color : "rgba(232,224,208,0.35)",
                      fontSize: "0.42rem", padding: "8px 12px", cursor: "pointer",
                      borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.1em", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s",
                    }}
                  >
                    {d.label.slice(0, 3).toUpperCase()}
                    {isToday && <span style={{ color: d.color, marginLeft: "4px" }}>·</span>}
                  </button>
                );
              })}
            </div>
            {(() => {
              const d = DAILY_SCHEDULE[selectedDay];
              return (
                <div style={{
                  background: d.type === "xi" ? "rgba(63,185,80,0.06)" : GOLD_FAINT,
                  border: `1px solid ${d.color}30`, borderRadius: "12px", padding: "20px", marginBottom: "20px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                    <div>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: d.color, fontSize: "1.5rem", lineHeight: 1 }}>{d.label}</p>
                      <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem", marginTop: "4px", letterSpacing: "0.15em" }}>
                        {d.type === "xi" ? "XI TEAM LEADS · ELITE TRAINING + RESET" : "CHIEF MAKOA · COMMAND SESSION"}
                      </p>
                    </div>
                    <div style={{ background: `${d.color}12`, border: `1px solid ${d.color}30`, borderRadius: "6px", padding: "6px 10px", textAlign: "center" }}>
                      <p style={{ color: d.color, fontSize: "0.42rem", letterSpacing: "0.1em" }}>{d.lead}</p>
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: "0" }}>
                    {d.sessions.map((s, i) => (
                      <div key={i} style={{
                        display: "flex", gap: "16px", padding: "14px 0",
                        borderBottom: i < d.sessions.length - 1 ? `1px solid ${d.color}10` : "none",
                        alignItems: "flex-start",
                      }}>
                        <div style={{ flexShrink: 0, width: "58px" }}>
                          <p style={{ color: d.color, fontSize: "0.48rem", fontWeight: 600 }}>{s.time}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: "#e8e0d0", fontSize: "0.55rem", marginBottom: "4px" }}>{s.name}</p>
                          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.45rem", lineHeight: 1.7 }}>{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            <div style={{ background: "rgba(63,185,80,0.05)", border: `1px solid ${GREEN}20`, borderRadius: "8px", padding: "14px 16px" }}>
              <p style={{ color: GREEN, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "8px" }}>⚔ WEDNESDAY — XI TEAM RUNS IT</p>
              <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.46rem", lineHeight: 1.7 }}>
                Chief Makoa does not lead Wednesday. XI team holds the 4am elite training and reset.
                This is the order&apos;s heartbeat — 90 minutes of warrior conditioning, ice bath, sauna, closing circle.
                Wednesday school at 6pm for Mana tier. Chief Makoa attends as a brother, not as command.
              </p>
            </div>
          </div>
        )}

        {/* ── 808 SIGNAL CHECK ── */}
        {view === "signal" && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em" }}>
                808 SIGNAL — FORMATION ROSTER
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: isMonday && isCommandHour ? GREEN : GOLD_DIM, animation: "pulse 1.5s ease-in-out infinite" }} />
                <span style={{ color: isMonday && isCommandHour ? GREEN : GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.1em" }}>
                  {isMonday && isCommandHour ? "LIVE CHECK" : "STANDBY"}
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "20px" }}>
              {[
                { label: "Active", value: activeSignal, color: GREEN },
                { label: "Quiet", value: quietSignal, color: "#d29922" },
                { label: "Silent", value: silentSignal, color: RED },
              ].map(s => (
                <div key={s.label} style={{
                  background: "rgba(0,0,0,0.4)", border: `1px solid ${s.color}20`,
                  borderRadius: "8px", padding: "12px", textAlign: "center",
                }}>
                  <p style={{ color: s.color, fontSize: "1.2rem", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", marginTop: "4px" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {signalLoading ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(176,142,80,0.4)", fontSize: "0.46rem" }}>
                Loading formation roster...
              </div>
            ) : realSignal.length === 0 ? (
              <div style={{
                background: "rgba(176,142,80,0.04)", border: `1px solid rgba(176,142,80,0.12)`,
                borderRadius: "8px", padding: "24px", textAlign: "center",
              }}>
                <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.5rem", lineHeight: 1.8 }}>
                  No pledges yet.<br />
                  <span style={{ fontSize: "0.42rem", color: "rgba(176,142,80,0.25)" }}>Brothers appear here after submitting the gate form.</span>
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "8px", marginBottom: "20px" }}>
                {realSignal.map((m, i) => (
                  <div key={m.handle + i} style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px 14px",
                    background: m.status === "silent" ? "rgba(224,92,92,0.04)" : "rgba(0,0,0,0.3)",
                    border: `1px solid ${STATUS_COLOR[m.status]}18`,
                    borderRadius: "8px",
                    animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
                  }}>
                    <img src={dicebearUrl(m.handle)} alt={m.handle} style={{ width: "32px", height: "32px", borderRadius: "50%", border: `1px solid ${TIER_COLOR[m.tier] || GREEN}30`, background: "#0a0d12", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#e8e0d0", fontSize: "0.52rem" }}>{m.handle}</p>
                      <p style={{ color: TIER_COLOR[m.tier] || GREEN, fontSize: "0.38rem", letterSpacing: "0.1em" }}>{(m.tier || "nakoa").toUpperCase()} · ZIP {m.zip}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", justifyContent: "flex-end", marginBottom: "3px" }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: STATUS_COLOR[m.status], animation: m.status === "active" ? "pulse 1.5s ease-in-out infinite" : "none" }} />
                        <span style={{ color: STATUS_COLOR[m.status], fontSize: "0.38rem", letterSpacing: "0.1em" }}>{STATUS_LABEL[m.status]}</span>
                      </div>
                      <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.38rem" }}>{m.lastSeen}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {silentSignal > 0 && (
              <div style={{
                background: "rgba(224,92,92,0.06)", border: `1px solid ${RED}30`,
                borderRadius: "8px", padding: "14px 16px", animation: "redPulse 3s ease-in-out infinite",
              }}>
                <p style={{ color: RED, fontSize: "0.48rem", marginBottom: "6px", letterSpacing: "0.1em" }}>
                  ⚠ {silentSignal} BROTHER{silentSignal > 1 ? "S" : ""} SILENT 10+ DAYS
                </p>
                <p style={{ color: "rgba(224,92,92,0.6)", fontSize: "0.44rem", lineHeight: 1.7 }}>
                  XI protocol: direct outreach within 24hrs. If no response, escalate to nearest Aliʻi.
                  Silent brothers are not expelled — they are found.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── 72HR GATHERINGS ── */}
        {view === "72" && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "6px" }}>
              72HR GATHERING SYSTEM
            </p>
            <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.46rem", lineHeight: 1.7, marginBottom: "20px" }}>
              Three tiers. Three venues. Three focuses. The 72 is where the order is built.
            </p>
            <div style={{ display: "grid", gap: "16px" }}>
              {GATHERINGS_72.map((g, i) => (
                <div key={g.tier} style={{
                  background: g.colorFaint, border: `1px solid ${g.color}30`,
                  borderRadius: "12px", padding: "20px",
                  animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "50%",
                        background: `${g.color}12`, border: `1px solid ${g.color}40`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.2rem", flexShrink: 0,
                      }}>{g.emoji}</div>
                      <div>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: g.color, fontSize: "1.2rem", lineHeight: 1 }}>{g.tier}</p>
                        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", letterSpacing: "0.12em", marginTop: "2px" }}>{g.freq}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: g.color, fontSize: "0.45rem" }}>{g.price}</p>
                    </div>
                  </div>
                  <div style={{ background: `${g.color}08`, border: `1px solid ${g.color}20`, borderRadius: "6px", padding: "10px 12px", marginBottom: "12px" }}>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", letterSpacing: "0.15em", marginBottom: "4px" }}>VENUE</p>
                    <p style={{ color: "#e8e0d0", fontSize: "0.55rem" }}>{g.venue}</p>
                    <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem", marginTop: "4px", lineHeight: 1.6 }}>{g.focus}</p>
                  </div>
                  <div style={{ display: "grid", gap: "6px" }}>
                    {g.details.map((detail, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: g.color, fontSize: "0.45rem", flexShrink: 0 }}>—</span>
                        <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.46rem" }}>{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "20px", padding: "14px 16px", background: GOLD_FAINT, border: `1px solid ${GOLD}15`, borderRadius: "8px", textAlign: "center" }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.44rem", lineHeight: 1.8 }}>
                The 72 is not optional. It is the order.<br />
                Nā Koa builds at the house. Mana operates at the hotel. Aliʻi leads at the resort.<br />
                <span style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.4rem" }}>Chief Makoa attends all three.</span>
              </p>
            </div>
          </div>
        )}

        {/* ── INTEL ── */}
        {view === "intel" && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "20px" }}>
              COMMAND INTELLIGENCE — CHIEF MAKOA DATABANK
            </p>
            {[
              {
                title: "Order Architecture", color: GOLD,
                items: [
                  "3 tiers: Nā Koa (warriors) · Mana (operators) · Aliʻi (council)",
                  "4 gathering rhythms: weekly, monthly, quarterly, annual",
                  "80/10/10 cooperative revenue split",
                  "100 accounts per house: 80 Ohana + 20 B2B",
                  "One house at capacity: $132,140 MRR",
                  "18-month formation track for all members",
                ],
              },
              {
                title: "808 Channel System", color: GREEN,
                items: [
                  "808-911: Emergency peer response — nearest brothers dispatched",
                  "808-411: Knowledge routing — question matched to skilled brothers",
                  "Monday 4am: Weekly signal check — active/quiet/silent status",
                  "Silent 10+ days: XI direct outreach protocol",
                  "Escalation: No response → nearest Aliʻi notified",
                  "Zello 808 Command: Aliʻi-only encrypted voice channel",
                ],
              },
              {
                title: "4AM Command Rhythm", color: GOLD,
                items: [
                  "Monday: 808 Signal Check + Week Ahead (Chief Makoa)",
                  "Tuesday: Route Review + B2B Pipeline (Chief Makoa)",
                  "Wednesday: Ke Ala Elite Training + Reset (XI Team)",
                  "Thursday: Intelligence Brief + 72 Planning (Chief Makoa)",
                  "Friday: Week Close + Steward Dispatch (Chief Makoa)",
                  "Sat/Sun: Routes active · Command dark",
                ],
              },
              {
                title: "MAYDAY Founding 20", color: BLUE,
                items: [
                  "May 1–4, 2026 · Kapolei, Oʻahu",
                  "Nā Koa Day Pass: $149–$199 · 12 seats",
                  "Mana Mastermind: $299–$399 · 24 seats",
                  "Aliʻi War Room: $499–$699 · 24 seats",
                  "War Party VIP: $799–$999 · 5 parties",
                  "Fly-In War Party: $1,598–$2,997 · hotel + dinner + ice bath",
                ],
              },
            ].map((section, i) => (
              <div key={section.title} style={{
                background: "rgba(0,0,0,0.3)", border: `1px solid ${section.color}18`,
                borderRadius: "10px", padding: "16px 18px", marginBottom: "12px",
                animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
              }}>
                <p style={{ color: section.color, fontSize: "0.42rem", letterSpacing: "0.18em", marginBottom: "12px", opacity: 0.8 }}>
                  {section.title.toUpperCase()}
                </p>
                <div style={{ display: "grid", gap: "7px" }}>
                  {section.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                      <span style={{ color: section.color, fontSize: "0.4rem", flexShrink: 0, marginTop: "2px", opacity: 0.6 }}>◆</span>
                      <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.46rem", lineHeight: 1.6 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}