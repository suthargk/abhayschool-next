import { cache } from "react";

import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

// Mirrors the content-type list in recent-changes.jsx (minus the singleton
// Principal's Message and the non-content Admissions source, neither of
// which have a meaningful published/draft split).
const CONTENT_MODELS = [
  { kindKey: "newsNotices", model: prisma.newsNotice },
  { kindKey: "gallery", model: prisma.galleryAlbum },
  { kindKey: "homework", model: prisma.homework },
  { kindKey: "faculty", model: prisma.faculty },
  { kindKey: "facilities", model: prisma.facility },
  { kindKey: "library", model: prisma.libraryBook },
  { kindKey: "blog", model: prisma.academicPost },
  { kindKey: "toppers", model: prisma.topper },
  { kindKey: "faq", model: prisma.faq },
  { kindKey: "testimonials", model: prisma.testimonial },
];

function bucketByDay(rows, days) {
  const buckets = new Map();
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    buckets.set(date.toISOString().slice(0, 10), 0);
  }
  for (const row of rows) {
    const key = new Date(row.createdAt).toISOString().slice(0, 10);
    if (buckets.has(key)) {
      buckets.set(key, buckets.get(key) + 1);
    }
  }
  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

async function getDailyTrend(model, days = 30) {
  const since = new Date(Date.now() - 2 * days * DAY_MS);
  const rows = await model.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const cutoff = Date.now() - days * DAY_MS;
  const currentRows = rows.filter(
    (row) => new Date(row.createdAt).getTime() >= cutoff
  );

  return {
    current: currentRows.length,
    previous: rows.length - currentRows.length,
    daily: bucketByDay(currentRows, days),
  };
}

// React's request-scoped cache dedupes these across the stat cards, charts
// and pending-actions components, which each fetch independently (matching
// this route's existing per-component data-fetching convention) but render
// within the same request/Suspense tree.
export const getContentStatusBreakdown = cache(async () => {
  const results = await Promise.all(
    CONTENT_MODELS.map(({ model }) =>
      model.groupBy({ by: ["status"], _count: true })
    )
  );

  return CONTENT_MODELS.map(({ kindKey }, index) => {
    const counts = { DRAFT: 0, PUBLISHED: 0, ARCHIVED: 0 };
    for (const group of results[index]) {
      counts[group.status] = group._count;
    }
    return {
      kindKey,
      published: counts.PUBLISHED,
      draft: counts.DRAFT,
      archived: counts.ARCHIVED,
    };
  });
});

export const getTeacherStatusCounts = cache(async () => {
  const groups = await prisma.profile.groupBy({
    by: ["status"],
    where: { role: "TEACHER" },
    _count: true,
  });

  const counts = { ACTIVE: 0, PENDING: 0, INVITED: 0, REJECTED: 0 };
  for (const group of groups) {
    counts[group.status] = group._count;
  }
  return counts;
});

export const getAdmissionsTrend = cache(() => getDailyTrend(prisma.admissionEnquiry, 30));

export const getPageViewsTrend = cache(() => getDailyTrend(prisma.itemView, 30));

export const getHomeworkTrend = cache(() => getDailyTrend(prisma.homework, 30));

export const getHomeworkByClass = cache(async () => {
  const [classes, groups] = await Promise.all([
    prisma.schoolClass.findMany({
      orderBy: { position: "asc" },
      select: { value: true, label: true },
    }),
    prisma.homework.groupBy({ by: ["class"], _count: true }),
  ]);

  const countsByClass = new Map(groups.map((group) => [group.class, group._count]));

  return classes.map(({ value, label }) => ({
    label,
    count: countsByClass.get(value) ?? 0,
  }));
});

export const getPendingCounts = cache(async () => {
  const [pendingTeachers, newAdmissions, pendingTestimonials] = await Promise.all([
    prisma.profile.count({ where: { role: "TEACHER", status: "PENDING" } }),
    prisma.admissionEnquiry.count({ where: { status: "NEW" } }),
    prisma.testimonial.count({ where: { source: "PARENT", status: "DRAFT" } }),
  ]);

  return { pendingTeachers, newAdmissions, pendingTestimonials };
});
