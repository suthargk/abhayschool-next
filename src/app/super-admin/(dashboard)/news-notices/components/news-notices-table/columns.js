export const COLUMNS = [
  { key: "type", label: "Type", defaultVisible: true },
  { key: "status", label: "Status", defaultVisible: true },
  { key: "author", label: "Author", defaultVisible: true },
  { key: "created", label: "Created", defaultVisible: true },
];

export function buildHref({ q, page }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs
    ? `/super-admin/news-notices?${qs}`
    : "/super-admin/news-notices";
}
