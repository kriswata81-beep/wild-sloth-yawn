// Stripe product definitions
// All amounts in cents (USD)

export type ProductId =
  | "DUES_DOWN"
  // 12HR Nā Koa Day Pass (green)
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
  // Team packs
  | "TEAM_WAR_PARTY_2"
  | "TEAM_WAR_PARTY_3"
  | "TEAM_WAR_PARTY_4"
  | "TEAM_WAR_ROOM_3"
  | "TEAM_MASTERMIND_3";

export interface Product {
  id: ProductId;
  name: string;
  description: string;
  amount: number; // in cents
  displayPrice: string;
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
    description: "Full price early bird 12HR Nā Koa Day Pass · MAYDAY Founding 48",
    amount: 14900,
    displayPrice: "$149",
  },
  MAYDAY_DAY_PASS_LAST: {
    id: "MAYDAY_DAY_PASS_LAST",
    name: "MAYDAY 12HR Nā Koa Day Pass — Last Call",
    description: "Full price last call 12HR Nā Koa Day Pass · MAYDAY Founding 48",
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

  // ── WAR PARTY TEAM PACKS ──────────────────────────────────────────────────
  TEAM_WAR_PARTY_2: {
    id: "TEAM_WAR_PARTY_2",
    name: "MAYDAY War Party VIP — Party of 2",
    description: "War Party VIP · 2 brothers · $749/each · Airport pickup/dropoff · MAYDAY Founding 48",
    amount: 149800,
    displayPrice: "$1,498",
  },
  TEAM_WAR_PARTY_3: {
    id: "TEAM_WAR_PARTY_3",
    name: "MAYDAY War Party VIP — Party of 3",
    description: "War Party VIP · 3 brothers · $699/each · Airport pickup/dropoff · MAYDAY Founding 48",
    amount: 209700,
    displayPrice: "$2,097",
  },
  TEAM_WAR_PARTY_4: {
    id: "TEAM_WAR_PARTY_4",
    name: "MAYDAY War Party VIP — Party of 4",
    description: "War Party VIP · 4 brothers · $649/each · Airport pickup/dropoff · MAYDAY Founding 48",
    amount: 259600,
    displayPrice: "$2,596",
  },
  TEAM_WAR_ROOM_3: {
    id: "TEAM_WAR_ROOM_3",
    name: "MAYDAY Aliʻi War Room — Team of 3",
    description: "Aliʻi War Room team pack · 3 brothers · $449/each · MAYDAY Founding 48",
    amount: 134700,
    displayPrice: "$1,347",
  },
  TEAM_MASTERMIND_3: {
    id: "TEAM_MASTERMIND_3",
    name: "MAYDAY Mana Mastermind — Team of 3",
    description: "Mana Mastermind team pack · 3 brothers · $265/each · MAYDAY Founding 48",
    amount: 79700,
    displayPrice: "$797",
  },
};

// April 15 Hawaii time (HST = UTC-10)
export const EARLY_BIRD_CUTOFF = new Date("2026-04-15T23:59:59-10:00");

export function isEarlyBird(): boolean {
  return Date.now() < EARLY_BIRD_CUTOFF.getTime();
}
