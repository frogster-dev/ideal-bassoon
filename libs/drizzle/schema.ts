import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * @Note perso
 * Pour modifier le schema il faut:
 * 1. Modifier la table qu'on souhaite, ajouter, enlever le champs qu'on veut
 * 2. Générer la migration avec `npx drizzle-kit generate`
 * 3. Normalement, la migration s'est mise toute seule
 * 4. On peut checker avec un SHIFT + m dans le terminal pour accéder au tool kit UI de Drizzle
 */

// Exercise table - stocke tous les exercices disponibles
export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  image: text("image").notNull(), // Local asset path
  difficulties: text("difficulties", { mode: "json" }).notNull().$type<number[]>(), // [1,2,3]
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;

// Session table - représente une séance d'étirement complétée ou en cours
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), // UUID stored as text
  userId: text("user_id").notNull(), // Clerk user ID
  title: text("title").notNull().default("test"), // Nom de la session (généré automatiquement ou personnalisé)

  // Configuration de la session
  difficulty: int("difficulty").notNull(), // 1: facile, 2: moyen, 3: difficile
  numberOfExercices: int("number_of_exercices").notNull(),
  exerciseDuration: int("exercise_duration").notNull(), // Durée de chaque exercice en secondes
  pauseDuration: int("pause_duration").notNull(), // Durée de pause entre exercices en secondes
  totalDuration: int("total_duration").notNull(), // Durée totale calculée en secondes

  favorite: int("favorite").notNull().default(0), // 0: non favori, 1: favori

  // Exercices de la session (stocké en JSON as text)
  exercices: text("exercices", { mode: "json" }).notNull().$type<
    Array<{
      id: string;
      title: string;
      image: string;
      difficulties: number[];
      duration: number;
    }>
  >(),

  // Timestamps (stored as ISO 8601 strings)
  startedAt: int("started_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  completedAt: int("completed_at", { mode: "timestamp" }), // Null si la session n'est pas terminée
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
