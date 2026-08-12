import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AchievementsCta() {
  return (
    <section className="flex flex-col items-center gap-6 rounded-2xl border bg-card px-6 py-14 text-center">
      <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
        Every Achievement Begins With an Opportunity
      </h2>
      <p className="max-w-xl text-muted-foreground">
        Discover how our learning environment helps students achieve their
        potential.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/academics">Explore Academics</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/gallery">Visit Our Campus</Link>
        </Button>
      </div>
    </section>
  );
}
