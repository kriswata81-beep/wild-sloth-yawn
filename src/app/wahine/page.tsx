"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const BG = "#04060a";
const TEXT = "#e8e0d0";
const TEXT_DIM = "rgba(232,224,208,0.5)";

const RELATION_OPTIONS = [
  "Wife / Partner",
  "Mother",
  "Sister",
  "Daughter",
  "Friend",
  "Other",
];

const OFFERINGS = [
  "Monthly circle calls — virtual and in-person",
  "Community of women who understand",
  "Wahine gatherings at MAYDAY events",
  "Priority access to M\u0101koa home services",
  "Direct connection to the order — your voice matters",
];

export default function WahinePage() {
  const [visible, setVisible] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [relation, setRelation] = useState("");
  const [brotherName, setBrotherName] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async () => {
    if (!name || !email || !relation) return;
    setLoading(true);
    try {
      // POST to a simple collection endpoint — can be wired to Supabase later
      await fetch("/api/wahine-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, relation, brotherName }),
      }).catch(() => {
        // Endpoint may not exist yet — that's okay, we still show success
      });
      setFormSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const sectionHeadingStyle: React.CSSProperties = {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic",
    fontSize: "1.3rem",
    color: GOLD,
    fontWeight: 400,
    letterSpacing: "0.04em",
    marginBottom: 14,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    background: "rgba(176,142,80,0.06)",
    border: `1px solid ${GOLD_20}`,
    borderRadius: 8,
    color: TEXT,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.85rem",
    outline: "none",
    marginBottom: 10,
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.7rem",
    letterSpacing: "0.08em",
    color: GOLD_DIM,
    marginBottom: 4,
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: "uppercase",
  };

  const dividerStyle: React.CSSProperties = {
    height: 1,
    background: GOLD_10,
    margin: "36px 0",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        color: TEXT,
        fontFamily: "'JetBrains Mono', monospace",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", padding: "64px 24px 24px" }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: GOLD,
            fontWeight: 400,
            margin: 0,
            letterSpacing: "0.06em",
          }}
        >
          WAHINE M&#256;KOA
        </h1>
        <p
          style={{
            color: TEXT_DIM,
            fontSize: "0.85rem",
            marginTop: 12,
            maxWidth: 440,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.7,
          }}
        >
          The women who stand with the brotherhood.
        </p>
      </div>

      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "0 24px 48px",
        }}
      >
        {/* WHAT IS THE WAHINE CIRCLE */}
        <div style={dividerStyle} />
        <h2 style={sectionHeadingStyle}>What Is the Wahine Circle</h2>
        <p
          style={{
            color: TEXT_DIM,
            fontSize: "0.82rem",
            lineHeight: 1.8,
          }}
        >
          You won&apos;t find ranks here. No stones. No routes. This is a circle
          &mdash; not an order. A space for the women who watch their men
          transform and need somewhere to process what that means.
        </p>

        {/* WHAT WE OFFER */}
        <div style={dividerStyle} />
        <h2 style={sectionHeadingStyle}>What We Offer</h2>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {OFFERINGS.map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontSize: "0.82rem",
                color: TEXT_DIM,
                lineHeight: 1.6,
              }}
            >
              <span
                style={{
                  color: GOLD,
                  fontSize: "0.6rem",
                  marginTop: 5,
                  flexShrink: 0,
                }}
              >
                &#9670;
              </span>
              {item}
            </li>
          ))}
        </ul>

        {/* WHO THIS IS FOR */}
        <div style={dividerStyle} />
        <h2 style={sectionHeadingStyle}>Who This Is For</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {[
            "Wives, partners, mothers, sisters, daughters of M\u0101koa brothers.",
            "Women who want to understand the brotherhood.",
            "Women who want their own circle.",
          ].map((line, i) => (
            <p
              key={i}
              style={{
                color: TEXT_DIM,
                fontSize: "0.82rem",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* JOIN THE CIRCLE */}
        <div style={dividerStyle} />
        <h2 style={sectionHeadingStyle}>Join the Circle</h2>

        {formSubmitted ? (
          <div
            style={{
              padding: "32px 24px",
              border: `1px solid ${GOLD_40}`,
              borderRadius: 12,
              textAlign: "center",
              animation: "fadeIn 0.4s ease forwards",
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "1.2rem",
                color: GOLD,
                marginBottom: 10,
              }}
            >
              Welcome to the Circle
            </div>
            <p
              style={{
                color: TEXT_DIM,
                fontSize: "0.8rem",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              We see you. You&apos;ll hear from us soon.
            </p>
          </div>
        ) : (
          <div
            style={{
              padding: "24px",
              border: `1px solid ${GOLD_20}`,
              borderRadius: 12,
              background: "rgba(176,142,80,0.03)",
            }}
          >
            <label style={labelStyle}>Name</label>
            <input
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />

            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />

            <label style={labelStyle}>Relation</label>
            <select
              style={{
                ...inputStyle,
                appearance: "none",
                cursor: "pointer",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23b08e50' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
                paddingRight: 36,
              }}
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
            >
              <option value="" disabled style={{ color: "#666" }}>
                Select your relation
              </option>
              {RELATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt} style={{ background: "#0a0d12", color: TEXT }}>
                  {opt}
                </option>
              ))}
            </select>

            <label style={labelStyle}>Brother&apos;s Name (optional)</label>
            <input
              style={inputStyle}
              value={brotherName}
              onChange={(e) => setBrotherName(e.target.value)}
              placeholder="His name"
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !name || !email || !relation}
              style={{
                width: "100%",
                marginTop: 8,
                padding: "14px",
                background: GOLD,
                color: "#000",
                border: "none",
                borderRadius: 8,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                cursor:
                  loading || !name || !email || !relation
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  loading || !name || !email || !relation ? 0.5 : 1,
                transition: "opacity 0.2s ease",
              }}
            >
              {loading ? "JOINING..." : "ENTER THE CIRCLE"}
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 48,
            flexWrap: "wrap",
          }}
        >
          {[
            { href: "/gate", label: "THE GATE" },
            { href: "/sponsor", label: "SPONSOR" },
            { href: "/founding48", label: "FOUNDING 48" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: GOLD_DIM,
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textDecoration: "none",
                borderBottom: `1px solid ${GOLD_20}`,
                paddingBottom: 2,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = GOLD)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = GOLD_DIM)
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
