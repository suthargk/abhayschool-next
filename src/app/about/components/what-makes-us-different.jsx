import { Users, Sparkles, BookMarked, Trophy, ShieldCheck, HandHeart } from "lucide-react";

const DIFFERENTIATORS = [
  {
    icon: Users,
    title: "Experienced & Caring Faculty",
    description: "Dedicated educators who know and support every student.",
  },
  {
    icon: Sparkles,
    title: "Student-Centered Learning",
    description: "Teaching that adapts to how each student learns best.",
  },
  {
    icon: BookMarked,
    title: "Strong Academic Foundation",
    description: "An RBSE curriculum from Nursery through Class XII.",
  },
  {
    icon: Trophy,
    title: "Sports & Extracurriculars",
    description: "Space to compete, create, and grow beyond the classroom.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Inclusive Environment",
    description: "A campus where every student feels welcome and secure.",
  },
  {
    icon: HandHeart,
    title: "Individual Student Support",
    description: "Attention and guidance tailored to each child's needs.",
  },
];

export function WhatMakesUsDifferent() {
  return (
    <section className="space-y-10">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What Makes Us Different
        </h2>
        <p className="text-muted-foreground">
          Why families choose Shri Abhay Nobles Senior Secondary School.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DIFFERENTIATORS.map((item) => (
          <div key={item.title} className="space-y-3 rounded-xl border bg-card p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <item.icon className="size-5" />
            </span>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
