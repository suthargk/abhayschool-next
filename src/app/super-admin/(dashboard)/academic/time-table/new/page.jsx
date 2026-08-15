import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { TimeTableForm } from "../components/time-table-form";

export default async function NewTimeTableSlotPage({ searchParams }) {
  const [params, classes] = await Promise.all([
    searchParams,
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
  ]);
  const defaultClass = classes.some((c) => c.value === params.class)
    ? params.class
    : undefined;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/academic/time-table">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Add time table slot</h1>
      </div>
      <TimeTableForm classes={classes} defaultClass={defaultClass} />
    </div>
  );
}
