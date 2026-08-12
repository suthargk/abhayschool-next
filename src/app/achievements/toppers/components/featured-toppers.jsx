import Image from "next/image";
import { Crown, Medal, UserRound } from "lucide-react";

import { topperClassLabel, topperStreamLabel } from "@/data/topper-classes";

const PODIUM_STYLE = {
  0: {
    Icon: Crown,
    badgeClassName: "bg-amber-400 text-amber-950",
    cardClassName:
      "sm:order-2 ring-2 ring-amber-400 shadow-[0_0_32px_-8px_rgba(251,191,36,0.7)] sm:-translate-y-4",
    label: "School Topper",
  },
  1: {
    Icon: Medal,
    badgeClassName: "bg-slate-300 text-slate-900",
    cardClassName: "sm:order-1",
    label: "Runner Up",
  },
  2: {
    Icon: Medal,
    badgeClassName: "bg-orange-300 text-orange-950",
    cardClassName: "sm:order-3",
    label: "Second Runner Up",
  },
};

function FeaturedCard({ topper, index }) {
  const { Icon, badgeClassName, cardClassName, label } = PODIUM_STYLE[index];

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md ${cardClassName}`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {topper.photoUrl ? (
          <Image
            src={topper.photoUrl}
            alt={topper.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound className="size-16 text-muted-foreground" />
          </div>
        )}
        <span
          className={`absolute left-1/2 top-3 flex size-10 -translate-x-1/2 items-center justify-center rounded-full shadow ${badgeClassName}`}
        >
          <Icon className="size-5" />
        </span>
      </div>

      <div className="space-y-1 p-5 text-center">
        <span className="text-xs font-medium uppercase tracking-wide text-violet-600 dark:text-violet-400">
          {label}
        </span>
        <h3 className="text-lg font-semibold leading-snug">{topper.name}</h3>
        <p className="text-sm text-muted-foreground">
          {topperClassLabel(topper.class)}
          {topper.stream ? ` — ${topperStreamLabel(topper.stream)}` : ""}
        </p>
        <p className="text-2xl font-semibold tracking-tight">
          {topper.percentage}%
        </p>
      </div>
    </div>
  );
}

export function FeaturedToppers({ toppers }) {
  if (toppers.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Featured Toppers
        </h2>
        <p className="text-muted-foreground">
          This year&apos;s highest-scoring students across the school.
        </p>
      </div>

      <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-3">
        {toppers.map((topper, index) => (
          <FeaturedCard key={topper.id} topper={topper} index={index} />
        ))}
      </div>
    </section>
  );
}
