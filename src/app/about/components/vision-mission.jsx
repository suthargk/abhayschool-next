import { Eye, Target } from "lucide-react";

const MISSION_POINTS = [
  "Provide a strong academic foundation rooted in curiosity and critical thinking",
  "Nurture creativity, collaboration, and character alongside academics",
  "Create a safe, respectful, and inclusive environment for every student",
  "Prepare students to adapt and thrive in a changing world",
];

export function VisionMission() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-4 rounded-2xl border bg-card p-8">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
          <Eye className="size-5" />
        </span>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Our Vision
        </h2>
        <p className="text-muted-foreground">
          To inspire every student to become a confident, responsible, and
          lifelong learner who contributes meaningfully to the world around
          them.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border bg-card p-8">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
          <Target className="size-5" />
        </span>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Our Mission
        </h2>
        <ul className="space-y-2">
          {MISSION_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-violet-500" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
