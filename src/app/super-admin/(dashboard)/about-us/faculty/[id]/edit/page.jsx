import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { FacultyForm } from "../../components/faculty-form";

export default async function EditFacultyPage({ params }) {
  const { id } = await params;
  const [item, profile] = await Promise.all([
    prisma.faculty.findUnique({ where: { id } }),
    getCurrentProfile(),
  ]);

  if (!item) notFound();

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
      <FacultyForm initialItem={item} canPublish={profile?.role === "ADMIN"} />
    </div>
  );
}
