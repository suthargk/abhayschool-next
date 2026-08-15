import { Suspense } from "react";

import {
  RecentChanges,
  RecentChangesSkeleton,
} from "./components/recent-changes";

export default function SuperAdminDashboardHomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Choose a section from the left to manage content. This area is
          separate from the public site header and footer.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium tracking-tight">Recent changes</h2>
        <Suspense fallback={<RecentChangesSkeleton />}>
          <RecentChanges />
        </Suspense>
      </div>
    </div>
  );
}
