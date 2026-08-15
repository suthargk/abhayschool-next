import { Suspense } from "react";

import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TimeTableAdmin } from "./components/time-table-admin";

export default function SuperAdminTimeTablePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Time Table</h1>
        <p className="text-muted-foreground">
          Manage the weekly time table shown on the public Time Table page, by class.
        </p>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <TimeTableSection />
      </Suspense>
    </div>
  );
}

async function TimeTableSection() {
  const [items, profile, classes] = await Promise.all([
    prisma.timeTableSlot.findMany({
      orderBy: [{ class: "asc" }, { day: "asc" }, { period: "asc" }],
    }),
    getCurrentProfile(),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
  ]);

  return (
    <TimeTableAdmin
      initialItems={items}
      classes={classes}
      canPublish={profile?.role === "ADMIN"}
    />
  );
}
