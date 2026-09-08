import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { hashInviteToken } from "@/lib/teacher-invite";

import { TeacherRegisterForm } from "./teacher-register-form";

export default async function TeacherRegisterPage({ params }) {
  const { token } = await params;
  const t = await getTranslations("teacherAuth.register");

  const [profile, classes, subjects] = await Promise.all([
    prisma.profile.findUnique({ where: { inviteTokenHash: hashInviteToken(token) } }),
    prisma.schoolClass.findMany({ orderBy: { position: "asc" } }),
    prisma.subject.findMany({ orderBy: { position: "asc" } }),
  ]);
  const valid =
    profile &&
    profile.status === "INVITED" &&
    profile.inviteTokenExpiresAt &&
    profile.inviteTokenExpiresAt > new Date();

  if (!valid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
        <div className="w-full max-w-md space-y-2 rounded-xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">{t("invalidHeading")}</h1>
          <p className="text-sm text-muted-foreground">{t("invalidMessage")}</p>
        </div>
      </div>
    );
  }

  return <TeacherRegisterForm email={profile.email} token={token} classes={classes} subjects={subjects} />;
}
