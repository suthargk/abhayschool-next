import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TestimonialForm } from "../components/testimonial-form";

export default async function NewTestimonialPage() {
  const t = await getTranslations("superAdminTestimonials.form");
  const tCommon = await getTranslations("common.actions");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/homepage/testimonials">
            <ArrowLeft className="size-4" />
            {tCommon("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("addTitle")}</h1>
      </div>
      <TestimonialForm />
    </div>
  );
}
