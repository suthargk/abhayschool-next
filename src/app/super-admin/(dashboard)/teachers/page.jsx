import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";

import { TeachersTable } from "./components/teachers-table";

export default async function SuperAdminTeachersPage() {
  const t = await getTranslations("superAdminDashboard.teachers.page");
  const [teachers, classes, subjects] = await Promise.all([
    prisma.profile.findMany({
      where: { role: "TEACHER" },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        phone: true,
        photoUrl: true,
        inviteTokenExpiresAt: true,
        createdAt: true,
        teacherAssignments: { orderBy: [{ class: "asc" }, { subject: "asc" }] },
        teacherFeaturePermissions: true,
      },
    }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
    prisma.subject.findMany({ orderBy: { position: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <TeachersTable initialTeachers={teachers} classes={classes} subjects={subjects} />
    </div>
  );
}
