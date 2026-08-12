import Image from "next/image";
import {
  Award,
  Crown,
  Medal,
  PartyPopper,
  Trophy,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { topperStreamLabel } from "@/data/topper-classes";

import { CelebrationBackground } from "./components/celebration-background";
import { YearFilter } from "./components/year-filter";

export const revalidate = 60;

const STREAM_ORDER = ["SCIENCE", "COMMERCE", "ARTS"];

const RANK_BADGES = {
  1: { Icon: Crown, className: "bg-amber-400 text-amber-950" },
  2: { Icon: Medal, className: "bg-slate-300 text-slate-900" },
  3: { Icon: Medal, className: "bg-orange-300 text-orange-950" },
};

function RankBadge({ rank }) {
  const badge = RANK_BADGES[rank];

  if (badge) {
    const { Icon, className } = badge;
    return (
      <span
        className={`absolute left-3 top-3 flex size-9 items-center justify-center rounded-full shadow ${className}`}
      >
        <Icon className="size-5" />
        <span className="sr-only">Rank {rank}</span>
      </span>
    );
  }

  return (
    <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1.5 text-sm font-bold shadow backdrop-blur">
      <Award className="size-3.5" />#{rank}
    </span>
  );
}

function TopperCard({ topper }) {
  const isChampion = topper.rank === 1;

  return (
    <div
      className={`group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md ${
        isChampion
          ? "ring-2 ring-amber-400 shadow-[0_0_24px_-6px_rgba(251,191,36,0.6)]"
          : ""
      }`}
    >
      <div className="relative aspect-[4/3.4] w-full overflow-hidden bg-muted">
        {topper.photoUrl ? (
          <Image
            src={topper.photoUrl}
            alt={topper.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound className="size-16 text-muted-foreground" />
          </div>
        )}

        <RankBadge rank={topper.rank} />

        <Badge
          variant="secondary"
          className="absolute right-3 top-3 gap-1 bg-background/90 shadow backdrop-blur"
        >
          <Trophy className="size-3" />
          {topper.percentage}%
        </Badge>
      </div>

      <div className="space-y-1 p-4">
        <h3 className="text-lg font-semibold leading-snug">{topper.name}</h3>
        {topper.marksObtained != null && topper.marksTotal != null ? (
          <p className="text-sm text-muted-foreground">
            {topper.marksObtained} / {topper.marksTotal} marks
          </p>
        ) : null}
      </div>
    </div>
  );
}

function TopperGrid({ toppers }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {toppers.map((topper) => (
        <TopperCard key={topper.id} topper={topper} />
      ))}
    </div>
  );
}

export default async function ToppersPage({ searchParams }) {
  const params = await searchParams;

  const years = (
    await prisma.topper.findMany({
      where: { status: "PUBLISHED" },
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    })
  ).map((row) => row.year);

  const requestedYear = Number(params.year);
  const year = years.includes(requestedYear) ? requestedYear : years[0];

  const toppers = year
    ? await prisma.topper.findMany({
        where: { status: "PUBLISHED", year },
        orderBy: [{ class: "asc" }, { rank: "asc" }],
      })
    : [];

  const classX = toppers.filter((t) => t.class === "CLASS_X");
  const classXII = toppers.filter((t) => t.class === "CLASS_XII");
  const classXIIByStream = STREAM_ORDER.map((stream) => ({
    stream,
    items: classXII.filter((t) => t.stream === stream),
  })).filter((group) => group.items.length > 0);
  const classXIIUnstreamed = classXII.filter((t) => !t.stream);

  return (
    <div className="relative overflow-hidden">
      <CelebrationBackground />

      <div className="relative mx-auto max-w-5xl space-y-10 px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
              <PartyPopper className="size-4" />
              Board Exam Results
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#8371fa] to-[#c25ff9]">
                Toppers
              </span>
            </h1>
            <p className="text-muted-foreground">
              Celebrating our board exam toppers, class by class.
            </p>
          </div>
          <YearFilter year={year} years={years} />
        </div>

        {toppers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Toppers will be published here soon.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {classX.length > 0 ? (
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Class X Toppers
                </h2>
                <TopperGrid toppers={classX} />
              </section>
            ) : null}

            {classXIIByStream.length > 0 || classXIIUnstreamed.length > 0 ? (
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Class XII Toppers
                </h2>
                {classXIIByStream.map((group) => (
                  <div key={group.stream} className="space-y-4">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      {topperStreamLabel(group.stream)}
                    </h3>
                    <TopperGrid toppers={group.items} />
                  </div>
                ))}
                {classXIIUnstreamed.length > 0 ? (
                  <TopperGrid toppers={classXIIUnstreamed} />
                ) : null}
              </section>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
