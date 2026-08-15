import { prisma } from "@/lib/prisma";

import { TimeTableView } from "./components/time-table-view";

export const revalidate = 60;

export default async function TimeTablePage() {
  const [slots, classes] = await Promise.all([
    prisma.timeTableSlot.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ class: "asc" }, { day: "asc" }, { period: "asc" }],
    }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
  ]);

  return (
    <div className="min-h-screen px-4 pb-16 pt-[100px] md:px-10 md:pt-[102px] lg:px-20">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Time Table
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Weekly class schedule, organized by class, day, and period.
          </p>
        </div>

        <TimeTableView slots={slots} classes={classes} />
      </div>
    </div>
  );
}
