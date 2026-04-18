"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.08)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const AMBER = "#f0883e";
const RED = "#e05c5c";
const STEEL = "#8b9aaa";

type Platform = "IG" | "FB" | "TT" | "YT" | "TG" | "Email" | "All";
type Phase = "cold" | "warm" | "hot" | "viral";

interface Strategy {
  id: number;
  name: string;
  category: string;
  phase: Phase;
  platforms: Platform[];
  who: string; // steward | ambassador | xi | both
  cadence: string;
  hook: string;
  script: string;
  cta: string;
  tools: string[];
  automate: boolean;
  kpi: string;
}

const STRATEGIES: Strategy[] = [
  {
    id: 1,
    name: "Full Moon Brotherhood Anchor",
    category: "Recurring Ritual",
    phase: "warm",
    platforms: ["IG", "FB", "TG"],
    who: "steward",
    cadence: "Monthly — night of full moon",
    hook: "Another full moon. Another brother sworn in.",
    script: "Post a single dark image of the moon or a fire with the text overlay: 'Full moon tonight. A brother is being sworn in somewhere on Oahu. You know who you are — the man who needed this. The gate is open until the seats fill.' Tag @makoa.brotherhood. Caption: 'Every full moon we open the gate. Every full moon, a man decides to stop waiting. Are you ready? → makoa.live/gate'",
    cta: "makoa.live/gate",
    tools: ["Blotato AI Story Video", "Quote Card template", "ElevenLabs"],
    automate: true,
    kpi: "Gate submissions within 24hrs of post",
  },
  {
    id: 2,
    name: "Before/After Mental Health Hook",
    category: "Cold Traffic",
    phase: "cold",
    platforms: ["FB", "TT", "IG"],
    who: "steward",
    cadence: "Weekly — Monday 6am",
    hook: "I used to sit in my truck before going into my house because I didn't know who I was anymore.",
    script: "Post: 'I used to sit in my truck for 20 minutes before going inside.\n\nNot because of traffic.\n\nBecause I didn't know who I'd be in there.\n\nHusband? Father? Or just... nothing.\n\nI built Mākoa because I was that man.\n\nWest Oahu brothers — May 1. 8 seats left.\n\nmakoa.live'\n\nNo hashtags. Just the raw truth.",
    cta: "makoa.live",
    tools: ["Organic text post", "Blotato scheduler"],
    automate: false,
    kpi: "Comments, DMs, shares from men's groups",
  },
  {
    id: 3,
    name: "Co-Founders Weekend Countdown",
    category: "Urgency / Scarcity",
    phase: "hot",
    platforms: ["IG", "FB", "TG", "Email"],
    who: "xi",
    cadence: "Daily last 7 days before gate close",
    hook: "X seats. X days. Then the gate closes.",
    script: "Day 7: '7 days. 8 seats.'\nDay 6: '6 days. 7 seats.'\n...\nDay 1: 'Tomorrow. Final seats. Gate closes at midnight.'\n\nEach post: stark black background, gold text, seat count, makoa.live/gate. Auto-fired by XI via Blotato at 6am HST.",
    cta: "makoa.live/gate",
    tools: ["Blotato scheduler", "XI cron", "Quote Card template"],
    automate: true,
    kpi: "Gate submissions per day in final week",
  },
  {
    id: 4,
    name: "Facebook Men's Group Infiltration",
    category: "Cold Traffic",
    phase: "cold",
    platforms: ["FB"],
    who: "steward",
    cadence: "2x per week per group",
    hook: "Looking for men from [GROUP NAME] to join us this May.",
    script: "Custom post per group — never copy-paste the same text. Examples:\n• Hawaii Dads Facebook group: 'Calling Oahu dads who feel like they're running on empty. We're building something different. May 1–4, Kapolei. 8 spots. DM me if you want the real story.'\n• Hawaii Entrepreneurs group: 'Looking for 3 West Oahu founders to join our founding weekend. Not a networking event. Something more permanent.'\n• Men's Mental Health Hawaii: 'This isn't therapy. It's brotherhood. Hawaii men — May 1–4. Limited seats. makoa.live/gate'\n\nALWAYS: add value to the group first, comment on other posts that week, then post.",
    cta: "DM Kris or makoa.live/gate",
    tools: ["Manual post", "XI Post Office templates"],
    automate: false,
    kpi: "DMs received from each group",
  },
  {
    id: 5,
    name: "GoPro Faceless Series — 8 Videos",
    category: "Video Content",
    phase: "cold",
    platforms: ["YT", "TT", "IG"],
    who: "xi",
    cadence: "One per week, 8-week rotation",
    hook: "No face. No name. Just the truth about men.",
    script: "8 episodes, all AI-generated (no phone filming):\n1. 'The man in the truck' — isolation story\n2. 'What happened when I stopped pretending' — mask-dropping\n3. 'The stat no one talks about' — men's suicide rate\n4. 'What accountability actually looks like' — real brotherhood\n5. 'Why therapy didn't work for me' — cold truth\n6. 'What happened at the founding weekend' — event recap\n7. 'The brother who almost didn't come' — testimonial\n8. 'What it means to be Nā Koa' — rank reveal\n\nAll videos: Blotato AI Story Video template, Brian voice, 9:16, AI-generated imagery (dark masculine visuals — fire, mountains, ocean, brotherhood silhouettes).",
    cta: "makoa.live or /gate link in bio",
    tools: ["Blotato AI Story Video", "ElevenLabs Brian voice", "Blotato scheduler"],
    automate: true,
    kpi: "Views, comments, DMs per video",
  },
  {
    id: 6,
    name: "Ambassador Cascade — Roundup Marketing",
    category: "Viral Growth",
    phase: "viral",
    platforms: ["All"],
    who: "both",
    cadence: "Every major post + event",
    hook: "Steward lights the fire. Ambassadors spread it.",
    script: "3-tier cascade:\n\nTIER 1 — STEWARD (Kris): Posts the original content — manifesto, announcement, countdown. Tags 2–3 Founding Brothers with '@[handle] — you know what this is about.'\n\nTIER 2 — FOUNDING BROTHERS (Ambassadors): Each ambassador reposts + adds their own caption. Template: 'I found Mākoa when I was [their story]. This May, [X] brothers are sworn in. [makoa.live/gate + their ref code]'\n\nTIER 3 — PUBLIC UGC: Ambassadors tag their own networks. Any man who shares the post gets a referral credit. At 5 shares: they get a sponsored discount (see Strategy #7).\n\nXI tracks all referral codes in Supabase. Ambassadors see their referral count in real-time on /gate?ref=[code].",
    cta: "makoa.live/gate?ref=[handle]",
    tools: ["Referral tracking (Supabase)", "Blotato", "Telegram bot"],
    automate: true,
    kpi: "Referral code submissions, cascade depth",
  },
  {
    id: 7,
    name: "5-Share Referral Reward System",
    category: "Referrals",
    phase: "viral",
    platforms: ["All"],
    who: "xi",
    cadence: "Ongoing — triggered by referral count",
    hook: "Bring 5 brothers. Your seat costs nothing.",
    script: "Every applicant gets a unique referral link: makoa.live/gate?ref=[their_handle]\n\nTracking in Supabase — when 5 gate submissions come in with same ref code:\n• XI triggers Stripe discount coupon (50% off annual dues)\n• Telegram message sent to Steward: 'Brother [name] hit 5 referrals — reward triggered'\n• Ambassador gets DM: 'You brought 5 brothers. You're taken care of.'\n\nReward tiers:\n• 1 referral = Mākoa sticker pack mailed\n• 3 referrals = Field Manual (digital)\n• 5 referrals = 50% off annual dues\n• 10 referrals = Seat sponsored (entire dues covered)\n\nXI monitors referral_code field in gate_submissions. Admin sees leaderboard in Referrals tab.",
    cta: "Share makoa.live/gate?ref=YOURHANDLE",
    tools: ["Supabase referral_code", "Stripe coupons", "Telegram bot", "XI agent"],
    automate: true,
    kpi: "Referral submissions, reward triggers, viral coefficient",
  },
  {
    id: 8,
    name: "Quote Card Carousel — Men's Wisdom",
    category: "Content",
    phase: "warm",
    platforms: ["IG", "FB"],
    who: "xi",
    cadence: "3x per week",
    hook: "The words men need but never hear.",
    script: "Pull quotes from Field Manual, rank descriptions, and Steward's own words. Post as 5–7 card carousels.\n\nSample quotes:\n• 'Brotherhood is not found. It's built. One hard conversation at a time.'\n• 'Every Nā Koa started as a man who almost didn't show up.'\n• 'The founding fire burns the first weekend of every month. Your seat — or someone else's.'\n• 'I built this because I was the man who needed it. — Kris W., Steward 0001'\n• 'Accountability without judgment. Brotherhood without weakness theater.'\n\nTemplate: Blotato Quote Card with dark background, gold text, minimal. Author: Kris W. | @makoa.brotherhood",
    cta: "Follow @makoa.brotherhood · makoa.live/gate",
    tools: ["Blotato Quote Card template", "Blotato scheduler"],
    automate: true,
    kpi: "Saves, shares, follows per carousel",
  },
  {
    id: 9,
    name: "Bio Link Hub — /links",
    category: "Traffic Architecture",
    phase: "warm",
    platforms: ["IG", "TT", "YT"],
    who: "xi",
    cadence: "Static — always live",
    hook: "One link. Every door into Mākoa.",
    script: "Build makoa.live/links — visual card grid:\n• THE GATE (primary CTA — gold border)\n• FOUNDING FIRE (video series)\n• FIELD MANUAL (download or purchase)\n• SPONSOR A BROTHER\n• TELEGRAM (join the channel)\n• MAYDAY WEEKEND INFO\n\nAll links tracked with UTM params for source analytics. IG Bio → makoa.live/links. TikTok bio → same. YouTube description → same.",
    cta: "makoa.live/links",
    tools: ["Next.js /links page", "UTM tracking"],
    automate: false,
    kpi: "Click-through rate on each card",
  },
  {
    id: 10,
    name: "Manifesto Drop — Founder Story",
    category: "Brand Building",
    phase: "cold",
    platforms: ["FB", "IG", "Email"],
    who: "steward",
    cadence: "Once — then repurpose quarterly",
    hook: "I built this because I was the man who needed it.",
    script: "Full founder story as long-form post (800+ words on FB, caption on IG):\n\n'I was the man sitting in his truck at 7pm not wanting to go inside.\nNot because I didn't love my family.\nBecause I had nothing left to give.\nNo brotherhood. No accountability. No mirror.\nJust performance.\n\n2 years ago I started looking for what I needed.\nI found retreats that cost $10,000.\nI found therapy groups that made me feel broken.\nI found men who talked about their feelings but never held each other accountable.\n\nSo I built what I needed.\nMākoa. Brotherhood. West Oahu.\n\nWe meet the first weekend of every month.\nWe swear brothers in under the full moon.\nWe build men who build families.\n\nMay 1–4 is our founding weekend.\n8 seats remain.\n\nIf you're the man who needed this — the gate is open.\nmakoa.live/gate'\n\nPinned to top of all profiles.",
    cta: "makoa.live/gate",
    tools: ["Manual post", "Blotato repurpose"],
    automate: false,
    kpi: "Shares, comments, saves, DMs from men",
  },
  {
    id: 11,
    name: "Rank Reveal Posts — Progression System",
    category: "Social Proof",
    phase: "warm",
    platforms: ["IG", "FB", "TG"],
    who: "xi",
    cadence: "Weekly — whenever a brother ranks up",
    hook: "He started as a Nā Koa candidate. Tonight he earned his Mana patch.",
    script: "Post: dark image with crest. 'Tonight, [First Name] earned his [Rank] patch. 3 months ago he was [their starting point]. Tonight he's [transformation]. This is what accountability looks like in the flesh. Nā Koa → Mana → Ali'i. The path is real. makoa.live/gate — 8 seats for May.'\n\nAsk member permission first. First name only. Focus on transformation, not identity.",
    cta: "makoa.live/gate",
    tools: ["Blotato Quote Card", "Telegram"],
    automate: false,
    kpi: "DMs asking 'how do I join'",
  },
  {
    id: 12,
    name: "Men's Mental Health Stats Infographic",
    category: "Education / Hook",
    phase: "cold",
    platforms: ["IG", "FB", "TT"],
    who: "xi",
    cadence: "Monthly — first of month",
    hook: "Men are dying alone. Here's the data.",
    script: "Post Blotato Breaking News / Billboard infographic:\n• '1 in 10 men has no close friends. Zero.'\n• 'Men are 3–4x more likely to die by suicide than women.'\n• 'The average man hasn't made a new friend in 5 years.'\n• 'Mākoa exists because this stat is unacceptable.'\n\nCaption: 'We built Mākoa because these stats are not acceptable. West Oahu brothers — May 1–4. 8 seats. makoa.live/gate'\n\nFooter CTA: 'Join Mākoa Brotherhood | makoa.live'",
    cta: "makoa.live/gate",
    tools: ["Blotato Breaking News template", "Blotato scheduler"],
    automate: true,
    kpi: "Shares (data posts get shared more than anything)",
  },
  {
    id: 13,
    name: "Field Manual Teaser Carousel",
    category: "Value / Lead Magnet",
    phase: "warm",
    platforms: ["IG", "FB"],
    who: "xi",
    cadence: "Bi-weekly",
    hook: "50 pages. Written for the man who is done pretending.",
    script: "Tutorial carousel with excerpts from Field Manual:\nSlide 1: 'The Mākoa Field Manual. 50 pages. Not for everyone.'\nSlide 2: [Excerpt — one key principle]\nSlide 3: [Excerpt — rank system overview]\nSlide 4: [Excerpt — accountability model]\nSlide 5: 'The full manual goes to Founding Brothers. May 1–4. 8 seats. makoa.live/gate'\n\nBranding: black background, gold accents, author: Kris W. | Steward 0001 | @makoa.brotherhood",
    cta: "makoa.live/gate to get the manual",
    tools: ["Blotato Tutorial Carousel", "Blotato scheduler"],
    automate: true,
    kpi: "Saves, DMs asking for the manual",
  },
  {
    id: 14,
    name: "Founding Brothers Month — Full May Push",
    category: "Campaign",
    phase: "hot",
    platforms: ["All"],
    who: "both",
    cadence: "Daily through May",
    hook: "Founding Brothers Month — May 2026.",
    script: "Every day in May, post ONE piece of content from this rotation:\n• Week 1: Social proof (brother rank-ups, testimonials)\n• Week 2: Education (stats, field manual excerpts)\n• Week 3: Urgency (seat countdown, hotel reminder)\n• Week 4: Community (photos from founding weekend, swearing-in recap)\n\nXI manages the daily queue. Steward approves each morning via Telegram tap.\n\nHashtag set: #MakoaBrotherhood #FoundingBrothersMonth #WestOahu #MensGroup #BrotherhoodHawaii",
    cta: "makoa.live/gate",
    tools: ["Blotato scheduler", "XI cron", "Telegram approval bot"],
    automate: true,
    kpi: "Total reach / impressions for May",
  },
  {
    id: 15,
    name: "Weekly Seat Check Post",
    category: "Scarcity",
    phase: "hot",
    platforms: ["IG", "FB", "TG"],
    who: "xi",
    cadence: "Every Friday 5pm HST",
    hook: "Friday seat check. X remain.",
    script: "Automated weekly post — simple black card with gold text:\n'FRIDAY SEAT CHECK\n[X] Co-Founder seats · $4,997\n[X] Mana seats · $197\n[X] Nā Koa seats · $97\nGate closes April 25.\nmakoa.live/gate'\n\nXI pulls live seat counts from Supabase and fires post automatically each Friday.",
    cta: "makoa.live/gate",
    tools: ["Blotato Quote Card", "XI cron (Friday)", "Supabase"],
    automate: true,
    kpi: "Gate submissions within 24hrs of Friday post",
  },
  {
    id: 16,
    name: "Telegram Exclusive Content Drive",
    category: "List Building",
    phase: "warm",
    platforms: ["TG", "IG", "FB"],
    who: "xi",
    cadence: "Weekly",
    hook: "The real conversations happen in our private channel.",
    script: "Tease content that only exists in the Telegram channel. Post on IG/FB:\n'The conversation we had in the Mākoa channel last night is why I built this.\n\nI can't post what was said here. It's too real.\n\nIf you want in → t.me/makaobros (link in bio)'\n\nTelegram gets: voice notes from Kris, raw training check-ins, brother wins, late-night accountability posts — things that don't belong on public feeds.",
    cta: "t.me/makaobros",
    tools: ["Telegram", "Blotato"],
    automate: false,
    kpi: "Telegram subscriber growth week-over-week",
  },
  {
    id: 17,
    name: "Sponsor A Brother Campaign",
    category: "Gifting / Revenue",
    phase: "warm",
    platforms: ["IG", "FB", "Email"],
    who: "steward",
    cadence: "Monthly",
    hook: "You know a man who needs this. You can put him in the room.",
    script: "Post: 'There's a man in your life who needs brotherhood.\nHe won't ask for it.\nHe doesn't know it exists.\n\nFor May 1–4, you can gift him a seat.\n$97 for a Day Pass.\nWe'll take care of the rest.\n\nSponsor a brother → makoa.live/sponsor'\n\nThis creates a second revenue stream and viral loop — existing network buys seats as gifts. The gifted brother becomes a future paying member.",
    cta: "makoa.live/sponsor",
    tools: ["Stripe sponsor flow", "Blotato"],
    automate: false,
    kpi: "Sponsored seat purchases, conversion to full membership",
  },
  {
    id: 18,
    name: "Platform-Specific Hashtag Sets",
    category: "Discovery",
    phase: "cold",
    platforms: ["IG", "TT", "FB"],
    who: "xi",
    cadence: "Every post",
    hook: "Right hashtags = free reach. Wrong hashtags = shadow ban.",
    script: "INSTAGRAM SET A (Brotherhood): #Brotherhood #MensGroup #MasculinityMatters #MensMentalHealth #HawaiiMen #WestOahu #MakoaBrotherhood #FoundingBrothers #BrotherhoodHawaii #MenWhoLead\n\nINSTAGRAM SET B (Event): #MayDay2026 #FoundingBrothersMonth #Kapolei #HawaiiEvent #MensRetreat #WestOahuEvents #CoFoundersWeekend\n\nTIKTOK: #MensMentalHealth #Brotherhood #HawaiiTikTok #MensGroupHawaii #WestOahu #MakoaBrotherhood #ToxicMasculinity (counter-narrative hook)\n\nFACEBOOK: Post in groups — no hashtag spam. Groups > hashtags on FB.\n\nNEVER use all hashtags. Rotate sets. Max 8 per IG post.",
    cta: "N/A",
    tools: ["Blotato scheduler"],
    automate: true,
    kpi: "Reach from hashtag vs. follower sources",
  },
  {
    id: 19,
    name: "Story Sequence — 24hr Narrative Arc",
    category: "Content",
    phase: "warm",
    platforms: ["IG"],
    who: "steward",
    cadence: "Weekly — Tuesday",
    hook: "7 stories. One arc. One CTA at the end.",
    script: "7-story sequence, posted over 24hrs:\n1. [Text] 'Something happened last weekend that I need to share.'\n2. [Image or video] Brief setup — the problem\n3. [Text] The turning point\n4. [Image] What brotherhood actually looks like\n5. [Text] What Mākoa is\n6. [Text] Seat count + gate close date\n7. [Text with link] 'makoa.live/gate — this is the last time I'll say this this week.'\n\nThe arc builds urgency naturally without feeling like an ad.",
    cta: "makoa.live/gate",
    tools: ["Manual IG Stories", "Blotato for text cards"],
    automate: false,
    kpi: "Story views, link taps, gate submissions after Tuesday",
  },
  {
    id: 20,
    name: "Cross-Platform Repurpose System",
    category: "Efficiency",
    phase: "warm",
    platforms: ["All"],
    who: "xi",
    cadence: "Every major content piece",
    hook: "Create once. Post everywhere. XI handles the rest.",
    script: "Content repurpose matrix:\n• Long-form FB post → IG caption (shorter) + Telegram note\n• AI Story Video (9:16) → IG Reel + TikTok + YT Shorts\n• Quote carousel → Individual quote cards (one per platform)\n• Manifesto → Email newsletter + FB post + IG caption\n\nXI workflow: Steward writes one piece → XI formats for each platform → schedules via Blotato → Steward tap-approves on Telegram.\n\nTime investment: 20 min write → 6 platform posts auto-formatted.",
    cta: "N/A — content infrastructure",
    tools: ["Blotato", "XI agent", "Telegram approval"],
    automate: true,
    kpi: "Posts per week vs. Steward hours invested",
  },
  {
    id: 21,
    name: "UGC Amplification Engine",
    category: "Social Proof",
    phase: "viral",
    platforms: ["IG", "FB", "TG"],
    who: "both",
    cadence: "Ongoing",
    hook: "Brothers tell better stories than ads.",
    script: "After each gathering or event:\n1. DM each attending brother: 'Would you share what this weekend meant in 3 sentences? I'll post it (first name only + rank).'\n2. Format their words into Quote Card carousel\n3. Post with credit: '@[handle] — [Rank], Founding Brother'\n4. Ask them to reshare with their own caption\n\nThe reshare is the viral loop. Their network = cold traffic who trusts them. One UGC post = 5x the reach of a Steward post.\n\nGoal: by May 10, 5 UGC posts live.",
    cta: "makoa.live/gate",
    tools: ["Blotato Quote Card", "Telegram", "Manual DM"],
    automate: false,
    kpi: "UGC reach vs. owned content reach",
  },
  {
    id: 22,
    name: "XI Post Office — Cold Outreach Templates",
    category: "Cold Outreach",
    phase: "cold",
    platforms: ["Email", "FB"],
    who: "xi",
    cadence: "2x per week",
    hook: "XI sends emails so Steward doesn't have to.",
    script: "6 vendor/outreach email templates in the XI Post Office tab:\n1. Men's group admin request to post\n2. Sponsor a brother offer to local businesses\n3. Partner gym / box / studio cross-promotion\n4. Media/podcast pitch for Kris\n5. Hotel / venue intro for future Chapter expansion\n6. Ambassador invite to existing Mākoa members\n\nAll templates live in /steward → XI Mail tab. Steward selects template, customizes 2 fields, XI sends via Resend.",
    cta: "XI Mail tab in /steward",
    tools: ["XI Post Office", "Resend", "Supabase templates"],
    automate: true,
    kpi: "Reply rate on cold outreach emails",
  },
  {
    id: 23,
    name: "Testimonial Mining Protocol",
    category: "Social Proof",
    phase: "hot",
    platforms: ["All"],
    who: "steward",
    cadence: "After each event",
    hook: "The most powerful post is a brother's real words.",
    script: "After every gathering, brotherhood dinner, or event:\n1. Within 24hrs: send each attendee a Telegram message: 'What changed for you this weekend? Real answer. 3 sentences.'\n2. Collect replies\n3. Format best responses as Quote Cards (first name + rank only)\n4. Schedule 3 testimonial posts in the week after the event\n5. Always end with: 'We have [X] seats left for May. makoa.live/gate'\n\nTestimonials are the #1 conversion tool for cold/warm traffic.",
    cta: "makoa.live/gate",
    tools: ["Telegram", "Blotato Quote Card", "Blotato scheduler"],
    automate: false,
    kpi: "Conversion rate on testimonial posts vs. other post types",
  },
  {
    id: 24,
    name: "Monthly Revenue Transparency Post",
    category: "Brand Building / Trust",
    phase: "warm",
    platforms: ["FB", "IG"],
    who: "steward",
    cadence: "First of each month",
    hook: "We don't hide what we collect. We show you exactly where it goes.",
    script: "Post: 'Mākoa Revenue Report — [Month]\nTotal collected: $[X]\nWhere it went:\n• Event venue: $[X]\n• Field Manuals printed: $[X]\n• Sponsor credits applied: $[X]\n• Operations fund: $[X]\n\nEvery dollar is accounted for. Every brother knows the numbers.\n\nThis month [X] brothers funded their own brotherhood.\nThis is what a self-sustaining order looks like.\n\nMay seats are still open. makoa.live/gate'\n\nTransparency = trust = conversion.",
    cta: "makoa.live/gate",
    tools: ["Stripe dashboard", "Manual post"],
    automate: false,
    kpi: "Comments about trust, DMs from men ready to join",
  },
  {
    id: 25,
    name: "Founding Fire Live Countdown — MAYDAY Week",
    category: "Event Launch",
    phase: "hot",
    platforms: ["All"],
    who: "both",
    cadence: "April 25–May 1 (final week)",
    hook: "The gate is closing. The fire is being built.",
    script: "Final week cascade — April 25 to May 1:\n\nAPR 25: 'Gate closes tonight at midnight. Final seats.'\nAPR 26: Gate closed. 'The brothers have been chosen. 8 men are headed to West Oahu.'\nAPR 27: Ambassador reshare wave — each Founding Brother posts 'I'm going.'\nAPR 28–30: Daily countdown posts: 'X days. X brothers. The founding fire is being built.'\nMAY 1: Real-time Telegram updates: 'Brothers are arriving.' 'Fire is lit.' 'The circle is formed.'\n\nXI handles scheduling. Steward handles live Telegram posts from the event.\n\nPost-event (May 5+): Photo + UGC wave. 'What happened at the founding weekend.'",
    cta: "Watch it unfold → t.me/makaobros",
    tools: ["Blotato scheduler", "XI cron", "Telegram live", "Manual"],
    automate: true,
    kpi: "Telegram growth during event week, waitlist signups for June",
  },
];

const PHASE_COLOR: Record<Phase, string> = {
  cold: BLUE,
  warm: AMBER,
  hot: RED,
  viral: GREEN,
};

const PHASE_LABEL: Record<Phase, string> = {
  cold: "COLD",
  warm: "WARM",
  hot: "HOT",
  viral: "VIRAL",
};

export default function StrategyTab() {
  const [selected, setSelected] = useState<Strategy | null>(null);
  const [filter, setFilter] = useState<Phase | "all">("all");
  const [autoOnly, setAutoOnly] = useState(false);

  const filtered = STRATEGIES.filter(s => {
    if (filter !== "all" && s.phase !== filter) return false;
    if (autoOnly && !s.automate) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.28em", marginBottom: 4 }}>
          XI WARBOOK · CONTENT & POSTING STRATEGY
        </p>
        <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.52rem", lineHeight: 1.6 }}>
          25 strategies customized for Mākoa Brotherhood — XI-managed posting system.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {(["all", "cold", "warm", "hot", "viral"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? (f === "all" ? GOLD : PHASE_COLOR[f as Phase]) : "rgba(0,0,0,0.4)",
              border: `1px solid ${filter === f ? (f === "all" ? GOLD : PHASE_COLOR[f as Phase]) : "rgba(176,142,80,0.15)"}`,
              color: filter === f ? "#000" : "rgba(232,224,208,0.5)",
              borderRadius: 4,
              padding: "5px 12px",
              fontSize: "0.4rem",
              letterSpacing: "0.15em",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
        <button
          onClick={() => setAutoOnly(!autoOnly)}
          style={{
            background: autoOnly ? GREEN : "rgba(0,0,0,0.4)",
            border: `1px solid ${autoOnly ? GREEN : "rgba(176,142,80,0.15)"}`,
            color: autoOnly ? "#000" : "rgba(232,224,208,0.5)",
            borderRadius: 4,
            padding: "5px 12px",
            fontSize: "0.4rem",
            letterSpacing: "0.1em",
            cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            marginLeft: 8,
          }}
        >
          ⚡ AUTO-ONLY
        </button>
        <span style={{ color: GOLD_DIM, fontSize: "0.38rem", marginLeft: "auto" }}>
          {filtered.length} / 25 strategies
        </span>
      </div>

      {/* Strategy Cards */}
      <div style={{ display: "grid", gap: 8 }}>
        {filtered.map(s => (
          <div
            key={s.id}
            onClick={() => setSelected(selected?.id === s.id ? null : s)}
            style={{
              background: selected?.id === s.id ? GOLD_FAINT : "rgba(0,0,0,0.3)",
              border: `1px solid ${selected?.id === s.id ? "rgba(176,142,80,0.3)" : "rgba(176,142,80,0.1)"}`,
              borderRadius: 8,
              padding: "12px 16px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {/* Row header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: selected?.id === s.id ? 12 : 0 }}>
              <span style={{ color: GOLD_DIM, fontSize: "0.38rem", minWidth: 24 }}>
                #{String(s.id).padStart(2, "0")}
              </span>
              <span
                style={{
                  background: PHASE_COLOR[s.phase],
                  color: "#000",
                  borderRadius: 3,
                  padding: "2px 6px",
                  fontSize: "0.34rem",
                  letterSpacing: "0.15em",
                  fontWeight: 700,
                  minWidth: 36,
                  textAlign: "center",
                }}
              >
                {PHASE_LABEL[s.phase]}
              </span>
              <span style={{ color: "#e8e0d0", fontSize: "0.48rem", flex: 1 }}>{s.name}</span>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {s.platforms.map(p => (
                  <span
                    key={p}
                    style={{
                      color: "rgba(232,224,208,0.4)",
                      fontSize: "0.34rem",
                      border: "1px solid rgba(176,142,80,0.15)",
                      borderRadius: 3,
                      padding: "1px 5px",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
              {s.automate && (
                <span style={{ color: GREEN, fontSize: "0.34rem", letterSpacing: "0.1em" }}>⚡ AUTO</span>
              )}
            </div>

            {/* Expanded detail */}
            {selected?.id === s.id && (
              <div style={{ borderTop: "1px solid rgba(176,142,80,0.1)", paddingTop: 12, display: "grid", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Detail label="CATEGORY" value={s.category} />
                  <Detail label="CADENCE" value={s.cadence} />
                  <Detail label="WHO POSTS" value={s.who.toUpperCase()} />
                  <Detail label="KPI" value={s.kpi} />
                </div>

                <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(176,142,80,0.1)", borderRadius: 6, padding: "10px 12px" }}>
                  <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.18em", marginBottom: 4 }}>HOOK</p>
                  <p style={{ color: AMBER, fontSize: "0.48rem", fontStyle: "italic", lineHeight: 1.5 }}>"{s.hook}"</p>
                </div>

                <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(176,142,80,0.1)", borderRadius: 6, padding: "10px 12px" }}>
                  <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.18em", marginBottom: 6 }}>SCRIPT / EXECUTION</p>
                  <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "0.44rem", lineHeight: 1.7, whiteSpace: "pre-line" }}>{s.script}</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(176,142,80,0.1)", borderRadius: 6, padding: "10px 12px" }}>
                    <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.18em", marginBottom: 4 }}>CTA</p>
                    <p style={{ color: GREEN, fontSize: "0.44rem" }}>{s.cta}</p>
                  </div>
                  <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(176,142,80,0.1)", borderRadius: 6, padding: "10px 12px" }}>
                    <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.18em", marginBottom: 4 }}>TOOLS</p>
                    {s.tools.map(t => (
                      <span key={t} style={{ display: "block", color: "rgba(232,224,208,0.6)", fontSize: "0.4rem", lineHeight: 1.6 }}>· {t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer legend */}
      <div style={{ marginTop: 24, padding: "12px 16px", background: GOLD_FAINT, borderRadius: 6, border: "1px solid rgba(176,142,80,0.1)" }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.18em", marginBottom: 6 }}>PHASE LEGEND</p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {(["cold", "warm", "hot", "viral"] as Phase[]).map(p => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: PHASE_COLOR[p] }} />
              <span style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.38rem" }}>
                <strong style={{ color: PHASE_COLOR[p] }}>{PHASE_LABEL[p]}</strong> — {
                  p === "cold" ? "new audience, no prior knowledge" :
                  p === "warm" ? "aware of Mākoa, building trust" :
                  p === "hot" ? "ready to act, needs final push" :
                  "built to spread beyond our network"
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ color: GOLD_DIM, fontSize: "0.32rem", letterSpacing: "0.18em", marginBottom: 2 }}>{label}</p>
      <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "0.42rem" }}>{value}</p>
    </div>
  );
}
