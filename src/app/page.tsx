"use client";

import { useState, useEffect } from "react";
import KeyPage from "@/components/KeyPage";
import GatePage from "@/components/GatePage";
import PledgePage, { PledgeData } from "@/components/PledgePage";
import UnderReviewPage from "@/components/UnderReviewPage";
import AcceptancePage from "@/components/AcceptancePage";
import PaymentPage from "@/components/PaymentPage";
import SeatSecuredPage from "@/components/SeatSecuredPage";
import AdminPage from "@/components/AdminPage";
import { generateApplicationId, zipToRegion, type Tier } from "@/lib/makoa";

type Screen =
  | "key"
  | "gate"
  | "pledge"
  | "review"
  | "acceptance"
  | "payment"
  | "secured"
  | "admin";

// Secret admin key sequence: tap nav logo 5 times
function useAdminUnlock(onUnlock: () => void) {
  const [taps, setTaps] = useState(0);
  const [lastTap, setLastTap] = useState(0);

  const tap = () => {
    const now = Date.now();
    if (now - lastTap > 2000) {
      setTaps(1);
    } else {
      const next = taps + 1;
      setTaps(next);
      if (next >= 5) {
        setTaps(0);
        onUnlock();
      }
    }
    setLastTap(now);
  };

  return tap;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("key");
  const [handle, setHandle] = useState("");
  const [phone, setPhone] = useState("");
  const [pledgeData, setPledgeData] = useState<PledgeData | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier>("nakoa");
  const [applicationId] = useState(() => generateApplicationId());

  // Check URL params for post-Stripe redirect
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tierParam = params.get("tier") as Tier | null;
    const screenParam = params.get("screen");

    if (screenParam === "secured" && tierParam) {
      setSelectedTier(tierParam);
      setScreen("secured");
    } else if (screenParam === "review") {
      setScreen("review");
    }
  }, []);

  const adminTap = useAdminUnlock(() => setScreen("admin"));

  const handlePledgeSubmit = (data: PledgeData) => {
    console.log("🌕 Mākoa Pledge Submitted:", {
      ...data,
      applicationId,
      region: zipToRegion(data.zip),
      timestamp: new Date().toISOString(),
    });
    setPledgeData(data);
    setScreen("review");
  };

  const handleTierSelect = (tier: Tier) => {
    setSelectedTier(tier);
    setScreen("payment");
  };

  return (
    <>
      {screen === "key" && (
        <KeyPage
          handle={handle}
          phone={phone}
          onHandleChange={setHandle}
          onPhoneChange={setPhone}
          onEnter={() => setScreen("gate")}
          onLogoTap={adminTap}
        />
      )}

      {screen === "gate" && (
        <GatePage
          handle={handle}
          phone={phone}
          onConfirm={() => setScreen("pledge")}
          onLogoTap={adminTap}
        />
      )}

      {screen === "pledge" && (
        <PledgePage
          handle={handle}
          phone={phone}
          onSubmit={handlePledgeSubmit}
          onBack={() => setScreen("gate")}
        />
      )}

      {screen === "review" && (
        <UnderReviewPage
          name={pledgeData?.name || handle}
          onAccepted={() => setScreen("acceptance")}
        />
      )}

      {screen === "acceptance" && (
        <AcceptancePage
          name={pledgeData?.name || handle}
          onSelectTier={handleTierSelect}
        />
      )}

      {screen === "payment" && (
        <PaymentPage
          tier={selectedTier}
          name={pledgeData?.name || handle}
          email={pledgeData?.email || ""}
          applicationId={applicationId}
          onPaid={() => setScreen("secured")}
          onBack={() => setScreen("acceptance")}
        />
      )}

      {screen === "secured" && (
        <SeatSecuredPage
          tier={selectedTier}
          name={pledgeData?.name || handle}
          zip={pledgeData?.zip || ""}
          applicationId={applicationId}
        />
      )}

      {screen === "admin" && (
        <AdminPage onExit={() => setScreen("gate")} />
      )}
    </>
  );
}
