import { CheckCircle2 } from "lucide-react";

const COMMITMENTS = [
  "Regular communication about your child's progress and school life",
  "Support for every student, academically and personally",
  "Clear tracking of attendance and punctuality",
  "Timely updates on academic performance",
  "Attentive care for behaviour and emotional wellbeing",
  "Opportunities to participate in school activities and events",
];

export function PrincipalParentPartnership() {
  return (
    <section className="mx-auto max-w-4xl space-y-8">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          A Partnership With Parents
        </h2>
        <p className="text-muted-foreground">
          A child&apos;s education is a shared responsibility — school,
          student, and family working together. Here&apos;s what you can
          expect from us, and how we hope to work with you.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 rounded-2xl border bg-card p-8 sm:grid-cols-2 sm:p-10">
        {COMMITMENTS.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-violet-600 dark:text-violet-400" />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
