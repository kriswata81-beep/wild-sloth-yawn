// ─────────────────────────────────────────────────────────────
// MĀKOA ORDER — Master Data Model
// Single source of truth for all 8 tables.
// application_id is the primary key across all records.
// ─────────────────────────────────────────────────────────────

import { type Tier, type Region, zipToRegion, generateApplicationId, SEAT_CAPS, TIER_CONFIG } from "./makoa";

// ── SHARED ENUMS ──────────────────────────────────────────────

export type ReviewStatus = "pending" | "accepted" | "declined" | "waitlisted";
export type PaymentType = "pledge" | "deposit" | "subscription" | "waitlist";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "canceled";
export type PaymentMethod = "stripe" | "xrp" | "manual";
export type MembershipStatus = "invited" | "active" | "paused" | "delinquent" | "canceled" | "completed";
export type MemberStanding = "good" | "review" | "suspended";
export type EntitlementType = "included" | "upgrade_required" | "paid_day_pass" | "not_eligible";
export type EntitlementStatus = "available" | "reserved" | "used" | "expired";
export type WaitlistStatus = "active" | "offered" | "converted" | "expired";
export type EventType = "founding_72" | "quarterly_hotel" | "monthly_full_moon" | "weekly_training" | "day_pass";
export type EventStatus = "upcoming" | "open" | "full" | "closed" | "archived";
export type TierAccess = "all" | "alii_mana" | "alii_only" | "nakoa_paid_only";
export type VerificationMethod = "auto" | "manual";
export type TelegramBadge = "unverified" | "verified" | "routed" | "complete";
export type AdminActionType =
  | "accepted_applicant" | "declined_applicant" | "changed_tier"
  | "sent_seat_offer" | "marked_payment_verified" | "manually_routed_telegram"
  | "added_waitlist" | "adjusted_seat_counter" | "created_membership"
  | "paused_membership" | "resumed_membership" | "flagged_review";

// ── TABLE 1: APPLICANTS ───────────────────────────────────────

export interface Applicant {
  application_id: string;
  created_at: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  zip_code: string;
  city: string;
  island: string;
  region: Region;
  tier_interest: Tier | "unknown";
  source_region: string;
  referral_source: string;
  challenge_selected: string;
  value_brought: string;
  short_answer_1: string;
  short_answer_2: string;
  oath_taken: boolean;
  pledge_paid: boolean;
  pledge_payment_id: string;
  review_status: ReviewStatus;
  review_tier: Tier | "none";
  reviewed_by: string;
  review_date: string;
  acceptance_window_expires_at: string;
  notes_internal: string;
  seat_offer_sent: boolean;
  seat_offer_sent_at: string;
}

// ── TABLE 2: PAYMENTS ─────────────────────────────────────────

export interface Payment {
  payment_id: string;
  application_id: string;
  stripe_payment_link_name: string;
  stripe_session_id: string;
  external_payment_method: PaymentMethod;
  payment_type: PaymentType;
  tier: Tier | "none";
  amount: number;
  currency: string;
  payment_status: PaymentStatus;
  paid_at: string;
  billing_cycle_number: number;
  subscription_active: boolean;
  subscription_start_date: string;
  subscription_end_date: string;
  months_paid_count: number;
  next_due_date: string;
  last_payment_date: string;
  manual_verification_required: boolean;
  notes_internal: string;
}

// ── TABLE 3: MEMBERSHIPS ──────────────────────────────────────

export interface Membership {
  membership_id: string;
  application_id: string;
  full_name: string;
  email: string;
  phone: string;
  tier: Tier;
  membership_status: MembershipStatus;
  founding_cycle: string;
  formation_start_date: string;
  formation_end_date: string;
  deposit_paid: boolean;
  deposit_paid_at: string;
  monthly_plan_active: boolean;
  standing: MemberStanding;
  region: Region;
  chapter_house: string;
  local_group_name: string;
  telegram_required: boolean;
  telegram_joined: boolean;
  onboarding_complete: boolean;
  // Entitlement counters
  quarterly_hotel_events_included_total: number;
  quarterly_hotel_events_used: number;
  monthly_full_moon_events_unlimited: boolean;
  weekly_wed_training_unlimited: boolean;
  may_founding_72_included: boolean;
}

// ── TABLE 4: TELEGRAM PROFILES ────────────────────────────────

export interface TelegramProfile {
  telegram_profile_id: string;
  application_id: string;
  full_name: string;
  email: string;
  telegram_handle: string;
  telegram_user_id: string;
  tier: Tier | "unknown";
  zip_code: string;
  region: Region;
  payment_verified: boolean;
  routed_tier_group: string;
  routed_region_group: string;
  joined_main_channel: boolean;
  joined_private_group: boolean;
  joined_region_group: boolean;
  onboarding_complete: boolean;
  verification_method: VerificationMethod;
  flagged_for_review: boolean;
  last_bot_interaction_at: string;
}

// ── TABLE 5: EVENTS ───────────────────────────────────────────

export interface MakoaEvent {
  event_id: string;
  event_name: string;
  event_type: EventType;
  start_date: string;
  end_date: string;
  location_name: string;
  island: string;
  host_chapter: string;
  capacity_total: number;
  capacity_remaining: number;
  tier_access: TierAccess;
  status: EventStatus;
  notes_public: string;
  notes_internal: string;
}

// ── TABLE 6: EVENT ENTITLEMENTS ───────────────────────────────

export interface EventEntitlement {
  entitlement_id: string;
  application_id: string;
  membership_id: string;
  event_id: string;
  tier: Tier;
  entitlement_type: EntitlementType;
  entitlement_status: EntitlementStatus;
  reservation_date: string;
  check_in_status: "not_checked_in" | "checked_in";
  notes_internal: string;
}

// ── TABLE 7: WAITLIST ─────────────────────────────────────────

export interface WaitlistEntry {
  waitlist_id: string;
  application_id: string;
  full_name: string;
  email: string;
  phone: string;
  requested_tier: Tier;
  requested_event_id: string;
  waitlist_status: WaitlistStatus;
  priority_level: "normal" | "priority";
  joined_at: string;
  offered_at: string;
  expires_at: string;
  notes_internal: string;
}

// ── TABLE 8: ADMIN ACTIVITY LOG ───────────────────────────────

export interface AdminActivityLog {
  log_id: string;
  admin_user: string;
  action_type: AdminActionType;
  application_id: string;
  target_table: string;
  action_summary: string;
  created_at: string;
}

// ── MASTER DB STORE ───────────────────────────────────────────

export interface MakoaDB {
  applicants: Applicant[];
  payments: Payment[];
  memberships: Membership[];
  telegram_profiles: TelegramProfile[];
  events: MakoaEvent[];
  event_entitlements: EventEntitlement[];
  waitlist: WaitlistEntry[];
  admin_activity_log: AdminActivityLog[];
  // Counter mode
  counterMode: "real" | "simulated";
  simulatedSeats: Record<Tier, number>;
}

// ── SEED EVENTS ───────────────────────────────────────────────

const SEED_EVENTS: MakoaEvent[] = [
  {
    event_id: "EVT-FOUNDING-72",
    event_name: "Mākoa 1st Roundup — The 72",
    event_type: "founding_72",
    start_date: "2026-05-01",
    end_date: "2026-05-04",
    location_name: "Hotel · Kapolei",
    island: "Oahu",
    host_chapter: "West Oahu",
    capacity_total: 104,
    capacity_remaining: 30,
    tier_access: "all",
    status: "open",
    notes_public: "The founding event. War Room for Aliʻi, Mastermind for Mana, 2-day pass for Nā Koa.",
    notes_internal: "Aliʻi cap 12, Mana cap 20, Nā Koa cap 72.",
  },
  {
    event_id: "EVT-Q1-HOTEL",
    event_name: "Q1 Quarterly Hotel Summit",
    event_type: "quarterly_hotel",
    start_date: "2026-08-01",
    end_date: "2026-08-03",
    location_name: "Hotel · TBD",
    island: "Oahu",
    host_chapter: "West Oahu",
    capacity_total: 32,
    capacity_remaining: 32,
    tier_access: "alii_mana",
    status: "upcoming",
    notes_public: "Aliʻi and Mana included. Nā Koa upgrade available.",
    notes_internal: "",
  },
  {
    event_id: "EVT-MOON-MAY",
    event_name: "Flower Moon Full Moon Gathering",
    event_type: "monthly_full_moon",
    start_date: "2026-05-12",
    end_date: "2026-05-12",
    location_name: "Mākoa House · West Oahu",
    island: "Oahu",
    host_chapter: "West Oahu",
    capacity_total: 200,
    capacity_remaining: 200,
    tier_access: "all",
    status: "upcoming",
    notes_public: "Monthly full moon gathering. All members welcome.",
    notes_internal: "",
  },
  {
    event_id: "EVT-WED-TRAINING",
    event_name: "Wednesday Elite Training",
    event_type: "weekly_training",
    start_date: "2026-04-15",
    end_date: "2026-04-15",
    location_name: "Your ZIP Cluster",
    island: "Oahu",
    host_chapter: "West Oahu",
    capacity_total: 500,
    capacity_remaining: 500,
    tier_access: "all",
    status: "open",
    notes_public: "4am–6am every Wednesday. Ice bath + sauna. Location via Telegram.",
    notes_internal: "",
  },
];

// ── SEED DEMO MEMBERS ─────────────────────────────────────────

function makeSeedApplicant(overrides: Partial<Applicant> & { full_name: string; email: string; tier_interest: Tier; review_status: ReviewStatus; pledge_paid: boolean }): Applicant {
  const id = generateApplicationId();
  const [first, ...rest] = overrides.full_name.split(" ");
  const zip = overrides.zip_code || "96707";
  return {
    application_id: id,
    created_at: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
    full_name: overrides.full_name,
    first_name: first,
    last_name: rest.join(" "),
    email: overrides.email,
    phone: "+1 808 555 0100",
    zip_code: zip,
    city: "Kapolei",
    island: "Oahu",
    region: zipToRegion(zip),
    tier_interest: overrides.tier_interest,
    source_region: "West Oahu",
    referral_source: "QR Code",
    challenge_selected: "Scaling what I built",
    value_brought: "Leadership and vision",
    short_answer_1: "Leadership and vision",
    short_answer_2: "Scaling what I built",
    oath_taken: true,
    pledge_paid: overrides.pledge_paid,
    pledge_payment_id: overrides.pledge_paid ? `pi_${Math.random().toString(36).slice(2, 12)}` : "",
    review_status: overrides.review_status,
    review_tier: overrides.review_status === "accepted" ? overrides.tier_interest : "none",
    reviewed_by: overrides.review_status !== "pending" ? "XI Committee" : "",
    review_date: overrides.review_status !== "pending" ? new Date().toISOString() : "",
    acceptance_window_expires_at: overrides.review_status === "accepted" ? new Date(Date.now() + 48 * 3600000).toISOString() : "",
    notes_internal: overrides.notes_internal || "",
    seat_offer_sent: overrides.review_status === "accepted",
    seat_offer_sent_at: overrides.review_status === "accepted" ? new Date().toISOString() : "",
  };
}

const SEED_APPLICANTS: Applicant[] = [
  makeSeedApplicant({ full_name: "Kai Makoa", email: "kai@example.com", tier_interest: "alii", review_status: "accepted", pledge_paid: true, zip_code: "96707" }),
  makeSeedApplicant({ full_name: "Lono Kahananui", email: "lono@example.com", tier_interest: "mana", review_status: "accepted", pledge_paid: true, zip_code: "96707" }),
  makeSeedApplicant({ full_name: "Hoku Akana", email: "hoku@example.com", tier_interest: "nakoa", review_status: "accepted", pledge_paid: true, zip_code: "96707" }),
  makeSeedApplicant({ full_name: "Mana Kealoha", email: "mana@example.com", tier_interest: "mana", review_status: "pending", pledge_paid: true, zip_code: "96816" }),
  makeSeedApplicant({ full_name: "Ikaika Pono", email: "ikaika@example.com", tier_interest: "alii", review_status: "pending", pledge_paid: true, zip_code: "96793" }),
  makeSeedApplicant({ full_name: "Noa Waiwai", email: "noa@example.com", tier_interest: "nakoa", review_status: "waitlisted", pledge_paid: true, zip_code: "96720" }),
];

function makeSeedPayment(applicant: Applicant, type: PaymentType, tier: Tier | "none", amount: number, status: PaymentStatus = "paid"): Payment {
  return {
    payment_id: `pay_${Math.random().toString(36).slice(2, 12)}`,
    application_id: applicant.application_id,
    stripe_payment_link_name: type === "pledge" ? "makoa_pledge_999" : type === "deposit" ? `makoa_${tier}_deposit` : `makoa_${tier}_monthly`,
    stripe_session_id: `cs_${Math.random().toString(36).slice(2, 16)}`,
    external_payment_method: "stripe",
    payment_type: type,
    tier,
    amount,
    currency: "usd",
    payment_status: status,
    paid_at: new Date(Date.now() - Math.random() * 3 * 86400000).toISOString(),
    billing_cycle_number: type === "subscription" ? 1 : 0,
    subscription_active: type === "subscription",
    subscription_start_date: type === "subscription" ? new Date().toISOString() : "",
    subscription_end_date: "",
    months_paid_count: type === "subscription" ? 1 : 0,
    next_due_date: type === "subscription" ? new Date(Date.now() + 30 * 86400000).toISOString() : "",
    last_payment_date: new Date().toISOString(),
    manual_verification_required: false,
    notes_internal: "",
  };
}

function makeSeedMembership(applicant: Applicant, tier: Tier): Membership {
  const cfg = TIER_CONFIG[tier];
  return {
    membership_id: `mem_${Math.random().toString(36).slice(2, 10)}`,
    application_id: applicant.application_id,
    full_name: applicant.full_name,
    email: applicant.email,
    phone: applicant.phone,
    tier,
    membership_status: "active",
    founding_cycle: "may_2026",
    formation_start_date: new Date().toISOString(),
    formation_end_date: new Date(Date.now() + 18 * 30 * 86400000).toISOString(),
    deposit_paid: true,
    deposit_paid_at: new Date().toISOString(),
    monthly_plan_active: true,
    standing: "good",
    region: applicant.region,
    chapter_house: "West Oahu Chapter House",
    local_group_name: tier === "alii" ? "Mākoa Aliʻi War Room" : tier === "mana" ? "Mākoa Mana Mastermind" : "Mākoa Nā Koa Training",
    telegram_required: true,
    telegram_joined: true,
    onboarding_complete: false,
    quarterly_hotel_events_included_total: tier === "alii" ? 4 : tier === "mana" ? 2 : 0,
    quarterly_hotel_events_used: 0,
    monthly_full_moon_events_unlimited: true,
    weekly_wed_training_unlimited: true,
    may_founding_72_included: true,
  };
}

// ── INITIAL DB STATE ──────────────────────────────────────────

function buildInitialDB(): MakoaDB {
  const applicants = SEED_APPLICANTS;
  const payments: Payment[] = [];
  const memberships: Membership[] = [];
  const telegram_profiles: TelegramProfile[] = [];

  // Build payments + memberships for accepted applicants
  for (const a of applicants) {
    if (a.pledge_paid) {
      payments.push(makeSeedPayment(a, "pledge", "none", 9.99));
    }
    if (a.review_status === "accepted") {
      const tier = a.tier_interest as Tier;
      const cfg = TIER_CONFIG[tier];
      payments.push(makeSeedPayment(a, "deposit", tier, cfg.deposit));
      payments.push(makeSeedPayment(a, "subscription", tier, cfg.monthly));
      memberships.push(makeSeedMembership(a, tier));
      telegram_profiles.push({
        telegram_profile_id: `tg_${Math.random().toString(36).slice(2, 10)}`,
        application_id: a.application_id,
        full_name: a.full_name,
        email: a.email,
        telegram_handle: `@${a.first_name.toLowerCase()}`,
        telegram_user_id: Math.floor(Math.random() * 9000000 + 1000000).toString(),
        tier,
        zip_code: a.zip_code,
        region: a.region,
        payment_verified: true,
        routed_tier_group: tier === "alii" ? "Mākoa Aliʻi War Room" : tier === "mana" ? "Mākoa Mana Mastermind" : "Mākoa Nā Koa Training",
        routed_region_group: `Mākoa ${a.region}`,
        joined_main_channel: true,
        joined_private_group: true,
        joined_region_group: true,
        onboarding_complete: false,
        verification_method: "auto",
        flagged_for_review: false,
        last_bot_interaction_at: new Date().toISOString(),
      });
    }
  }

  // Simulated seats = cap minus paid deposits
  const depositsByTier = (t: Tier) => payments.filter(p => p.payment_type === "deposit" && p.tier === t && p.payment_status === "paid").length;

  return {
    applicants,
    payments,
    memberships,
    telegram_profiles,
    events: SEED_EVENTS,
    event_entitlements: [],
    waitlist: [],
    admin_activity_log: [],
    counterMode: "simulated",
    simulatedSeats: {
      alii: SEAT_CAPS.alii - depositsByTier("alii"),
      mana: SEAT_CAPS.mana - depositsByTier("mana"),
      nakoa: SEAT_CAPS.nakoa - depositsByTier("nakoa"),
    },
  };
}

export const INITIAL_DB = buildInitialDB();

// ── DB OPERATIONS ─────────────────────────────────────────────

export function computeRealSeats(payments: Payment[]): Record<Tier, number> {
  const sold = (t: Tier) => payments.filter(p => p.payment_type === "deposit" && p.tier === t && p.payment_status === "paid").length;
  return {
    alii: Math.max(0, SEAT_CAPS.alii - sold("alii")),
    mana: Math.max(0, SEAT_CAPS.mana - sold("mana")),
    nakoa: Math.max(0, SEAT_CAPS.nakoa - sold("nakoa")),
  };
}

export function getSeatsRemaining(db: MakoaDB): Record<Tier, number> {
  if (db.counterMode === "real") return computeRealSeats(db.payments);
  return db.simulatedSeats;
}

// Rule 1: After $9.99 pledge paid
export function applyPledgePaid(db: MakoaDB, data: {
  full_name: string; email: string; phone: string; zip_code: string;
  tier_interest: Tier; q1: string; q2: string; q3: string;
  application_id: string;
}): MakoaDB {
  const existing = db.applicants.find(a => a.email === data.email);
  const region = zipToRegion(data.zip_code);
  const [first, ...rest] = data.full_name.split(" ");
  const paymentId = `pi_${Math.random().toString(36).slice(2, 12)}`;

  const applicant: Applicant = existing ? {
    ...existing,
    pledge_paid: true,
    pledge_payment_id: paymentId,
    review_status: "pending",
  } : {
    application_id: data.application_id,
    created_at: new Date().toISOString(),
    full_name: data.full_name,
    first_name: first,
    last_name: rest.join(" "),
    email: data.email,
    phone: data.phone,
    zip_code: data.zip_code,
    city: "",
    island: region.includes("Oahu") ? "Oahu" : region === "Maui Nui" ? "Maui" : region === "Big Island" ? "Big Island" : "Unknown",
    region,
    tier_interest: data.tier_interest,
    source_region: region,
    referral_source: "Landing Page",
    challenge_selected: data.q2,
    value_brought: data.q1,
    short_answer_1: data.q1,
    short_answer_2: data.q2,
    oath_taken: true,
    pledge_paid: true,
    pledge_payment_id: paymentId,
    review_status: "pending",
    review_tier: "none",
    reviewed_by: "",
    review_date: "",
    acceptance_window_expires_at: "",
    notes_internal: "",
    seat_offer_sent: false,
    seat_offer_sent_at: "",
  };

  const payment: Payment = {
    payment_id: paymentId,
    application_id: data.application_id,
    stripe_payment_link_name: "makoa_pledge_999",
    stripe_session_id: "",
    external_payment_method: "stripe",
    payment_type: "pledge",
    tier: "none",
    amount: 9.99,
    currency: "usd",
    payment_status: "paid",
    paid_at: new Date().toISOString(),
    billing_cycle_number: 0,
    subscription_active: false,
    subscription_start_date: "",
    subscription_end_date: "",
    months_paid_count: 0,
    next_due_date: "",
    last_payment_date: new Date().toISOString(),
    manual_verification_required: false,
    notes_internal: "",
  };

  const log: AdminActivityLog = {
    log_id: `log_${Date.now()}`,
    admin_user: "system",
    action_type: "accepted_applicant",
    application_id: data.application_id,
    target_table: "applicants",
    action_summary: `Pledge paid by ${data.full_name} (${data.email}) — review_status set to pending`,
    created_at: new Date().toISOString(),
  };

  return {
    ...db,
    applicants: existing
      ? db.applicants.map(a => a.application_id === existing.application_id ? applicant : a)
      : [...db.applicants, applicant],
    payments: [...db.payments, payment],
    admin_activity_log: [...db.admin_activity_log, log],
  };
}

// Rule 2: Admin accepts applicant
export function applyAcceptance(db: MakoaDB, application_id: string, tier: Tier, reviewed_by = "XI Committee"): MakoaDB {
  const log: AdminActivityLog = {
    log_id: `log_${Date.now()}`,
    admin_user: reviewed_by,
    action_type: "accepted_applicant",
    application_id,
    target_table: "applicants",
    action_summary: `Accepted into ${tier} tier`,
    created_at: new Date().toISOString(),
  };
  return {
    ...db,
    applicants: db.applicants.map(a => a.application_id === application_id ? {
      ...a,
      review_status: "accepted",
      review_tier: tier,
      reviewed_by,
      review_date: new Date().toISOString(),
      acceptance_window_expires_at: new Date(Date.now() + 48 * 3600000).toISOString(),
      seat_offer_sent: true,
      seat_offer_sent_at: new Date().toISOString(),
    } : a),
    admin_activity_log: [...db.admin_activity_log, log],
  };
}

// Rule 3: After deposit paid — create membership, decrement seat
export function applyDepositPaid(db: MakoaDB, application_id: string, tier: Tier): MakoaDB {
  const applicant = db.applicants.find(a => a.application_id === application_id);
  if (!applicant) return db;

  const cfg = TIER_CONFIG[tier];
  const depositPayment: Payment = {
    payment_id: `dep_${Math.random().toString(36).slice(2, 12)}`,
    application_id,
    stripe_payment_link_name: cfg.depositLink.internalName,
    stripe_session_id: "",
    external_payment_method: "stripe",
    payment_type: "deposit",
    tier,
    amount: cfg.deposit,
    currency: "usd",
    payment_status: "paid",
    paid_at: new Date().toISOString(),
    billing_cycle_number: 0,
    subscription_active: false,
    subscription_start_date: "",
    subscription_end_date: "",
    months_paid_count: 0,
    next_due_date: "",
    last_payment_date: new Date().toISOString(),
    manual_verification_required: false,
    notes_internal: "",
  };

  const membership: Membership = {
    membership_id: `mem_${Math.random().toString(36).slice(2, 10)}`,
    application_id,
    full_name: applicant.full_name,
    email: applicant.email,
    phone: applicant.phone,
    tier,
    membership_status: "active",
    founding_cycle: "may_2026",
    formation_start_date: new Date().toISOString(),
    formation_end_date: new Date(Date.now() + 18 * 30 * 86400000).toISOString(),
    deposit_paid: true,
    deposit_paid_at: new Date().toISOString(),
    monthly_plan_active: false,
    standing: "good",
    region: applicant.region,
    chapter_house: `${applicant.region} Chapter House`,
    local_group_name: tier === "alii" ? "Mākoa Aliʻi War Room" : tier === "mana" ? "Mākoa Mana Mastermind" : "Mākoa Nā Koa Training",
    telegram_required: true,
    telegram_joined: false,
    onboarding_complete: false,
    quarterly_hotel_events_included_total: tier === "alii" ? 4 : tier === "mana" ? 2 : 0,
    quarterly_hotel_events_used: 0,
    monthly_full_moon_events_unlimited: true,
    weekly_wed_training_unlimited: true,
    may_founding_72_included: true,
  };

  const log: AdminActivityLog = {
    log_id: `log_${Date.now()}`,
    admin_user: "system",
    action_type: "created_membership",
    application_id,
    target_table: "memberships",
    action_summary: `Deposit paid — ${tier} membership created for ${applicant.full_name}`,
    created_at: new Date().toISOString(),
  };

  // Decrement simulated seat counter
  const newSimulated = { ...db.simulatedSeats };
  if (db.counterMode === "simulated") {
    newSimulated[tier] = Math.max(0, newSimulated[tier] - 1);
  }

  return {
    ...db,
    payments: [...db.payments, depositPayment],
    memberships: [...db.memberships, membership],
    simulatedSeats: newSimulated,
    admin_activity_log: [...db.admin_activity_log, log],
  };
}

// Rule 5: Telegram verification
export function applyTelegramVerified(db: MakoaDB, application_id: string, telegram_handle: string): MakoaDB {
  const applicant = db.applicants.find(a => a.application_id === application_id);
  const membership = db.memberships.find(m => m.application_id === application_id);
  if (!applicant || !membership) return db;

  const existing = db.telegram_profiles.find(t => t.application_id === application_id);
  const profile: TelegramProfile = existing ? {
    ...existing,
    payment_verified: true,
    telegram_handle,
    joined_main_channel: true,
    joined_private_group: true,
    joined_region_group: true,
    routed_tier_group: membership.local_group_name,
    routed_region_group: `Mākoa ${applicant.region}`,
    last_bot_interaction_at: new Date().toISOString(),
  } : {
    telegram_profile_id: `tg_${Math.random().toString(36).slice(2, 10)}`,
    application_id,
    full_name: applicant.full_name,
    email: applicant.email,
    telegram_handle,
    telegram_user_id: "",
    tier: membership.tier,
    zip_code: applicant.zip_code,
    region: applicant.region,
    payment_verified: true,
    routed_tier_group: membership.local_group_name,
    routed_region_group: `Mākoa ${applicant.region}`,
    joined_main_channel: true,
    joined_private_group: true,
    joined_region_group: true,
    onboarding_complete: false,
    verification_method: "auto",
    flagged_for_review: false,
    last_bot_interaction_at: new Date().toISOString(),
  };

  const log: AdminActivityLog = {
    log_id: `log_${Date.now()}`,
    admin_user: "system",
    action_type: "manually_routed_telegram",
    application_id,
    target_table: "telegram_profiles",
    action_summary: `Telegram verified for ${applicant.full_name} — routed to ${membership.local_group_name}`,
    created_at: new Date().toISOString(),
  };

  return {
    ...db,
    memberships: db.memberships.map(m => m.application_id === application_id ? { ...m, telegram_joined: true } : m),
    telegram_profiles: existing
      ? db.telegram_profiles.map(t => t.application_id === application_id ? profile : t)
      : [...db.telegram_profiles, profile],
    admin_activity_log: [...db.admin_activity_log, log],
  };
}

// ── COMPUTED VIEWS ────────────────────────────────────────────

export interface FunnelStats {
  totalPledges: number;
  pendingReview: number;
  accepted: number;
  declined: number;
  waitlisted: number;
  depositsTotal: number;
  activeMemberships: number;
  delinquentMemberships: number;
  activeSubscriptions: number;
  failedPayments: number;
  refundedPayments: number;
  telegramUnverified: number;
  telegramVerifiedNotRouted: number;
  telegramRoutedIncomplete: number;
  waitlistCount: number;
  depositRevenue: number;
  subscriptionRevenue: number;
  tierBreakdown: Record<Tier, { pending: number; accepted: number; paid: number }>;
  regionBreakdown: Record<Region, number>;
  eventUsage: {
    quarterlyUsed: number;
    quarterlyIncluded: number;
    monthlyAttendance: number;
    weeklyAttendance: number;
  };
}

export function computeFunnelStats(db: MakoaDB): FunnelStats {
  const { applicants, payments, memberships, telegram_profiles, waitlist } = db;

  const tierBreakdown: Record<Tier, { pending: number; accepted: number; paid: number }> = {
    alii: { pending: 0, accepted: 0, paid: 0 },
    mana: { pending: 0, accepted: 0, paid: 0 },
    nakoa: { pending: 0, accepted: 0, paid: 0 },
  };

  for (const a of applicants) {
    const t = a.tier_interest as Tier;
    if (!["alii", "mana", "nakoa"].includes(t)) continue;
    if (a.review_status === "pending") tierBreakdown[t].pending++;
    if (a.review_status === "accepted") tierBreakdown[t].accepted++;
  }
  for (const m of memberships) {
    if (m.deposit_paid) tierBreakdown[m.tier].paid++;
  }

  const regionBreakdown: Record<Region, number> = {
    "West Oahu": 0, "East Oahu": 0, "Maui Nui": 0, "Big Island": 0, "Mainland West": 0, "Unknown": 0,
  };
  for (const a of applicants) regionBreakdown[a.region]++;

  const depositPayments = payments.filter(p => p.payment_type === "deposit" && p.payment_status === "paid");
  const subPayments = payments.filter(p => p.payment_type === "subscription" && p.payment_status === "paid");

  const quarterlyIncluded = memberships.reduce((s, m) => s + m.quarterly_hotel_events_included_total, 0);
  const quarterlyUsed = memberships.reduce((s, m) => s + m.quarterly_hotel_events_used, 0);

  return {
    totalPledges: applicants.filter(a => a.pledge_paid).length,
    pendingReview: applicants.filter(a => a.review_status === "pending").length,
    accepted: applicants.filter(a => a.review_status === "accepted").length,
    declined: applicants.filter(a => a.review_status === "declined").length,
    waitlisted: applicants.filter(a => a.review_status === "waitlisted").length,
    depositsTotal: depositPayments.length,
    activeMemberships: memberships.filter(m => m.membership_status === "active").length,
    delinquentMemberships: memberships.filter(m => m.membership_status === "delinquent").length,
    activeSubscriptions: memberships.filter(m => m.monthly_plan_active).length,
    failedPayments: payments.filter(p => p.payment_status === "failed").length,
    refundedPayments: payments.filter(p => p.payment_status === "refunded").length,
    telegramUnverified: memberships.filter(m => !m.telegram_joined).length,
    telegramVerifiedNotRouted: telegram_profiles.filter(t => t.payment_verified && !t.joined_private_group).length,
    telegramRoutedIncomplete: telegram_profiles.filter(t => t.joined_private_group && !t.onboarding_complete).length,
    waitlistCount: waitlist.filter(w => w.waitlist_status === "active").length,
    depositRevenue: depositPayments.reduce((s, p) => s + p.amount, 0),
    subscriptionRevenue: subPayments.reduce((s, p) => s + p.amount, 0),
    tierBreakdown,
    regionBreakdown,
    eventUsage: {
      quarterlyUsed,
      quarterlyIncluded,
      monthlyAttendance: 0,
      weeklyAttendance: 0,
    },
  };
}

// ── MEMBER TIMELINE ───────────────────────────────────────────

export type TimelineEventType =
  | "pledge_submitted" | "pledge_paid" | "reviewed" | "accepted"
  | "declined" | "waitlisted" | "deposit_paid" | "subscription_activated"
  | "telegram_verified" | "first_event_reserved" | "onboarding_complete";

export interface TimelineEvent {
  type: TimelineEventType;
  label: string;
  date: string;
  done: boolean;
  active: boolean;
}

export function getMemberTimeline(db: MakoaDB, application_id: string): TimelineEvent[] {
  const applicant = db.applicants.find(a => a.application_id === application_id);
  const membership = db.memberships.find(m => m.application_id === application_id);
  const tgProfile = db.telegram_profiles.find(t => t.application_id === application_id);
  const payments = db.payments.filter(p => p.application_id === application_id);

  const pledgePaid = payments.find(p => p.payment_type === "pledge" && p.payment_status === "paid");
  const depositPaid = payments.find(p => p.payment_type === "deposit" && p.payment_status === "paid");
  const subActive = payments.find(p => p.payment_type === "subscription" && p.payment_status === "paid");

  const steps: TimelineEvent[] = [
    {
      type: "pledge_submitted",
      label: "Pledge submitted",
      date: applicant?.created_at || "",
      done: !!applicant,
      active: !!applicant && !pledgePaid,
    },
    {
      type: "pledge_paid",
      label: "Pledge paid — $9.99",
      date: pledgePaid?.paid_at || "",
      done: !!pledgePaid,
      active: !!pledgePaid && applicant?.review_status === "pending",
    },
    {
      type: "reviewed",
      label: "Reviewed by XI",
      date: applicant?.review_date || "",
      done: !!applicant?.review_date,
      active: !!applicant?.review_date && applicant.review_status === "pending",
    },
    {
      type: applicant?.review_status === "accepted" ? "accepted" : applicant?.review_status === "declined" ? "declined" : "waitlisted",
      label: applicant?.review_status === "accepted" ? "Accepted into Formation" : applicant?.review_status === "declined" ? "Not accepted this cycle" : "Waitlisted",
      date: applicant?.review_date || "",
      done: applicant?.review_status !== "pending" && !!applicant?.review_date,
      active: applicant?.review_status === "accepted" && !depositPaid,
    },
    {
      type: "deposit_paid",
      label: `Deposit paid — $${membership ? TIER_CONFIG[membership.tier].deposit : "—"}`,
      date: depositPaid?.paid_at || "",
      done: !!depositPaid,
      active: !!depositPaid && !subActive,
    },
    {
      type: "subscription_activated",
      label: "Monthly plan activated",
      date: subActive?.paid_at || "",
      done: !!subActive,
      active: !!subActive && !tgProfile?.payment_verified,
    },
    {
      type: "telegram_verified",
      label: "Telegram verified + routed",
      date: tgProfile?.last_bot_interaction_at || "",
      done: !!tgProfile?.payment_verified,
      active: !!tgProfile?.payment_verified && !tgProfile.onboarding_complete,
    },
    {
      type: "onboarding_complete",
      label: "Onboarding complete",
      date: "",
      done: !!membership?.onboarding_complete,
      active: false,
    },
  ];

  return steps;
}
