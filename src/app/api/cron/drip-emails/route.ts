import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps";

const XI_MAIL_URL = `${process.env.NEXT_PUBLIC_SITE_URL || "https://wild-sloth-yawn.vercel.app"}/api/xi-mail`;

// Drip windows: [hoursMin, hoursMax, flagColumn, templateId]
const DRIP_WINDOWS = [
  { hoursMin: 23, hoursMax: 25, flag: "drip_day1_sent", template: "welcome_day1", label: "day1" },
  { hoursMin: 71, hoursMax: 73, flag: "drip_day3_sent", template: "welcome_day3", label: "day3" },
  { hoursMin: 167, hoursMax: 169, flag: "drip_day7_sent", template: "welcome_day7", label: "day7" },
] as const;

export async function GET(req: NextRequest) {
  // --- Auth check ---
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const now = new Date();
  const results: { drip: string; email: string; success: boolean }[] = [];

  for (const drip of DRIP_WINDOWS) {
    const windowStart = new Date(now.getTime() - drip.hoursMax * 60 * 60 * 1000).toISOString();
    const windowEnd = new Date(now.getTime() - drip.hoursMin * 60 * 60 * 1000).toISOString();

    // Query applicants who signed up within the window and haven't received this drip
    const { data: applicants, error } = await supabase
      .from("applicants")
      .select("id, email, handle, full_name")
      .gte("created_at", windowStart)
      .lte("created_at", windowEnd)
      .or(`${drip.flag}.is.null,${drip.flag}.eq.false`);

    if (error) {
      console.error(`[drip-emails] Query error for ${drip.label}:`, error.message);
      continue;
    }

    if (!applicants || applicants.length === 0) continue;

    for (const applicant of applicants) {
      try {
        const mailRes = await fetch(XI_MAIL_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            template: drip.template,
            to: applicant.email,
            data: {
              handle: applicant.handle || applicant.full_name || "Brother",
              name: applicant.full_name || applicant.handle || "Brother",
            },
          }),
        });

        const mailOk = mailRes.ok;

        if (mailOk) {
          // Mark drip as sent
          await supabase
            .from("applicants")
            .update({ [drip.flag]: true })
            .eq("id", applicant.id);
        }

        results.push({
          drip: drip.label,
          email: applicant.email,
          success: mailOk,
        });
      } catch (err) {
        console.error(`[drip-emails] Send error for ${applicant.email}:`, err);
        results.push({ drip: drip.label, email: applicant.email, success: false });
      }
    }
  }

  return NextResponse.json({
    ok: true,
    sent: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    details: results,
    timestamp: now.toISOString(),
  });
}
