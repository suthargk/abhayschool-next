export const CATEGORIES = [
  {
    value: "ACADEMIC",
    label: "Academic",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  },
  {
    value: "ADMISSIONS",
    label: "Admissions",
    badgeClass:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  },
  {
    value: "EXAMINATION",
    label: "Examination",
    badgeClass:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    value: "EVENTS",
    label: "Events",
    badgeClass: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400",
  },
  {
    value: "SPORTS",
    label: "Sports",
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  {
    value: "HOLIDAYS",
    label: "Holidays",
    badgeClass: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
  },
  {
    value: "TRANSPORT",
    label: "Transport",
    badgeClass:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  },
  {
    value: "PARENT_INFORMATION",
    label: "Parent Information",
    badgeClass: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400",
  },
  {
    value: "ACHIEVEMENTS",
    label: "Achievements",
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  },
  {
    value: "GENERAL",
    label: "General",
    badgeClass: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  },
];

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

// value -> "newsNotices.categories" message key, for public-facing locale-aware labels.
// (categoryLabel()/CATEGORIES[].label above stay English-only for admin/teacher dashboards.)
export const CATEGORY_LABEL_KEYS = {
  ACADEMIC: "academic",
  ADMISSIONS: "admissions",
  EXAMINATION: "examination",
  EVENTS: "events",
  SPORTS: "sports",
  HOLIDAYS: "holidays",
  TRANSPORT: "transport",
  PARENT_INFORMATION: "parentInformation",
  ACHIEVEMENTS: "achievements",
  GENERAL: "general",
};

export function categoryLabel(value) {
  return CATEGORY_MAP[value]?.label ?? "General";
}

export function categoryBadgeClass(value) {
  return CATEGORY_MAP[value]?.badgeClass ?? CATEGORY_MAP.GENERAL.badgeClass;
}
