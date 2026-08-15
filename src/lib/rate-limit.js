// Best-effort in-memory rate limiter, scoped to this server process. Good
// enough to blunt casual OTP-spam abuse; not a substitute for a real
// distributed limiter if this app is ever deployed across multiple instances.
const buckets = new Map();

export function rateLimit(key, { max, windowMs }) {
  const now = Date.now();
  const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= max) {
    buckets.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return true;
}
