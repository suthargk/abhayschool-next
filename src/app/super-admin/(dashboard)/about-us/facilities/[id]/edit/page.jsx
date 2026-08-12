import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { FacilityForm } from "../../components/facility-form";

export default async function EditFacilityPage({ params }) {
  const { id } = await params;
  const [item, profile] = await Promise.all([
    prisma.facility.findUnique({ where: { id } }),
    getCurrentProfile(),
  ]);

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href={`/super-admin/about-us/facilities?section=${item.section}`}>
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit facility</h1>
      </div>
      <FacilityForm initialItem={item} canPublish={profile?.role === "ADMIN"} />
    </div>
  );
}
