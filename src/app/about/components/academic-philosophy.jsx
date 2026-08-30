import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AcademicPhilosophy() {
  const t = useTranslations("about.academicPhilosophy");
  const steps = t.raw("steps");

  return (
    <section className="space-y-10 rounded-2xl border bg-card p-8 sm:p-10">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium",
                index === 0
                  ? "border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300"
                  : "text-muted-foreground",
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 ? (
              <ChevronRight className="size-4 text-muted-foreground" />
            ) : null}
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/academics">{t("exploreAcademics")}</Link>
        </Button>
      </div>
    </section>
  );
}
