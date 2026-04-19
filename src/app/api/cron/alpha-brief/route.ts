// GET /api/cron/alpha-brief — ALPHA agent (daily 7am HST = 17:00 UTC)
// Pulls yesterday's cluster + membership metrics from Supabase,
// synthesizes a command-level brief, fires to Steward 0001 on Telegram.
// ALPHA sees the whole board. ECHO drafts content. ALPHA briefs command.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://flzivjhxtbolcfaniskv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = "7954185672"; // Steward 0001

const HST_OFFSET = -10; // Hawaii Standard Time (no DST)

function hstDate(offsetDays = 0): string {
  const d = new Date();
  d.setUTCHours(d.getUTCHours() + HST_OFFSET);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

function hstNow(): string {
  const d = new Date();
  d.setUTCHours(d.getUTCHours() + HST_OFFSET);
  return d.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

async function sendTelegram(msg: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "HTML" }),
  }).catch(() => {});
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const today = hstDate(0);
  const yesterday = hstDate(-1);

  // Pull all metrics in parallel
  const [
    pendingAppsRes,
    newAppsRes,
    open911Res,
    checkinsRes,
    draftPostsRes,
    activeStewsRes,
    newsStat,
    warchestRes,
  ] = await Promise.all([
    // Pending steward applications (all time)
    sb.from("steward_applications").select("id", { count: "exact" }).eq("status", "pending"),
    // New applications since yesterday
    sb.from("steward_applications").select("handle, zip_cluster, xi_score, xi_tier").gte("created_at", yesterday).order("xi_score", { ascending: false }),
    // Open 911 alerts
    sb.from("cluster_911").select("emergency_type, severity, zip_cluster, created_at", { count: "exact" }).eq("resolved", false),
    // Check-ins today
    sb.from("cluster_checkins").select("id", { count: "exact" }).eq("check_in_date", today),
    // ECHO draft posts awaiting approval
    sb.from("social_posts").select("id, platform", { count: "exact" }).eq("status", "draft"),
    // Active seated stewards
    sb.from("cluster_stewards").select("handle, zip_cluster, seat_type", { count: "exact" }).eq("status", "active"),
    // Unapproved 411 news items
    sb.from("cluster_news").select("id", { count: "exact" }).eq("is_approved", false),
    // Warchest total pledged
    sb.from("cluster_warchest").select("amount").eq("status", "pledged"),
  ]);

  const pendingApps = pendingAppsRes.count || 0;
  const newApps = newAppsRes.data || [];
  const open911 = open911Res.data || [];
  const open911Count = open911Res.count || 0;
  const checkinsToday = checkinsRes.count || 0;
  const draftPosts = draftPostsRes.count || 0;
  const activeStews = activeStewsRes.count || 0;
  const pendingNews = newsStat.count || 0;
  const warchestTotal = (warchestRes.data || []).reduce((s: number, r: { amount: number }) => s + Number(r.amount || 0), 0);

  // Build status
  const statusLine = open911Count > 0
    ? `🔴 <b>${open911Count} OPEN 911 ALERT${open911Count > 1 ? "S" : ""}</b>`
    : "🟢 No open emergencies";

  // New applications block
  let appsBlock = "";
  if (newApps.length > 0) {
    appsBlock = `\n\n📋 <b>NEW APPLICATIONS (${newApps.length})</b>\n` +
      newApps.slice(0, 3).map(a =>
        `· ${a.handle} — ZIP ${a.zip_cluster} — ${a.xi_score} XI (${a.xi_tier?.toUpperCase() || "?"})`
      ).join("\n") +
      (newApps.length > 3 ? `\n· +${newApps.length - 3} more` : "");
  }

  // 911 block
  let alertBlock = "";
  if (open911Count > 0) {
    const critical = open911.filter(a => a.severity === "critical");
    alertBlock = `\n\n🚨 <b>OPEN 911 (${open911Count})</b>\n` +
      (critical.length > 0
        ? critical.map(a => `· CRITICAL: ${a.emergency_type} — ZIP ${a.zip_cluster}`).join("\n")
        : open911.slice(0, 2).map(a => `· ${a.severity.toUpperCase()}: ${a.emergency_type} — ZIP ${a.zip_cluster}`).join("\n")
      );
  }

  // Action items
  const actions: string[] = [];
  if (pendingApps > 0) actions.push(`Review ${pendingApps} pending application${pendingApps > 1 ? "s" : ""}`);
  if (draftPosts > 0) actions.push(`Approve ${draftPosts} ECHO draft${draftPosts > 1 ? "s" : ""} in Social tab`);
  if (pendingNews > 0) actions.push(`Publish ${pendingNews} 411 news item${pendingNews > 1 ? "s" : ""}`);
  if (open911Count > 0) actions.push(`Respond to ${open911Count} open 911 alert${open911Count > 1 ? "s" : ""}`);

  const actionBlock = actions.length > 0
    ? `\n\n⚡ <b>YOUR MOVES TODAY</b>\n` + actions.map((a, i) => `${i + 1}. ${a}`).join("\n")
    : `\n\n✅ No actions required. Let XI run.`;

  const warchestLine = warchestTotal > 0
    ? `\n💰 Warchest: $${warchestTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} pledged`
    : "";

  const brief = `🌺 <b>ALPHA BRIEF · ${hstNow()}</b>
7G Net · West Oahu · ZIP 96792

${statusLine}

📊 <b>METRICS</b>
· Active Stewards: ${activeStews}
· Check-ins Today: ${checkinsToday}
· Pending Applications: ${pendingApps}
· Open 911 Alerts: ${open911Count}
· 411 Items in Queue: ${pendingNews}
· ECHO Drafts Awaiting: ${draftPosts}${warchestLine}${appsBlock}${alertBlock}${actionBlock}

<a href="https://makoa.live/steward/dashboard">→ Cluster Dashboard</a> · <a href="https://makoa.live/steward">→ Command Center</a>

— XI ALPHA · Mākoa Order Operations`;

  await sendTelegram(brief);

  return NextResponse.json({
    ok: true,
    date: today,
    metrics: { pendingApps, newApps: newApps.length, open911Count, checkinsToday, draftPosts, activeStews, pendingNews, warchestTotal },
  });
}
