import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { parsePageSize } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { TeacherGalleryList } from "./components/teacher-gallery-list";

const DEFAULT_PAGE_SIZE = 10;

// Async only for the translations lookup — the header itself has no data
// dependency, so it still streams immediately instead of waiting on the
// list's queries below.
export default async function TeacherGalleryPage({ searchParams }) {
  const t = await getTranslations("teacherGallery.page");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button asChild>
          <Link href="/teacher/gallery/new">
            <Plus className="size-4" />
            {t("addButton")}
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <GalleryListSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function GalleryListSection({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = parsePageSize(params.pageSize, DEFAULT_PAGE_SIZE);

  const where = { authorId: profile.id };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total, totalCount] = await Promise.all([
    prisma.galleryAlbum.findMany({
      where,
      orderBy: { eventDate: "desc" },
      include: { _count: { select: { images: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.galleryAlbum.count({ where }),
    prisma.galleryAlbum.count({ where: { authorId: profile.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <TeacherGalleryList
      initialItems={items}
      hasAnyAlbums={totalCount > 0}
      filters={{ q }}
      page={page}
      pageSize={pageSize}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      total={total}
      totalPages={totalPages}
    />
  );
}
