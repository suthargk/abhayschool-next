import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AboutCta() {
  return (
    <section className="flex flex-col items-center gap-6 rounded-2xl border bg-card px-6 py-14 text-center">
      <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
        Come See What Makes Us Different
      </h2>
      <p className="max-w-xl text-muted-foreground">
        Get to know our campus, our people, and our approach to education.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/about/facilities">Explore Facilities</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/about/faculty">Meet Our Faculty</Link>
        </Button>
      </div>
    </section>
  );
}
