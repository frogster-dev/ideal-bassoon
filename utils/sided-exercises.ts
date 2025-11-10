import { Exercise } from "@/libs/drizzle/schema";

/**
 * Simple utility for managing sided exercises
 * Assumes all sided exercises end with "-left-side" or "-right-side"
 */

export function isSidedExercise(exerciseId: string): boolean {
  return exerciseId.endsWith("-left-side") || exerciseId.endsWith("-right-side");
}

export function getOppositeSideId(exerciseId: string): string | null {
  if (exerciseId.endsWith("-left-side")) {
    return exerciseId.replace("-left-side", "-right-side");
  }
  if (exerciseId.endsWith("-right-side")) {
    return exerciseId.replace("-right-side", "-left-side");
  }
  return null;
}

export function findOppositeExercise(
  exercise: Exercise,
  allExercises: Exercise[],
): Exercise | null {
  const oppositeId = getOppositeSideId(exercise.id);
  if (!oppositeId) return null;
  return allExercises.find((ex) => ex.id === oppositeId) || null;
}
