import Image from "next/image";

export function FacilityHighlightList({ eyebrow, title, description, items }) {
  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {description ? <p className="text-muted-foreground">{description}</p> : null}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative flex aspect-square flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border bg-muted/30 p-4 text-center"
          >
            {item.imageUrl ? (
              <>
                <Image
                  src={item.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute inset-0 bg-black/40" />
                <span className="relative text-sm font-medium text-white">
                  {item.title}
                </span>
              </>
            ) : (
              <>
                <span className="text-3xl" aria-hidden="true">
                  {item.icon || "✨"}
                </span>
                <span className="text-sm font-medium">{item.title}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
