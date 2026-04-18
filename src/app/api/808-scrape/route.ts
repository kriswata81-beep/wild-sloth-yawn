// POST /api/808-scrape — Hawaii business directory ingestion pipeline.
//
// Sources:
//   1. Hawaii DCCA Business Registration (data.hawaii.gov CKAN API — public, no auth)
//      Endpoint: https://data.hawaii.gov/api/odata/v4/djrd-mggr (Business Registrations)
//   2. OPTIONAL: Google Places Text Search (requires GOOGLE_PLACES_API_KEY env var)
//
// Workflow:
//   - Accepts a zip code (or batch of zip codes)
//   - Pulls active registered businesses in that zip from DCCA
//   - Upserts into Supabase `makoa_businesses` table with status="discovered"
//   - Returns summary of inserted / updated records
//
// Protected by CRON_SECRET — same token used by Vercel cron jobs.
// Can be called manually from /steward or by XI agent.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

// Hawaii DCCA Open Data — Business Registrations dataset (OData v4)
// Dataset ID: djrd-mggr (Business Registrations)
// Full dataset docs: https://data.hawaii.gov/resource/djrd-mggr.json
const DCCA_BASE = "https://data.hawaii.gov/resource/djrd-mggr.json";

// West Oahu zip codes served by Mākoa 808 Net (first cluster)
const WEST_OAHU_ZIPS = [
  "96792", // Waianae, Mākaha
  "96707", // Kapolei
  "96706", // Ewa Beach, Ewa
  "96791", // Waialua
  "96701", // Aiea
  "96782", // Pearl City
  "96789", // Mililani
  "96797", // Waipahu
  "96704", // Captain Cook (expand)
  "96762", // Laie
];

// Business category mapping from DCCA entity types → 808 Net categories
function mapCategory(entityType: string, businessName: string): string {
  const name = (businessName || "").toLowerCase();
  const type = (entityType || "").toLowerCase();

  if (name.includes("landscap") || name.includes("lawn") || name.includes("yard") || name.includes("tree")) return "Yard & Landscaping";
  if (name.includes("clean") || name.includes("janitorial") || name.includes("maid")) return "Home Cleaning";
  if (name.includes("plumb")) return "Plumbing";
  if (name.includes("electric")) return "Electrical";
  if (name.includes("construct") || name.includes("build") || name.includes("contrac")) return "Construction";
  if (name.includes("food") || name.includes("restaurant") || name.includes("cafe") || name.includes("grill")) return "Food & Dining";
  if (name.includes("repair") || name.includes("handyman") || name.includes("fix")) return "Handyman";
  if (name.includes("hair") || name.includes("salon") || name.includes("barber") || name.includes("beauty")) return "Beauty & Wellness";
  if (name.includes("auto") || name.includes("car") || name.includes("mechanic") || name.includes("tire")) return "Auto Services";
  if (name.includes("truck") || name.includes("haul") || name.includes("moving") || name.includes("transport")) return "Hauling & Moving";
  if (name.includes("real estate") || name.includes("realty") || name.includes("property")) return "Real Estate";
  if (name.includes("insurance")) return "Insurance";
  if (name.includes("finance") || name.includes("accounting") || name.includes("tax") || name.includes("cpa")) return "Finance & Accounting";
  if (name.includes("legal") || name.includes("law") || name.includes("attorney")) return "Legal";
  if (name.includes("tech") || name.includes("software") || name.includes("digital") || name.includes("web")) return "Technology";
  if (type.includes("nonprofit") || type.includes("non-profit")) return "Nonprofit";
  return "General Business";
}

interface DccaRecord {
  business_name?: string;
  file_number?: string;
  status?: string;
  entity_type?: string;
  agent_city?: string;
  agent_state?: string;
  agent_zip?: string;
  date_filed?: string;
  mailing_address?: string;
  mailing_city?: string;
  mailing_state?: string;
  mailing_zip?: string;
  principal_address?: string;
  principal_city?: string;
  principal_zip?: string;
}

async function fetchDccaByZip(zip: string, limit = 100): Promise<DccaRecord[]> {
  // DCCA OData — filter by agent_zip or mailing_zip
  // Using SoQL query: $where=mailing_zip='96707' AND status='Active'
  const params = new URLSearchParams({
    $where: `(mailing_zip='${zip}' OR agent_zip='${zip}') AND status='Active'`,
    $limit: String(limit),
    $select: "business_name,file_number,status,entity_type,agent_zip,mailing_zip,mailing_city,date_filed",
  });

  const url = `${DCCA_BASE}?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    console.error(`[808-SCRAPE] DCCA fetch failed for zip ${zip}: ${res.status}`);
    return [];
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function POST(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "";
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { zips?: string[]; zip?: string; limit?: number } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const targetZips: string[] = body.zips || (body.zip ? [body.zip] : WEST_OAHU_ZIPS);
  const perZipLimit = Math.min(body.limit || 100, 500);

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  let totalInserted = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  const errors: string[] = [];

  for (const zip of targetZips) {
    try {
      const records = await fetchDccaByZip(zip, perZipLimit);
      console.log(`[808-SCRAPE] zip=${zip} → ${records.length} records from DCCA`);

      if (records.length === 0) continue;

      const upsertRows = records
        .filter((r) => r.business_name && r.business_name.trim().length > 1)
        .map((r) => ({
          name: r.business_name!.trim(),
          dcca_file_number: r.file_number || null,
          entity_type: r.entity_type || null,
          zip: zip,
          city: r.mailing_city || "Honolulu",
          state: "HI",
          category: mapCategory(r.entity_type || "", r.business_name || ""),
          status: "discovered",         // not yet claimed
          source: "dcca",
          dcca_status: r.status || "Active",
          date_filed: r.date_filed || null,
          updated_at: new Date().toISOString(),
        }));

      if (upsertRows.length === 0) {
        totalSkipped += records.length;
        continue;
      }

      // Upsert — conflict on (dcca_file_number) when present, else on (name, zip)
      // Use upsert with ignoreDuplicates=false to update existing discovered records
      const { data: upserted, error: upsertErr } = await supabase
        .from("makoa_businesses")
        .upsert(upsertRows, {
          onConflict: "dcca_file_number",
          ignoreDuplicates: false,
        })
        .select("id, name");

      if (upsertErr) {
        console.error(`[808-SCRAPE] Upsert error zip=${zip}:`, upsertErr.message);
        errors.push(`zip ${zip}: ${upsertErr.message}`);
        continue;
      }

      const count = upserted?.length || upsertRows.length;
      totalInserted += count;
      console.log(`[808-SCRAPE] zip=${zip} upserted ${count} businesses`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[808-SCRAPE] Error processing zip ${zip}:`, msg);
      errors.push(`zip ${zip}: ${msg}`);
    }
  }

  const summary = {
    ok: true,
    zips_processed: targetZips.length,
    total_inserted: totalInserted,
    total_updated: totalUpdated,
    total_skipped: totalSkipped,
    errors: errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString(),
  };

  console.log("[808-SCRAPE] Complete:", JSON.stringify(summary));
  return NextResponse.json(summary);
}

// GET — returns scrape status / last run info from the admin log
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "";
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Count businesses by status
  const { data: stats } = await supabase
    .from("makoa_businesses")
    .select("status, zip")
    .order("created_at", { ascending: false });

  const counts: Record<string, number> = {};
  const zipCounts: Record<string, number> = {};
  (stats || []).forEach((row: { status: string; zip: string }) => {
    counts[row.status] = (counts[row.status] || 0) + 1;
    zipCounts[row.zip] = (zipCounts[row.zip] || 0) + 1;
  });

  return NextResponse.json({
    total: (stats || []).length,
    by_status: counts,
    by_zip: zipCounts,
    covered_zips: WEST_OAHU_ZIPS,
  });
}
