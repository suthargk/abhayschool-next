import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/form-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TeacherTestimonialsForm } from "../../components/teacher-testimonials-form";

// Not async: the header has no data dependency, so it streams immediately
// instead of waiting on the testimonial query below.
export default function EditTeacherTestimonialPage({ params }) {
  const t = useTranslations("teacherTestimonials.edit");
  const tActions = useTranslations("common.actions");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/testimonials">
            <ArrowLeft className="size-4" />
            {tActions("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditTestimonialFormSection params={params} />
      </Suspense>
    </div>
  );
}

async function EditTestimonialFormSection({ params }) {
  const { id } = await params;
  const profile = await getCurrentProfile();

  const item = await prisma.testimonial.findUnique({ where: { id } });

  if (!item || item.authorId !== profile.id) notFound();

  return <TeacherTestimonialsForm initialItem={item} />;
}
