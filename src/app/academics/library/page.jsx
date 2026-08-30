import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";

import { LibraryCatalog } from "./components/library-catalog";

export const revalidate = 60;

export default async function LibraryPage() {
  const t = await getTranslations("academics.library");
  const [books, classes] = await Promise.all([
    prisma.libraryBook.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ class: "asc" }, { position: "asc" }],
    }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
  ]);

  const subjectCount = new Set(books.map((book) => book.subject)).size;
  const classesInUse = classes.filter((klass) =>
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
              {t("heading")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>
              <span className="font-medium text-foreground">
                {books.length}
              </span>{" "}
              {t("bookWord", { count: books.length })}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <span className="font-medium text-foreground">
                {subjectCount}
              </span>{" "}
              {t("subjectWord", { count: subjectCount })}
            </span>
            {classRange ? (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {t("classesLabel")}{" "}
                  <span className="font-medium text-foreground">
                    {classRange}
                  </span>
                </span>
              </>
            ) : null}
          </div>
        </div>

        <LibraryCatalog books={books} classes={classes} />
      </div>
    </div>
  );
}
