import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { TableSkeleton } from "@/components/table-skeleton";
import { parsePageSize } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { TeachersTable } from "./components/teachers-table";

const DEFAULT_PAGE_SIZE = 10;
const STATUSES = ["ACTIVE", "INVITED", "PENDING", "REJECTED"];

export default async function SuperAdminTeachersPage({ searchParams }) {
  const t = await getTranslations("superAdminDashboard.teachers.page");
  const params = await searchParams;

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const status = STATUSES.includes(params.status) ? params.status : "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = parsePageSize(params.pageSize, DEFAULT_PAGE_SIZE);

  const [classes, subjects] = await Promise.all([
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
    prisma.subject.findMany({ orderBy: { position: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <TeachersSection
          q={q}
          status={status}
          page={page}
          pageSize={pageSize}
          classes={classes}
          subjects={subjects}
        />
      </Suspense>
    </div>
  );
}

async function TeachersSection({ q, status, page, pageSize, classes, subjects }) {
  const where = {
    role: "TEACHER",
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [teachers, total] = await Promise.all([
    prisma.profile.findMany({
      where,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        phone: true,
        photoUrl: true,
        inviteTokenExpiresAt: true,
        createdAt: true,
        teacherAssignments: { orderBy: [{ class: "asc" }, { subject: "asc" }] },
        teacherFeaturePermissions: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.profile.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <TeachersTable
      items={teachers}
      classes={classes}
      subjects={subjects}
      search={q}
      status={status}
      page={page}
      totalPages={totalPages}
      total={total}
      pageSize={pageSize}
      defaultPageSize={DEFAULT_PAGE_SIZE}
    />
  );
}
