import { prisma } from "@/lib/prisma";

import { LibraryCatalog } from "./components/library-catalog";

export const revalidate = 60;

export default async function LibraryPage() {
  const books = await prisma.libraryBook.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ class: "asc" }, { position: "asc" }],
  });

  return (
    <div className="min-h-screen px-4 pb-16 pt-[100px] md:px-10 md:pt-[102px] lg:px-20">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Library
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search the catalogue or filter by class. Columns list book name,
            subject, and publication.
          </p>
        </div>

        <LibraryCatalog books={books} />
      </div>
    </div>
  );
}
