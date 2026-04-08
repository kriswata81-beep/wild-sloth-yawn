// Stripe product definitions
// All amounts in cents (USD)

export type ProductId =
  | "DUES_DOWN"
  // 12HR Day Pass (green)
  | "MAYDAY_DAY_PASS_EARLY"
  | "MAYDAY_DAY_PASS_LAST"
  // 24HR Mastermind (blue, 24 seats)
  | "MAYDAY_MASTERMIND_EARLY"
  | "MAYDAY_MASTERMIND_LAST"
  // 48HR War Room (gold, 24 seats)
  | "MAYDAY_WAR_ROOM_EARLY"
  | "MAYDAY_WAR_ROOM_LAST"
  // 72HR War Van VIP (gold, 12 seats)
  | "MAYDAY_WAR_VAN_EARLY"
  | "MAYDAY_WAR_VAN_LAST"
  // Team packs
  | "TEAM_WAR_VAN_3"
  | "TEAM_WAR_VAN_5"
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

  // ── 12HR DAY PASS (green) ─────────────────────────────────────────────────
  MAYDAY_DAY_PASS_EARLY: {
    id: "MAYDAY_DAY_PASS_EARLY",
    name: "MAYDAY 12HR Day Pass — Early Bird",
    description: "Full price early bird 12HR Day Pass · MAYDAY Founding 48",
    amount: 14900,
    displayPrice: "$149",
  },
  MAYDAY_DAY_PASS_LAST: {
    id: "MAYDAY_DAY_PASS_LAST",
    name: "MAYDAY 12HR Day Pass — Last Call",
    description: "Full price last call 12HR Day Pass · MAYDAY Founding 48",
    amount: 19900,
    displayPrice: "$199",
  },

  // ── 24HR MASTERMIND (blue, 24 seats) ─────────────────────────────────────
  MAYDAY_MASTERMIND_EARLY: {
    id: "MAYDAY_MASTERMIND_EARLY",
    name: "MAYDAY 24HR Mastermind — Early Bird",
    description: "Full price early bird 24HR Mastermind seat · MAYDAY Founding 48",
    amount: 29900,
    displayPrice: "$299",
  },
  MAYDAY_MASTERMIND_LAST: {
    id: "MAYDAY_MASTERMIND_LAST",
    name: "MAYDAY 24HR Mastermind — Last Call",
    description: "Full price last call 24HR Mastermind seat · MAYDAY Founding 48",
    amount: 39900,
    displayPrice: "$399",
  },

  // ── 48HR WAR ROOM (gold, 24 seats) ───────────────────────────────────────
  MAYDAY_WAR_ROOM_EARLY: {
    id: "MAYDAY_WAR_ROOM_EARLY",
    name: "MAYDAY 48HR War Room — Early Bird (25% Down)",
    description: "25% down on $499 48HR War Room early bird seat · MAYDAY Founding 48",
    amount: 12475,
    displayPrice: "$124.75",
  },
  MAYDAY_WAR_ROOM_LAST: {
    id: "MAYDAY_WAR_ROOM_LAST",
    name: "MAYDAY 48HR War Room — Last Call (25% Down)",
    description: "25% down on $699 48HR War Room last call seat · MAYDAY Founding 48",
    amount: 17475,
    displayPrice: "$174.75",
  },

  // ── 72HR WAR VAN VIP (gold, 12 seats) ────────────────────────────────────
  MAYDAY_WAR_VAN_EARLY: {
    id: "MAYDAY_WAR_VAN_EARLY",
    name: "MAYDAY 72HR War Van VIP — Early Bird (25% Down)",
    description: "25% down on $799 72HR War Van VIP early bird seat · MAYDAY Founding 48",
    amount: 19975,
    displayPrice: "$199.75",
  },
  MAYDAY_WAR_VAN_LAST: {
    id: "MAYDAY_WAR_VAN_LAST",
    name: "MAYDAY 72HR War Van VIP — Last Call (25% Down)",
    description: "25% down on $999 72HR War Van VIP last call seat · MAYDAY Founding 48",
    amount: 24975,
    displayPrice: "$249.75",
  },

  // ── TEAM PACKS ────────────────────────────────────────────────────────────
  TEAM_WAR_VAN_3: {
    id: "TEAM_WAR_VAN_3",
    name: "MAYDAY War Van VIP — Team of 3",
    description: "War Van VIP team pack · 3 brothers · $699/each · MAYDAY Founding 48",
    amount: 209700,
    displayPrice: "$2,097",
  },
  TEAM_WAR_VAN_5: {
    id: "TEAM_WAR_VAN_5",
    name: "MAYDAY War Van VIP — Team of 5",
    description: "War Van VIP team pack · 5 brothers · $649/each · MAYDAY Founding 48",
    amount: 324500,
    displayPrice: "$3,245",
  },
  TEAM_WAR_ROOM_3: {
    id: "TEAM_WAR_ROOM_3",
    name: "MAYDAY War Room — Team of 3",
    description: "War Room team pack · 3 brothers · $449/each · MAYDAY Founding 48",
    amount: 134700,
    displayPrice: "$1,347",
  },
  TEAM_MASTERMIND_3: {
    id: "TEAM_MASTERMIND_3",
    name: "MAYDAY Mastermind — Team of 3",
    description: "Mastermind team pack · 3 brothers · $265/each · MAYDAY Founding 48",
    amount: 79700,
    displayPrice: "$797",
  },
};

// April 15 Hawaii time (HST = UTC-10)
export const EARLY_BIRD_CUTOFF = new Date("2026-04-15T23:59:59-10:00");

export function isEarlyBird(): boolean {
  return Date.now() < EARLY_BIRD_CUTOFF.getTime();
}
