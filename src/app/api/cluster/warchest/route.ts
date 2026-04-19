import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps";

// GET /api/cluster/warchest?zip=96792
// Returns total pledged + recent pledges for a cluster
export async function GET(req: NextRequest) {
  const zip = new URL(req.url).searchParams.get("zip");
  if (!zip) return NextResponse.json({ error: "zip required" }, { status: 400 });

  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await sb
    .from("cluster_warchest")
    .select("contributor_handle, contributor_tier, amount, purpose, status, created_at")
    .eq("zip_cluster", zip)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ total: 0, count: 0, pledges: [] });

  const pledges = data || [];
  const total = pledges.reduce((s, p) => s + Number(p.amount || 0), 0);

  return NextResponse.json({ total, count: pledges.length, pledges });
}

// POST /api/cluster/warchest
// Body: { zip, handle, tier?, amount, purpose?, notes? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { zip, handle, tier, amount, purpose, notes } = body;

    if (!zip || !handle || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "zip, handle, and amount required" }, { status: 400 });
    }

    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data, error } = await sb
      .from("cluster_warchest")
      .insert({
        zip_cluster: zip,
        contributor_handle: handle,
        contributor_tier: tier || null,
        amount: Number(amount),
        currency: "USD",
        purpose: purpose || "General",
        status: "pledged",
        notes: notes || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("warchest insert error:", error.message);
      return NextResponse.json({ error: "Failed to record pledge" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error("warchest POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
