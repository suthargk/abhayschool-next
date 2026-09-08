import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { FormSkeleton } from "@/components/form-skeleton";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { RoutePlanForm } from "../../components/route-plan-form";

export default async function EditRoutePlanStopPage({ params }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/about-us/route-plan">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit stop</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditRoutePlanStopSection id={id} />
      </Suspense>
    </div>
  );
}

async function EditRoutePlanStopSection({ id }) {
  const [item, profile] = await Promise.all([
    prisma.busRoute.findUnique({ where: { id } }),
    getCurrentProfile(),
  ]);

  if (!item) notFound();

  return <RoutePlanForm initialItem={item} canPublish={profile?.role === "ADMIN"} />;
}
