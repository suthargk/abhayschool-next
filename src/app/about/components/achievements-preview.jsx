import Link from "next/link";
import { Trophy, Target } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AchievementsPreview({ topperCount, highestPercentage }) {
  if (topperCount === 0) return null;

  return (
    <section className="flex flex-col items-center gap-8 text-center">
      <div className="max-w-2xl space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Proud of What Our Students Achieve
        </h2>
        <p className="text-muted-foreground">
          Celebrating the academic milestones our students reach every year.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-1">
          <Trophy className="size-5 text-violet-600 dark:text-violet-400" />
          <span className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {topperCount}+
          </span>
          <span className="text-sm text-muted-foreground">Toppers Featured</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Target className="size-5 text-violet-600 dark:text-violet-400" />
          <span className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {highestPercentage}%
          </span>
          <span className="text-sm text-muted-foreground">Highest Board Score</span>
        </div>
      </div>

      <Button asChild size="lg" variant="outline">
        <Link href="/achievements/toppers">View All Achievements →</Link>
      </Button>
    </section>
  );
}
