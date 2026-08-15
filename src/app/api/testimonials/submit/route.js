import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/phone";
import { rateLimit } from "@/lib/rate-limit";
import { checkOtp } from "@/lib/msg91";

const MAX_QUOTE_LENGTH = 1000;

function clientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const designation = typeof body.designation === "string" ? body.designation.trim() : "";
  const quote = typeof body.quote === "string" ? body.quote.trim() : "";
  const otp = typeof body.otp === "string" ? body.otp.trim() : "";
  const phone = normalizePhone(body.phone);

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!quote || quote.length > MAX_QUOTE_LENGTH) {
    return NextResponse.json(
      { error: `Please share your experience in ${MAX_QUOTE_LENGTH} characters or fewer` },
      { status: 400 },
    );
  }
  if (!phone) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
  }
  if (!otp) {
    return NextResponse.json({ error: "Enter the verification code" }, { status: 400 });
  }

  if (!rateLimit(`otp-check:${phone}`, { max: 8, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }
  if (!rateLimit(`otp-check-ip:${clientIp(request)}`, { max: 20, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let check;
  try {
    check = await checkOtp(phone, otp);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Couldn't verify that code" },
      { status: 400 },
    );
  }

  if (check.status !== "approved") {
    return NextResponse.json({ error: "That code is incorrect or has expired" }, { status: 400 });
  }

  const maxPosition = await prisma.testimonial.aggregate({ _max: { position: true } });

  const item = await prisma.testimonial.create({
    data: {
      name,
      designation: designation || null,
      quote,
      phone,
      source: "PARENT",
      status: "DRAFT",
      position: (maxPosition._max.position ?? -1) + 1,
    },
  });

  return NextResponse.json({ ok: true, id: item.id }, { status: 201 });
}
