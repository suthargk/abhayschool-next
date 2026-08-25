import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFromS3 } from "@/lib/s3";

const VALID_CLASSES = ["CLASS_X", "CLASS_XII"];
const VALID_STREAMS = ["SCIENCE", "COMMERCE", "ARTS"];

export async function GET(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("TOPPERS");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const item = await prisma.topper.findUnique({ where: { id } });
  if (!item || item.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("TOPPERS");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.topper.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = {};

  if (typeof body.name === "string") {
    if (!body.name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    data.name = body.name.trim();
  }

  const nextClass = body.class !== undefined ? body.class : existing.class;
  if (body.class !== undefined) {
    if (!VALID_CLASSES.includes(body.class)) {
      return NextResponse.json({ error: "Class must be Class X or Class XII" }, { status: 400 });
    }
    data.class = body.class;
  }

  if (body.stream !== undefined) {
    if (nextClass === "CLASS_X" && body.stream) {
      return NextResponse.json(
        { error: "Stream is only applicable to Class XII" },
        { status: 400 },
      );
    }
    if (body.stream && !VALID_STREAMS.includes(body.stream)) {
      return NextResponse.json({ error: "Invalid stream" }, { status: 400 });
    }
    data.stream = nextClass === "CLASS_XII" ? body.stream || null : null;
  } else if (body.class !== undefined && nextClass === "CLASS_X") {
    data.stream = null;
  }

  if (body.year !== undefined) {
    const year = Number(body.year);
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return NextResponse.json({ error: "A valid year is required" }, { status: 400 });
    }
    data.year = year;
  }

  if (body.percentage !== undefined) {
    const percentage = Number(body.percentage);
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      return NextResponse.json({ error: "A valid percentage is required" }, { status: 400 });
    }
    data.percentage = percentage;
  }

  if (body.rank !== undefined) {
    data.rank =
      body.rank !== "" && Number.isFinite(Number(body.rank))
        ? Math.max(1, Math.trunc(Number(body.rank)))
        : 1;
  }

  if (body.marksObtained !== undefined) {
    data.marksObtained =
      body.marksObtained !== "" && Number.isFinite(Number(body.marksObtained))
        ? Number(body.marksObtained)
        : null;
  }

  if (body.marksTotal !== undefined) {
    data.marksTotal =
      body.marksTotal !== "" && Number.isFinite(Number(body.marksTotal))
        ? Number(body.marksTotal)
        : null;
  }

  if (body.photoUrl !== undefined) {
    data.photoUrl = body.photoUrl || null;
  }

  const item = await prisma.topper.update({ where: { id }, data });

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("TOPPERS");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.topper.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.photoUrl) {
    await deleteFromS3([existing.photoUrl]);
  }

  await prisma.topper.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
