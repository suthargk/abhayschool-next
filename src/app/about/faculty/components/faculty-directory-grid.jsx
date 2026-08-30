import { useTranslations } from "next-intl";

import { FacultyCard } from "./faculty-card";
import { FacultyFilters } from "./faculty-filters";

export function FacultyDirectoryGrid({ faculty, filters, hasAnyTeachingFaculty }) {
  const t = useTranslations("faculty.facultyDirectoryGrid");

  return (
    <section id="directory" className="scroll-mt-24 space-y-8">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("heading")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <FacultyFilters {...filters} />

      {faculty.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {hasAnyTeachingFaculty ? t("noResults") : t("comingSoon")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.map((item) => (
            <FacultyCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
