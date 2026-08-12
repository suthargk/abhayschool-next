import { ShieldCheck, Lightbulb, HeartHandshake, Star, Heart, HandHeart } from "lucide-react";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    description: "Doing the right thing, even when no one is watching.",
  },
  {
    icon: Lightbulb,
    title: "Curiosity",
    description: "Learning beyond the classroom, always asking why.",
  },
  {
    icon: HeartHandshake,
    title: "Respect",
    description: "Valuing every individual and their perspective.",
  },
  {
    icon: Star,
    title: "Excellence",
    description: "Always striving to improve and do our best work.",
  },
  {
    icon: Heart,
    title: "Compassion",
    description: "Supporting and caring for one another.",
  },
  {
    icon: HandHeart,
    title: "Responsibility",
    description: "Taking ownership of our actions and choices.",
  },
];

export function CoreValues() {
  return (
    <section className="space-y-10">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Our Core Values
        </h2>
        <p className="text-muted-foreground">
          The principles that guide how we teach, learn, and grow together.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VALUES.map((value) => (
          <div key={value.title} className="space-y-3 rounded-xl border bg-card p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <value.icon className="size-5" />
            </span>
            <h3 className="font-semibold">{value.title}</h3>
            <p className="text-sm text-muted-foreground">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
