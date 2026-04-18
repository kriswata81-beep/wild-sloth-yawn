"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";
const GREEN_10 = "rgba(63,185,80,0.1)";
const BLUE = "#58a6ff";
const BLUE_20 = "rgba(88,166,255,0.2)";
const BLUE_10 = "rgba(88,166,255,0.1)";
const AMBER = "#f0883e";
const AMBER_20 = "rgba(240,136,62,0.2)";
const RED = "#e05c5c";
const RED_20 = "rgba(224,92,92,0.2)";

const WEST_OAHU_ZIPS = [
  "96792", "96707", "96706", "96791", "96701",
  "96782", "96789", "96797", "96762", "96731", "96744", "96734",
];

interface BusinessRow {
  id: string;
  name: string;
  category: string;
  zip: string;
  city: string;
  status: string;
  source: string;
  owner_name?: string;
  email?: string;
  phone?: string;
  route_interest?: string;
  created_at: string;
}

interface ScrapeResult {
  ok: boolean;
  zips_processed: number;
  total_inserted: number;
  total_updated: number;
  total_skipped: number;
  errors?: string[];
  timestamp: string;
}

interface QuoteRow {
  id: string;
  name: string;
  phone: string;
  address: string;
  zip: string;
  service: string;
  notes: string;
  status: string;
  created_at: string;
}

export default function Net808Tab() {
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<ScrapeResult | null>(null);
  const [scrapeZip, setScrapeZip] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterZip, setFilterZip] = useState("all");
  const [view, setView] = useState<"businesses" | "quotes" | "overview">("overview");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [bizRes, quotesRes] = await Promise.all([
      supabase
        .from("makoa_businesses")
        .select("id,name,category,zip,city,status,source,owner_name,email,phone,route_interest,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("yard_quotes")
        .select("id,name,phone,address,zip,service,notes,status,created_at")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    setBusinesses((bizRes.data as BusinessRow[]) || []);
    setQuotes((quotesRes.data as QuoteRow[]) || []);
    setLoading(false);
  }

  async function runScraper() {
    setScraping(true);
    setScrapeResult(null);
    try {
      const body = scrapeZip === "all"
        ? { zips: WEST_OAHU_ZIPS, limit: 100 }
        : { zip: scrapeZip, limit: 200 };
      const res = await fetch("/api/808-scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setScrapeResult(data);
      if (data.ok) await loadData();
    } catch (err) {
      setScrapeResult({ ok: false, zips_processed: 0, total_inserted: 0, total_updated: 0, total_skipped: 0, errors: [String(err)], timestamp: new Date().toISOString() });
    }
    setScraping(false);
  }

  async function updateQuoteStatus(id: string, status: string) {
    await supabase.from("yard_quotes").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, status } : q));
  }

  const filteredBiz = businesses.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (filterZip !== "all" && b.zip !== filterZip) return false;
    return true;
  });

  const statusCounts = businesses.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  const zipCounts = businesses.reduce<Record<string, number>>((acc, b) => {
    acc[b.zip] = (acc[b.zip] || 0) + 1;
    return acc;
  }, {});

  const claimedCount = businesses.filter((b) => ["claimed", "pending_verification"].includes(b.status)).length;
  const newQuotes = quotes.filter((q) => q.status === "new").length;

  const statusColor = (s: string) => {
    if (s === "verified" || s === "claimed") return GREEN;
    if (s === "pending_verification") return AMBER;
    if (s === "discovered") return BLUE;
    if (s === "inactive") return RED;
    return GOLD;
  };

  const quoteStatusColor = (s: string) => {
    if (s === "completed") return GREEN;
    if (s === "scheduled") return BLUE;
    if (s === "contacted") return AMBER;
    if (s === "cancelled") return RED;
    return GOLD;
  };

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: GOLD, fontSize: "0.55rem", letterSpacing: "0.2em", marginBottom: "4px" }}>
          808 7G NET — CONTROL PANEL
        </p>
        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.44rem" }}>
          Business directory · Yard quotes · Scraper · Zip clusters
        </p>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
        {[
          { label: "TOTAL LISTED", value: businesses.length, color: BLUE },
          { label: "CLAIMED", value: claimedCount, color: GREEN },
          { label: "YARD QUOTES", value: quotes.length, color: GOLD },
          { label: "NEW QUOTES", value: newQuotes, color: newQuotes > 0 ? AMBER : "rgba(232,224,208,0.3)" },
        ].map((k, i) => (
          <div key={i} style={{
            background: "rgba(176,142,80,0.03)",
            border: "1px solid rgba(176,142,80,0.1)",
            borderRadius: "6px",
            padding: "12px",
            textAlign: "center",
          }}>
            <p style={{ color: k.color, fontSize: "1.2rem", fontFamily: "'Cormorant Garamond', serif", marginBottom: "3px" }}>
              {loading ? "—" : k.value}
            </p>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.36rem", letterSpacing: "0.12em" }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* View tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {(["overview", "businesses", "quotes"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              background: view === v ? GOLD_10 : "transparent",
              border: `1px solid ${view === v ? GOLD_40 : "rgba(176,142,80,0.12)"}`,
              color: view === v ? GOLD : "rgba(176,142,80,0.4)",
              fontSize: "0.42rem",
              letterSpacing: "0.15em",
              padding: "7px 14px",
              cursor: "pointer",
              borderRadius: "4px",
              textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* OVERVIEW — scraper + zip stats */}
      {view === "overview" && (
        <div style={{ display: "grid", gap: "14px" }}>
          {/* Scraper control */}
          <div style={{
            background: "rgba(88,166,255,0.04)",
            border: "1px solid rgba(88,166,255,0.15)",
            borderRadius: "7px",
            padding: "18px",
          }}>
            <p style={{ color: BLUE, fontSize: "0.48rem", letterSpacing: "0.15em", marginBottom: "12px" }}>
              DCCA SCRAPER — Hawaii Business Registry
            </p>
            <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem", marginBottom: "14px", lineHeight: 1.6 }}>
              Pulls active registered businesses from data.hawaii.gov (public DCCA API)
              and upserts into <code style={{ color: BLUE }}>makoa_businesses</code> with status=discovered.
            </p>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
              <select
                value={scrapeZip}
                onChange={(e) => setScrapeZip(e.target.value)}
                style={{
                  background: "#04060a",
                  border: "1px solid rgba(88,166,255,0.2)",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  color: "#e8e0d0",
                  fontSize: "0.44rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  appearance: "none",
                }}
              >
                <option value="all">All West Oahu Zips</option>
                {WEST_OAHU_ZIPS.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
              <button
                onClick={runScraper}
                disabled={scraping}
                style={{
                  background: scraping ? "transparent" : BLUE_10,
                  border: `1px solid ${BLUE_20}`,
                  color: BLUE,
                  fontSize: "0.44rem",
                  letterSpacing: "0.15em",
                  padding: "8px 16px",
                  cursor: scraping ? "wait" : "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  borderRadius: "4px",
                  opacity: scraping ? 0.6 : 1,
                }}
              >
                {scraping ? "SCRAPING..." : "▶ RUN SCRAPER"}
              </button>
            </div>
            {scrapeResult && (
              <div style={{
                background: scrapeResult.ok ? GREEN_10 : "rgba(224,92,92,0.08)",
                border: `1px solid ${scrapeResult.ok ? GREEN_20 : RED_20}`,
                borderRadius: "5px",
                padding: "12px",
                fontSize: "0.42rem",
                lineHeight: 1.7,
              }}>
                <p style={{ color: scrapeResult.ok ? GREEN : RED, marginBottom: "6px" }}>
                  {scrapeResult.ok ? "◉ SCRAPE COMPLETE" : "✗ SCRAPE ERROR"}
                </p>
                <p style={{ color: "rgba(232,224,208,0.5)" }}>
                  Zips: {scrapeResult.zips_processed} · Inserted: {scrapeResult.total_inserted} · Skipped: {scrapeResult.total_skipped}
                </p>
                {scrapeResult.errors && scrapeResult.errors.length > 0 && (
                  <p style={{ color: RED, marginTop: "4px" }}>{scrapeResult.errors.join("; ")}</p>
                )}
                <p style={{ color: "rgba(232,224,208,0.25)", marginTop: "4px", fontSize: "0.38rem" }}>
                  {new Date(scrapeResult.timestamp).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Zip breakdown */}
          <div style={{
            background: GOLD_10,
            border: `1px solid ${GOLD_20}`,
            borderRadius: "7px",
            padding: "18px",
          }}>
            <p style={{ color: GOLD, fontSize: "0.48rem", letterSpacing: "0.15em", marginBottom: "12px" }}>
              ZIP CLUSTER BREAKDOWN
            </p>
            <div style={{ display: "grid", gap: "6px" }}>
              {WEST_OAHU_ZIPS.map((z) => {
                const count = zipCounts[z] || 0;
                const pct = businesses.length > 0 ? Math.round((count / businesses.length) * 100) : 0;
                return (
                  <div key={z} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: GOLD_40, fontSize: "0.4rem", minWidth: "44px" }}>{z}</span>
                    <div style={{ flex: 1, height: "4px", background: "rgba(176,142,80,0.08)", borderRadius: "2px" }}>
                      <div style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: count > 0 ? GOLD : "transparent",
                        borderRadius: "2px",
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    <span style={{ color: count > 0 ? GOLD : "rgba(176,142,80,0.2)", fontSize: "0.4rem", minWidth: "28px", textAlign: "right" }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status breakdown */}
          <div style={{
            background: "rgba(176,142,80,0.03)",
            border: "1px solid rgba(176,142,80,0.08)",
            borderRadius: "7px",
            padding: "18px",
          }}>
            <p style={{ color: GOLD, fontSize: "0.48rem", letterSpacing: "0.15em", marginBottom: "12px" }}>
              BUSINESS STATUS
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: statusColor(status), fontSize: "0.42rem" }}>{status}</span>
                  <span style={{ color: "#e8e0d0", fontSize: "0.48rem" }}>{count}</span>
                </div>
              ))}
              {Object.keys(statusCounts).length === 0 && (
                <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.42rem" }}>No data yet — run scraper</p>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              { label: "VIEW 808 PORTAL", href: "/808", color: GOLD },
              { label: "CLAIM PAGE", href: "/claim", color: GREEN },
              { label: "YARD SERVICE", href: "/services/yard", color: AMBER },
              { label: "TRADE CO", href: "/trade", color: BLUE },
            ].map((link, i) => (
              <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" style={{
                background: "rgba(176,142,80,0.04)",
                border: "1px solid rgba(176,142,80,0.1)",
                color: link.color,
                fontSize: "0.4rem",
                letterSpacing: "0.14em",
                padding: "8px 14px",
                textDecoration: "none",
                borderRadius: "4px",
              }}>{link.label} →</a>
            ))}
          </div>
        </div>
      )}

      {/* BUSINESSES */}
      {view === "businesses" && (
        <div>
          {/* Filters */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ background: "#04060a", border: "1px solid rgba(176,142,80,0.15)", borderRadius: "4px", padding: "6px 10px", color: "#e8e0d0", fontSize: "0.42rem", fontFamily: "'JetBrains Mono', monospace", appearance: "none" }}
            >
              <option value="all">All Status</option>
              <option value="discovered">Discovered</option>
              <option value="pending_verification">Pending</option>
              <option value="claimed">Claimed</option>
              <option value="verified">Verified</option>
            </select>
            <select
              value={filterZip}
              onChange={(e) => setFilterZip(e.target.value)}
              style={{ background: "#04060a", border: "1px solid rgba(176,142,80,0.15)", borderRadius: "4px", padding: "6px 10px", color: "#e8e0d0", fontSize: "0.42rem", fontFamily: "'JetBrains Mono', monospace", appearance: "none" }}
            >
              <option value="all">All Zips</option>
              {WEST_OAHU_ZIPS.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
            <span style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.42rem", alignSelf: "center" }}>
              {filteredBiz.length} businesses
            </span>
          </div>

          {loading ? (
            <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.44rem" }}>Loading directory...</p>
          ) : filteredBiz.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px", color: "rgba(176,142,80,0.25)", fontSize: "0.44rem" }}>
              <p>No businesses found.</p>
              <p style={{ marginTop: "8px", fontSize: "0.4rem" }}>Switch to Overview tab and run the scraper.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "8px" }}>
              {filteredBiz.map((b) => (
                <div key={b.id} style={{
                  background: "rgba(176,142,80,0.03)",
                  border: "1px solid rgba(176,142,80,0.08)",
                  borderRadius: "6px",
                  padding: "12px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#e8e0d0", fontSize: "0.48rem", marginBottom: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {b.name}
                    </p>
                    <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.38rem" }}>
                      {b.category} · {b.zip} · {b.city}
                    </p>
                    {b.owner_name && (
                      <p style={{ color: GOLD_40, fontSize: "0.38rem", marginTop: "2px" }}>
                        {b.owner_name}{b.phone ? ` · ${b.phone}` : ""}{b.route_interest ? ` · ${b.route_interest}` : ""}
                      </p>
                    )}
                  </div>
                  <span style={{
                    color: statusColor(b.status),
                    fontSize: "0.36rem",
                    letterSpacing: "0.1em",
                    background: `${statusColor(b.status)}15`,
                    padding: "2px 8px",
                    borderRadius: "2px",
                    flexShrink: 0,
                    marginLeft: "10px",
                  }}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* QUOTES — yard service dispatch */}
      {view === "quotes" && (
        <div>
          <p style={{ color: AMBER, fontSize: "0.44rem", letterSpacing: "0.15em", marginBottom: "14px" }}>
            YARD SERVICE QUOTES — {quotes.length} total · {newQuotes} new
          </p>
          {loading ? (
            <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.44rem" }}>Loading quotes...</p>
          ) : quotes.length === 0 ? (
            <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.44rem" }}>No yard quotes yet. Drive traffic to /services/yard.</p>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {quotes.map((q) => (
                <div key={q.id} style={{
                  background: q.status === "new" ? "rgba(240,136,62,0.05)" : "rgba(176,142,80,0.03)",
                  border: `1px solid ${q.status === "new" ? AMBER_20 : "rgba(176,142,80,0.08)"}`,
                  borderRadius: "7px",
                  padding: "14px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <p style={{ color: "#e8e0d0", fontSize: "0.5rem", marginBottom: "3px" }}>{q.name}</p>
                      <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem" }}>
                        {q.phone} · {q.address} ({q.zip})
                      </p>
                    </div>
                    <span style={{
                      color: quoteStatusColor(q.status),
                      fontSize: "0.36rem",
                      background: `${quoteStatusColor(q.status)}15`,
                      padding: "2px 8px",
                      borderRadius: "2px",
                    }}>{q.status.toUpperCase()}</span>
                  </div>
                  <p style={{ color: GOLD_40, fontSize: "0.4rem", marginBottom: "8px" }}>
                    Service: {q.service}{q.notes ? ` — ${q.notes}` : ""}
                  </p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {["new", "contacted", "scheduled", "completed", "cancelled"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateQuoteStatus(q.id, s)}
                        disabled={q.status === s}
                        style={{
                          background: q.status === s ? `${quoteStatusColor(s)}20` : "transparent",
                          border: `1px solid ${q.status === s ? quoteStatusColor(s) : "rgba(176,142,80,0.12)"}`,
                          color: q.status === s ? quoteStatusColor(s) : "rgba(176,142,80,0.3)",
                          fontSize: "0.36rem",
                          letterSpacing: "0.1em",
                          padding: "4px 10px",
                          cursor: q.status === s ? "default" : "pointer",
                          fontFamily: "'JetBrains Mono', monospace",
                          borderRadius: "3px",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.36rem", marginTop: "6px" }}>
                    {new Date(q.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
