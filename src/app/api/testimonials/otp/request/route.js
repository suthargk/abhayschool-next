import { NextResponse } from "next/server";

import { normalizePhone } from "@/lib/phone";
import { rateLimit } from "@/lib/rate-limit";
import { sendOtp } from "@/lib/msg91";

function clientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const phone = normalizePhone(body?.phone);
  if (!phone) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
  }

  if (!rateLimit(`otp-request:${phone}`, { max: 3, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json(
      { error: "Too many codes requested for this number. Try again in a few minutes." },
      { status: 429 },
    );
  }
  if (!rateLimit(`otp-request-ip:${clientIp(request)}`, { max: 10, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 },
    );
  }

  try {
    await sendOtp(phone);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Couldn't send the verification code. Check the number and try again." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
