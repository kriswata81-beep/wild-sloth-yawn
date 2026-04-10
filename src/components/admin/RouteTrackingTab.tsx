"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.08)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const RED = "#e05c5c";
const AMBER = "#f0883e";
const STEEL = "#8b9aaa";

type Route = {
  id: string;
  name: string;
  operator: string;
  region: string;
  status: "active" | "building" | "planned" | "paused";
  stops: number;
  capacity: number;
  monthlyRevenue: number;
  rating: number;
  nextService: string;
};

type ServiceStop = {
  id: string;
  client: string;
  address: string;
  tier: "basic" | "plus" | "premium" | "elite";
  status: "scheduled" | "completed" | "overdue" | "cancelled";
  nextDate: string;
  monthlyValue: number;
};

const STATUS_COLOR: Record<string, string> = {
  active: GREEN,
  building: BLUE,
  planned: GOLD_DIM,
  paused: RED,
  scheduled: BLUE,
  completed: GREEN,
  overdue: RED,
  cancelled: STEEL,
};

const TIER_COLOR: Record<string, string> = {
  basic: STEEL,
  plus: BLUE,
  premium: GOLD,
  elite: "#c9a050",
};

// Empty for now — will populate from Supabase
const MOCK_ROUTES: Route[] = [];
const MOCK_STOPS: ServiceStop[] = [];

export default function RouteTrackingTab() {
  const [routes] = useState<Route[]>(MOCK_ROUTES);
  const [stops] = useState<ServiceStop[]>(MOCK_STOPS);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [view, setView] = useState<"routes" | "stops" | "economics">("routes");

  const totalStops = routes.reduce((s, r) => s + r.stops, 0);
  const totalCapacity = routes.reduce((s, r) => s + r.capacity, 0);
  const totalMRR = routes.reduce((s, r) => s + r.monthlyRevenue, 0);
  const avgRating = routes.length > 0
    ? (routes.reduce((s, r) => s + r.rating, 0) / routes.length).toFixed(1)
    : "—";

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
        {[
          { label: "Active Routes", value: routes.filter(r => r.status === "active").length.toString(), color: GREEN },
          { label: "Total Stops", value: `${totalStops}/${totalCapacity}`, color: BLUE },
          { label: "Route MRR", value: `$${totalMRR.toLocaleString()}`, color: GOLD },
          { label: "Avg Rating", value: avgRating, color: AMBER },
        ].map(s => (
          <div key={s.label} style={{
            background: GOLD_FAINT,
            border: "1px solid rgba(176,142,80,0.08)",
            borderRadius: "6px",
            padding: "14px 12px",
          }}>
            <p style={{ color: s.color, fontSize: "0.8rem", fontWeight: 500 }}>{s.value}</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", letterSpacing: "0.1em", marginTop: "4px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[
          { key: "routes", label: "ROUTES" },
          { key: "stops", label: "SERVICE STOPS" },
          { key: "economics", label: "ECONOMICS" },
        ].map(v => (
          <button
            key={v.key}
            onClick={() => setView(v.key as typeof view)}
            style={{
              background: view === v.key ? "rgba(176,142,80,0.12)" : "transparent",
              border: `1px solid ${view === v.key ? GOLD + "40" : "rgba(176,142,80,0.1)"}`,
              color: view === v.key ? GOLD : GOLD_DIM,
              fontSize: "0.38rem",
              letterSpacing: "0.12em",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >{v.label}</button>
        ))}
      </div>

      {/* Routes View */}
      {view === "routes" && (
        <div style={{ display: "grid", gap: "8px" }}>
          {routes.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "40px 20px",
              background: GOLD_FAINT,
              borderRadius: "8px",
              border: "1px solid rgba(176,142,80,0.06)",
            }}>
              <p style={{ color: GOLD, fontSize: "0.55rem", marginBottom: "8px" }}>No routes yet</p>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", lineHeight: 1.6 }}>
                Routes activate after MAYDAY 2026.<br />
                Brothers will be assigned territories and begin building routes.
              </p>
              <div style={{
                marginTop: "20px",
                display: "grid",
                gap: "8px",
                maxWidth: "360px",
                marginLeft: "auto",
                marginRight: "auto",
              }}>
                <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.2em" }}>PLANNED LAUNCH ROUTES</p>
                {[
                  "Kapolei · Residential Core",
                  "Ko Olina · Resort Corridor",
                  "Ewa Beach · Family Zone",
                  "Makakilo · Hillside Route",
                  "Ocean Pointe · New Build District",
                ].map((r, i) => (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "4px",
                    border: "1px solid rgba(176,142,80,0.04)",
                  }}>
                    <span style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.42rem" }}>{r}</span>
                    <span style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.1em" }}>PLANNED</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            routes.map(route => {
              const pct = route.capacity > 0 ? Math.round((route.stops / route.capacity) * 100) : 0;
              return (
                <div key={route.id} style={{
                  background: GOLD_FAINT,
                  border: `1px solid ${selectedRoute === route.id ? GOLD + "30" : "rgba(176,142,80,0.1)"}`,
                  borderRadius: "8px",
                  padding: "14px 16px",
                  cursor: "pointer",
                }} onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div>
                      <p style={{ color: "#e8e0d0", fontSize: "0.6rem", marginBottom: "2px" }}>{route.name}</p>
                      <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem" }}>
                        {route.operator} · {route.region}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ color: STATUS_COLOR[route.status], fontSize: "0.38rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {route.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "4px", padding: "8px" }}>
                      <p style={{ color: BLUE, fontSize: "0.6rem" }}>{route.stops}/{route.capacity}</p>
                      <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem" }}>Stops</p>
                    </div>
                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "4px", padding: "8px" }}>
                      <p style={{ color: GREEN, fontSize: "0.6rem" }}>${route.monthlyRevenue.toLocaleString()}</p>
                      <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem" }}>MRR</p>
                    </div>
                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "4px", padding: "8px" }}>
                      <p style={{ color: AMBER, fontSize: "0.6rem" }}>★ {route.rating}</p>
                      <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem" }}>Rating</p>
                    </div>
                  </div>
                  <div style={{ height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "1px", marginTop: "10px" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? GREEN : pct > 50 ? BLUE : GOLD, borderRadius: "1px" }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Service Stops View */}
      {view === "stops" && (
        <div style={{ display: "grid", gap: "8px" }}>
          {stops.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "40px 20px",
              background: GOLD_FAINT,
              borderRadius: "8px",
              border: "1px solid rgba(176,142,80,0.06)",
            }}>
              <p style={{ color: GOLD, fontSize: "0.55rem", marginBottom: "8px" }}>No service stops yet</p>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", lineHeight: 1.6 }}>
                When B2C subscribers sign up at <span style={{ color: GOLD_DIM }}>/services</span>,<br />
                their stops will appear here for route assignment.
              </p>
            </div>
          ) : (
            stops.map(stop => (
              <div key={stop.id} style={{
                background: GOLD_FAINT,
                border: "1px solid rgba(176,142,80,0.1)",
                borderRadius: "8px",
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <p style={{ color: "#e8e0d0", fontSize: "0.55rem", marginBottom: "2px" }}>{stop.client}</p>
                  <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem" }}>{stop.address}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{
                    color: TIER_COLOR[stop.tier],
                    fontSize: "0.36rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}>KOA {stop.tier}</span>
                  <span style={{
                    color: STATUS_COLOR[stop.status],
                    fontSize: "0.36rem",
                    textTransform: "uppercase",
                  }}>{stop.status}</span>
                  <span style={{ color: GREEN, fontSize: "0.42rem" }}>${stop.monthlyValue}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Economics View */}
      {view === "economics" && (
        <div>
          <div style={{
            background: GOLD_FAINT,
            border: "1px solid rgba(176,142,80,0.06)",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "16px",
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "16px" }}>
              REVENUE SPLIT MODEL · 80/10/10
            </p>
            <div style={{ display: "grid", gap: "12px" }}>
              {[
                { label: "Brother (Route Operator)", pct: "80%", color: GREEN, desc: "Goes directly to the brother running the route" },
                { label: "House (Local Chapter)", pct: "10%", color: BLUE, desc: "Funds local operations, equipment, meeting space" },
                { label: "Order (Central)", pct: "10%", color: GOLD, desc: "XI operations, insurance, marketing, expansion" },
              ].map(split => (
                <div key={split.label} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "6px",
                }}>
                  <div>
                    <p style={{ color: split.color, fontSize: "0.5rem", marginBottom: "2px" }}>{split.label}</p>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>{split.desc}</p>
                  </div>
                  <span style={{ color: split.color, fontSize: "0.8rem", fontWeight: 600 }}>{split.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Per-Tier Economics */}
          <div style={{
            background: GOLD_FAINT,
            border: "1px solid rgba(176,142,80,0.06)",
            borderRadius: "8px",
            padding: "20px",
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "16px" }}>
              ROUTE ECONOMICS · PER 20-STOP ROUTE
            </p>
            <div style={{ display: "grid", gap: "8px" }}>
              {[
                { tier: "Koa Basic", price: 149, stops: 20, color: STEEL },
                { tier: "Koa Plus", price: 249, stops: 20, color: BLUE },
                { tier: "Koa Premium", price: 399, stops: 20, color: GOLD },
                { tier: "Koa Elite", price: 599, stops: 20, color: "#c9a050" },
              ].map(t => {
                const gross = t.price * t.stops;
                const brother = Math.round(gross * 0.8);
                const house = Math.round(gross * 0.1);
                const order = Math.round(gross * 0.1);
                return (
                  <div key={t.tier} style={{
                    display: "grid",
                    gridTemplateColumns: "1fr repeat(4, auto)",
                    gap: "12px",
                    alignItems: "center",
                    padding: "10px 12px",
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "4px",
                  }}>
                    <span style={{ color: t.color, fontSize: "0.42rem" }}>{t.tier}</span>
                    <span style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.42rem" }}>${gross.toLocaleString()}/mo</span>
                    <span style={{ color: GREEN, fontSize: "0.42rem" }}>→ ${brother.toLocaleString()}</span>
                    <span style={{ color: BLUE, fontSize: "0.42rem" }}>→ ${house.toLocaleString()}</span>
                    <span style={{ color: GOLD, fontSize: "0.42rem" }}>→ ${order.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
            <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.36rem", marginTop: "12px", textAlign: "center" }}>
              Mixed-tier route average: $4,990/mo gross · $3,992 brother take
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
