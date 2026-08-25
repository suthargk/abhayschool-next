import { NextResponse } from "next/server";

import { WEEKDAY_VALUES } from "@/data/weekdays";
import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let profile;
  try {
    profile = await requireTeacherFeature("TIME_TABLE");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.timeTableSlot.findMany({
    where: { authorId: profile.id },
    orderBy: [{ class: "asc" }, { day: "asc" }, { period: "asc" }],
  });

  return NextResponse.json({ items });
}

export async function POST(request) {
  let profile;
  try {
    profile = await requireTeacherFeature("TIME_TABLE");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !(await prisma.schoolClass.findUnique({ where: { value: body.class } }))) {
    return NextResponse.json({ error: "A valid class is required" }, { status: 400 });
  }
  if (!WEEKDAY_VALUES.includes(body.day)) {
    return NextResponse.json({ error: "A valid day is required" }, { status: 400 });
  }
  const period = Number(body.period);
  if (!Number.isInteger(period) || period < 1) {
    return NextResponse.json({ error: "A valid period number is required" }, { status: 400 });
  }
  if (typeof body.subject !== "string" || !body.subject.trim()) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  }

  try {
    const item = await prisma.timeTableSlot.create({
      data: {
        class: body.class,
        day: body.day,
        period,
        subject: body.subject.trim(),
        teacherName: body.teacherName?.trim() || null,
        startTime: body.startTime?.trim() || null,
        endTime: body.endTime?.trim() || null,
        authorId: profile.id,
        // Teachers publish directly — no separate admin review step, unlike
        // EDITOR-authored time table slots in the super-admin dashboard.
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "That slot is already taken" }, { status: 409 });
    }
    throw error;
  }
}
