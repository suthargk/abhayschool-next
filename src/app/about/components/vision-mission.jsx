import { Eye, Target } from "lucide-react";
import { useTranslations } from "next-intl";

export function VisionMission() {
  const t = useTranslations("about.visionMission");
  const missionPoints = t.raw("missionPoints");

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-4 rounded-2xl border bg-card p-8">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
          <Eye className="size-5" />
        </span>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {t("visionHeading")}
        </h2>
        <p className="text-muted-foreground">{t("visionDescription")}</p>
      </div>

      <div className="space-y-4 rounded-2xl border bg-card p-8">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
          <Target className="size-5" />
        </span>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {t("missionHeading")}
        </h2>
        <ul className="space-y-2">
          {missionPoints.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-violet-500" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
