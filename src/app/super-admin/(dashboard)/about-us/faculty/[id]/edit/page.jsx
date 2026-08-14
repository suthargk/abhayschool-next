import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { FormSkeleton } from "@/components/form-skeleton";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { FacultyForm } from "../../components/faculty-form";

export default async function EditFacultyPage({ params }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/about-us/faculty">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit faculty</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditFacultySection id={id} />
      </Suspense>
    </div>
  );
}

async function EditFacultySection({ id }) {
  const [item, profile] = await Promise.all([
    prisma.faculty.findUnique({ where: { id } }),
    getCurrentProfile(),
  ]);

  if (!item) notFound();

  return <FacultyForm initialItem={item} canPublish={profile?.role === "ADMIN"} />;
}
