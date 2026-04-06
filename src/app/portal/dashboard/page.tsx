"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MemberPortal from "@/components/MemberPortal";

export default function PortalDashboardPage() {
  const router = useRouter();
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = sessionStorage.getItem("makoa_app_id");
      if (!id) {
        router.replace("/portal/login");
      } else {
        setApplicationId(id);
      }
    }
  }, [router]);

  function handleExit() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("makoa_app_id");
    }
    router.push("/gate");
  }

  if (!applicationId) return null;

  return <MemberPortal applicationId={applicationId} onExit={handleExit} />;
}
