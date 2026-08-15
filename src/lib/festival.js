import { FESTIVALS } from "@/data/festivals";

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns the festival active on the given date (defaults to now), or null.
 * Fixed festivals (`monthDay`) recur every year; movable festivals only
 * match within their explicitly configured `windows`.
 */
export function getActiveFestival(date = new Date()) {
  const iso = toISODate(date);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return (
    FESTIVALS.find((festival) => {
      if (festival.monthDay) {
        return festival.monthDay.month === month && festival.monthDay.day === day;
      }
      return festival.windows?.some((w) => iso >= w.start && iso <= w.end);
    }) ?? null
  );
}
