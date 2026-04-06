"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  INITIAL_DB,
  applyPledgePaid,
  applyAcceptance,
  applyDepositPaid,
  applyTelegramVerified,
  computeFunnelStats,
  getSeatsRemaining,
  getMemberTimeline,
  type MakoaDB,
  type FunnelStats,
  type TimelineEvent,
} from "./db";
import { type Tier } from "./makoa";

export interface StoreContextValue {
  db: MakoaDB;
  stats: FunnelStats;
  seatsRemaining: Record<Tier, number>;

  pledgePaid: (data: {
    full_name: string; email: string; phone: string; zip_code: string;
    tier_interest: Tier; q1: string; q2: string; q3: string; application_id: string;
  }) => void;
  acceptApplicant: (application_id: string, tier: Tier) => void;
  depositPaid: (application_id: string, tier: Tier) => void;
  telegramVerified: (application_id: string, telegram_handle: string) => void;

  setCounterMode: (mode: "real" | "simulated") => void;
  adjustSimulatedSeat: (tier: Tier, delta: number) => void;
  declineApplicant: (application_id: string) => void;
  waitlistApplicant: (application_id: string) => void;

  getMemberTimeline: (application_id: string) => TimelineEvent[];
  getMemberByEmail: (email: string) => MakoaDB["applicants"][0] | undefined;
}

export const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDB] = useState<MakoaDB>(INITIAL_DB);

  const stats = computeFunnelStats(db);
  const seatsRemaining = getSeatsRemaining(db);

  const pledgePaid = useCallback((data: Parameters<typeof applyPledgePaid>[1]) => {
    setDB(prev => applyPledgePaid(prev, data));
  }, []);

  const acceptApplicant = useCallback((application_id: string, tier: Tier) => {
    setDB(prev => applyAcceptance(prev, application_id, tier));
  }, []);

  const depositPaid = useCallback((application_id: string, tier: Tier) => {
    setDB(prev => applyDepositPaid(prev, application_id, tier));
  }, []);

  const telegramVerified = useCallback((application_id: string, telegram_handle: string) => {
    setDB(prev => applyTelegramVerified(prev, application_id, telegram_handle));
  }, []);

  const setCounterMode = useCallback((mode: "real" | "simulated") => {
    setDB(prev => ({ ...prev, counterMode: mode }));
  }, []);

  const adjustSimulatedSeat = useCallback((tier: Tier, delta: number) => {
    setDB(prev => ({
      ...prev,
      simulatedSeats: {
        ...prev.simulatedSeats,
        [tier]: Math.max(0, Math.min(prev.simulatedSeats[tier] + delta, 72)),
      },
    }));
  }, []);

  const declineApplicant = useCallback((application_id: string) => {
    setDB(prev => ({
      ...prev,
      applicants: prev.applicants.map(a =>
        a.application_id === application_id
          ? { ...a, review_status: "declined" as const, review_date: new Date().toISOString() }
          : a
      ),
    }));
  }, []);

  const waitlistApplicant = useCallback((application_id: string) => {
    setDB(prev => ({
      ...prev,
      applicants: prev.applicants.map(a =>
        a.application_id === application_id
          ? { ...a, review_status: "waitlisted" as const, review_date: new Date().toISOString() }
          : a
      ),
    }));
  }, []);

  const getTimeline = useCallback((application_id: string): TimelineEvent[] => {
    return getMemberTimeline(db, application_id);
  }, [db]);

  const getMemberByEmail = useCallback((email: string) => {
    return db.applicants.find(a => a.email.toLowerCase() === email.toLowerCase());
  }, [db]);

  return (
    <StoreContext.Provider value={{
      db,
      stats,
      seatsRemaining,
      pledgePaid,
      acceptApplicant,
      depositPaid,
      telegramVerified,
      setCounterMode,
      adjustSimulatedSeat,
      declineApplicant,
      waitlistApplicant,
      getMemberTimeline: getTimeline,
      getMemberByEmail,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
