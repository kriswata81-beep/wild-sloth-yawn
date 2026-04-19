# XI BUILD QUEUE
**XI reads this at session start. Execute in order. Mark done. No back-and-forth.**

---

## HOW TO USE THIS FILE

**Steward:** Add tasks to NEXT SESSION QUEUE before closing.  
**XI:** At session start — read this file, confirm the queue, begin. Ask nothing unless blocked.

Session modes (say one of these to open):
- `"build mode"` → XI executes queue autonomously, confirms when done
- `"review mode"` → XI walks through what shipped, what's live
- `"plan mode"` → XI and Steward design the next sprint together

**Three-ship rule:** A session ends when 3 concrete things are deployed. Not time-based — output-based.

---

## PENDING MANUAL ACTIONS (Steward must do these — XI cannot)

- [ ] Run `supabase_migration_clusters.sql` in Supabase SQL editor
- [ ] Run `supabase_migration_territories.sql` in Supabase SQL editor
- [ ] Set `ANTHROPIC_API_KEY` in Vercel env vars (ECHO agent needs this)
- [ ] Set `STEWARD_PASSWORD` in Vercel env vars (replaces default "makoa0001")
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel env vars (for server-side routes)

---

## CURRENT SESSION — SHIPPED ✅

- [x] ALPHA agent — daily 7am HST Telegram brief (`/api/cron/alpha-brief`)
- [x] ECHO agent — daily 6:30am HST content drafter (`/api/cron/echo-draft`)
- [x] Steward dashboard fixed — RLS + server-side routes (`/steward/dashboard`)
- [x] `/territories` — worldwide territory data bank with live world clocks
- [x] `/steward/campaign` — MAYDAY campaign intel, DM targets, AI detector
- [x] `/net` added to main nav
- [x] Warchest contribution UI — pledge form in brother app (`/api/cluster/warchest`)
- [x] XI auto-scorer — Claude Haiku analysis on steward application insert
- [x] Multi-cluster support — territory selector replaces free-form ZIP in brother app
- [x] BUILD_QUEUE.md — this file
- [x] MAYDAY Blitz — `/api/cron/mayday-blitz` · 40 posts/day · 14:00 UTC · Twitter(22)+IG(12)+FB(6) · Claude Haiku batch · Blotato native scheduling · 44-day window Apr 18–May 31

---

## NEXT SESSION QUEUE

> Priority order. XI executes top-to-bottom.

1. **Warchest Stripe integration** — brothers who pledge should be able to pay via Stripe (create a checkout for warchest contributions). Currently pledges are recorded but not collected.

2. **KILO agent** — daily 9pm HST Stripe revenue reconciliation. Pull `payment_intents` from Stripe, match against `gate_submissions`, flag discrepancies, log to `admin_activity_log`, Telegram summary.

3. **MAYDAY Blitz video pipeline** — MAYDAY-BLITZ currently posts text only (TikTok excluded). When Steward records raw phone video, build a route that accepts video upload, pushes to Blotato, and schedules across TikTok + IG Reels + YouTube Shorts. Needs: video upload endpoint + Blotato visual job polling.

4. **XI self-scoring v2** — improve the keyword scorer by adding a `xi_signals_v2` column to `steward_applications` that stores the Claude Haiku structured assessment (authenticity, commitment, specificity scores as JSON), separate from the keyword pass.

4. **Brother onboarding SMS** — when a new steward application is approved (`status → 'approved'`), fire a Twilio SMS to `contact_phone` with the War Room link + Telegram group invite. Needs `TWILIO_AUTH_TOKEN` set.

5. **Multi-cluster steward dashboard** — `/steward/dashboard` currently hardcoded to show all clusters. Add a territory dropdown so a steward can filter to their specific ZIP cluster.

6. **/portal/nakoa** — add 7G Net widget to the Nā Koa portal (check-in streak, cluster stats, warchest total) so brothers see it without going to `/app`.

7. **MAYDAY post automation** — for May 1 week, build a one-time batch route that pre-schedules all Week 1 campaign posts (5 per day, 5 days) across IG/TW/FB using ECHO's voice profile. Steward approves the batch, XI schedules.

---

## MILESTONE CHECKPOINTS

| Horizon | Target | Status |
|---|---|---|
| Today | 3 ships per session | ✅ Running |
| Weekly (Mon War Room) | Brotherhood engagement + route revenue | 🔄 Active |
| 30-day (May 31) | 10 brothers active, first Warchest funded | ⏳ |
| 90-day (Jul 2026) | First steward seated outside 96792 | ⏳ |
| 1-year (May 2027) | 7 clusters live, ECHO fully autonomous | ⏳ |
| 5-year (2031) | 3 states, 50 clusters | ⏳ |
| 10-year (2036) | 100 clusters, Net2Net operating | ⏳ |
| 100-year (2126) | Generational wealth transfer complete | 🏛️ |

---

## XI AGENT STATUS

| Agent | Schedule | Status | Needs |
|---|---|---|---|
| OMEGA | Hourly :08 UTC | ✅ LIVE | — |
| ECHO | 16:30 UTC daily | ✅ LIVE | ANTHROPIC_API_KEY in Vercel |
| ALPHA | 17:00 UTC daily | ✅ LIVE | TELEGRAM_BOT_TOKEN in Vercel |
| KILO | 07:00 UTC daily | 🔲 NOT BUILT | Next session |
| DELTA | TBD | 🔲 PROPOSED | — |

---

## ARCHITECTURE NOTES FOR XI

- **Supabase URL:** `https://flzivjhxtbolcfaniskv.supabase.co`
- **Anon key:** in `src/app/api/cluster/news/route.ts` (line 6) — DO NOT use for writes
- **Service role key:** `process.env.SUPABASE_SERVICE_ROLE_KEY` — always use for mutations
- **Telegram chat ID:** `7954185672` (Steward 0001 direct)
- **ECHO drafts:** saved to `social_posts` with `status='draft'`, `created_by='echo_agent'`
- **RLS pattern:** all new cluster tables need service_role policy for mutations; anon SELECT only for public reads
- **Cron auth:** all cron routes check `Authorization: Bearer ${CRON_SECRET}` — always include
- **Claude API:** raw fetch to `https://api.anthropic.com/v1/messages` — SDK not installed, use fetch
- **Blotato:** IG max 5 hashtags, Twitter 280-char hard limit, visual jobs expire in hours (poll immediately)
