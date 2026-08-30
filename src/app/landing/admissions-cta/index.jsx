import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { GlitterBackground } from "@/components/backgrounds/glitter-background";

export function AdmissionsCta() {
  const t = useTranslations("landing.admissionsCta");

  return (
    <section
      id="admissions"
      className="relative flex scroll-mt-24 flex-col items-center gap-6 overflow-hidden rounded-2xl border bg-card px-6 py-14 text-center"
    >
      <GlitterBackground preset="festive" sparkleCount={20} />
      <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
        {t("heading")}
      </h2>
      <p className="max-w-xl text-muted-foreground">{t("description")}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/admissions">{t("apply")}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/admissions">{t("bookVisit")}</Link>
        </Button>
      </div>
    </section>
  );
}
