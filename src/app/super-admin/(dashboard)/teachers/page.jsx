import { prisma } from "@/lib/prisma";

import { TeachersTable } from "./components/teachers-table";

export default async function SuperAdminTeachersPage() {
  const [teachers, classes] = await Promise.all([
    prisma.profile.findMany({
      where: { role: "TEACHER" },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        teacherAssignments: { orderBy: [{ class: "asc" }, { subject: "asc" }] },
        teacherFeaturePermissions: true,
      },
    }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Teachers</h1>
        <p className="text-muted-foreground">
          Approve teacher signups and assign the classes/subjects each teacher can post
          homework for.
        </p>
      </div>
      <TeachersTable initialTeachers={teachers} classes={classes} />
    </div>
  );
}
