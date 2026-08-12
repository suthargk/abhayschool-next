import Link from "next/link";

export function YearArchive({ years }) {
  if (years.length === 0) return null;

  return (
    <section className="space-y-6 border-t pt-10">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Year Archive
      </h2>
      <div className="flex flex-wrap gap-3">
        {years.map(({ year, count }) => (
          <Link
            key={year}
            href={`/gallery?year=${year}`}
            className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-muted"
          >
            <span className="font-medium">{year}</span>
            <span className="text-muted-foreground">
              {" "}
              · {count} album{count === 1 ? "" : "s"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
