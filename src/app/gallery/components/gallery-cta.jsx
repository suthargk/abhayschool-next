import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function GalleryCta() {
  const t = useTranslations("gallery.cta");

  return (
    <section className="flex flex-col items-center gap-6 rounded-2xl border bg-card px-6 py-14 text-center">
      <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
        {t("heading")}
      </h2>
      <p className="max-w-xl text-muted-foreground">{t("description")}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/about/facilities">{t("exploreCampus")}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="about/faculty">{t("meetFaculty")}</Link>
        </Button>
      </div>
    </section>
  );
}
