import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import {
  RecentChanges,
  RecentChangesSkeleton,
} from "./components/recent-changes";

export default async function SuperAdminDashboardHomePage() {
  const t = await getTranslations("superAdminDashboard.home");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium tracking-tight">{t("recentChangesHeading")}</h2>
        <Suspense fallback={<RecentChangesSkeleton />}>
          <RecentChanges />
        </Suspense>
      </div>
    </div>
  );
}
