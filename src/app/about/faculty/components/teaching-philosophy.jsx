import { Compass, Heart, Sparkles, TrendingUp } from "lucide-react";

const PRINCIPLES = [
  {
    icon: Heart,
    title: "Student-Centered",
    description: "Every learner receives attention and support suited to how they learn best.",
  },
  {
    icon: Sparkles,
    title: "Curiosity-Driven",
    description: "Teachers encourage students to ask questions and explore ideas beyond the syllabus.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Learning",
    description: "Our faculty keep developing their own teaching practices year after year.",
  },
  {
    icon: Compass,
    title: "Mentorship",
    description: "Teachers help students grow academically and personally, not just for the exam.",
  },
];

export function TeachingPhilosophy() {
  return (
    <section className="space-y-10">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          More Than Teachers. Mentors.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map((principle) => (
          <div key={principle.title} className="space-y-3 rounded-xl border bg-card p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <principle.icon className="size-5" />
            </span>
            <h3 className="font-semibold">{principle.title}</h3>
            <p className="text-sm text-muted-foreground">{principle.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
