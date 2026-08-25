import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth";
import { PendingSignOutButton } from "./pending-sign-out-button";

export default async function TeacherPendingPage() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "TEACHER") {
    redirect("/teacher/login");
  }
  if (profile.status === "ACTIVE") {
    redirect("/teacher");
  }

  const rejected = profile.status === "REJECTED";

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">
          {rejected ? "Account access revoked" : "Awaiting approval"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {rejected
            ? "This teacher account no longer has access. Contact the school office if you think this is a mistake."
            : "Thanks for signing up! An admin needs to approve your account before you can log in and post homework. Check back soon."}
        </p>
        <PendingSignOutButton />
      </div>
    </div>
  );
}
