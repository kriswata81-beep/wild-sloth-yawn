import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
// Service role key bypasses RLS — kept server-side, never sent to client
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps";

export async function GET() {
  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

    const [appsRes, newsRes, alertsRes, checkinsRes] = await Promise.all([
      sb.from("steward_applications").select("*").order("xi_score", { ascending: false }).limit(50),
      sb.from("cluster_news").select("*").order("created_at", { ascending: false }).limit(30),
      sb.from("cluster_911").select("*").order("created_at", { ascending: false }).limit(20),
      sb.from("cluster_checkins").select("check_in_date").order("check_in_date", { ascending: false }).limit(200),
    ]);

    return NextResponse.json({
      apps: appsRes.data || [],
      news: newsRes.data || [],
      alerts: alertsRes.data || [],
      checkins: checkinsRes.data || [],
      errors: {
        apps: appsRes.error?.message || null,
        news: newsRes.error?.message || null,
        alerts: alertsRes.error?.message || null,
        checkins: checkinsRes.error?.message || null,
      },
    });
  } catch (err) {
    console.error("cluster-data route error:", err);
    return NextResponse.json({ apps: [], news: [], alerts: [], checkins: [], errors: {} }, { status: 500 });
  }
}
