import type { Athlete, InjuryRecord, Streak, CompetitionChallenge, ActivityLog } from '@/types';

// In-memory data store
const athletes = new Map<string, Athlete>();
const injuries = new Map<string, InjuryRecord>();
const streaks = new Map<string, Streak>();
const challenges = new Map<string, CompetitionChallenge>();
const activities = new Map<string, ActivityLog>();

// Seed default athlete
const DEFAULT_ATHLETE_ID = 'athlete-1';

athletes.set(DEFAULT_ATHLETE_ID, {
  id: DEFAULT_ATHLETE_ID,
  name: 'Alex Johnson',
  email: 'alex@athlete.com',
  role: 'athlete',
});

// Seed streaks for default athlete
const streakTypes: Streak['type'][] = ['training', 'recovery', 'nutrition', 'sleep'];
streakTypes.forEach((type, i) => {
  const id = `streak-${i + 1}`;
  streaks.set(id, {
    id,
    athleteId: DEFAULT_ATHLETE_ID,
    type,
    currentStreak: [7, 3, 5, 12][i],
    longestStreak: [14, 10, 8, 20][i],
    lastUpdated: new Date(),
  });
});

// Seed some sample injuries
const sampleInjury: InjuryRecord = {
  id: 'injury-1',
  athleteId: DEFAULT_ATHLETE_ID,
  injuryType: 'Hamstring Strain',
  dateStarted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  severity: 'moderate',
  recoveryPlan: ['Rest for 3 days', 'Ice 3x daily', 'Gentle stretching', 'Physical therapy'],
  completedTasks: ['Rest for 3 days', 'Ice 3x daily'],
  notes: 'Occurred during sprint training',
};
injuries.set(sampleInjury.id, sampleInjury);

// Seed some sample challenges
const sampleChallenge: CompetitionChallenge = {
  id: 'challenge-1',
  name: '30-Day Training Streak',
  description: 'Train every day for 30 consecutive days',
  type: 'streak',
  participants: [DEFAULT_ATHLETE_ID],
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
  leaderboard: [{ athleteId: DEFAULT_ATHLETE_ID, score: 7 }],
};
challenges.set(sampleChallenge.id, sampleChallenge);

// Seed some recent activities
for (let i = 0; i < 3; i++) {
  const id = `activity-${i + 1}`;
  const activityTypes: ActivityLog['type'][] = ['training', 'recovery', 'training'];
  activities.set(id, {
    id,
    athleteId: DEFAULT_ATHLETE_ID,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    type: activityTypes[i],
    duration: [60, 30, 90][i],
    intensity: (['high', 'low', 'medium'] as const)[i],
    notes: ['Morning workout', 'Recovery session', 'Evening run'][i],
  });
}

export const db = {
  athletes,
  injuries,
  streaks,
  challenges,
  activities,
  DEFAULT_ATHLETE_ID,
};
