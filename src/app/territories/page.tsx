"use client";
import { useState, useEffect } from "react";

const BG = "#04060a";
const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const PURPLE = "#7c6fd0";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";

// Static seed — mirrors supabase_migration_territories.sql
// Live data layered on top via Supabase fetch
const SEED_TERRITORIES = [
  // FOUNDING
  { code: "HI-96792", name: "West Oahu · ZIP 96792", region: "Hawaii", country: "USA", continent: "Pacific", timezone: "Pacific/Honolulu", utc_offset: "UTC-10", status: "active", phase: "2026", color: GOLD, notes: "House 0001 sealed May 1 2026" },
  { code: "HI-96818", name: "Pearl City · ZIP 96818", region: "Hawaii", country: "USA", continent: "Pacific", timezone: "Pacific/Honolulu", utc_offset: "UTC-10", status: "forming", phase: "2026", color: GOLD, notes: "Cluster 2 — Pearl Harbor corridor" },
  { code: "HI-96744", name: "Kāneʻohe · ZIP 96744", region: "Hawaii", country: "USA", continent: "Pacific", timezone: "Pacific/Honolulu", utc_offset: "UTC-10", status: "open", phase: "2026-27", color: PURPLE, notes: "Windward Oahu expansion" },
  { code: "HI-96720", name: "Hilo · Big Island", region: "Hawaii", country: "USA", continent: "Pacific", timezone: "Pacific/Honolulu", utc_offset: "UTC-10", status: "open", phase: "2026-27", color: PURPLE, notes: "Big Island anchor" },
  // MAINLAND
  { code: "CA-LA", name: "Los Angeles · South Central", region: "California", country: "USA", continent: "North America", timezone: "America/Los_Angeles", utc_offset: "UTC-8", status: "open", phase: "2026-27", color: PURPLE, notes: "PI diaspora hub" },
  { code: "CA-SD", name: "San Diego · National City", region: "California", country: "USA", continent: "North America", timezone: "America/Los_Angeles", utc_offset: "UTC-8", status: "open", phase: "2026-27", color: PURPLE, notes: "Military/vet overlap" },
  { code: "TX-HOU", name: "Houston · Alief", region: "Texas", country: "USA", continent: "North America", timezone: "America/Chicago", utc_offset: "UTC-6", status: "open", phase: "2027+", color: BLUE, notes: "Long-term target" },
  { code: "WA-SEA", name: "Seattle · Renton", region: "Washington", country: "USA", continent: "North America", timezone: "America/Los_Angeles", utc_offset: "UTC-8", status: "open", phase: "2027+", color: BLUE, notes: "Boeing trades corridor" },
  { code: "NV-LAS", name: "Las Vegas · Henderson", region: "Nevada", country: "USA", continent: "North America", timezone: "America/Los_Angeles", utc_offset: "UTC-8", status: "open", phase: "2027+", color: BLUE, notes: "Hawaii diaspora" },
  // PACIFIC NET2NET
  { code: "NZ-AKL", name: "Auckland · South Auckland", region: "Auckland", country: "New Zealand", continent: "Pacific", timezone: "Pacific/Auckland", utc_offset: "UTC+12", status: "open", phase: "2027+", color: BLUE, notes: "Polynesian brotherhood hub" },
  { code: "WS-APW", name: "Apia · Upolu", region: "Upolu", country: "Samoa", continent: "Pacific", timezone: "Pacific/Apia", utc_offset: "UTC+13", status: "open", phase: "2027+", color: BLUE, notes: "Pacific origin territory" },
  { code: "AU-SYD", name: "Sydney · Blacktown", region: "New South Wales", country: "Australia", continent: "Pacific", timezone: "Australia/Sydney", utc_offset: "UTC+10", status: "open", phase: "2027+", color: BLUE, notes: "PI diaspora — Net2Net" },
  { code: "PH-MNL", name: "Metro Manila · NCR", region: "National Capital Region", country: "Philippines", continent: "Asia-Pacific", timezone: "Asia/Manila", utc_offset: "UTC+8", status: "open", phase: "2027+", color: BLUE, notes: "Net2Net partner territory" },
  { code: "JP-OSA", name: "Osaka · Namba", region: "Osaka", country: "Japan", continent: "Asia-Pacific", timezone: "Asia/Tokyo", utc_offset: "UTC+9", status: "open", phase: "2027+", color: BLUE, notes: "Pacific rim trade node" },
  { code: "GU-HAG", name: "Hagåtña · Guam", region: "Guam", country: "USA Territory", continent: "Pacific", timezone: "Pacific/Guam", utc_offset: "UTC+10", status: "open", phase: "2027+", color: BLUE, notes: "US bridge to Asia-Pacific" },
];

const CONTINENTS = ["All", "Pacific", "North America", "Asia-Pacific"];

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  active:  { label: "● ACTIVE",  color: GOLD,   bg: GOLD_10 },
  forming: { label: "◐ FORMING", color: GREEN,  bg: GREEN_20 },
  open:    { label: "○ OPEN",    color: GOLD_40, bg: "rgba(176,142,80,0.05)" },
  locked:  { label: "✕ LOCKED",  color: "#666",  bg: "#111" },
};

function localTime(timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date());
  } catch {
    return "--:--";
  }
}

function localDay(timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date());
  } catch {
    return "";
  }
}

type Territory = typeof SEED_TERRITORIES[number];
type Member = { handle: string; rank_tier: string; role: string; seat_type?: string; instagram?: string; telegram?: string };

export default function TerritoriesPage() {
  const [territories] = useState<Territory[]>(SEED_TERRITORIES);
  const [members, setMembers] = useState<Record<string, Member[]>>({});
  const [selected, setSelected] = useState<Territory | null>(SEED_TERRITORIES[0]);
  const [filter, setFilter] = useState("All");
  const [tick, setTick] = useState(0);

  // Live clock ticker
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  // Fetch members from Supabase (anon — public read)
  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch(
          "https://flzivjhxtbolcfaniskv.supabase.co/rest/v1/xi_territory_members?status=eq.active&select=territory_code,handle,rank_tier,role,seat_type,instagram,telegram",
          {
            headers: {
              apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps",
              Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps",
            },
          }
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          const byCode: Record<string, Member[]> = {};
          data.forEach((m: Member & { territory_code: string }) => {
            if (!byCode[m.territory_code]) byCode[m.territory_code] = [];
            byCode[m.territory_code].push(m);
          });
          setMembers(byCode);
        }
      } catch {}
    }
    fetchMembers();
  }, []);

  const filtered = filter === "All" ? territories : territories.filter(t => t.continent === filter);
  const grouped: Record<string, Territory[]> = {};
  filtered.forEach(t => {
    if (!grouped[t.continent]) grouped[t.continent] = [];
    grouped[t.continent].push(t);
  });

  const selMembers = selected ? (members[selected.code] || []) : [];
  const alii = selMembers.filter(m => m.rank_tier === "alii");
  const mana = selMembers.filter(m => m.rank_tier === "mana");
  const nakoa = selMembers.filter(m => m.rank_tier === "nakoa");

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e8dfc8", fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: rgba(176,142,80,0.2); }
        .terr-row:hover { background: rgba(176,142,80,0.07) !important; cursor: pointer; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${GOLD_20}`, padding: "20px 24px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 9, color: GOLD_40, letterSpacing: "0.3em", marginBottom: 4 }}>
              MĀKOA ORDER · 7G NET · TERRITORY DATA BANK
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: GOLD, letterSpacing: "0.04em" }}>
              WORLDWIDE TERRITORIES
            </div>
            <div style={{ fontSize: 11, color: GOLD_40, marginTop: 3 }}>
              {territories.filter(t => t.status === "active").length} active · {territories.filter(t => t.status === "forming").length} forming · {territories.filter(t => t.status === "open").length} open for steward
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a href="/steward/dashboard" style={{ fontSize: 10, color: GOLD_40, textDecoration: "none", border: `1px solid ${GOLD_20}`, padding: "5px 10px", borderRadius: 4 }}>← DASHBOARD</a>
            <a href="/net" style={{ fontSize: 10, color: GOLD, textDecoration: "none", border: `1px solid ${GOLD_40}`, padding: "5px 10px", borderRadius: 4, background: GOLD_10 }}>NET MAP ↗</a>
          </div>
        </div>

        {/* Continent filter */}
        <div style={{ display: "flex", gap: 4, marginTop: 16 }}>
          {CONTINENTS.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              background: filter === c ? GOLD_20 : "none",
              border: `1px solid ${filter === c ? GOLD_40 : "rgba(176,142,80,0.1)"}`,
              color: filter === c ? GOLD : GOLD_40,
              fontSize: 9, padding: "4px 10px", borderRadius: 3,
              cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.12em",
            }}>{c.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", minHeight: "calc(100vh - 140px)" }}>

        {/* Territory list */}
        <div style={{ borderRight: `1px solid ${GOLD_20}`, overflowY: "auto" }}>
          {Object.entries(grouped).map(([continent, terrs]) => (
            <div key={continent}>
              <div style={{ fontSize: 8, color: GOLD_40, letterSpacing: "0.3em", padding: "12px 16px 6px", background: "rgba(0,0,0,0.3)", position: "sticky", top: 0, zIndex: 1 }}>
                {continent.toUpperCase()}
              </div>
              {terrs.map(t => {
                const badge = STATUS_BADGE[t.status] || STATUS_BADGE.open;
                const isSelected = selected?.code === t.code;
                const mCount = (members[t.code] || []).length;
                return (
                  <div
                    key={t.code}
                    className="terr-row"
                    onClick={() => setSelected(t)}
                    style={{
                      padding: "12px 16px",
                      background: isSelected ? GOLD_10 : "transparent",
                      borderLeft: `2px solid ${isSelected ? t.color : "transparent"}`,
                      borderBottom: `1px solid rgba(176,142,80,0.04)`,
                      animation: isSelected ? "fadeUp 0.2s ease" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? GOLD : "#e8dfc8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {t.name}
                        </div>
                        <div style={{ fontSize: 9, color: GOLD_40, marginTop: 2 }}>{t.country} · {t.utc_offset}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: t.color, fontFamily: "'Georgia', serif" }}>
                          {localTime(t.timezone)}
                        </div>
                        <div style={{ fontSize: 8, color: badge.color, background: badge.bg, padding: "1px 5px", borderRadius: 2, letterSpacing: "0.1em", marginTop: 2 }}>
                          {badge.label}
                        </div>
                      </div>
                    </div>
                    {mCount > 0 && (
                      <div style={{ fontSize: 9, color: GOLD_40, marginTop: 4 }}>
                        {mCount} member{mCount > 1 ? "s" : ""} seated
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Territory detail panel */}
        {selected ? (
          <div style={{ padding: "28px 32px", overflowY: "auto", animation: "fadeUp 0.25s ease" }}>
            {/* Territory header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 8, color: selected.color, letterSpacing: "0.3em", marginBottom: 6 }}>
                  {selected.code} · {selected.continent}
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: GOLD, letterSpacing: "0.02em", lineHeight: 1.2 }}>
                  {selected.name}
                </div>
                <div style={{ fontSize: 12, color: GOLD_40, marginTop: 6 }}>
                  {selected.country} · {selected.region}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: selected.color, fontFamily: "'Georgia', serif", lineHeight: 1 }}>
                  {localTime(selected.timezone)}
                </div>
                <div style={{ fontSize: 11, color: GOLD_40, marginTop: 4 }}>
                  {localDay(selected.timezone)}
                </div>
                <div style={{ fontSize: 10, color: GOLD_40, marginTop: 2 }}>
                  {selected.utc_offset} · {selected.timezone}
                </div>
              </div>
            </div>

            {/* Status + phase */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
              <div style={{
                background: STATUS_BADGE[selected.status]?.bg,
                border: `1px solid ${STATUS_BADGE[selected.status]?.color}44`,
                color: STATUS_BADGE[selected.status]?.color,
                fontSize: 10, padding: "6px 14px", borderRadius: 4, letterSpacing: "0.12em",
              }}>
                {STATUS_BADGE[selected.status]?.label}
              </div>
              <div style={{ background: GOLD_10, border: `1px solid ${GOLD_20}`, color: GOLD_40, fontSize: 10, padding: "6px 14px", borderRadius: 4, letterSpacing: "0.1em" }}>
                PHASE {selected.phase}
              </div>
              {selected.status === "open" && (
                <a href="/steward/apply" style={{ background: GOLD, border: "none", color: "#000", fontSize: 10, padding: "6px 14px", borderRadius: 4, textDecoration: "none", letterSpacing: "0.1em", fontWeight: 700 }}>
                  APPLY FOR STEWARD SEAT →
                </a>
              )}
            </div>

            {/* Notes */}
            {selected.notes && (
              <div style={{ background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 6, padding: "12px 16px", marginBottom: 24, fontSize: 12, color: "rgba(232,223,200,0.7)", lineHeight: 1.7 }}>
                {selected.notes}
              </div>
            )}

            {/* Roster */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: GOLD, letterSpacing: "0.25em", marginBottom: 14 }}>TERRITORY ROSTER</div>

              {selMembers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: GOLD_40, fontSize: 12 }}>
                  No seated members yet.{selected.status === "open" ? " This seat is available." : ""}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[{ label: "ALIʻI", members: alii, color: GOLD }, { label: "MANA", members: mana, color: PURPLE }, { label: "NĀ KOA", members: nakoa, color: "#58a6ff" }].map(({ label, members: m, color }) =>
                    m.length > 0 ? (
                      <div key={label}>
                        <div style={{ fontSize: 8, color, letterSpacing: "0.25em", marginBottom: 8 }}>{label}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {m.map(mem => (
                            <div key={mem.handle} style={{ background: `${color}11`, border: `1px solid ${color}22`, borderRadius: 6, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#e8dfc8" }}>{mem.handle}</div>
                                <div style={{ fontSize: 10, color: GOLD_40, marginTop: 2 }}>
                                  {mem.role}{mem.seat_type ? ` · ${mem.seat_type.replace("_", " ")}` : ""}
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 8 }}>
                                {mem.telegram && (
                                  <a href={`https://t.me/${mem.telegram}`} target="_blank" rel="noreferrer" style={{ fontSize: 9, color, textDecoration: "none", border: `1px solid ${color}33`, padding: "3px 8px", borderRadius: 3 }}>
                                    TG
                                  </a>
                                )}
                                {mem.instagram && (
                                  <a href={`https://instagram.com/${mem.instagram}`} target="_blank" rel="noreferrer" style={{ fontSize: 9, color, textDecoration: "none", border: `1px solid ${color}33`, padding: "3px 8px", borderRadius: 3 }}>
                                    IG
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </div>

            {/* Open seat call */}
            {selected.status !== "active" && (
              <div style={{ marginTop: 28, background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 8, padding: "20px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 14, color: GOLD, fontWeight: 700, marginBottom: 8 }}>
                  {selected.status === "forming" ? "Co-Steward Seat Available" : "Steward Seat Open"}
                </div>
                <div style={{ fontSize: 11, color: GOLD_40, marginBottom: 14, lineHeight: 1.7 }}>
                  {selected.name} needs a {selected.status === "forming" ? "co-steward" : "founding steward"}.<br />
                  Must be a resident or have boots-on-ground in this territory.
                </div>
                <a href="/steward/apply" style={{
                  background: GOLD, color: "#000", fontSize: 10, padding: "10px 20px",
                  borderRadius: 4, textDecoration: "none", fontWeight: 700, letterSpacing: "0.12em",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  APPLY FOR THIS SEAT →
                </a>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: GOLD_40, fontSize: 12 }}>
            Select a territory
          </div>
        )}
      </div>
    </div>
  );
}
