import { useTranslations } from "next-intl";
import { Award, LayoutGrid, Users } from "lucide-react";

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border bg-card p-5 text-center">
      <Icon className="size-5 text-violet-600 dark:text-violet-400" />
      <span className="text-2xl font-semibold tracking-tight sm:text-3xl">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export function FacultyStats({ faculty }) {
  const t = useTranslations("faculty.facultyStats");

  if (faculty.length === 0) return null;

  const departments = new Set(faculty.map((f) => f.department).filter(Boolean));
  const withExperience = faculty.filter((f) => f.experienceYears != null);
  const avgExperience =
    withExperience.length > 0
      ? Math.round(
          withExperience.reduce((sum, f) => sum + f.experienceYears, 0) / withExperience.length,
        )
      : null;

  const stats = [
    { icon: Users, label: t("facultyMembers"), value: t("countSuffix", { count: faculty.length }) },
    ...(avgExperience
      ? [
          {
            icon: Award,
            label: t("averageExperience"),
            value: t("avgExperienceValue", { count: avgExperience }),
          },
        ]
      : []),
    ...(departments.size > 0
      ? [{ icon: LayoutGrid, label: t("departments"), value: t("countSuffix", { count: departments.size }) }]
      : []),
  ];

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <StatTile key={stat.label} {...stat} />
      ))}
    </section>
  );
}
