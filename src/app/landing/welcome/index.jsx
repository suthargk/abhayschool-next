import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { GlitterBackground } from "@/components/backgrounds/glitter-background";

export function Welcome() {
  return (
    <section className="relative grid grid-cols-1 items-center gap-8 sm:grid-cols-2 py-6">
      <GlitterBackground sparkleCount={10} />
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border">
        <Image
          src="/images/campus_highlight_1.jpg"
          alt="Shri Abhay Nobles campus"
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-4 text-center sm:text-left">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Where Learning Meets Possibility
        </h2>
        <p className="text-muted-foreground">
          At Shri Abhay Nobles Senior Secondary School, we believe education
          goes beyond textbooks. Our students are encouraged to explore,
          question, create, and grow in an environment built around academic
          excellence and personal development.
        </p>
        <Button asChild variant="link" className="h-auto p-0">
          <Link href="/about">Discover Our Story →</Link>
        </Button>
      </div>
    </section>
  );
}
