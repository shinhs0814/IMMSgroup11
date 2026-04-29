import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser,
  User,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile, saveUserProfile, deleteAllUserData } from '../services/storage';
import { DietaryProfile } from '../constants/dietary';

type AuthContextType = {
  user: User | null;
  dietaryProfile: DietaryProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateDietaryProfile: (profile: DietaryProfile) => Promise<void>;
  hasSurveyCompleted: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dietaryProfile, setDietaryProfile] = useState<DietaryProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setDietaryProfile(profile);
      } else {
        setDietaryProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    // Use the live Firebase User instance (preserves prototype methods like getIdToken).
    // Spreading it would strip the prototype.
    setUser(auth.currentUser);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    await signOut(auth);
  };

  const deleteAccount = async () => {
    if (!user) return;
    // 1. Erase all Firestore data first
    await deleteAllUserData(user.uid);
    // 2. Delete the Firebase Auth account
    // Note: Firebase requires a recent sign-in for this operation.
    // If it fails with 'requires-recent-login', the caller should catch and inform the user.
    await deleteUser(user);
  };

  const updateDietaryProfile = async (profile: DietaryProfile) => {
    if (!user) return;
    await saveUserProfile(user.uid, profile);
    setDietaryProfile(profile);
  };

  const hasSurveyCompleted = !!dietaryProfile;

  return (
    <AuthContext.Provider
      value={{
        user,
        dietaryProfile,
        loading,
        signUp,
        signIn,
        logOut,
        deleteAccount,
        updateDietaryProfile,
        hasSurveyCompleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
