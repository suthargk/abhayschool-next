import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { FormSkeleton } from "@/components/form-skeleton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { AdmissionDetail } from "../components/admission-detail";

export default async function AdmissionDetailPage({ params }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/admissions">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Admission enquiry</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <AdmissionDetailSection id={id} />
      </Suspense>
    </div>
  );
}

async function AdmissionDetailSection({ id }) {
  const item = await prisma.admissionEnquiry.findUnique({ where: { id } });
  if (!item) notFound();

  return <AdmissionDetail item={item} />;
}
