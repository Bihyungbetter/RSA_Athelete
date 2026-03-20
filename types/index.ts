export interface Athlete {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  role: 'athlete' | 'coach' | 'parent' | 'captain';
  teamId?: string;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoUrl: string | null;
  dailyStreak: number;
  lastCheckIn: Date;
  updatedAt: Date;
}

export interface InjuryRecord {
  id: string;
  athleteId: string;
  injuryType: string;
  diagnosis?: string;
  dateStarted: Date;
  dateRecovered?: Date;
  severity: 'minor' | 'moderate' | 'severe';
  recoveryPlan: string[];
  completedTasks: string[];
  notes?: string;
}

export interface Streak {
  id: string;
  athleteId: string;
  type: 'training' | 'recovery' | 'nutrition' | 'sleep';
  currentStreak: number;
  longestStreak: number;
  lastUpdated: Date;
}

export interface Reminder {
  id: string;
  athleteId: string;
  recipientIds: string[];
  title: string;
  message: string;
  type: 'injury_update' | 'missed_session' | 'milestone' | 'custom';
  scheduledFor: Date;
  sent: boolean;
}

export interface CompetitionChallenge {
  id: string;
  name: string;
  description: string;
  type: 'streak' | 'consistency' | 'recovery';
  creatorId: string;
  participants: string[];
  startDate: Date;
  endDate: Date;
  leaderboard: {
    athleteId: string;
    score: number;
  }[];
}

export interface ActivityLog {
  id: string;
  athleteId: string;
  date: Date;
  type: 'training' | 'recovery' | 'rest';
  duration: number;
  intensity?: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface Contact {
  id: string;
  athleteId: string;
  name: string;
  email: string;
  role: 'friend' | 'coach' | 'parent' | 'captain';
  fcmToken?: string;
  addedAt: Date;
}

export interface RecoveryLog {
  id: string;
  athleteId: string;
  date: Date;
  notes?: string;
}
