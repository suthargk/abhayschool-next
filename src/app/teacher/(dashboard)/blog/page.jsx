import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { parsePageSize } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { TeacherBlogList } from "./components/teacher-blog-list";

const DEFAULT_PAGE_SIZE = 10;

// Async only for the translations lookup — the header itself has no data
// dependency, so it still streams immediately instead of waiting on the
// list's queries below.
export default async function TeacherBlogPage({ searchParams }) {
  const t = await getTranslations("teacherBlog.list");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button asChild>
          <Link href="/teacher/blog/new">
            <Plus className="size-4" />
            {t("newPost")}
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <BlogListSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function BlogListSection({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = parsePageSize(params.pageSize, DEFAULT_PAGE_SIZE);

  const where = { authorId: profile.id };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { summary: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total, totalCount] = await Promise.all([
    prisma.academicPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.academicPost.count({ where }),
    prisma.academicPost.count({ where: { authorId: profile.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <TeacherBlogList
      initialItems={items}
      hasAnyPosts={totalCount > 0}
      filters={{ q }}
      page={page}
      pageSize={pageSize}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      total={total}
      totalPages={totalPages}
    />
  );
}
