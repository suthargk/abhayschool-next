import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { FacilityForm } from "../components/facility-form";

const SECTIONS = ["OVERVIEW", "SPORTS", "SAFETY", "FAQ"];

export default async function NewFacilityPage({ searchParams }) {
  const t = await getTranslations("superAdminFacilities.newPage");
  const tCommon = await getTranslations("common.actions");
  const params = await searchParams;
  const section = SECTIONS.includes(params.section) ? params.section : "OVERVIEW";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href={`/super-admin/about-us/facilities?section=${section}`}>
            <ArrowLeft className="size-4" />
            {tCommon("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
      </div>
      <FacilityForm initialSection={section} />
    </div>
  );
}
