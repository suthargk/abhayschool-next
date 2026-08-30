import Image from "next/image";
import { useTranslations } from "next-intl";

function hasProfileDetails(item) {
  return Boolean(
    item.principalSince ||
      item.experienceYears ||
      item.qualification ||
      item.interests,
  );
}

export function PrincipalProfile({ item }) {
  const t = useTranslations("principalMessage.principalProfile");

  if (!hasProfileDetails(item)) return null;

  const name = item.principalName || t("defaultName");

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 rounded-2xl border bg-card p-8 sm:grid-cols-[auto_1fr] sm:items-center sm:p-10">
        {item.photoUrl ? (
          <Image
            src={item.photoUrl}
            alt={name}
            width={200}
            height={200}
            className="mx-auto size-24 rounded-full border object-cover sm:size-28"
            unoptimized
          />
        ) : null}

        <div className="space-y-4 text-center sm:text-left">
          <div>
            <p className="text-lg font-semibold">{name}</p>
            {item.designation ? (
              <p className="text-sm text-muted-foreground">
                {item.designation}
              </p>
            ) : null}
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            {item.principalSince ? (
              <div>
                <dt className="text-muted-foreground">{t("principalSince")}</dt>
                <dd className="font-medium">{item.principalSince}</dd>
              </div>
            ) : null}
            {item.experienceYears ? (
              <div>
                <dt className="text-muted-foreground">{t("experience")}</dt>
                <dd className="font-medium">
                  {t("experienceYears", { years: item.experienceYears })}
                </dd>
              </div>
            ) : null}
            {item.qualification ? (
              <div className="col-span-2">
                <dt className="text-muted-foreground">{t("qualification")}</dt>
                <dd className="font-medium">{item.qualification}</dd>
              </div>
            ) : null}
            {item.interests ? (
              <div className="col-span-2 sm:col-span-4">
                <dt className="text-muted-foreground">{t("interests")}</dt>
                <dd className="font-medium">{item.interests}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </section>
  );
}
