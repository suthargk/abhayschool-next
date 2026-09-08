import { SCHOOL_NAME, emailShell, logoAttachment } from "./shared";

/**
 * Builds the subject/html/text/attachments for the "your account has been
 * approved" email sent to a teacher when an admin approves their account.
 */
export function buildTeacherApprovedEmail({ firstName, loginUrl }) {
  const subject = "Your teacher account has been approved";

  const bodyHtml = `
    <div style="padding:8px 24px 4px;">
      <p style="margin:0;font-size:14px;color:#374151;">
        An admin has approved your teacher account. You can now sign in to the teacher dashboard.
      </p>
    </div>`;

  const html = emailShell({
    title: subject,
    heading: `Hi ${firstName || "there"},`,
    intro: "Your teacher account is now active.",
    bodyHtml,
    cta: loginUrl ? { href: loginUrl, label: "Sign in" } : null,
    footerNote: `— ${SCHOOL_NAME}`,
  });

  const text = [
    `Hi ${firstName || "there"},`,
    "",
    "An admin has approved your teacher account. You can now sign in to the teacher dashboard.",
    ...(loginUrl ? [`Sign in: ${loginUrl}`] : []),
    "",
    `— ${SCHOOL_NAME}`,
  ].join("\n");

  return { subject, html, text, attachments: [logoAttachment()] };
}
