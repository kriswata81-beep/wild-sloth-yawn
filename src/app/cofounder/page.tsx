"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_FAINT = "rgba(176,142,80,0.06)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const PURPLE = "#a78bfa";
const AMBER = "#f0883e";
const BG = "#04060a";

// ── Journey Map ──────────────────────────────────────────────────────────────
const JOURNEY = [
  {
    step: "01",
    label: "QR CODE / CREST",
    sublabel: "The First Signal",
    detail: "A brother sees the Mākoa crest — on a card, a shirt, a wall. He scans the QR. The gate opens.",
    color: GOLD_DIM,
    href: null,
  },
  {
    step: "02",
    label: "THE GATE",
    sublabel: "/gate — XI Reviews You",
    detail: "12 questions. XI reads every answer. No fluff. He gets a tier: Nā Koa, Mana, or Aliʻi. The order sees him before he sees the order.",
    color: GREEN,
    href: "/gate",
  },
  {
    step: "03",
    label: "ONBOARDING",
    sublabel: "/accepted — Tier Assigned",
    detail: "XI delivers his message. Tier confirmed. Dues committed. $497/yr founding rate. He's in the 808.",
    color: BLUE,
    href: "/accepted",
  },
  {
    step: "04",
    label: "THE ORDER",
    sublabel: "Portal + Brotherhood",
    detail: "Member portal. Route training. 4am circles. Wednesday training. The brotherhood is real — not digital.",
    color: PURPLE,
    href: "/portal/dashboard",
  },
  {
    step: "05",
    label: "MAYDAY SUMMIT",
    sublabel: "Founding 20 — May 2026",
    detail: "72 hours in Kapolei. Ice bath. War Room. Fire ceremony. The charter is signed. The order is legally founded.",
    color: AMBER,
    href: "/founding48",
  },
  {
    step: "06",
    label: "ALIʻI CO-FOUNDER",
    sublabel: "/cofounder — This Page",
    detail: "4 seats. Worldwide. 1% equity. Territory. Council. Legacy. The men who build the order from the inside.",
    color: GOLD,
    href: null,
  },
];

// ── Budget Projections ───────────────────────────────────────────────────────
const BUDGET_SCENARIOS = [
  {
    label: "YEAR 1 — FOUNDING",
    color: GREEN,
    revenue: [
      { item: "4 Co-Founder seats × $4,997", amount: 19988 },
      { item: "MAYDAY tickets (16 brothers)", amount: 5834 },
      { item: "Founding dues (20 brothers × $497)", amount: 9940 },
      { item: "Circle Partners (10 × $297-$997)", amount: 13770 },
      { item: "Gate entry pipeline (~80 × $9.99)", amount: 799 },
    ],
    expenses: [
      { item: "MAYDAY Summit operations", amount: 4480 },
      { item: "Mākoa House — West Oahu (6mo)", amount: 24000 },
      { item: "Van + equipment", amount: 8500 },
      { item: "Legal (LLC, filings, insurance)", amount: 6500 },
      { item: "XI platform + tech stack", amount: 3600 },
      { item: "Chapter expansion reserve (30%)", amount: 12000 },
    ],
  },
  {
    label: "YEAR 2 — EXPANSION",
    color: BLUE,
    revenue: [
      { item: "3 Mākoa Houses × $132K MRR", amount: 475200 },
      { item: "Route revenue — 10% Order cut", amount: 57600 },
      { item: "Circle Partners (ongoing)", amount: 143568 },
      { item: "B2C subscriptions (200 homes)", amount: 396000 },
      { item: "B2B contracts (hotels, property mgrs)", amount: 84000 },
    ],
    expenses: [
      { item: "3 House operations", amount: 144000 },
      { item: "Neighbor island expansion", amount: 48000 },
      { item: "West Coast chapter seed", amount: 32000 },
      { item: "Brother scholarships (15%)", amount: 53000 },
      { item: "Equipment + assets (20%)", amount: 71000 },
      { item: "Emergency fund (15%)", amount: 53000 },
    ],
  },
];

// ── Co-Founder Fund Allocation ───────────────────────────────────────────────
const FUND_USE = [
  {
    pct: 35,
    label: "Chapter Expansion",
    detail: "Seed funding for new Mākoa Houses — Maui, Big Island, West Coast, international. Each house needs $8–12K to open.",
    color: GREEN,
    icon: "🏠",
  },
  {
    pct: 20,
    label: "Operations Infrastructure",
    detail: "Vans, equipment, ice bath rigs, training gear. The physical tools that make the 4am possible anywhere on earth.",
    color: BLUE,
    icon: "⚙️",
  },
  {
    pct: 15,
    label: "Legal & Compliance",
    detail: "LLC filings, D&O insurance, membership agreements, NDA stack, event liability waivers. The order is built to last.",
    color: AMBER,
    icon: "📜",
  },
  {
    pct: 15,
    label: "Brother Scholarships",
    detail: "Brothers who can't afford dues get sponsored. The order doesn't turn away the right man for money.",
    color: PURPLE,
    icon: "🎓",
  },
  {
    pct: 10,
    label: "XI Platform & Tech",
    detail: "Supabase, Vercel, Stripe, Anthropic API. XI runs the order — this keeps XI running.",
    color: GOLD,
    icon: "🤖",
  },
  {
    pct: 5,
    label: "Emergency Reserve",
    detail: "Liquid reserve for unexpected costs — venue changes, equipment failure, brother emergencies.",
    color: GOLD_DIM,
    icon: "🛡",
  },
];

// ── MAYDAY War Room Investment Options ───────────────────────────────────────
const WAR_ROOM_INVESTMENTS = [
  {
    tier: "FOUNDING SEAT",
    amount: "$4,997",
    type: "One-time",
    color: GOLD,
    what: "Your co-founder seat. Already paid. This is your base.",
    why: "You're in. The charter is signed with your name on it.",
    where: "LLC filing, founding stone, council seat",
  },
  {
    tier: "CHAPTER SEED",
    amount: "$10,000",
    type: "Optional at MAYDAY",
    color: GREEN,
    what: "Seed a new Mākoa House in your territory.",
    why: "Your house. Your chapter. Your revenue stream. You become the anchor.",
    where: "House deposit, van, equipment, first 90 days of ops",
  },
  {
    tier: "EXPANSION PARTNER",
    amount: "$25,000",
    type: "Optional at MAYDAY",
    color: BLUE,
    what: "Fund 2–3 chapter openings across your region.",
    why: "More houses = more route revenue = bigger quarterly share for you.",
    where: "Multi-house seed, regional ops, brother recruitment",
  },
  {
    tier: "TRADE CO. INVESTOR",
    amount: "$50,000+",
    type: "Mākoa Trade Co. LLC",
    color: PURPLE,
    what: "Direct equity investment in Mākoa Trade Co. LLC.",
    why: "The trade company holds all B2B contracts, route agreements, and subscription revenue. This is the operating entity.",
    where: "See Trade Co. breakdown below",
  },
];

// ── Trade Co. Investment Case ────────────────────────────────────────────────
const TRADE_CO_USE = [
  {
    category: "Route Operator Expansion",
    pct: 40,
    detail: "Recruit, train, and equip 50+ new route operators across Hawaii and West Coast. Each operator generates $2,400–$4,800/mo in route revenue.",
    color: GREEN,
    icon: "🚛",
  },
  {
    category: "B2B Contract Acquisition",
    pct: 25,
    detail: "Sales team to land hotel contracts, property management agreements, and commercial cleaning deals. B2B contracts are 3–5× the margin of residential.",
    color: BLUE,
    icon: "🏨",
  },
  {
    category: "Trade Academy Build-Out",
    pct: 20,
    detail: "Formal training program for route operators — certifications, skills, safety. Graduates command higher rates and better contracts.",
    color: AMBER,
    icon: "🎓",
  },
  {
    category: "Technology & Dispatch",
    pct: 10,
    detail: "Route management software, scheduling, customer portal, XI integration. Scale without adding overhead.",
    color: PURPLE,
    icon: "📱",
  },
  {
    category: "Legal & IP Protection",
    pct: 5,
    detail: "Trademark the Mākoa brand. Protect the cooperative model. Ensure the 80/10/10 structure is legally bulletproof.",
    color: GOLD,
    icon: "⚖️",
  },
];

const TRADE_CO_PROJECTIONS = [
  { year: "2026", houses: 1, brothers: 20, mrr: "$132K", arr: "$1.58M", color: GREEN },
  { year: "2027", houses: 3, brothers: 150, mrr: "$475K", arr: "$5.7M", color: BLUE },
  { year: "2028", houses: 10, brothers: 400, mrr: "$1.4M", arr: "$16.8M", color: GOLD },
];

// ── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What does 1% equity actually mean in dollars?",
    a: "1% of Mākoa Trade Co. LLC. At Year 1 ARR of $1.58M, that's a $15,800 annual dividend potential at full distribution. At Year 3 ARR of $16.8M, that's $168,000/yr. Founding valuation is set by the council at MAYDAY — you're buying in at the floor before any external valuation.",
  },
  {
    q: "How does the 5% territory revenue share work?",
    a: "5% of net route revenue generated in your home territory, paid quarterly. If 10 brothers operate routes in your region at $3,200/mo average, that's $32K/mo gross → $1,600/mo → $19,200/yr to you. As your territory grows, so does your cut. No cap.",
  },
  {
    q: "At MAYDAY, if I want to invest more — what exactly happens?",
    a: "The War Room on Sunday morning is where co-founders can commit additional capital. Options range from $10K (Chapter Seed — fund your own house) to $50K+ (Trade Co. equity investment). All additional investments are documented in the co-founders charter and recorded in the LLC operating agreement.",
  },
  {
    q: "Why would I invest in Mākoa Trade Co. LLC specifically?",
    a: "The Trade Co. is the operating entity that holds all route contracts, B2B agreements, and subscription revenue. It's the engine. Your $4,997 co-founder seat gives you 1% equity. Additional investment increases your equity stake proportionally, subject to council vote and LLC amendment.",
  },
  {
    q: "Where exactly does the co-founder fund go?",
    a: "35% chapter expansion (new houses), 20% operations (vans, equipment), 15% legal & compliance, 15% brother scholarships, 10% XI platform, 5% emergency reserve. Every dollar is tracked in the Family Office treasury and reported to the Ali'i Council quarterly.",
  },
  {
    q: "Can I sell or transfer my seat or equity?",
    a: "Co-founder seats are not publicly tradeable. If you step down, your seat opens for council vote. Your equity stake in the LLC follows standard operating agreement terms — transfer requires council approval. Your designated heir inherits your seat and equity on death.",
  },
  {
    q: "What if I'm not in Hawaii?",
    a: "Co-founders are worldwide. Your territory is wherever you are. You anchor your region — open the first 4am, build the first circle, seed the first house. The order expands through you.",
  },
];

export default function CofounderPage() {
  const [ready, setReady] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeScenario, setActiveScenario] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", region: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  async function handleClaim() {
    if (!form.name || !form.email) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_1TKnnt836uPpUiqMrOthQ4oE",
          customerEmail: form.email,
          metadata: { circle_type: "cofounder", full_name: form.name, phone: form.phone, region: form.region },
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Connection error. Try again.");
    }
    setSubmitting(false);
  }

  const scenario = BUDGET_SCENARIOS[activeScenario];
  const totalRevenue = scenario.revenue.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = scenario.expenses.reduce((s, e) => s + e.amount, 0);

  const inputStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.5)",
    border: `1px solid ${GOLD_20}`,
    color: GOLD,
    fontSize: "0.6rem",
    fontFamily: "'JetBrains Mono', monospace",
    padding: "12px 14px",
    width: "100%",
    outline: "none",
    borderRadius: "6px",
    letterSpacing: "0.05em",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'JetBrains Mono', monospace", color: "#e8e0d0", overflowX: "hidden" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.4;} }
        input::placeholder { color: rgba(176,142,80,0.2); }
        .hover-gold:hover { border-color: rgba(176,142,80,0.3) !important; transform: translateY(-2px); }
        .faq-row { cursor:pointer; transition: background 0.2s; }
        .faq-row:hover { background: rgba(176,142,80,0.04) !important; }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div style={{
        padding: "80px 24px 60px", textAlign: "center",
        borderBottom: `1px solid ${GOLD_10}`,
        opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.9s ease, transform 0.9s ease",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(63,185,80,0.08)", border: "1px solid rgba(63,185,80,0.25)",
          borderRadius: "20px", padding: "6px 16px", marginBottom: "28px",
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: GREEN, animation: "pulse 2s infinite" }} />
          <span style={{ color: GREEN, fontSize: "0.42rem", letterSpacing: "0.2em" }}>4 SEATS · WORLDWIDE · ONE-TIME</span>
        </div>

        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.35em", marginBottom: "16px" }}>ALIʻI CO-FOUNDING PACK</p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          fontSize: "clamp(2.4rem, 8vw, 4rem)", color: GOLD,
          margin: "0 0 16px", fontWeight: 300, lineHeight: 1.1,
        }}>
          You're Not Joining.<br />You're Founding.
        </h1>

        <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.58rem", maxWidth: "480px", margin: "0 auto 32px", lineHeight: 1.9 }}>
          From the QR code to the founding fire to worldwide expansion —<br />
          here is exactly where your investment goes, what it builds,<br />
          and what it returns.
        </p>

        <div style={{ display: "inline-flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3.5rem", color: GOLD, fontWeight: 300, lineHeight: 1 }}>$4,997</span>
          <span style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.1em" }}>ONE-TIME · 1% EQUITY</span>
        </div>
        <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.42rem", marginBottom: "40px" }}>No monthly fees. No lock-in. Your seat is permanent.</p>

        <a href="#claim" style={{
          display: "inline-block", background: GOLD_10, border: `1px solid ${GOLD_20}`,
          color: GOLD, fontSize: "0.5rem", letterSpacing: "0.25em",
          padding: "14px 36px", borderRadius: "4px", textDecoration: "none",
        }}>CLAIM YOUR SEAT</a>
      </div>

      {/* ── JOURNEY MAP ───────────────────────────────────────────────────── */}
      <div style={{ padding: "60px 24px", maxWidth: "680px", margin: "0 auto" }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em", textAlign: "center", marginBottom: "8px" }}>THE MĀKOA JOURNEY</p>
        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.44rem", textAlign: "center", marginBottom: "40px", lineHeight: 1.7 }}>
          From the first QR scan to the founding council — every step a man takes before he reaches this page.
        </p>

        <div style={{ display: "grid", gap: "0" }}>
          {JOURNEY.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "20px", alignItems: "flex-start", paddingBottom: i < JOURNEY.length - 1 ? "28px" : 0, position: "relative" }}>
              {i < JOURNEY.length - 1 && (
                <div style={{ position: "absolute", left: "31px", top: "32px", width: "1px", height: "calc(100% - 8px)", background: `linear-gradient(to bottom, ${step.color}, transparent)`, opacity: 0.3 }} />
              )}
              <div style={{
                width: "62px", flexShrink: 0,
                background: i === JOURNEY.length - 1 ? GOLD_10 : "rgba(0,0,0,0.4)",
                border: `1px solid ${i === JOURNEY.length - 1 ? GOLD_20 : "rgba(176,142,80,0.08)"}`,
                borderRadius: "6px", padding: "8px 4px", textAlign: "center",
              }}>
                <p style={{ color: step.color, fontSize: "0.55rem", fontWeight: 700 }}>{step.step}</p>
              </div>
              <div style={{ paddingTop: "4px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                  <p style={{ color: step.color, fontSize: "0.48rem", letterSpacing: "0.15em" }}>{step.label}</p>
                  {step.href && (
                    <a href={step.href} style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.36rem", textDecoration: "none", letterSpacing: "0.1em" }}>
                      {step.sublabel} →
                    </a>
                  )}
                  {!step.href && <span style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.36rem", letterSpacing: "0.1em" }}>{step.sublabel}</span>}
                </div>
                <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.44rem", lineHeight: 1.7 }}>{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BUDGET PROJECTIONS ────────────────────────────────────────────── */}
      <div style={{ padding: "60px 24px", borderTop: `1px solid ${GOLD_10}`, background: "rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em", textAlign: "center", marginBottom: "8px" }}>MĀKOA TRADE CO. — BUDGET PROJECTIONS</p>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.44rem", textAlign: "center", marginBottom: "32px", lineHeight: 1.7 }}>
            Conservative numbers. Real model. The 80/10/10 cooperative structure.
          </p>

          {/* Scenario toggle */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", justifyContent: "center" }}>
            {BUDGET_SCENARIOS.map((s, i) => (
              <button key={i} onClick={() => setActiveScenario(i)} style={{
                background: activeScenario === i ? GOLD_10 : "transparent",
                border: `1px solid ${activeScenario === i ? GOLD_20 : "rgba(176,142,80,0.08)"}`,
                color: activeScenario === i ? GOLD : GOLD_DIM,
                fontSize: "0.4rem", letterSpacing: "0.15em", padding: "8px 16px",
                borderRadius: "4px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                transition: "all 0.2s",
              }}>{s.label}</button>
            ))}
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {/* Revenue */}
            <div style={{ background: GOLD_FAINT, border: `1px solid ${GOLD_10}`, borderRadius: "10px", padding: "20px" }}>
              <p style={{ color: GREEN, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "14px" }}>📈 REVENUE STREAMS</p>
              {scenario.revenue.map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < scenario.revenue.length - 1 ? `1px solid rgba(176,142,80,0.06)` : "none" }}>
                  <span style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.44rem" }}>{r.item}</span>
                  <span style={{ color: GREEN, fontSize: "0.48rem", fontWeight: 500 }}>${r.amount.toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${GOLD_20}` }}>
                <span style={{ color: GOLD, fontSize: "0.44rem", letterSpacing: "0.1em" }}>TOTAL REVENUE</span>
                <span style={{ color: GOLD, fontSize: "0.6rem", fontWeight: 700 }}>${totalRevenue.toLocaleString()}</span>
              </div>
            </div>

            {/* Expenses */}
            <div style={{ background: GOLD_FAINT, border: `1px solid ${GOLD_10}`, borderRadius: "10px", padding: "20px" }}>
              <p style={{ color: AMBER, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "14px" }}>📊 OPERATING EXPENSES</p>
              {scenario.expenses.map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < scenario.expenses.length - 1 ? `1px solid rgba(176,142,80,0.06)` : "none" }}>
                  <span style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.44rem" }}>{e.item}</span>
                  <span style={{ color: AMBER, fontSize: "0.48rem" }}>${e.amount.toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${GOLD_20}` }}>
                <span style={{ color: GOLD, fontSize: "0.44rem", letterSpacing: "0.1em" }}>NET POSITION</span>
                <span style={{ color: totalRevenue - totalExpenses > 0 ? GREEN : "#f85149", fontSize: "0.6rem", fontWeight: 700 }}>
                  ${(totalRevenue - totalExpenses).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Trade Co. Projections */}
            <div style={{ background: GOLD_FAINT, border: `1px solid ${GOLD_10}`, borderRadius: "10px", padding: "20px" }}>
              <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "14px" }}>🏢 MĀKOA TRADE CO. — 3-YEAR ARR</p>
              <div style={{ display: "grid", gap: "8px" }}>
                {TRADE_CO_PROJECTIONS.map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(0,0,0,0.3)", borderRadius: "6px", border: `1px solid ${p.color}20` }}>
                    <div>
                      <p style={{ color: p.color, fontSize: "0.42rem", letterSpacing: "0.1em", marginBottom: "2px" }}>{p.year}</p>
                      <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.4rem" }}>{p.houses} house{p.houses > 1 ? "s" : ""} · {p.brothers} brothers</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: p.color, fontSize: "0.55rem", fontWeight: 700 }}>{p.arr} ARR</p>
                      <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>{p.mrr}/mo</p>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.38rem", textAlign: "center", marginTop: "12px", fontStyle: "italic" }}>
                Your 1% equity at Year 3 ARR = $168,000/yr potential distribution
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CO-FOUNDER FUND ALLOCATION ────────────────────────────────────── */}
      <div style={{ padding: "60px 24px", borderTop: `1px solid ${GOLD_10}` }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em", textAlign: "center", marginBottom: "8px" }}>WHERE YOUR $4,997 GOES</p>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.44rem", textAlign: "center", marginBottom: "32px", lineHeight: 1.7 }}>
            4 co-founders × $4,997 = $19,988 founding pool.<br />Here is exactly how it's deployed for maximum impact.
          </p>

          {/* Allocation bar */}
          <div style={{ display: "flex", gap: "2px", height: "10px", borderRadius: "5px", overflow: "hidden", marginBottom: "24px" }}>
            {FUND_USE.map((f, i) => (
              <div key={i} style={{ width: `${f.pct}%`, background: f.color, transition: "width 0.3s" }} />
            ))}
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {FUND_USE.map((f, i) => (
              <div key={i} className="hover-gold" style={{
                background: GOLD_FAINT, border: `1px solid ${GOLD_10}`, borderRadius: "10px",
                padding: "18px 20px", display: "flex", gap: "16px", alignItems: "flex-start",
                transition: "border-color 0.3s, transform 0.3s",
              }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: `${f.color}15`, border: `1px solid ${f.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.1rem" }}>
                  {f.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <p style={{ color: f.color, fontSize: "0.48rem", letterSpacing: "0.1em" }}>{f.label}</p>
                    <span style={{ color: f.color, fontSize: "0.6rem", fontWeight: 700 }}>{f.pct}%</span>
                  </div>
                  <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.44rem", lineHeight: 1.7 }}>{f.detail}</p>
                  <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.4rem", marginTop: "4px" }}>
                    ≈ ${Math.round(59964 * f.pct / 100).toLocaleString()} from founding pool
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAYDAY WAR ROOM — ADDITIONAL INVESTMENT ───────────────────────── */}
      <div style={{ padding: "60px 24px", borderTop: `1px solid ${GOLD_10}`, background: "rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em", textAlign: "center", marginBottom: "8px" }}>MAYDAY WAR ROOM — ADDITIONAL INVESTMENT</p>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.44rem", textAlign: "center", marginBottom: "12px", lineHeight: 1.7 }}>
            Sunday morning. The charter is signed. The order is founded.
          </p>
          <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.48rem", textAlign: "center", marginBottom: "32px", lineHeight: 1.8, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>
            "If you want to go deeper — the War Room is where it happens.<br />
            No pressure. No pitch. Just options for the men who want to build more."
          </p>

          <div style={{ display: "grid", gap: "14px" }}>
            {WAR_ROOM_INVESTMENTS.map((inv, i) => (
              <div key={i} style={{
                background: GOLD_FAINT, border: `1px solid ${i === 0 ? GOLD_20 : GOLD_10}`,
                borderRadius: "10px", padding: "20px",
                borderLeft: `3px solid ${inv.color}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <p style={{ color: inv.color, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "4px" }}>{inv.tier}</p>
                    <p style={{ color: "#e8e0d0", fontSize: "0.7rem", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{inv.amount}</p>
                  </div>
                  <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", letterSpacing: "0.1em", background: "rgba(0,0,0,0.3)", padding: "4px 10px", borderRadius: "3px" }}>{inv.type}</span>
                </div>
                <div style={{ display: "grid", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <span style={{ color: inv.color, fontSize: "0.42rem", flexShrink: 0, opacity: 0.7 }}>WHAT</span>
                    <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.44rem", lineHeight: 1.6 }}>{inv.what}</p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <span style={{ color: inv.color, fontSize: "0.42rem", flexShrink: 0, opacity: 0.7 }}>WHY</span>
                    <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.44rem", lineHeight: 1.6 }}>{inv.why}</p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <span style={{ color: inv.color, fontSize: "0.42rem", flexShrink: 0, opacity: 0.7 }}>WHERE</span>
                    <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.44rem", lineHeight: 1.6 }}>{inv.where}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "24px", background: "rgba(0,0,0,0.3)", border: `1px solid ${GOLD_10}`, borderRadius: "8px", padding: "16px", textAlign: "center" }}>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.44rem", lineHeight: 1.8 }}>
              All War Room investments are documented in the co-founders charter.<br />
              Recorded in the LLC operating agreement. Reported quarterly to the Ali'i Council.<br />
              <span style={{ color: GOLD_DIM }}>No pressure. No pitch. The order doesn't need your money — it needs your commitment.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── MĀKOA TRADE CO. INVESTMENT CASE ──────────────────────────────── */}
      <div style={{ padding: "60px 24px", borderTop: `1px solid ${GOLD_10}` }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em", textAlign: "center", marginBottom: "8px" }}>MĀKOA TRADE CO. LLC — THE INVESTMENT CASE</p>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.44rem", textAlign: "center", marginBottom: "32px", lineHeight: 1.7 }}>
            Why invest in the Trade Co. specifically — and where every dollar goes.
          </p>

          {/* What is Trade Co */}
          <div style={{ background: GOLD_FAINT, border: `1px solid ${GOLD_20}`, borderRadius: "10px", padding: "24px", marginBottom: "20px" }}>
            <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "14px" }}>WHAT IS MĀKOA TRADE CO. LLC?</p>
            <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.48rem", lineHeight: 1.9, marginBottom: "16px" }}>
              Mākoa Trade Co. is the operating entity. It holds all route contracts, B2B agreements, subscription revenue, and trade academy operations. It's the engine that generates the 80/10/10 revenue split.
            </p>
            <div style={{ display: "grid", gap: "8px" }}>
              {[
                { label: "80%", desc: "Goes directly to the brother operating the route", color: GREEN },
                { label: "10%", desc: "Goes to the Mākoa House (operations, equipment, training)", color: BLUE },
                { label: "10%", desc: "Goes to the Order fund (expansion, scholarships, XI)", color: GOLD },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "8px 12px", background: "rgba(0,0,0,0.3)", borderRadius: "6px" }}>
                  <span style={{ color: row.color, fontSize: "0.7rem", fontWeight: 700, minWidth: "36px" }}>{row.label}</span>
                  <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.44rem" }}>{row.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why invest */}
          <div style={{ background: GOLD_FAINT, border: `1px solid ${GOLD_10}`, borderRadius: "10px", padding: "24px", marginBottom: "20px" }}>
            <p style={{ color: BLUE, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "14px" }}>WHY INVEST IN THE TRADE CO.?</p>
            <div style={{ display: "grid", gap: "10px" }}>
              {[
                "The home services market in Hawaii alone is $2.4B/yr. We're building the only brotherhood-operated route network in the state.",
                "Route operators are brothers — they don't quit, they don't steal, they don't cut corners. The brotherhood is the quality control.",
                "The 80/10/10 model means the Trade Co. keeps 20% of every dollar generated. At $1.58M ARR, that's $316K/yr to the company.",
                "B2B contracts (hotels, property managers) are 3–5× the margin of residential. One hotel contract = 20 residential routes.",
                "The Trade Academy creates a pipeline of trained operators. Every graduate is a new revenue stream.",
              ].map((point, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ color: BLUE, fontSize: "0.42rem", flexShrink: 0, marginTop: "2px" }}>→</span>
                  <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.44rem", lineHeight: 1.7 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Co. doctrine link */}
          <a href="/trade" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "rgba(176,142,80,0.04)",
            border: `1px solid ${GOLD_20}`,
            borderRadius: "8px",
            padding: "14px 18px",
            marginBottom: "20px",
            textDecoration: "none",
          }}>
            <div>
              <p style={{ color: GOLD, fontSize: "0.44rem", letterSpacing: "0.15em", marginBottom: 3 }}>MĀKOA TRADE CO. — FULL DOCTRINE</p>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem" }}>What the route moves. The five laws. The 100-year mission.</p>
            </div>
            <span style={{ color: GOLD_DIM, fontSize: "0.8rem", flexShrink: 0, marginLeft: 12 }}>→</span>
          </a>

          {/* Where it goes */}
          <div style={{ background: GOLD_FAINT, border: `1px solid ${GOLD_10}`, borderRadius: "10px", padding: "24px" }}>
            <p style={{ color: PURPLE, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "14px" }}>WHERE TRADE CO. INVESTMENT GOES</p>

            {/* Allocation bar */}
            <div style={{ display: "flex", gap: "2px", height: "8px", borderRadius: "4px", overflow: "hidden", marginBottom: "16px" }}>
              {TRADE_CO_USE.map((t, i) => (
                <div key={i} style={{ width: `${t.pct}%`, background: t.color }} />
              ))}
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              {TRADE_CO_USE.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "10px 0", borderBottom: i < TRADE_CO_USE.length - 1 ? `1px solid rgba(176,142,80,0.06)` : "none" }}>
                  <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <p style={{ color: t.color, fontSize: "0.44rem" }}>{t.category}</p>
                      <span style={{ color: t.color, fontSize: "0.48rem", fontWeight: 700 }}>{t.pct}%</span>
                    </div>
                    <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", lineHeight: 1.6 }}>{t.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <div style={{ padding: "60px 24px", borderTop: `1px solid ${GOLD_10}`, background: "rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em", textAlign: "center", marginBottom: "32px" }}>QUESTIONS</p>
          <div style={{ display: "grid", gap: "4px" }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-row" style={{
                background: openFaq === i ? "rgba(176,142,80,0.05)" : "transparent",
                border: `1px solid ${openFaq === i ? GOLD_20 : "rgba(176,142,80,0.08)"}`,
                borderRadius: "8px", overflow: "hidden", transition: "all 0.2s",
              }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", gap: "12px" }}>
                  <p style={{ color: "#e8e0d0", fontSize: "0.5rem", lineHeight: 1.5 }}>{faq.q}</p>
                  <span style={{ color: GOLD_DIM, fontSize: "0.7rem", flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s", lineHeight: 1 }}>+</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding: "0 18px 16px", animation: "fadeUp 0.2s ease forwards" }}>
                    <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.46rem", lineHeight: 1.8 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CLAIM FORM ────────────────────────────────────────────────────── */}
      <div id="claim" style={{ padding: "80px 24px", borderTop: `1px solid ${GOLD_10}`, maxWidth: "480px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em", marginBottom: "12px" }}>CLAIM YOUR SEAT</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "2rem", color: GOLD, fontWeight: 300, margin: "0 0 12px" }}>
            4 Seats. Worldwide.
          </h2>
          <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.46rem", lineHeight: 1.7 }}>
            When they're gone, they're gone.<br />No second round. No waitlist.
          </p>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.1em" }}>SEATS CLAIMED</span>
            <span style={{ color: GOLD, fontSize: "0.4rem" }}>0 / 12</span>
          </div>
          <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div style={{ height: "100%", width: "0%", background: GOLD, borderRadius: "2px" }} />
          </div>
        </div>

        <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
          <input style={inputStyle} placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input style={inputStyle} placeholder="Email address" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input style={inputStyle} placeholder="Phone (optional)" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input style={inputStyle} placeholder="Your region (Hawaii, California, etc.)" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} />
        </div>

        <button
          onClick={handleClaim}
          disabled={submitting || !form.name || !form.email}
          style={{
            width: "100%", background: form.name && form.email ? GOLD_10 : "transparent",
            border: `1px solid ${form.name && form.email ? GOLD_20 : "rgba(176,142,80,0.08)"}`,
            color: form.name && form.email ? GOLD : GOLD_DIM,
            fontSize: "0.52rem", letterSpacing: "0.25em", padding: "16px",
            cursor: form.name && form.email && !submitting ? "pointer" : "not-allowed",
            fontFamily: "'JetBrains Mono', monospace", borderRadius: "6px",
            opacity: !form.name || !form.email ? 0.4 : 1, marginBottom: "16px",
            transition: "all 0.25s",
          }}
        >
          {submitting ? "CONNECTING..." : "ENTER THE FOUNDING COUNCIL — $4,997"}
        </button>

        <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.4rem", textAlign: "center", lineHeight: 1.7 }}>
          Secure checkout via Stripe · 1% equity · 4 seats worldwide<br />
          Questions? Talk to XI on the 808 channel.
        </p>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${GOLD_10}`, padding: "32px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" }}>
          {[
            { label: "GATE", href: "/" },
            { label: "CIRCLE", href: "/circle" },
            { label: "MAYDAY", href: "/founding48" },
            { label: "ALIʻI STONE", href: "/stones/alii" },
            { label: "SERVICES", href: "/services" },
          ].map(link => (
            <a key={link.label} href={link.href} style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>{link.label}</a>
          ))}
        </div>
        <p style={{ color: "rgba(176,142,80,0.1)", fontSize: "0.36rem", letterSpacing: "0.15em" }}>
          Mākoa Order · Co-Founding Council · 2026
        </p>
      </div>
    </div>
  );
}
