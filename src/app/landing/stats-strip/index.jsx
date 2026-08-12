import { CalendarDays, Users, GraduationCap, Trophy } from "lucide-react";

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

export function StatsStrip({ facultyCount, highestPercentage }) {
  const yearsOfExcellence = new Date().getFullYear() - 1998;

  const stats = [
    {
      icon: CalendarDays,
      label: "Years of Excellence",
      value: `${yearsOfExcellence}+`,
    },
    { icon: Users, label: "Students", value: "700+" },
    {
      icon: GraduationCap,
      label: "Faculty Members",
      value: facultyCount > 0 ? `${facultyCount}+` : "—",
    },
    {
      icon: Trophy,
      label: "Highest Board Score",
      value: highestPercentage > 0 ? `${highestPercentage}%` : "—",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <StatTile key={stat.label} {...stat} />
      ))}
    </section>
  );
}
