import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { parsePageSize } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { TeacherToppersList } from "./components/teacher-toppers-list";

const DEFAULT_PAGE_SIZE = 10;

// Not async: the header below has no data dependency, so it streams
// immediately on every nav click instead of waiting on the list's queries.
export default function TeacherToppersPage({ searchParams }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Toppers</h1>
          <p className="text-muted-foreground">Toppers you&apos;ve added.</p>
        </div>
        <Button asChild>
          <Link href="/teacher/toppers/new">
            <Plus className="size-4" />
            Add topper
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <ToppersListSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ToppersListSection({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = parsePageSize(params.pageSize, DEFAULT_PAGE_SIZE);

  const yearFilter = /^\d+$/.test(q) ? Number(q) : null;
  const where = { authorId: profile.id };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      ...(yearFilter !== null ? [{ year: yearFilter }] : []),
    ];
  }

  const [items, total, totalCount] = await Promise.all([
    prisma.topper.findMany({
      where,
      orderBy: [{ year: "desc" }, { class: "asc" }, { rank: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.topper.count({ where }),
    prisma.topper.count({ where: { authorId: profile.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <TeacherToppersList
      initialItems={items}
      hasAnyToppers={totalCount > 0}
      filters={{ q }}
      page={page}
      pageSize={pageSize}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      total={total}
      totalPages={totalPages}
    />
  );
}
