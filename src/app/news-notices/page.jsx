import { Suspense } from "react";

import { prisma } from "@/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORIES } from "@/lib/news-notices/categories";
import { recentAcademicYears } from "@/lib/news-notices/academic-year";
import {
  getArchiveAcademicYears,
  getPinnedNewsNotices,
} from "@/lib/news-notices/cached-queries";

import { PAGE_SIZE, RANGE_OPTIONS } from "./constants";
import { NewsNoticesHero } from "./components/news-notices-hero";
import { NewsNoticesExplorer } from "./components/explorer";

export default function NewsNoticesPage({ searchParams }) {
  return (
    <div className="space-y-10 px-4 pb-16 sm:px-6">
      <NewsNoticesHero />

      <div
        id="news-notices-list"
        className="mx-auto max-w-5xl scroll-mt-24 space-y-10"
      >
        <Suspense fallback={<NewsNoticesResultsSkeleton />}>
          <NewsNoticesResults searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function NewsNoticesResults({ searchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const tab = ["NEWS", "NOTICE", "EVENTS"].includes(params.tab)
    ? params.tab
    : "ALL";
  const category = CATEGORIES.some((c) => c.value === params.category)
    ? params.category
    : "ALL";
  const year = typeof params.year === "string" && params.year ? params.year : "ALL";
  const range = RANGE_OPTIONS.some((r) => r.value === params.range)
    ? params.range
    : "ALL";
  const page = Math.max(1, Number(params.page) || 1);

  const now = new Date();
  const isArchiveView = year !== "ALL";
  const effectiveCategory = tab === "EVENTS" ? "EVENTS" : category;
  const rangeDays = RANGE_OPTIONS.find((r) => r.value === range)?.days;

  const where = {
    status: "PUBLISHED",
    publishedAt: {
      lte: now,
      ...(rangeDays
        ? { gte: new Date(now.getTime() - rangeDays * 86400000) }
        : {}),
    },
    ...(tab === "NEWS" || tab === "NOTICE" ? { type: tab } : {}),
    ...(effectiveCategory !== "ALL" ? { category: effectiveCategory } : {}),
    ...(isArchiveView ? { academicYear: year } : {}),
    ...(!isArchiveView ? { OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] } : {}),
    ...(q
      ? {
          AND: [
            {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { summary: { contains: q, mode: "insensitive" } },
              ],
            },
          ],
        }
      : {}),
  };

  const [items, total, pinnedItems, archiveYears] = await Promise.all([
    prisma.newsNotice.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.newsNotice.count({ where }),
    page === 1 && !q ? getPinnedNewsNotices() : Promise.resolve([]),
    getArchiveAcademicYears(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const yearOptions = Array.from(
    new Set([...recentAcademicYears(6), ...archiveYears]),
  ).sort((a, b) => b.localeCompare(a));

  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, total);

  return (
    <NewsNoticesExplorer
      q={q}
      tab={tab}
      category={category}
      year={year}
      range={range}
      page={page}
      items={items}
      total={total}
      totalPages={totalPages}
      showingFrom={showingFrom}
      showingTo={showingTo}
      pinnedItems={pinnedItems}
      isArchiveView={isArchiveView}
      yearOptions={yearOptions}
      archiveYears={recentAcademicYears(6)}
    />
  );
}

function NewsNoticesResultsSkeleton() {
  return (
    <div className="space-y-10">
      <Skeleton className="h-28 w-full rounded-2xl" />

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-md" />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-full max-w-xs" />
          <Skeleton className="h-11 w-44" />
          <Skeleton className="h-11 w-44" />
          <Skeleton className="h-11 w-40" />
          <Skeleton className="h-11 w-24" />
        </div>
      </div>

      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
