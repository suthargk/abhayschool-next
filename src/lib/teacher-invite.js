import crypto from "crypto";

export const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function generateInviteToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashInviteToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Placeholder Auth-user password for an invited teacher — random, never
 * shown to anyone, and overwritten once they complete registration. */
export function generateTempPassword() {
  return crypto.randomBytes(24).toString("base64");
}
