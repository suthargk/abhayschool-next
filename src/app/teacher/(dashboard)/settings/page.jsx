import { getTranslations } from "next-intl/server";

import { getCurrentProfile } from "@/lib/auth";

import { TeacherSettingsForm } from "./components/teacher-settings-form";

export default async function TeacherSettingsPage() {
  const profile = await getCurrentProfile();
  const t = await getTranslations("teacherSettings");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-muted-foreground">{t("subheading")}</p>
      </div>
      <TeacherSettingsForm profile={profile} />
    </div>
  );
}
