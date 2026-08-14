import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { parsePageSize } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { TopperTable } from "./components/topper-table";

const DEFAULT_PAGE_SIZE = 20;

export default async function SuperAdminToppersPage({ searchParams }) {
  const params = await searchParams;

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = parsePageSize(params.pageSize, DEFAULT_PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Toppers</h1>
          <p className="text-muted-foreground">
            Manage the board exam toppers shown on the public Toppers page.
          </p>
        </div>
        <Button asChild>
          <Link href="/super-admin/achievements/toppers/new">
            <Plus className="size-4" />
            Add topper
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <ToppersSection q={q} page={page} pageSize={pageSize} />
      </Suspense>
    </div>
  );
}

async function ToppersSection({ q, page, pageSize }) {
  const yearFilter = /^\d+$/.test(q) ? Number(q) : null;
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          ...(yearFilter !== null ? [{ year: yearFilter }] : []),
        ],
      }
    : {};

  const [items, total, profile] = await Promise.all([
    prisma.topper.findMany({
      where,
      orderBy: [{ year: "desc" }, { class: "asc" }, { rank: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.topper.count({ where }),
    getCurrentProfile(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <TopperTable
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
