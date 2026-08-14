import { getCurrentProfile } from "@/lib/auth";

import { SuperAdminShell } from "./super-admin-shell";

export default async function SuperAdminDashboardLayout({ children }) {
  const profile = await getCurrentProfile();

  return <SuperAdminShell profile={profile}>{children}</SuperAdminShell>;
}
