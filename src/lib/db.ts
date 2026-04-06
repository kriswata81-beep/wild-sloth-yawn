// ─────────────────────────────────────────────────────────────
// MĀKOA ORDER — Master Data Model
// Single source of truth for all tables.
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
export type HouseStatus = "forming" | "active" | "paused";
export type HouseHealth = "strong" | "stable" | "at_risk";
export type AmbassadorStatus = "none" | "active" | "paused" | "revoked";
export type AdminActionType =
  | "accepted_applicant" | "declined_applicant" | "changed_tier"
  | "sent_seat_offer" | "marked_payment_verified" | "manually_routed_telegram"
  | "added_waitlist" | "adjusted_seat_counter" | "created_membership"
  | "paused_membership" | "resumed_membership" | "flagged_review"
  | "rank_promoted" | "rank_adjusted" | "assigned_house" | "approved_ambassador"
  | "marked_attendance" | "adjusted_points";

// ── RANK SYSTEM ───────────────────────────────────────────────

export type NakoaRank = "Nā Koa Candidate" | "Nā Koa Active" | "Nā Koa Sentinel" | "Nā Koa Field Lead";
export type ManaRank = "Mana Builder" | "Mana Operator" | "Mana Strategist" | "Mana Circle Lead";
export type AliiRank = "Aliʻi Seated" | "Aliʻi Council" | "Aliʻi Steward" | "Aliʻi Chapter Anchor";
export type MemberRank = NakoaRank | ManaRank | AliiRank;

export const RANK_ORDER: Record<Tier, MemberRank[]> = {
  nakoa: ["Nā Koa Candidate", "Nā Koa Active", "Nā Koa Sentinel", "Nā Koa Field Lead"],
  mana: ["Mana Builder", "Mana Operator", "Mana Strategist", "Mana Circle Lead"],
  alii: ["Aliʻi Seated", "Aliʻi Council", "Aliʻi Steward", "Aliʻi Chapter Anchor"],
};

export const RANK_POINTS_REQUIRED: Record<MemberRank, number> = {
  "Nā Koa Candidate": 0,
  "Nā Koa Active": 0,
  "Nā Koa Sentinel": 50,
  "Nā Koa Field Lead": 120,
  "Mana Builder": 0,
  "Mana Operator": 75,
  "Mana Strategist": 150,
  "Mana Circle Lead": 250,
  "Aliʻi Seated": 0,
  "Aliʻi Council": 100,
  "Aliʻi Steward": 200,
  "Aliʻi Chapter Anchor": 350,
};

export const RANK_POINT_VALUES = {
  weekly_training: 5,
  monthly_full_moon: 15,
  quarterly_summit: 25,
  successful_referral: 20,
  volunteer_service: 10,
  house_leadership: 15,
  event_checkin_ontime: 3,
  delinquent_payment: -15,
  missed_reserved_event: -10,
};

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
  // Referral fields
  referral_code: string;
  referred_by_application_id: string;
  referred_by_name: string;
  referred_by_code: string;
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

// ── TABLE 3: MEMBERSHIPS (extended) ──────────────────────────

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
  house_id: string;
  local_group_name: string;
  telegram_required: boolean;
  telegram_joined: boolean;
  telegram_handle: string;
  onboarding_complete: boolean;
  // Entitlement counters
  quarterly_hotel_events_included_total: number;
  quarterly_hotel_events_used: number;
  monthly_full_moon_events_unlimited: boolean;
  weekly_wed_training_unlimited: boolean;
  may_founding_72_included: boolean;
  // Rank & progression
  current_rank: MemberRank;
  rank_points_total: number;
  rank_progress_percent: number;
  service_actions_count: number;
  weekly_training_attendance_count: number;
  monthly_full_moon_attendance_count: number;
  quarterly_event_attendance_count: number;
  referrals_count: number;
  successful_referrals_count: number;
  referral_conversion_rate: number;
  volunteer_hours: number;
  leadership_flags_count: number;
  admin_rank_override: boolean;
  next_rank_target: MemberRank | "";
  eligible_for_review: boolean;
  // Referral identity
  referral_code: string;
  ambassador_status: AmbassadorStatus;
  house_builder_status: boolean;
  chapter_anchor_status: boolean;
  referral_credit_balance: number;
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

// ── TABLE 9: MĀKOA HOUSES ─────────────────────────────────────

export interface MakoaHouse {
  house_id: string;
  house_name: string;
  region: Region;
  island: string;
  chapter_anchor_name: string;
  status: HouseStatus;
  founding_date: string;
  active_member_count: number;
  alii_count: number;
  mana_count: number;
  nakoa_count: number;
  pending_count: number;
  waitlist_count: number;
  monthly_recurring_revenue: number;
  deposits_collected_total: number;
  pledge_revenue_total: number;
  event_revenue_total: number;
  service_revenue_total: number;
  total_revenue: number;
  member_retention_rate: number;
  payment_health_score: number;
  training_attendance_score: number;
  house_health_status: HouseHealth;
  referral_count: number;
  top_ambassador_name: string;
  service_contract_count: number;
  service_revenue_enabled: boolean;
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
  houses: MakoaHouse[];
  counterMode: "real" | "simulated";
  simulatedSeats: Record<Tier, number>;
}

// ── RANK HELPERS ──────────────────────────────────────────────

export function getInitialRank(tier: Tier): MemberRank {
  return RANK_ORDER[tier][0];
}

export function getNextRank(tier: Tier, current: MemberRank): MemberRank | "" {
  const ranks = RANK_ORDER[tier];
  const idx = ranks.indexOf(current as never);
  if (idx === -1 || idx >= ranks.length - 1) return "";
  return ranks[idx + 1];
}

export function computeRankProgress(points: number, current: MemberRank, tier: Tier): number {
  const next = getNextRank(tier, current);
  if (!next) return 100;
  const currentRequired = RANK_POINTS_REQUIRED[current];
  const nextRequired = RANK_POINTS_REQUIRED[next];
  if (nextRequired <= currentRequired) return 100;
  return Math.min(100, Math.round(((points - currentRequired) / (nextRequired - currentRequired)) * 100));
}

export function generateReferralCode(name: string, id: string): string {
  const prefix = name.split(" ")[0].toUpperCase().slice(0, 4);
  const suffix = id.slice(-4).toUpperCase();
  return `${prefix}-${suffix}`;
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
    event_id: "EVT-Q2-HOTEL",
    event_name: "Q2 Quarterly Hotel Summit",
    event_type: "quarterly_hotel",
    start_date: "2026-11-01",
    end_date: "2026-11-03",
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
    start_date: "2026-05-01",
    end_date: "2026-05-01",
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
    event_id: "EVT-MOON-JUN",
    event_name: "Strawberry Moon Full Moon Gathering",
    event_type: "monthly_full_moon",
    start_date: "2026-06-11",
    end_date: "2026-06-11",
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

// ── SEED HOUSES ───────────────────────────────────────────────

const SEED_HOUSES: MakoaHouse[] = [
  {
    house_id: "HOUSE-WEST-OAHU",
    house_name: "Mākoa Westside Oahu House",
    region: "West Oahu",
    island: "Oahu",
    chapter_anchor_name: "Kai Makoa",
    status: "active",
    founding_date: "2026-05-01",
    active_member_count: 18,
    alii_count: 4,
    mana_count: 7,
    nakoa_count: 7,
    pending_count: 3,
    waitlist_count: 2,
    monthly_recurring_revenue: 1441,
    deposits_collected_total: 8750,
    pledge_revenue_total: 230,
    event_revenue_total: 0,
    service_revenue_total: 0,
    total_revenue: 10421,
    member_retention_rate: 94,
    payment_health_score: 91,
    training_attendance_score: 78,
    house_health_status: "strong",
    referral_count: 12,
    top_ambassador_name: "Lono K.",
    service_contract_count: 0,
    service_revenue_enabled: false,
  },
  {
    house_id: "HOUSE-EAST-OAHU",
    house_name: "Mākoa East Oahu House",
    region: "East Oahu",
    island: "Oahu",
    chapter_anchor_name: "TBD",
    status: "forming",
    founding_date: "2026-05-01",
    active_member_count: 6,
    alii_count: 1,
    mana_count: 2,
    nakoa_count: 3,
    pending_count: 4,
    waitlist_count: 1,
    monthly_recurring_revenue: 374,
    deposits_collected_total: 1875,
    pledge_revenue_total: 100,
    event_revenue_total: 0,
    service_revenue_total: 0,
    total_revenue: 2349,
    member_retention_rate: 83,
    payment_health_score: 75,
    training_attendance_score: 60,
    house_health_status: "stable",
    referral_count: 3,
    top_ambassador_name: "—",
    service_contract_count: 0,
    service_revenue_enabled: false,
  },
  {
    house_id: "HOUSE-MAUI",
    house_name: "Mākoa Maui Nui House",
    region: "Maui Nui",
    island: "Maui",
    chapter_anchor_name: "TBD",
    status: "forming",
    founding_date: "2026-05-01",
    active_member_count: 4,
    alii_count: 0,
    mana_count: 2,
    nakoa_count: 2,
    pending_count: 2,
    waitlist_count: 0,
    monthly_recurring_revenue: 124,
    deposits_collected_total: 750,
    pledge_revenue_total: 60,
    event_revenue_total: 0,
    service_revenue_total: 0,
    total_revenue: 934,
    member_retention_rate: 100,
    payment_health_score: 88,
    training_attendance_score: 50,
    house_health_status: "stable",
    referral_count: 2,
    top_ambassador_name: "—",
    service_contract_count: 0,
    service_revenue_enabled: false,
  },
  {
    house_id: "HOUSE-BIG-ISLAND",
    house_name: "Mākoa Big Island House",
    region: "Big Island",
    island: "Big Island",
    chapter_anchor_name: "TBD",
    status: "forming",
    founding_date: "2026-05-01",
    active_member_count: 3,
    alii_count: 0,
    mana_count: 1,
    nakoa_count: 2,
    pending_count: 1,
    waitlist_count: 0,
    monthly_recurring_revenue: 82,
    deposits_collected_total: 375,
    pledge_revenue_total: 40,
    event_revenue_total: 0,
    service_revenue_total: 0,
    total_revenue: 497,
    member_retention_rate: 100,
    payment_health_score: 80,
    training_attendance_score: 45,
    house_health_status: "at_risk",
    referral_count: 1,
    top_ambassador_name: "—",
    service_contract_count: 0,
    service_revenue_enabled: false,
  },
  {
    house_id: "HOUSE-MAINLAND",
    house_name: "Mākoa Mainland West House",
    region: "Mainland West",
    island: "Mainland",
    chapter_anchor_name: "TBD",
    status: "forming",
    founding_date: "2026-05-01",
    active_member_count: 5,
    alii_count: 1,
    mana_count: 2,
    nakoa_count: 2,
    pending_count: 2,
    waitlist_count: 1,
    monthly_recurring_revenue: 289,
    deposits_collected_total: 1375,
    pledge_revenue_total: 70,
    event_revenue_total: 0,
    service_revenue_total: 0,
    total_revenue: 1734,
    member_retention_rate: 90,
    payment_health_score: 85,
    training_attendance_score: 55,
    house_health_status: "stable",
    referral_count: 4,
    top_ambassador_name: "—",
    service_contract_count: 0,
    service_revenue_enabled: false,
  },
];

// ── SEED MEMBERS ──────────────────────────────────────────────

function makeSeedApplicant(overrides: Partial<Applicant> & {
  full_name: string; email: string; tier_interest: Tier;
  review_status: ReviewStatus; pledge_paid: boolean;
}): Applicant {
  const id = generateApplicationId();
  const [first, ...rest] = overrides.full_name.split(" ");
  const zip = overrides.zip_code || "96707";
  const refCode = generateReferralCode(overrides.full_name, id);
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
    referral_code: refCode,
    referred_by_application_id: "",
    referred_by_name: "",
    referred_by_code: "",
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
    months_paid_count: type === "subscription" ? Math.floor(Math.random() * 6) + 1 : 0,
    next_due_date: type === "subscription" ? new Date(Date.now() + 30 * 86400000).toISOString() : "",
    last_payment_date: new Date().toISOString(),
    manual_verification_required: false,
    notes_internal: "",
  };
}

function makeSeedMembership(applicant: Applicant, tier: Tier, houseId: string): Membership {
  const initialRank = getInitialRank(tier);
  const points = tier === "alii" ? 145 : tier === "mana" ? 88 : 62;
  const nextRank = getNextRank(tier, initialRank);
  const refCode = applicant.referral_code;
  const successfulRefs = tier === "alii" ? 3 : tier === "mana" ? 1 : 0;
  return {
    membership_id: `mem_${Math.random().toString(36).slice(2, 10)}`,
    application_id: applicant.application_id,
    full_name: applicant.full_name,
    email: applicant.email,
    phone: applicant.phone,
    tier,
    membership_status: "active",
    founding_cycle: "may_2026",
    formation_start_date: new Date(Date.now() - 30 * 86400000).toISOString(),
    formation_end_date: new Date(Date.now() + 17 * 30 * 86400000).toISOString(),
    deposit_paid: true,
    deposit_paid_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    monthly_plan_active: true,
    standing: "good",
    region: applicant.region,
    chapter_house: houseId === "HOUSE-WEST-OAHU" ? "Mākoa Westside Oahu House" : "Mākoa House",
    house_id: houseId,
    local_group_name: tier === "alii" ? "Mākoa Aliʻi War Room" : tier === "mana" ? "Mākoa Mana Mastermind" : "Mākoa Nā Koa Training",
    telegram_required: true,
    telegram_joined: true,
    telegram_handle: `@${applicant.first_name.toLowerCase()}`,
    onboarding_complete: false,
    quarterly_hotel_events_included_total: tier === "alii" ? 4 : tier === "mana" ? 2 : 0,
    quarterly_hotel_events_used: tier === "alii" ? 1 : 0,
    monthly_full_moon_events_unlimited: true,
    weekly_wed_training_unlimited: true,
    may_founding_72_included: true,
    // Rank
    current_rank: initialRank,
    rank_points_total: points,
    rank_progress_percent: computeRankProgress(points, initialRank, tier),
    service_actions_count: tier === "alii" ? 2 : 0,
    weekly_training_attendance_count: tier === "alii" ? 8 : tier === "mana" ? 5 : 3,
    monthly_full_moon_attendance_count: tier === "alii" ? 2 : 1,
    quarterly_event_attendance_count: tier === "alii" ? 1 : 0,
    referrals_count: successfulRefs + 1,
    successful_referrals_count: successfulRefs,
    referral_conversion_rate: successfulRefs > 0 ? Math.round((successfulRefs / (successfulRefs + 1)) * 100) : 0,
    volunteer_hours: tier === "alii" ? 6 : 0,
    leadership_flags_count: tier === "alii" ? 1 : 0,
    admin_rank_override: false,
    next_rank_target: nextRank,
    eligible_for_review: points >= 100,
    referral_code: refCode,
    ambassador_status: successfulRefs >= 3 ? "active" : "none",
    house_builder_status: false,
    chapter_anchor_status: tier === "alii",
    referral_credit_balance: successfulRefs * 20,
  };
}

// ── INITIAL DB STATE ──────────────────────────────────────────

function buildInitialDB(): MakoaDB {
  const applicants = SEED_APPLICANTS;
  const payments: Payment[] = [];
  const memberships: Membership[] = [];
  const telegram_profiles: TelegramProfile[] = [];

  for (const a of applicants) {
    if (a.pledge_paid) {
      payments.push(makeSeedPayment(a, "pledge", "none", 9.99));
    }
    if (a.review_status === "accepted") {
      const tier = a.tier_interest as Tier;
      const cfg = TIER_CONFIG[tier];
      payments.push(makeSeedPayment(a, "deposit", tier, cfg.deposit));
      payments.push(makeSeedPayment(a, "subscription", tier, cfg.monthly));
      memberships.push(makeSeedMembership(a, tier, "HOUSE-WEST-OAHU"));
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

  return {
    applicants,
    payments,
    memberships,
    telegram_profiles,
    events: SEED_EVENTS,
    event_entitlements: [],
    waitlist: [],
    admin_activity_log: [],
    houses: SEED_HOUSES,
    counterMode: "simulated",
    // Start at full capacity — admin decrements manually as real deposits come in
    simulatedSeats: {
      alii: SEAT_CAPS.alii,
      mana: SEAT_CAPS.mana,
      nakoa: SEAT_CAPS.nakoa,
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

export function applyPledgePaid(db: MakoaDB, data: {
  full_name: string; email: string; phone: string; zip_code: string;
  tier_interest: Tier; q1: string; q2: string; q3: string; application_id: string;
}): MakoaDB {
  const existing = db.applicants.find(a => a.email === data.email);
  const region = zipToRegion(data.zip_code);
  const [first, ...rest] = data.full_name.split(" ");
  const paymentId = `pi_${Math.random().toString(36).slice(2, 12)}`;
  const refCode = generateReferralCode(data.full_name, data.application_id);

  const applicant: Applicant = existing ? {
    ...existing, pledge_paid: true, pledge_payment_id: paymentId, review_status: "pending",
  } : {
    application_id: data.application_id,
    created_at: new Date().toISOString(),
    full_name: data.full_name, first_name: first, last_name: rest.join(" "),
    email: data.email, phone: data.phone, zip_code: data.zip_code, city: "",
    island: region.includes("Oahu") ? "Oahu" : region === "Maui Nui" ? "Maui" : region === "Big Island" ? "Big Island" : "Unknown",
    region, tier_interest: data.tier_interest, source_region: region,
    referral_source: "Landing Page", challenge_selected: data.q2, value_brought: data.q1,
    short_answer_1: data.q1, short_answer_2: data.q2, oath_taken: true,
    pledge_paid: true, pledge_payment_id: paymentId, review_status: "pending",
    review_tier: "none", reviewed_by: "", review_date: "", acceptance_window_expires_at: "",
    notes_internal: "", seat_offer_sent: false, seat_offer_sent_at: "",
    referral_code: refCode, referred_by_application_id: "", referred_by_name: "", referred_by_code: "",
  };

  const payment: Payment = {
    payment_id: paymentId, application_id: data.application_id,
    stripe_payment_link_name: "makoa_pledge_999", stripe_session_id: "",
    external_payment_method: "stripe", payment_type: "pledge", tier: "none",
    amount: 9.99, currency: "usd", payment_status: "paid", paid_at: new Date().toISOString(),
    billing_cycle_number: 0, subscription_active: false, subscription_start_date: "",
    subscription_end_date: "", months_paid_count: 0, next_due_date: "",
    last_payment_date: new Date().toISOString(), manual_verification_required: false, notes_internal: "",
  };

  const log: AdminActivityLog = {
    log_id: `log_${Date.now()}`, admin_user: "system", action_type: "accepted_applicant",
    application_id: data.application_id, target_table: "applicants",
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

export function applyAcceptance(db: MakoaDB, application_id: string, tier: Tier, reviewed_by = "XI Committee"): MakoaDB {
  const log: AdminActivityLog = {
    log_id: `log_${Date.now()}`, admin_user: reviewed_by, action_type: "accepted_applicant",
    application_id, target_table: "applicants",
    action_summary: `Accepted into ${tier} tier`, created_at: new Date().toISOString(),
  };
  return {
    ...db,
    applicants: db.applicants.map(a => a.application_id === application_id ? {
      ...a, review_status: "accepted", review_tier: tier, reviewed_by,
      review_date: new Date().toISOString(),
      acceptance_window_expires_at: new Date(Date.now() + 48 * 3600000).toISOString(),
      seat_offer_sent: true, seat_offer_sent_at: new Date().toISOString(),
    } : a),
    admin_activity_log: [...db.admin_activity_log, log],
  };
}

export function applyDepositPaid(db: MakoaDB, application_id: string, tier: Tier): MakoaDB {
  const applicant = db.applicants.find(a => a.application_id === application_id);
  if (!applicant) return db;

  const cfg = TIER_CONFIG[tier];
  const initialRank = getInitialRank(tier);
  const refCode = applicant.referral_code || generateReferralCode(applicant.full_name, application_id);

  const depositPayment: Payment = {
    payment_id: `dep_${Math.random().toString(36).slice(2, 12)}`, application_id,
    stripe_payment_link_name: cfg.depositLink.internalName, stripe_session_id: "",
    external_payment_method: "stripe", payment_type: "deposit", tier, amount: cfg.deposit,
    currency: "usd", payment_status: "paid", paid_at: new Date().toISOString(),
    billing_cycle_number: 0, subscription_active: false, subscription_start_date: "",
    subscription_end_date: "", months_paid_count: 0, next_due_date: "",
    last_payment_date: new Date().toISOString(), manual_verification_required: false, notes_internal: "",
  };

  const membership: Membership = {
    membership_id: `mem_${Math.random().toString(36).slice(2, 10)}`, application_id,
    full_name: applicant.full_name, email: applicant.email, phone: applicant.phone,
    tier, membership_status: "active", founding_cycle: "may_2026",
    formation_start_date: new Date().toISOString(),
    formation_end_date: new Date(Date.now() + 18 * 30 * 86400000).toISOString(),
    deposit_paid: true, deposit_paid_at: new Date().toISOString(),
    monthly_plan_active: false, standing: "good", region: applicant.region,
    chapter_house: `${applicant.region} Chapter House`, house_id: "HOUSE-WEST-OAHU",
    local_group_name: tier === "alii" ? "Mākoa Aliʻi War Room" : tier === "mana" ? "Mākoa Mana Mastermind" : "Mākoa Nā Koa Training",
    telegram_required: true, telegram_joined: false, telegram_handle: "",
    onboarding_complete: false,
    quarterly_hotel_events_included_total: tier === "alii" ? 4 : tier === "mana" ? 2 : 0,
    quarterly_hotel_events_used: 0, monthly_full_moon_events_unlimited: true,
    weekly_wed_training_unlimited: true, may_founding_72_included: true,
    current_rank: initialRank, rank_points_total: 0, rank_progress_percent: 0,
    service_actions_count: 0, weekly_training_attendance_count: 0,
    monthly_full_moon_attendance_count: 0, quarterly_event_attendance_count: 0,
    referrals_count: 0, successful_referrals_count: 0, referral_conversion_rate: 0,
    volunteer_hours: 0, leadership_flags_count: 0, admin_rank_override: false,
    next_rank_target: getNextRank(tier, initialRank), eligible_for_review: false,
    referral_code: refCode, ambassador_status: "none",
    house_builder_status: false, chapter_anchor_status: false, referral_credit_balance: 0,
  };

  const log: AdminActivityLog = {
    log_id: `log_${Date.now()}`, admin_user: "system", action_type: "created_membership",
    application_id, target_table: "memberships",
    action_summary: `Deposit paid — ${tier} membership created for ${applicant.full_name}`,
    created_at: new Date().toISOString(),
  };

  const newSimulated = { ...db.simulatedSeats };
  if (db.counterMode === "simulated") newSimulated[tier] = Math.max(0, newSimulated[tier] - 1);

  return {
    ...db,
    payments: [...db.payments, depositPayment],
    memberships: [...db.memberships, membership],
    simulatedSeats: newSimulated,
    admin_activity_log: [...db.admin_activity_log, log],
  };
}

export function applyTelegramVerified(db: MakoaDB, application_id: string, telegram_handle: string): MakoaDB {
  const applicant = db.applicants.find(a => a.application_id === application_id);
  const membership = db.memberships.find(m => m.application_id === application_id);
  if (!applicant || !membership) return db;

  const existing = db.telegram_profiles.find(t => t.application_id === application_id);
  const profile: TelegramProfile = existing ? {
    ...existing, payment_verified: true, telegram_handle,
    joined_main_channel: true, joined_private_group: true, joined_region_group: true,
    routed_tier_group: membership.local_group_name,
    routed_region_group: `Mākoa ${applicant.region}`,
    last_bot_interaction_at: new Date().toISOString(),
  } : {
    telegram_profile_id: `tg_${Math.random().toString(36).slice(2, 10)}`,
    application_id, full_name: applicant.full_name, email: applicant.email,
    telegram_handle, telegram_user_id: "", tier: membership.tier,
    zip_code: applicant.zip_code, region: applicant.region, payment_verified: true,
    routed_tier_group: membership.local_group_name,
    routed_region_group: `Mākoa ${applicant.region}`,
    joined_main_channel: true, joined_private_group: true, joined_region_group: true,
    onboarding_complete: false, verification_method: "auto", flagged_for_review: false,
    last_bot_interaction_at: new Date().toISOString(),
  };

  const log: AdminActivityLog = {
    log_id: `log_${Date.now()}`, admin_user: "system", action_type: "manually_routed_telegram",
    application_id, target_table: "telegram_profiles",
    action_summary: `Telegram verified for ${applicant.full_name} — routed to ${membership.local_group_name}`,
    created_at: new Date().toISOString(),
  };

  return {
    ...db,
    memberships: db.memberships.map(m => m.application_id === application_id ? { ...m, telegram_joined: true, telegram_handle } : m),
    telegram_profiles: existing
      ? db.telegram_profiles.map(t => t.application_id === application_id ? profile : t)
      : [...db.telegram_profiles, profile],
    admin_activity_log: [...db.admin_activity_log, log],
  };
}

export function applyEventReservation(db: MakoaDB, application_id: string, event_id: string): MakoaDB {
  const membership = db.memberships.find(m => m.application_id === application_id);
  const event = db.events.find(e => e.event_id === event_id);
  if (!membership || !event) return db;

  const isQuarterly = event.event_type === "quarterly_hotel";
  const entitlement: EventEntitlement = {
    entitlement_id: `ent_${Math.random().toString(36).slice(2, 10)}`,
    application_id, membership_id: membership.membership_id, event_id,
    tier: membership.tier, entitlement_type: "included",
    entitlement_status: "reserved", reservation_date: new Date().toISOString(),
    check_in_status: "not_checked_in", notes_internal: "",
  };

  return {
    ...db,
    event_entitlements: [...db.event_entitlements, entitlement],
    events: db.events.map(e => e.event_id === event_id ? { ...e, capacity_remaining: Math.max(0, e.capacity_remaining - 1) } : e),
    memberships: db.memberships.map(m => m.application_id === application_id && isQuarterly
      ? { ...m, quarterly_hotel_events_used: m.quarterly_hotel_events_used + 1 }
      : m
    ),
  };
}

export function applyAddRankPoints(db: MakoaDB, application_id: string, points: number, reason: string, admin_user = "system"): MakoaDB {
  const membership = db.memberships.find(m => m.application_id === application_id);
  if (!membership) return db;

  const newPoints = Math.max(0, membership.rank_points_total + points);
  const newProgress = computeRankProgress(newPoints, membership.current_rank, membership.tier);
  const log: AdminActivityLog = {
    log_id: `log_${Date.now()}`, admin_user, action_type: "adjusted_points",
    application_id, target_table: "memberships",
    action_summary: `${points > 0 ? "+" : ""}${points} formation score — ${reason}`,
    created_at: new Date().toISOString(),
  };

  return {
    ...db,
    memberships: db.memberships.map(m => m.application_id === application_id
      ? { ...m, rank_points_total: newPoints, rank_progress_percent: newProgress }
      : m
    ),
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
  eventUsage: { quarterlyUsed: number; quarterlyIncluded: number; monthlyAttendance: number; weeklyAttendance: number };
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
  for (const m of memberships) { if (m.deposit_paid) tierBreakdown[m.tier].paid++; }

  const regionBreakdown: Record<Region, number> = { "West Oahu": 0, "East Oahu": 0, "Maui Nui": 0, "Big Island": 0, "Mainland West": 0, "Unknown": 0 };
  for (const a of applicants) regionBreakdown[a.region]++;

  const depositPayments = payments.filter(p => p.payment_type === "deposit" && p.payment_status === "paid");
  const subPayments = payments.filter(p => p.payment_type === "subscription" && p.payment_status === "paid");

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
    tierBreakdown, regionBreakdown,
    eventUsage: {
      quarterlyUsed: memberships.reduce((s, m) => s + m.quarterly_hotel_events_used, 0),
      quarterlyIncluded: memberships.reduce((s, m) => s + m.quarterly_hotel_events_included_total, 0),
      monthlyAttendance: memberships.reduce((s, m) => s + m.monthly_full_moon_attendance_count, 0),
      weeklyAttendance: memberships.reduce((s, m) => s + m.weekly_training_attendance_count, 0),
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

  return [
    { type: "pledge_submitted", label: "Pledge submitted", date: applicant?.created_at || "", done: !!applicant, active: !!applicant && !pledgePaid },
    { type: "pledge_paid", label: "Pledge paid — $9.99", date: pledgePaid?.paid_at || "", done: !!pledgePaid, active: !!pledgePaid && applicant?.review_status === "pending" },
    { type: "reviewed", label: "Reviewed by XI", date: applicant?.review_date || "", done: !!applicant?.review_date, active: !!applicant?.review_date && applicant.review_status === "pending" },
    {
      type: applicant?.review_status === "accepted" ? "accepted" : applicant?.review_status === "declined" ? "declined" : "waitlisted",
      label: applicant?.review_status === "accepted" ? "Accepted into Formation" : applicant?.review_status === "declined" ? "Not accepted this cycle" : "Waitlisted",
      date: applicant?.review_date || "",
      done: applicant?.review_status !== "pending" && !!applicant?.review_date,
      active: applicant?.review_status === "accepted" && !depositPaid,
    },
    { type: "deposit_paid", label: `Deposit paid — $${membership ? TIER_CONFIG[membership.tier].deposit : "—"}`, date: depositPaid?.paid_at || "", done: !!depositPaid, active: !!depositPaid && !subActive },
    { type: "subscription_activated", label: "Monthly plan activated", date: subActive?.paid_at || "", done: !!subActive, active: !!subActive && !tgProfile?.payment_verified },
    { type: "telegram_verified", label: "Telegram verified + routed", date: tgProfile?.last_bot_interaction_at || "", done: !!tgProfile?.payment_verified, active: !!tgProfile?.payment_verified && !tgProfile.onboarding_complete },
    { type: "onboarding_complete", label: "Onboarding complete", date: "", done: !!membership?.onboarding_complete, active: false },
  ];
}

// ── LEADERBOARD ───────────────────────────────────────────────

export interface LeaderboardEntry {
  application_id: string;
  display_name: string;
  tier: Tier;
  current_rank: MemberRank;
  region: Region;
  successful_referrals: number;
  rank_points: number;
  training_attendance: number;
  ambassador_status: AmbassadorStatus;
}

export function computeLeaderboard(db: MakoaDB): LeaderboardEntry[] {
  return db.memberships
    .filter(m => m.membership_status === "active")
    .map(m => {
      const applicant = db.applicants.find(a => a.application_id === m.application_id);
      const firstName = applicant?.first_name || m.full_name.split(" ")[0];
      const lastInitial = (applicant?.last_name || m.full_name.split(" ").slice(1).join(" "))[0] || "";
      return {
        application_id: m.application_id,
        display_name: `${firstName} ${lastInitial}.`,
        tier: m.tier,
        current_rank: m.current_rank,
        region: m.region,
        successful_referrals: m.successful_referrals_count,
        rank_points: m.rank_points_total,
        training_attendance: m.weekly_training_attendance_count,
        ambassador_status: m.ambassador_status,
      };
    })
    .sort((a, b) => b.successful_referrals - a.successful_referrals);
}
