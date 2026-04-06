"use client";
import { useState, useEffect } from "react";
import KeyPage from "@/components/KeyPage";
import GatePage from "@/components/GatePage";
import PledgePage from "@/components/PledgePage";
import UnderReviewPage from "@/components/UnderReviewPage";
import PortalLogin from "@/components/PortalLogin";
import MemberPortal from "@/components/MemberPortal";
import AdminPage from "@/components/AdminPage";

type Screen =
  | "key"
  | "gate"
  | "pledge"
  | "under_review"
  | "portal_login"
  | "portal"
  | "admin";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("key");
  const [selectedTier, setSelectedTier] = useState<"nakoa" | "mana" | "alii">("nakoa");
  const [applicationId, setApplicationId] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [reviewReason, setReviewReason] = useState<"not_eligible" | "pending" | "suspended">("pending");

  // Check URL hash for admin or portal
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#admin") {
      setScreen("admin");
      window.location.hash = "";
    } else if (hash === "#portal") {
      setScreen("portal_login");
      window.location.hash = "";
    }
  }, []);

  function handleKeyEnter() {
    // Check if admin unlock was triggered
    if (window.location.hash === "#admin") {
      setScreen("admin");
      window.location.hash = "";
      return;
    }
    const name = sessionStorage.getItem("makoa_name") || "";
    const phone = sessionStorage.getItem("makoa_phone") || "";
    setVisitorName(name);
    setVisitorPhone(phone);
    setScreen("gate");
  }

  function handlePledge(tier: "nakoa" | "mana" | "alii") {
    setSelectedTier(tier);
    setScreen("pledge");
  }

  function handlePledgeComplete(appId: string) {
    setApplicationId(appId);
    setReviewReason("pending");
    setScreen("under_review");
  }

  function handlePortalAccess(appId: string) {
    if (appId === "__not_eligible__") {
      setReviewReason("not_eligible");
      setScreen("under_review");
      return;
    }
    setApplicationId(appId);
    setScreen("portal");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#050709" }}>
      {screen === "key" && (
        <KeyPage onEnter={handleKeyEnter} />
      )}

      {screen === "gate" && (
        <GatePage
          visitorName={visitorName}
          onPledge={handlePledge}
        />
      )}

      {screen === "pledge" && (
        <PledgePage
          tier={selectedTier}
          prefillName={visitorName}
          prefillPhone={visitorPhone}
          onComplete={handlePledgeComplete}
          onBack={() => setScreen("gate")}
        />
      )}

      {screen === "under_review" && (
        <UnderReviewPage
          applicationId={applicationId || undefined}
          reason={reviewReason}
        />
      )}

      {screen === "portal_login" && (
        <PortalLogin
          onAccess={handlePortalAccess}
          onBack={() => setScreen("gate")}
        />
      )}

      {screen === "portal" && applicationId && (
        <MemberPortal
          applicationId={applicationId}
          onExit={() => setScreen("gate")}
        />
      )}

      {screen === "admin" && (
        <AdminPage
          onExit={() => setScreen("gate")}
        />
      )}

      {/* Portal access link — subtle, bottom of gate */}
      {screen === "gate" && (
        <div style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 50,
        }}>
          <button
            onClick={() => setScreen("portal_login")}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(176,142,80,0.2)",
              fontSize: "0.42rem",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.1em",
            }}
          >
            Member Portal →
          </button>
        </div>
      )}
    </main>
  );
}
