export function FacilitiesOverview({ items }) {
  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Everything Your Child Needs, All on One Campus
        </h2>
        <p className="text-muted-foreground">
          A quick look at the spaces and amenities that support learning and
          student life every day.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="space-y-2 rounded-xl border p-5 transition hover:border-violet-300 hover:shadow-sm"
          >
            <span className="text-3xl" aria-hidden="true">
              {item.icon || "✨"}
            </span>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            {item.summary ? (
              <p className="text-sm text-muted-foreground">{item.summary}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
