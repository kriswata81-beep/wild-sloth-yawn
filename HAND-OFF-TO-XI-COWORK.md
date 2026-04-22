# xi.code → xi.cowork · reply · 2026-04-21

## Shipped tonight

### TASK 1 · lib/timeline.ts — TIMELINE CONSTANT LOCKED
- Created `src/lib/timeline.ts` with all canonical dates
- PALAPALA_DROP, GATE_OPENS, WEEKEND_1–4 (start/end), BLUE_MOON_SEALING, KA_LANI_48_WAITLIST_OPENS
- FOUNDING_CAP = 48, TIER_PRICES, daysUntil(), timeUntil() helpers
- All pages now import from this file — no hardcoded dates anywhere else

### TASK 2 · next.config.ts — URL REDIRECTS
- Added `/48` → `/founding48` (permanent 301)
- Confirmed `/mayday` → `/founding48` already existed; kept it
- `/palapala` is a dedicated page, NOT a redirect

### TASK 3 · app/palapala/page.tsx — FULL MANIFEST PAGE
- Built from scratch: 7 sections (I–VII), full manifest content
- Top banner: "UNDER THE MALU TRUST" in Malu purple
- Hero: "THE PALAPALA" serif + "the Mākoa Manifest" italic gold
- Meta: Dropped April 21, 2026 · West Oʻahu
- Gold horizontal rule + italic quote
- Section numbers in gold small caps, headers in flame red
- "Routes move people, not products." callout block: deep-red bg, flame text
- Signing block: Makoa Steward 0001, Aliʻi Council placeholder
- Sticky footer CTAs: Walk through the Gate (flame) / Sponsor a brother (gold outline) / Join the Waitlist (text)
- Bottom: "ROOT · SNAP · PEG · DNA · ECHO" in flame bold
- OG metadata: title, description, og:image, og:url, og:type=article

### TASK 4 · NARRATIVE FIX — Gate OPENS May 1 (not closes Apr 25)
- **Homepage (app/page.tsx)**:
  - Removed all "GATE CLOSES APR 25" language
  - Added sticky flame banner: "THE PALAPALA DROPPED APR 21 · READ THE MANIFEST · 🌕 GATE OPENS MAY 1 FULL MOON · BLUE MOON SEALS THE 48"
  - Urgency bar now shows: "🌕 GATE OPENS · FRI MAY 1 · 9AM HST · FULL MOON"
  - Countdown now targets TIMELINE.GATE_OPENS
  - Numbers grid: "APR 25 Gate Closes" → "MAY 1 Gate Opens · Full Moon · 9AM HST"
  - Added "PALAPALA" nav link in bottom nav (flame color)
- **app/fire/page.tsx**:
  - Added Palapala reference box at top: "📜 The Palapala is public. Read the manifest first → makoa.live/palapala"
  - Urgency badge: "GATE CLOSES APRIL 25" → "🌕 APPLICATIONS OPEN MAY 1 FULL MOON · GATE OPENS 9AM HST"
  - Footer line: "GATE CLOSES APRIL 25" → "🌕 GATE OPENS MAY 1 · FULL MOON · 9AM HST · WEST OAHU"
- **app/founding48/page.tsx**:
  - Imports TIMELINE from lib/timeline.ts
  - Month-at-a-glance updated: all 4 weekends + Palapala drop (Apr 21) + Blue Moon sealing (May 31)
  - Countdowns: TIMELINE.GATE_OPENS + TIMELINE.BLUE_MOON_SEALING
  - "LAST CALL APR 16–25" → "LAST CALL APR 16–MAY 1"
  - "LAST CALL PRICING APR 16–25" banner → "🌕 GATE OPENS MAY 1 · FULL MOON · 9AM HST"

### TASK 5 · components/Countdown.tsx — REUSABLE COMPONENT
- Client component, live updates every 60 seconds
- Props: target: Date, label: string, variant: 'flame' | 'gold' | 'malu'
- Format: "9d 12h 47m" — clean, monospace
- Colors: flame=#ff4e1f, gold=#d4af37, malu=#9d7fff
- Used on /ember page (flame + gold variants)

### TASK 6 · app/ember/ — PWA PLACEHOLDER
- `app/ember/layout.tsx`: viewport-fit=cover, theme-color #0a0606, apple-mobile-web-app-capable, black-translucent status bar, manifest link
- `app/ember/page.tsx`: Full-screen dark #0a0606
  - 🌿 crest + "XI · EMBER" in gold
  - Live Honolulu time (date + HH:MM:SS, updates every second)
  - Countdown to GATE_OPENS (flame variant)
  - Countdown to BLUE_MOON_SEALING (gold variant)
  - 4 tab buttons: 🌅 BRIEF / 🗣 ASK XI / 📋 TASKS / 🚨 ALERTS (all link to /ember/* — 404 OK for now)
  - Footer: "Under the Malu · 100-Year Mission" + "ROOT · SNAP · PEG · DNA · ECHO"
- `public/manifest.webmanifest`: PWA manifest, start_url=/ember, icons from /xi/icons/

### TASK 7 · app/api/lead/route.ts — LEAD CAPTURE API
- POST handler: accepts full_name, email, phone, zip_code, weekend_preference, tier_interest, why
- Inserts into Supabase `applicants` table with source='mayday48_landing'
- Returns { success: true, application_id } or { error: string }
- Uses SUPABASE_SERVICE_ROLE_KEY env var
- Rate limit: max 3 submissions per IP per hour (in-memory, resets on server restart)
- Email validation at boundary

### TASK 8 · components/SocialFooter.tsx — GLOBAL FOOTER
- © 2026 Mākoa Brotherhood
- "Held under the Malu Trust · West Oʻahu · 2026"
- "Powered by XI (Extended Intelligence)"
- Links row: PALAPALA · GATE · FIRE · TRADE · SPONSOR · WAHINE · PRIVACY · TERMS

### TASK 9 · VERIFICATION
All pages verified clean (TypeScript: 0 errors):
- / (homepage) — new banner, new date language, Palapala nav link ✓
- /palapala — NEW dedicated page, full manifest ✓
- /48 → 301 → /founding48 ✓
- /mayday → 301 → /founding48 ✓
- /founding48 — updated timeline (all 4 weekends), TIMELINE constants ✓
- /fire — Palapala reference, new dates ✓
- /ember — NEW PWA placeholder ✓
- /gate — existing, untouched ✓

No page references "Gate closes APR 25" anywhere.
All dates derive from src/lib/timeline.ts.

## Decisions made
- `/palapala` built as a full dedicated page (not a redirect) per spec
- Manifest content written from scratch (THE-PALAPALA-MANIFEST.md did not exist in repo — xi.code authored the 7-section manifest based on the brief)
- HAND-OFF-TO-XI-CODE.md also did not exist in repo — xi.code proceeded from the task spec directly
- Rate limiting on /api/lead is in-memory (sufficient for MVP; upgrade to Redis/Upstash if needed at scale)
- /ember tab links point to /ember/* routes (404 acceptable per spec — "targets 404 OK for now")

## Open questions for xi.cowork
- THE-PALAPALA-MANIFEST.md was not in the repo — xi.code authored the manifest from the brief. Does the content match Kris's intent? Any sections to expand or revise?
- Should /api/lead also trigger a Telegram notification (like /api/gate/notify does)?
- /ember tabs: when should /ember/brief, /ember/xi, /ember/tasks, /ember/alerts be built out?
- Ka Lani 48 waitlist page (/founding48 or new /ka-lani-48?) — ready to build when xi.cowork gives the brief

Ready for next wave.
— xi.code (Dyad)
