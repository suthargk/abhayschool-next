import { Suspense } from "react";

import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";

import { CelebrationBackground } from "./components/celebration-background";
import { ToppersHero } from "./components/toppers-hero";
import { YearFilter } from "./components/year-filter";
import { AchievementStats } from "./components/achievement-stats";
import { FeaturedToppers } from "./components/featured-toppers";
import { TopperGrid } from "./components/topper-grid";
import { AchievementsCta } from "./components/achievements-cta";

export const revalidate = 60;

const STREAM_ORDER = ["SCIENCE", "COMMERCE", "ARTS"];

// TOPPER_STREAMS values from @/data/topper-classes -> "achievements.page" message keys
const STREAM_LABEL_KEYS = {
  SCIENCE: "streamScience",
  COMMERCE: "streamCommerce",
  ARTS: "streamArts",
};

async function resolveYear(requestedYear) {
  const years = (
    await prisma.topper.findMany({
      where: { status: "PUBLISHED" },
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    })
  ).map((row) => row.year);

  const year = years.includes(requestedYear) ? requestedYear : years[0];

  return { years, year };
}

export default async function ToppersPage({ searchParams }) {
  const params = await searchParams;
  const requestedYear = Number(params.year);

  return (
    <div className="relative overflow-hidden">
      <CelebrationBackground />

      <ToppersHero>
        <Suspense fallback={<Skeleton className="mt-2 h-9 w-40 rounded-md" />}>
          <ToppersYearFilter requestedYear={requestedYear} />
        </Suspense>
      </ToppersHero>

      <div className="relative mx-auto max-w-5xl space-y-16 px-4 pb-16 pt-4 sm:px-6">
        <Suspense fallback={<ToppersBodySkeleton />}>
          <ToppersBody requestedYear={requestedYear} />
        </Suspense>

        <AchievementsCta />
      </div>
    </div>
  );
}

async function ToppersYearFilter({ requestedYear }) {
  const t = await getTranslations("achievements.page");
  const { years, year } = await resolveYear(requestedYear);

  if (years.length === 0) return null;

  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="text-sm text-muted-foreground">{t("academicYear")}</span>
      <YearFilter year={year} years={years} />
    </div>
  );
}

async function ToppersBody({ requestedYear }) {
  const t = await getTranslations("achievements.page");
  const { year } = await resolveYear(requestedYear);

  const toppers = year
    ? await prisma.topper.findMany({
        where: { status: "PUBLISHED", year },
        orderBy: [{ class: "asc" }, { rank: "asc" }],
      })
    : [];

  if (toppers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
        <p className="text-sm text-muted-foreground">{t("emptyState")}</p>
      </div>
    );
  }

  const classX = toppers.filter((topper) => topper.class === "CLASS_X");
  const classXII = toppers.filter((topper) => topper.class === "CLASS_XII");
  const classXIIByStream = STREAM_ORDER.map((stream) => ({
    stream,
    items: classXII.filter((topper) => topper.stream === stream),
  })).filter((group) => group.items.length > 0);
  const classXIIUnstreamed = classXII.filter((topper) => !topper.stream);

  const featured = [...toppers]
    .sort((a, b) => b.percentage - a.percentage || a.rank - b.rank)
    .slice(0, 3);

  return (
    <>
      <AchievementStats toppers={toppers} />

      <FeaturedToppers toppers={featured} />

      <div className="space-y-12">
        {classX.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t("classXHeading")}
            </h2>
            <TopperGrid toppers={classX} />
          </section>
        ) : null}

        {classXIIByStream.length > 0 || classXIIUnstreamed.length > 0 ? (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t("classXIIHeading")}
            </h2>
            {classXIIByStream.map((group) => (
              <div key={group.stream} className="space-y-4">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  {t(STREAM_LABEL_KEYS[group.stream])}
                </h3>
                <TopperGrid toppers={group.items} />
              </div>
            ))}
            {classXIIUnstreamed.length > 0 ? (
              <TopperGrid toppers={classXIIUnstreamed} />
            ) : null}
          </section>
        ) : null}
      </div>
    </>
  );
}

function ToppersBodySkeleton() {
  return (
    <div className="space-y-16">
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-5"
          >
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-56" />
          <Skeleton className="mx-auto h-5 w-80" />
        </div>
        <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 overflow-hidden rounded-2xl border bg-card">
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="space-y-2 p-5">
                <Skeleton className="mx-auto h-3 w-24" />
                <Skeleton className="mx-auto h-5 w-32" />
                <Skeleton className="mx-auto h-4 w-28" />
                <Skeleton className="mx-auto h-7 w-16" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Skeleton className="h-7 w-44" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 overflow-hidden rounded-xl border bg-card">
              <Skeleton className="aspect-[4/3.4] w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
