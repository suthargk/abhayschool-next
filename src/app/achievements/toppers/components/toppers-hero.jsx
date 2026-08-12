import { PartyPopper } from "lucide-react";

import { YearFilter } from "./year-filter";

export function ToppersHero({ year, years }) {
  return (
    <section className="flex flex-col items-center gap-6 px-4 pb-4 pt-28 text-center sm:pt-32">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
        <PartyPopper className="size-4" />
        Board Exam Results
      </span>
      <h1 className="text-3xl font-semibold sm:text-5xl">
        <span className="block">Celebrating</span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-b from-[#8371fa] to-[#c25ff9]">
          Excellence
        </span>
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Meet the students who have demonstrated exceptional academic
        performance and made our school proud.
      </p>
      {years.length > 0 ? (
        <div className="flex items-center gap-2 pt-2">
          <span className="text-sm text-muted-foreground">
            Academic Year
          </span>
          <YearFilter year={year} years={years} />
        </div>
      ) : null}
    </section>
  );
}
