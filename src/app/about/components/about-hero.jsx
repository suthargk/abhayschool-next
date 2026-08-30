import Link from "next/link";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function AboutHero() {
  const t = useTranslations("about.aboutHero");

  return (
    <section className="flex flex-col items-center gap-6 px-4 pb-4 pt-28 text-center sm:pt-32">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
        <Info className="size-4" />
        {t("eyebrow")}
      </span>
      <h1 className="text-3xl font-semibold sm:text-5xl">
        <span className="block">{t("headingLine1")}</span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-b from-[#8371fa] to-[#c25ff9]">
          {t("headingLine2")}
        </span>
      </h1>
      <p className="max-w-xl text-muted-foreground">{t("description")}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/gallery">{t("exploreCampus")}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/about/faculty">{t("meetFaculty")}</Link>
        </Button>
      </div>
    </section>
  );
}
