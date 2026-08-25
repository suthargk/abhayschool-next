import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

import { TeacherShell } from "./teacher-shell";

export default async function TeacherDashboardLayout({ children }) {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "TEACHER") {
    redirect("/teacher/login");
  }
  if (profile.status === "PENDING") {
    redirect("/teacher/pending");
  }
  if (profile.status === "REJECTED") {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/teacher/login");
  }

  const permissions = await prisma.teacherFeaturePermission.findMany({
    where: { teacherId: profile.id },
    select: { feature: true },
  });
  const features = permissions.map((p) => p.feature);

  return (
    <TeacherShell profile={profile} features={features}>
      {children}
    </TeacherShell>
  );
}
