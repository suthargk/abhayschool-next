import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

export const NEWS_NOTICES_CACHE_TAG = "news-notices";

/** Pinned notices barely change; cache them instead of hitting the DB on every page view. */
export const getPinnedNewsNotices = unstable_cache(
  async () => {
    const now = new Date();
    return prisma.newsNotice.findMany({
      where: {
        status: "PUBLISHED",
        pinned: true,
        publishedAt: { lte: now },
        OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
  },
  ["news-notices-pinned"],
  { revalidate: 60, tags: [NEWS_NOTICES_CACHE_TAG] },
);

/** Homepage widget's latest items — same content for every visitor, safe to cache. */
export const getHomepageNewsNotices = unstable_cache(
  async () => {
    const now = new Date();
    return prisma.newsNotice.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { lte: now },
        OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
      },
      orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
      take: 6,
      select: {
        id: true,
        slug: true,
        type: true,
        category: true,
        pinned: true,
        title: true,
        summary: true,
        publishedAt: true,
        coverImageUrl: true,
      },
    });
  },
  ["news-notices-homepage"],
  { revalidate: 60, tags: [NEWS_NOTICES_CACHE_TAG] },
);

/** Academic years with published content — changes at most a few times a year. */
export const getArchiveAcademicYears = unstable_cache(
  async () => {
    const rows = await prisma.newsNotice.findMany({
      where: { status: "PUBLISHED", academicYear: { not: null } },
      distinct: ["academicYear"],
      select: { academicYear: true },
    });
    return rows.map((r) => r.academicYear).filter(Boolean);
  },
  ["news-notices-archive-years"],
  { revalidate: 300, tags: [NEWS_NOTICES_CACHE_TAG] },
);
