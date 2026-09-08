// Accepts a bare 10-digit Indian mobile number or an already-E.164 number
// and returns a normalized E.164 string, or null if it doesn't look valid.
export function normalizePhone(raw) {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().replace(/[\s-]/g, "");

  if (/^\+[1-9]\d{7,14}$/.test(trimmed)) return trimmed;
  if (/^[6-9]\d{9}$/.test(trimmed)) return `+91${trimmed}`;

  return null;
}

// Drops the +91 country code for display, since every stored number is a
// domestic Indian mobile — leaves anything else (other country codes, bare
// numbers) untouched.
export function displayPhone(phone) {
  if (typeof phone !== "string") return phone;
  return phone.startsWith("+91") ? phone.slice(3) : phone;
}
