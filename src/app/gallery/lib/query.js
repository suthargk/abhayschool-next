export function buildGalleryHref({ q, year, month, category, page } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (year) params.set("year", String(year));
  if (month) params.set("month", String(month));
  if (category) params.set("category", category);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/gallery?${qs}` : "/gallery";
}
