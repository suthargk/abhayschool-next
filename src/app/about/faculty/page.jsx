import { prisma } from "@/lib/prisma";

import { FacultyHero } from "./components/faculty-hero";
import { FacultyStats } from "./components/faculty-stats";
import { FacultyLeadership } from "./components/faculty-leadership";
import { FacultyDepartments } from "./components/faculty-departments";
import { FacultyDirectoryGrid } from "./components/faculty-directory-grid";
import { TeachingPhilosophy } from "./components/teaching-philosophy";
import { ExcellenceInTeaching } from "./components/excellence-in-teaching";
import { StudentSupportTeam } from "./components/student-support-team";
import { FacultyCta } from "./components/faculty-cta";

export const revalidate = 60;

export default async function FacultyPage({ searchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().toLowerCase() : "";
  const department = typeof params.department === "string" ? params.department : "";
  const grade = typeof params.grade === "string" ? params.grade : "";
  const subject = typeof params.subject === "string" ? params.subject : "";

  const [principal, faculty] = await Promise.all([
    prisma.principalMessage.findFirst({ where: { status: "PUBLISHED" } }),
    prisma.faculty.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { position: "asc" },
    }),
  ]);

  const leadership = faculty.filter((f) => f.category === "LEADERSHIP");
  const teaching = faculty.filter((f) => f.category === "TEACHING");
  const support = faculty.filter((f) => f.category === "SUPPORT");

  const departmentCounts = new Map();
  for (const item of teaching) {
    if (!item.department) continue;
    departmentCounts.set(item.department, (departmentCounts.get(item.department) ?? 0) + 1);
  }
  const departments = [...departmentCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const grades = [...new Set(teaching.flatMap((f) => f.grades))].sort();
  const subjects = [...new Set(teaching.flatMap((f) => f.subjects))].sort();

  const filteredTeaching = teaching.filter((item) => {
    if (department && item.department !== department) return false;
    if (grade && !item.grades.includes(grade)) return false;
    if (subject && !item.subjects.includes(subject)) return false;
    if (q) {
      const haystack = [item.name, item.department, ...item.subjects].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen">
      <FacultyHero />

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        <FacultyStats faculty={faculty} />

        <FacultyLeadership principal={principal} leadership={leadership} />

        <FacultyDepartments departments={departments} />

        <FacultyDirectoryGrid
          faculty={filteredTeaching}
          hasAnyTeachingFaculty={teaching.length > 0}
          filters={{
            initialQuery: params.q,
            initialDepartment: department,
            initialGrade: grade,
            initialSubject: subject,
            departments: departments.map((d) => d.name),
            grades,
            subjects,
          }}
        />

        <TeachingPhilosophy />

        <ExcellenceInTeaching faculty={faculty} />

        <StudentSupportTeam support={support} />

        <FacultyCta />
      </div>
    </div>
  );
}
