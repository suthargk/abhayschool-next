import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { FacilitySectionTabs } from "./components/facility-section-tabs";
import { FacilityTable } from "./components/facility-table";

const SECTIONS = ["OVERVIEW", "SPORTS", "SAFETY", "FAQ"];

export default async function SuperAdminFacilitiesPage({ searchParams }) {
  const t = await getTranslations("superAdminFacilities.page");
  const params = await searchParams;
  const section = SECTIONS.includes(params.section) ? params.section : "OVERVIEW";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button asChild>
          <Link href={`/super-admin/about-us/facilities/new?section=${section}`}>
            <Plus className="size-4" />
            {t("addFacility")}
          </Link>
        </Button>
      </div>

      <FacilitySectionTabs active={section} />

      <Suspense key={section} fallback={<TableSkeleton />}>
        <FacilitiesSection section={section} />
      </Suspense>
    </div>
  );
}

async function FacilitiesSection({ section }) {
  const [items, profile] = await Promise.all([
    prisma.facility.findMany({
      where: { section },
      orderBy: { position: "asc" },
      include: { author: { select: { email: true } } },
    }),
    getCurrentProfile(),
  ]);

  return <FacilityTable initialItems={items} canPublish={profile?.role === "ADMIN"} />;
}
