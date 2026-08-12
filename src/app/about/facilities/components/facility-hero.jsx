import Link from "next/link";

import { Button } from "@/components/ui/button";

export function FacilityHero() {
  return (
    <section className="flex flex-col items-center gap-6 px-4 pb-4 pt-28 text-center sm:pt-32">
      <h1 className="text-3xl font-semibold sm:text-5xl">
        <span className="block">Facilities That Inspire</span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-b from-[#8371fa] to-[#c25ff9]">
          Learning & Growth
        </span>
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Explore the modern spaces, technology, sports facilities, and student
        amenities available across our campus.
      </p>
      <Button asChild size="lg">
        <Link href="/gallery">Explore Our Campus</Link>
      </Button>
    </section>
  );
}
