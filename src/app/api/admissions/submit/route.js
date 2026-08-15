import { NextResponse, after } from "next/server";

import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/phone";
import { rateLimit } from "@/lib/rate-limit";
import { sendMail } from "@/lib/mailer";
import { buildAdmissionEnquiryEmail } from "@/lib/email-templates/admission-enquiry";
import { buildAdmissionConfirmationEmail } from "@/lib/email-templates/admission-confirmation";

const MAX_MESSAGE_LENGTH = 1000;

function clientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function str(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const studentName = str(body.studentName);
  const classAppliedFor = str(body.classAppliedFor);
  const parentName = str(body.parentName);
  const phone = normalizePhone(body.phone);
  const email = str(body.email);
  const gender = str(body.gender);
  const address = str(body.address);
  const previousSchool = str(body.previousSchool);
  const message = str(body.message);
  const dateOfBirth = str(body.dateOfBirth);

  if (!studentName) {
    return NextResponse.json({ error: "Student's name is required" }, { status: 400 });
  }
  if (!classAppliedFor) {
    return NextResponse.json({ error: "Please select the class applying for" }, { status: 400 });
  }
  if (!parentName) {
    return NextResponse.json({ error: "Parent/guardian name is required" }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer` },
      { status: 400 },
    );
  }

  let parsedDob = null;
  if (dateOfBirth) {
    const parsed = new Date(dateOfBirth);
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "Enter a valid date of birth" }, { status: 400 });
    }
    parsedDob = parsed;
  }

  if (!rateLimit(`admission-submit:${phone}`, { max: 5, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
  }
  if (!rateLimit(`admission-submit-ip:${clientIp(request)}`, { max: 15, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
  }

  const item = await prisma.admissionEnquiry.create({
    data: {
      studentName,
      classAppliedFor,
      parentName,
      phone,
      email: email || null,
      gender: gender || null,
      address: address || null,
      previousSchool: previousSchool || null,
      message: message || null,
      dateOfBirth: parsedDob,
      status: "NEW",
    },
  });

  const notifyTo = process.env.ADMISSIONS_NOTIFY_EMAIL || "admin@shriabhaynoblesschool.com";
  const adminUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/super-admin/admissions/${item.id}`
    : undefined;

  // The enquiry is already saved (and visible in the admin panel), so don't
  // make the visitor's browser wait on an SMTP round trip that can take
  // several seconds — schedule it to run after the response is sent.
  after(() => {
    const { subject, html, text, attachments } = buildAdmissionEnquiryEmail({ item, adminUrl });
    return sendMail({
      to: notifyTo,
      subject,
      html,
      text,
      attachments,
      replyTo: email || undefined,
    }).catch((error) => {
      console.error("Failed to send admission enquiry email:", error);
    });
  });

  // Confirmation to the parent/guardian — only if they gave an email, since
  // it's an optional field on the form.
  if (email) {
    after(() => {
      const { subject, html, text, attachments } = buildAdmissionConfirmationEmail({ item });
      return sendMail({
        to: email,
        subject,
        html,
        text,
        attachments,
        replyTo: notifyTo,
      }).catch((error) => {
        console.error("Failed to send admission confirmation email:", error);
      });
    });
  }

  return NextResponse.json({ ok: true, id: item.id }, { status: 201 });
}
