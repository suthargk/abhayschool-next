import { differenceInCalendarDays } from "date-fns";

const RECENT_DAYS = 7;

/** True when a publish date falls within the last RECENT_DAYS days (and isn't in the future). */
export function isRecentlyPublished(publishedAt, now = new Date()) {
  if (!publishedAt) return false;
  const days = differenceInCalendarDays(now, new Date(publishedAt));
  return days >= 0 && days <= RECENT_DAYS;
}
