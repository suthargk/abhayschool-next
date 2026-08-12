import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TopperTable } from "./components/topper-table";

const PAGE_SIZE = 20;

export default async function SuperAdminToppersPage({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number(params.page) || 1);

  const yearFilter = /^\d+$/.test(q) ? Number(q) : null;
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          ...(yearFilter !== null ? [{ year: yearFilter }] : []),
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.topper.findMany({
      where,
      orderBy: [{ year: "desc" }, { class: "asc" }, { rank: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.topper.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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

      <TopperTable
        items={items}
        canPublish={profile?.role === "ADMIN"}
        search={q}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
