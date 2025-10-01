import { fetchExercisesForSession } from "@/services/exercise-service";
import { Exercice, InitializaSessionInput } from "@/utils/interfaces/exercice";
import { MMKVStorageName, zustandStorage } from "@/utils/mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface InSessionStore {
  exercices: Exercice[];
  isPaused: boolean;
  isLoading: boolean;
  error: string | null;

  initializeSession: (input: InitializaSessionInput) => Promise<void>;
  getCurrentExercice: () => { current: Exercice | null; next: Exercice | null };
  clearSession: () => void;
  setPaused: (paused: boolean) => void;
}

// Helper functions for session management
const getSessionCompleteState = () => ({
  isLoading: false,
  error: null,
  isPaused: false,
});

const setSessionComplete = (set: any) => set(getSessionCompleteState());

const fetchAndSetNewExercises = async (
  input: InitializaSessionInput,
  currentExercices: Exercice[],
  set: any,
) => {
  try {
    const exercices = await fetchExercisesForSession(
      currentExercices,
      input.difficulty,
      input.numberOfExercices,
    );

    set({
      exercices: exercices.map((e) => ({ ...e, duration: input.duration })),
      ...getSessionCompleteState(),
    });
  } catch (error) {
    set({
      isLoading: false,
      error: error instanceof Error ? error.message : "Failed to initialize session",
      exercices: [],
    });
  }
};

export const useInSessionStore = create<InSessionStore>()(
  persist(
    (set, get) => ({
      exercices: [],
      isPaused: false,
      isLoading: false,
      error: null,

      initializeSession: async (input: InitializaSessionInput) => {
        set({ isLoading: true, error: null });

        const { exercices: currentExercices } = get();
        const prevNumberOfExercices = currentExercices.length;

        // Early return if no change needed
        if (prevNumberOfExercices === input.numberOfExercices) {
          setSessionComplete(set);
          return;
        }

        // Reduce exercises if fewer needed
        if (input.numberOfExercices < prevNumberOfExercices) {
          set({
            exercices: currentExercices.slice(0, input.numberOfExercices),
            ...getSessionCompleteState(),
          });
          return;
        }

        // Fetch additional exercises
        await fetchAndSetNewExercises(input, currentExercices, set);
      },

      getCurrentExercice: () => {
        const { exercices } = get();
        if (exercices.length === 0) {
          return { current: null, next: null };
        }

        const currentIndex = 0; // You might want to track current index in the store
        return {
          current: exercices[currentIndex] || null,
          next: exercices[currentIndex + 1] || null,
        };
      },

      clearSession: () =>
        set({
          exercices: [],
          isPaused: false,
          isLoading: false,
          error: null,
        }),

      setPaused: (paused: boolean) => set({ isPaused: paused }),
    }),
    {
      name: MMKVStorageName.IN_SESSION,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
