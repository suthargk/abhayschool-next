import { useTranslations } from "next-intl";
import { Compass, Heart, Sparkles, TrendingUp } from "lucide-react";

const PRINCIPLES = [
  { icon: Heart, key: "studentCentered" },
  { icon: Sparkles, key: "curiosityDriven" },
  { icon: TrendingUp, key: "continuousLearning" },
  { icon: Compass, key: "mentorship" },
];

export function TeachingPhilosophy() {
  const t = useTranslations("faculty.teachingPhilosophy");

  return (
    <section className="space-y-10">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("heading")}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map((principle) => (
          <div key={principle.key} className="space-y-3 rounded-xl border bg-card p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <principle.icon className="size-5" />
            </span>
            <h3 className="font-semibold">{t(`${principle.key}.title`)}</h3>
            <p className="text-sm text-muted-foreground">{t(`${principle.key}.description`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
