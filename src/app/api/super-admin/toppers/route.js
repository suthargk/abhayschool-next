import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_CLASSES = ["CLASS_X", "CLASS_XII"];
const VALID_STREAMS = ["SCIENCE", "COMMERCE", "ARTS"];

function parseTopperInput(body) {
  if (!VALID_CLASSES.includes(body.class)) {
    return { error: "Class must be Class X or Class XII" };
  }

  let stream = null;
  if (body.class === "CLASS_XII" && body.stream) {
    if (!VALID_STREAMS.includes(body.stream)) {
      return { error: "Invalid stream" };
    }
    stream = body.stream;
  } else if (body.class === "CLASS_X" && body.stream) {
    return { error: "Stream is only applicable to Class XII" };
  }

  const year = Number(body.year);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return { error: "A valid year is required" };
  }

  const percentage = Number(body.percentage);
  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
    return { error: "A valid percentage is required" };
  }

  const rank =
    body.rank !== undefined && body.rank !== "" && Number.isFinite(Number(body.rank))
      ? Math.max(1, Math.trunc(Number(body.rank)))
      : 1;

  const marksObtained =
    body.marksObtained !== undefined &&
    body.marksObtained !== "" &&
    Number.isFinite(Number(body.marksObtained))
      ? Number(body.marksObtained)
      : null;
  const marksTotal =
    body.marksTotal !== undefined &&
    body.marksTotal !== "" &&
    Number.isFinite(Number(body.marksTotal))
      ? Number(body.marksTotal)
      : null;

  return {
    data: {
      class: body.class,
      stream,
      year,
      rank,
      percentage,
      marksObtained,
      marksTotal,
    },
  };
}

export async function GET() {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.topper.findMany({
    orderBy: [{ year: "desc" }, { class: "asc" }, { rank: "asc" }],
    include: { author: { select: { email: true } } },
  });

  return NextResponse.json({ items });
}

export async function POST(request) {
  let profile;
  try {
    profile = await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const parsed = parseTopperInput(body);
  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const item = await prisma.topper.create({
    data: {
      name: body.name.trim(),
      ...parsed.data,
      photoUrl: body.photoUrl || null,
      authorId: profile.id,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
