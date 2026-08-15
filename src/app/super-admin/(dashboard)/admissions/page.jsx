import { Suspense } from "react";

import { TableSkeleton } from "@/components/table-skeleton";
import { parsePageSize } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { AdmissionsTable } from "./components/admissions-table";

const DEFAULT_PAGE_SIZE = 10;
const STATUSES = ["NEW", "CONTACTED", "CLOSED"];

export default async function SuperAdminAdmissionsPage({ searchParams }) {
  const params = await searchParams;

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const status = STATUSES.includes(params.status) ? params.status : "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = parsePageSize(params.pageSize, DEFAULT_PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Admissions</h1>
        <p className="text-muted-foreground">
          Enquiries submitted through the public admission form.
        </p>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <AdmissionsSection q={q} status={status} page={page} pageSize={pageSize} />
      </Suspense>
    </div>
  );
}

async function AdmissionsSection({ q, status, page, pageSize }) {
  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { studentName: { contains: q, mode: "insensitive" } },
            { parentName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.admissionEnquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.admissionEnquiry.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdmissionsTable
      items={items}
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
