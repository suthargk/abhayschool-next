import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

import { TeacherFaqForm } from "../components/teacher-faq-form";

export default async function NewTeacherFaqPage() {
  const t = await getTranslations("teacherFaq.form");
  const tActions = await getTranslations("common.actions");
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/faq">
            <ArrowLeft className="size-4" />
            {tActions("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("newHeading")}</h1>
      </div>
      <TeacherFaqForm />
    </div>
  );
}
