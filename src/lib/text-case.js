// Converts "GAURAV Suthar" / "gaurav suthar" -> "Gaurav Suthar".
// Capitalizes the first letter of every letter-run and lowercases the rest,
// leaving spacing/punctuation untouched so it's safe to apply while typing.
export function toTitleCase(value) {
  if (!value) return value;
  return value.replace(/\p{L}+/gu, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
}
