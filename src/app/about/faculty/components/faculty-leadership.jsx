import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { UserRound } from "lucide-react";

import { FacultyCard } from "./faculty-card";

function PrincipalCard({ principal, t }) {
  const name = principal.principalName || t("defaultPrincipalName");

  return (
    <Link
      href="/about/principal-message"
      className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3.4] w-full overflow-hidden bg-muted">
        {principal.photoUrl ? (
          <Image
            src={principal.photoUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound className="size-16 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <div>
          <h3 className="font-semibold leading-snug">{name}</h3>
          <p className="text-sm text-muted-foreground">
            {principal.designation || t("defaultDesignation")}
          </p>
        </div>
        <span className="inline-block text-sm font-medium text-violet-600 dark:text-violet-400">
          {t("viewProfile")}
        </span>
      </div>
    </Link>
  );
}

export function FacultyLeadership({ principal, leadership }) {
  const t = useTranslations("faculty.facultyLeadership");

  if (!principal && leadership.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("heading")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {principal ? <PrincipalCard principal={principal} t={t} /> : null}
        {leadership.map((item) => (
          <FacultyCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
