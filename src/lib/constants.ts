// ─── MĀKOA ORDER — SITE CONSTANTS ───────────────────────────────────────────
// Single source of truth for all platform-wide values.
// XI self-regenerative: if a value changes, change it HERE, not in 12 files.

// ─── Links ──────────────────────────────────────────────────────────────────
export const TELEGRAM_GROUP = "https://t.me/+dsS4Mz0p5wM4OGYx";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://makoa.live";
export const SUPPORT_EMAIL = "wakachief@gmail.com";

// ─── MAYDAY Event ───────────────────────────────────────────────────────────
export const MAYDAY_NAME = "MAYDAY Summit Founders Event";
export const MAYDAY_DATE = "May 1–3, 2026";
export const MAYDAY_LOCATION = "Kapolei, Oʻahu";
export const MAYDAY_YEAR = 2026;

// ─── Makahiki ───────────────────────────────────────────────────────────────
export const MAKAHIKI_MONTH = "November";
export const MAKAHIKI_SEASON = "winter";

// ─── MAYDAY Seat Capacity (canonical) ──────────────────────────────────────
// Source of truth for total seats per tier. Display "X of Y" everywhere.
// "Remaining" counts should eventually pull live from Supabase payments table.
export const MAYDAY_SEATS = {
  alii: { total: 12, label: "Aliʻi · Co-Founders" },
  mana: { total: 24, label: "Mana · Mastermind" },
  nakoa: { total: 12, label: "Nā Koa · Day Pass" },
} as const;

// ─── Pricing ────────────────────────────────────────────────────────────────
export const FOUNDING_DUES = 497;
export const FOUNDING_DUES_DISPLAY = "$497/year";
export const GATE_ENTRY_FEE = 9.99;
export const GATE_ENTRY_DISPLAY = "$9.99";
export const DEPOSIT_PERCENT = 0.25;
export const DEPOSIT_AMOUNT = Math.round(FOUNDING_DUES * DEPOSIT_PERCENT * 100) / 100; // $124.25

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
  // Not yet connected — Steward to OAuth at my.blotato.com
  twitter: {
    platform: "twitter",
    accountId: "",
    username: "",
    connected: false,
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
