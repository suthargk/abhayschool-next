export const FACULTY_CATEGORIES = [
  { value: "LEADERSHIP", label: "Leadership" },
  { value: "TEACHING", label: "Teaching" },
  { value: "SUPPORT", label: "Student Support" },
];

export function facultyCategoryLabel(value) {
  return FACULTY_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
