export const LIBRARY_CLASSES = [
  { value: "CLASS_I", label: "Class I" },
  { value: "CLASS_II", label: "Class II" },
  { value: "CLASS_III", label: "Class III" },
  { value: "CLASS_IV", label: "Class IV" },
  { value: "CLASS_V", label: "Class V" },
  { value: "CLASS_VI", label: "Class VI" },
  { value: "CLASS_VII", label: "Class VII" },
  { value: "CLASS_VIII", label: "Class VIII" },
  { value: "CLASS_IX", label: "Class IX" },
  { value: "CLASS_X", label: "Class X" },
  { value: "CLASS_XI", label: "Class XI" },
  { value: "CLASS_XII", label: "Class XII" },
];

export const LIBRARY_CLASS_VALUES = LIBRARY_CLASSES.map((c) => c.value);

export function libraryClassLabel(value) {
  return LIBRARY_CLASSES.find((c) => c.value === value)?.label ?? value;
}
