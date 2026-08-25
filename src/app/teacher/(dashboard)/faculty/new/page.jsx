import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TeacherFacultyForm } from "../components/teacher-faculty-form";

export default function NewTeacherFacultyPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/faculty">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Add faculty</h1>
      </div>
      <TeacherFacultyForm />
    </div>
  );
}
