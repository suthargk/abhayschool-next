import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TeacherNewsNoticesList } from "./components/teacher-news-notices-list";

// Not async: the header below has no data dependency, so it streams
// immediately on every nav click instead of waiting on the list's queries.
export default function TeacherNewsNoticesPage({ searchParams }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">News & Notices</h1>
          <p className="text-muted-foreground">News and notices you&apos;ve posted.</p>
        </div>
        <Button asChild>
          <Link href="/teacher/news-notices/new">
            <Plus className="size-4" />
            Add item
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <NewsNoticesListSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function NewsNoticesListSection({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";

  const where = { authorId: profile.id };
  if (q) {
    where.title = { contains: q, mode: "insensitive" };
  }

  const [items, totalCount] = await Promise.all([
    prisma.newsNotice.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.newsNotice.count({ where: { authorId: profile.id } }),
  ]);

  return (
    <TeacherNewsNoticesList initialItems={items} hasAnyItems={totalCount > 0} filters={{ q }} />
  );
}
