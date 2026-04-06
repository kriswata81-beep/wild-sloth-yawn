"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  INITIAL_DB,
  applyPledgePaid,
  applyAcceptance,
  applyDepositPaid,
  applyTelegramVerified,
  applyEventReservation,
  applyAddRankPoints,
  computeFunnelStats,
  computeLeaderboard,
  getSeatsRemaining,
  getMemberTimeline,
  type MakoaDB,
  type FunnelStats,
  type TimelineEvent,
  type LeaderboardEntry,
  type MemberRank,
} from "./db";
import { type Tier } from "./makoa";

export interface StoreContextValue {
  db: MakoaDB;
  stats: FunnelStats;
  seatsRemaining: Record<Tier, number>;
  leaderboard: LeaderboardEntry[];

  // Funnel actions
  pledgePaid: (data: {
    full_name: string; email: string; phone: string; zip_code: string;
    tier_interest: Tier; q1: string; q2: string; q3: string; application_id: string;
  }) => void;
  acceptApplicant: (application_id: string, tier: Tier) => void;
  depositPaid: (application_id: string, tier: Tier) => void;
  telegramVerified: (application_id: string, telegram_handle: string) => void;

  // Event actions
  reserveEvent: (application_id: string, event_id: string) => void;

  // Rank actions
  addRankPoints: (application_id: string, points: number, reason: string) => void;
  promoteRank: (application_id: string, new_rank: MemberRank) => void;

  // Admin actions
  setCounterMode: (mode: "real" | "simulated") => void;
  adjustSimulatedSeat: (tier: Tier, delta: number) => void;
  declineApplicant: (application_id: string) => void;
  waitlistApplicant: (application_id: string) => void;
  updateMemberPhone: (application_id: string, phone: string) => void;
  updateMemberTelegram: (application_id: string, handle: string) => void;
  assignHouse: (application_id: string, house_id: string) => void;

  // Queries
  getMemberTimeline: (application_id: string) => TimelineEvent[];
  getMemberByEmail: (email: string) => MakoaDB["applicants"][0] | undefined;
  getMemberByApplicationId: (id: string) => MakoaDB["applicants"][0] | undefined;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDB] = useState<MakoaDB>(INITIAL_DB);

  const stats = computeFunnelStats(db);
  const seatsRemaining = getSeatsRemaining(db);
  const leaderboard = computeLeaderboard(db);

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

  const reserveEvent = useCallback((application_id: string, event_id: string) => {
    setDB(prev => applyEventReservation(prev, application_id, event_id));
  }, []);

  const addRankPoints = useCallback((application_id: string, points: number, reason: string) => {
    setDB(prev => applyAddRankPoints(prev, application_id, points, reason));
  }, []);

  const promoteRank = useCallback((application_id: string, new_rank: MemberRank) => {
    setDB(prev => ({
      ...prev,
      memberships: prev.memberships.map(m =>
        m.application_id === application_id ? { ...m, current_rank: new_rank } : m
      ),
      admin_activity_log: [...prev.admin_activity_log, {
        log_id: `log_${Date.now()}`, admin_user: "admin", action_type: "rank_promoted" as const,
        application_id, target_table: "memberships",
        action_summary: `Rank promoted to ${new_rank}`, created_at: new Date().toISOString(),
      }],
    }));
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

  const updateMemberPhone = useCallback((application_id: string, phone: string) => {
    setDB(prev => ({
      ...prev,
      memberships: prev.memberships.map(m => m.application_id === application_id ? { ...m, phone } : m),
    }));
  }, []);

  const updateMemberTelegram = useCallback((application_id: string, handle: string) => {
    setDB(prev => ({
      ...prev,
      memberships: prev.memberships.map(m => m.application_id === application_id ? { ...m, telegram_handle: handle } : m),
    }));
  }, []);

  const assignHouse = useCallback((application_id: string, house_id: string) => {
    setDB(prev => {
      const house = prev.houses.find(h => h.house_id === house_id);
      return {
        ...prev,
        memberships: prev.memberships.map(m =>
          m.application_id === application_id
            ? { ...m, house_id, chapter_house: house?.house_name || m.chapter_house }
            : m
        ),
        admin_activity_log: [...prev.admin_activity_log, {
          log_id: `log_${Date.now()}`, admin_user: "admin", action_type: "assigned_house" as const,
          application_id, target_table: "memberships",
          action_summary: `Assigned to ${house?.house_name || house_id}`, created_at: new Date().toISOString(),
        }],
      };
    });
  }, []);

  const getTimeline = useCallback((application_id: string): TimelineEvent[] => {
    return getMemberTimeline(db, application_id);
  }, [db]);

  const getMemberByEmail = useCallback((email: string) => {
    return db.applicants.find(a => a.email.toLowerCase() === email.toLowerCase());
  }, [db]);

  const getMemberByApplicationId = useCallback((id: string) => {
    return db.applicants.find(a => a.application_id === id);
  }, [db]);

  return (
    <StoreContext.Provider value={{
      db, stats, seatsRemaining, leaderboard,
      pledgePaid, acceptApplicant, depositPaid, telegramVerified,
      reserveEvent, addRankPoints, promoteRank,
      setCounterMode, adjustSimulatedSeat, declineApplicant, waitlistApplicant,
      updateMemberPhone, updateMemberTelegram, assignHouse,
      getMemberTimeline: getTimeline, getMemberByEmail, getMemberByApplicationId,
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
