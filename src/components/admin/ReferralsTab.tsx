"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.08)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const AMBER = "#f0883e";
const RED = "#e05c5c";

type ReferralEntry = {
  referral_code: string;
  referrer_name: string;
  referrer_email: string;
  referrer_handle: string;
  count: number;
  reward_tier: number; // 1, 3, 5, 10
  reward_triggered: boolean;
};

function rewardLabel(count: number): { label: string; color: string } {
  if (count >= 10) return { label: "SEAT SPONSORED", color: GREEN };
  if (count >= 5) return { label: "50% OFF DUES", color: GREEN };
  if (count >= 3) return { label: "FIELD MANUAL", color: AMBER };
  if (count >= 1) return { label: "STICKER PACK", color: BLUE };
  return { label: "NO REWARD YET", color: "rgba(232,224,208,0.3)" };
}

function nextRewardAt(count: number): number {
  if (count < 1) return 1;
  if (count < 3) return 3;
  if (count < 5) return 5;
  if (count < 10) return 10;
  return 10;
}

export default function ReferralsTab() {
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  useEffect(() => {
    loadReferrals();
  }, []);

  async function loadReferrals() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gate_submissions")
        .select("referral_code, full_name, email, q11")
        .not("referral_code", "is", null)
        .neq("referral_code", "");

      const { count } = await supabase
        .from("gate_submissions")
        .select("*", { count: "exact", head: true });

      setTotalSubmissions(count || 0);

      if (data && !error) {
        // Group by referral_code
        const map: Record<string, { count: number; names: string[]; emails: string[] }> = {};
        data.forEach((row: { referral_code: string; full_name: string; email: string }) => {
          const code = row.referral_code;
          if (!map[code]) map[code] = { count: 0, names: [], emails: [] };
          map[code].count++;
          map[code].names.push(row.full_name || "");
          map[code].emails.push(row.email || "");
        });

        // Now look up the referrers from applicants table
        const codes = Object.keys(map);
        const entries: ReferralEntry[] = [];

        if (codes.length > 0) {
          const { data: referrers } = await supabase
            .from("gate_submissions")
            .select("full_name, email, referral_code, q11")
            .in("referral_code", codes);

          // Build a referrer lookup by their OWN code
          const referrerMap: Record<string, { name: string; email: string; handle: string }> = {};
          if (referrers) {
            referrers.forEach((r: { full_name: string; email: string; referral_code: string; q11?: string }) => {
              referrerMap[r.referral_code] = {
                name: r.full_name || "",
                email: r.email || "",
                handle: r.q11 || "",
              };
            });
          }

          codes.forEach(code => {
            const ref = referrerMap[code];
            const count = map[code].count;
            entries.push({
              referral_code: code,
              referrer_name: ref?.name || code,
              referrer_email: ref?.email || "",
              referrer_handle: ref?.handle || "",
              count,
              reward_tier: count >= 10 ? 10 : count >= 5 ? 5 : count >= 3 ? 3 : count >= 1 ? 1 : 0,
              reward_triggered: count >= 5,
            });
          });
        }

        entries.sort((a, b) => b.count - a.count);
        setReferrals(entries);
      }
    } catch (e) {
      console.error("Referral load error:", e);
    }
    setLoading(false);
  }

  const totalReferralSubmissions = referrals.reduce((s, r) => s + r.count, 0);
  const rewardTriggered = referrals.filter(r => r.reward_triggered);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.28em", marginBottom: 4 }}>
          REFERRAL SYSTEM · VIRAL GROWTH TRACKER
        </p>
        <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.44rem", lineHeight: 1.7 }}>
          Every brother gets a unique referral link. 5 shares = 50% off dues. Track the cascade here.
        </p>
      </div>

      {/* Reward Tiers */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.2em", marginBottom: 8 }}>REWARD TIERS</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { count: "1 referral", reward: "Sticker Pack", color: BLUE },
            { count: "3 referrals", reward: "Field Manual", color: AMBER },
            { count: "5 referrals", reward: "50% Off Dues", color: GREEN },
            { count: "10 referrals", reward: "Seat Sponsored", color: GOLD },
          ].map(tier => (
            <div
              key={tier.count}
              style={{
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${tier.color}30`,
                borderRadius: 6,
                padding: "10px 12px",
                textAlign: "center",
              }}
            >
              <p style={{ color: tier.color, fontSize: "0.52rem", fontWeight: 700, marginBottom: 2 }}>{tier.count}</p>
              <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.38rem" }}>{tier.reward}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
        <StatBox label="TOTAL SUBMISSIONS" value={totalSubmissions} color={GOLD} />
        <StatBox label="VIA REFERRAL" value={totalReferralSubmissions} color={BLUE} />
        <StatBox label="REWARDS TRIGGERED" value={rewardTriggered.length} color={GREEN} />
      </div>

      {/* Leaderboard */}
      <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.2em" }}>REFERRAL LEADERBOARD</p>
        <button
          onClick={loadReferrals}
          style={{
            background: "none",
            border: "1px solid rgba(176,142,80,0.2)",
            color: GOLD_DIM,
            borderRadius: 4,
            padding: "4px 10px",
            fontSize: "0.36rem",
            cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          REFRESH
        </button>
      </div>

      {loading ? (
        <p style={{ color: GOLD_DIM, fontSize: "0.44rem", textAlign: "center", padding: "30px 0" }}>Loading referrals...</p>
      ) : referrals.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", background: GOLD_FAINT, borderRadius: 8 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.44rem", marginBottom: 8 }}>No referrals tracked yet.</p>
          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem", lineHeight: 1.7 }}>
            Referrals are tracked when gate submissions include a ref code.<br />
            Share link format: makoa.live/gate?ref=HANDLE
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {referrals.map((r, i) => {
            const reward = rewardLabel(r.count);
            const next = nextRewardAt(r.count);
            const progress = Math.min((r.count / next) * 100, 100);
            return (
              <div
                key={r.referral_code}
                style={{
                  background: r.reward_triggered ? "rgba(63,185,80,0.05)" : "rgba(0,0,0,0.3)",
                  border: `1px solid ${r.reward_triggered ? "rgba(63,185,80,0.2)" : "rgba(176,142,80,0.1)"}`,
                  borderRadius: 8,
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{ color: GOLD_DIM, fontSize: "0.38rem", minWidth: 20 }}>#{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#e8e0d0", fontSize: "0.48rem" }}>{r.referrer_name}</p>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem" }}>
                      {r.referrer_handle ? `@${r.referrer_handle} · ` : ""}{r.referral_code}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: reward.color, fontSize: "0.52rem", fontWeight: 700 }}>{r.count}</p>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.34rem" }}>referrals</p>
                  </div>
                  <div
                    style={{
                      background: `${reward.color}18`,
                      border: `1px solid ${reward.color}40`,
                      borderRadius: 4,
                      padding: "3px 8px",
                      minWidth: 100,
                      textAlign: "center",
                    }}
                  >
                    <p style={{ color: reward.color, fontSize: "0.34rem", letterSpacing: "0.1em" }}>{reward.label}</p>
                  </div>
                </div>

                {/* Progress bar to next tier */}
                {r.count < 10 && (
                  <div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${progress}%`,
                          background: reward.color,
                          borderRadius: 2,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                    <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.32rem", marginTop: 3 }}>
                      {next - r.count} more to {rewardLabel(next).label}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* How to share */}
      <div style={{ marginTop: 24, background: GOLD_FAINT, border: "1px solid rgba(176,142,80,0.15)", borderRadius: 8, padding: "14px 16px" }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.2em", marginBottom: 8 }}>HOW BROTHERS SHARE</p>
        <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", lineHeight: 1.8 }}>
          Each brother's referral link: <span style={{ color: GREEN }}>makoa.live/gate?ref=THEIRHANDLE</span><br />
          When a new submission comes in with their ref code, it's counted here automatically.<br />
          At <strong style={{ color: GREEN }}>5 referrals</strong> — trigger Stripe coupon manually or via XI agent.<br />
          At <strong style={{ color: GOLD }}>10 referrals</strong> — their seat is fully sponsored.
        </p>
        <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(0,0,0,0.3)", borderRadius: 6 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.15em", marginBottom: 4 }}>ROUNDUP MARKETING CASCADE</p>
          <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.38rem", lineHeight: 1.7 }}>
            1. Steward posts → tags 2–3 Founding Brothers<br />
            2. Each ambassador reposts + adds their story + ref link<br />
            3. Their network sees it → clicks → gate submission<br />
            4. Referral counted → reward triggered automatically<br />
            5. More brothers join → more ambassadors → flywheel
          </p>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(176,142,80,0.1)", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
      <p style={{ color: color, fontSize: "1.2rem", fontWeight: 700, lineHeight: 1 }}>{value}</p>
      <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.34rem", letterSpacing: "0.15em", marginTop: 4 }}>{label}</p>
    </div>
  );
}
