import React, { createContext, useContext, useState } from 'react';
import {
  defaultAthlete,
  getSeedStreaks,
  getSeedInjuries,
  getSeedChallenges,
  getSeedActivities,
  getSeedContacts,
} from '@/lib/db';
import { generateId } from '@/lib/helpers';
import type {
  Athlete,
  InjuryRecord,
  Streak,
  CompetitionChallenge,
  ActivityLog,
  Contact,
} from '@/types';

interface AppContextValue {
  athlete: Athlete | undefined;
  injuries: InjuryRecord[];
  streaks: Streak[];
  challenges: CompetitionChallenge[];
  activities: ActivityLog[];
  contacts: Contact[];
  loading: boolean;
  addInjury: (injury: Pick<InjuryRecord, 'injuryType' | 'severity' | 'dateStarted' | 'notes'> & { diagnosis?: string; recoveryPlan?: string[] }) => void;
  markRecovered: (id: string) => void;
  toggleTask: (injuryId: string, task: string) => void;
  updateInjuryPlan: (injuryId: string, plan: string[]) => void;
  updateDiagnosis: (injuryId: string, diagnosis: string) => void;
  incrementStreak: (type: Streak['type']) => void;
  addChallenge: (challenge: Pick<CompetitionChallenge, 'name' | 'description' | 'type' | 'startDate' | 'endDate'>) => void;
  updateChallengeScore: (challengeId: string, points: number) => void;
  deleteChallenge: (challengeId: string) => void;
  addActivity: (activity: Omit<ActivityLog, 'id' | 'athleteId'>) => void;
  addContact: (contact: Pick<Contact, 'name' | 'email' | 'role'>) => void;
  removeContact: (contactId: string) => void;
  logRecovery: (notes?: string) => void;
  updateProfile: (fields: { name?: string }) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [athlete, setAthlete] = useState<Athlete | undefined>(defaultAthlete);
  const [injuries, setInjuries] = useState<InjuryRecord[]>(getSeedInjuries);
  const [streaks, setStreaks] = useState<Streak[]>(getSeedStreaks);
  const [challenges, setChallenges] = useState<CompetitionChallenge[]>(getSeedChallenges);
  const [activities, setActivities] = useState<ActivityLog[]>(getSeedActivities);
  const [contacts, setContacts] = useState<Contact[]>(getSeedContacts);
  const loading = false;

  const userId = defaultAthlete.id;

  const addInjury = (
    injury: Pick<InjuryRecord, 'injuryType' | 'severity' | 'dateStarted' | 'notes'> & { diagnosis?: string; recoveryPlan?: string[] }
  ) => {
    const { recoveryPlan, ...rest } = injury;
    const newInjury: InjuryRecord = {
      id: generateId(),
      athleteId: userId,
      completedTasks: [],
      recoveryPlan: recoveryPlan ?? [],
      ...rest,
    };
    setInjuries((prev) => [...prev, newInjury]);
  };

  const markRecovered = (id: string) => {
    const now = new Date();
    setInjuries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, dateRecovered: now } : i))
    );
  };

  const toggleTask = (injuryId: string, task: string) => {
    setInjuries((prev) =>
      prev.map((i) => {
        if (i.id !== injuryId) return i;
        const completed = i.completedTasks.includes(task)
          ? i.completedTasks.filter((t) => t !== task)
          : [...i.completedTasks, task];
        return { ...i, completedTasks: completed };
      })
    );
  };

  const updateInjuryPlan = (injuryId: string, plan: string[]) => {
    setInjuries((prev) =>
      prev.map((i) => (i.id === injuryId ? { ...i, recoveryPlan: plan } : i))
    );
  };

  const updateDiagnosis = (injuryId: string, diagnosis: string) => {
    setInjuries((prev) =>
      prev.map((i) => (i.id === injuryId ? { ...i, diagnosis } : i))
    );
  };

  const incrementStreak = (type: Streak['type']) => {
    setStreaks((prev) =>
      prev.map((s) => {
        if (s.type !== type) return s;
        const newCurrent = s.currentStreak + 1;
        return {
          ...s,
          currentStreak: newCurrent,
          longestStreak: Math.max(s.longestStreak, newCurrent),
          lastUpdated: new Date(),
        };
      })
    );
  };

  const addChallenge = (
    challenge: Pick<CompetitionChallenge, 'name' | 'description' | 'type' | 'startDate' | 'endDate'>
  ) => {
    const newChallenge: CompetitionChallenge = {
      id: generateId(),
      creatorId: userId,
      participants: [userId],
      leaderboard: [{ athleteId: userId, score: 0 }],
      ...challenge,
    };
    setChallenges((prev) => [...prev, newChallenge]);
  };

  const updateChallengeScore = (challengeId: string, points: number) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== challengeId) return c;
        return {
          ...c,
          leaderboard: c.leaderboard.map((entry) =>
            entry.athleteId === userId
              ? { ...entry, score: entry.score + points }
              : entry
          ),
        };
      })
    );
  };

  const deleteChallenge = (challengeId: string) => {
    setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
  };

  const addActivity = (activity: Omit<ActivityLog, 'id' | 'athleteId'>) => {
    const newActivity: ActivityLog = {
      id: generateId(),
      athleteId: userId,
      ...activity,
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const addContact = (contact: Pick<Contact, 'name' | 'email' | 'role'>) => {
    const newContact: Contact = {
      id: generateId(),
      athleteId: userId,
      addedAt: new Date(),
      ...contact,
    };
    setContacts((prev) => [...prev, newContact]);
  };

  const removeContact = (contactId: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
  };

  const logRecovery = (_notes?: string) => {
    incrementStreak('recovery');
  };

  const updateProfile = (fields: { name?: string }) => {
    setAthlete((prev) => (prev ? { ...prev, ...fields } : prev));
  };

  return (
    <AppContext.Provider
      value={{
        athlete,
        injuries,
        streaks,
        challenges,
        activities,
        contacts,
        loading,
        addInjury,
        markRecovered,
        toggleTask,
        updateInjuryPlan,
        updateDiagnosis,
        incrementStreak,
        addChallenge,
        updateChallengeScore,
        deleteChallenge,
        addActivity,
        addContact,
        removeContact,
        logRecovery,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
