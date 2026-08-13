const DAY_MS = 86400000;

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Classifies a due date relative to today, for public display (no per-student tracking). */
export function dueStatus(dueDate, now = new Date()) {
  const diffDays = Math.round(
    (startOfDay(dueDate).getTime() - startOfDay(now).getTime()) / DAY_MS,
  );

  if (diffDays < 0) return { value: "OVERDUE", label: "Overdue" };
  if (diffDays === 0) return { value: "DUE_TODAY", label: "Due Today" };
  if (diffDays === 1) return { value: "DUE_TOMORROW", label: "Due Tomorrow" };
  if (diffDays <= 3) return { value: "DUE_SOON", label: "Due Soon" };
  return { value: "UPCOMING", label: "Upcoming" };
}

export const DUE_STATUS_BADGE_CLASS = {
  OVERDUE: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  DUE_TODAY:
    "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  DUE_TOMORROW:
    "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  DUE_SOON: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  UPCOMING: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

/** Groups items by due-date bucket for the "Today / Tomorrow / date" list layout. */
export function groupByDueDate(items, now = new Date()) {
  const groups = new Map();

  for (const item of items) {
    const diffDays = Math.round(
      (startOfDay(item.dueDate).getTime() - startOfDay(now).getTime()) / DAY_MS,
    );
    let key;
    if (diffDays < 0) key = "overdue";
    else if (diffDays === 0) key = "today";
    else if (diffDays === 1) key = "tomorrow";
    else key = startOfDay(item.dueDate).toISOString();

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }

  return Array.from(groups.entries()).map(([key, groupItems]) => ({
    key,
    date: groupItems[0].dueDate,
    items: groupItems,
  }));
}
