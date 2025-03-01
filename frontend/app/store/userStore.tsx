import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
  // User properties
  userName: string;
  userAvatar: string | null;
  userXp: number;
  unlockedChapters: number[];

  // Actions
  setUserName: (name: string) => void;
  setUserAvatar: (avatar: string) => void;
  increaseXp: (amount: number) => void;
  decreaseXp: (amount: number) => void;
  unlockChapter: (chapterId: number) => void;
  isChapterUnlocked: (chapterId: number) => boolean;
  resetProgress: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      userName: "Player",
      userAvatar: null,
      userXp: 100, // Starting XP
      unlockedChapters: [1], // Chapter 1 is unlocked by default

      // Methods to update state
      setUserName: (name) => set({ userName: name }),

      setUserAvatar: (avatar) => set({ userAvatar: avatar }),

      increaseXp: (amount) =>
        set((state) => ({
          userXp: state.userXp + amount,
        })),

      decreaseXp: (amount) =>
        set((state) => ({
          userXp: Math.max(0, state.userXp - amount), // Prevent negative XP
        })),

      unlockChapter: (chapterId) =>
        set((state) => {
          if (state.unlockedChapters.includes(chapterId)) {
            return state; // Chapter already unlocked
          }
          return {
            unlockedChapters: [...state.unlockedChapters, chapterId].sort(
              (a, b) => a - b
            ),
          };
        }),

      isChapterUnlocked: (chapterId) => {
        return get().unlockedChapters.includes(chapterId);
      },

      resetProgress: () =>
        set({
          userXp: 100,
          unlockedChapters: [1],
        }),
    }),
    {
      name: "user-storage", // unique name for AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
