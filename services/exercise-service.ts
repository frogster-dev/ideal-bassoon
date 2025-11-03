import { Exercise, exercises } from "@/libs/drizzle/schema";
import { DATABASE_NAME } from "@/utils/database";
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

  // If we need fewer exercises, truncate the list
  if (currentExercices.length > expectedNumberOfExercices) {
    return currentExercices.slice(0, expectedNumberOfExercices);
  }

  // We need more exercises
  const exercices = [...currentExercices];

  // Filter out exercises we already have
  const filteredExercices = allExercises.filter((e) => !exercices.some((ex) => ex.id === e.id));

  // Randomize to avoid same order every time
  const randomizedExercises = filteredExercices.sort(() => 0.5 - Math.random());

  // Separate by difficulty preference
  const [availableRightDifficultyExercices, availableWrongDifficultyExercices] =
    separateExercicesByDifficulty(randomizedExercises, expectedDifficulty);

  const numberOfExercicesToAdd = expectedNumberOfExercices - exercices.length;

  // Add new exercises, preferring correct difficulty
  const newExercices = addElementsFromArrays<Exercise>(
    numberOfExercicesToAdd,
    availableRightDifficultyExercices,
    availableWrongDifficultyExercices,
    exercices,
  );

  return newExercices;
};

/**
 * Separate the exercices into two arrays:
 * 1. without the current exercices and right difficulty
 * 2. without the current exercices and wrong difficulty
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

const addElementsFromArrays = <T>(
  numberOfArraysToAdd: number,
  arrayPrioOne: T[],
  arrayPrioTwo: T[],
  myArray: T[],
): T[] => {
  if (numberOfArraysToAdd <= 0) {
    return myArray;
  }

  // On prend d'abord dans arrayPrioOne
  const fromPrioOne = arrayPrioOne.slice(0, numberOfArraysToAdd);

  // Si pas assez d'éléments, on complète avec arrayPrioTwo
  const remaining = numberOfArraysToAdd - fromPrioOne.length;
  const fromPrioTwo = remaining > 0 ? arrayPrioTwo.slice(0, remaining) : [];

  // On renvoie myArray complété
  return [...myArray, ...fromPrioOne, ...fromPrioTwo];
};
