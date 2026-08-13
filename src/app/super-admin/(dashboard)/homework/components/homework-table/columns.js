export const COLUMNS = [
  { key: "class", label: "Class", defaultVisible: true },
  { key: "subject", label: "Subject", defaultVisible: true },
  { key: "status", label: "Status", defaultVisible: true },
  { key: "due", label: "Due", defaultVisible: true },
  { key: "author", label: "Author", defaultVisible: true },
];

export function buildHref({ q, page }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/super-admin/homework?${qs}` : "/super-admin/homework";
}
