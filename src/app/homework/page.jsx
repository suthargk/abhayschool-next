import { Suspense } from "react";

import { prisma } from "@/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { classLabel } from "@/lib/classes";
import {
  getHomeworkClasses,
  getHomeworkSubjects,
  getHomeworkSummaryCounts,
} from "@/lib/homework/cached-queries";

import { PAGE_SIZE, RANGE_OPTIONS, rangeBounds } from "./constants";
import { HomeworkHero } from "./components/homework-hero";
import { HomeworkExplorer } from "./components/explorer";

export default function HomeworkPage({ searchParams }) {
  return (
    <div className="space-y-10 px-4 pb-16 sm:px-6">
      <HomeworkHero />

      <div
        id="homework-list"
        className="mx-auto max-w-5xl scroll-mt-24 space-y-8"
      >
        <Suspense fallback={<HomeworkResultsSkeleton />}>
          <HomeworkResults searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function HomeworkResults({ searchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const classFilter = typeof params.class === "string" ? params.class : "ALL";
  const subject = typeof params.subject === "string" ? params.subject : "ALL";
  const range = RANGE_OPTIONS.some((r) => r.value === params.range)
    ? params.range
    : "THIS_WEEK";
  const page = Math.max(1, Number(params.page) || 1);

  const now = new Date();
  const bounds = rangeBounds(range, now);

  const where = {
    status: "PUBLISHED",
    publishedAt: { lte: now },
    ...(bounds ? { assignedDate: { gte: bounds[0], lt: bounds[1] } } : {}),
    ...(classFilter !== "ALL" ? { class: classFilter } : {}),
    ...(subject !== "ALL" ? { subject } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { teacherName: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total, counts, classOptions, subjectOptions, classes] =
    await Promise.all([
      prisma.homework.findMany({
        where,
        orderBy: { dueDate: "asc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { attachments: true },
      }),
      prisma.homework.count({ where }),
      getHomeworkSummaryCounts(),
      getHomeworkClasses(),
      getHomeworkSubjects(),
      prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
    ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, total);
  const itemsWithClassLabel = items.map((item) => ({
    ...item,
    classLabel: classLabel(classes, item.class),
  }));

  return (
    <HomeworkExplorer
      q={q}
      classFilter={classFilter}
      subject={subject}
      range={range}
      page={page}
      items={itemsWithClassLabel}
      total={total}
      totalPages={totalPages}
      showingFrom={showingFrom}
      showingTo={showingTo}
      counts={counts}
      classes={classes}
      classOptions={classOptions}
      subjectOptions={subjectOptions}
    />
  );
}

function HomeworkResultsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-md" />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-full max-w-xs" />
          <Skeleton className="h-11 w-44" />
          <Skeleton className="h-11 w-44" />
          <Skeleton className="h-11 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
