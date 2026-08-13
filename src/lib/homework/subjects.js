import {
  Atom,
  BookOpen,
  Calculator,
  Dumbbell,
  FlaskConical,
  Globe,
  Landmark,
  Languages,
  Laptop,
  Leaf,
  Palette,
  ScrollText,
} from "lucide-react";

export const SUBJECTS = [
  {
    value: "Mathematics",
    icon: Calculator,
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  },
  {
    value: "Science",
    icon: FlaskConical,
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  {
    value: "English",
    icon: BookOpen,
    badgeClass: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400",
  },
  {
    value: "Hindi",
    icon: Languages,
    badgeClass:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  },
  {
    value: "Social Studies",
    icon: Globe,
    badgeClass: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
  },
  {
    value: "Physics",
    icon: Atom,
    badgeClass:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  },
  {
    value: "Chemistry",
    icon: FlaskConical,
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    value: "Biology",
    icon: Leaf,
    badgeClass:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  },
  {
    value: "Computer Science",
    icon: Laptop,
    badgeClass: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400",
  },
  {
    value: "Sanskrit",
    icon: ScrollText,
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  },
  {
    value: "History & Civics",
    icon: Landmark,
    badgeClass:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
  },
  {
    value: "Art",
    icon: Palette,
    badgeClass:
      "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-400",
  },
  {
    value: "Physical Education",
    icon: Dumbbell,
    badgeClass: "bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-400",
  },
];

const SUBJECT_MAP = Object.fromEntries(SUBJECTS.map((s) => [s.value, s]));

const FALLBACK = {
  icon: BookOpen,
  badgeClass: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export function subjectIcon(value) {
  return SUBJECT_MAP[value]?.icon ?? FALLBACK.icon;
}

export function subjectBadgeClass(value) {
  return SUBJECT_MAP[value]?.badgeClass ?? FALLBACK.badgeClass;
}
