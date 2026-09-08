import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { RoutePlanAdmin } from "./components/route-plan-admin";

export default async function SuperAdminRoutePlanPage() {
  const t = await getTranslations("superAdminRoutePlan");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <RoutePlanSection />
      </Suspense>
    </div>
  );
}

async function RoutePlanSection() {
  const [items, profile] = await Promise.all([
    prisma.busRoute.findMany({ orderBy: [{ position: "asc" }] }),
    getCurrentProfile(),
  ]);

  return <RoutePlanAdmin initialItems={items} canPublish={profile?.role === "ADMIN"} />;
}
