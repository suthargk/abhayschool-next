import { HeartHandshake, Lightbulb, ShieldCheck, Target } from "lucide-react";

const PRIORITIES = [
  {
    icon: Target,
    title: "Academic Excellence",
    description: "Strong foundations and a lifelong love of learning.",
  },
  {
    icon: HeartHandshake,
    title: "Character & Values",
    description: "Integrity, empathy, and responsibility in everything we do.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Technology, creativity, and problem-solving for tomorrow.",
  },
  {
    icon: ShieldCheck,
    title: "Wellbeing",
    description: "A safe, supportive environment where every student can thrive.",
  },
];

export function PrincipalVision() {
  return (
    <section className="mx-auto max-w-5xl space-y-10 rounded-2xl border bg-card p-8 sm:p-10">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          My Vision for Our Students
        </h2>
        <p className="italic text-muted-foreground">
          &ldquo;I envision a school where every student feels valued,
          challenged, and inspired to learn — where academic achievement goes
          hand in hand with character, creativity, and compassion.&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRIORITIES.map((priority) => (
          <div key={priority.title} className="space-y-3 rounded-xl border bg-background p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <priority.icon className="size-5" />
            </span>
            <h3 className="font-semibold">{priority.title}</h3>
            <p className="text-sm text-muted-foreground">
              {priority.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
