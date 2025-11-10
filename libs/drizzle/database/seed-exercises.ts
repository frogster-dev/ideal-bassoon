import { DATABASE_NAME } from "@/utils/database";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { exercises } from "../schema";
import { EXERCISES_SEED_DATA } from "./exercises-seed-data";

/**
 * Seeds the exercises table with initial data
 * Runs on app launch and updates exercises if data has changed
 */
export const seedExercises = async (): Promise<void> => {
  try {
    console.log("🌱 Syncing exercises database...");

    const expoDb = openDatabaseSync(DATABASE_NAME);
    const db = drizzle(expoDb);

    console.log("🗑️ Clearing existing exercises...");
    /**
     * @todo try to remove it before production
     */
    await db.delete(exercises);

    // Always upsert exercises (insert or update if exists)
    // This allows us to update exercise data during development
    for (const exercise of EXERCISES_SEED_DATA) {
      await db
        .insert(exercises)
        .values(exercise)
        .onConflictDoUpdate({
          target: exercises.id,
          set: {
            title: exercise.title,
            image: exercise.image,
            difficulties: exercise.difficulties,
          },
        });
    }

    console.log(`✅ Successfully synced ${EXERCISES_SEED_DATA.length} exercises!`);
  } catch (error) {
    console.error("❌ Error seeding exercises:", error);
    throw error;
  }
};

/**
 * Clears all exercises from the database
 * Useful for development/testing
 */
export const clearExercises = async (): Promise<void> => {
  try {
    const expoDb = openDatabaseSync(DATABASE_NAME);
    const db = drizzle(expoDb);

    await db.delete(exercises);

    console.log("🗑️ All exercises cleared");
  } catch (error) {
    console.error("❌ Error clearing exercises:", error);
    throw error;
  }
};
