import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { hashResetToken } from "@/lib/password-reset";

import { TeacherResetPasswordForm } from "./teacher-reset-password-form";

export default async function TeacherResetPasswordPage({ params }) {
  const { token } = await params;
  const t = await getTranslations("teacherAuth.resetPassword");

  const profile = await prisma.profile.findUnique({ where: { resetTokenHash: hashResetToken(token) } });
  const valid =
    profile &&
    profile.role === "TEACHER" &&
    profile.resetTokenExpiresAt &&
    profile.resetTokenExpiresAt > new Date();

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

  return <TeacherResetPasswordForm token={token} />;
}
