import { prisma } from "@/lib/prisma";

const PER_MODEL_LIMIT = 5;

function authorName(author) {
  if (!author) return "A teacher";
  const name = [author.firstName, author.lastName].filter(Boolean).join(" ");
  return name || author.email || "A teacher";
}

const AUTHOR_SELECT = { select: { firstName: true, lastName: true, email: true } };
const TEACHER_AUTHOR_WHERE = { author: { role: "TEACHER" } };

const SOURCES = [
  {
    kind: "FAQ",
    hrefFor: (id) => `/super-admin/homepage/faq/${id}/edit`,
    fetch: () =>
      prisma.faq.findMany({
        where: TEACHER_AUTHOR_WHERE,
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          question: true,
          createdAt: true,
          updatedAt: true,
          author: AUTHOR_SELECT,
        },
      }),
    titleOf: (item) => item.question,
  },
  {
    kind: "Testimonials",
    hrefFor: (id) => `/super-admin/homepage/testimonials/${id}/edit`,
    fetch: () =>
      prisma.testimonial.findMany({
        where: TEACHER_AUTHOR_WHERE,
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          author: AUTHOR_SELECT,
        },
      }),
    titleOf: (item) => item.name,
  },
  {
    kind: "Principal's Message",
    hrefFor: () => `/super-admin/principal-message`,
    fetch: () =>
      prisma.principalMessage.findMany({
        where: TEACHER_AUTHOR_WHERE,
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          principalName: true,
          createdAt: true,
          updatedAt: true,
          author: AUTHOR_SELECT,
        },
      }),
    titleOf: (item) => item.principalName || "Principal's Message",
  },
  {
    kind: "Faculty",
    hrefFor: (id) => `/super-admin/about-us/faculty/${id}/edit`,
    fetch: () =>
      prisma.faculty.findMany({
        where: TEACHER_AUTHOR_WHERE,
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          author: AUTHOR_SELECT,
        },
      }),
    titleOf: (item) => item.name,
  },
  {
    kind: "Facilities",
    hrefFor: (id) => `/super-admin/about-us/facilities/${id}/edit`,
    fetch: () =>
      prisma.facility.findMany({
        where: TEACHER_AUTHOR_WHERE,
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          author: AUTHOR_SELECT,
        },
      }),
    titleOf: (item) => item.title,
  },
  {
    kind: "Gallery",
    hrefFor: (id) => `/super-admin/gallery/${id}/edit`,
    fetch: () =>
      prisma.galleryAlbum.findMany({
        where: TEACHER_AUTHOR_WHERE,
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          author: AUTHOR_SELECT,
        },
      }),
    titleOf: (item) => item.title,
  },
  {
    kind: "News & Notices",
    hrefFor: (id) => `/super-admin/news-notices/${id}/edit`,
    fetch: () =>
      prisma.newsNotice.findMany({
        where: TEACHER_AUTHOR_WHERE,
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          author: AUTHOR_SELECT,
        },
      }),
    titleOf: (item) => item.title,
  },
  {
    kind: "Homework",
    hrefFor: (id) => `/super-admin/homework/${id}/edit`,
    fetch: () =>
      prisma.homework.findMany({
        where: TEACHER_AUTHOR_WHERE,
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          author: AUTHOR_SELECT,
        },
      }),
    titleOf: (item) => item.title,
  },
  {
    kind: "Classes",
    hrefFor: () => `/super-admin/classes`,
    fetch: () =>
      prisma.schoolClass.findMany({
        where: TEACHER_AUTHOR_WHERE,
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          label: true,
          createdAt: true,
          updatedAt: true,
          author: AUTHOR_SELECT,
        },
      }),
    titleOf: (item) => item.label,
  },
  {
    kind: "Library",
    hrefFor: (id) => `/super-admin/academic/library/${id}/edit`,
    fetch: () =>
      prisma.libraryBook.findMany({
        where: TEACHER_AUTHOR_WHERE,
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          bookName: true,
          createdAt: true,
          updatedAt: true,
          author: AUTHOR_SELECT,
        },
      }),
    titleOf: (item) => item.bookName,
  },
  {
    kind: "Time Table",
    hrefFor: (id) => `/super-admin/academic/time-table/${id}/edit`,
    fetch: () =>
      prisma.timeTableSlot.findMany({
        where: TEACHER_AUTHOR_WHERE,
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          class: true,
          day: true,
          subject: true,
          createdAt: true,
          updatedAt: true,
          author: AUTHOR_SELECT,
        },
      }),
    titleOf: (item) =>
      `${item.subject} · ${item.class}, ${item.day.charAt(0)}${item.day.slice(1).toLowerCase()}`,
  },
  {
    kind: "Blog",
    hrefFor: (id) => `/super-admin/academic/blog/${id}/edit`,
    fetch: () =>
      prisma.academicPost.findMany({
        where: TEACHER_AUTHOR_WHERE,
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          author: AUTHOR_SELECT,
        },
      }),
    titleOf: (item) => item.title,
  },
  {
    kind: "Toppers",
    hrefFor: (id) => `/super-admin/achievements/toppers/${id}/edit`,
    fetch: () =>
      prisma.topper.findMany({
        where: TEACHER_AUTHOR_WHERE,
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          author: AUTHOR_SELECT,
        },
      }),
    titleOf: (item) => item.name,
  },
];

/**
 * Recent content changes made by TEACHER-role authors across every area a
 * teacher can post to (the 12 permission-gated areas plus Homework), merged
 * and sorted for the admin notification bell. Returns plain serializable
 * data only — no component references — since this is called from a server
 * layout and passed as props into a client component.
 */
export async function getRecentTeacherActivity(limit = 8) {
  const results = await Promise.all(
    SOURCES.map(async (source) => {
      const items = await source.fetch();
      return items.map((item) => {
        const isNew =
          Math.abs(new Date(item.updatedAt).getTime() - new Date(item.createdAt).getTime()) <
          1000;
        return {
          id: `${source.kind}-${item.id}`,
          href: source.hrefFor(item.id),
          kind: source.kind,
          action: isNew ? "added" : "updated",
          authorName: authorName(item.author),
          detail: source.titleOf(item),
          createdAt: item.updatedAt,
        };
      });
    }),
  );

  return results
    .flat()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
