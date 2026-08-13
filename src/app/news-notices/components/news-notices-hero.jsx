import Link from "next/link";
import { ChevronDown, Newspaper } from "lucide-react";

export function NewsNoticesHero() {
  return (
    <section className="flex flex-col items-center gap-6 px-4 pb-4 pt-28 text-center sm:pt-32">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
        <Newspaper className="size-4" />
        School Updates
      </span>
      <h1 className="text-3xl font-semibold sm:text-5xl">
        <span className="block">Stay Updated with</span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-b from-[#8371fa] to-[#c25ff9]">
          News &amp; Notices
        </span>
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Announcements, events, achievements, and important information from
        our school — all in one place.
      </p>
      <Link
        href="#news-notices-list"
        className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Browse updates
        <ChevronDown className="size-4" />
      </Link>
    </section>
  );
}
