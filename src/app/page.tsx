"use client";

import { useState } from "react";
import KeyPage from "@/components/KeyPage";
import GatePage from "@/components/GatePage";
import ConfirmPage from "@/components/ConfirmPage";

type Screen = "key" | "gate" | "confirm";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("key");
  const [handle, setHandle] = useState("");
  const [phone, setPhone] = useState("");

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
          onConfirm={() => setScreen("confirm")}
        />
      )}
      {screen === "confirm" && (
        <ConfirmPage handle={handle} />
      )}
    </>
  );
}
