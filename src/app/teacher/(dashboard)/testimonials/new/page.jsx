import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TeacherTestimonialsForm } from "../components/teacher-testimonials-form";

export default function NewTeacherTestimonialPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/testimonials">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Add testimonial</h1>
      </div>
      <TeacherTestimonialsForm />
    </div>
  );
}
