import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function FacultyCard({ item }) {
  return (
    <Link
      href={`/about/faculty/${item.id}`}
      className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3.4] w-full overflow-hidden bg-muted">
        {item.photoUrl ? (
          <Image
            src={item.photoUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound className="size-16 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <div>
          <h3 className="font-semibold leading-snug">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.designation}</p>
        </div>

        {item.department ? <Badge variant="outline">{item.department}</Badge> : null}

        {item.subjects.length > 0 ? (
          <p className="text-sm text-muted-foreground">{item.subjects.join(", ")}</p>
        ) : null}

        {item.experienceYears != null ? (
          <p className="text-xs text-muted-foreground">
            {item.experienceYears} year{item.experienceYears === 1 ? "" : "s"} of experience
          </p>
        ) : null}

        <span className="inline-block text-sm font-medium text-violet-600 dark:text-violet-400">
          View Profile →
        </span>
      </div>
    </Link>
  );
}
