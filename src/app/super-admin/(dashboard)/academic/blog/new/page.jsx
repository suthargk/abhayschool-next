import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

import { AcademicPostForm } from "../components/academic-post-form";

export default async function NewAcademicPostPage() {
  const [t, tCommon] = await Promise.all([
    getTranslations("superAdminBlog.newPage"),
    getTranslations("common.actions"),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/academic/blog">
            <ArrowLeft className="size-4" />
            {tCommon("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("heading")}
        </h1>
      </div>
      <AcademicPostForm />
    </div>
  );
}
