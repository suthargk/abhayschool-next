/**
 * Base URL for tokenized links embedded in outbound emails (invite, reset).
 * Throws instead of silently producing "http://undefined/..." links when
 * NEXT_PUBLIC_SITE_URL isn't set in the environment.
 */
export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not configured");
  }
  return url;
}
