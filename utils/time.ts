export function formatDate(dateInput: Date | string | number) {
  const date = new Date(dateInput);
  const now = new Date();

  const toYMD = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const isToday = toYMD(date) === toYMD(now);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = toYMD(date) === toYMD(yesterday);

  const pad = (n: number) => String(n).padStart(2, "0");
  const hhmm = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  if (isToday) return `Aujourd'hui à ${hhmm}`;
  if (isYesterday) return `Hier à ${hhmm}`;

  const full = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${full} à ${hhmm}`;
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
