import { SCHOOL_NAME, emailShell, logoAttachment } from "./shared";

/** Builds the subject/html/text/attachments for a teacher password-reset
 * email, sent when a teacher requests "Forgot password?" on the login page. */
export function buildTeacherPasswordResetEmail({ resetUrl, firstName }) {
  const subject = "Reset your teacher account password";

  const bodyHtml = `
    <div style="padding:8px 24px 4px;">
      <p style="margin:0;font-size:14px;color:#374151;">
        Click the button below to choose a new password for your teacher account.
      </p>
      <p style="margin:16px 0 0;font-size:13px;color:#6b7280;">This link expires in 1 hour and can only be used once.</p>
    </div>`;

  const html = emailShell({
    title: subject,
    heading: `Hi ${firstName || "there"},`,
    intro: "We received a request to reset the password for your teacher account.",
    bodyHtml,
    cta: { href: resetUrl, label: "Reset password" },
    footerNote: `If you didn't request this, you can safely ignore this email — your password won't change. — ${SCHOOL_NAME}`,
  });

  const text = [
    `Hi ${firstName || "there"},`,
    "",
    "We received a request to reset the password for your teacher account.",
    `Reset your password: ${resetUrl}`,
    "This link expires in 1 hour and can only be used once.",
    "",
    "If you didn't request this, you can safely ignore this email — your password won't change.",
    "",
    `— ${SCHOOL_NAME}`,
  ].join("\n");

  return { subject, html, text, attachments: [logoAttachment()] };
}
