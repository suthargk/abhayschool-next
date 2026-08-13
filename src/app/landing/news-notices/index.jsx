import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getHomepageNewsNotices } from "@/lib/news-notices/cached-queries";

import { NewsCard } from "./news-card";

const NewsNotices = async () => {
  const items = await getHomepageNewsNotices();

  const [featured, ...rest] = items;

  return (
    <section className="relative flex flex-col items-center">
      <div className="pointer-events-none absolute -left-16 top-4 size-40 rounded-full bg-pink-200/60 blur-2xl dark:bg-pink-500/10" />
      <div className="pointer-events-none absolute -right-16 top-24 size-48 rounded-full bg-red-200/50 blur-2xl dark:bg-red-500/10" />

      <div className="flex flex-col items-center gap-2">
        <h4 className="text-3xl font-semibold mb-2 text-center">
          <span aria-hidden className="mr-2">🎈</span>
          <span>School Updates and Announcements</span>
          <span aria-hidden className="ml-2">🎈</span>
        </h4>
        <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-pink-400 to-red-400" />
        <div className="text-zinc-700 text-center dark:text-zinc-500">
          Stay Informed with the Latest News and Important Notices
        </div>
      </div>

      <div className="relative w-full max-w-5xl mt-10">
        <div className="flex items-center justify-between mb-5">
          <div className="uppercase text-sm font-medium tracking-wide text-pink-600 dark:text-pink-400">
            Latest updates
          </div>
          <Link
            href="/news-notices"
            className="group flex items-center gap-1 text-sm font-medium text-red-500 dark:text-red-400"
          >
            View all
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 p-16 text-center text-sm text-zinc-500 dark:border-zinc-700">
            No news or notices yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <NewsCard item={featured} featured />
            <div className="grid grid-cols-1 gap-5">
              {rest.slice(0, 5).map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsNotices;
