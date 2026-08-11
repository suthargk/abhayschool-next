import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { NewsNoticesTable } from "./components/news-notices-table";

const PAGE_SIZE = 10;

export default async function SuperAdminNewsNoticesPage({ searchParams }) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number(params.page) || 1);

  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { author: { email: { contains: q, mode: "insensitive" } } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.newsNotice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { email: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.newsNotice.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            News &amp; Notices
          </h1>
          <p className="text-muted-foreground">
            Manage news articles and notices.
          </p>
        </div>
        <Button asChild>
          <Link href="/super-admin/news-notices/new">
            <Plus className="size-4" />
            Create
          </Link>
        </Button>
      </div>

      <NewsNoticesTable
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
