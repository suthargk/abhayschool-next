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
