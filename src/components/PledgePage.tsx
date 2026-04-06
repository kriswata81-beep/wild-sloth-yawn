"use client";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.12)";

const TIER_CONFIG = {
  alii: { label: "Aliʻi", color: GOLD, colorDim: GOLD_DIM, price: "$297/mo", deposit: "$500", pledgeFee: "$9.99" },
  mana: { label: "Mana", color: "#58a6ff", colorDim: "rgba(88,166,255,0.5)", price: "$147/mo", deposit: "$250", pledgeFee: "$9.99" },
  nakoa: { label: "Nā Koa", color: "#8b9aaa", colorDim: "rgba(139,154,170,0.5)", price: "$47/mo", deposit: "$97", pledgeFee: "$9.99" },
};

const REGIONS = [
  "West Oahu", "East Oahu", "North Shore", "Maui Nui",
  "Big Island", "Kauaʻi", "Mainland West", "Mainland East", "Other",
];

function generateApplicationId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "MKO-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function generateReferralCode(name: string, appId: string): string {
  const first = name.split(" ")[0].toUpperCase().slice(0, 4);
  const suffix = appId.slice(-4);
  return `${first}-${suffix}`;
}

interface PledgePageProps {
  tier: "nakoa" | "mana" | "alii";
  prefillName?: string;
  prefillPhone?: string;
  onComplete: (applicationId: string) => void;
  onBack: () => void;
}

export default function PledgePage({ tier, prefillName = "", prefillPhone = "", onComplete, onBack }: PledgePageProps) {
  const cfg = TIER_CONFIG[tier];

  const [form, setForm] = useState({
    full_name: prefillName,
    email: "",
    phone: prefillPhone,
    zip: "",
    region: "",
    telegram_handle: "",
    referred_by_code: "",
    oath_accepted: false,
  });
  const [step, setStep] = useState<"form" | "oath" | "submitting" | "done">("form");
  const [error, setError] = useState("");
  const [applicationId, setApplicationId] = useState("");

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function validateForm() {
    if (!form.full_name.trim()) return "Full name is required.";
    if (!form.email.trim() || !form.email.includes("@")) return "Valid email is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.region) return "Select your region.";
    return "";
  }

  async function handleSubmit() {
    const err = validateForm();
    if (err) { setError(err); return; }
    if (!form.oath_accepted) { setError("You must accept the oath to proceed."); return; }

    setStep("submitting");
    setError("");

    const appId = generateApplicationId();
    const referralCode = generateReferralCode(form.full_name, appId);

    try {
      const { error: dbError } = await supabase.from("applicants").insert({
        application_id: appId,
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        zip: form.zip.trim(),
        region: form.region,
        tier,
        membership_status: "pending",
        deposit_paid: false,
        pledge_paid: false,
        telegram_handle: form.telegram_handle.trim() || null,
        referred_by_code: form.referred_by_code.trim() || null,
        referral_code: referralCode,
        current_rank: tier === "alii" ? "Aliʻi Seated" : tier === "mana" ? "Mana Builder" : "Nā Koa Candidate",
        rank_points_total: 0,
        standing: "good",
      });

      if (dbError) throw dbError;

      // If referred, update referrer's count
      if (form.referred_by_code.trim()) {
        const { data: referrer } = await supabase
          .from("applicants")
          .select("id, referrals_count, referral_code")
          .eq("referral_code", form.referred_by_code.trim().toUpperCase())
          .single();

        if (referrer) {
          await supabase
            .from("applicants")
            .update({ referrals_count: (referrer.referrals_count || 0) + 1 })
            .eq("referral_code", form.referred_by_code.trim().toUpperCase());
        }
      }

      setApplicationId(appId);
      setStep("done");
      setTimeout(() => onComplete(appId), 2000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Submission failed. Please try again.";
      setError(msg);
      setStep("oath");
    }
  }

  if (step === "done") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#050709",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}>
        <div style={{ animation: "crestReveal 1.5s ease forwards" }}>
          <div style={{
            width: "64px",
            height: "64px",
            border: `1px solid ${cfg.color}`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <span style={{ color: cfg.color, fontSize: "1.5rem" }}>✦</span>
          </div>
        </div>
        <p className="font-cormorant" style={{ color: cfg.color, fontSize: "1.8rem", fontWeight: 300, marginBottom: "8px" }}>
          Pledge Received
        </p>
        <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.55rem", marginBottom: "16px" }}>
          Application ID: <span style={{ color: cfg.color }}>{applicationId}</span>
        </p>
        <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.55rem", lineHeight: 1.8, maxWidth: "280px" }}>
          Your pledge has been recorded.<br />
          XI will review your application.<br />
          Watch for contact within 48 hours.
        </p>
      </div>
    );
  }

  if (step === "submitting") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#050709",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: `1px solid ${cfg.color}`,
            borderTop: `1px solid transparent`,
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }} />
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em" }}>Recording your pledge...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050709",
      color: "#e8e0d0",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(176,142,80,0.1)",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "0.55rem", letterSpacing: "0.1em" }}
        >
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <p className="font-cormorant" style={{ color: GOLD, fontSize: "1rem", letterSpacing: "0.15em" }}>MĀKOA</p>
        </div>
        <span style={{
          background: `rgba(${tier === "alii" ? "176,142,80" : tier === "mana" ? "88,166,255" : "139,154,170"},0.1)`,
          border: `1px solid ${cfg.colorDim}`,
          color: cfg.color,
          fontSize: "0.45rem",
          padding: "3px 8px",
          borderRadius: "3px",
          letterSpacing: "0.1em",
        }}>{cfg.label}</span>
      </div>

      <div style={{ maxWidth: "440px", margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* Tier summary */}
        <div style={{
          background: `rgba(${tier === "alii" ? "176,142,80" : tier === "mana" ? "88,166,255" : "139,154,170"},0.05)`,
          border: `1px solid ${cfg.colorDim}`,
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "28px",
          animation: "fadeUp 0.6s ease forwards",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p className="font-cormorant" style={{ color: cfg.color, fontSize: "1.3rem", fontStyle: "italic" }}>{cfg.label}</p>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.48rem" }}>Pledge fee: {cfg.pledgeFee} · Deposit: {cfg.deposit} upon acceptance</p>
            </div>
            <p style={{ color: cfg.color, fontSize: "0.8rem", fontWeight: 500 }}>{cfg.price}</p>
          </div>
        </div>

        {step === "form" && (
          <div style={{ animation: "fadeUp 0.6s ease 0.1s both" }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>
              Your Information
            </p>

            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <label style={{ display: "block", color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>Full Name *</label>
                <input type="text" value={form.full_name} onChange={e => update("full_name", e.target.value)} placeholder="Your full name" autoComplete="name" />
              </div>
              <div>
                <label style={{ display: "block", color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>Email *</label>
                <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="your@email.com" autoComplete="email" />
              </div>
              <div>
                <label style={{ display: "block", color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>Phone *</label>
                <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="(808) 000-0000" autoComplete="tel" />
              </div>
              <div>
                <label style={{ display: "block", color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>ZIP Code</label>
                <input type="text" value={form.zip} onChange={e => update("zip", e.target.value)} placeholder="96701" autoComplete="postal-code" />
              </div>
              <div>
                <label style={{ display: "block", color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>Region *</label>
                <select value={form.region} onChange={e => update("region", e.target.value)} style={{ appearance: "none" }}>
                  <option value="">Select your region</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>Telegram Handle</label>
                <input type="text" value={form.telegram_handle} onChange={e => update("telegram_handle", e.target.value)} placeholder="@yourhandle" />
              </div>
              <div>
                <label style={{ display: "block", color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>Referred By (Code)</label>
                <input type="text" value={form.referred_by_code} onChange={e => update("referred_by_code", e.target.value.toUpperCase())} placeholder="XXXX-XXXX" />
              </div>
            </div>

            {error && <p style={{ color: "#e05c5c", fontSize: "0.52rem", marginTop: "12px" }}>{error}</p>}

            <button
              onClick={() => {
                const err = validateForm();
                if (err) { setError(err); return; }
                setError("");
                setStep("oath");
              }}
              style={{
                width: "100%",
                marginTop: "24px",
                padding: "14px",
                background: "transparent",
                border: `1px solid ${cfg.color}`,
                color: cfg.color,
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: "6px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Continue to Oath
            </button>
          </div>
        )}

        {step === "oath" && (
          <div style={{ animation: "fadeUp 0.6s ease forwards" }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>
              The Oath of Entry
            </p>

            <div style={{
              border: "1px solid rgba(176,142,80,0.15)",
              borderRadius: "8px",
              padding: "24px",
              marginBottom: "24px",
              background: "rgba(176,142,80,0.03)",
              textAlign: "center",
            }}>
              <p className="font-cormorant" style={{
                color: "rgba(232,224,208,0.8)",
                fontSize: "1.05rem",
                fontStyle: "italic",
                lineHeight: 2,
                fontWeight: 300,
              }}>
                &ldquo;E komo mai i lalo o ka Malu.<br />
                I enter under the Malu.<br />
                I serve before I am served.<br />
                I build what lasts.<br />
                I stand with my brothers<br />
                under every full moon.&rdquo;
              </p>
            </div>

            <div
              onClick={() => update("oath_accepted", !form.oath_accepted)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                cursor: "pointer",
                marginBottom: "24px",
                padding: "14px",
                border: `1px solid ${form.oath_accepted ? cfg.color : "rgba(255,255,255,0.08)"}`,
                borderRadius: "6px",
                background: form.oath_accepted ? `rgba(${tier === "alii" ? "176,142,80" : tier === "mana" ? "88,166,255" : "139,154,170"},0.05)` : "transparent",
                transition: "all 0.2s",
              }}
            >
              <div style={{
                width: "16px",
                height: "16px",
                border: `1px solid ${form.oath_accepted ? cfg.color : "rgba(255,255,255,0.2)"}`,
                borderRadius: "3px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1px",
              }}>
                {form.oath_accepted && <span style={{ color: cfg.color, fontSize: "0.6rem" }}>✓</span>}
              </div>
              <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.52rem", lineHeight: 1.6 }}>
                I accept this oath. I understand this is a private order. I enter with intention and stand by my word.
              </p>
            </div>

            {error && <p style={{ color: "#e05c5c", fontSize: "0.52rem", marginBottom: "12px" }}>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={!form.oath_accepted}
              style={{
                width: "100%",
                padding: "14px",
                background: form.oath_accepted ? "transparent" : "transparent",
                border: `1px solid ${form.oath_accepted ? cfg.color : "rgba(255,255,255,0.1)"}`,
                color: form.oath_accepted ? cfg.color : "rgba(255,255,255,0.2)",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: form.oath_accepted ? "pointer" : "not-allowed",
                borderRadius: "6px",
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: "10px",
              }}
            >
              Submit Pledge — {cfg.pledgeFee}
            </button>

            <button
              onClick={() => setStep("form")}
              style={{
                width: "100%",
                padding: "10px",
                background: "transparent",
                border: "none",
                color: GOLD_DIM,
                fontSize: "0.48rem",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              ← Edit Information
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
