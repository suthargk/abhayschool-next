import { Percent, Sparkles, Target, Trophy } from "lucide-react";
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

export function AchievementStats({ toppers }) {
  const t = useTranslations("achievements.achievementStats");

  if (toppers.length === 0) return null;

  const highest = Math.max(...toppers.map((topper) => topper.percentage));
  const average =
    toppers.reduce((sum, topper) => sum + topper.percentage, 0) / toppers.length;
  const highScorers = toppers.filter((topper) => topper.percentage >= 90).length;

  const stats = [
    { icon: Trophy, label: t("toppersFeatured"), value: toppers.length },
    { icon: Sparkles, label: t("highScorers"), value: highScorers },
    { icon: Target, label: t("highestScore"), value: `${highest}%` },
    { icon: Percent, label: t("averageScore"), value: `${average.toFixed(1)}%` },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <StatTile key={stat.label} {...stat} />
      ))}
    </section>
  );
}
