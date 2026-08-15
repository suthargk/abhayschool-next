/** Display label for a class value, given the current admin-managed classes list. */
export function classLabel(classes, value) {
  return classes.find((c) => c.value === value)?.label ?? value;
}

/** Resolves free-text input ("Class V", "class_v", "CLASS_V"...) to a known class value, or null. */
export function parseClassValue(classes, input) {
  const norm = String(input ?? "").trim().toLowerCase();
  if (!norm) return null;
  const match = classes.find(
    (c) => c.value.toLowerCase() === norm || c.label.toLowerCase() === norm,
  );
  return match?.value ?? null;
}
