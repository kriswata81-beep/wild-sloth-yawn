import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps";

// POST /api/cluster/checkin
// Records daily check-in. Returns current streak.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { zip, handle } = body;

    if (!zip || !handle) {
      return NextResponse.json({ error: "zip and handle are required" }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Check if already checked in today
    const { data: existing } = await supabase
      .from("cluster_checkins")
      .select("id, streak_days")
      .eq("brother_handle", handle)
      .eq("check_in_date", today)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        already_checked_in: true,
        streak: existing.streak_days,
        message: "Already checked in today.",
      });
    }

    // Get yesterday's streak to compute continuation
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const { data: prevCheckin } = await supabase
      .from("cluster_checkins")
      .select("streak_days")
      .eq("brother_handle", handle)
      .eq("check_in_date", yesterdayStr)
      .single();

    const newStreak = prevCheckin ? prevCheckin.streak_days + 1 : 1;

    // Insert today's check-in
    const { error } = await supabase
      .from("cluster_checkins")
      .insert({
        zip_cluster: zip,
        brother_handle: handle,
        check_in_date: today,
        checked_in_at: new Date().toISOString(),
        streak_days: newStreak,
      });

    if (error) {
      if (error.code === "23505") {
        // Unique constraint — already checked in (race condition)
        return NextResponse.json({ success: true, already_checked_in: true, streak: 1 });
      }
      console.error("checkin insert error:", error.message);
      return NextResponse.json({ error: "Failed to check in" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      already_checked_in: false,
      streak: newStreak,
      message: newStreak > 1 ? `${newStreak}-day streak. Brotherhood strong.` : "First check-in. Welcome, brother.",
    });

  } catch (err) {
    console.error("checkin POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/cluster/checkin?zip=96792 — total check-ins for a cluster today
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zip = searchParams.get("zip");

  if (!zip) return NextResponse.json({ error: "zip required" }, { status: 400 });

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const today = new Date().toISOString().split("T")[0];

  const { count } = await supabase
    .from("cluster_checkins")
    .select("id", { count: "exact", head: true })
    .eq("zip_cluster", zip)
    .eq("check_in_date", today);

  return NextResponse.json({ zip, date: today, checkins_today: count || 0 });
}
