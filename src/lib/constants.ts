// ─── MĀKOA ORDER — SITE CONSTANTS ───────────────────────────────────────────
// Single source of truth for all platform-wide values.
// XI self-regenerative: if a value changes, change it HERE, not in 12 files.

// ─── Links ──────────────────────────────────────────────────────────────────
export const TELEGRAM_GROUP = "https://t.me/+dsS4Mz0p5wM4OGYx";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wild-sloth-yawn.vercel.app";
export const SUPPORT_EMAIL = "wakachief@gmail.com";

// ─── MAYDAY Event ───────────────────────────────────────────────────────────
export const MAYDAY_NAME = "MAYDAY Summit Founders Event";
export const MAYDAY_DATE = "May 1–3, 2026";
export const MAYDAY_LOCATION = "Kapolei, Oʻahu";
export const MAYDAY_YEAR = 2026;

// ─── Makahiki ───────────────────────────────────────────────────────────────
export const MAKAHIKI_MONTH = "November";
export const MAKAHIKI_SEASON = "winter";

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
