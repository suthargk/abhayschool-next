export const TOPPER_CLASSES = [
  { value: "CLASS_X", label: "Class X" },
  { value: "CLASS_XII", label: "Class XII" },
];

export function topperClassLabel(value) {
  return TOPPER_CLASSES.find((c) => c.value === value)?.label ?? value;
}

export const TOPPER_STREAMS = [
  { value: "SCIENCE", label: "Science" },
  { value: "COMMERCE", label: "Commerce" },
  { value: "ARTS", label: "Arts" },
];

export function topperStreamLabel(value) {
  return TOPPER_STREAMS.find((s) => s.value === value)?.label ?? value;
}
