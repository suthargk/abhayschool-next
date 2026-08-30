import Link from "next/link";
import { GraduationCap, Award } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function FacultyPreview({ facultyCount, avgExperience }) {
  const t = useTranslations("about.facultyPreview");

  if (facultyCount === 0) return null;

  return (
    <section className="flex flex-col items-center gap-8 rounded-2xl border bg-card p-8 text-center sm:p-10">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {t("heading")}
      </h2>
      <p className="max-w-xl text-muted-foreground">{t("description")}</p>

      <div className="flex flex-wrap items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-1">
          <GraduationCap className="size-5 text-violet-600 dark:text-violet-400" />
          <span className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {facultyCount}+
          </span>
          <span className="text-sm text-muted-foreground">
            {t("facultyMembers")}
          </span>
        </div>
        {avgExperience ? (
          <div className="flex flex-col items-center gap-1">
            <Award className="size-5 text-violet-600 dark:text-violet-400" />
            <span className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {avgExperience}+
            </span>
            <span className="text-sm text-muted-foreground">
              {t("yearsAvgExperience")}
            </span>
          </div>
        ) : null}
      </div>

      <Button asChild size="lg" variant="outline">
        <Link href="/about/faculty">{t("meetFaculty")}</Link>
      </Button>
    </section>
  );
}
