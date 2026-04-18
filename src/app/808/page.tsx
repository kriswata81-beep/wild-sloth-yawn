"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";
const GREEN_10 = "rgba(63,185,80,0.1)";
const BLUE = "#58a6ff";
const BLUE_20 = "rgba(88,166,255,0.2)";
const BLUE_10 = "rgba(88,166,255,0.1)";
const AMBER = "#f0883e";
const AMBER_20 = "rgba(240,136,62,0.2)";
const AMBER_10 = "rgba(240,136,62,0.1)";
const BG = "#04060a";

// West Oahu zip clusters — Steward 0001 territory
const ZIP_CLUSTERS = [
  { zip: "96792", area: "Waianae · Mākaha", steward: "Steward 0001", status: "ACTIVE", color: GOLD },
  { zip: "96707", area: "Kapolei", steward: "Steward 0001", status: "ACTIVE", color: GOLD },
  { zip: "96706", area: "Ewa Beach", steward: "Steward 0001", status: "ACTIVE", color: GOLD },
  { zip: "96797", area: "Waipahu", steward: "Open", status: "OPEN", color: GREEN },
  { zip: "96782", area: "Pearl City", steward: "Open", status: "OPEN", color: GREEN },
  { zip: "96701", area: "Aiea", steward: "Open", status: "OPEN", color: BLUE },
  { zip: "96786", area: "Mililani", steward: "Open", status: "OPEN", color: BLUE },
  { zip: "96791", area: "Waialua · Haleiwa", steward: "Open", status: "OPEN", color: BLUE },
];

const ROUTE_TYPES = [
  {
    tier: "NĀ KOA",
    route: "P2P",
    color: GREEN,
    bg: GREEN_10,
    border: GREEN_20,
    icon: "◎",
    desc: "Free tier. Peer-to-peer. Activate anywhere a Mana Steward holds a zip cluster. Mobile · Hotspot · 4AM Wednesday call access.",
    who: "Any brother. Any city. Any time zone.",
    cost: "FREE",
  },
  {
    tier: "MANA STEWARD",
    route: "B2C · ZIP CLUSTER",
    color: AMBER,
    bg: AMBER_10,
    border: AMBER_20,
    icon: "◈",
    desc: "Hold a zip code cluster. Manage the community-facing route. Dispatch Nā Koa P2P jobs. Run the local 808 node. First 100 = Founders.",
    who: "Community leaders. Local operators. Block-by-block.",
    cost: "$497/yr · 1,000 seats worldwide",
  },
  {
    tier: "MANA AMBASSADOR",
    route: "B2B · ZIP ROUTES",
    color: BLUE,
    bg: BLUE_10,
    border: BLUE_20,
    icon: "◉",
    desc: "Hold business-to-business zip code routes. Connect registered businesses to the network. Revenue share on every route dispatched. First 100 = Founders.",
    who: "Business connectors. Route holders. Deal flow operators.",
    cost: "$997/yr · 1,000 seats worldwide",
  },
  {
    tier: "ALIʻI",
    route: "N2N · LAND · SEA · AIR",
    color: GOLD,
    bg: GOLD_10,
    border: GOLD_20,
    icon: "✦",
    desc: "Network-to-network routes. Land routes (island to island). Sea routes (Pacific). Air routes (mainland + international). The trade route at scale.",
    who: "Co-founders. Chiefs. Island cluster commanders.",
    cost: "$4,997 · Co-Founder · Founding seat",
  },
];

type Business = {
  id: string;
  name: string;
  category: string;
  zip_code: string;
  area: string;
  claimed: boolean;
  ambassador?: string;
};

// Mock data for unclaimed businesses — will be populated by scraper
const MOCK_BUSINESSES: Business[] = [
  { id: "1", name: "Waianae Hardware", category: "Hardware & Supply", zip_code: "96792", area: "Waianae", claimed: false },
  { id: "2", name: "Kapolei Farmers Market", category: "Food & Market", zip_code: "96707", area: "Kapolei", claimed: false },
  { id: "3", name: "Ewa Beach Landscaping", category: "Yard & Landscaping", zip_code: "96706", area: "Ewa Beach", claimed: false },
  { id: "4", name: "West Oahu Auto", category: "Automotive", zip_code: "96792", area: "Waianae", claimed: false },
  { id: "5", name: "Mākaha Surf Shop", category: "Retail", zip_code: "96792", area: "Mākaha", claimed: false },
  { id: "6", name: "Kapolei Business Center", category: "Professional Services", zip_code: "96707", area: "Kapolei", claimed: true, ambassador: "Ambassador 001" },
];

export default function Page808() {
  const [search, setSearch] = useState("");
  const [zipFilter, setZipFilter] = useState("all");
  const [revealed, setRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState<"directory" | "routes" | "network">("directory");

  useEffect(() => {
    setTimeout(() => setRevealed(true), 200);
  }, []);

  const filtered = MOCK_BUSINESSES.filter(b => {
    if (zipFilter !== "all" && b.zip_code !== zipFilter) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(176,142,80,0.4); } 50% { box-shadow: 0 0 0 8px rgba(176,142,80,0); } }
        input { background: rgba(0,0,0,0.4); border: 1px solid rgba(176,142,80,0.2); color: #e8e0d0; padding: 10px 14px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.5rem; outline: none; width: 100%; box-sizing: border-box; }
        input::placeholder { color: rgba(232,224,208,0.2); }
        input:focus { border-color: rgba(176,142,80,0.4); }
      `}</style>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "56px 24px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_40}, transparent)`, marginBottom: 40 }} />

        <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.35em", marginBottom: 12, animation: "fadeUp 0.7s ease 0.1s both" }}>
          MĀKOA ORDER · MALU TRUST · MĀKOA TRADE CO.
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          color: GOLD, fontSize: "clamp(2.2rem, 8vw, 3.8rem)", lineHeight: 1.1,
          margin: "0 0 10px", animation: "fadeUp 0.8s ease 0.2s both",
        }}>
          808 · 7G Net
        </h1>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          color: "rgba(232,224,208,0.5)", fontSize: "1.1rem", marginBottom: 16,
          animation: "fadeUp 0.8s ease 0.3s both",
        }}>
          The brotherhood business network of Hawaii — and the world.
        </p>
        <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem", lineHeight: 1.8, maxWidth: 420, margin: "0 auto 28px", animation: "fadeUp 0.8s ease 0.4s both" }}>
          Every registered business in the 808 linked to a zip code.<br />
          Every zip code held by a Mana Steward or Ambassador.<br />
          Every route — P2P, B2B, B2C — dispatched by the order.
        </p>

        {/* Live stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", animation: "fadeUp 0.8s ease 0.5s both" }}>
          {[
            { label: "ACTIVE NODES", value: "3", color: GOLD },
            { label: "OPEN ZIP CLUSTERS", value: "5", color: GREEN },
            { label: "BUSINESSES LISTED", value: `${MOCK_BUSINESSES.length}`, color: BLUE },
            { label: "CLAIMED", value: `${MOCK_BUSINESSES.filter(b => b.claimed).length}`, color: AMBER },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ color: s.color, fontSize: "1.6rem", fontWeight: 700, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</p>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.34rem", letterSpacing: "0.15em", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 20px" }}>

        {/* Tab nav */}
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${GOLD_20}`, margin: "28px 0 24px" }}>
          {(["directory", "routes", "network"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              flex: 1, background: "none", border: "none",
              borderBottom: `2px solid ${activeTab === t ? GOLD : "transparent"}`,
              color: activeTab === t ? GOLD : "rgba(232,224,208,0.3)",
              padding: "10px 4px", fontSize: "0.38rem", letterSpacing: "0.2em",
              cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
              transition: "color 0.2s",
            }}>
              {t === "directory" ? "DIRECTORY" : t === "routes" ? "ROUTES" : "NETWORK"}
            </button>
          ))}
        </div>

        {/* DIRECTORY TAB */}
        {activeTab === "directory" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.2em", marginBottom: 12 }}>
              HAWAII REGISTERED BUSINESSES · 808 NETWORK
            </p>

            {/* Search + filter */}
            <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
              <input
                placeholder="Search business name or category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[{ v: "all", l: "ALL ZIPS" }, ...ZIP_CLUSTERS.slice(0, 4).map(z => ({ v: z.zip, l: z.zip }))].map(f => (
                  <button key={f.v} onClick={() => setZipFilter(f.v)} style={{
                    background: zipFilter === f.v ? GOLD : "rgba(0,0,0,0.4)",
                    border: `1px solid ${zipFilter === f.v ? GOLD : "rgba(176,142,80,0.15)"}`,
                    color: zipFilter === f.v ? "#000" : "rgba(232,224,208,0.4)",
                    borderRadius: 4, padding: "4px 10px", fontSize: "0.36rem",
                    cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.1em",
                  }}>{f.l}</button>
                ))}
              </div>
            </div>

            {/* Business listings */}
            <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
              {filtered.map(b => (
                <div key={b.id} style={{
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${b.claimed ? GREEN_20 : "rgba(176,142,80,0.1)"}`,
                  borderRadius: 8, padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <p style={{ color: "#e8e0d0", fontSize: "0.5rem" }}>{b.name}</p>
                      {b.claimed && (
                        <span style={{ background: GREEN_10, border: `1px solid ${GREEN_20}`, color: GREEN, fontSize: "0.3rem", padding: "1px 6px", borderRadius: 3, letterSpacing: "0.1em" }}>CLAIMED</span>
                      )}
                    </div>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>{b.category} · {b.area} · {b.zip_code}</p>
                    {b.ambassador && <p style={{ color: BLUE, fontSize: "0.36rem", marginTop: 2 }}>Ambassador: {b.ambassador}</p>}
                  </div>
                  {!b.claimed ? (
                    <a href={`/claim?business=${encodeURIComponent(b.name)}&zip=${b.zip_code}`} style={{
                      background: GOLD, color: "#000", borderRadius: 4,
                      padding: "6px 12px", fontSize: "0.36rem", letterSpacing: "0.12em",
                      textDecoration: "none", fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0,
                    }}>CLAIM FREE →</a>
                  ) : (
                    <div style={{ color: GREEN, fontSize: "0.38rem", flexShrink: 0 }}>✓</div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA to add / scrape */}
            <div style={{ background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 10, padding: "20px", marginBottom: 28, textAlign: "center" }}>
              <p style={{ color: GOLD, fontSize: "0.44rem", marginBottom: 6 }}>Don't see your business?</p>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem", lineHeight: 1.7, marginBottom: 16 }}>
                We're building the full Hawaii business registry.<br />
                Claim yours now — it's free.
              </p>
              <a href="/claim" style={{
                display: "inline-block", background: GOLD, color: "#000", borderRadius: 6,
                padding: "10px 24px", fontSize: "0.44rem", letterSpacing: "0.2em",
                textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              }}>+ ADD YOUR BUSINESS — FREE</a>
            </div>
          </div>
        )}

        {/* ROUTES TAB */}
        {activeTab === "routes" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.2em", marginBottom: 20 }}>
              ROUTE TIERS · STEWARDS · AMBASSADORS · ALIʻI
            </p>

            <div style={{ display: "grid", gap: 14, marginBottom: 28 }}>
              {ROUTE_TYPES.map(r => (
                <div key={r.tier} style={{ background: r.bg, border: `1px solid ${r.border}`, borderRadius: 10, padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <p style={{ color: r.color, fontSize: "0.36rem", letterSpacing: "0.2em", marginBottom: 4 }}>{r.tier}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: r.color, fontSize: "1.2rem" }}>{r.icon}</span>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#e8e0d0", fontSize: "1.1rem" }}>{r.route}</p>
                      </div>
                    </div>
                    <div style={{ background: `${r.color}18`, border: `1px solid ${r.border}`, borderRadius: 4, padding: "4px 10px", textAlign: "right", flexShrink: 0 }}>
                      <p style={{ color: r.color, fontSize: "0.44rem", fontWeight: 700 }}>{r.cost}</p>
                    </div>
                  </div>
                  <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.44rem", lineHeight: 1.7, marginBottom: 8 }}>{r.desc}</p>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", fontStyle: "italic" }}>{r.who}</p>
                </div>
              ))}
            </div>

            {/* Founder seat capacity */}
            <div style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${GOLD_40}`, borderRadius: 10, padding: "20px", marginBottom: 24 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.2em", marginBottom: 14 }}>GLOBAL CAPACITY LIMITS</p>
              {[
                { role: "Mana Stewards (B2C)", founder: "1–100", max: "1,000", filled: 1, color: AMBER },
                { role: "Mana Ambassadors (B2B)", founder: "1–100", max: "1,000", filled: 0, color: BLUE },
                { role: "Aliʻi Co-Founders", founder: "1–20", max: "20 per founding", filled: 0, color: GOLD },
              ].map(c => (
                <div key={c.role} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: c.color, fontSize: "0.4rem" }}>{c.role}</span>
                    <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.38rem" }}>{c.filled} / {c.max} worldwide · First {c.founder} = Founders</span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                    <div style={{ width: `${(c.filled / 1000) * 100 + 0.5}%`, height: "100%", background: c.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
              <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem", marginTop: 12, fontStyle: "italic" }}>
                Kris W. — Mana Mākoa Steward 0001 · Island Cluster · Westside Zip Code Cluster
              </p>
            </div>

            <a href="/gate" style={{
              display: "block", background: GOLD, color: "#000", borderRadius: 8,
              padding: "16px", fontSize: "0.5rem", letterSpacing: "0.2em",
              textDecoration: "none", fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700, textAlign: "center",
            }}>CLAIM YOUR ROUTE — ENTER THE GATE →</a>
          </div>
        )}

        {/* NETWORK TAB */}
        {activeTab === "network" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.2em", marginBottom: 20 }}>
              WEST OAHU · ACTIVE ZIP CLUSTERS
            </p>

            <div style={{ display: "grid", gap: 8, marginBottom: 28 }}>
              {ZIP_CLUSTERS.map(z => (
                <div key={z.zip} style={{
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${z.color}25`,
                  borderLeft: `3px solid ${z.color}`,
                  borderRadius: "0 8px 8px 0",
                  padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#e8e0d0", fontSize: "0.48rem" }}>{z.area}</p>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>ZIP {z.zip} · {z.steward}</p>
                  </div>
                  <div style={{
                    background: `${z.color}15`,
                    border: `1px solid ${z.color}30`,
                    borderRadius: 4, padding: "3px 8px",
                  }}>
                    <p style={{ color: z.color, fontSize: "0.34rem", letterSpacing: "0.12em" }}>{z.status}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Wednesday 4AM call */}
            <div style={{
              background: "rgba(88,166,255,0.05)",
              border: `1px solid ${BLUE_20}`,
              borderRadius: 10, padding: "20px", marginBottom: 24,
            }}>
              <p style={{ color: BLUE, fontSize: "0.36rem", letterSpacing: "0.2em", marginBottom: 8 }}>⚡ WEDNESDAY 4AM GLOBAL CALL</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                color: "#e8e0d0", fontSize: "1.1rem", marginBottom: 10, lineHeight: 1.5,
              }}>
                Free to any Nā Koa, anywhere in the world.
              </p>
              <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.42rem", lineHeight: 1.8, marginBottom: 16 }}>
                Every Wednesday in May · 4:00 AM HST · Global brotherhood call.<br />
                Requires: 1 Mana Steward or Ambassador active in your zip cluster.<br />
                No Mana in your zip? Start one. It's free to claim a node.
              </p>
              <div style={{ display: "grid", gap: 6 }}>
                {[
                  { time: "May 7 · 4AM HST", note: "Call #1 — MAYDAY Opening debrief" },
                  { time: "May 14 · 4AM HST", note: "Call #2 — Route assignment" },
                  { time: "May 21 · 4AM HST", note: "Call #3 — Network2Network" },
                  { time: "May 28 · 4AM HST", note: "Call #4 — Pre-Founding strategy" },
                ].map(c => (
                  <div key={c.time} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ color: BLUE, fontSize: "0.38rem", minWidth: 130 }}>{c.time}</span>
                    <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.38rem" }}>{c.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7G Net explanation */}
            <div style={{ background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 10, padding: "20px", marginBottom: 24 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.2em", marginBottom: 12 }}>WHAT IS THE 7G NET</p>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { g: "1G", desc: "Nā Koa node activates in a zip code — P2P network goes live" },
                  { g: "2G", desc: "Mana Steward holds the cluster — B2C services route dispatched" },
                  { g: "3G", desc: "Mana Ambassador holds the route — B2B connections active" },
                  { g: "4G", desc: "Two clusters connect — inter-zip trade route established" },
                  { g: "5G", desc: "Island cluster formed — Aliʻi holds the island network" },
                  { g: "6G", desc: "Multi-island Aliʻi network — Land · Sea · Air routes live" },
                  { g: "7G", desc: "Global N2N — The full 808 worldwide brotherhood trade network" },
                ].map(r => (
                  <div key={r.g} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ color: GOLD, fontSize: "0.44rem", fontWeight: 700, minWidth: 28 }}>{r.g}</span>
                    <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.42rem", lineHeight: 1.6 }}>{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <a href="/claim" style={{
                display: "block", background: GOLD, color: "#000", borderRadius: 8,
                padding: "14px", fontSize: "0.48rem", letterSpacing: "0.2em",
                textDecoration: "none", fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700, textAlign: "center",
              }}>CLAIM YOUR ZIP CLUSTER →</a>
              <a href="/gate" style={{
                display: "block", background: "transparent", color: GOLD_DIM,
                border: `1px solid ${GOLD_20}`, borderRadius: 8, padding: "12px",
                fontSize: "0.44rem", letterSpacing: "0.15em",
                textDecoration: "none", fontFamily: "'JetBrains Mono', monospace",
                textAlign: "center",
              }}>ENTER THE GATE — JOIN THE ORDER</a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
