import { SCHOOL_NAME, emailShell, logoAttachment } from "./shared";

/** Builds the subject/html/text/attachments for a teacher account invite
 * email, sent when an admin adds a teacher from the super-admin dashboard. */
export function buildTeacherInviteEmail({ registerUrl, firstName }) {
  const subject = "You're invited to set up your teacher account";

  const bodyHtml = `
    <div style="padding:8px 24px 4px;">
      <p style="margin:0;font-size:14px;color:#374151;">
        Click the button below to set your mobile number and password and finish setting up your account.
      </p>
      <p style="margin:16px 0 0;font-size:13px;color:#6b7280;">This link expires in 7 days.</p>
    </div>`;

  const html = emailShell({
    title: subject,
    heading: `Hi ${firstName || "there"},`,
    intro: "An admin has invited you to join the teacher dashboard.",
    bodyHtml,
    cta: { href: registerUrl, label: "Set up your account" },
    footerNote: `If you weren't expecting this, you can safely ignore this email. — ${SCHOOL_NAME}`,
  });

  const text = [
    `Hi ${firstName || "there"},`,
    "",
    "An admin has invited you to join the teacher dashboard.",
    `Set up your account: ${registerUrl}`,
    "This link expires in 7 days.",
    "",
    `— ${SCHOOL_NAME}`,
  ].join("\n");

  return { subject, html, text, attachments: [logoAttachment()] };
}
