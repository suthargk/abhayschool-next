import Link from "next/link";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { parsePageSize } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { TeacherHomeworkList } from "./components/teacher-homework-list";

const DEFAULT_PAGE_SIZE = 10;

// Not async: the header below has no data dependency, so it streams
// immediately on every nav click instead of waiting on the list's queries.
export default function TeacherHomeworkPage({ searchParams }) {
  const t = useTranslations("teacherHomework.page");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button asChild>
          <Link href="/teacher/homework/new">
            <Plus className="size-4" />
            {t("addHomework")}
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <HomeworkListSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function HomeworkListSection({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const classFilter = typeof params.class === "string" ? params.class : "ALL";
  const subjectFilter = typeof params.subject === "string" ? params.subject : "ALL";
  const statusFilter = typeof params.status === "string" ? params.status : "ALL";
  const dueFilter = typeof params.due === "string" ? params.due : "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = parsePageSize(params.pageSize, DEFAULT_PAGE_SIZE);

  const where = { authorId: profile.id };
  if (classFilter !== "ALL") where.class = classFilter;
  if (subjectFilter !== "ALL") where.subject = subjectFilter;
  if (statusFilter !== "ALL") where.status = statusFilter;
  if (dueFilter) {
    const start = new Date(dueFilter);
    if (!Number.isNaN(start.getTime())) {
      start.setHours(0, 0, 0, 0);
      where.dueDate = { gte: start, lt: new Date(start.getTime() + 86400000) };
    }
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { subject: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total, classes, assignments, totalCount] = await Promise.all([
    prisma.homework.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.homework.count({ where }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
    prisma.teacherAssignment.findMany({ where: { teacherId: profile.id } }),
    prisma.homework.count({ where: { authorId: profile.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <TeacherHomeworkList
      initialItems={items}
      classes={classes}
      assignments={assignments}
      hasAnyHomework={totalCount > 0}
      filters={{
        q,
        class: classFilter,
        subject: subjectFilter,
        status: statusFilter,
        due: dueFilter,
      }}
      page={page}
      pageSize={pageSize}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      total={total}
      totalPages={totalPages}
    />
  );
}
