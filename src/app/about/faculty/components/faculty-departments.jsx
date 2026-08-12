import Link from "next/link";
import {
  Atom,
  BookOpen,
  Calculator,
  Globe2,
  Laptop2,
  Languages,
  Music,
  Palette,
} from "lucide-react";

const ICONS_BY_KEYWORD = [
  [["math"], Calculator],
  [["science", "physic", "chemistry", "biology"], Atom],
  [["social", "history", "geography", "civics"], Globe2],
  [["computer", "it", "coding"], Laptop2],
  [["english", "hindi", "sanskrit", "language"], Languages],
  [["music"], Music],
  [["art", "craft", "dance"], Palette],
];

function iconForDepartment(name) {
  const lower = name.toLowerCase();
  for (const [keywords, Icon] of ICONS_BY_KEYWORD) {
    if (keywords.some((keyword) => lower.includes(keyword))) return Icon;
  }
  return BookOpen;
}

export function FacultyDepartments({ departments }) {
  if (departments.length === 0) return null;

  return (
    <section id="departments" className="space-y-8">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Departments</h2>
        <p className="text-muted-foreground">
          Browse faculty by department, or use search and filters below to find someone
          specific.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {departments.map(({ name, count }) => {
          const Icon = iconForDepartment(name);
          return (
            <Link
              key={name}
              href={`/about/faculty?department=${encodeURIComponent(name)}#directory`}
              className="flex flex-col items-center gap-2 rounded-xl border bg-card p-5 text-center transition hover:border-violet-300 hover:shadow-sm"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                <Icon className="size-5" />
              </span>
              <span className="font-medium">{name}</span>
              <span className="text-xs text-muted-foreground">
                {count} {count === 1 ? "Teacher" : "Teachers"}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
