import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getTranslations } from "next-intl/server";
import {
  Building2,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  ImageIcon,
  Library,
  Megaphone,
  MessageSquareQuote,
  Newspaper,
  Quote,
  Trophy,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";

const RECENT_LIMIT = 10;
const PER_MODEL_LIMIT = 10;

const SOURCES = [
  {
    kind: "News & Notices",
    kindKey: "newsNotices",
    icon: Megaphone,
    hrefFor: (id) => `/super-admin/news-notices/${id}/edit`,
    fetch: () =>
      prisma.newsNotice.findMany({
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { email: true } },
        },
      }),
    titleOf: (item) => item.title,
  },
  {
    kind: "Gallery",
    kindKey: "gallery",
    icon: ImageIcon,
    hrefFor: (id) => `/super-admin/gallery/${id}/edit`,
    fetch: () =>
      prisma.galleryAlbum.findMany({
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { email: true } },
        },
      }),
    titleOf: (item) => item.title,
  },
  {
    kind: "Homework",
    kindKey: "homework",
    icon: GraduationCap,
    hrefFor: (id) => `/super-admin/homework/${id}/edit`,
    fetch: () =>
      prisma.homework.findMany({
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { email: true } },
        },
      }),
    titleOf: (item) => item.title,
  },
  {
    kind: "Faculty",
    kindKey: "faculty",
    icon: Users,
    hrefFor: (id) => `/super-admin/about-us/faculty/${id}/edit`,
    fetch: () =>
      prisma.faculty.findMany({
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { email: true } },
        },
      }),
    titleOf: (item) => item.name,
  },
  {
    kind: "Facilities",
    kindKey: "facilities",
    icon: Building2,
    hrefFor: (id) => `/super-admin/about-us/facilities/${id}/edit`,
    fetch: () =>
      prisma.facility.findMany({
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { email: true } },
        },
      }),
    titleOf: (item) => item.title,
  },
  {
    kind: "Library",
    kindKey: "library",
    icon: Library,
    hrefFor: (id) => `/super-admin/academic/library/${id}/edit`,
    fetch: () =>
      prisma.libraryBook.findMany({
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          bookName: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { email: true } },
        },
      }),
    titleOf: (item) => item.bookName,
  },
  {
    kind: "Blog",
    kindKey: "blog",
    icon: Newspaper,
    hrefFor: (id) => `/super-admin/academic/blog/${id}/edit`,
    fetch: () =>
      prisma.academicPost.findMany({
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { email: true } },
        },
      }),
    titleOf: (item) => item.title,
  },
  {
    kind: "Toppers",
    kindKey: "toppers",
    icon: Trophy,
    hrefFor: (id) => `/super-admin/achievements/toppers/${id}/edit`,
    fetch: () =>
      prisma.topper.findMany({
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { email: true } },
        },
      }),
    titleOf: (item) => item.name,
  },
  {
    kind: "FAQ",
    kindKey: "faq",
    icon: HelpCircle,
    hrefFor: (id) => `/super-admin/homepage/faq/${id}/edit`,
    fetch: () =>
      prisma.faq.findMany({
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          question: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { email: true } },
        },
      }),
    titleOf: (item) => item.question,
  },
  {
    kind: "Testimonials",
    kindKey: "testimonials",
    icon: Quote,
    hrefFor: (id) => `/super-admin/homepage/testimonials/${id}/edit`,
    fetch: () =>
      prisma.testimonial.findMany({
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { email: true } },
        },
      }),
    titleOf: (item) => item.name,
  },
  {
    kind: "Principal's Message",
    kindKey: "principalMessage",
    icon: MessageSquareQuote,
    hrefFor: () => `/super-admin/principal-message`,
    fetch: () =>
      prisma.principalMessage.findMany({
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          principalName: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { email: true } },
        },
      }),
    titleOf: (item, t) => item.principalName || t("principalMessageFallback"),
  },
  {
    kind: "Admissions",
    kindKey: "admissions",
    icon: ClipboardList,
    hrefFor: (id) => `/super-admin/admissions/${id}`,
    fetch: () =>
      prisma.admissionEnquiry.findMany({
        orderBy: { updatedAt: "desc" },
        take: PER_MODEL_LIMIT,
        select: {
          id: true,
          studentName: true,
          parentName: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    titleOf: (item) => item.studentName,
    subtitleOf: (item) => item.parentName,
  },
];

async function getRecentChanges(t) {
  const results = await Promise.all(
    SOURCES.map(async (source) => {
      const items = await source.fetch();
      return items.map((item) => ({
        id: item.id,
        kind: source.kind,
        kindKey: source.kindKey,
        icon: source.icon,
        href: source.hrefFor(item.id),
        title: source.titleOf(item, t),
        authorEmail: source.subtitleOf ? source.subtitleOf(item) : item.author?.email,
        updatedAt: item.updatedAt,
        isNew:
          Math.abs(
            new Date(item.updatedAt).getTime() -
              new Date(item.createdAt).getTime()
          ) < 1000,
      }));
    })
  );

  return results
    .flat()
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, RECENT_LIMIT);
}

export async function RecentChanges() {
  const t = await getTranslations("superAdminDashboard.recentChanges");
  const changes = await getRecentChanges(t);

  if (changes.length === 0) {
    return (
      <div className="rounded-md border p-6 text-sm text-muted-foreground">
        {t("empty")}
      </div>
    );
  }

  return (
    <ul className="divide-y rounded-md border">
      {changes.map((change) => {
        const Icon = change.icon;
        return (
          <li key={`${change.kind}-${change.id}`} className="p-3">
            <Link
              href={change.href}
              className="flex items-center gap-3 hover:bg-muted/50 -m-3 p-3 rounded-md transition-colors"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="truncate text-sm font-medium">{change.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {change.authorEmail ?? t("unknownAuthor")} ·{" "}
                  {formatDistanceToNow(new Date(change.updatedAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {change.isNew ? (
                  <Badge variant="outline" className="text-xs">
                    {t("createdBadge")}
                  </Badge>
                ) : null}
                <Badge variant="secondary" className="text-xs">
                  {t(`kinds.${change.kindKey}`)}
                </Badge>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function RecentChangesSkeleton() {
  return (
    <div className="rounded-md border">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b p-3 last:border-b-0"
        >
          <Skeleton className="size-8 shrink-0 rounded-md" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
