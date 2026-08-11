import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LIBRARY_CLASS_VALUES } from "@/data/library-classes";

import { LibraryForm } from "../components/library-form";

export default async function NewLibraryBookPage({ searchParams }) {
  const params = await searchParams;
  const defaultClass = LIBRARY_CLASS_VALUES.includes(params.class) ? params.class : undefined;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/academic/library">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Add book</h1>
      </div>
      <LibraryForm defaultClass={defaultClass} />
    </div>
  );
}
