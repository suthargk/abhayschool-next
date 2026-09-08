import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function parsePositiveInt(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function parseDistanceKm(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export async function GET() {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.busRoute.findMany({
    orderBy: [{ position: "asc" }],
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
  if (!body || typeof body.place !== "string" || !body.place.trim()) {
    return NextResponse.json({ error: "Place is required" }, { status: 400 });
  }
  const routeNo = parsePositiveInt(body.routeNo);
  if (routeNo === null) {
    return NextResponse.json({ error: "Route number must be a positive number" }, { status: 400 });
  }
  const rentPerYear = parsePositiveInt(body.rentPerYear);
  if (rentPerYear === null) {
    return NextResponse.json({ error: "Rent per year must be a positive number" }, { status: 400 });
  }
  if (body.distanceKm !== undefined && body.distanceKm !== null && body.distanceKm !== "" && parseDistanceKm(body.distanceKm) === null) {
    return NextResponse.json({ error: "Distance must be a non-negative number" }, { status: 400 });
  }

  const maxPosition = await prisma.busRoute.aggregate({ _max: { position: true } });

  const item = await prisma.busRoute.create({
    data: {
      place: body.place.trim(),
      routeNo,
      rentPerYear,
      distanceKm: parseDistanceKm(body.distanceKm),
      position: (maxPosition._max.position ?? -1) + 1,
      authorId: profile.id,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
