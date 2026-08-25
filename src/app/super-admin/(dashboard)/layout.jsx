import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRecentTeacherActivity } from "@/lib/teacher-activity";

import { SuperAdminShell } from "./super-admin-shell";

export default async function SuperAdminDashboardLayout({ children }) {
  const profile = await getCurrentProfile();

  // A teacher (or any other non-admin authenticated user) shares the same
  // Supabase session cookie as the super-admin portal, so middleware alone
  // (which only checks "is there a session") isn't enough to keep them out
  // here — every /super-admin/* page trusts this layout for the role gate.
  // Redirect to their own portal rather than /super-admin/login: that path
  // bounces a logged-in user straight back to /super-admin, which would
  // loop forever for a role that will never pass this check.
  if (profile?.role === "TEACHER") {
    redirect("/teacher");
  }
  if (!profile || !["ADMIN", "EDITOR"].includes(profile.role)) {
    redirect("/");
  }

  const [
    newAdmissionsCount,
    pendingAdmissions,
    pendingTestimonials,
    pendingTeachersCount,
    teacherActivity,
  ] = await Promise.all([
    prisma.admissionEnquiry.count({ where: { status: "NEW" } }),
    prisma.admissionEnquiry.findMany({
      where: { status: "NEW" },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, studentName: true, parentName: true, classAppliedFor: true, createdAt: true },
    }),
    prisma.testimonial.findMany({
      where: { source: "PARENT", status: "DRAFT" },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, quote: true, createdAt: true },
    }),
    prisma.profile.count({ where: { role: "TEACHER", status: "PENDING" } }),
    getRecentTeacherActivity(8),
  ]);

  return (
    <SuperAdminShell
      profile={profile}
      newAdmissionsCount={newAdmissionsCount}
      pendingAdmissions={pendingAdmissions}
      pendingTestimonials={pendingTestimonials}
      pendingTeachersCount={pendingTeachersCount}
      teacherActivity={teacherActivity}
    >
      {children}
    </SuperAdminShell>
  );
}
