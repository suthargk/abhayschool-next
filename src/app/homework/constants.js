export const PAGE_SIZE = 15;

export const RANGE_OPTIONS = [
  { value: "THIS_WEEK", label: "This Week" },
  { value: "NEXT_WEEK", label: "Next Week" },
  { value: "ALL", label: "All" },
];

/** Returns the [start, end) date bounds for a range option, or null for "ALL". */
export function rangeBounds(range, now = new Date()) {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  if (range === "THIS_WEEK") {
    return [startOfWeek, new Date(startOfWeek.getTime() + 7 * 86400000)];
  }
  if (range === "NEXT_WEEK") {
    const start = new Date(startOfWeek.getTime() + 7 * 86400000);
    return [start, new Date(start.getTime() + 7 * 86400000)];
  }
  return null;
}
