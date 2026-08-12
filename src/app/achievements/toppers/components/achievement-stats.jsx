import { Percent, Sparkles, Target, Trophy } from "lucide-react";

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

export function AchievementStats({ toppers }) {
  if (toppers.length === 0) return null;

  const highest = Math.max(...toppers.map((t) => t.percentage));
  const average =
    toppers.reduce((sum, t) => sum + t.percentage, 0) / toppers.length;
  const highScorers = toppers.filter((t) => t.percentage >= 90).length;

  const stats = [
    { icon: Trophy, label: "Toppers Featured", value: toppers.length },
    { icon: Sparkles, label: "90%+ Scorers", value: highScorers },
    { icon: Target, label: "Highest Score", value: `${highest}%` },
    { icon: Percent, label: "Average Score", value: `${average.toFixed(1)}%` },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <StatTile key={stat.label} {...stat} />
      ))}
    </section>
  );
}
