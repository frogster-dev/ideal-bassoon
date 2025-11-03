interface SessionConfig {
  totalDuration: number; // in seconds
  numberOfExercices: number;
  exerciseDuration: number;
}

/**
 * Determine if the session is short or long
 * @param totalDuration - Total duration in seconds
 * @returns "Short" or "Long"
 */
function getSessionLength(totalDuration: number): string {
  const minutes = totalDuration / 60;

  // Short: <= 12 minutes
  // Long: >= 20 minutes
  // Medium: between 12 and 20 minutes
  if (minutes <= 12) {
    return "Courte";
  } else if (minutes >= 20) {
    return "Longue";
  } else {
    return "Session";
  }
}

/**
 * Determine the time of day
 * @param date - Current date (optional, default is the current date)
 * @returns The time of day in French
 */
function getTimeOfDay(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour >= 5 && hour < 9) {
    return "du réveil";
  } else if (hour >= 9 && hour < 12) {
    return "du matin";
  } else if (hour >= 12 && hour < 14) {
    return "du midi";
  } else if (hour >= 14 && hour < 18) {
    return "de l'après-midi";
  } else if (hour >= 18 && hour < 22) {
    return "du soir";
  } else {
    return "de nuit";
  }
}

/**
 * Generate a session title automatically
 * @param config - Session configuration
 * @param date - Current date (optional, default is the current date)
 * @returns A generated title
 */
export function generateSessionTitle(config: SessionConfig, date?: Date): string {
  const length = getSessionLength(config.totalDuration);
  const timeOfDay = getTimeOfDay(date);

  return `${length} session ${timeOfDay}`;
}
