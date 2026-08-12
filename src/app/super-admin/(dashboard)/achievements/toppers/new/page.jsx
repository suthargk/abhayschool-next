import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TopperForm } from "../components/topper-form";

export default function NewTopperPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/achievements/toppers">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Add topper</h1>
      </div>
      <TopperForm />
    </div>
  );
}
