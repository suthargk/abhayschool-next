import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { FacilityForm } from "../components/facility-form";

const SECTIONS = ["OVERVIEW", "SPORTS", "SAFETY", "FAQ"];

export default async function NewFacilityPage({ searchParams }) {
  const params = await searchParams;
  const section = SECTIONS.includes(params.section) ? params.section : "OVERVIEW";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href={`/super-admin/about-us/facilities?section=${section}`}>
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Add facility</h1>
      </div>
      <FacilityForm initialSection={section} />
    </div>
  );
}
