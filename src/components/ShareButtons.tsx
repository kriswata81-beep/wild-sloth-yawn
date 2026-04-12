"use client";

import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_20 = "rgba(176,142,80,0.2)";

interface ShareButtonsProps {
  url?: string;
  title?: string;
  text?: string;
}

export default function ShareButtons({
  url,
  title = "M\u0101koa Brotherhood",
  text = "West O\u02BBahu\u2019s Founding Order. A private brotherhood and training system.",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  function getShareUrl() {
    if (url) return url;
    if (typeof window !== "undefined") return window.location.href;
    return "";
  }

  async function handleCopyLink() {
    const shareUrl = getShareUrl();
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // silent fail
      }
    }
  }

  function handleFacebook() {
    const shareUrl = getShareUrl();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=400"
    );
  }

  function handleLinkedIn() {
    const shareUrl = getShareUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=400"
    );
  }

  function handleInstagram() {
    // Instagram doesn't have a web share URL; copy link for the user
    handleCopyLink();
  }

  const btnStyle: React.CSSProperties = {
    background: "transparent",
    border: `1px solid ${GOLD_20}`,
    borderRadius: 6,
    color: GOLD_DIM,
    cursor: "pointer",
    padding: "8px 10px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color 0.25s, color 0.25s, box-shadow 0.25s",
  };

  const btnHoverProps = {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = e.currentTarget;
      el.style.borderColor = GOLD;
      el.style.color = GOLD;
      el.style.boxShadow = "0 0 8px rgba(176,142,80,0.3)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = e.currentTarget;
      el.style.borderColor = GOLD_20;
      el.style.color = GOLD_DIM;
      el.style.boxShadow = "none";
    },
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          color: GOLD_DIM,
          fontSize: "0.45rem",
          letterSpacing: "0.15em",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        SHARE
      </span>

      {/* Instagram (copy link) */}
      <button
        onClick={handleInstagram}
        aria-label="Share on Instagram"
        style={btnStyle}
        {...btnHoverProps}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {/* Facebook */}
      <button
        onClick={handleFacebook}
        aria-label="Share on Facebook"
        style={btnStyle}
        {...btnHoverProps}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      </button>

      {/* LinkedIn */}
      <button
        onClick={handleLinkedIn}
        aria-label="Share on LinkedIn"
        style={btnStyle}
        {...btnHoverProps}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        aria-label="Copy link"
        style={btnStyle}
        {...btnHoverProps}
      >
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>
    </div>
  );
}
