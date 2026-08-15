import { SCHOOL_NAME, detailRow, emailShell, logoAttachment } from "./shared";

/**
 * Builds the subject/html/text/attachments for the "new admission enquiry"
 * notification email sent to the school office.
 */
export function buildAdmissionEnquiryEmail({ item, adminUrl }) {
  const dob = item.dateOfBirth
    ? new Date(item.dateOfBirth).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const submittedAt = new Date(item.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = `New admission enquiry: ${item.studentName} (${item.classAppliedFor})`;

  const detailRows = [
    detailRow("Student name", item.studentName),
    detailRow("Date of birth", dob),
    detailRow("Gender", item.gender),
    detailRow("Class applying for", item.classAppliedFor),
    detailRow("Parent/guardian", item.parentName),
    detailRow("Phone", item.phone),
    detailRow("Email", item.email),
    detailRow("Address", item.address),
    detailRow("Previous school", item.previousSchool),
    detailRow("Message", item.message),
    detailRow("Submitted", submittedAt),
  ].join("");

  const html = emailShell({
    title: subject,
    heading: "New admission enquiry",
    intro: "A parent submitted an admission enquiry through the school website.",
    bodyHtml: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows}</table>`,
    cta: adminUrl ? { href: adminUrl, label: "View in admin panel" } : null,
    footerNote: `This is an automated notification from the ${SCHOOL_NAME} website admissions form.`,
  });

  const text = [
    "New admission enquiry submitted on the website.",
    "",
    `Student name: ${item.studentName}`,
    `Date of birth: ${dob || "-"}`,
    `Gender: ${item.gender || "-"}`,
    `Class applying for: ${item.classAppliedFor}`,
    `Parent/guardian name: ${item.parentName}`,
    `Phone: ${item.phone}`,
    `Email: ${item.email || "-"}`,
    `Address: ${item.address || "-"}`,
    `Previous school: ${item.previousSchool || "-"}`,
    `Message: ${item.message || "-"}`,
    `Submitted: ${submittedAt}`,
    ...(adminUrl ? ["", `View in admin panel: ${adminUrl}`] : []),
  ].join("\n");

  return { subject, html, text, attachments: [logoAttachment()] };
}
