import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  User,
} from '@react-native-firebase/auth';
import { syncUserProfile, getUserProfile, type UserProfile } from '@/lib/firestore';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  onboardingComplete: boolean;
  refreshProfile: () => Promise<void>;
  createAccount: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    const p = await getUserProfile(uid);
    setProfile(p);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await loadProfile(u.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshProfile = async () => {
    if (user) await loadProfile(user.uid);
  };

  const createAccount = async (email: string, password: string, displayName: string) => {
    const auth = getAuth();
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    await syncUserProfile(result.user);
    await loadProfile(result.user.uid);
  };

  const signIn = async (email: string, password: string) => {
    const auth = getAuth();
    const result = await signInWithEmailAndPassword(auth, email, password);
    await loadProfile(result.user.uid);
  };

  const signOut = async () => {
    await firebaseSignOut(getAuth());
    setProfile(null);
  };

  const onboardingComplete = profile?.onboardingComplete === true;

  return (
    <AuthContext.Provider value={{ user, profile, loading, onboardingComplete, refreshProfile, createAccount, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
