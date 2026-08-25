import crypto from "crypto";

export const OTP_TTL_MS = 10 * 60 * 1000;
export const MAX_OTP_ATTEMPTS = 5;

const PENDING_SECRET_ALGORITHM = "aes-256-gcm";

export function generateOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashOtp(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

/** Derives an AES key from the Supabase service-role key (server-only, never
 * exposed to the browser) rather than requiring a dedicated secret just to
 * hold a teacher's chosen password for the few minutes between signup and
 * OTP verification — see TeacherSignupOtp.passwordEnc. */
function pendingSecretKey() {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to hold a pending teacher signup");
  }
  return crypto.createHash("sha256").update(`teacher-signup-otp:${secret}`).digest();
}

/** Encrypts a plaintext value (the signup password) for temporary storage in
 * TeacherSignupOtp until the OTP is verified. */
export function encryptPendingSecret(plaintext) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(PENDING_SECRET_ALGORITHM, pendingSecretKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString("base64");
}

export function decryptPendingSecret(payload) {
  const buf = Buffer.from(payload, "base64");
  const iv = buf.subarray(0, 12);
  const authTag = buf.subarray(12, 28);
  const ciphertext = buf.subarray(28);
  const decipher = crypto.createDecipheriv(PENDING_SECRET_ALGORITHM, pendingSecretKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}
