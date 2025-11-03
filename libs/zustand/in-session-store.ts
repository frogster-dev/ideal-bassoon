import { Exercise } from "@/libs/drizzle/schema";
import { fetchExercises, selectExercisesForSession } from "@/services/exercise-service";
import { ExerciseWithDuration, InitializaSessionInput } from "@/utils/interfaces/exercice";
import { create } from "zustand";

interface InSessionStore {
  exercices: ExerciseWithDuration[];
  allExercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
  sessionParams: InitializaSessionInput | null;

  initializeSession: (input: InitializaSessionInput) => Promise<void>;
  setSessionId: (sessionId: string) => void;
  clearSession: () => void;
}

// Helper function to select and map exercises based on current state
const selectAndMapExercises = (
  allExercises: Exercise[],
  currentExercices: ExerciseWithDuration[],
  input: InitializaSessionInput,
): ExerciseWithDuration[] => {
  const selectedExercises = selectExercisesForSession(
    allExercises,
    currentExercices,
    input.difficulty,
    input.numberOfExercices,
  );

  return selectedExercises.map((e) => ({ ...e, duration: input.duration }));
};

export const useInSessionStore = create<InSessionStore>()((set, get) => ({
  exercices: [],
  allExercises: [],
  isLoading: false,
  error: null,
  sessionId: null,
  sessionParams: null,

  initializeSession: async (input: InitializaSessionInput) => {
    const { exercices: currentExercices, allExercises, sessionParams } = get();

    // Check if we need to update based on actual changes
    const needsUpdate =
      !sessionParams ||
      sessionParams.numberOfExercices !== input.numberOfExercices ||
      sessionParams.difficulty !== input.difficulty ||
      sessionParams.duration !== input.duration;

    if (!needsUpdate) {
      return;
    }

    set({ isLoading: true, error: null, sessionParams: input });

    try {
      // Fetch all exercises only if not already cached
      let exercises = allExercises;
      if (exercises.length === 0) {
        console.log("📚 Fetching all exercises for the first time...");
        exercises = await fetchExercises();
        console.log(`✅ Cached ${exercises.length} exercises`);
      }

      // Select exercises based on input parameters
      const selectedExercises = selectAndMapExercises(exercises, currentExercices, input);

      set({
        allExercises: exercises,
        exercices: selectedExercises,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to initialize session",
        exercices: [],
      });
      console.error("❌ Error initializing session:", error);
    }
  },

  setSessionId: (sessionId: string) => set({ sessionId }),

  clearSession: () =>
    set({
      exercices: [],
      isLoading: false,
      error: null,
      sessionId: null,
      sessionParams: null,
      // Keep allExercises cached for future sessions
    }),
}));
