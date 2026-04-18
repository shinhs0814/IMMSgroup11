import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  SavedFood,
  FoodGroup,
  saveFood,
  getSavedFoods,
  getFoodGroups,
  createFoodGroup,
  deleteSavedFood,
  deleteFoodGroup,
  renameFoodGroup,
  moveFoodToGroup,
} from '../services/storage';
import { AnalysisResult } from '../services/anthropic';

type FoodContextType = {
  savedFoods: SavedFood[];
  groups: FoodGroup[];
  loadingFoods: boolean;
  fetchAll: () => Promise<void>;
  addFood: (
    groupId: string | null,
    foodName: string,
    result: AnalysisResult,
    imageBase64?: string,
    imageUrl?: string
  ) => Promise<void>;
  removeFood: (foodId: string) => Promise<void>;
  addGroup: (name: string) => Promise<void>;
  removeGroup: (groupId: string) => Promise<void>;
  renameGroup: (groupId: string, name: string) => Promise<void>;
  moveFood: (foodId: string, groupId: string | null) => Promise<void>;
};

const FoodContext = createContext<FoodContextType | null>(null);

export function FoodProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [savedFoods, setSavedFoods] = useState<SavedFood[]>([]);
  const [groups, setGroups] = useState<FoodGroup[]>([]);
  const [loadingFoods, setLoadingFoods] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoadingFoods(true);
    try {
      const [foods, grps] = await Promise.all([getSavedFoods(user.uid), getFoodGroups(user.uid)]);
      setSavedFoods(foods);
      setGroups(grps);
    } catch (e) {
      console.error('fetchAll failed:', e);
    } finally {
      setLoadingFoods(false);
    }
  }, [user]);

  // Automatically load data whenever the signed-in user changes.
  // This fires on app restart once Firebase restores the auth session
  // (which happens asynchronously — HomeScreen's one-time useEffect runs
  // too early, before user is available, and data never loads).
  useEffect(() => {
    if (user) {
      fetchAll();
    } else {
      // Clear state on sign-out so stale data isn't shown to the next user
      setSavedFoods([]);
      setGroups([]);
    }
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  const addFood = async (
    groupId: string | null,
    foodName: string,
    result: AnalysisResult,
    imageBase64?: string,
    imageUrl?: string
  ) => {
    if (!user) return;
    const id = await saveFood(user.uid, groupId, foodName, result, imageBase64, imageUrl);
    const newFood: SavedFood = {
      id,
      userId: user.uid,
      groupId,
      foodName,
      analysisResult: result,
      imageBase64,
      imageUrl,
      savedAt: new Date(),
    };
    setSavedFoods((prev) => [newFood, ...prev]);
  };

  const removeFood = async (foodId: string) => {
    await deleteSavedFood(foodId);
    setSavedFoods((prev) => prev.filter((f) => f.id !== foodId));
  };

  const addGroup = async (name: string) => {
    if (!user) return;
    const id = await createFoodGroup(user.uid, name);
    setGroups((prev) => [...prev, { id, userId: user.uid, name, createdAt: new Date() }]);
  };

  const removeGroup = async (groupId: string) => {
    await deleteFoodGroup(groupId);
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    setSavedFoods((prev) => prev.map((f) => (f.groupId === groupId ? { ...f, groupId: null } : f)));
  };

  const renameGroup = async (groupId: string, name: string) => {
    await renameFoodGroup(groupId, name);
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, name } : g)));
  };

  const moveFood = async (foodId: string, groupId: string | null) => {
    await moveFoodToGroup(foodId, groupId);
    setSavedFoods((prev) => prev.map((f) => (f.id === foodId ? { ...f, groupId } : f)));
  };

  return (
    <FoodContext.Provider
      value={{
        savedFoods,
        groups,
        loadingFoods,
        fetchAll,
        addFood,
        removeFood,
        addGroup,
        removeGroup,
        renameGroup,
        moveFood,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
}

export function useFoods() {
  const ctx = useContext(FoodContext);
  if (!ctx) throw new Error('useFoods must be used within FoodProvider');
  return ctx;
}
