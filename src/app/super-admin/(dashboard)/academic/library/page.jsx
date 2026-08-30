import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { LibraryAdmin } from "./components/library-admin";

export default async function SuperAdminLibraryPage() {
  const t = await getTranslations("superAdminLibrary.page");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <LibrarySection />
      </Suspense>
    </div>
  );
}

async function LibrarySection() {
  const [items, profile, classes] = await Promise.all([
    prisma.libraryBook.findMany({
      orderBy: [{ class: "asc" }, { position: "asc" }],
    }),
    getCurrentProfile(),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
  ]);

  return (
    <LibraryAdmin
      initialItems={items}
      classes={classes}
      canPublish={profile?.role === "ADMIN"}
    />
  );
}
