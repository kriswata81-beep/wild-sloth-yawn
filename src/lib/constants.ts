// ─── MĀKOA ORDER — SITE CONSTANTS ───────────────────────────────────────────
// Single source of truth for all platform-wide values.
// XI self-regenerative: if a value changes, change it HERE, not in 12 files.

// ─── Links ──────────────────────────────────────────────────────────────────
export const TELEGRAM_GROUP = "https://t.me/+dsS4Mz0p5wM4OGYx";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://makoa.live";
export const SUPPORT_EMAIL = "wakachief@gmail.com";

// ─── MAYDAY Event ───────────────────────────────────────────────────────────
export const MAYDAY_NAME = "MAYDAY MONTH — The Summit of Founders";
export const MAYDAY_DATE = "May 1 – June 1, 2026";
export const MAYDAY_DATE_SHORT = "May 2026";
export const MAYDAY_LOCATION = "West Oʻahu — Mākoa House + Kapolei";
export const MAYDAY_YEAR = 2026;

// 4-weekend structure
export const MAYDAY_WEEKENDS = [
  { num: 1, dates: "May 1–4",    moon: "Flower Moon",  theme: "First Founders Round",  gateClose: "April 25" },
  { num: 2, dates: "May 8–11",   moon: null,           theme: "Build Phase",            gateClose: "May 2"    },
  { num: 3, dates: "May 15–18",  moon: null,           theme: "Leadership Phase",       gateClose: "May 9"    },
  { num: 4, dates: "May 29–Jun 1", moon: "Blue Moon",  theme: "Final Founders Round",  gateClose: "May 23"   },
] as const;

// War Party Pack tiers
export const WAR_PARTY_PACKS = {
  full5Day:  { label: "Full 5-Day War Party Pack", duration: "Tue night → Mon morning", days: 5 },
  elite4Day: { label: "4-Day Elite Pack",           duration: "Wed → Mon",              days: 4 },
  builder3:  { label: "3-Day Builder Pack",         duration: "Thu → Mon",              days: 3 },
  dayPass:   { label: "Nā Koa Day Pass",            duration: "12 hours",               days: 0 },
} as const;

// ─── Makahiki ───────────────────────────────────────────────────────────────
export const MAKAHIKI_MONTH = "November";
export const MAKAHIKI_SEASON = "winter";

// ─── MAYDAY Seat Capacity (canonical) ──────────────────────────────────────
export const MAYDAY_SEATS = {
  alii:  { total: 48, label: "Aliʻi · Co-Founders (1% equity)",  price: 4997 },
  mana:  { total: 96, label: "Mana · War Room / 48h",             price: 397  },
  nakoa: { total: 48, label: "Nā Koa · Day Pass",                 price: 97   },
} as const;

// ─── Pricing (MAYDAY Month founding rates — close after May) ────────────────
export const MAYDAY_PRICING = {
  dayPass:    { label: "Nā Koa Day Pass",                    price: 97,   display: "$97"   },
  mastermind: { label: "Mana Mastermind",                    price: 197,  display: "$197"  },
  warRoom:    { label: "War Room / 48h",                     price: 397,  display: "$397"  },
  coFounder:  { label: "Aliʻi Co-Founder (1% equity + Hale Stone)", price: 4997, display: "$4,997" },
} as const;

export const FOUNDING_DUES = 497;
export const FOUNDING_DUES_DISPLAY = "$497/year";
export const GATE_ENTRY_FEE = 0;
export const GATE_ENTRY_DISPLAY = "FREE";
export const DEPOSIT_PERCENT = 0.25;
export const DEPOSIT_AMOUNT = Math.round(FOUNDING_DUES * DEPOSIT_PERCENT * 100) / 100;

// ─── Early Bird Cutoff ──────────────────────────────────────────────────────
export const EARLY_BIRD_CUTOFF = new Date("2026-04-15T23:59:59-10:00");

// ─── Revenue Split ──────────────────────────────────────────────────────────
export const SPLIT_BROTHER = 80;
export const SPLIT_HOUSE = 10;
export const SPLIT_ORDER = 10;

// ─── Design System ──────────────────────────────────────────────────────────
export const COLORS = {
  dark: "#04060a",
  gold: "#b08e50",
  goldDim: "rgba(176,142,80,0.5)",
  gold40: "rgba(176,142,80,0.4)",
  gold20: "rgba(176,142,80,0.2)",
  gold10: "rgba(176,142,80,0.1)",
  blue: "#58a6ff",
  green: "#3fb950",
  red: "#f85149",
  purple: "#bc8cff",
  orange: "#f0883e",
} as const;

// ─── Class Names ────────────────────────────────────────────────────────────
export const CLASSES = {
  alii: { label: "Aliʻi", description: "The Council — directors and elders" },
  mana: { label: "Mana", description: "The Builders — route operators and service providers" },
  nakoa: { label: "Nā Koa", description: "The Warriors — all brothers in formation" },
} as const;

// ─── XI Corporate Structure ────────────────────────────────────────────────
export const XI_CSUITE = {
  ceo: { title: "XI CEO", domain: "Chief Executive Intelligence", agents: ["XI", "ALPHA"] },
  cfo: { title: "XI CFO", domain: "Chief Financial Intelligence", agents: ["KILO"] },
  cto: { title: "XI CTO", domain: "Chief Technology Intelligence", agents: ["SIERRA", "PAPA"] },
  coo: { title: "XI COO", domain: "Chief Operations Intelligence", agents: ["ECHO", "OMEGA", "TANGO"] },
} as const;

// ─── Social Channels (via Blotato) ─────────────────────────────────────────
// Account IDs come from blotato_list_accounts. Re-pull when adding new platforms.
// Platform-specific required fields (pageId, privacyLevel, etc.) live in defaults
// below — UI can override per-post.
export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "threads"
  | "bluesky"
  | "linkedin";

export const SOCIAL_ACCOUNTS: Record<string, {
  platform: SocialPlatform;
  accountId: string;
  username: string;
  connected: boolean;
  defaults: Record<string, unknown>;
  label: string;
  color: string;
}> = {
  facebook: {
    platform: "facebook",
    accountId: "27169",
    username: "Makoa Brotherhood",
    connected: true,
    label: "Facebook",
    color: "#4267B2",
    defaults: { pageId: "988463247693052" },
  },
  instagram: {
    platform: "instagram",
    accountId: "41415",
    username: "@makoabrotherhood",
    connected: true,
    label: "Instagram",
    color: "#E4405F",
    defaults: {},
  },
  tiktok: {
    platform: "tiktok",
    accountId: "38279",
    username: "@makoa_brotherhood",
    connected: true,
    label: "TikTok",
    color: "#000000",
    defaults: {
      privacyLevel: "PUBLIC_TO_EVERYONE",
      disabledComments: false,
      disabledDuet: false,
      disabledStitch: false,
      isBrandedContent: false,
      isYourBrand: true,
      isAiGenerated: false,
    },
  },
  youtube: {
    platform: "youtube",
    accountId: "33625",
    username: "WakaChiefs (Makoa Brotherhood)",
    connected: true,
    label: "YouTube",
    color: "#FF0000",
    defaults: {
      privacyStatus: "public",
      shouldNotifySubscribers: true,
      isMadeForKids: false,
    },
  },
  twitter: {
    platform: "twitter",
    accountId: "16548",
    username: "@ChiefsWaka82172",
    connected: true,
    label: "Twitter / X",
    color: "#1DA1F2",
    defaults: {},
  },
  threads: {
    platform: "threads",
    accountId: "",
    username: "",
    connected: false,
    label: "Threads",
    color: "#000000",
    defaults: {},
  },
  linkedin: {
    platform: "linkedin",
    accountId: "",
    username: "",
    connected: false,
    label: "LinkedIn",
    color: "#0A66C2",
    defaults: {},
  },
} as const;

export const CONNECTED_SOCIAL_PLATFORMS = Object.values(SOCIAL_ACCOUNTS)
  .filter((a) => a.connected)
  .map((a) => a.platform);
