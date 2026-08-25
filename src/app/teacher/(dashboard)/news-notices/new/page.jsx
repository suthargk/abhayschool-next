import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TeacherNewsNoticeForm } from "../components/teacher-news-notices-form";

export default function NewTeacherNewsNoticePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/news-notices">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Add news or notice</h1>
      </div>
      <TeacherNewsNoticeForm />
    </div>
  );
}
