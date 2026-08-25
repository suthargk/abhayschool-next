import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireTeacherFeature("PRINCIPAL_MESSAGE");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const item = await prisma.principalMessage.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ item });
}

/**
 * Upserts the singleton Principal's Message row (there is only ever one) —
 * any permitted teacher edits the same row in place, same as an admin/editor
 * already can, so there's no per-author ownership scoping here.
 */
export async function PATCH(request) {
  let profile;
  try {
    profile = await requireTeacherFeature("PRINCIPAL_MESSAGE");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || body.content == null) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const trimmedOrNull = (value) =>
    typeof value === "string" ? value.trim() || null : null;
  const intOrNull = (value) => {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : null;
  };

  const data = {
    principalName: trimmedOrNull(body.principalName),
    designation: trimmedOrNull(body.designation),
    quote: trimmedOrNull(body.quote),
    content: body.content,
    photoUrl: body.photoUrl || null,
    signatureUrl: body.signatureUrl || null,
    principalSince: intOrNull(body.principalSince),
    experienceYears: intOrNull(body.experienceYears),
    qualification: trimmedOrNull(body.qualification),
    interests: trimmedOrNull(body.interests),
    videoUrl: trimmedOrNull(body.videoUrl),
  };

  const existing = await prisma.principalMessage.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const item = existing
    ? await prisma.principalMessage.update({ where: { id: existing.id }, data })
    : await prisma.principalMessage.create({
        data: {
          ...data,
          authorId: profile.id,
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });

  return NextResponse.json({ item });
}
