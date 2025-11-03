export function formatEffortDurationTime(seconds: number): [string, "heures" | "minutes"] {
  console.log("seconds", seconds);
  // If the seconds is less than 60 minutes, return the minutes
  if (seconds < 60 * 60) {
    return [Math.floor(seconds / 60).toString(), "minutes"];
  }

  // If the seconds is greater than 60 minutes, return the hours
  return [Math.floor((seconds / 60) * 60).toString(), "heures"];
}
