import Image from "next/image";
import { Award, Crown, Medal, Trophy, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

const RANK_BADGES = {
  1: { Icon: Crown, className: "bg-amber-400 text-amber-950" },
  2: { Icon: Medal, className: "bg-slate-300 text-slate-900" },
  3: { Icon: Medal, className: "bg-orange-300 text-orange-950" },
};

function RankBadge({ rank, t }) {
  const badge = RANK_BADGES[rank];

  if (badge) {
    const { Icon, className } = badge;
    return (
      <span
        className={`absolute left-3 top-3 flex size-9 items-center justify-center rounded-full shadow ${className}`}
      >
        <Icon className="size-5" />
        <span className="sr-only">{t("rankSr", { rank })}</span>
      </span>
    );
  }

  return (
    <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1.5 text-sm font-bold shadow backdrop-blur">
      <Award className="size-3.5" />#{rank}
    </span>
  );
}

function TopperCard({ topper, t }) {
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

        <RankBadge rank={topper.rank} t={t} />

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
            {topper.marksObtained} / {topper.marksTotal} {t("marksLabel")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function TopperGrid({ toppers }) {
  const t = useTranslations("achievements.topperGrid");

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {toppers.map((topper) => (
        <TopperCard key={topper.id} topper={topper} t={t} />
      ))}
    </div>
  );
}
