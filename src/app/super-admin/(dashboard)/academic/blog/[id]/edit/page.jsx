import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FormSkeleton } from "@/components/form-skeleton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { AcademicPostForm } from "../../components/academic-post-form";

export default async function EditAcademicPostPage({ params }) {
  const { id } = await params;
  const [t, tCommon] = await Promise.all([
    getTranslations("superAdminBlog.editPage"),
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
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditAcademicPostSection id={id} />
      </Suspense>
    </div>
  );
}

async function EditAcademicPostSection({ id }) {
  const item = await prisma.academicPost.findUnique({ where: { id } });

  if (!item) notFound();

  return <AcademicPostForm initialItem={item} />;
}
