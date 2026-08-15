import { Suspense } from "react";

import { TableSkeleton } from "@/components/table-skeleton";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { LibraryAdmin } from "./components/library-admin";

export default function SuperAdminLibraryPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Library</h1>
        <p className="text-muted-foreground">
          Manage the book catalogue shown on the public Library page, by class.
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
