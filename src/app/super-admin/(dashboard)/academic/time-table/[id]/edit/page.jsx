import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { FormSkeleton } from "@/components/form-skeleton";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TimeTableForm } from "../../components/time-table-form";

export default async function EditTimeTableSlotPage({ params }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/academic/time-table">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit time table slot</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditTimeTableSlotSection id={id} />
      </Suspense>
    </div>
  );
}

async function EditTimeTableSlotSection({ id }) {
  const [item, profile, classes] = await Promise.all([
    prisma.timeTableSlot.findUnique({ where: { id } }),
    getCurrentProfile(),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
  ]);

  if (!item) notFound();

  return (
    <TimeTableForm
      initialItem={item}
      classes={classes}
      canPublish={profile?.role === "ADMIN"}
    />
  );
}
