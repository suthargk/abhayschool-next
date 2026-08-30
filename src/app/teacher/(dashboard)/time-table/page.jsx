import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { parsePageSize } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { TeacherTimeTableList } from "./components/teacher-time-table-list";

const DEFAULT_PAGE_SIZE = 10;

// Not async: the header below has no data dependency, so it streams
// immediately on every nav click instead of waiting on the list's queries.
export default function TeacherTimeTablePage({ searchParams }) {
  const t = useTranslations("teacherTimeTable.page");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button asChild>
          <Link href="/teacher/time-table/new">
            <Plus className="size-4" />
            {t("addSlot")}
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <TimeTableListSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function TimeTableListSection({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const classFilter = typeof params.class === "string" ? params.class : "ALL";
  const dayFilter = typeof params.day === "string" ? params.day : "ALL";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = parsePageSize(params.pageSize, DEFAULT_PAGE_SIZE);

  const where = { authorId: profile.id };
  if (classFilter !== "ALL") where.class = classFilter;
  if (dayFilter !== "ALL") where.day = dayFilter;
  if (q) {
    where.OR = [
      { subject: { contains: q, mode: "insensitive" } },
      { teacherName: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total, classes, totalCount] = await Promise.all([
    prisma.timeTableSlot.findMany({
      where,
      orderBy: [{ class: "asc" }, { day: "asc" }, { period: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.timeTableSlot.count({ where }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
    prisma.timeTableSlot.count({ where: { authorId: profile.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <TeacherTimeTableList
      initialItems={items}
      classes={classes}
      hasAnySlots={totalCount > 0}
      filters={{ q, class: classFilter, day: dayFilter }}
      page={page}
      pageSize={pageSize}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      total={total}
      totalPages={totalPages}
    />
  );
}
