// Stripe product definitions
// All amounts in cents (USD)
// Hotel math: $275/night × 3 nights = $825/room (Hampton Inn Kapolei avg, verified Booking.com)
// Founders Dinner: $55/person (Hawaii-owned restaurant, Kapolei avg)
// Elite Ice Bath: $75/person/session × 3 sessions = $225/person

export type ProductId =
  | "DUES_DOWN"
  // 12HR Nā Koa Day Pass (green) — Saturday OR Sunday
  | "MAYDAY_DAY_PASS_EARLY"
  | "MAYDAY_DAY_PASS_LAST"
  // 24HR Mana Mastermind (blue, 24 seats)
  | "MAYDAY_MASTERMIND_EARLY"
  | "MAYDAY_MASTERMIND_LAST"
  // 48HR Aliʻi War Room (gold, 24 seats)
  | "MAYDAY_WAR_ROOM_EARLY"
  | "MAYDAY_WAR_ROOM_LAST"
  // 72HR War Party VIP (gold glowing, 5 war parties of 2–4)
  | "MAYDAY_WAR_VAN_EARLY"
  | "MAYDAY_WAR_VAN_LAST"
  // ── ALIĪ TRAVELING WAR PARTY PACKS (fly-in, 2-in-a-room, 72HR) ──────────
  // Party of 2: 1 room ($825) + dinner 2×$55 ($110) + ice bath 3×2×$75 ($450) = $1,385 cost → $1,598 price
  | "TEAM_WAR_PARTY_2"
  // Party of 3: 2 rooms ($1,650) + dinner 3×$55 ($165) + ice bath 3×3×$75 ($675) = $2,490 cost → $2,797 price
  | "TEAM_WAR_PARTY_3"
  // Party of 4: 2 rooms ($1,650) + dinner 4×$55 ($220) + ice bath 3×4×$75 ($900) = $2,770 cost → $2,997 price
  | "TEAM_WAR_PARTY_4"
  // ── DRIVE-UP / LOCAL PACKS (no hotel) ────────────────────────────────────
  // Aliī Team of 3: dinner 3×$55 ($165) + ice bath 3×3×$75 ($675) = $840 cost → $1,347 price
  | "TEAM_WAR_ROOM_3"
  // Mana Team of 3: ice bath 3×3×$75 ($675) only = $675 cost → $797 price
  | "TEAM_MASTERMIND_3";

export interface Product {
  id: ProductId;
  name: string;
  description: string;
  amount: number; // in cents
  displayPrice: string;
  travelType?: "fly-in" | "drive-up";
  partySize?: number;
  roomCount?: number;
}

export const PRODUCTS: Record<ProductId, Product> = {
  DUES_DOWN: {
    id: "DUES_DOWN",
    name: "Mākoa Order — Annual Dues (25% Down)",
    description: "25% down payment on $497 annual Mākoa Order founding rate membership dues",
    amount: 12425,
    displayPrice: "$124.25",
  },

  // ── 12HR NĀ KOA DAY PASS (green) ─────────────────────────────────────────
  MAYDAY_DAY_PASS_EARLY: {
    id: "MAYDAY_DAY_PASS_EARLY",
    name: "MAYDAY 12HR Nā Koa Day Pass — Early Bird",
    description: "Full price early bird 12HR Nā Koa Day Pass · MAYDAY Founding 48 · Choose Saturday or Sunday at checkout",
    amount: 14900,
    displayPrice: "$149",
  },
  MAYDAY_DAY_PASS_LAST: {
    id: "MAYDAY_DAY_PASS_LAST",
    name: "MAYDAY 12HR Nā Koa Day Pass — Last Call",
    description: "Full price last call 12HR Nā Koa Day Pass · MAYDAY Founding 48 · Choose Saturday or Sunday at checkout",
    amount: 19900,
    displayPrice: "$199",
  },

  // ── 24HR MANA MASTERMIND (blue, 24 seats) ────────────────────────────────
  MAYDAY_MASTERMIND_EARLY: {
    id: "MAYDAY_MASTERMIND_EARLY",
    name: "MAYDAY 24HR Mana Mastermind — Early Bird",
    description: "Full price early bird 24HR Mana Mastermind seat · MAYDAY Founding 48",
    amount: 29900,
    displayPrice: "$299",
  },
  MAYDAY_MASTERMIND_LAST: {
    id: "MAYDAY_MASTERMIND_LAST",
    name: "MAYDAY 24HR Mana Mastermind — Last Call",
    description: "Full price last call 24HR Mana Mastermind seat · MAYDAY Founding 48",
    amount: 39900,
    displayPrice: "$399",
  },

  // ── 48HR ALIʻI WAR ROOM (gold, 24 seats) ─────────────────────────────────
  MAYDAY_WAR_ROOM_EARLY: {
    id: "MAYDAY_WAR_ROOM_EARLY",
    name: "MAYDAY 48HR Aliʻi War Room — Early Bird (25% Down)",
    description: "25% down on $499 48HR Aliʻi War Room early bird seat · MAYDAY Founding 48",
    amount: 12475,
    displayPrice: "$124.75",
  },
  MAYDAY_WAR_ROOM_LAST: {
    id: "MAYDAY_WAR_ROOM_LAST",
    name: "MAYDAY 48HR Aliʻi War Room — Last Call (25% Down)",
    description: "25% down on $699 48HR Aliʻi War Room last call seat · MAYDAY Founding 48",
    amount: 17475,
    displayPrice: "$174.75",
  },

  // ── 72HR WAR PARTY VIP (gold glowing, 5 war parties of 2–4) ─────────────
  MAYDAY_WAR_VAN_EARLY: {
    id: "MAYDAY_WAR_VAN_EARLY",
    name: "MAYDAY 72HR War Party VIP — Early Bird (25% Down)",
    description: "25% down on $799 72HR War Party VIP early bird · MAYDAY Founding 48 · Airport pickup/dropoff included",
    amount: 19975,
    displayPrice: "$199.75",
  },
  MAYDAY_WAR_VAN_LAST: {
    id: "MAYDAY_WAR_VAN_LAST",
    name: "MAYDAY 72HR War Party VIP — Last Call (25% Down)",
    description: "25% down on $999 72HR War Party VIP last call · MAYDAY Founding 48 · Airport pickup/dropoff included",
    amount: 24975,
    displayPrice: "$249.75",
  },

  // ── ALIʻI TRAVELING WAR PARTY — FLY-IN (2-in-a-room, 72HR) ──────────────
  // Math verified: Hampton Inn Kapolei $275/night avg (Booking.com), 3 nights
  // Founders Dinner Sunday night, Hawaii-owned restaurant Kapolei, $55/person
  // Elite Ice Bath Reset: 3 sessions × $75/person

  TEAM_WAR_PARTY_2: {
    id: "TEAM_WAR_PARTY_2",
    name: "MAYDAY Aliʻi War Party — Fly-In Party of 2",
    description: "72HR · 2 brothers · 1 shared room (3 nights) · Founders Dinner · 3× Elite Ice Bath Reset · Airport pickup/dropoff · MAYDAY Founding 48",
    amount: 159800, // $1,598 — covers $1,385 hard cost + $213 margin
    displayPrice: "$1,598",
    travelType: "fly-in",
    partySize: 2,
    roomCount: 1,
  },
  TEAM_WAR_PARTY_3: {
    id: "TEAM_WAR_PARTY_3",
    name: "MAYDAY Aliʻi War Party — Fly-In Party of 3",
    description: "72HR · 3 brothers · 2 shared rooms (3 nights) · Founders Dinner · 3× Elite Ice Bath Reset · Airport pickup/dropoff · MAYDAY Founding 48",
    amount: 279700, // $2,797 — covers $2,490 hard cost + $307 margin
    displayPrice: "$2,797",
    travelType: "fly-in",
    partySize: 3,
    roomCount: 2,
  },
  TEAM_WAR_PARTY_4: {
    id: "TEAM_WAR_PARTY_4",
    name: "MAYDAY Aliʻi War Party — Fly-In Party of 4",
    description: "72HR · 4 brothers · 2 shared rooms (3 nights) · Founders Dinner · 3× Elite Ice Bath Reset · Airport pickup/dropoff · MAYDAY Founding 48",
    amount: 299700, // $2,997 — covers $2,770 hard cost + $227 margin
    displayPrice: "$2,997",
    travelType: "fly-in",
    partySize: 4,
    roomCount: 2,
  },

  // ── DRIVE-UP / LOCAL PACKS (no hotel needed) ─────────────────────────────
  TEAM_WAR_ROOM_3: {
    id: "TEAM_WAR_ROOM_3",
    name: "MAYDAY Aliʻi War Party — Drive-Up Team of 3",
    description: "72HR · 3 brothers · Drive-up/local · Founders Dinner Sunday night · 3× Elite Ice Bath Reset · MAYDAY Founding 48",
    amount: 134700, // $1,347 — covers $840 hard cost + $507 margin
    displayPrice: "$1,347",
    travelType: "drive-up",
    partySize: 3,
    roomCount: 0,
  },
  TEAM_MASTERMIND_3: {
    id: "TEAM_MASTERMIND_3",
    name: "MAYDAY Mana War Party — Drive-Up Team of 3",
    description: "72HR · 3 brothers · Drive-up/local · 3× Elite Ice Bath Reset · MAYDAY Founding 48",
    amount: 79700, // $797 — covers $675 hard cost + $122 margin
    displayPrice: "$797",
    travelType: "drive-up",
    partySize: 3,
    roomCount: 0,
  },
};

// April 15 Hawaii time (HST = UTC-10)
export const EARLY_BIRD_CUTOFF = new Date("2026-04-15T23:59:59-10:00");

export function isEarlyBird(): boolean {
  return Date.now() < EARLY_BIRD_CUTOFF.getTime();
}

// Day pass products that require day selection
export const DAY_PASS_PRODUCTS: ProductId[] = ["MAYDAY_DAY_PASS_EARLY", "MAYDAY_DAY_PASS_LAST"];

export function isDayPass(productId: string): boolean {
  return DAY_PASS_PRODUCTS.includes(productId as ProductId);
}
