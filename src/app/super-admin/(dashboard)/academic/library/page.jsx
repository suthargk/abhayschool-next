import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { LibraryAdmin } from "./components/library-admin";

export default async function SuperAdminLibraryPage() {
  const [items, profile] = await Promise.all([
    prisma.libraryBook.findMany({
      orderBy: [{ class: "asc" }, { position: "asc" }],
    }),
    getCurrentProfile(),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Library</h1>
        <p className="text-muted-foreground">
          Manage the book catalogue shown on the public Library page, by class.
        </p>
      </div>

      <LibraryAdmin initialItems={items} canPublish={profile?.role === "ADMIN"} />
    </div>
  );
}
