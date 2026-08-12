import Image from "next/image";
import { Camera, ChevronDown } from "lucide-react";

export function GalleryHero() {
  return (
    <section className="flex flex-col items-center gap-6 px-4 pb-4 pt-28 text-center sm:pt-32">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
        <Camera className="size-4" />
        Gallery
      </span>
      <h1 className="text-3xl font-semibold sm:text-5xl">
        <span className="block">Our School</span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-b from-[#8371fa] to-[#c25ff9]">
          In Pictures
        </span>
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Explore moments from our campus, classrooms, celebrations,
        activities, and student life.
      </p>

      <div className="relative mt-4 aspect-[21/9] w-full max-w-4xl overflow-hidden rounded-2xl border shadow-lg">
        <Image
          src="/images/campus_highlight_1.jpg"
          alt="Our school campus"
          fill
          className="object-cover"
          priority
        />
      </div>

      <a
        href="#gallery-albums"
        className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Explore Gallery
        <ChevronDown className="size-4" />
      </a>
    </section>
  );
}
