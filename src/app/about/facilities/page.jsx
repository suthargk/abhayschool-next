import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";

import { FacilityHero } from "./components/facility-hero";
import { FacilitiesOverview } from "./components/facilities-overview";
import { FeaturedFacilities } from "./components/featured-facilities";
import { FacilityHighlightList } from "./components/facility-highlight-list";
import { FacilitiesFaq } from "./components/facilities-faq";

export const revalidate = 60;

export default async function FacilitiesPage() {
  const t = await getTranslations("facilities.page");
  const items = await prisma.facility.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ section: "asc" }, { position: "asc" }],
  });

  const overview = items.filter((item) => item.section === "OVERVIEW");
  const featured = overview.filter((item) => item.featured);
  const sports = items.filter((item) => item.section === "SPORTS");
  const safety = items.filter((item) => item.section === "SAFETY");
  const faqs = items.filter((item) => item.section === "FAQ");

  const hasContent = items.length > 0;

  return (
    <div className="min-h-screen">
      <FacilityHero />

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        {!hasContent ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">{t("emptyState")}</p>
          </div>
        ) : (
          <>
            {overview.length > 0 ? <FacilitiesOverview items={overview} /> : null}
            {featured.length > 0 ? <FeaturedFacilities items={featured} /> : null}
            {sports.length > 0 ? (
              <FacilityHighlightList
                eyebrow={t("sportsSection.eyebrow")}
                title={t("sportsSection.title")}
                description={t("sportsSection.description")}
                items={sports}
              />
            ) : null}
            {safety.length > 0 ? (
              <FacilityHighlightList
                eyebrow={t("safetySection.eyebrow")}
                title={t("safetySection.title")}
                description={t("safetySection.description")}
                items={safety}
              />
            ) : null}
            {faqs.length > 0 ? <FacilitiesFaq items={faqs} /> : null}
          </>
        )}
      </div>
    </div>
  );
}
