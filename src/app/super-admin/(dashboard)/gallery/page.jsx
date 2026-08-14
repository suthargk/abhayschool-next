import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { parsePageSize } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { GalleryAlbumsTable } from "./components/gallery-albums-table";

const DEFAULT_PAGE_SIZE = 10;

export default async function SuperAdminGalleryPage({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = parsePageSize(params.pageSize, DEFAULT_PAGE_SIZE);

  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { author: { email: { contains: q, mode: "insensitive" } } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.galleryAlbum.findMany({
      where,
      orderBy: { eventDate: "desc" },
      include: { author: { select: { email: true } }, _count: { select: { images: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.galleryAlbum.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">
            Manage photo albums shown on the public gallery page.
          </p>
        </div>
        <Button asChild>
          <Link href="/super-admin/gallery/new">
            <Plus className="size-4" />
            Create
          </Link>
        </Button>
      </div>

      <GalleryAlbumsTable
        items={items}
        canPublish={profile?.role === "ADMIN"}
        search={q}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
    </div>
  );
}
