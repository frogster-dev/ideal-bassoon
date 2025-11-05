import { MMKVStorageName, zustandStorage } from "@/utils/mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SessionPreferencesStore {
  soundsEnabled: boolean;
  toggleSounds: () => void;
  setSoundsEnabled: (enabled: boolean) => void;
}

export const useSessionPreferences = create<SessionPreferencesStore>()(
  persist(
    (set) => ({
      soundsEnabled: true,
      toggleSounds: () => set((state) => ({ soundsEnabled: !state.soundsEnabled })),
      setSoundsEnabled: (enabled: boolean) => set({ soundsEnabled: enabled }),
    }),
    {
      name: MMKVStorageName.SESSION_PREFERENCES,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
