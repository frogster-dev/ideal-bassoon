import { MMKVStorageName, zustandStorage } from "@/utils/mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Language = "en" | "fr";

interface AppPreferencesStore {
  language: Language;
  setLanguage: (language: Language, isManual?: boolean) => void;
  hasManuallySelectedLanguage: boolean;
  onboardingGoal: string | null;
  setOnboardingGoal: (goal: string | null) => void;
}

export const useAppPreferences = create<AppPreferencesStore>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language: Language, isManual = false) =>
        set({ language, hasManuallySelectedLanguage: isManual ? true : undefined }),
      hasManuallySelectedLanguage: false,
      onboardingGoal: null,
      setOnboardingGoal: (goal: string | null) => set({ onboardingGoal: goal }),
    }),
    {
      name: MMKVStorageName.APP_PREFERENCES,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
