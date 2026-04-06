"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PledgePage from "@/components/PledgePage";

function PledgeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tierParam = searchParams.get("tier") as "nakoa" | "mana" | "alii" | null;
  const tier = tierParam && ["nakoa", "mana", "alii"].includes(tierParam) ? tierParam : "nakoa";

  const prefillName = typeof window !== "undefined" ? sessionStorage.getItem("makoa_handle") || "" : "";
  const prefillPhone = typeof window !== "undefined" ? sessionStorage.getItem("makoa_phone") || "" : "";

  function handleComplete(applicationId: string) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("makoa_app_id", applicationId);
    }
    router.push("/portal/login");
  }

  function handleBack() {
    router.push("/gate");
  }

  return (
    <PledgePage
      tier={tier}
      prefillName={prefillName}
      prefillPhone={prefillPhone}
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
}

export default function PledgePageRoute() {
  return (
    <Suspense fallback={null}>
      <PledgeContent />
    </Suspense>
  );
}
