import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AcademicPostForm } from "../components/academic-post-form";

export default function NewAcademicPostPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/academic/blog">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create academic post
        </h1>
      </div>
      <AcademicPostForm />
    </div>
  );
}
