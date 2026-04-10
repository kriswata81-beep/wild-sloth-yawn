"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";

const TIERS = [
  {
    name: "KOA BASIC",
    price: "$149",
    priceId: "price_1TKnnq836uPpUiqMq9pUwx1k",
    interval: "/mo",
    color: "#8b9aaa",
    icon: "◇",
    services: [
      "Bi-weekly exterior maintenance",
      "Monthly deep clean (1 area)",
      "Seasonal yard service",
      "Basic pest prevention",
      "24-hour response window",
    ],
    ideal: "Single-family homes, condos, small properties",
  },
  {
    name: "KOA PLUS",
    price: "$249",
    priceId: "price_1TKnnr836uPpUiqMXGEiDvCh",
    interval: "/mo",
    color: "#58a6ff",
    icon: "◆",
    popular: true,
    services: [
      "Weekly exterior maintenance",
      "Bi-weekly interior service",
      "Monthly deep clean (full home)",
      "Pest + termite prevention",
      "Priority scheduling (same-day available)",
      "Seasonal HVAC + filter service",
      "Dedicated route operator",
    ],
    ideal: "Families, working professionals, rental properties",
  },
  {
    name: "KOA PREMIUM",
    price: "$399",
    priceId: "price_1TKnnr836uPpUiqMEgHiLMe6",
    interval: "/mo",
    color: GOLD,
    icon: "◈",
    services: [
      "Everything in Koa Plus",
      "Full interior + exterior weekly service",
      "Appliance maintenance program",
      "Pressure washing (quarterly)",
      "Gutter + roof inspection (quarterly)",
      "Same-day emergency response",
      "Dedicated 2-person crew",
      "Monthly property report",
    ],
    ideal: "Large homes, luxury properties, vacation rentals",
  },
  {
    name: "KOA ELITE",
    price: "$599",
    priceId: "price_1TKnns836uPpUiqM2KAEa2Ib",
    interval: "/mo",
    color: "#c9a050",
    icon: "◉",
    services: [
      "Everything in Koa Premium",
      "Concierge home management",
      "Vendor coordination (plumber, electrician, etc.)",
      "Key holder + property check-ins",
      "Storm prep + emergency board-up",
      "Holiday lighting + seasonal decor",
      "Guest-ready turnover service",
      "Direct line to your crew lead",
      "Quarterly home health report",
    ],
    ideal: "Estate owners, off-island owners, property managers",
  },
];

const ROUTE_SERVICES = [
  { icon: "🧹", name: "Home Cleaning", desc: "Interior deep clean, routine maintenance, move-in/move-out" },
  { icon: "🌿", name: "Yard & Landscaping", desc: "Mowing, hedging, tree trimming, seasonal planting" },
  { icon: "🐜", name: "Pest Control", desc: "Preventive treatment, termite inspection, emergency response" },
  { icon: "🔧", name: "Handyman", desc: "Repairs, installations, fixture replacement, painting" },
  { icon: "💨", name: "Pressure Washing", desc: "Driveways, decks, siding, roof treatment" },
  { icon: "🏠", name: "Property Management", desc: "Check-ins, vendor coordination, tenant prep" },
];

export default function ServicesPage() {
  const [ready, setReady] = useState(false);
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  async function handleSubscribe(priceId: string) {
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          mode: "subscription",
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Connection error. Try again.");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      fontFamily: "'JetBrains Mono', monospace",
      padding: "40px 20px 60px",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .tier-card:hover { border-color: rgba(176,142,80,0.3) !important; }
      `}</style>

      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "48px",
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}>
        <p style={{ fontSize: "0.45rem", letterSpacing: "0.3em", color: GOLD_40, marginBottom: "12px" }}>
          MAKOA TRADE CO.
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "2.2rem",
          color: GOLD,
          margin: "0 0 12px",
          fontWeight: 300,
        }}>Home Services</h1>
        <p style={{
          fontSize: "0.52rem",
          color: "rgba(176,142,80,0.5)",
          maxWidth: "440px",
          margin: "0 auto",
          lineHeight: 1.8,
        }}>
          Route-based. Subscription-powered. Brother-operated.<br />
          One crew. One route. Your home handled.
        </p>
      </div>

      {/* Service Categories */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px",
        maxWidth: "480px",
        margin: "0 auto 40px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.8s ease 0.2s",
      }}>
        {ROUTE_SERVICES.map((s, i) => (
          <div key={i} style={{
            background: "rgba(176,142,80,0.03)",
            border: "1px solid rgba(176,142,80,0.08)",
            borderRadius: "6px",
            padding: "14px 10px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "6px" }}>{s.icon}</p>
            <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.1em", marginBottom: "4px" }}>{s.name}</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem", lineHeight: 1.4 }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{
        textAlign: "center",
        marginBottom: "32px",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.8s ease 0.4s",
      }}>
        <p style={{ fontSize: "0.42rem", letterSpacing: "0.25em", color: GOLD_40 }}>
          SUBSCRIPTION TIERS
        </p>
        <div style={{ width: "40px", height: "1px", background: GOLD_20, margin: "12px auto" }} />
        <p style={{ fontSize: "0.45rem", color: "rgba(176,142,80,0.35)", maxWidth: "360px", margin: "0 auto", lineHeight: 1.6 }}>
          80% goes to your brother on the route. 10% to the house. 10% to the order. Everyone eats.
        </p>
      </div>

      {/* Tier Cards */}
      <div style={{
        display: "grid",
        gap: "16px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        {TIERS.map((tier, i) => (
          <div
            key={tier.name}
            className="tier-card"
            style={{
              background: "rgba(176,142,80,0.03)",
              border: `1px solid ${expandedTier === tier.name ? tier.color + "40" : "rgba(176,142,80,0.1)"}`,
              borderRadius: "8px",
              padding: "20px",
              position: "relative",
              cursor: "pointer",
              transition: "all 0.3s ease",
              opacity: ready ? 1 : 0,
              transform: ready ? "translateY(0)" : "translateY(14px)",
              transitionDelay: `${0.5 + i * 0.1}s`,
            }}
            onClick={() => setExpandedTier(expandedTier === tier.name ? null : tier.name)}
          >
            {tier.popular && (
              <span style={{
                position: "absolute",
                top: "-8px",
                right: "16px",
                background: tier.color,
                color: "#000",
                fontSize: "0.36rem",
                letterSpacing: "0.15em",
                padding: "3px 10px",
                borderRadius: "2px",
                fontWeight: 600,
              }}>MOST POPULAR</span>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: tier.color, fontSize: "0.45rem", letterSpacing: "0.2em", marginBottom: "6px" }}>
                  <span style={{ marginRight: "6px" }}>{tier.icon}</span>{tier.name}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.8rem",
                    color: "#e8e0d0",
                    fontWeight: 300,
                  }}>{tier.price}</span>
                  <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.45rem" }}>{tier.interval}</span>
                </div>
              </div>
            </div>

            {expandedTier === tier.name && (
              <div style={{ marginTop: "16px", animation: "fadeUp 0.25s ease forwards" }}>
                <div style={{ display: "grid", gap: "8px", marginBottom: "14px" }}>
                  {tier.services.map((s, si) => (
                    <div key={si} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                      <span style={{ color: tier.color, fontSize: "0.42rem", flexShrink: 0, marginTop: "1px" }}>+</span>
                      <span style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.46rem", lineHeight: 1.4 }}>{s}</span>
                    </div>
                  ))}
                </div>
                <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.4rem", marginBottom: "14px", fontStyle: "italic" }}>
                  Ideal for: {tier.ideal}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleSubscribe(tier.priceId); }}
                  style={{
                    width: "100%",
                    background: `${tier.color}12`,
                    border: `1px solid ${tier.color}40`,
                    color: tier.color,
                    fontSize: "0.48rem",
                    letterSpacing: "0.2em",
                    padding: "12px",
                    cursor: "pointer",
                    fontFamily: "'JetBrains Mono', monospace",
                    borderRadius: "4px",
                  }}
                >
                  START KOA {tier.name.split(" ")[1]}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div style={{
        maxWidth: "480px",
        margin: "48px auto 0",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.8s ease 1s",
      }}>
        <p style={{ color: GOLD_40, fontSize: "0.42rem", letterSpacing: "0.25em", textAlign: "center", marginBottom: "20px" }}>
          HOW THE ROUTE WORKS
        </p>
        {[
          { step: "01", title: "Subscribe", desc: "Pick your tier. Monthly. Cancel anytime." },
          { step: "02", title: "Meet Your Crew", desc: "A Makoa brother is assigned your route. Same crew every time." },
          { step: "03", title: "Scheduled Service", desc: "Your home is on the route. Services arrive like clockwork." },
          { step: "04", title: "Report & Repeat", desc: "Monthly property report. Adjustments. No surprises." },
        ].map((s, i) => (
          <div key={i} style={{
            display: "flex",
            gap: "14px",
            padding: "14px 0",
            borderBottom: "1px solid rgba(176,142,80,0.06)",
          }}>
            <span style={{ color: GOLD, fontSize: "0.5rem", fontWeight: 600, flexShrink: 0, opacity: 0.5 }}>{s.step}</span>
            <div>
              <p style={{ color: "#e8e0d0", fontSize: "0.52rem", marginBottom: "3px" }}>{s.title}</p>
              <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem" }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{ textAlign: "center", marginTop: "48px" }}>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
          <a href="/" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>GATE</a>
          <span style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.38rem" }}>·</span>
          <a href="/circle" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>CIRCLE</a>
          <span style={{ color: "rgba(176,142,80,0.12)", fontSize: "0.38rem" }}>·</span>
          <a href="/founding48" style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.38rem", textDecoration: "none", letterSpacing: "0.15em" }}>MAYDAY</a>
        </div>
        <p style={{ color: "rgba(176,142,80,0.1)", fontSize: "0.36rem", letterSpacing: "0.15em", marginTop: "12px" }}>
          Mākoa Trade Co. · West Oahu · 2026
        </p>
      </div>
    </div>
  );
}
