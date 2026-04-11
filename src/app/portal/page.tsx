"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortalRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/portal/login");
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#04060a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#b08e50",
        fontSize: "0.85rem",
        letterSpacing: "0.1em",
      }}
    >
      ENTERING THE PORTAL...
    </div>
  );
}
