import { CalendarDays, GraduationCap, Users, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border bg-card p-5 text-center">
      <Icon className="size-5 text-violet-600 dark:text-violet-400" />
      <span className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export function WhoWeAre({ facultyCount }) {
  const t = useTranslations("about.whoWeAre");

  const stats = [
    { icon: CalendarDays, label: t("stats.established"), value: 1998 },
    { icon: Users, label: t("stats.students"), value: "700+" },
    {
      icon: GraduationCap,
      label: t("stats.faculty"),
      value: facultyCount > 0 ? `${facultyCount}+` : "—",
    },
    { icon: BookOpen, label: t("stats.classes"), value: t("stats.classesValue") },
  ];

  return (
    <section className="space-y-10">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <StatTile key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
