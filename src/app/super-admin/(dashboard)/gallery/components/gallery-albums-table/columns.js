export const COLUMNS = [
  { key: "eventDate", label: "Event date", defaultVisible: true },
  { key: "status", label: "Status", defaultVisible: true },
  { key: "photos", label: "Photos", defaultVisible: true },
  { key: "author", label: "Author", defaultVisible: true },
];

export function buildHref({ q, page }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/super-admin/gallery?${qs}` : "/super-admin/gallery";
}
