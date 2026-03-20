import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  increment,
  query,
  orderBy,
} from '@react-native-firebase/firestore';
import type { User } from '@react-native-firebase/auth';

const db = getFirestore();

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FirestoreChallenge {
  id: string;
  name: string;
  description: string;
  type: 'streak' | 'consistency' | 'recovery';
  creatorId: string;
  creatorName: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  scores: Record<string, { score: number; displayName: string; photoURL: string | null }>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  displayName: string;
  photoURL: string | null;
  email: string;
  onboardingComplete: boolean;
  sport?: string;
  role?: 'athlete' | 'coach' | 'parent' | 'captain';
  primaryGoal?: 'consistency' | 'recovery' | 'competition' | 'fitness';
  trackingGoals?: string[];
  streakGoal?: number;
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function syncUserProfile(user: User) {
  const ref = doc(db, 'users', user.uid);
  await setDoc(
    ref,
    {
      displayName: user.displayName ?? 'Athlete',
      photoURL: user.photoURL ?? null,
      email: user.email ?? '',
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function saveOnboarding(uid: string, data: Omit<UserProfile, 'displayName' | 'photoURL' | 'email'>) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    ...data,
    onboardingComplete: true,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ─── Challenges ───────────────────────────────────────────────────────────────

export async function createChallenge(
  data: Pick<FirestoreChallenge, 'name' | 'description' | 'type' | 'startDate' | 'endDate'>,
  user: User
) {
  const ref = doc(collection(db, 'challenges'));
  await setDoc(ref, {
    ...data,
    creatorId: user.uid,
    creatorName: user.displayName ?? 'Athlete',
    createdAt: serverTimestamp(),
    scores: {
      [user.uid]: {
        score: 0,
        displayName: user.displayName ?? 'Athlete',
        photoURL: user.photoURL ?? null,
      },
    },
  });
  return ref.id;
}

export async function addScore(challengeId: string, user: User) {
  const ref = doc(db, 'challenges', challengeId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const scores = snap.data()?.scores ?? {};
  const existing = scores[user.uid];

  if (existing) {
    await updateDoc(ref, {
      [`scores.${user.uid}.score`]: increment(1),
    });
  } else {
    await updateDoc(ref, {
      [`scores.${user.uid}`]: {
        score: 1,
        displayName: user.displayName ?? 'Athlete',
        photoURL: user.photoURL ?? null,
      },
    });
  }
}

export async function removeChallenge(challengeId: string) {
  await deleteDoc(doc(db, 'challenges', challengeId));
}

// ─── Real-time listener ───────────────────────────────────────────────────────

export function subscribeToChallenges(
  callback: (challenges: FirestoreChallenge[]) => void
) {
  const q = query(collection(db, 'challenges'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const challenges: FirestoreChallenge[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name,
        description: data.description,
        type: data.type,
        creatorId: data.creatorId,
        creatorName: data.creatorName,
        startDate: data.startDate?.toDate?.() ?? new Date(),
        endDate: data.endDate?.toDate?.() ?? new Date(),
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
        scores: data.scores ?? {},
      };
    });
    callback(challenges);
  });
}
