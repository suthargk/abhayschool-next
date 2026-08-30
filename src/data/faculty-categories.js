export const FACULTY_CATEGORIES = [
  { value: "LEADERSHIP", label: "Leadership" },
  { value: "TEACHING", label: "Teaching" },
  { value: "SUPPORT", label: "Student Support" },
];

export function facultyCategoryLabel(value) {
  return FACULTY_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

// value -> message key. No public consumer for this list (admin/teacher only),
// so each consumer keeps its own small translated "categories" object.
export const FACULTY_CATEGORY_LABEL_KEYS = {
  LEADERSHIP: "leadership",
  TEACHING: "teaching",
  SUPPORT: "support",
};
