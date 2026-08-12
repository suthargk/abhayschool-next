import Image from "next/image";
import Link from "next/link";
import { Trophy, UserRound } from "lucide-react";

function AchievementCard({ item }) {
  return (
    <Link
      href={`/about/faculty/${item.id}`}
      className="flex items-start gap-4 rounded-xl border bg-card p-5 transition hover:shadow-sm"
    >
      <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
        {item.photoUrl ? (
          <Image src={item.photoUrl} alt="" fill className="object-cover" unoptimized />
        ) : (
          <UserRound className="size-6 text-muted-foreground" />
        )}
      </span>

      <div className="space-y-1.5">
        <div>
          <p className="font-semibold leading-snug">{item.name}</p>
          <p className="text-sm text-muted-foreground">{item.designation}</p>
        </div>
        <ul className="space-y-1">
          {item.achievements.map((achievement) => (
            <li key={achievement} className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <Trophy className="mt-0.5 size-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

export function ExcellenceInTeaching({ faculty }) {
  const withAchievements = faculty.filter((item) => item.achievements.length > 0);
  if (withAchievements.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Excellence in Teaching
        </h2>
        <p className="text-muted-foreground">
          Recognition our faculty have earned for their work in and beyond the classroom.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {withAchievements.map((item) => (
          <AchievementCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
