import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trophy, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

function DetailSection({ title, children }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default async function FacultyProfilePage({ params }) {
  const { id } = await params;

  const item = await prisma.faculty.findUnique({ where: { id } });
  if (!item || item.status !== "PUBLISHED") notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-6">
      <Link
        href="/about/faculty"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Faculty
      </Link>

      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
        <span className="relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
          {item.photoUrl ? (
            <Image src={item.photoUrl} alt={item.name} fill className="object-cover" unoptimized />
          ) : (
            <UserRound className="size-10 text-muted-foreground" />
          )}
        </span>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{item.name}</h1>
          <p className="text-muted-foreground">{item.designation}</p>
          {item.department ? <Badge variant="outline">{item.department}</Badge> : null}
        </div>
      </div>

      <div className="space-y-8 rounded-2xl border bg-card p-6 sm:p-8">
        {item.bio ? (
          <DetailSection title="About">
            <p className="whitespace-pre-line text-muted-foreground">{item.bio}</p>
          </DetailSection>
        ) : null}

        {item.qualification ? (
          <DetailSection title="Education">
            <p className="text-muted-foreground">{item.qualification}</p>
          </DetailSection>
        ) : null}

        {item.experienceYears != null ? (
          <DetailSection title="Experience">
            <p className="text-muted-foreground">
              {item.experienceYears}+ year{item.experienceYears === 1 ? "" : "s"}
            </p>
          </DetailSection>
        ) : null}

        {item.subjects.length > 0 ? (
          <DetailSection title="Subjects">
            <div className="flex flex-wrap gap-1.5">
              {item.subjects.map((subject) => (
                <Badge key={subject} variant="secondary">
                  {subject}
                </Badge>
              ))}
            </div>
          </DetailSection>
        ) : null}

        {item.grades.length > 0 ? (
          <DetailSection title="Classes">
            <div className="flex flex-wrap gap-1.5">
              {item.grades.map((grade) => (
                <Badge key={grade} variant="secondary">
                  {grade}
                </Badge>
              ))}
            </div>
          </DetailSection>
        ) : null}

        {item.areasOfInterest.length > 0 ? (
          <DetailSection title="Areas of Interest">
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              {item.areasOfInterest.map((interest) => (
                <li key={interest}>{interest}</li>
              ))}
            </ul>
          </DetailSection>
        ) : null}

        {item.achievements.length > 0 ? (
          <DetailSection title="Achievements & Certifications">
            <ul className="space-y-1.5">
              {item.achievements.map((achievement) => (
                <li key={achievement} className="flex items-start gap-1.5 text-muted-foreground">
                  <Trophy className="mt-0.5 size-4 shrink-0 text-violet-600 dark:text-violet-400" />
                  {achievement}
                </li>
              ))}
            </ul>
          </DetailSection>
        ) : null}
      </div>
    </div>
  );
}
