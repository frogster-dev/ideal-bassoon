import { ExerciceEntity } from "@/libs/drizzle/database/exercice-entity";
import { MOCK_EXERCISES } from "./fake-data";

/**
 * Simulates a database call to fetch exercises
 * Following React Native/Expo best practices with proper error handling
 */
export const fetchExercises = async (): Promise<ExerciceEntity[]> => {
  try {
    console.log("fetching exercises...");
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return all exercises
    return MOCK_EXERCISES;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};

export const fetchExercisesForSession = async (
  currentExercices: ExerciceEntity[],
  expectedDifficulty: number,
  expectedNumberOfExercices: number,
): Promise<ExerciceEntity[]> => {
  console.log("\n\n\nexpectedNumberOfExercices", expectedNumberOfExercices);
  console.log("current exercices", currentExercices.length);

  if (currentExercices.length === expectedNumberOfExercices) {
    return currentExercices;
  }

  if (currentExercices.length > expectedNumberOfExercices) {
    return currentExercices.slice(0, expectedNumberOfExercices);
  }

  const allExercises = await fetchExercises();

  console.log("all exercices", allExercises.length);

  const exercices = [...currentExercices];

  const filteredExercices = allExercises.filter((e) => !exercices.some((ex) => ex.id === e.id));

  // Randomize all the exercices to avoid fetching the same exercices everytime
  const randomizedExercises = filteredExercices.sort(() => 0.5 - Math.random());

  // New exercices available (without the current exercices) sorted by difficulty
  const [availableRightDifficultyExercices, availableWrongDifficultyExercices] =
    separateExercicesByDifficulty(randomizedExercises, expectedDifficulty);

  console.log("availableRightDifficultyExercices", availableRightDifficultyExercices.length);
  console.log("availableWrongDifficultyExercices", availableWrongDifficultyExercices.length);

  const numberOfExercicesToAdd = expectedNumberOfExercices - exercices.length;

  console.log("numberOfExercicesToAdd", numberOfExercicesToAdd);

  const newExercices = addElementsFromArrays(
    numberOfExercicesToAdd,
    availableRightDifficultyExercices,
    availableWrongDifficultyExercices,
    exercices,
  );

  console.log("exercices--", newExercices.length);

  return newExercices;
};

/**
 * Separate the exercices into two arrays:
 * 1. without the current exercices and right difficulty
 * 2. without the current exercices and wrong difficulty
 */
const separateExercicesByDifficulty = (
  exercices: ExerciceEntity[],
  difficulty: number,
): [ExerciceEntity[], ExerciceEntity[]] => {
  return exercices.reduce(
    (acc: [ExerciceEntity[], ExerciceEntity[]], ex: ExerciceEntity) => {
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
