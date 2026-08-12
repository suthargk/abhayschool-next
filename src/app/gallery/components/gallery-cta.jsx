import Link from "next/link";

import { Button } from "@/components/ui/button";

export function GalleryCta() {
  return (
    <section className="flex flex-col items-center gap-6 rounded-2xl border bg-card px-6 py-14 text-center">
      <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
        Come See It For Yourself
      </h2>
      <p className="max-w-xl text-muted-foreground">
        Pictures only tell part of the story. Visit our campus and experience
        our facilities and school life in person.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/about/facilities">Explore Campus</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="about/faculty">Meet Our Faculty</Link>
        </Button>
      </div>
    </section>
  );
}
