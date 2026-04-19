import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
// Service role key — never sent to client
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps";

// PATCH /api/steward/action
// Body: { table, id, data }
// Allowed tables are restricted to steward cluster tables
const ALLOWED_TABLES = ["steward_applications", "cluster_news", "cluster_911"];

export async function PATCH(req: NextRequest) {
  try {
    const { table, id, data } = await req.json();

    if (!table || !id || !data) {
      return NextResponse.json({ error: "table, id, and data are required" }, { status: 400 });
    }
    if (!ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: "Table not allowed" }, { status: 403 });
    }

    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { error } = await sb.from(table).update(data).eq("id", id);

    if (error) {
      console.error("steward action error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("steward action route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
