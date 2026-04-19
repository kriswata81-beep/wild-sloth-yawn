"use client";
import { useState, useEffect, useRef } from "react";

const BG = "#04060a";
const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";
const RED = "#f85149";
const RED_20 = "rgba(248,81,73,0.2)";
const BLUE = "#58a6ff";
const BLUE_20 = "rgba(88,166,255,0.2)";

type Tab = "home" | "411" | "911" | "claim" | "warchest";
type AppState = "setup" | "aha" | "live";

type Territory = {
  code: string; name: string; timezone: string;
  status: string; zip_codes: string[] | null;
};

type NewsItem = { id?: string; headline: string; body?: string; source_name?: string; category?: string; published_at?: string; time?: string };
type Business = { name: string; category: string; claimed: boolean };

// Static cluster seeds — Steward-approved metadata. Live news/checkins come from API.
const CLUSTER_META: Record<string, { steward: string; city: string; brothers: number; businesses: Business[] }> = {
  "96792": {
    steward: "Kris W.", city: "Waianae, Oʻahu", brothers: 14,
    businesses: [
      { name: "Makoa Trade Co", category: "Trade Services", claimed: true },
      { name: "Kaala Lush Services", category: "Yard & Plants", claimed: true },
      { name: "West Side Plumbing", category: "Plumbing", claimed: false },
      { name: "Waianae Auto Repair", category: "Automotive", claimed: false },
      { name: "Nānākuli Electric", category: "Electrical", claimed: false },
    ],
  },
};

function timeAgo(iso?: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AppPage() {
  const [appState, setAppState] = useState<AppState>("setup");
  const [zip, setZip] = useState("");
  const [zipInput, setZipInput] = useState("");
  const [tab, setTab] = useState<Tab>("home");
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [claimIdx, setClaimIdx] = useState<number | null>(null);
  const [claimStep, setClaimStep] = useState(0);
  const [claimName, setClaimName] = useState("");
  const [claimPhone, setClaimPhone] = useState("");
  const [claimSent, setClaimSent] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState("");
  const [emergencyMsg, setEmergencyMsg] = useState("");
  const [emergencySent, setEmergencySent] = useState(false);
  const [ahaFlash, setAhaFlash] = useState(false);
  const [ready, setReady] = useState(false);
  const [liveNews, setLiveNews] = useState<NewsItem[]>([]);
  const [handle, setHandle] = useState("anonymous");
  const inputRef = useRef<HTMLInputElement>(null);
  // Multi-cluster
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [terrLoading, setTerrLoading] = useState(true);
  const [setupHandle, setSetupHandle] = useState("");
  const [showCustomZip, setShowCustomZip] = useState(false);
  // Warchest
  const [warchestTotal, setWarchestTotal] = useState(0);
  const [pledgeAmount, setPledgeAmount] = useState<number | "">("");
  const [pledgePurpose, setPledgePurpose] = useState("General");
  const [pledgeSent, setPledgeSent] = useState(false);
  const [pledging, setPledging] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150);
    // Check if already set up from localStorage
    const saved = localStorage.getItem("7gnet_zip");
    const savedHandle = localStorage.getItem("7gnet_handle");
    if (savedHandle) { setHandle(savedHandle); setSetupHandle(savedHandle); }
    if (saved) { setZip(saved); setAppState("live"); fetchNews(saved); fetchWarchest(saved); }
    // Check today's check-in
    const todayKey = new Date().toDateString();
    const lastCheckin = localStorage.getItem("7gnet_checkin");
    if (lastCheckin === todayKey) setCheckedIn(true);
    const savedStreak = parseInt(localStorage.getItem("7gnet_streak") || "0");
    setStreak(savedStreak);
    // Fetch territories
    fetchTerritories();
    // Check URL tab param
    const params = new URLSearchParams(window.location.search);
    const t2 = params.get("tab") as Tab | null;
    if (t2) setTab(t2);
    return () => clearTimeout(t);
  }, []);

  async function fetchNews(z: string) {
    try {
      const res = await fetch(`/api/cluster/news?zip=${z}`);
      const json = await res.json();
      if (json.news?.length) setLiveNews(json.news);
    } catch { /* use mock fallback */ }
  }

  async function fetchTerritories() {
    try {
      const res = await fetch(
        "https://flzivjhxtbolcfaniskv.supabase.co/rest/v1/xi_territories?select=code,name,timezone,status,zip_codes&order=status.asc",
        { headers: { apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps" } }
      );
      const data = await res.json();
      if (Array.isArray(data)) setTerritories(data);
    } catch {}
    finally { setTerrLoading(false); }
  }

  async function fetchWarchest(z: string) {
    try {
      const res = await fetch(`/api/cluster/warchest?zip=${z}`);
      const json = await res.json();
      if (json.total != null) setWarchestTotal(json.total);
    } catch {}
  }

  async function handlePledge(e: React.FormEvent) {
    e.preventDefault();
    if (!pledgeAmount || Number(pledgeAmount) <= 0) return;
    setPledging(true);
    try {
      await fetch("/api/cluster/warchest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip, handle, amount: pledgeAmount, purpose: pledgePurpose }),
      });
      setWarchestTotal(prev => prev + Number(pledgeAmount));
      setPledgeSent(true);
      if ("vibrate" in navigator) navigator.vibrate([80, 40, 160]);
    } catch {}
    finally { setPledging(false); }
  }

  function enterTerritory(terr: Territory) {
    const z = terr.zip_codes?.[0] || terr.code;
    const h = setupHandle.trim() || "anonymous";
    localStorage.setItem("7gnet_zip", z);
    localStorage.setItem("7gnet_handle", h);
    localStorage.setItem("7gnet_territory", terr.code);
    setZip(z); setHandle(h);
    fetchNews(z); fetchWarchest(z);
    triggerAhaMoment();
  }

  const meta = CLUSTER_META[zip];
  const isKnownCluster = !!meta;

  // Build cluster view — merge live API data with static seed
  const cluster = {
    steward: meta?.steward || "Open",
    city: meta?.city || `Zip ${zip}`,
    brothers: meta?.brothers || 0,
    businesses: meta?.businesses || [],
    // Use live news from API if available, else empty (API may seed from DB)
    news: liveNews.map(n => ({
      headline: n.headline,
      body: n.body || "",
      time: timeAgo(n.published_at),
    })),
  };

  function triggerAhaMoment() {
    setAppState("aha");
    setAhaFlash(true);
    // Haptic feedback — vibrate pattern: short-long-short
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 300, 50, 100]);
    }
    setTimeout(() => {
      setAhaFlash(false);
      setAppState("live");
    }, 2200);
  }

  function handleZipSubmit(e: React.FormEvent) {
    e.preventDefault();
    const z = zipInput.trim();
    if (!z || z.length < 4) return;
    const h = setupHandle.trim() || "anonymous";
    localStorage.setItem("7gnet_zip", z);
    localStorage.setItem("7gnet_handle", h);
    setZip(z); setHandle(h);
    fetchNews(z); fetchWarchest(z);
    triggerAhaMoment();
  }

  async function handleCheckIn() {
    if (checkedIn) return;
    if ("vibrate" in navigator) navigator.vibrate([80, 40, 80]);
    // Optimistic update
    const todayKey = new Date().toDateString();
    localStorage.setItem("7gnet_checkin", todayKey);
    setCheckedIn(true);
    // Call real API
    try {
      const res = await fetch("/api/cluster/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip, handle }),
      });
      const json = await res.json();
      if (json.streak) {
        setStreak(json.streak);
        localStorage.setItem("7gnet_streak", String(json.streak));
      }
    } catch {
      // Fallback: bump local streak
      const newStreak = streak + 1;
      localStorage.setItem("7gnet_streak", String(newStreak));
      setStreak(newStreak);
    }
  }

  function handleClaim(i: number) {
    setClaimIdx(i);
    setClaimStep(1);
    setTab("claim");
  }

  async function handleClaimSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/yard-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: claimName, phone: claimPhone,
        address: cluster.businesses[claimIdx!]?.name || "",
        zip, service: "b2b_claim",
        notes: `B2B CLAIM — ${claimName} / ${claimPhone} / ${cluster.businesses[claimIdx!]?.name} / zip ${zip}`,
        source: "7gnet_app", timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
    setClaimSent(true);
    if ("vibrate" in navigator) navigator.vibrate([60, 30, 60]);
  }

  async function handleEmergencySubmit(e: React.FormEvent) {
    e.preventDefault();
    if ("vibrate" in navigator) navigator.vibrate([200, 100, 200, 100, 200]);
    await fetch("/api/cluster/911", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zip, handle,
        emergency_type: emergencyType,
        message: emergencyMsg,
        severity: "medium",
      }),
    }).catch(() => {});
    setEmergencySent(true);
  }

  // ── SETUP STATE ─────────────────────────────────────────────────────────────
  if (appState === "setup") return (
    <div style={{
      minHeight: "100dvh", background: BG, display: "flex", flexDirection: "column",
      padding: "32px 24px 48px", fontFamily: "'JetBrains Mono', monospace",
      opacity: ready ? 1 : 0, transition: "opacity 0.5s ease", overflowY: "auto",
    }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <img src="/makoa_icon.png" alt="7G Net" style={{ width: 56, height: 56, marginBottom: 16, opacity: 0.9 }} />
        <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.25em", margin: "0 0 6px" }}>7G NET · MĀKOA BROTHERHOOD</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.8rem", color: GOLD, margin: "0 0 6px", fontWeight: 300 }}>
          Claim Your Territory.
        </h1>
        <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.4rem", lineHeight: 1.6, margin: 0 }}>
          Select your cluster. Enter as a brother.
        </p>
      </div>

      {/* Handle entry */}
      <div style={{ marginBottom: 20, maxWidth: 400, width: "100%", alignSelf: "center" }}>
        <p style={{ color: GOLD_40, fontSize: "0.36rem", letterSpacing: "0.2em", margin: "0 0 6px" }}>YOUR HANDLE (optional)</p>
        <input
          type="text" value={setupHandle}
          onChange={e => setSetupHandle(e.target.value)}
          placeholder="How brothers know you"
          maxLength={40}
          style={{
            width: "100%", background: GOLD_10, border: `1px solid ${GOLD_20}`,
            borderRadius: 6, padding: "12px 14px", color: "#e8e0d0",
            fontSize: "0.9rem", fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box",
          }}
        />
      </div>

      {/* Territory list */}
      <div style={{ maxWidth: 400, width: "100%", alignSelf: "center" }}>
        <p style={{ color: GOLD_40, fontSize: "0.36rem", letterSpacing: "0.2em", margin: "0 0 10px" }}>SELECT YOUR CLUSTER</p>

        {terrLoading ? (
          <div style={{ textAlign: "center", padding: 24, color: GOLD_40, fontSize: "0.4rem", letterSpacing: "0.15em" }}>
            LOADING TERRITORIES...
          </div>
        ) : territories.length > 0 ? (
          <div style={{ display: "grid", gap: 8 }}>
            {/* Active + forming first */}
            {[...territories.filter(t => t.status === "active" || t.status === "forming"),
               ...territories.filter(t => t.status === "open")].map(t => {
              const isLive = t.status === "active";
              const isForming = t.status === "forming";
              const localTime = (() => { try { return new Intl.DateTimeFormat("en-US", { timeZone: t.timezone, hour: "2-digit", minute: "2-digit", hour12: true }).format(new Date()); } catch { return ""; } })();
              return (
                <button
                  key={t.code}
                  onClick={() => (isLive || isForming) ? enterTerritory(t) : setShowCustomZip(true)}
                  style={{
                    background: isLive ? GOLD_10 : isForming ? "rgba(63,185,80,0.06)" : "rgba(176,142,80,0.03)",
                    border: `1px solid ${isLive ? GOLD_40 : isForming ? "rgba(63,185,80,0.3)" : GOLD_20}`,
                    borderRadius: 8, padding: "12px 14px", cursor: "pointer",
                    fontFamily: "'JetBrains Mono', monospace", textAlign: "left",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    opacity: isLive || isForming ? 1 : 0.5,
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.46rem", color: isLive ? GOLD : isForming ? GREEN : GOLD_40, fontWeight: 700, marginBottom: 2 }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: "0.34rem", color: GOLD_40 }}>
                      {isLive ? "◉ LIVE" : isForming ? "◐ FORMING" : "○ OPENING SOON"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {localTime && <div style={{ fontSize: "0.44rem", color: isLive ? GOLD : GOLD_40, fontWeight: 700 }}>{localTime}</div>}
                    {isLive && <div style={{ fontSize: "0.3rem", color: GREEN, marginTop: 2 }}>ENTER →</div>}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Fallback: show static seed if Supabase not yet migrated */
          <div style={{ display: "grid", gap: 8 }}>
            {[{ code: "HI-96792", name: "West Oahu · ZIP 96792", timezone: "Pacific/Honolulu", status: "active", zip_codes: ["96792"] }].map(t => (
              <button key={t.code} onClick={() => enterTerritory(t)} style={{
                background: GOLD_10, border: `1px solid ${GOLD_40}`, borderRadius: 8,
                padding: "14px 16px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ fontSize: "0.46rem", color: GOLD, fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: "0.34rem", color: GOLD_40 }}>◉ LIVE · FOUNDING CLUSTER</div>
                </div>
                <div style={{ fontSize: "0.34rem", color: GREEN }}>ENTER →</div>
              </button>
            ))}
          </div>
        )}

        {/* Custom ZIP fallback */}
        <button
          onClick={() => setShowCustomZip(v => !v)}
          style={{ background: "none", border: "none", color: GOLD_40, fontSize: "0.36rem", marginTop: 16, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", width: "100%", textAlign: "center" }}
        >
          {showCustomZip ? "▲ hide" : "My zip isn't listed yet →"}
        </button>
        {showCustomZip && (
          <form onSubmit={handleZipSubmit} style={{ display: "grid", gap: 8, marginTop: 8 }}>
            <input
              ref={inputRef} type="text" inputMode="numeric"
              value={zipInput} onChange={e => setZipInput(e.target.value)}
              placeholder="Enter your zip code" maxLength={10}
              style={{
                background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 6,
                padding: "12px 14px", color: "#e8e0d0", fontSize: "0.9rem",
                fontFamily: "'JetBrains Mono', monospace", textAlign: "center", boxSizing: "border-box",
              }}
            />
            <button type="submit" style={{
              background: GOLD, border: "none", color: "#000", fontSize: "0.44rem",
              letterSpacing: "0.15em", padding: "12px", cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, borderRadius: 6,
            }}>
              ENTER THIS ZIP →
            </button>
          </form>
        )}
      </div>
    </div>
  );

  // ── AHA MOMENT ──────────────────────────────────────────────────────────────
  if (appState === "aha") return (
    <div style={{
      minHeight: "100dvh", background: ahaFlash ? GOLD_20 : BG,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 32,
      fontFamily: "'JetBrains Mono', monospace",
      transition: "background 0.3s ease",
    }}>
      <div style={{
        fontSize: "3.5rem", marginBottom: 24,
        animation: "pulse 0.6s ease infinite",
      }}>◉</div>
      <p style={{
        color: GOLD, fontSize: "0.6rem", letterSpacing: "0.3em",
        marginBottom: 12, animation: "pulse 0.6s ease infinite",
      }}>
        CLUSTER FOUND
      </p>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
        fontSize: "2.2rem", color: "#e8e0d0", fontWeight: 300, textAlign: "center", margin: "0 0 8px",
      }}>
        {isKnownCluster ? cluster.city : `Zip ${zip}`}
      </h2>
      <p style={{ color: GOLD_40, fontSize: "0.44rem", textAlign: "center" }}>
        {isKnownCluster
          ? `${cluster.brothers} brothers · Steward: ${cluster.steward}`
          : "Opening cluster — be the first Steward."}
      </p>
    </div>
  );

  // ── LIVE APP ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100dvh", background: BG,
      fontFamily: "'JetBrains Mono', monospace",
      maxWidth: 480, margin: "0 auto",
      display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        * { box-sizing: border-box; }
        input, textarea { outline: none; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "16px 20px 12px",
        borderBottom: `1px solid ${GOLD_20}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ color: GOLD_40, fontSize: "0.36rem", letterSpacing: "0.2em", margin: 0 }}>7G NET · {zip}</p>
          <p style={{ color: GOLD, fontSize: "0.52rem", margin: "2px 0 0", letterSpacing: "0.08em" }}>
            {isKnownCluster ? cluster.city : `Zip ${zip}`}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          {isKnownCluster ? (
            <>
              <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.36rem", margin: 0 }}>{cluster.brothers} brothers</p>
              <p style={{ color: GOLD_40, fontSize: "0.34rem", margin: "2px 0 0" }}>
                Steward: {cluster.steward}
              </p>
            </>
          ) : (
            <button
              onClick={() => { localStorage.removeItem("7gnet_zip"); setZip(""); setZipInput(""); setAppState("setup"); }}
              style={{ background: "none", border: `1px solid ${GOLD_40}`, color: GOLD_40, fontSize: "0.34rem", padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}
            >
              change zip
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 80px" }}>

        {/* HOME TAB */}
        {tab === "home" && (
          <div style={{ padding: "20px 20px 0", animation: "fadeUp 0.4s ease" }}>

            {/* Daily Check-in Card */}
            <div style={{
              background: checkedIn ? GREEN_20 : GOLD_10,
              border: `1px solid ${checkedIn ? GREEN_20 : GOLD_40}`,
              borderRadius: 10, padding: "18px 20px", marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <p style={{ color: checkedIn ? GREEN : GOLD, fontSize: "0.42rem", letterSpacing: "0.15em", margin: 0 }}>
                    {checkedIn ? "◉ CHECKED IN" : "DAILY CHECK-IN"}
                  </p>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.36rem", margin: "4px 0 0" }}>
                    {checkedIn ? `Streak: ${streak} days` : "Tap to mark your presence"}
                  </p>
                </div>
                {streak > 0 && (
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: GOLD, fontSize: "1.4rem", fontFamily: "'Cormorant Garamond', serif", margin: 0, fontWeight: 300 }}>{streak}</p>
                    <p style={{ color: GOLD_40, fontSize: "0.3rem", margin: 0 }}>day streak</p>
                  </div>
                )}
              </div>
              {!checkedIn && (
                <button
                  onClick={handleCheckIn}
                  style={{
                    width: "100%", background: GOLD, border: "none", color: "#000",
                    fontSize: "0.46rem", letterSpacing: "0.18em", padding: "12px",
                    cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700, borderRadius: 6,
                  }}
                >
                  I SHOWED UP TODAY →
                </button>
              )}
            </div>

            {/* Cluster Status */}
            {!isKnownCluster && (
              <div style={{
                background: GOLD_10, border: `1px solid ${GOLD_40}`,
                borderRadius: 10, padding: "18px 20px", marginBottom: 16,
              }}>
                <p style={{ color: GOLD, fontSize: "0.44rem", letterSpacing: "0.12em", margin: "0 0 8px" }}>
                  OPEN CLUSTER — ZIP {zip}
                </p>
                <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.42rem", lineHeight: 1.65, margin: "0 0 14px" }}>
                  This zip cluster has no Steward yet. 1,000 seats worldwide. First to claim this territory leads it.
                </p>
                <a href="/steward/apply" style={{
                  display: "block", textAlign: "center", background: GOLD, color: "#000",
                  fontSize: "0.44rem", letterSpacing: "0.16em", padding: "12px",
                  textDecoration: "none", fontWeight: 700, borderRadius: 6, fontFamily: "'JetBrains Mono', monospace",
                }}>
                  APPLY TO BE STEWARD →
                </a>
              </div>
            )}

            {/* Quick nav cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { key: "411" as Tab, icon: "◈", label: "411 FEED", sub: "Good news only", color: BLUE, bg: BLUE_20 },
                { key: "claim" as Tab, icon: "◉", label: "CLAIM BIZ", sub: "Add your business", color: GOLD, bg: GOLD_10 },
                { key: "911" as Tab, icon: "▲", label: "911 CHANNEL", sub: "Emergency only", color: RED, bg: RED_20 },
                { key: "home" as Tab, icon: "⬡", label: "STEWARD", sub: isKnownCluster ? cluster.steward : "Apply now", color: GOLD_40, bg: GOLD_10 },
              ].map((c) => (
                <button
                  key={c.key}
                  onClick={() => setTab(c.key)}
                  style={{
                    background: c.bg, border: `1px solid ${c.color}33`,
                    borderRadius: 8, padding: "14px 12px", cursor: "pointer",
                    textAlign: "left", fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <p style={{ color: c.color, fontSize: "1rem", margin: "0 0 4px" }}>{c.icon}</p>
                  <p style={{ color: c.color, fontSize: "0.4rem", letterSpacing: "0.1em", margin: "0 0 2px", fontWeight: 700 }}>{c.label}</p>
                  <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.34rem", margin: 0 }}>{c.sub}</p>
                </button>
              ))}
            </div>

            {/* Latest 411 preview */}
            {isKnownCluster && cluster.news.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: BLUE, fontSize: "0.38rem", letterSpacing: "0.18em", margin: "0 0 8px" }}>LATEST FROM 411</p>
                {cluster.news.slice(0, 1).map((n, i) => (
                  <div key={i} style={{
                    background: BLUE_20, border: `1px solid ${BLUE}22`,
                    borderRadius: 8, padding: "14px 16px",
                  }}>
                    <p style={{ color: "#e8e0d0", fontSize: "0.44rem", fontWeight: 700, margin: "0 0 4px", lineHeight: 1.4 }}>{n.headline}</p>
                    <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.38rem", margin: "0 0 6px", lineHeight: 1.5 }}>{n.body}</p>
                    <p style={{ color: BLUE, fontSize: "0.32rem", margin: 0 }}>{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 411 TAB */}
        {tab === "411" && (
          <div style={{ padding: "20px 20px 0", animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <p style={{ color: BLUE, fontSize: "1rem", margin: 0 }}>◈</p>
              <div>
                <p style={{ color: BLUE, fontSize: "0.46rem", letterSpacing: "0.15em", margin: 0 }}>411 — GOOD NEWS ONLY</p>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.36rem", margin: "2px 0 0" }}>Hyper-local · Zip {zip} · Updated daily by XI</p>
              </div>
            </div>
            {isKnownCluster && cluster.news.length > 0 ? (
              <div style={{ display: "grid", gap: 10 }}>
                {cluster.news.map((n, i) => (
                  <div key={i} style={{
                    background: BLUE_20, border: `1px solid ${BLUE}22`,
                    borderRadius: 8, padding: "16px",
                    animation: `fadeUp ${0.3 + i * 0.1}s ease`,
                  }}>
                    <p style={{ color: "#e8e0d0", fontSize: "0.46rem", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.4 }}>{n.headline}</p>
                    <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", margin: "0 0 8px", lineHeight: 1.6 }}>{n.body}</p>
                    <p style={{ color: BLUE, fontSize: "0.32rem", margin: 0 }}>{n.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: BLUE_20, border: `1px solid ${BLUE}22`,
                borderRadius: 8, padding: "24px", textAlign: "center",
              }}>
                <p style={{ color: BLUE, fontSize: "0.46rem", margin: "0 0 8px" }}>◈ No news yet</p>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.4rem", lineHeight: 1.6 }}>
                  When a Steward is approved for zip {zip}, XI will begin curating daily good news for this cluster.
                </p>
              </div>
            )}
            <div style={{ marginTop: 20, padding: "14px 16px", background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 8 }}>
              <p style={{ color: GOLD_40, fontSize: "0.36rem", margin: "0 0 6px" }}>HOW 411 WORKS</p>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.38rem", lineHeight: 1.65, margin: 0 }}>
                XI scrapes local sources daily — city council, community pages, trade completions, brotherhood milestones.
                Good news only. Your Steward can also submit stories. No negativity. No national news.
              </p>
            </div>
          </div>
        )}

        {/* 911 TAB */}
        {tab === "911" && (
          <div style={{ padding: "20px 20px 0", animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <p style={{ color: RED, fontSize: "1rem", margin: 0 }}>▲</p>
              <div>
                <p style={{ color: RED, fontSize: "0.46rem", letterSpacing: "0.15em", margin: 0 }}>911 — EMERGENCY CHANNEL</p>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.36rem", margin: "2px 0 0" }}>Brotherhood only · Steward notified instantly</p>
              </div>
            </div>
            <div style={{ background: RED_20, border: `1px solid ${RED}44`, borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ color: RED, fontSize: "0.38rem", margin: "0 0 4px", letterSpacing: "0.1em" }}>LIFE-THREATENING EMERGENCY?</p>
              <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.38rem", margin: 0 }}>
                Call 911 first. This channel is for brotherhood coordination — not a substitute for emergency services.
              </p>
            </div>
            {!emergencySent ? (
              <form onSubmit={handleEmergencySubmit} style={{ display: "grid", gap: 12 }}>
                <div>
                  <p style={{ color: RED, fontSize: "0.38rem", letterSpacing: "0.12em", margin: "0 0 6px" }}>TYPE OF SITUATION</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {["medical", "safety", "resource"].map((t) => (
                      <button
                        key={t} type="button"
                        onClick={() => setEmergencyType(t)}
                        style={{
                          padding: "10px 6px", borderRadius: 6, cursor: "pointer",
                          background: emergencyType === t ? RED_20 : "rgba(248,81,73,0.05)",
                          border: `1px solid ${emergencyType === t ? RED : "rgba(248,81,73,0.2)"}`,
                          color: emergencyType === t ? RED : "rgba(232,224,208,0.4)",
                          fontSize: "0.36rem", letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace",
                          textTransform: "uppercase",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ color: RED, fontSize: "0.38rem", letterSpacing: "0.12em", margin: "0 0 6px" }}>WHAT'S HAPPENING</p>
                  <textarea
                    value={emergencyMsg}
                    onChange={e => setEmergencyMsg(e.target.value)}
                    placeholder="Brief description — your Steward will respond"
                    rows={3}
                    required
                    style={{
                      width: "100%", background: RED_20, border: `1px solid ${RED}44`,
                      borderRadius: 6, padding: "10px 12px", color: "#e8e0d0",
                      fontSize: "0.44rem", fontFamily: "'JetBrains Mono', monospace",
                      resize: "vertical", lineHeight: 1.6,
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!emergencyType || !emergencyMsg}
                  style={{
                    width: "100%", background: emergencyType && emergencyMsg ? RED : "rgba(248,81,73,0.2)",
                    border: "none", color: emergencyType && emergencyMsg ? "#fff" : "rgba(248,81,73,0.4)",
                    fontSize: "0.46rem", letterSpacing: "0.18em", padding: "14px",
                    cursor: emergencyType && emergencyMsg ? "pointer" : "not-allowed",
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, borderRadius: 6,
                  }}
                >
                  ALERT STEWARD NOW →
                </button>
              </form>
            ) : (
              <div style={{
                background: RED_20, border: `1px solid ${RED}44`,
                borderRadius: 8, padding: "28px", textAlign: "center",
                animation: "fadeUp 0.4s ease",
              }}>
                <p style={{ color: RED, fontSize: "0.52rem", letterSpacing: "0.15em", margin: "0 0 8px" }}>▲ STEWARD ALERTED</p>
                <p style={{ color: "#e8e0d0", fontSize: "0.44rem", margin: "0 0 8px" }}>Your Steward has been notified and will respond.</p>
                <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>Brotherhood takes care of its own.</p>
              </div>
            )}
          </div>
        )}

        {/* CLAIM TAB */}
        {tab === "claim" && (
          <div style={{ padding: "20px 20px 0", animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <p style={{ color: GOLD, fontSize: "1rem", margin: 0 }}>◉</p>
              <div>
                <p style={{ color: GOLD, fontSize: "0.46rem", letterSpacing: "0.15em", margin: 0 }}>CLAIM YOUR BUSINESS</p>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.36rem", margin: "2px 0 0" }}>
                  Zip {zip} · {cluster.businesses.filter(b => !b.claimed).length} unclaimed listings
                </p>
              </div>
            </div>

            {claimSent ? (
              <div style={{
                background: GREEN_20, border: `1px solid ${GREEN}44`,
                borderRadius: 8, padding: "28px", textAlign: "center",
                animation: "fadeUp 0.4s ease",
              }}>
                <p style={{ color: GREEN, fontSize: "0.52rem", letterSpacing: "0.15em", margin: "0 0 8px" }}>◉ CLAIM RECEIVED</p>
                <p style={{ color: "#e8e0d0", fontSize: "0.44rem", margin: "0 0 8px" }}>
                  Your Steward will verify and activate your listing within 24 hours.
                </p>
                <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>
                  Once active, brothers in your cluster will see your business first.
                </p>
                <button
                  onClick={() => { setClaimSent(false); setClaimIdx(null); setClaimStep(0); setClaimName(""); setClaimPhone(""); }}
                  style={{
                    marginTop: 16, background: "none", border: `1px solid ${GOLD_40}`,
                    color: GOLD_40, fontSize: "0.38rem", padding: "8px 16px",
                    borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  claim another
                </button>
              </div>
            ) : claimIdx !== null && claimStep === 1 ? (
              <div>
                <div style={{ background: GOLD_10, border: `1px solid ${GOLD_40}`, borderRadius: 8, padding: "16px", marginBottom: 16 }}>
                  <p style={{ color: GOLD_40, fontSize: "0.36rem", margin: "0 0 4px" }}>CLAIMING</p>
                  <p style={{ color: "#e8e0d0", fontSize: "0.48rem", margin: 0 }}>{cluster.businesses[claimIdx]?.name}</p>
                  <p style={{ color: GOLD_40, fontSize: "0.36rem", margin: "4px 0 0" }}>{cluster.businesses[claimIdx]?.category}</p>
                </div>
                <form onSubmit={handleClaimSubmit} style={{ display: "grid", gap: 12 }}>
                  <div>
                    <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", margin: "0 0 6px" }}>YOUR NAME</p>
                    <input
                      type="text" value={claimName} onChange={e => setClaimName(e.target.value)}
                      placeholder="First + Last" required
                      style={{
                        width: "100%", background: GOLD_10, border: `1px solid ${GOLD_40}`,
                        borderRadius: 6, padding: "10px 12px", color: "#e8e0d0",
                        fontSize: "0.46rem", fontFamily: "'JetBrains Mono', monospace",
                      }}
                    />
                  </div>
                  <div>
                    <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", margin: "0 0 6px" }}>PHONE</p>
                    <input
                      type="tel" value={claimPhone} onChange={e => setClaimPhone(e.target.value)}
                      placeholder="808-xxx-xxxx" required
                      style={{
                        width: "100%", background: GOLD_10, border: `1px solid ${GOLD_40}`,
                        borderRadius: 6, padding: "10px 12px", color: "#e8e0d0",
                        fontSize: "0.46rem", fontFamily: "'JetBrains Mono', monospace",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      width: "100%", background: GOLD, border: "none", color: "#000",
                      fontSize: "0.46rem", letterSpacing: "0.18em", padding: "13px",
                      cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700, borderRadius: 6,
                    }}
                  >
                    CLAIM THIS BUSINESS →
                  </button>
                  <button
                    type="button"
                    onClick={() => { setClaimIdx(null); setClaimStep(0); }}
                    style={{
                      background: "none", border: "none", color: "rgba(232,224,208,0.3)",
                      fontSize: "0.38rem", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    ← back
                  </button>
                </form>
              </div>
            ) : (
              <>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem", lineHeight: 1.65, margin: "0 0 16px" }}>
                  These businesses are already on the 7G Net directory for your zip. Claim yours — brothers search here first.
                </p>
                <div style={{ display: "grid", gap: 10 }}>
                  {cluster.businesses.length > 0 ? cluster.businesses.map((b, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: b.claimed ? GREEN_20 : GOLD_10,
                      border: `1px solid ${b.claimed ? GREEN_20 : GOLD_20}`,
                      borderRadius: 8, padding: "14px 16px",
                    }}>
                      <div>
                        <p style={{ color: b.claimed ? GREEN : "#e8e0d0", fontSize: "0.44rem", margin: "0 0 2px", fontWeight: b.claimed ? 700 : 400 }}>{b.name}</p>
                        <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.36rem", margin: 0 }}>{b.category}</p>
                      </div>
                      {b.claimed ? (
                        <p style={{ color: GREEN, fontSize: "0.36rem", flexShrink: 0 }}>◉ CLAIMED</p>
                      ) : (
                        <button
                          onClick={() => handleClaim(i)}
                          style={{
                            background: GOLD, border: "none", color: "#000",
                            fontSize: "0.34rem", letterSpacing: "0.1em", padding: "8px 12px",
                            cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 700, borderRadius: 4, flexShrink: 0,
                          }}
                        >
                          CLAIM →
                        </button>
                      )}
                    </div>
                  )) : (
                    <div style={{ background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 8, padding: "20px", textAlign: "center" }}>
                      <p style={{ color: GOLD_40, fontSize: "0.44rem", margin: "0 0 8px" }}>No listings yet for zip {zip}</p>
                      <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.4rem", lineHeight: 1.6, margin: 0 }}>
                        Once a Steward is approved, XI will scrape and preload businesses in this cluster.
                      </p>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 16, padding: "14px 16px", background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 8 }}>
                  <p style={{ color: GOLD_40, fontSize: "0.36rem", margin: "0 0 6px" }}>DON'T SEE YOUR BUSINESS?</p>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.38rem", lineHeight: 1.6, margin: "0 0 10px" }}>
                    Not in the directory yet? Submit your listing — your Steward will add you to the cluster.
                  </p>
                  <button
                    onClick={() => { setClaimIdx(cluster.businesses.length); setClaimStep(1); }}
                    style={{
                      background: "none", border: `1px solid ${GOLD_40}`, color: GOLD,
                      fontSize: "0.38rem", padding: "8px 14px", borderRadius: 4,
                      cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    + ADD MY BUSINESS
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* WARCHEST TAB */}
        {tab === "warchest" && (
          <div style={{ padding: "20px 20px 0", animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <p style={{ color: GOLD, fontSize: "1rem", margin: 0 }}>◈</p>
              <div>
                <p style={{ color: GOLD, fontSize: "0.46rem", letterSpacing: "0.15em", margin: 0 }}>CLUSTER WARCHEST</p>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.36rem", margin: "2px 0 0" }}>Zip {zip} · fund the brotherhood</p>
              </div>
            </div>

            {/* Total */}
            <div style={{ background: GOLD_10, border: `1px solid ${GOLD_40}`, borderRadius: 10, padding: "20px", marginBottom: 16, textAlign: "center" }}>
              <p style={{ color: GOLD_40, fontSize: "0.36rem", letterSpacing: "0.2em", margin: "0 0 4px" }}>TOTAL PLEDGED</p>
              <p style={{ color: GOLD, fontSize: "2rem", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, margin: "0 0 4px" }}>
                ${warchestTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem", margin: 0 }}>
                80% dispatched to brothers · 10% house · 10% order
              </p>
            </div>

            {pledgeSent ? (
              <div style={{ background: GREEN_20, border: `1px solid rgba(63,185,80,0.3)`, borderRadius: 8, padding: "28px", textAlign: "center", animation: "fadeUp 0.4s ease" }}>
                <p style={{ color: GREEN, fontSize: "0.52rem", letterSpacing: "0.15em", margin: "0 0 8px" }}>◉ PLEDGE RECORDED</p>
                <p style={{ color: "#e8e0d0", fontSize: "0.44rem", margin: "0 0 8px" }}>
                  ${Number(pledgeAmount).toFixed(2)} pledged to the {zip} Warchest.
                </p>
                <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>Your Steward will confirm and route the funds.</p>
                <button
                  onClick={() => { setPledgeSent(false); setPledgeAmount(""); }}
                  style={{ marginTop: 14, background: "none", border: `1px solid ${GOLD_40}`, color: GOLD_40, fontSize: "0.38rem", padding: "7px 14px", borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  pledge again
                </button>
              </div>
            ) : (
              <form onSubmit={handlePledge} style={{ display: "grid", gap: 12 }}>
                <div>
                  <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", margin: "0 0 8px" }}>PLEDGE AMOUNT</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 8 }}>
                    {[5, 10, 25, 50].map(amt => (
                      <button key={amt} type="button" onClick={() => setPledgeAmount(amt)} style={{
                        background: pledgeAmount === amt ? GOLD_20 : GOLD_10,
                        border: `1px solid ${pledgeAmount === amt ? GOLD_40 : GOLD_20}`,
                        color: pledgeAmount === amt ? GOLD : GOLD_40,
                        padding: "10px 6px", borderRadius: 6, cursor: "pointer",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "0.44rem", fontWeight: 700,
                      }}>
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number" min="1" max="500" step="1"
                    value={pledgeAmount === "" ? "" : pledgeAmount}
                    onChange={e => setPledgeAmount(e.target.value ? Number(e.target.value) : "")}
                    placeholder="Custom amount"
                    style={{
                      width: "100%", background: GOLD_10, border: `1px solid ${GOLD_20}`,
                      borderRadius: 6, padding: "10px 12px", color: "#e8e0d0",
                      fontSize: "0.9rem", fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <p style={{ color: GOLD_40, fontSize: "0.38rem", letterSpacing: "0.12em", margin: "0 0 6px" }}>PURPOSE</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {["General", "War Room", "Brother in need", "Trade fund"].map(p => (
                      <button key={p} type="button" onClick={() => setPledgePurpose(p)} style={{
                        background: pledgePurpose === p ? GOLD_10 : "transparent",
                        border: `1px solid ${pledgePurpose === p ? GOLD_40 : GOLD_20}`,
                        color: pledgePurpose === p ? GOLD : GOLD_40,
                        padding: "8px 10px", borderRadius: 5, cursor: "pointer",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "0.36rem",
                      }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!pledgeAmount || pledging}
                  style={{
                    background: pledgeAmount ? GOLD : "rgba(176,142,80,0.2)",
                    border: "none", color: pledgeAmount ? "#000" : GOLD_40,
                    fontSize: "0.46rem", letterSpacing: "0.18em", padding: "14px",
                    cursor: pledgeAmount ? "pointer" : "not-allowed",
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, borderRadius: 6,
                  }}
                >
                  {pledging ? "PLEDGING..." : "PLEDGE TO THE WARCHEST →"}
                </button>
                <p style={{ color: GOLD_40, fontSize: "0.34rem", textAlign: "center", margin: 0, lineHeight: 1.6 }}>
                  Pledge recorded now. Payment collected when your Steward activates disbursement.
                </p>
              </form>
            )}
          </div>
        )}

      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "#07090e", borderTop: `1px solid ${GOLD_20}`,
        display: "grid", gridTemplateColumns: "repeat(5, 1fr)", padding: "8px 0 12px",
      }}>
        {[
          { key: "home" as Tab, icon: "⬡", label: "HOME" },
          { key: "411" as Tab, icon: "◈", label: "411" },
          { key: "claim" as Tab, icon: "◉", label: "CLAIM" },
          { key: "warchest" as Tab, icon: "◆", label: "WAR$" },
          { key: "911" as Tab, icon: "▲", label: "911" },
        ].map((n) => (
          <button
            key={n.key}
            onClick={() => setTab(n.key)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              fontFamily: "'JetBrains Mono', monospace",
              color: tab === n.key
                ? (n.key === "911" ? RED : n.key === "411" ? BLUE : GOLD)
                : "rgba(176,142,80,0.25)",
            }}
          >
            <span style={{ fontSize: "1rem" }}>{n.icon}</span>
            <span style={{ fontSize: "0.3rem", letterSpacing: "0.1em" }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
