export const PASSWORD_MIN_LENGTH = 8;

// Shared between the register form (live checklist as the user types) and
// the API route (final server-side check) so the two can't drift apart.
export const PASSWORD_RULES = [
  { key: "minLength", test: (password) => password.length >= PASSWORD_MIN_LENGTH },
  { key: "uppercase", test: (password) => /[A-Z]/.test(password) },
  { key: "number", test: (password) => /[0-9]/.test(password) },
  { key: "specialChar", test: (password) => /[^A-Za-z0-9]/.test(password) },
];

export function isStrongPassword(password) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}
