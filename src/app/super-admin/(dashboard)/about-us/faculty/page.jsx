import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { FacultyTable } from "./components/faculty-table";

export default async function SuperAdminFacultyPage() {
  const t = await getTranslations("superAdminFaculty.page");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button asChild>
          <Link href="/super-admin/about-us/faculty/new">
            <Plus className="size-4" />
            {t("addFaculty")}
          </Link>
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <FacultySection />
      </Suspense>
    </div>
  );
}

async function FacultySection() {
  const [items, profile] = await Promise.all([
    prisma.faculty.findMany({
      orderBy: { position: "asc" },
      include: { author: { select: { email: true } } },
    }),
    getCurrentProfile(),
  ]);

  return <FacultyTable initialItems={items} canPublish={profile?.role === "ADMIN"} />;
}
