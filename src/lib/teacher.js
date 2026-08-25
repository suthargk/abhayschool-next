export const TEACHER_EMAIL_DOMAIN = "shriabhaynoblesschool.com";

/** Teacher signup is restricted to the school's own email domain. */
export function isSchoolEmail(email) {
  if (typeof email !== "string") return false;
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith(`@${TEACHER_EMAIL_DOMAIN}`) && normalized.length > `@${TEACHER_EMAIL_DOMAIN}`.length;
}

/** Two-letter fallback shown in a teacher's avatar when they have no photo. */
export function getInitials(firstName, lastName) {
  const first = firstName?.trim()?.[0] ?? "";
  const last = lastName?.trim()?.[0] ?? "";
  const initials = `${first}${last}`.toUpperCase();
  return initials || "T";
}

export function teacherFullName(profile) {
  return [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim();
}
