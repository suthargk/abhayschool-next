/** School academic year runs April – March, formatted as "2026-27". */
export function academicYearFor(date) {
  const d = date instanceof Date ? date : new Date(date ?? Date.now());
  const year = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${year}-${String((year + 1) % 100).padStart(2, "0")}`;
}

export function currentAcademicYear() {
  return academicYearFor(new Date());
}

/** Most recent `count` academic years, most recent first, e.g. for archive browsing. */
export function recentAcademicYears(count = 6) {
  const current = currentAcademicYear();
  const startYear = Number(current.split("-")[0]);
  return Array.from({ length: count }, (_, i) => {
    const year = startYear - i;
    return `${year}-${String((year + 1) % 100).padStart(2, "0")}`;
  });
}
