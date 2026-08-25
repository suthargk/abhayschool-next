import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/form-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TeacherFacilityForm } from "../../components/teacher-facility-form";

// Not async: the header has no data dependency, so it streams immediately
// instead of waiting on the facility query below.
export default function EditTeacherFacilityPage({ params }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/facilities">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit facility</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditFacilityFormSection params={params} />
      </Suspense>
    </div>
  );
}

async function EditFacilityFormSection({ params }) {
  const { id } = await params;
  const profile = await getCurrentProfile();

  const item = await prisma.facility.findUnique({ where: { id } });

  if (!item || item.authorId !== profile.id) notFound();

  return <TeacherFacilityForm initialItem={item} />;
}
