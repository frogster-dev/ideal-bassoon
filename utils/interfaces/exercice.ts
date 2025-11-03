import { Exercise } from "@/libs/drizzle/schema";

export type ExerciseWithDuration = Exercise & { duration: number };

export interface InitializaSessionInput {
  numberOfExercices: number;
  duration: number;
  pauseDuration: number;
  difficulty: number;
}
