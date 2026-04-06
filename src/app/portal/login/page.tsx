"use client";
import { useRouter } from "next/navigation";
import PortalLogin from "@/components/PortalLogin";

export default function PortalLoginPage() {
  const router = useRouter();

  function handleAccess(applicationId: string) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("makoa_app_id", applicationId);
    }
    router.push("/portal/dashboard");
  }

  function handleBack() {
    router.push("/gate");
  }

  return <PortalLogin onAccess={handleAccess} onBack={handleBack} />;
}
