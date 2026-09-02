const STORAGE_PREFIX = "abhayschool:seen:";
const MAX_ENTRIES = 300;

function storageKey(scope) {
  return `${STORAGE_PREFIX}${scope}`;
}

/** Ids the current browser has already opened for a given content scope (homework, gallery, ...). */
export function getSeenIds(scope) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(scope));
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

/** Remembers that this browser has opened `id` within `scope`, capped so storage can't grow unbounded. */
export function markSeen(scope, id) {
  if (typeof window === "undefined" || !id) return;
  try {
    const ids = getSeenIds(scope);
    if (ids.includes(id)) return;
    const next = [...ids, id].slice(-MAX_ENTRIES);
    window.localStorage.setItem(storageKey(scope), JSON.stringify(next));
  } catch {
    // localStorage unavailable (private browsing, quota exceeded) - badge just won't persist
  }
}
