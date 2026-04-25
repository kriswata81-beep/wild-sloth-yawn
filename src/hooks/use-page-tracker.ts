"use client";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePageTracker(page: string) {
  useEffect(() => {
    const ref_code = new URLSearchParams(window.location.search).get("ref") || "direct";
    supabase.from("page_views").insert({
      page,
      ref_code,
      user_agent: navigator.userAgent,
    }).then(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
