import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

import { TeacherBlogForm } from "../components/teacher-blog-form";

export default async function NewTeacherBlogPage() {
  const t = await getTranslations("teacherBlog.form");
  const tActions = await getTranslations("common.actions");
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/teacher/blog">
            <ArrowLeft className="size-4" />
            {tActions("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("newHeading")}</h1>
      </div>
      <TeacherBlogForm />
    </div>
  );
}
