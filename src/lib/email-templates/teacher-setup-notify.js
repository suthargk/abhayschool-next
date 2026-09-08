import { SCHOOL_NAME, detailRow, emailShell, logoAttachment } from "./shared";

/**
 * Builds the subject/html/text/attachments for the "teacher finished setup"
 * notification email sent to the school office when an invited teacher sets
 * their password and completes their account setup.
 */
export function buildTeacherSetupNotifyEmail({ profile, adminUrl }) {
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "A teacher";
  const subject = `Teacher account setup complete: ${fullName}`;

  const detailRows = [
    detailRow("Name", fullName),
    detailRow("Email", profile.email),
    detailRow("Phone", profile.phone),
  ].join("");

  const html = emailShell({
    title: subject,
    heading: "Teacher setup complete",
    intro: `${fullName} has finished setting up their account and is awaiting approval.`,
    bodyHtml: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows}</table>`,
    cta: adminUrl ? { href: adminUrl, label: "Review in admin panel" } : null,
    footerNote: `This is an automated notification from the ${SCHOOL_NAME} teacher dashboard.`,
  });

  const text = [
    `${fullName} has finished setting up their teacher account and is awaiting approval.`,
    "",
    `Name: ${fullName}`,
    `Email: ${profile.email || "-"}`,
    `Phone: ${profile.phone || "-"}`,
    ...(adminUrl ? ["", `Review in admin panel: ${adminUrl}`] : []),
  ].join("\n");

  return { subject, html, text, attachments: [logoAttachment()] };
}
