import { MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

const storage = new MMKV({
  id: "storage",
});

export const zustandStorage: StateStorage = {
  setItem: (name, value): void => {
    return storage.set(name, value);
  },

  getItem: (name): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },

  removeItem: (name): void => {
    return storage.delete(name);
  },
};

export enum MMKVStorageName {
  IN_SESSION = "in-session-storage",
  SESSION_PREFERENCES = "session-preferences",
  APP_PREFERENCES = "app-preferences",
}
