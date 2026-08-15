import nodemailer from "nodemailer";

let transporter = null;

// Lazily created so build/dev doesn't fail before SMTP_* env vars are set.
function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS)");
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  });

  return transporter;
}

export async function sendMail({ to, subject, text, html, replyTo, attachments }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await getTransporter().sendMail({ from, to, subject, text, html, replyTo, attachments });
}
