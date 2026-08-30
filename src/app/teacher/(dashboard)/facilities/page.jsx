import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TeacherFacilitySectionTabs } from "./components/teacher-facility-section-tabs";
import { TeacherFacilityList } from "./components/teacher-facility-list";

const SECTIONS = ["OVERVIEW", "SPORTS", "SAFETY", "FAQ"];

export default async function TeacherFacilitiesPage({ searchParams }) {
  const params = await searchParams;
  const section = SECTIONS.includes(params.section) ? params.section : "OVERVIEW";
  const t = await getTranslations("teacherFacilities.list");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button asChild>
          <Link href={`/teacher/facilities/new?section=${section}`}>
            <Plus className="size-4" />
            {t("addFacility")}
          </Link>
        </Button>
      </div>

      <TeacherFacilitySectionTabs active={section} />

      <Suspense key={section} fallback={<TableSkeleton />}>
        <FacilitiesSection section={section} />
      </Suspense>
    </div>
  );
}

async function FacilitiesSection({ section }) {
  const profile = await getCurrentProfile();

  const items = await prisma.facility.findMany({
    where: { section, authorId: profile.id },
    orderBy: { position: "asc" },
  });

  return <TeacherFacilityList initialItems={items} section={section} />;
}
