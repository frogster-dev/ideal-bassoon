import { Exercise, exercises } from "@/libs/drizzle/schema";
import { DATABASE_NAME } from "@/utils/database";
import { findOppositeExercise, getOppositeSideId, isSidedExercise } from "@/utils/sided-exercises";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

/**
 * Fetches all exercises from SQLite database
 * Following React Native/Expo best practices with proper error handling
 */
export const fetchExercises = async (): Promise<Exercise[]> => {
  try {
    console.log("📚 Fetching exercises from database...");

    const expoDb = openDatabaseSync(DATABASE_NAME);
    const db = drizzle(expoDb);

    // Fetch all exercises from database
    const allExercises = await db.select().from(exercises);

    console.log(`✅ Fetched ${allExercises.length} exercises`);

    return allExercises;
  } catch (error) {
    console.error("❌ Error fetching exercises:", error);
    throw error;
  }
};

/**
 * Selects exercises for a session from cached exercises
 * This function does NOT fetch from database - it uses pre-fetched exercises
 * Ensures sided exercises are always paired together
 *
 * @param allExercises - All available exercises (pre-fetched and cached)
 * @param currentExercices - Currently selected exercises
 * @param expectedDifficulty - Target difficulty level
 * @param expectedNumberOfExercices - Number of exercises needed
 * @returns Array of selected exercises
 */
export const selectExercisesForSession = (
  allExercises: Exercise[],
  currentExercices: Exercise[],
  expectedDifficulty: number,
  expectedNumberOfExercices: number,
): Exercise[] => {
  // If we already have the exact number needed, return as is
  if (currentExercices.length === expectedNumberOfExercices) {
    return currentExercices;
  }

  // If we need fewer exercises, truncate but check for orphan sided exercise
  if (currentExercices.length > expectedNumberOfExercices) {
    const truncated = currentExercices.slice(0, expectedNumberOfExercices);
    // If last exercise is sided, check if its pair is right before it
    const lastEx = truncated[truncated.length - 1];
    if (isSidedExercise(lastEx.id) && truncated.length > 1) {
      const secondToLast = truncated[truncated.length - 2];
      const oppositeId = getOppositeSideId(lastEx.id);
      // If the pair isn't together, remove the orphan
      if (secondToLast.id !== oppositeId) {
        return truncated.slice(0, -1);
      }
    }
    return truncated;
  }

  // We need more exercises
  const result = [...currentExercices];
  const usedIds = new Set(result.map((e) => e.id));

  // Filter out exercises we already have
  const available = allExercises.filter((e) => !usedIds.has(e.id));

  // Randomize
  const randomized = available.sort(() => 0.5 - Math.random());

  // Separate by difficulty
  const [rightDifficulty, wrongDifficulty] = separateExercicesByDifficulty(
    randomized,
    expectedDifficulty,
  );

  // Add exercises with sided pairing
  addExercisesWithPairing(
    result,
    usedIds,
    expectedNumberOfExercices,
    rightDifficulty,
    wrongDifficulty,
    allExercises,
  );

  return result;
};

/**
 * Separate the exercices into two arrays:
 * 1. exercises with right difficulty
 * 2. exercises with wrong difficulty
 */
const separateExercicesByDifficulty = (
  exercices: Exercise[],
  difficulty: number,
): [Exercise[], Exercise[]] => {
  return exercices.reduce(
    (acc: [Exercise[], Exercise[]], ex: Exercise) => {
      if (ex.difficulties.includes(difficulty)) {
        acc[0].push(ex);
      } else {
        acc[1].push(ex);
      }
      return acc;
    },
    [[], []],
  );
};

/**
 * Simple algorithm to add exercises with sided pairing
 * Modifies result array in place
 */
const addExercisesWithPairing = (
  result: Exercise[],
  usedIds: Set<string>,
  targetCount: number,
  priorityExercises: Exercise[],
  fallbackExercises: Exercise[],
  allExercises: Exercise[],
): void => {
  // Try priority exercises first, then fallback
  const sources = [priorityExercises, fallbackExercises];

  for (const source of sources) {
    for (const exercise of source) {
      if (result.length >= targetCount) return;
      if (usedIds.has(exercise.id)) continue;

      // If sided exercise, try to add both sides
      if (isSidedExercise(exercise.id)) {
        const opposite = findOppositeExercise(exercise, allExercises);

        // Only add if we have room for both AND opposite exists and is available
        if (opposite && !usedIds.has(opposite.id) && result.length + 2 <= targetCount) {
          // Always add left-side first, then right-side
          if (exercise.id.endsWith("-left-side")) {
            result.push(exercise, opposite);
          } else {
            result.push(opposite, exercise);
          }
          usedIds.add(exercise.id);
          usedIds.add(opposite.id);
        }
        // Skip if we can't add the pair
      } else {
        // Regular exercise - just add it
        result.push(exercise);
        usedIds.add(exercise.id);
      }
    }
  }
};
