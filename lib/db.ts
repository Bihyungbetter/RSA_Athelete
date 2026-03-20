import type { Athlete, InjuryRecord, Streak, CompetitionChallenge, ActivityLog, Contact } from '@/types';

const DEFAULT_ID = 'athlete-1';

export const defaultAthlete: Athlete = {
  id: DEFAULT_ID,
  name: 'Athlete',
  email: 'athlete@example.com',
  role: 'athlete',
};

export function getSeedStreaks(): Streak[] {
  const types: Streak['type'][] = ['training', 'recovery', 'nutrition', 'sleep'];
  return types.map((type) => ({
    id: `streak-${type}`,
    athleteId: DEFAULT_ID,
    type,
    currentStreak: 0,
    longestStreak: 0,
    lastUpdated: new Date(),
  }));
}

export function getSeedInjuries(): InjuryRecord[] {
  return [
    {
      id: 'injury-sample',
      athleteId: DEFAULT_ID,
      injuryType: 'Hamstring Strain',
      dateStarted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      severity: 'moderate',
      recoveryPlan: ['Rest for 3 days', 'Ice 3x daily', 'Gentle stretching', 'Physical therapy'],
      completedTasks: ['Rest for 3 days', 'Ice 3x daily'],
      notes: 'Sample injury — replace with your own.',
    },
  ];
}

export function getSeedChallenges(): CompetitionChallenge[] {
  return [
    {
      id: 'challenge-sample',
      name: '30-Day Recovery Streak',
      description: 'Complete your recovery routine every day for 30 consecutive days',
      type: 'streak',
      creatorId: DEFAULT_ID,
      participants: [DEFAULT_ID],
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
      leaderboard: [{ athleteId: DEFAULT_ID, score: 0 }],
    },
  ];
}

export function getSeedActivities(): ActivityLog[] {
  const types: ActivityLog['type'][] = ['recovery', 'recovery', 'recovery'];
  return types.map((type, i) => ({
    id: `activity-sample-${i}`,
    athleteId: DEFAULT_ID,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    type,
    duration: [30, 45, 30][i],
    intensity: (['low', 'low', 'medium'] as const)[i],
    notes: ['Recovery session', 'Stretching and ice', 'PT exercises'][i],
  }));
}

export function getSeedContacts(): Contact[] {
  return [];
}
