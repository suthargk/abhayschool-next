import { Brain, Flag, GraduationCap, Heart, Sparkles } from "lucide-react";

const PRINCIPLES = [
  {
    icon: GraduationCap,
    title: "Learn",
    description: "Build strong academic foundations that last a lifetime.",
  },
  {
    icon: Brain,
    title: "Think",
    description: "Develop curiosity and critical thinking in everything we do.",
  },
  {
    icon: Sparkles,
    title: "Create",
    description: "Encourage creativity, innovation, and the courage to try.",
  },
  {
    icon: Flag,
    title: "Lead",
    description: "Grow confidence, initiative, and responsibility.",
  },
  {
    icon: Heart,
    title: "Care",
    description: "Build empathy, respect, and compassion for others.",
  },
];

export function PrincipalPhilosophy() {
  return (
    <section className="mx-auto max-w-5xl space-y-10">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Our Educational Philosophy
        </h2>
        <p className="text-muted-foreground">
          Five simple principles guide how we teach, and how we hope every
          student grows.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {PRINCIPLES.map((principle) => (
          <div
            key={principle.title}
            className="space-y-3 rounded-xl border bg-card p-6 text-center sm:text-left"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <principle.icon className="size-5" />
            </span>
            <h3 className="font-semibold">{principle.title}</h3>
            <p className="text-sm text-muted-foreground">
              {principle.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
