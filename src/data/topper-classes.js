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

// value -> message key, for locale-aware display. Reuses the labels already
// translated under "achievements.featuredToppers" (classX/classXII/stream*).
export const TOPPER_CLASS_LABEL_KEYS = {
  CLASS_X: "classX",
  CLASS_XII: "classXII",
};

export const TOPPER_STREAM_LABEL_KEYS = {
  SCIENCE: "streamScience",
  COMMERCE: "streamCommerce",
  ARTS: "streamArts",
};
