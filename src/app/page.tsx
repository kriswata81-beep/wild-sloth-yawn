"use client";

import { useState } from "react";
import KeyPage from "@/components/KeyPage";
import GatePage from "@/components/GatePage";
import PledgePage, { PledgeData } from "@/components/PledgePage";
import UnderReviewPage from "@/components/UnderReviewPage";
import AcceptancePage from "@/components/AcceptancePage";
import PaymentPage from "@/components/PaymentPage";
import SeatSecuredPage from "@/components/SeatSecuredPage";

type Screen =
  | "key"
  | "gate"
  | "pledge"
  | "review"
  | "acceptance"
  | "payment"
  | "secured";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("key");
  const [handle, setHandle] = useState("");
  const [phone, setPhone] = useState("");
  const [pledgeData, setPledgeData] = useState<PledgeData | null>(null);
  const [selectedTier, setSelectedTier] = useState<"alii" | "mana" | "nakoa">("nakoa");

  const handlePledgeSubmit = (data: PledgeData) => {
    console.log("🌕 Mākoa Pledge Submitted:", data);
    setPledgeData(data);
    setScreen("review");
  };

  const handleTierSelect = (tier: "alii" | "mana" | "nakoa") => {
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
        />
      )}

      {screen === "gate" && (
        <GatePage
          handle={handle}
          phone={phone}
          onConfirm={() => setScreen("pledge")}
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
          onPaid={() => setScreen("secured")}
          onBack={() => setScreen("acceptance")}
        />
      )}

      {screen === "secured" && (
        <SeatSecuredPage
          tier={selectedTier}
          name={pledgeData?.name || handle}
        />
      )}
    </>
  );
}
