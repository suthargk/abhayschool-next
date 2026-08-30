import { HeartHandshake, Lightbulb, ShieldCheck, Target } from "lucide-react";
import { useTranslations } from "next-intl";

const PRIORITIES = [
  { id: "academicExcellence", icon: Target },
  { id: "characterValues", icon: HeartHandshake },
  { id: "innovation", icon: Lightbulb },
  { id: "wellbeing", icon: ShieldCheck },
];

export function PrincipalVision() {
  const t = useTranslations("principalMessage.principalVision");

  return (
    <section className="mx-auto max-w-5xl space-y-10 rounded-2xl border bg-card p-8 sm:p-10">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
        <p className="italic text-muted-foreground">
          &ldquo;{t("quote")}&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRIORITIES.map((priority) => (
          <div key={priority.id} className="space-y-3 rounded-xl border bg-background p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <priority.icon className="size-5" />
            </span>
            <h3 className="font-semibold">
              {t(`priorities.${priority.id}.title`)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t(`priorities.${priority.id}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
