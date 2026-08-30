import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { FacilityForm } from "../../components/facility-form";

export default async function EditFacilityPage({ params }) {
  const t = await getTranslations("superAdminFacilities.editPage");
  const tCommon = await getTranslations("common.actions");
  const { id } = await params;
  const [item, profile] = await Promise.all([
    prisma.facility.findUnique({ where: { id } }),
    getCurrentProfile(),
  ]);

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href={`/super-admin/about-us/facilities?section=${item.section}`}>
            <ArrowLeft className="size-4" />
            {tCommon("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
      </div>
      <FacilityForm initialItem={item} canPublish={profile?.role === "ADMIN"} />
    </div>
  );
}
