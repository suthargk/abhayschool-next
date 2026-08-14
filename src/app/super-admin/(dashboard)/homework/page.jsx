import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { parsePageSize } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { HomeworkTable } from "./components/homework-table";

const DEFAULT_PAGE_SIZE = 10;

export default async function SuperAdminHomeworkPage({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = parsePageSize(params.pageSize, DEFAULT_PAGE_SIZE);

  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { subject: { contains: q, mode: "insensitive" } },
          { teacherName: { contains: q, mode: "insensitive" } },
          { author: { email: { contains: q, mode: "insensitive" } } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.homework.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { email: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.homework.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Homework</h1>
          <p className="text-muted-foreground">
            Manage class assignments and their due dates.
          </p>
        </div>
        <Button asChild>
          <Link href="/super-admin/homework/new">
            <Plus className="size-4" />
            Create
          </Link>
        </Button>
      </div>

      <HomeworkTable
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
