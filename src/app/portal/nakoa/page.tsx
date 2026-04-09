"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import EmergencyChannel from "@/components/EmergencyChannel";
import GatheringsCalendar from "@/components/GatheringsCalendar";

const GREEN = "#3fb950";
const GREEN_DIM = "rgba(63,185,80,0.5)";
const GREEN_FAINT = "rgba(63,185,80,0.07)";
const GREEN_20 = "rgba(63,185,80,0.2)";
const GREEN_40 = "rgba(63,185,80,0.4)";
const BG = "#04060a";

function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed || "makoa")}`;
}

type Member = {
  id: string;
  application_id: string;
  full_name: string;
  telegram_handle: string | null;
  tier: string;
  current_rank: string;
  region: string;
  service_actions_count: number;
  weekly_training_attendance_count: number;
  rank_points_total: number;
  monthly_plan_status: string;
};

const TRAINING_SCHEDULE = [
  { date: "Wed Apr 16 · 4:00 AM", location: "Ko Olina Beach", topic: "Ice Bath + Formation Run", spots: 12 },
  { date: "Wed Apr 23 · 4:00 AM", location: "Kapolei Community Park", topic: "Strength & Conditioning", spots: 15 },
  { date: "Wed Apr 30 · 4:00 AM", location: "Ko Olina Beach", topic: "Ocean Training + Breathwork", spots: 10 },
  { date: "Wed May 7 · 4:00 AM", location: "Kapolei Community Park", topic: "Combat Fitness + Sparring", spots: 12 },
  { date: "Wed May 14 · 4:00 AM", location: "Ko Olina Beach", topic: "Pre-72 Prep — Full Formation", spots: 20 },
];

const BENEFITS = [
  "Free tool library — borrow any tool",
  "Free Makoa Ride — order transport",
  "Free Wednesday 4am elite training",
  "Free ice bath + sauna per cluster",
  "Beach training — Ko Olina",
  "Full moon gathering — monthly",
  "808-911 emergency peer response",
  "808-411 knowledge peer channel",
  "Service route income — 80% to you (10% Mana · 10% Hale)",
  "Formation rank progression",
];

export default function NakoaPortal() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [waitlistScore, setWaitlistScore] = useState(0);

  const loadData = useCallback(async (appId: string) => {
    const { data: m } = await supabase
      .from("applicants")
      .select("*")
      .eq("application_id", appId)
      .single();
    if (m) {
      setMember(m as Member);
      // Waitlist score based on training attendance + service actions
      const score = Math.min(100, ((m.weekly_training_attendance_count || 0) * 8) + ((m.service_actions_count || 0) * 5));
      setWaitlistScore(score);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = sessionStorage.getItem("makoa_app_id");
    if (!id) { router.replace("/portal/login"); return; }
    loadData(id);
  }, [router, loadData]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "28px", height: "28px", border: `1px solid ${GREEN}`, borderTop: "1px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const handle = member?.telegram_handle || member?.full_name?.split(" ")[0] || "Brother";
  const avatarSeed = member?.telegram_handle || member?.full_name || "nakoa";
  const duesWaived = (member?.service_actions_count || 0) > 0;

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${GREEN_20}`,
        padding: "16px 20px",
        background: BG,
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={dicebearUrl(avatarSeed)} alt={handle} style={{ width: "38px", height: "38px", borderRadius: "50%", border: `1px solid ${GREEN_40}`, background: "#0a0d12" }} />
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GREEN, fontSize: "1.1rem", lineHeight: 1 }}>Nā Koa · The Warriors</p>
            <p style={{ color: GREEN_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginTop: "2px" }}>{handle} · Nā Koa</p>
          </div>
        </div>
        <span style={{ background: GREEN_FAINT, border: `1px solid ${GREEN_40}`, color: GREEN, fontSize: "0.4rem", padding: "3px 8px", borderRadius: "3px", letterSpacing: "0.15em" }}>
          ⚔ NĀ KOA
        </span>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 40px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "32px", animation: "fadeUp 0.6s ease forwards" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GREEN, fontSize: "2rem", lineHeight: 1.2, marginBottom: "8px" }}>
            You are ready to build<br />something worth<br />belonging to.
          </p>
          <p style={{ color: GREEN_DIM, fontSize: "0.48rem", letterSpacing: "0.15em" }}>
            Nā Koa · Warrior Entry · Formation Track
          </p>
        </div>

        {/* Dues Card */}
        <div style={{
          background: duesWaived ? GREEN_FAINT : "rgba(224,92,92,0.05)",
          border: `1px solid ${duesWaived ? GREEN_40 : "rgba(224,92,92,0.3)"}`,
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "24px",
          animation: "fadeUp 0.6s ease 0.1s both",
          textAlign: "center",
        }}>
          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "8px" }}>MONTHLY DUES</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: duesWaived ? GREEN : "#e8e0d0", fontSize: "2.4rem", lineHeight: 1, marginBottom: "6px" }}>
            $97
            <span style={{ fontSize: "0.9rem", color: duesWaived ? GREEN_DIM : "rgba(232,224,208,0.4)", marginLeft: "8px" }}>/mo</span>
          </p>
          {duesWaived ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "8px" }}>
              <span style={{ color: GREEN, fontSize: "0.55rem" }}>✓</span>
              <p style={{ color: GREEN, fontSize: "0.48rem", letterSpacing: "0.1em" }}>WAIVED — Active on service route</p>
            </div>
          ) : (
            <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem", marginTop: "8px", lineHeight: 1.6 }}>
              Waived when active on service route.<br />
              <span style={{ color: GREEN_DIM }}>Complete your first job to waive dues.</span>
            </p>
          )}
        </div>

        {/* Worker Earnings Card */}
        <div style={{
          background: GREEN_FAINT,
          border: `1px solid ${GREEN_20}`,
          borderRadius: "10px",
          padding: "16px 18px",
          marginBottom: "24px",
          animation: "fadeUp 0.6s ease 0.15s both",
        }}>
          <p style={{ color: GREEN, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "12px" }}>YOUR EARNINGS PER JOB (80% SPLIT)</p>
          <div style={{ display: "grid", gap: "6px" }}>
            {[
              { plan: "Aliʻi Plan (4 weekly visits)", rate: "$997/mo", earn: "$797.60/mo", color: "#b08e50" },
              { plan: "Kamaʻāina Plan (bi-weekly)", rate: "$497/mo", earn: "$397.60/mo", color: "#58a6ff" },
              { plan: "B2B Small (2×/mo)", rate: "$697/mo", earn: "$557.60/mo", color: "#534AB7" },
              { plan: "B2B Mid (weekly)", rate: "$1,497/mo", earn: "$1,197.60/mo", color: "#534AB7" },
              { plan: "B2B Large (weekly+on-call)", rate: "$2,497/mo", earn: "$1,997.60/mo", color: "#534AB7" },
            ].map(row => (
              <div key={row.plan} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${GREEN_20}` }}>
                <div>
                  <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.44rem" }}>{row.plan}</p>
                  <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.38rem" }}>Client pays {row.rate}</p>
                </div>
                <p style={{ color: GREEN, fontSize: "0.52rem", fontFamily: "'JetBrains Mono', monospace" }}>{row.earn}</p>
              </div>
            ))}
          </div>
          <p style={{ color: GREEN_DIM, fontSize: "0.4rem", marginTop: "10px", lineHeight: 1.6 }}>
            $97/mo dues waived when active on route. Score 60+ on waitlist to unlock assignment.
          </p>
        </div>

        {/* 808 Emergency Channels */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: GREEN, fontSize: "0.42rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "14px", opacity: 0.7 }}>808 Channels</p>
          <EmergencyChannel
            memberHandle={handle}
            memberZip={member?.region ? "96707" : "96707"}
          />
        </div>

        {/* Gatherings Calendar */}
        <div style={{ marginBottom: "24px" }}>
          <GatheringsCalendar memberTier="nakoa" memberHandle={handle} />
        </div>

        {/* Elite Training Schedule */}
        <Section title="4am Elite Training" accent={GREEN}>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem", marginBottom: "14px" }}>
            Every Wednesday · 4:00 AM · Free for all Nā Koa
          </p>
          <div style={{ display: "grid", gap: "0" }}>
            {TRAINING_SCHEDULE.map((session, i) => (
              <div key={i} style={{
                display: "flex", gap: "14px",
                padding: "12px 0",
                borderBottom: i < TRAINING_SCHEDULE.length - 1 ? `1px solid ${GREEN_20}` : "none",
                alignItems: "flex-start",
              }}>
                <div style={{ flexShrink: 0, width: "90px" }}>
                  <p style={{ color: GREEN, fontSize: "0.42rem", lineHeight: 1.5 }}>{session.date}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#e8e0d0", fontSize: "0.52rem", marginBottom: "2px" }}>{session.topic}</p>
                  <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem" }}>{session.location}</p>
                </div>
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <p style={{ color: GREEN_DIM, fontSize: "0.4rem" }}>{session.spots} spots</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "14px", padding: "12px", background: GREEN_FAINT, borderRadius: "6px", border: `1px solid ${GREEN_20}` }}>
            <p style={{ color: GREEN_DIM, fontSize: "0.45rem", lineHeight: 1.7, textAlign: "center" }}>
              Show up 3 consecutive Wednesdays → automatic rank advancement.<br />
              Ice bath is free. Bring your own towel.
            </p>
          </div>
        </Section>

        {/* Service Route Waitlist */}
        <Section title="Service Route Waitlist" accent={GREEN}>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem", marginBottom: "16px", lineHeight: 1.7 }}>
            Your position on the service route is determined by your formation score. Train, show up, and serve to move up.
          </p>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.45rem" }}>Your Waitlist Score</span>
              <span style={{ color: GREEN, fontSize: "0.52rem", fontWeight: 600 }}>{waitlistScore}/100</span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${waitlistScore}%`,
                background: `linear-gradient(90deg, ${GREEN_DIM} 0%, ${GREEN} 100%)`,
                borderRadius: "3px",
                transition: "width 1.2s ease",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem" }}>0</span>
              <span style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem" }}>Active Route</span>
              <span style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem" }}>100</span>
            </div>
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            {[
              { label: "Wednesday trainings attended", value: member?.weekly_training_attendance_count || 0, pts: "+8 pts each", color: GREEN },
              { label: "Service actions completed", value: member?.service_actions_count || 0, pts: "+5 pts each", color: GREEN },
              { label: "Formation score total", value: member?.rank_points_total || 0, pts: "pts", color: GREEN_DIM },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(63,185,80,0.06)" }}>
                <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.45rem" }}>{row.label}</span>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: row.color, fontSize: "0.5rem" }}>{row.value}</span>
                  <span style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem", marginLeft: "5px" }}>{row.pts}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "14px", textAlign: "center" }}>
            <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.45rem", lineHeight: 1.7 }}>
              Score 60+ to unlock active route assignment.<br />
              XI reviews waitlist every full moon.
            </p>
          </div>
        </Section>

        {/* Benefits */}
        <Section title="Your Nā Koa Benefits" accent={GREEN}>
          <div style={{ display: "grid", gap: "8px" }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: i < BENEFITS.length - 1 ? `1px solid ${GREEN_20}` : "none" }}>
                <span style={{ color: GREEN, fontSize: "0.5rem", flexShrink: 0 }}>⚔</span>
                <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "0.52rem" }}>{b}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Oath */}
        <div style={{ textAlign: "center", padding: "24px 16px", borderTop: `1px solid ${GREEN_20}`, marginTop: "8px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GREEN_DIM, fontSize: "0.95rem", lineHeight: 2 }}>
            &ldquo;You are ready to build<br />something worth belonging to.&rdquo;
          </p>
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            onClick={() => router.push("/portal/dashboard")}
            style={{
              background: "transparent", border: "none",
              color: "rgba(63,185,80,0.3)", fontSize: "0.45rem",
              cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.15em",
            }}
          >
            ← BACK TO DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "24px", animation: "fadeUp 0.6s ease both" }}>
      <p style={{ color: accent, fontSize: "0.42rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "14px", opacity: 0.7 }}>{title}</p>
      <div style={{ background: GREEN_FAINT, border: "1px solid rgba(63,185,80,0.1)", borderRadius: "10px", padding: "18px" }}>
        {children}
      </div>
    </div>
  );
}