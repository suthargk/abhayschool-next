const ALLOWED_PAGE_SIZES = [10, 20, 50, 100];

export function parsePageSize(value, defaultPageSize) {
  const parsed = Number(value);
  return ALLOWED_PAGE_SIZES.includes(parsed) ? parsed : defaultPageSize;
}
