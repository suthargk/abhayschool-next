import { NextResponse } from "next/server";

import { WEEKDAY_VALUES } from "@/data/weekdays";
import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("TIME_TABLE");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const item = await prisma.timeTableSlot.findUnique({ where: { id } });
  if (!item || item.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("TIME_TABLE");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.timeTableSlot.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = {};

  if (body.class !== undefined) {
    if (!(await prisma.schoolClass.findUnique({ where: { value: body.class } }))) {
      return NextResponse.json({ error: "A valid class is required" }, { status: 400 });
    }
    data.class = body.class;
  }
  if (body.day !== undefined) {
    if (!WEEKDAY_VALUES.includes(body.day)) {
      return NextResponse.json({ error: "A valid day is required" }, { status: 400 });
    }
    data.day = body.day;
  }
  if (body.period !== undefined) {
    const period = Number(body.period);
    if (!Number.isInteger(period) || period < 1) {
      return NextResponse.json({ error: "A valid period number is required" }, { status: 400 });
    }
    data.period = period;
  }
  if (body.subject !== undefined) {
    if (typeof body.subject !== "string" || !body.subject.trim()) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }
    data.subject = body.subject.trim();
  }
  if (body.teacherName !== undefined) {
    data.teacherName = body.teacherName?.trim() || null;
  }
  if (body.startTime !== undefined) {
    data.startTime = body.startTime?.trim() || null;
  }
  if (body.endTime !== undefined) {
    data.endTime = body.endTime?.trim() || null;
  }

  try {
    const item = await prisma.timeTableSlot.update({ where: { id }, data });
    return NextResponse.json({ item });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "That slot is already taken" }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("TIME_TABLE");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.timeTableSlot.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.timeTableSlot.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
