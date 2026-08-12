import { CalendarDays, GraduationCap, Users, BookOpen } from "lucide-react";

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border bg-card p-5 text-center">
      <Icon className="size-5 text-violet-600 dark:text-violet-400" />
      <span className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export function WhoWeAre({ facultyCount }) {
  const stats = [
    { icon: CalendarDays, label: "Established", value: 1998 },
    { icon: Users, label: "Students", value: "700+" },
    {
      icon: GraduationCap,
      label: "Faculty",
      value: facultyCount > 0 ? `${facultyCount}+` : "—",
    },
    { icon: BookOpen, label: "Classes", value: "Nursery–XII" },
  ];

  return (
    <section className="space-y-10">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          A Place to Learn, Grow & Belong
        </h2>
        <p className="text-muted-foreground">
          Shri Abhay Nobles Senior Secondary School is committed to providing
          a supportive and engaging learning environment where students
          develop academically, socially, and personally. Affiliated with the
          Rajasthan Board of Secondary Education (RBSE), we welcome students
          from Nursery through Class XII.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <StatTile key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
