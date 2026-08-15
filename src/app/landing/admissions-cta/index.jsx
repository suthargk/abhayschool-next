import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GlitterBackground } from "@/components/backgrounds/glitter-background";

export function AdmissionsCta() {
  return (
    <section
      id="admissions"
      className="relative flex scroll-mt-24 flex-col items-center gap-6 overflow-hidden rounded-2xl border bg-card px-6 py-14 text-center"
    >
      <GlitterBackground preset="festive" sparkleCount={20} />
      <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
        Ready to Begin Your Child&apos;s Journey?
      </h2>
      <p className="max-w-xl text-muted-foreground">
        Discover a learning environment where your child can learn, grow and
        thrive.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/admissions">Apply for Admission</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/admissions">Book a Campus Visit</Link>
        </Button>
      </div>
    </section>
  );
}
