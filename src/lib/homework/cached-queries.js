import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

export const HOMEWORK_CACHE_TAG = "homework";

/** Quick summary counts shown at the top of the public homework page. */
export const getHomeworkSummaryCounts = unstable_cache(
  async () => {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const in3Days = new Date(startOfToday.getTime() + 3 * 86400000);

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek.getTime() + 7 * 86400000);

    const published = { status: "PUBLISHED", publishedAt: { lte: now } };

    const [assigned, dueSoon, overdue, thisWeek] = await Promise.all([
      prisma.homework.count({ where: published }),
      prisma.homework.count({
        where: { ...published, dueDate: { gte: startOfToday, lte: in3Days } },
      }),
      prisma.homework.count({
        where: { ...published, dueDate: { lt: startOfToday } },
      }),
      prisma.homework.count({
        where: { ...published, dueDate: { gte: startOfWeek, lt: endOfWeek } },
      }),
    ]);

    return { assigned, dueSoon, overdue, thisWeek };
  },
  ["homework-summary-counts"],
  { revalidate: 60, tags: [HOMEWORK_CACHE_TAG] },
);

/** Classes with at least one published assignment — populates the class filter. */
export const getHomeworkClasses = unstable_cache(
  async () => {
    const rows = await prisma.homework.findMany({
      where: { status: "PUBLISHED" },
      distinct: ["class"],
      select: { class: true },
    });
    return rows.map((r) => r.class);
  },
  ["homework-classes"],
  { revalidate: 300, tags: [HOMEWORK_CACHE_TAG] },
);

/** Subjects with at least one published assignment — populates the subject filter. */
export const getHomeworkSubjects = unstable_cache(
  async () => {
    const rows = await prisma.homework.findMany({
      where: { status: "PUBLISHED" },
      distinct: ["subject"],
      select: { subject: true },
      orderBy: { subject: "asc" },
    });
    return rows.map((r) => r.subject);
  },
  ["homework-subjects"],
  { revalidate: 300, tags: [HOMEWORK_CACHE_TAG] },
);
