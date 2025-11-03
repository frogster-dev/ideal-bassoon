import * as schema from "@/libs/drizzle/schema";
import { NewSession, Session, sessions } from "@/libs/drizzle/schema";
import { generateSessionTitle } from "@/utils/generate-session-title";
import { ExerciseWithDuration } from "@/utils/interfaces/exercice";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { randomUUID } from "expo-crypto";
import { SQLiteDatabase } from "expo-sqlite";

export type DrizzleDatabase = ExpoSQLiteDatabase<typeof schema> & {
  $client: SQLiteDatabase;
};

export interface CreateSessionInput {
  userId: string;
  difficulty: number;
  numberOfExercices: number;
  exerciseDuration: number;
  pauseDuration: number;
  exercices: ExerciseWithDuration[];
  title?: string; // Optionnel, sera généré automatiquement si non fourni
}

/**
 * Crée une nouvelle session d'étirement pour un utilisateur
 * @param input - Les données de la session à créer
 * @returns La session créée
 */
export async function createSession(
  db: DrizzleDatabase,
  input: CreateSessionInput,
): Promise<Session> {
  // Calculer la durée totale de la session
  const exercicesTime = input.numberOfExercices * input.exerciseDuration;
  const pauseTime = (input.numberOfExercices - 1) * input.pauseDuration;
  const totalDuration = exercicesTime + pauseTime;

  // Générer ou utiliser le titre fourni
  const title =
    input.title ||
    generateSessionTitle({
      totalDuration,
      numberOfExercices: input.numberOfExercices,
      exerciseDuration: input.exerciseDuration,
    });

  const newSession: NewSession = {
    id: randomUUID(), // Generate UUID for SQLite
    userId: input.userId,
    title: title,
    difficulty: input.difficulty,
    numberOfExercices: input.numberOfExercices,
    exerciseDuration: input.exerciseDuration,
    pauseDuration: input.pauseDuration,
    totalDuration: totalDuration,
    exercices: input.exercices,
    startedAt: new Date(),
  };

  // Insérer la session et retourner le résultat
  const [createdSession] = await db.insert(sessions).values(newSession).returning();

  return createdSession;
}

/**
 * Marque une session comme complétée
 * @param sessionId - L'ID de la session à marquer comme complétée
 * @param title - Titre optionnel pour mettre à jour le nom de la session
 * @returns La session mise à jour
 */
export async function completeSession(
  db: DrizzleDatabase,
  sessionId: string,
  title?: string,
): Promise<Session> {
  // Si un titre est fourni, on met à jour le titre en même temps
  const updateData: Partial<Session> = {
    completedAt: new Date(),
    updatedAt: new Date(),
  };

  if (title) {
    updateData.title = title;
  }

  const [updatedSession] = await db
    .update(sessions)
    .set(updateData)
    .where(eq(sessions.id, sessionId))
    .returning();

  return updatedSession;
}

/**
 * Récupère toutes les sessions d'un utilisateur
 * @param userId - L'ID de l'utilisateur (Clerk user ID)
 * @param includeIncomplete - Inclure les sessions non terminées (par défaut: false)
 * @returns Liste des sessions de l'utilisateur, triées par date de début (plus récentes en premier)
 */
export async function getUserSessions(
  db: DrizzleDatabase,
  userId: string,
  includeIncomplete: boolean = false,
  limit?: number,
  offset?: number,
): Promise<Session[]> {
  const whereCondition = includeIncomplete
    ? eq(sessions.userId, userId)
    : and(eq(sessions.userId, userId), isNotNull(sessions.completedAt));

  let query = db.select().from(sessions).where(whereCondition).orderBy(desc(sessions.startedAt));

  // Apply pagination only if provided
  if (typeof limit === "number") {
    // @ts-expect-error drizzle typing for limit/offset chaining on expo sqlite can be loose
    query = query.limit(limit);
  }
  if (typeof offset === "number") {
    // @ts-expect-error drizzle typing for limit/offset chaining on expo sqlite can be loose
    query = query.offset(offset);
  }

  const userSessions = await query;

  return userSessions;
}

/**
 * Récupère une session spécifique par son ID
 * @param sessionId - L'ID de la session
 * @returns La session trouvée ou undefined
 */
export async function getSessionById(
  db: DrizzleDatabase,
  sessionId: string,
): Promise<Session | undefined> {
  const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);

  return session;
}

export interface UserSessionStats {
  totalSessions: number;
  totalExercices: number;
  totalEffortDuration: number;
}

/**
 * Get user session stats
 * @param userId - User ID
 */
export async function getUserSessionStats(
  db: DrizzleDatabase,
  userId: string,
): Promise<UserSessionStats> {
  const allSessions = await getUserSessions(db, userId, true);
  const completedSessions = allSessions.filter((session) => session.completedAt !== null);

  const totalExercices = completedSessions.reduce(
    (sum, session) => sum + session.numberOfExercices,
    0,
  );

  /**
   * @todo in the future each exercise can have a different duration
   */
  const totalEffortDuration = completedSessions.reduce(
    (sum, session) => sum + session.exerciseDuration * session.numberOfExercices,
    0,
  );

  return {
    totalSessions: completedSessions.length,
    totalExercices,
    totalEffortDuration, // in seconds
  };
}
