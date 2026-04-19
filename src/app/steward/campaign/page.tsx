"use client";
import { useState, useEffect } from "react";

const BG = "#04060a";
const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const RED = "#f85149";
const RED_20 = "rgba(248,81,73,0.2)";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";
const BLUE = "#58a6ff";
const BLUE_20 = "rgba(88,166,255,0.2)";
const PURPLE = "#7c6fd0";
const PURPLE_20 = "rgba(124,111,208,0.2)";

type Tab = "overview" | "targets" | "ai-detect" | "posts";

// DM Target groups — Makoa MAYDAY May campaign
const DM_TARGETS = [
  {
    group: "Pacific Islander Trades Operators",
    platform: "Instagram",
    why: "Direct overlap. They're doing the work. They don't have the network.",
    signals: ["landscaping", "construction", "cleaning", "hvac", "hauling", "samoan", "tongan", "hawaiian"],
    approach: "Brother-to-brother. Lead with the route. Don't pitch membership.",
    ai_risk: "low",
    hit_window: "Tue–Thu, 6–9am HST",
    example_accounts: ["local trades IG pages", "solo landscaper operators", "cleaning co owners in Oahu/LA"],
    size: "500–2,000 followers",
  },
  {
    group: "Men's Brotherhood / Fraternity Adjacent",
    platform: "Instagram + Facebook",
    why: "Already bought into brotherhood model. Looking for something with economic teeth.",
    signals: ["brotherhood", "mens group", "accountability", "hustle", "grind", "blue collar proud"],
    approach: "What we built is different. We don't just meet — we route money to each other.",
    ai_risk: "medium",
    hit_window: "Mon + Wed evenings",
    example_accounts: ["mens accountability groups", "non-MLM hustle pages", "former college fraternity alums in trades"],
    size: "1,000–10,000 followers",
  },
  {
    group: "Hawaii Diaspora Community Pages",
    platform: "Facebook Groups + Instagram",
    why: "Homesick, connected, looking to level up. MAYDAY = a reason to come back or plug in remotely.",
    signals: ["hawaii family", "808 pride", "aloha spirit", "west oahu raised", "oahu diaspora", "hi-5"],
    approach: "We're building the network our parents should have had. You don't have to move back to be in.",
    ai_risk: "low",
    hit_window: "Fri–Sun, 7pm HST",
    example_accounts: ["Hawaii diaspora FB groups (CA/WA/TX/NV)", "alumni groups", "808 community pages"],
    size: "500–5,000 followers",
  },
  {
    group: "West Oahu & Waianae Community Leaders",
    platform: "Facebook + Direct",
    why: "Ground zero. These are the connectors. One yes from a community anchor = 20 brothers.",
    signals: ["community leader", "waianae", "nanakuli", "kapolei", "ewa", "coach", "youth pastor", "uncle"],
    approach: "We're sealing a house here. We're looking for 10 men who will hold the line.",
    ai_risk: "very low",
    hit_window: "Any time. Personal outreach.",
    example_accounts: ["coaches at Waianae HS", "youth program leads", "local church pastors", "HOA chairs"],
    size: "under 500 — quality > quantity",
  },
  {
    group: "Real Estate Investors & Property Managers",
    platform: "LinkedIn + Instagram",
    why: "They NEED the labor route. We give them vetted, insured, brotherhood-backed operators.",
    signals: ["property management", "rental portfolio", "oahu investor", "short-term rental", "airbnb owner", "landlord"],
    approach: "We're not selling them a service. We're offering preferred access to the Mākoa Trade Co route.",
    ai_risk: "high",
    hit_window: "Tue–Thu, 8–11am HST",
    example_accounts: ["Oahu property management pages", "STR investors on IG", "real estate coaches in HI"],
    size: "1,000–20,000 followers",
  },
  {
    group: "Polynesian Faith Community Leaders",
    platform: "Facebook + Instagram",
    why: "Deep trust networks. A pastor's endorsement = the whole congregation considers it.",
    signals: ["samoan church", "tongan assembly", "polynesian fellowship", "pacific ministry", "laie community", "kahuku"],
    approach: "We honor the community structure. We're building economic infrastructure for the same families.",
    ai_risk: "very low",
    hit_window: "Wed evening + Sat morning",
    example_accounts: ["Polynesian churches on Oahu + mainland", "Pacific Islander ministry pages"],
    size: "200–2,000 followers",
  },
];

const AI_SIGNALS = [
  { signal: "Posts at exact intervals", detail: "Every 4h or 6h, no variation. Human operators drift. Bots don't.", risk: "Automation confirmed — no human watching DMs", color: RED },
  { signal: "Zero first-person language", detail: "Captions never say I, we, my, us. Always brand name + third-person. Written by a template.", risk: "Your DM hits a filter. No human reads it.", color: RED },
  { signal: "Engagement rate < 0.5% on 10k+ accounts", detail: "10k followers, under 50 likes per post. Either bought followers or a dead audience.", risk: "Even if they see your DM, no community behind them.", color: RED },
  { signal: "No genuine comment replies", detail: "Comments disabled or 'great post!' responses only. No real conversation thread.", risk: "Brand account, not a person. Move on.", color: "#f0883e" },
  { signal: "Hashtag clusters 20–30 per post", detail: "Maximum hashtag stuffing, same set every time. Scheduled via automation tools.", risk: "Reach play, not community play. DMs may be filtered.", color: "#f0883e" },
  { signal: "Bio contains 'DM for collab' + link in bio tool", detail: "Linktree + 'collab' in bio = they monetize audience. They'll pitch you back.", risk: "They want your attention, not your network.", color: "#f0883e" },
  { signal: "Posting at 3am local time consistently", detail: "Cron job. No human is up at 3am deciding to post.", risk: "Full automation. May still be a real person reviewing weekly.", color: GOLD },
  { signal: "Story engagement but no feed engagement", detail: "Stories get replies, posts get nothing. Real person + automated feed.", risk: "DM via story reply — higher chance of human read.", color: GREEN },
  { signal: "Captions longer than 2,000 chars with bullet points", detail: "AI-generated LinkedIn-style content. Real person using AI assistant to write.", risk: "Real operator, using tools. Good target — they understand efficiency.", color: GREEN },
];

type PostRow = { id: string; platform: string; text: string; status: string; created_at: string; created_by: string; scheduled_for: string | null };

export default function CampaignPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [expandTarget, setExpandTarget] = useState<number | null>(0);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(
          "https://flzivjhxtbolcfaniskv.supabase.co/rest/v1/social_posts?order=created_at.desc&limit=50&select=id,platform,text,status,created_at,created_by,scheduled_for",
          {
            headers: {
              apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps",
              Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps",
            },
          }
        );
        const data = await res.json();
        if (Array.isArray(data)) setPosts(data);
      } catch {}
      finally { setLoadingPosts(false); }
    }
    fetchPosts();
  }, []);

  const fired = posts.filter(p => p.status === "fired");
  const scheduled = posts.filter(p => p.status === "scheduled");
  const drafts = posts.filter(p => p.status === "draft");
  const echoPosts = posts.filter(p => p.created_by === "echo_agent");

  const TABS = [
    { key: "overview" as Tab, label: "OVERVIEW" },
    { key: "targets" as Tab, label: `DM TARGETS (${DM_TARGETS.length})` },
    { key: "ai-detect" as Tab, label: "AI DETECTOR" },
    { key: "posts" as Tab, label: `POST HISTORY (${posts.length})` },
  ];

  const STATUS_COLOR: Record<string, string> = { fired: GREEN, scheduled: GOLD, draft: BLUE, failed: RED, firing: PURPLE };
  const PLATFORM_COLOR: Record<string, string> = { instagram: "#e1306c", twitter: "#1da1f2", facebook: "#1877f2", tiktok: "#ff0050", youtube: "#ff0000", threads: "#aaa", bluesky: "#0085ff" };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e8dfc8", fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: rgba(176,142,80,0.2); }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${GOLD_20}`, padding: "20px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 9, color: GOLD_40, letterSpacing: "0.3em", marginBottom: 3 }}>
              MĀKOA ORDER · MAYDAY MAY 2026
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: GOLD }}>CAMPAIGN INTEL</div>
            <div style={{ fontSize: 11, color: GOLD_40, marginTop: 2 }}>
              Social traffic · DM target groups · AI automation detection
            </div>
          </div>
          <a href="/steward" style={{ fontSize: 10, color: GOLD_40, textDecoration: "none", border: `1px solid ${GOLD_20}`, padding: "5px 10px", borderRadius: 4 }}>
            ← COMMAND
          </a>
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: "none", border: "none",
              borderBottom: `2px solid ${tab === t.key ? GOLD : "transparent"}`,
              color: tab === t.key ? GOLD : GOLD_40,
              padding: "8px 16px", cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em",
              whiteSpace: "nowrap",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: 960, margin: "0 auto" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            {/* Campaign countdown */}
            <div style={{ background: GOLD_10, border: `1px solid ${GOLD_40}`, borderRadius: 8, padding: "20px 24px", marginBottom: 24, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: GOLD_40, letterSpacing: "0.3em", marginBottom: 8 }}>MAYDAY LEADERS SUMMIT</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: GOLD, fontFamily: "'Georgia', serif" }}>May 1–3, 2026 · Kapolei, Oʻahu</div>
              <div style={{ fontSize: 12, color: GOLD_40, marginTop: 6 }}>Campaign window: NOW through May 1. Every day is a drop.</div>
            </div>

            {/* Social metrics */}
            <div style={{ fontSize: 9, color: GOLD, letterSpacing: "0.25em", marginBottom: 12 }}>SOCIAL POST METRICS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
              {[
                { label: "TOTAL POSTS", value: posts.length, color: GOLD, bg: GOLD_10 },
                { label: "FIRED LIVE", value: fired.length, color: GREEN, bg: GREEN_20 },
                { label: "SCHEDULED", value: scheduled.length, color: GOLD, bg: GOLD_10 },
                { label: "DRAFTS", value: drafts.length, color: BLUE, bg: BLUE_20 },
                { label: "BY ECHO", value: echoPosts.length, color: PURPLE, bg: PURPLE_20 },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 8, padding: "14px 16px", border: `1px solid ${s.color}33` }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "'Georgia', serif" }}>{s.value}</div>
                  <div style={{ fontSize: 8, color: s.color, letterSpacing: "0.15em", marginTop: 4, opacity: 0.8 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Platform breakdown */}
            {posts.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 9, color: GOLD, letterSpacing: "0.25em", marginBottom: 12 }}>BY PLATFORM</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Object.entries(
                    posts.reduce((acc: Record<string, number>, p) => ({ ...acc, [p.platform]: (acc[p.platform] || 0) + 1 }), {})
                  ).sort((a, b) => b[1] - a[1]).map(([platform, count]) => (
                    <div key={platform} style={{
                      background: `${PLATFORM_COLOR[platform] || GOLD}22`,
                      border: `1px solid ${PLATFORM_COLOR[platform] || GOLD}44`,
                      color: PLATFORM_COLOR[platform] || GOLD,
                      fontSize: 11, padding: "6px 14px", borderRadius: 4, fontWeight: 700,
                    }}>
                      {platform.toUpperCase()} · {count}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Campaign focus */}
            <div style={{ background: "#080b10", border: `1px solid ${GOLD_20}`, borderRadius: 8, padding: "20px 24px" }}>
              <div style={{ fontSize: 10, color: GOLD, letterSpacing: "0.2em", marginBottom: 14 }}>MAY CAMPAIGN NORTH</div>
              {[
                { phase: "Week 1 (Apr 28–May 1)", focus: "MAYDAY is here. Brothers show up or miss the founding. Scarcity + urgency.", tone: "Final call energy" },
                { phase: "Week 2 (May 5–11)", focus: "What happened at MAYDAY. Stories. Stone placements. Brothers who showed up.", tone: "Social proof + FOMO" },
                { phase: "Week 3 (May 12–18)", focus: "The route is live. First jobs dispatched. First Warchest deposits.", tone: "Economic proof" },
                { phase: "Week 4 (May 19–31)", focus: "Steward applications open. New territories. Brotherhood growing.", tone: "Expansion arc" },
              ].map(p => (
                <div key={p.phase} style={{ borderLeft: `2px solid ${GOLD_40}`, paddingLeft: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: GOLD, fontWeight: 700 }}>{p.phase}</div>
                  <div style={{ fontSize: 12, color: "rgba(232,223,200,0.7)", marginTop: 4, lineHeight: 1.6 }}>{p.focus}</div>
                  <div style={{ fontSize: 10, color: GOLD_40, marginTop: 4, fontStyle: "italic" }}>Tone: {p.tone}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DM TARGETS ── */}
        {tab === "targets" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ fontSize: 11, color: GOLD_40, marginBottom: 20, lineHeight: 1.8 }}>
              Target groups ranked by conversion probability for MAYDAY outreach.<br />
              <span style={{ color: GREEN }}>Low AI risk</span> = human reading DMs. <span style={{ color: RED }}>High AI risk</span> = message hits a filter.
            </div>
            {DM_TARGETS.map((t, i) => {
              const isOpen = expandTarget === i;
              const aiColor = t.ai_risk === "very low" || t.ai_risk === "low" ? GREEN : t.ai_risk === "medium" ? GOLD : RED;
              return (
                <div key={i} style={{ background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 8, marginBottom: 10, overflow: "hidden" }}>
                  <div onClick={() => setExpandTarget(isOpen ? null : i)} style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ minWidth: 28, height: 28, borderRadius: "50%", background: GOLD_20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: GOLD, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#e8dfc8" }}>{t.group}</div>
                      <div style={{ fontSize: 10, color: GOLD_40, marginTop: 2 }}>{t.platform} · {t.size}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: aiColor, background: `${aiColor}22`, padding: "2px 8px", borderRadius: 3, letterSpacing: "0.1em" }}>
                        AI RISK: {t.ai_risk.toUpperCase()}
                      </span>
                      <span style={{ color: GOLD_40, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>
                  {isOpen && (
                    <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${GOLD_20}` }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
                        <div>
                          <div style={{ fontSize: 9, color: GOLD_40, letterSpacing: "0.2em", marginBottom: 6 }}>WHY THIS GROUP</div>
                          <div style={{ fontSize: 12, color: "rgba(232,223,200,0.7)", lineHeight: 1.7 }}>{t.why}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, color: GOLD_40, letterSpacing: "0.2em", marginBottom: 6 }}>APPROACH</div>
                          <div style={{ fontSize: 12, color: "rgba(232,223,200,0.7)", lineHeight: 1.7 }}>{t.approach}</div>
                        </div>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 9, color: GOLD_40, letterSpacing: "0.2em", marginBottom: 6 }}>SIGNAL KEYWORDS TO FIND THEM</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {t.signals.map(s => (
                            <span key={s} style={{ fontSize: 9, color: GOLD, background: GOLD_10, padding: "2px 8px", borderRadius: 3 }}>{s}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
                        <div>
                          <div style={{ fontSize: 9, color: GOLD_40, letterSpacing: "0.2em", marginBottom: 4 }}>HIT WINDOW</div>
                          <div style={{ fontSize: 11, color: GOLD }}>{t.hit_window}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, color: GOLD_40, letterSpacing: "0.2em", marginBottom: 4 }}>EXAMPLE TARGETS</div>
                          <div style={{ fontSize: 11, color: "rgba(232,223,200,0.6)" }}>{t.example_accounts.join(", ")}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── AI DETECTOR ── */}
        {tab === "ai-detect" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ fontSize: 11, color: GOLD_40, marginBottom: 20, lineHeight: 1.8 }}>
              Before you DM, run the target through these 9 signals. 3+ red flags = automated account, skip or use story reply instead of DM.
            </div>
            {AI_SIGNALS.map((s, i) => (
              <div key={i} style={{ background: "#080b10", border: `1px solid ${s.color}33`, borderLeft: `3px solid ${s.color}`, borderRadius: 8, padding: "14px 18px", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: s.color, minWidth: 28, flexShrink: 0, fontFamily: "'Georgia', serif" }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#e8dfc8", marginBottom: 4 }}>{s.signal}</div>
                    <div style={{ fontSize: 11, color: "rgba(232,223,200,0.6)", lineHeight: 1.7, marginBottom: 6 }}>{s.detail}</div>
                    <div style={{ fontSize: 10, color: s.color, background: `${s.color}11`, padding: "4px 10px", borderRadius: 3, display: "inline-block" }}>
                      → {s.risk}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 24, background: GOLD_10, border: `1px solid ${GOLD_40}`, borderRadius: 8, padding: "20px 24px" }}>
              <div style={{ fontSize: 10, color: GOLD, letterSpacing: "0.2em", marginBottom: 12 }}>THE BEST TARGETS</div>
              <div style={{ fontSize: 12, color: "rgba(232,223,200,0.7)", lineHeight: 2 }}>
                ✓ 200–2,000 followers with 4–10% engagement<br />
                ✓ Replies to comments in first-person with typos<br />
                ✓ Posts at irregular times (real life schedule)<br />
                ✓ Stories with behind-the-scenes content<br />
                ✓ Captions that start with "So today..." or "Real talk..."<br />
                ✓ Bio with phone number or "text me"<br />
                <br />
                <span style={{ color: GOLD, fontWeight: 700 }}>These are real operators. Your DM hits a real person. Lead with respect, not a pitch.</span>
              </div>
            </div>
          </div>
        )}

        {/* ── POST HISTORY ── */}
        {tab === "posts" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            {loadingPosts ? (
              <div style={{ textAlign: "center", padding: 60, color: GOLD_40, fontSize: 12 }}>Loading post history...</div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: GOLD_40 }}>No posts found. Fire your first post from the Social tab in Command Center.</div>
            ) : (
              posts.map(p => (
                <div key={p.id} style={{ background: "#080b10", border: `1px solid ${GOLD_20}`, borderRadius: 8, padding: "12px 16px", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: PLATFORM_COLOR[p.platform] || GOLD, fontWeight: 700, letterSpacing: "0.1em" }}>{p.platform.toUpperCase()}</span>
                    <span style={{ fontSize: 9, color: STATUS_COLOR[p.status] || GOLD_40, background: `${STATUS_COLOR[p.status] || GOLD}22`, padding: "1px 6px", borderRadius: 2 }}>
                      {p.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 9, color: GOLD_40, marginLeft: "auto" }}>
                      {p.created_by === "echo_agent" ? "ECHO · " : ""}{new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(232,223,200,0.7)", lineHeight: 1.6 }}>
                    {p.text.slice(0, 200)}{p.text.length > 200 ? "..." : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
