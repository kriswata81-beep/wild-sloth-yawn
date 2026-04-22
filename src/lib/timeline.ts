// ─── MĀKOA TIMELINE CONSTANTS ────────────────────────────────────────────────
// Single source of truth. Every date in the app imports from here.
// No hardcoded dates anywhere else.

export const TIMELINE = {
  PALAPALA_DROP:           new Date('2026-04-21T00:00:00-10:00'),
  GATE_OPENS:              new Date('2026-05-01T09:00:00-10:00'),
  WEEKEND_1_START:         new Date('2026-05-01T00:00:00-10:00'),
  WEEKEND_1_END:           new Date('2026-05-04T23:59:59-10:00'),
  WEEKEND_2_START:         new Date('2026-05-08T00:00:00-10:00'),
  WEEKEND_2_END:           new Date('2026-05-11T23:59:59-10:00'),
  WEEKEND_3_START:         new Date('2026-05-15T00:00:00-10:00'),
  WEEKEND_3_END:           new Date('2026-05-18T23:59:59-10:00'),
  WEEKEND_4_START:         new Date('2026-05-29T00:00:00-10:00'),
  WEEKEND_4_END:           new Date('2026-06-01T23:59:59-10:00'),
  BLUE_MOON_SEALING:       new Date('2026-05-31T23:11:00-10:00'),
  KA_LANI_48_WAITLIST_OPENS: new Date('2026-06-01T09:00:00-10:00'),
} as const;

export const FOUNDING_CAP = 48;

export const TIER_PRICES = {
  NA_KOA:  97,
  MANA:    197,
  WAR_ROOM: 397,
  ALII:    4997,
} as const;

export function daysUntil(target: Date): number {
  const ms = target.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86400000));
}

export function timeUntil(target: Date) {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return { d: 0, h: 0, m: 0, past: true };
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms % 86400000) / 3600000),
    m: Math.floor((ms % 3600000) / 60000),
    past: false,
  };
}
