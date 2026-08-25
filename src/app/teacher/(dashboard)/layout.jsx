import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth";
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

  return <TeacherShell profile={profile}>{children}</TeacherShell>;
}
