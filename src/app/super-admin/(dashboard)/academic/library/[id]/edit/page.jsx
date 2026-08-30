import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FormSkeleton } from "@/components/form-skeleton";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { LibraryForm } from "../../components/library-form";

export default async function EditLibraryBookPage({ params }) {
  const { id } = await params;
  const [t, tCommon] = await Promise.all([
    getTranslations("superAdminLibrary.editPage"),
    getTranslations("common.actions"),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="-ml-3" asChild>
          <Link href="/super-admin/academic/library">
            <ArrowLeft className="size-4" />
            {tCommon("back")}
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <EditLibraryBookSection id={id} />
      </Suspense>
    </div>
  );
}

async function EditLibraryBookSection({ id }) {
  const [item, profile, classes] = await Promise.all([
    prisma.libraryBook.findUnique({ where: { id } }),
    getCurrentProfile(),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
  ]);

  if (!item) notFound();

  return (
    <LibraryForm
      initialItem={item}
      classes={classes}
      canPublish={profile?.role === "ADMIN"}
    />
  );
}
