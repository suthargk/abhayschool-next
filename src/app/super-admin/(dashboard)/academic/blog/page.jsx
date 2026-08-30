import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { parsePageSize } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { AcademicPostsTable } from "./components/academic-posts-table";

const DEFAULT_PAGE_SIZE = 10;

export default async function SuperAdminAcademicBlogPage({ searchParams }) {
  const params = await searchParams;
  const t = await getTranslations("superAdminBlog.page");

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = parsePageSize(params.pageSize, DEFAULT_PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("heading")}
          </h1>
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <Button asChild>
          <Link href="/super-admin/academic/blog/new">
            <Plus className="size-4" />
            {t("create")}
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <AcademicPostsSection q={q} page={page} pageSize={pageSize} />
      </Suspense>
    </div>
  );
}

async function AcademicPostsSection({ q, page, pageSize }) {
  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { author: { email: { contains: q, mode: "insensitive" } } },
        ],
      }
    : {};

  const [items, total, profile] = await Promise.all([
    prisma.academicPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { email: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.academicPost.count({ where }),
    getCurrentProfile(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AcademicPostsTable
      items={items}
      canPublish={profile?.role === "ADMIN"}
      search={q}
      page={page}
      totalPages={totalPages}
      total={total}
      pageSize={pageSize}
      defaultPageSize={DEFAULT_PAGE_SIZE}
    />
  );
}
