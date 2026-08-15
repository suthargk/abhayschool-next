import { prisma } from "@/lib/prisma";

import { LIBRARY_CLASSES } from "@/data/library-classes";

import { LibraryCatalog } from "./components/library-catalog";

export const revalidate = 60;

export default async function LibraryPage() {
  const books = await prisma.libraryBook.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ class: "asc" }, { position: "asc" }],
  });

  const subjectCount = new Set(books.map((book) => book.subject)).size;
  const classesInUse = LIBRARY_CLASSES.filter((klass) =>
    books.some((book) => book.class === klass.value)
  );
  const classRange =
    classesInUse.length > 1
      ? `${classesInUse[0].label} – ${classesInUse[classesInUse.length - 1].label}`
      : (classesInUse[0]?.label ?? null);

  return (
    <div className="min-h-screen px-4 pb-16 pt-[100px] md:px-10 md:pt-[102px] lg:px-20">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              School Library
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore our collection of academic and reference books,
              organized by class, subject, and publication.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>
              <span className="font-medium text-foreground">
                {books.length}
              </span>{" "}
              {books.length === 1 ? "book" : "books"}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <span className="font-medium text-foreground">
                {subjectCount}
              </span>{" "}
              {subjectCount === 1 ? "subject" : "subjects"}
            </span>
            {classRange ? (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Classes{" "}
                  <span className="font-medium text-foreground">
                    {classRange}
                  </span>
                </span>
              </>
            ) : null}
          </div>
        </div>

        <LibraryCatalog books={books} />
      </div>
    </div>
  );
}
