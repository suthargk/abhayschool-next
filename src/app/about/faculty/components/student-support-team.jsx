import { FacultyCard } from "./faculty-card";

export function StudentSupportTeam({ support }) {
  if (support.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Supporting Every Student
        </h2>
        <p className="text-muted-foreground">
          Beyond the classroom, this team looks after our students&apos; wellbeing and personal
          growth.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {support.map((item) => (
          <FacultyCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
