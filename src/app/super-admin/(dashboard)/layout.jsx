import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { SuperAdminShell } from "./super-admin-shell";

export default async function SuperAdminDashboardLayout({ children }) {
  const [profile, newAdmissionsCount] = await Promise.all([
    getCurrentProfile(),
    prisma.admissionEnquiry.count({ where: { status: "NEW" } }),
  ]);

  return (
    <SuperAdminShell profile={profile} newAdmissionsCount={newAdmissionsCount}>
      {children}
    </SuperAdminShell>
  );
}
