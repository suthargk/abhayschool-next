import { getTranslations } from "next-intl/server";

export default async function SuperAdminRoutePlanPage() {
  const t = await getTranslations("superAdminRoutePlan");

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("heading")}
      </h1>
      <p className="text-muted-foreground">
        {t("description")}
      </p>
    </div>
  );
}
