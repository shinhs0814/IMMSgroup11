import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { DietaryProfile } from '../constants/dietary';
import { AnalysisResult } from './anthropic';

export type FoodGroup = {
  id: string;
  name: string;
  userId: string;
  createdAt: any;
};

export type SavedFood = {
  id: string;
  userId: string;
  groupId: string | null;
  foodName: string;
  imageBase64?: string;
  imageUrl?: string;       // remote image URL (e.g. from Wikipedia) for text-search results
  analysisResult: AnalysisResult;
  savedAt: any;
};

// User profile
export async function saveUserProfile(userId: string, profile: DietaryProfile) {
  await setDoc(doc(db, 'users', userId), { dietaryProfile: profile }, { merge: true });
}

export async function getUserProfile(userId: string): Promise<DietaryProfile | null> {
  const snap = await getDoc(doc(db, 'users', userId));
  if (snap.exists()) {
    return snap.data().dietaryProfile || null;
  }
  return null;
}

// Food groups
export async function createFoodGroup(userId: string, name: string): Promise<string> {
  const ref = await addDoc(collection(db, 'foodGroups'), {
    userId,
    name,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getFoodGroups(userId: string): Promise<FoodGroup[]> {
  const q = query(collection(db, 'foodGroups'), where('userId', '==', userId));
  const snap = await getDocs(q);
  const groups = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FoodGroup));
  // Sort client-side to avoid requiring a Firestore composite index
  return groups.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return aTime - bTime; // oldest first
  });
}

export async function deleteFoodGroup(groupId: string) {
  await deleteDoc(doc(db, 'foodGroups', groupId));
}

export async function renameFoodGroup(groupId: string, name: string) {
  await updateDoc(doc(db, 'foodGroups', groupId), { name });
}

// Saved foods
export async function saveFood(
  userId: string,
  groupId: string | null,
  foodName: string,
  analysisResult: AnalysisResult,
  imageBase64?: string,
  imageUrl?: string
): Promise<string> {
  const ref = await addDoc(collection(db, 'savedFoods'), {
    userId,
    groupId,
    foodName,
    analysisResult,
    imageBase64: imageBase64 || null,
    imageUrl: imageUrl || null,
    savedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getSavedFoods(userId: string): Promise<SavedFood[]> {
  const q = query(collection(db, 'savedFoods'), where('userId', '==', userId));
  const snap = await getDocs(q);
  const foods = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedFood));
  // Sort client-side to avoid requiring a Firestore composite index
  return foods.sort((a, b) => {
    const aTime = a.savedAt?.toMillis?.() ?? 0;
    const bTime = b.savedAt?.toMillis?.() ?? 0;
    return bTime - aTime; // newest first
  });
}

export async function deleteSavedFood(foodId: string) {
  await deleteDoc(doc(db, 'savedFoods', foodId));
}

export async function moveFoodToGroup(foodId: string, groupId: string | null) {
  await updateDoc(doc(db, 'savedFoods', foodId), { groupId });
}

/**
 * Permanently deletes ALL data for a user from Firestore:
 * - users/{userId}
 * - All foodGroups belonging to the user
 * - All savedFoods belonging to the user
 */
export async function deleteAllUserData(userId: string): Promise<void> {
  // Delete user profile document
  await deleteDoc(doc(db, 'users', userId));

  // Delete all food groups
  const groupsQuery = query(collection(db, 'foodGroups'), where('userId', '==', userId));
  const groupsSnap = await getDocs(groupsQuery);
  await Promise.all(groupsSnap.docs.map((d) => deleteDoc(d.ref)));

  // Delete all saved foods
  const foodsQuery = query(collection(db, 'savedFoods'), where('userId', '==', userId));
  const foodsSnap = await getDocs(foodsQuery);
  await Promise.all(foodsSnap.docs.map((d) => deleteDoc(d.ref)));
}
