export function buildHref({ q, page }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs
    ? `/super-admin/achievements/toppers?${qs}`
    : "/super-admin/achievements/toppers";
}
