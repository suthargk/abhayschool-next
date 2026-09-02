import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { VIEWABLE_TYPES } from "@/lib/views/constants";

const VISITOR_COOKIE = "visitor_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const itemType = body?.itemType;
  const itemId = typeof body?.itemId === "string" ? body.itemId : "";

  if (!Object.values(VIEWABLE_TYPES).includes(itemType) || !itemId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  let visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  const isNewVisitor = !visitorId;
  if (isNewVisitor) visitorId = randomUUID();

  if (!rateLimit(visitorId, { max: 60, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  await prisma.itemView.upsert({
    where: { itemType_itemId_visitorId: { itemType, itemId, visitorId } },
    update: {},
    create: { itemType, itemId, visitorId },
  });

  const response = NextResponse.json({ ok: true });
  if (isNewVisitor) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }
  return response;
}
