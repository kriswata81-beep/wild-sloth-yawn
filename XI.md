# XI — Self-Repair Playbook

**Owner:** XI Chief Mākoa (autonomous agent team) · operating on behalf of Steward 0001
**Last incident review:** 2026-04-19 · "19-hour stale deploy outage"

This file is what XI reads before acting. It exists because on 2026-04-19 Steward asked "how come 24hr ago u said everything is fine" — and OMEGA genuinely thought it was fine. It wasn't. Everything in this doc is a rule written in scar tissue.

---

## 0 · First principles

1. **Production = what visitors see.** Not what's in main. Not what OMEGA logged. Not what Claude Code built successfully on the Steward's laptop. If `makoa.live` is serving a commit from 19 hours ago, production is 19 hours stale, regardless of everything else.
2. **A 200 OK does not mean production is current.** It means the last READY deploy is still serving. Health checks must verify freshness, not just reachability.
3. **Silent failure is the enemy.** If OMEGA's log inserts are 400'ing, OMEGA has no memory. If ECHO's draft inserts are failing, the marketing feed goes dark and no one pages. Every write path must either succeed or scream.
4. **XI has push authority** (memory: `user_steward0001.md`). Steward does not need to fix anything. When XI finds a problem XI can fix, XI fixes it — doesn't write a JIRA.

---

## 1 · Known failure modes & fixes

### 1.1 Stale deploy (happened 2026-04-18 → 2026-04-19)

**Symptom:** `makoa.live` serves correctly but new commits don't appear on the site. Vercel dashboard shows a chain of ERROR deploys on top of the last READY one.

**Root cause:** A build-time error (usually Next.js prerender) in a recent commit. Vercel keeps serving the last good deploy rather than breaking the site, which is the right behavior — but it hides the problem.

**Detection:**
- `origin/main` SHA ≠ latest READY Vercel deployment SHA → stale
- Latest Vercel deployment is `ERROR` with no newer READY → build broken

**Fix path:**
1. Pull the build logs: `mcp__*__get_deployment_build_logs` on the failed deployment id
2. Find the first `⨯` or `error:` line in stderr
3. Fix the root cause, NOT the symptom
4. Commit with the error quoted in the message so the next agent understands why
5. Push, watch the build, verify READY, hit `makoa.live` and diff against expected

**Specific known-cause:** `useSearchParams() should be wrapped in a suspense boundary`. Next.js 15+ requires any client page using `useSearchParams()` to have its default export wrapped in `<Suspense>`. Pattern:

```tsx
function PageInner() {
  const sp = useSearchParams();
  // ...
}
export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: BG }} />}>
      <PageInner />
    </Suspense>
  );
}
```

All pages in `src/app/*/page.tsx` using `useSearchParams` MUST follow this pattern. Sweep them with:
```bash
grep -rn "useSearchParams" src/app | grep -v Suspense
```

### 1.2 OMEGA schema mismatch (happened silently for weeks)

**Symptom:** `admin_activity_log` table has 0 rows despite OMEGA running hourly for weeks.

**Root cause:** OMEGA was POSTing `{event_type, payload, severity, actor}` but the table columns are `{action_type, action_summary, details, performed_by}`. Every insert returned 400 and OMEGA moved on.

**Fix path (2026-04-19):**
- Updated `~/.claude/scheduled-tasks/omega-hourly-health/SKILL.md` to use the correct columns
- Added "log the 400 response body to chat" so silent failure becomes loud failure

**Rule:** Before writing to a Supabase table XI doesn't own, ALWAYS query `information_schema.columns` first. Don't trust prior code — cron skills outlive migrations.

### 1.3 ECHO produces no drafts (ongoing as of 2026-04-19)

**Symptom:** `echo-daily-content` fires on schedule but no new `social_posts` rows with `status=draft` appear, no Telegram ping arrives.

**Likely causes (triage in order):**
1. `ANTHROPIC_API_KEY` not set in the ECHO process env → no content generated
2. Supabase anon key lookup path broken → insert fails
3. Insert returns 400 (e.g. `created_by='echo'` violates an enum) → logged to nowhere

**Fix path:** Run ECHO manually, capture full stderr, patch. ECHO SKILL.md rule: "If the Supabase insert fails, log the error and exit." That rule is wrong — it should `page Telegram on failure` so silent failures become visible.

### 1.4 Blotato platform-specific rejections

**Known rules (memory: `feedback_blotato_rules.md`):**
- **Twitter:** hard 280-char limit
- **Instagram:** max 5 hashtags
- **TikTok:** requires at least one image or video in `mediaUrls`
- **YouTube:** requires an actual video file URL
- **Visual jobs:** expire overnight — poll immediately after creation, don't defer

**Rule:** Before firing to a platform, validate against that platform's rules. A single 3-platform fan-out should not have 1 success and 2 failures — validate locally first.

### 1.5 Feed going dark

**Symptom:** `social_posts` has no `fired` rows in the last 24h during an active campaign window.

**Fix path:**
1. Check what scheduled posts exist: `WHERE status IN ('scheduled', 'queued', 'draft')`
2. If 0 rows → marketing pipeline empty. XI drafts recovery content immediately (don't wait for ECHO's next cron).
3. If rows exist but cron isn't firing → check the poll-status cron job on Vercel.

---

## 2 · Autonomous action authority

XI may, without asking Steward:
- Read/write any file in `C:\Users\krisw\dyad-apps\wild-sloth-yawn\`
- `git commit` and `git push` to `origin/main`
- Write to any Supabase table in project `flzivjhxtbolcfaniskv` (Mākoa)
- Fire posts via Blotato (records as `fired_by='claude_adhoc'` in `social_posts`)
- Send Telegram pings to Steward's chat
- Update skill files in `C:\Users\krisw\.claude\scheduled-tasks\`
- Refund Stripe payments under $100 (prefer asking for $100+)

XI must ask Steward before:
- Any action that spends or commits >$100
- Sending email via Resend to recipients outside the contact list
- Changing DNS, domain ownership, or Vercel project settings
- Touching the repository at `tphawaii` (different brand, different project)
- Any merge to `main` that reverts >3 prior commits

---

## 3 · The daily XI heartbeat (what XI expects)

- `06:30 HST` — ALPHA morning brief lands in Telegram
- `06:33 HST` — ECHO drops a draft, pings Steward
- `every :07 UTC` — OMEGA runs 8-check health, logs to `admin_activity_log`, pages Telegram on RED
- `21:03 HST` — KILO sends daily revenue line

If any of these four are missing for more than one cycle, XI should self-diagnose using §1.

---

## 4 · The rule I keep breaking (writing it down)

**Don't say "everything is fine" unless I've verified freshness, not just reachability.** A site returning 200 can be completely stale. A database table that accepts writes silently can be rejecting them all with 400. A cron job that reports "completed" to the harness can have done nothing useful.

The words "looks good" and "all green" are bait. Replace with "verified at <timestamp> · <specific evidence>".

---

## 5 · The 2026-04-19 incident (timeline)

- **2026-04-18 10:45 HST** — Last green Vercel deploy (`dpl_9gveiSZS...`) — repair of escaped template literals in transcription-ready route
- **2026-04-18 11:00 HST → 2026-04-19 09:00 HST** — 8 commits pushed. All 8 failed to build. All 8 stuck.
- **2026-04-18 21:00 HST** — OMEGA runs hourly through this window. Reports GREEN every hour because `makoa.live` serves the 10:45 deploy and returns 200.
- **2026-04-19 06:30 HST** — ALPHA and ECHO both fire. Neither drops anything visible to Steward. No Telegram ping.
- **2026-04-19 09:30 HST** — Steward asks XI for a full audit.
- **2026-04-19 09:45 HST** — XI finds: build broken (useSearchParams Suspense), OMEGA schema mismatch, 19-hour stale deploy, zero feed traffic since 4-17.
- **2026-04-19 10:00 HST** — XI ships `fix(gate): wrap useSearchParams in Suspense boundary`, rewrites OMEGA skill, writes this file.

Don't let this happen again.
