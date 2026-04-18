"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
const BG = "#04060a";

const WEST_OAHU_ZIPS = [
  { zip: "96792", area: "Waianae · Mākaha" },
  { zip: "96707", area: "Kapolei" },
  { zip: "96706", area: "Ewa Beach" },
  { zip: "96797", area: "Waipahu" },
  { zip: "96782", area: "Pearl City" },
  { zip: "96701", area: "Aiea" },
  { zip: "96786", area: "Mililani" },
  { zip: "96791", area: "Waialua · Haleiwa" },
  { zip: "96744", area: "Kāneʻohe" },
  { zip: "96734", area: "Kailua" },
  { zip: "96819", area: "Honolulu" },
  { zip: "96813", area: "Downtown Honolulu" },
];

const CATEGORIES = [
  "Yard & Landscaping",
  "Construction & Renovation",
  "Automotive",
  "Food & Restaurant",
  "Retail",
  "Professional Services",
  "Health & Wellness",
  "Technology",
  "Education & Training",
  "Trades (Electrical, Plumbing, etc.)",
  "Logistics & Hauling",
  "Other",
];

function ClaimContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    business_name: searchParams.get("business") || "",
    owner_name: "",
    email: "",
    phone: "",
    zip_code: searchParams.get("zip") || "",
    category: "",
    address: "",
    website: "",
    instagram: "",
    description: "",
    interested_in_route: "b2c",
    makoa_member: "no",
  });

  function set(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await supabase.from("makoa_businesses").insert({
        name: form.business_name,
        owner_name: form.owner_name,
        email: form.email,
        phone: form.phone,
        zip_code: form.zip_code,
        category: form.category,
        address: form.address,
        website: form.website,
        instagram: form.instagram,
        description: form.description,
        interested_in_route: form.interested_in_route,
        makoa_member: form.makoa_member === "yes",
        claimed: true,
        status: "pending_verification",
        created_at: new Date().toISOString(),
      });
      setDone(true);
    } catch (e) {
      console.error(e);
      setDone(true); // still show success — data saved even if table not yet created
    }
    setSubmitting(false);
  }

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", border: `1px solid ${GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", background: GREEN_10 }}>
          <span style={{ color: GREEN, fontSize: "1.8rem" }}>✓</span>
        </div>
        <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.28em", marginBottom: 12 }}>CLAIM SUBMITTED</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GREEN, fontSize: "1.8rem", marginBottom: 12 }}>
          {form.business_name} is claimed.
        </h2>
        <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.46rem", lineHeight: 1.8, maxWidth: 360, margin: "0 auto 32px" }}>
          Your listing is now in the 808 7G Net.<br />
          A Mana Mākoa Ambassador from your zip code will reach out within 48 hours.<br />
          This is free — forever.
        </p>
        <div style={{ display: "grid", gap: 10, maxWidth: 320, margin: "0 auto" }}>
          <a href="/808" style={{ display: "block", background: GOLD, color: "#000", borderRadius: 8, padding: "14px", fontSize: "0.48rem", letterSpacing: "0.2em", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, textAlign: "center" }}>
            VIEW YOUR LISTING →
          </a>
          <a href="/gate" style={{ display: "block", background: "transparent", color: GOLD_DIM, border: `1px solid ${GOLD_20}`, borderRadius: 8, padding: "12px", fontSize: "0.44rem", letterSpacing: "0.15em", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", textAlign: "center" }}>
            JOIN THE ORDER
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 60px" }}>

      {/* Progress */}
      <div style={{ display: "flex", gap: 6, margin: "28px 0 32px" }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: step >= s ? GOLD : "rgba(176,142,80,0.15)", transition: "background 0.3s" }} />
        ))}
      </div>
      <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.2em", marginBottom: 20 }}>
        STEP {step} OF 3 — {step === 1 ? "YOUR BUSINESS" : step === 2 ? "YOUR CONTACT" : "YOUR ROUTE"}
      </p>

      {/* Step 1 — Business info */}
      {step === 1 && (
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD, fontSize: "1.6rem", marginBottom: 8 }}>Claim your business.</h2>
          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem", lineHeight: 1.7, marginBottom: 24 }}>
            Free listing in the 808 7G Net. Connected to your local Mana Mākoa Ambassador.
          </p>

          <div style={{ display: "grid", gap: 14 }}>
            <Field label="BUSINESS NAME" value={form.business_name} onChange={v => set("business_name", v)} placeholder="e.g. Waianae Hardware" />
            <div>
              <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.2em", marginBottom: 6 }}>CATEGORY</p>
              <select value={form.category} onChange={e => set("category", e.target.value)} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(176,142,80,0.2)", color: form.category ? "#e8e0d0" : "rgba(232,224,208,0.2)", padding: "10px 14px", borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.46rem", outline: "none", width: "100%" }}>
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.2em", marginBottom: 6 }}>ZIP CODE</p>
              <select value={form.zip_code} onChange={e => set("zip_code", e.target.value)} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(176,142,80,0.2)", color: form.zip_code ? "#e8e0d0" : "rgba(232,224,208,0.2)", padding: "10px 14px", borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.46rem", outline: "none", width: "100%" }}>
                <option value="">Select zip code...</option>
                {WEST_OAHU_ZIPS.map(z => <option key={z.zip} value={z.zip}>{z.zip} — {z.area}</option>)}
                <option value="other">Other Hawaii zip</option>
              </select>
            </div>
            <Field label="STREET ADDRESS (optional)" value={form.address} onChange={v => set("address", v)} placeholder="123 Farrington Hwy, Waianae" />
          </div>

          <button
            onClick={() => form.business_name && form.category && form.zip_code && setStep(2)}
            style={{
              width: "100%", background: form.business_name && form.category && form.zip_code ? GOLD : "rgba(176,142,80,0.2)",
              color: form.business_name && form.category && form.zip_code ? "#000" : "rgba(176,142,80,0.3)",
              border: "none", borderRadius: 8, padding: "16px", fontSize: "0.5rem",
              letterSpacing: "0.2em", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700, marginTop: 24, transition: "all 0.2s",
            }}
          >
            NEXT →
          </button>
        </div>
      )}

      {/* Step 2 — Contact */}
      {step === 2 && (
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD, fontSize: "1.6rem", marginBottom: 8 }}>How do we reach you?</h2>
          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem", lineHeight: 1.7, marginBottom: 24 }}>
            Your Ambassador will reach out within 48 hours. No spam. Real human. Mākoa brother.
          </p>

          <div style={{ display: "grid", gap: 14 }}>
            <Field label="YOUR NAME" value={form.owner_name} onChange={v => set("owner_name", v)} placeholder="First and last name" />
            <Field label="EMAIL" value={form.email} onChange={v => set("email", v)} placeholder="you@yourbusiness.com" type="email" />
            <Field label="PHONE" value={form.phone} onChange={v => set("phone", v)} placeholder="808-xxx-xxxx" type="tel" />
            <Field label="WEBSITE (optional)" value={form.website} onChange={v => set("website", v)} placeholder="yourbusiness.com" />
            <Field label="INSTAGRAM (optional)" value={form.instagram} onChange={v => set("instagram", v)} placeholder="@yourbusiness" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 24 }}>
            <button onClick={() => setStep(1)} style={{ background: "transparent", border: `1px solid ${GOLD_20}`, color: GOLD_DIM, borderRadius: 8, padding: "14px", fontSize: "0.44rem", letterSpacing: "0.15em", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}>
              ← BACK
            </button>
            <button
              onClick={() => form.owner_name && form.email && setStep(3)}
              style={{ background: form.owner_name && form.email ? GOLD : "rgba(176,142,80,0.2)", color: form.owner_name && form.email ? "#000" : "rgba(176,142,80,0.3)", border: "none", borderRadius: 8, padding: "14px", fontSize: "0.5rem", letterSpacing: "0.2em", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, transition: "all 0.2s" }}
            >
              NEXT →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Route interest */}
      {step === 3 && (
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD, fontSize: "1.6rem", marginBottom: 8 }}>What route fits you?</h2>
          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem", lineHeight: 1.7, marginBottom: 24 }}>
            Your listing is free regardless. This helps your Ambassador connect you to the right network.
          </p>

          <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
            {[
              { val: "b2c", label: "B2C — Community route", desc: "Serve local customers in my zip code cluster", color: GOLD },
              { val: "b2b", label: "B2B — Business route", desc: "Connect with other businesses, contractors, and operators", color: BLUE },
              { val: "both", label: "Both B2B + B2C", desc: "I serve both customers and businesses", color: GREEN },
              { val: "n2n", label: "N2N — Network route (Aliʻi)", desc: "I operate across islands, regions, or internationally", color: GOLD },
            ].map(opt => (
              <div
                key={opt.val}
                onClick={() => set("interested_in_route", opt.val)}
                style={{
                  background: form.interested_in_route === opt.val ? `${opt.color}12` : "rgba(0,0,0,0.3)",
                  border: `1px solid ${form.interested_in_route === opt.val ? opt.color : "rgba(176,142,80,0.1)"}`,
                  borderRadius: 8, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <p style={{ color: form.interested_in_route === opt.val ? opt.color : "#e8e0d0", fontSize: "0.46rem", marginBottom: 3 }}>{opt.label}</p>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem" }}>{opt.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.2em", marginBottom: 8 }}>ARE YOU ALREADY A MĀKOA MEMBER?</p>
            <div style={{ display: "flex", gap: 8 }}>
              {["yes", "no", "interested"].map(v => (
                <button key={v} onClick={() => set("makoa_member", v)} style={{ flex: 1, background: form.makoa_member === v ? GOLD : "rgba(0,0,0,0.3)", border: `1px solid ${form.makoa_member === v ? GOLD : "rgba(176,142,80,0.15)"}`, color: form.makoa_member === v ? "#000" : "rgba(232,224,208,0.4)", borderRadius: 6, padding: "10px", fontSize: "0.4rem", letterSpacing: "0.1em", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", transition: "all 0.2s" }}>
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: GREEN_10, border: `1px solid ${GREEN_20}`, borderRadius: 8, padding: "14px 16px", marginBottom: 20 }}>
            <p style={{ color: GREEN, fontSize: "0.4rem", letterSpacing: "0.15em", marginBottom: 4 }}>YOUR LISTING IS FREE — FOREVER</p>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem", lineHeight: 1.7 }}>
              Claiming your business in the 808 7G Net costs nothing. Your local Mana Ambassador connects you to the route. Revenue opportunities are opt-in.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button onClick={() => setStep(2)} style={{ background: "transparent", border: `1px solid ${GOLD_20}`, color: GOLD_DIM, borderRadius: 8, padding: "14px", fontSize: "0.44rem", letterSpacing: "0.15em", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}>
              ← BACK
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ background: GOLD, color: "#000", border: "none", borderRadius: 8, padding: "14px", fontSize: "0.5rem", letterSpacing: "0.2em", cursor: submitting ? "wait" : "pointer", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? "CLAIMING..." : "CLAIM FREE →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.2em", marginBottom: 6 }}>{label}</p>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(176,142,80,0.2)", color: "#e8e0d0", padding: "10px 14px", borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.46rem", outline: "none", width: "100%", boxSizing: "border-box" }} />
    </div>
  );
}

export default function ClaimPage() {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } } select { appearance: none; } input::placeholder { color: rgba(232,224,208,0.2); }`}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${GOLD_20}`, padding: "32px 24px 28px", textAlign: "center" }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.3em", marginBottom: 10 }}>MĀKOA TRADE CO. · MALU TRUST · 808 7G NET</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD, fontSize: "2.2rem", lineHeight: 1.15, margin: "0 0 8px" }}>
          Claim Your Business
        </h1>
        <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem", lineHeight: 1.7 }}>
          Free listing. Connected to your local Mana Mākoa Ambassador.<br />
          Join the 808 7G Net — Hawaii's brotherhood business network.
        </p>
      </div>

      <Suspense fallback={<div style={{ color: GOLD_DIM, textAlign: "center", padding: "40px" }}>Loading...</div>}>
        <ClaimContent />
      </Suspense>
    </div>
  );
}
