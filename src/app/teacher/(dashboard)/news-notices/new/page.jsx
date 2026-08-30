import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TeacherNewsNoticeForm } from "../components/teacher-news-notices-form";

export default function NewTeacherNewsNoticePage() {
  const t = useTranslations("teacherNewsNotices.newPage");
  const tActions = useTranslations("common.actions");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/news-notices">
            <ArrowLeft className="size-4" />
            {tActions("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
      </div>
      <TeacherNewsNoticeForm />
    </div>
  );
}
