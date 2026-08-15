import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { SuperAdminShell } from "./super-admin-shell";

export default async function SuperAdminDashboardLayout({ children }) {
  const [profile, newAdmissionsCount, pendingAdmissions, pendingTestimonials] =
    await Promise.all([
      getCurrentProfile(),
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
    ]);

  return (
    <SuperAdminShell
      profile={profile}
      newAdmissionsCount={newAdmissionsCount}
      pendingAdmissions={pendingAdmissions}
      pendingTestimonials={pendingTestimonials}
    >
      {children}
    </SuperAdminShell>
  );
}
