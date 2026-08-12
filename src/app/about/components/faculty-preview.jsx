import Link from "next/link";
import { GraduationCap, Award } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FacultyPreview({ facultyCount, avgExperience }) {
  if (facultyCount === 0) return null;

  return (
    <section className="flex flex-col items-center gap-8 rounded-2xl border bg-card p-8 text-center sm:p-10">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Faculty & Staff
      </h2>
      <p className="max-w-xl text-muted-foreground">
        The people behind the school — experienced, dedicated, and invested
        in every student&apos;s growth.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-1">
          <GraduationCap className="size-5 text-violet-600 dark:text-violet-400" />
          <span className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {facultyCount}+
          </span>
          <span className="text-sm text-muted-foreground">Faculty Members</span>
        </div>
        {avgExperience ? (
          <div className="flex flex-col items-center gap-1">
            <Award className="size-5 text-violet-600 dark:text-violet-400" />
            <span className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {avgExperience}+
            </span>
            <span className="text-sm text-muted-foreground">
              Years Average Experience
            </span>
          </div>
        ) : null}
      </div>

      <Button asChild size="lg" variant="outline">
        <Link href="/about/faculty">Meet Our Faculty →</Link>
      </Button>
    </section>
  );
}
