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
import {
  getUserProfile,
  saveUserProfile,
  deleteAllUserData,
  getFamilyMembers,
  addFamilyMember as addFamilyMemberToDb,
  updateFamilyMember as updateFamilyMemberInDb,
  deleteFamilyMember as deleteFamilyMemberFromDb,
  FamilyMember,
} from '../services/storage';
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

  // Family profiles
  familyMembers: FamilyMember[];
  activeMemberId: string | null;  // null = signed-in user themselves
  activeProfile: DietaryProfile | null;  // computed: own profile or selected member
  activeName: string;             // display name of the active profile
  setActiveMember: (id: string | null) => void;
  addFamilyMember: (name: string, emoji: string, allergies: string[], restrictions: string[], preferences: string[]) => Promise<FamilyMember>;
  updateFamilyMember: (id: string, data: Partial<{ name: string; emoji: string; allergies: string[]; restrictions: string[]; preferences: string[] }>) => Promise<void>;
  removeFamilyMember: (id: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dietaryProfile, setDietaryProfile] = useState<DietaryProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const [profile, members] = await Promise.all([
          getUserProfile(firebaseUser.uid).catch(() => null),
          getFamilyMembers(firebaseUser.uid).catch(() => []),
        ]);
        setDietaryProfile(profile);
        setFamilyMembers(members);
      } else {
        setDietaryProfile(null);
        setFamilyMembers([]);
        setActiveMemberId(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
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
    await deleteAllUserData(user.uid);
    await deleteUser(user);
  };

  const updateDietaryProfile = async (profile: DietaryProfile) => {
    if (!user) return;
    await saveUserProfile(user.uid, profile);
    setDietaryProfile(profile);
  };

  const setActiveMember = (id: string | null) => {
    setActiveMemberId(id);
  };

  const addFamilyMember = async (
    name: string,
    emoji: string,
    allergies: string[],
    restrictions: string[],
    preferences: string[]
  ): Promise<FamilyMember> => {
    if (!user) throw new Error('Not authenticated');
    const id = await addFamilyMemberToDb(user.uid, name, emoji, allergies, restrictions, preferences);
    const newMember: FamilyMember = {
      id,
      userId: user.uid,
      name,
      emoji,
      allergies,
      restrictions,
      preferences,
      createdAt: new Date(),
    };
    setFamilyMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  const updateFamilyMember = async (
    id: string,
    data: Partial<{ name: string; emoji: string; allergies: string[]; restrictions: string[]; preferences: string[] }>
  ) => {
    await updateFamilyMemberInDb(id, data);
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...data } : m))
    );
  };

  const removeFamilyMember = async (id: string) => {
    await deleteFamilyMemberFromDb(id);
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
    // If this member was active, revert to self
    if (activeMemberId === id) {
      setActiveMemberId(null);
    }
  };

  // Computed: active dietary profile
  const activeMember = familyMembers.find((m) => m.id === activeMemberId);
  const activeProfile: DietaryProfile | null = activeMemberId && activeMember
    ? {
        name: activeMember.name,
        allergies: activeMember.allergies,
        restrictions: activeMember.restrictions,
        preferences: activeMember.preferences,
      }
    : dietaryProfile;

  const activeName: string = activeMemberId && activeMember
    ? `${activeMember.emoji} ${activeMember.name}`
    : user?.displayName || '';

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
        familyMembers,
        activeMemberId,
        activeProfile,
        activeName,
        setActiveMember,
        addFamilyMember,
        updateFamilyMember,
        removeFamilyMember,
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
