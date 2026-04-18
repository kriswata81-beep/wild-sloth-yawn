import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps";

// GET /api/cluster/news?zip=96792
// Returns approved, non-expired 411 news for a zip cluster
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zip = searchParams.get("zip");

  if (!zip) {
    return NextResponse.json({ error: "zip is required" }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data, error } = await supabase
    .from("cluster_news")
    .select("id, headline, body, source_name, category, published_at")
    .eq("zip_cluster", zip)
    .eq("is_approved", true)
    .gt("expires_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(20);

  if (error) {
    // Table may not exist yet — return empty array gracefully
    console.error("cluster_news query error:", error.message);
    return NextResponse.json({ news: [] });
  }

  return NextResponse.json({ news: data || [] });
}

// POST /api/cluster/news — submit a news item (Steward approves before publish)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { zip, headline, body: newsBody, source_name, category } = body;

    if (!zip || !headline) {
      return NextResponse.json({ error: "zip and headline are required" }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data, error } = await supabase
      .from("cluster_news")
      .insert({
        zip_cluster: zip,
        headline,
        body: newsBody || null,
        source_name: source_name || "Brother submission",
        category: category || "community",
        is_approved: false,
      })
      .select("id")
      .single();

    if (error) {
      console.error("cluster_news insert error:", error.message);
      return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("cluster news POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
