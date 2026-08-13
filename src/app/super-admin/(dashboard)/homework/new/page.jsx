import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { HomeworkForm } from "../components/homework-form";

export default function NewHomeworkPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/homework">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create homework
        </h1>
      </div>
      <HomeworkForm />
    </div>
  );
}
