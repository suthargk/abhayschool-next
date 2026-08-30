import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { LibraryForm } from "../components/library-form";

export default async function NewLibraryBookPage({ searchParams }) {
  const [params, classes, t, tCommon] = await Promise.all([
    searchParams,
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
    getTranslations("superAdminLibrary.newPage"),
    getTranslations("common.actions"),
  ]);
  const defaultClass = classes.some((c) => c.value === params.class)
    ? params.class
    : undefined;

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
      <LibraryForm classes={classes} defaultClass={defaultClass} />
    </div>
  );
}
