// ─────────────────────────────────────────────────────────────
// MĀKOA ORDER — Central Config, Seat Counters, Stripe Links,
// Telegram Structure, Region Mapping
// ─────────────────────────────────────────────────────────────

export type Tier = "alii" | "mana" | "nakoa";
export type CounterMode = "real" | "simulated";
export type Region =
  | "West Oahu"
  | "East Oahu"
  | "Maui Nui"
  | "Big Island"
  | "Mainland West"
  | "Unknown";

// ── STRIPE PAYMENT LINKS ──────────────────────────────────────
// Replace placeholder URLs with real Stripe payment link URLs
// when Stripe account is connected.

export const STRIPE_LINKS = {
  // A. Front-end pledge
  pledge: {
    internalName: "makoa_pledge_999",
    displayTitle: "Mākoa Pledge — $9.99",
    amount: 9.99,
    url: "https://buy.stripe.com/makoa_pledge_999", // REPLACE with real Stripe link
    redirectAfter: "/under-review",
    metadata: ["full_name", "email", "phone", "zip_code", "tier_interest", "source_region", "application_id"],
  },

  // B. Aliʻi deposit
  alii_deposit: {
    internalName: "makoa_alii_deposit_750",
    displayTitle: "Aliʻi Formation Deposit",
    amount: 750,
    url: "https://buy.stripe.com/makoa_alii_deposit_750", // REPLACE
    redirectAfter: "/seat-secured?tier=alii",
    metadata: ["full_name", "email", "phone", "zip_code", "tier", "application_id", "accepted_by", "review_date"],
  },

  // C. Aliʻi monthly subscription
  alii_monthly: {
    internalName: "makoa_alii_monthly_125x18",
    displayTitle: "Aliʻi Formation Plan",
    amount: 125,
    interval: "month",
    maxPayments: 18,
    url: "https://buy.stripe.com/makoa_alii_monthly_125x18", // REPLACE
    note: "Auto-cancel after 18 payments. Flag for manual admin review at month 18 if auto-stop unsupported.",
  },

  // D. Mana deposit
  mana_deposit: {
    internalName: "makoa_mana_deposit_250",
    displayTitle: "Mana Formation Deposit",
    amount: 250,
    url: "https://buy.stripe.com/makoa_mana_deposit_250", // REPLACE
    redirectAfter: "/seat-secured?tier=mana",
    metadata: ["full_name", "email", "phone", "zip_code", "tier", "application_id", "accepted_by", "review_date"],
  },

  // E. Mana monthly subscription
  mana_monthly: {
    internalName: "makoa_mana_monthly_42x18",
    displayTitle: "Mana Formation Plan",
    amount: 42,
    interval: "month",
    maxPayments: 18,
    url: "https://buy.stripe.com/makoa_mana_monthly_42x18", // REPLACE
    note: "Auto-cancel after 18 payments or manual stop.",
  },

  // F. Nā Koa deposit
  nakoa_deposit: {
    internalName: "makoa_nakoa_deposit_125",
    displayTitle: "Nā Koa Formation Deposit",
    amount: 125,
    url: "https://buy.stripe.com/makoa_nakoa_deposit_125", // REPLACE
    redirectAfter: "/seat-secured?tier=nakoa",
    metadata: ["full_name", "email", "phone", "zip_code", "tier", "application_id", "accepted_by", "review_date"],
  },

  // G. Nā Koa monthly subscription
  nakoa_monthly: {
    internalName: "makoa_nakoa_monthly_20x18",
    displayTitle: "Nā Koa Formation Plan",
    amount: 20,
    interval: "month",
    maxPayments: 18,
    url: "https://buy.stripe.com/makoa_nakoa_monthly_20x18", // REPLACE
    note: "Auto-cancel after 18 payments or manual stop.",
  },

  // H. Waitlist / overflow
  alii_waitlist: {
    internalName: "makoa_alii_waitlist_99",
    displayTitle: "Aliʻi Priority Waitlist",
    amount: 99,
    url: "https://buy.stripe.com/makoa_alii_waitlist_99", // REPLACE
    note: "Reserves place for next acceptance cycle. Does NOT guarantee current founding event entry.",
  },
  mana_waitlist: {
    internalName: "makoa_mana_waitlist_49",
    displayTitle: "Mana Priority Waitlist",
    amount: 49,
    url: "https://buy.stripe.com/makoa_mana_waitlist_49", // REPLACE
    note: "Reserves place for next acceptance cycle. Does NOT guarantee current founding event entry.",
  },
};

// ── SEAT CAPS ─────────────────────────────────────────────────
export const SEAT_CAPS: Record<Tier, number> = {
  alii: 12,
  mana: 20,
  nakoa: 72,
};

// ── SIMULATED SEAT STATE (admin-editable defaults) ────────────
// In production, replace with API call to Stripe or your DB.
export const SIMULATED_SEATS: Record<Tier, number> = {
  alii: 5,   // remaining
  mana: 7,   // remaining
  nakoa: 18, // remaining
};

// ── SEAT COUNTER LOGIC ────────────────────────────────────────
export type SeatStatus = "open" | "almost_full" | "critical" | "sold_out";

export interface SeatInfo {
  remaining: number;
  total: number;
  status: SeatStatus;
  label: string;
  urgencyColor: string;
  pulse: boolean;
}

export function getSeatInfo(tier: Tier, remaining: number): SeatInfo {
  const total = SEAT_CAPS[tier];
  const pct = remaining / total;

  let status: SeatStatus;
  let label: string;
  let urgencyColor: string;
  let pulse = false;

  if (remaining === 0) {
    status = "sold_out";
    label = tier === "alii"
      ? "Aliʻi founding council is full"
      : tier === "mana"
      ? "Mana formation is at capacity"
      : "Nā Koa intake rolling to next cycle";
    urgencyColor = "#4a4a4a";
  } else if (remaining === 1) {
    status = "critical";
    label = "1 seat remaining";
    urgencyColor = "#f85149";
    pulse = true;
  } else if (remaining <= 5 || pct <= 0.25) {
    status = "critical";
    label = `Almost Full — ${remaining} seats remaining`;
    urgencyColor = "#f85149";
    pulse = true;
  } else if (pct <= 0.5) {
    status = "almost_full";
    label = `${remaining} seats remaining`;
    urgencyColor = "#f0a030";
  } else {
    status = "open";
    label = tier === "nakoa" ? "Limited intake open" : `${remaining} seats remaining`;
    urgencyColor = "#3fb950";
  }

  return { remaining, total, status, label, urgencyColor, pulse };
}

// ── TIER FULL DETAILS ─────────────────────────────────────────
export const TIER_CONFIG = {
  alii: {
    icon: "👑",
    label: "Aliʻi",
    sub: "Network to Network",
    color: "#b08e50",
    deposit: 750,
    monthly: 125,
    months: 18,
    total: 2999,
    depositLink: STRIPE_LINKS.alii_deposit,
    monthlyLink: STRIPE_LINKS.alii_monthly,
    waitlistLink: STRIPE_LINKS.alii_waitlist,
    includes: [
      "May 1–4 Founding 72 · War Room",
      "4 Quarterly Hotel Summits INCLUDED",
      "Unlimited Monthly Full Moon House Gatherings",
      "Weekly Wednesday Elite Training · 4–6am",
      "Council access · founding vote",
      "B2B network · 11 Aliʻi brothers",
      "Founding crest + gear",
    ],
    emailCopy: "12 seats. No expansion. Your seat is not held.",
    soldOutMsg: "Aliʻi founding council is full.",
    waitlistMsg: "Next council review opens next moon cycle.",
  },
  mana: {
    icon: "🌀",
    label: "Mana",
    sub: "Build · B2B + B2C",
    color: "#58a6ff",
    deposit: 250,
    monthly: 42,
    months: 18,
    total: 999,
    depositLink: STRIPE_LINKS.mana_deposit,
    monthlyLink: STRIPE_LINKS.mana_monthly,
    waitlistLink: STRIPE_LINKS.mana_waitlist,
    includes: [
      "May 1–4 Founding 72 · Mastermind",
      "2 Quarterly Hotel Summits INCLUDED",
      "Unlimited Monthly Full Moon House Gatherings",
      "Weekly Wednesday Elite Training · 4–6am",
      "Wednesday school · job queue",
      "B2B pipeline access",
    ],
    emailCopy: "Core builders move fast. Secure your place.",
    soldOutMsg: "Mana formation is at capacity.",
    waitlistMsg: "Reserve the next opening.",
  },
  nakoa: {
    icon: "⚔",
    label: "Nā Koa",
    sub: "Serve · Peer 2 Peer",
    color: "#3fb950",
    deposit: 125,
    monthly: 20,
    months: 18,
    total: 499,
    depositLink: STRIPE_LINKS.nakoa_deposit,
    monthlyLink: STRIPE_LINKS.nakoa_monthly,
    waitlistLink: null,
    includes: [
      "May 1–4 Founding 72 Entry",
      "Unlimited Monthly Full Moon House Gatherings",
      "Weekly Wednesday Elite Training · 4–6am",
      "808 network access",
      "Path to Mana elevation",
    ],
    emailCopy: "Entry is open. Advancement is earned.",
    soldOutMsg: "Nā Koa intake rolling to next cycle.",
    waitlistMsg: "Join next intake.",
  },
} as const;

// ── TELEGRAM STRUCTURE ────────────────────────────────────────
export const TELEGRAM = {
  main: {
    name: "Mākoa Signal",
    handle: "@makoaorder",
    url: "https://t.me/makoaorder",
    desc: "Main announcements channel — all members",
  },
  bot: {
    name: "Mākoa Formation Bot",
    handle: "@MakoaFormationBot",
    url: "https://t.me/MakoaFormationBot",
    desc: "Verify payment · receive placement",
  },
  tiers: {
    alii: { name: "Mākoa Aliʻi War Room", url: "https://t.me/makoaalii", desc: "Private council group" },
    mana: { name: "Mākoa Mana Mastermind", url: "https://t.me/makoamana", desc: "Private builder group" },
    nakoa: { name: "Mākoa Nā Koa Training", url: "https://t.me/makoanakoatraining", desc: "Private training group" },
  },
  regions: {
    "West Oahu": { name: "Mākoa West Oahu", url: "https://t.me/makoawestoahu" },
    "East Oahu": { name: "Mākoa East Oahu", url: "https://t.me/makoaeastoahu" },
    "Maui Nui": { name: "Mākoa Maui Nui", url: "https://t.me/makoamauinui" },
    "Big Island": { name: "Mākoa Big Island", url: "https://t.me/makoabigisland" },
    "Mainland West": { name: "Mākoa Mainland West", url: "https://t.me/makoamainlandwest" },
    "Unknown": { name: "Mākoa Signal", url: "https://t.me/makoaorder" },
  },
};

// ── ZIP → REGION MAPPING ──────────────────────────────────────
const ZIP_REGIONS: Array<{ prefixes: string[]; region: Region }> = [
  { prefixes: ["967"], region: "West Oahu" },       // Kapolei, Ewa, Waianae, Pearl City
  { prefixes: ["968"], region: "East Oahu" },        // Honolulu, Kailua, Hawaii Kai
  { prefixes: ["9676", "9677", "9675"], region: "Maui Nui" }, // Maui, Molokai, Lanai
  { prefixes: ["9672", "9674", "9678"], region: "Big Island" }, // Hilo, Kona, Waimea
  { prefixes: ["9", "8", "7"], region: "Mainland West" }, // CA, NV, AZ (broad)
];

export function zipToRegion(zip: string): Region {
  const clean = zip.replace(/\D/g, "");
  for (const { prefixes, region } of ZIP_REGIONS) {
    if (prefixes.some((p) => clean.startsWith(p))) return region;
  }
  // Hawaii catch-all
  if (clean.startsWith("96")) return "West Oahu";
  // US mainland west
  if (["9", "8"].some((p) => clean.startsWith(p))) return "Mainland West";
  return "Unknown";
}

// ── APPLICATION ID GENERATOR ──────────────────────────────────
export function generateApplicationId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MKO-${ts}-${rand}`;
}

// ── LEGAL CLARITY TEXT ────────────────────────────────────────
export const LEGAL_TEXT =
  "The deposit secures your seat for the current founding cycle. Monthly formation payments continue your 18-month path. Acceptance does not guarantee permanent standing if payment obligations are not maintained.";

// ── ADMIN DEFAULT STATE ───────────────────────────────────────
export interface AdminState {
  counterMode: CounterMode;
  pledgeCount: number;
  acceptedCount: number;
  deposits: Record<Tier, number>;
  waitlist: Record<"alii" | "mana", number>;
  telegramQueue: number;
  regions: Record<Region, number>;
}

export const DEFAULT_ADMIN_STATE: AdminState = {
  counterMode: "simulated",
  pledgeCount: 23,
  acceptedCount: 17,
  deposits: { alii: 7, mana: 13, nakoa: 54 },
  waitlist: { alii: 4, mana: 2 },
  telegramQueue: 3,
  regions: {
    "West Oahu": 8,
    "East Oahu": 4,
    "Maui Nui": 3,
    "Big Island": 2,
    "Mainland West": 3,
    "Unknown": 1,
  },
};
