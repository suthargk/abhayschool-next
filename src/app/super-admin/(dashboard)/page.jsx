import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import {
  RecentChanges,
  RecentChangesSkeleton,
} from "./components/recent-changes";
import { StatCards, StatCardsSkeleton } from "./components/stat-cards";
import { PendingActions, PendingActionsSkeleton } from "./components/pending-actions";
import {
  AdmissionsTrendCard,
  AdmissionsTrendCardSkeleton,
  ContentStatusCard,
  ContentStatusCardSkeleton,
  HomeworkByClassCard,
  HomeworkByClassCardSkeleton,
  HomeworkTrendCard,
  HomeworkTrendCardSkeleton,
  PageViewsTrendCard,
  PageViewsTrendCardSkeleton,
} from "./components/overview-charts";

export default async function SuperAdminDashboardHomePage() {
  const t = await getTranslations("superAdminDashboard.home");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Suspense fallback={<StatCardsSkeleton />}>
        <StatCards />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<AdmissionsTrendCardSkeleton />}>
          <AdmissionsTrendCard />
        </Suspense>
        <Suspense fallback={<PageViewsTrendCardSkeleton />}>
          <PageViewsTrendCard />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<HomeworkTrendCardSkeleton />}>
          <HomeworkTrendCard />
        </Suspense>
        <Suspense fallback={<HomeworkByClassCardSkeleton />}>
          <HomeworkByClassCard />
        </Suspense>
      </div>

      <Suspense fallback={<ContentStatusCardSkeleton />}>
        <ContentStatusCard />
      </Suspense>

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-3 lg:col-span-1">
          <h2 className="text-lg font-medium tracking-tight">
            {t("pendingActionsHeading")}
          </h2>
          <Suspense fallback={<PendingActionsSkeleton />}>
            <PendingActions />
          </Suspense>
        </div>

        <div className="min-w-0 space-y-3 lg:col-span-2">
          <h2 className="text-lg font-medium tracking-tight">
            {t("recentChangesHeading")}
          </h2>
          <Suspense fallback={<RecentChangesSkeleton />}>
            <RecentChanges />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
