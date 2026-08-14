import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { parsePageSize } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { AcademicPostsTable } from "./components/academic-posts-table";

const DEFAULT_PAGE_SIZE = 10;

export default async function SuperAdminAcademicBlogPage({ searchParams }) {
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
    prisma.academicPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { email: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.academicPost.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Academic Blog
          </h1>
          <p className="text-muted-foreground">
            Manage posts shown on the Academics page.
          </p>
        </div>
        <Button asChild>
          <Link href="/super-admin/academic/blog/new">
            <Plus className="size-4" />
            Create
          </Link>
        </Button>
      </div>

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
    </div>
  );
}
