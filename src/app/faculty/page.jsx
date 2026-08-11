import Image from "next/image";
import { UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

import { FacultyFilters } from "./components/faculty-filters";

export const revalidate = 60;

export default async function FacultyPage({ searchParams }) {
  const params = await searchParams;
  const department = typeof params.department === "string" ? params.department : "";

  const [faculty, departmentRows] = await Promise.all([
    prisma.faculty.findMany({
      where: {
        status: "PUBLISHED",
        ...(department ? { department } : {}),
      },
      orderBy: { position: "asc" },
    }),
    prisma.faculty.findMany({
      where: { status: "PUBLISHED", department: { not: null } },
      select: { department: true },
      distinct: ["department"],
    }),
  ]);

  const departments = departmentRows
    .map((row) => row.department)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-16 sm:px-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">Faculty</h1>
        <p className="text-muted-foreground">
          Meet our highly qualified and dedicated faculty who inspire and guide our students.
        </p>
      </div>

      <FacultyFilters initialDepartment={department} departments={departments} />

      {faculty.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {department
              ? "No faculty members match this department."
              : "Faculty profiles will be published here soon."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.map((member) => (
            <div key={member.id} className="space-y-3 rounded-lg border p-5">
              <div className="flex items-center gap-4">
                <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <Image
                      src="/faculty-placeholder.svg"
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </span>
                <div>
                  <h2 className="text-lg font-semibold leading-snug">{member.name}</h2>
                  <p className="text-sm text-muted-foreground">{member.designation}</p>
                </div>
              </div>

              {member.department ? (
                <Badge variant="outline">{member.department}</Badge>
              ) : null}

              {member.qualification ? (
                <p className="text-xs text-muted-foreground">{member.qualification}</p>
              ) : null}

              {member.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {member.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              ) : null}

              {member.bio ? (
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              ) : null}

              {member.experienceYears != null ? (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <UserRound className="size-3" />
                  {member.experienceYears} year{member.experienceYears === 1 ? "" : "s"} of
                  experience
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
