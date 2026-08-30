import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function FacilityHero() {
  const t = useTranslations("facilities.facilityHero");

  return (
    <section className="flex flex-col items-center gap-6 px-4 pb-4 pt-28 text-center sm:pt-32">
      <h1 className="text-3xl font-semibold sm:text-5xl">
        <span className="block">{t("titleLine1")}</span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-b from-[#8371fa] to-[#c25ff9]">
          {t("titleLine2")}
        </span>
      </h1>
      <p className="max-w-xl text-muted-foreground">{t("description")}</p>
      <Button asChild size="lg">
        <Link href="/gallery">{t("exploreCampus")}</Link>
      </Button>
    </section>
  );
}
