import { prisma } from "@/lib/prisma";
import { topperStreamLabel } from "@/data/topper-classes";

import { CelebrationBackground } from "./components/celebration-background";
import { ToppersHero } from "./components/toppers-hero";
import { AchievementStats } from "./components/achievement-stats";
import { FeaturedToppers } from "./components/featured-toppers";
import { TopperGrid } from "./components/topper-grid";
import { AchievementsCta } from "./components/achievements-cta";

export const revalidate = 60;

const STREAM_ORDER = ["SCIENCE", "COMMERCE", "ARTS"];

export default async function ToppersPage({ searchParams }) {
  const params = await searchParams;

  const years = (
    await prisma.topper.findMany({
      where: { status: "PUBLISHED" },
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    })
  ).map((row) => row.year);

  const requestedYear = Number(params.year);
  const year = years.includes(requestedYear) ? requestedYear : years[0];

  const toppers = year
    ? await prisma.topper.findMany({
        where: { status: "PUBLISHED", year },
        orderBy: [{ class: "asc" }, { rank: "asc" }],
      })
    : [];

  const classX = toppers.filter((t) => t.class === "CLASS_X");
  const classXII = toppers.filter((t) => t.class === "CLASS_XII");
  const classXIIByStream = STREAM_ORDER.map((stream) => ({
    stream,
    items: classXII.filter((t) => t.stream === stream),
  })).filter((group) => group.items.length > 0);
  const classXIIUnstreamed = classXII.filter((t) => !t.stream);

  const featured = [...toppers]
    .sort((a, b) => b.percentage - a.percentage || a.rank - b.rank)
    .slice(0, 3);

  return (
    <div className="relative overflow-hidden">
      <CelebrationBackground />

      <ToppersHero year={year} years={years} />

      <div className="relative mx-auto max-w-5xl space-y-16 px-4 pb-16 pt-4 sm:px-6">
        {toppers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Toppers will be published here soon.
            </p>
          </div>
        ) : (
          <>
            <AchievementStats toppers={toppers} />

            <FeaturedToppers toppers={featured} />

            <div className="space-y-12">
              {classX.length > 0 ? (
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Class X Toppers
                  </h2>
                  <TopperGrid toppers={classX} />
                </section>
              ) : null}

              {classXIIByStream.length > 0 || classXIIUnstreamed.length > 0 ? (
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Class XII Toppers
                  </h2>
                  {classXIIByStream.map((group) => (
                    <div key={group.stream} className="space-y-4">
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        {topperStreamLabel(group.stream)}
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
        )}

        <AchievementsCta />
      </div>
    </div>
  );
}
