import { SCHOOL_NAME, emailShell, logoAttachment } from "./shared";

/** Builds the subject/html/text/attachments for a teacher signup OTP email. */
export function buildTeacherOtpEmail({ code, firstName }) {
  const subject = "Your verification code";

  const bodyHtml = `
    <div style="text-align:center;padding:8px 24px 20px;">
      <span style="display:inline-block;font-size:32px;font-weight:700;letter-spacing:8px;color:#111827;background:#f4f4f7;padding:16px 24px;border-radius:10px;">
        ${code}
      </span>
      <p style="margin:16px 0 0;font-size:13px;color:#6b7280;">This code expires in 10 minutes.</p>
    </div>`;

  const html = emailShell({
    title: subject,
    heading: `Hi ${firstName || "there"},`,
    intro: "Enter this code to verify your email and finish setting up your teacher account.",
    bodyHtml,
    cta: null,
    footerNote: `If you didn't request this, you can safely ignore this email. — ${SCHOOL_NAME}`,
  });

  const text = [
    `Hi ${firstName || "there"},`,
    "",
    `Your verification code is: ${code}`,
    "This code expires in 10 minutes.",
    "",
    `— ${SCHOOL_NAME}`,
  ].join("\n");

  return { subject, html, text, attachments: [logoAttachment()] };
}
