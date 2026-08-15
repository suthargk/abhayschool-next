import { SCHOOL_NAME, detailRow, emailShell, logoAttachment } from "./shared";

/**
 * Builds the subject/html/text/attachments for the confirmation email sent
 * back to the parent/guardian who submitted an admission enquiry.
 */
export function buildAdmissionConfirmationEmail({ item }) {
  const submittedAt = new Date(item.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const firstName = item.parentName.trim().split(/\s+/)[0];
  const subject = `We've received your admission enquiry for ${item.studentName}`;

  const detailRows = [
    detailRow("Student name", item.studentName),
    detailRow("Class applying for", item.classAppliedFor),
    detailRow("Parent/guardian", item.parentName),
    detailRow("Phone", item.phone),
    detailRow("Email", item.email),
    detailRow("Submitted", submittedAt),
  ].join("");

  const html = emailShell({
    title: subject,
    heading: `Thank you, ${firstName}!`,
    intro: `We've received your admission enquiry for ${item.studentName} (${item.classAppliedFor}). Our admissions team will review it and get in touch with you shortly.`,
    bodyHtml: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows}</table>`,
    cta: null,
    footerNote: `This is an automated confirmation from the ${SCHOOL_NAME} admissions form. If you didn't submit this enquiry, you can safely ignore this email.`,
  });

  const text = [
    `Thank you, ${firstName}!`,
    "",
    `We've received your admission enquiry for ${item.studentName} (${item.classAppliedFor}).`,
    "Our admissions team will review it and get in touch with you shortly.",
    "",
    `Student name: ${item.studentName}`,
    `Class applying for: ${item.classAppliedFor}`,
    `Parent/guardian name: ${item.parentName}`,
    `Phone: ${item.phone}`,
    `Email: ${item.email || "-"}`,
    `Submitted: ${submittedAt}`,
    "",
    `— ${SCHOOL_NAME}`,
  ].join("\n");

  return { subject, html, text, attachments: [logoAttachment()] };
}
