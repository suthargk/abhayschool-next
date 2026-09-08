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

export async function GET(request, { params }) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const item = await prisma.busRoute.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(request, { params }) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.busRoute.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = {};

  if (body.place !== undefined) {
    if (typeof body.place !== "string" || !body.place.trim()) {
      return NextResponse.json({ error: "Place is required" }, { status: 400 });
    }
    data.place = body.place.trim();
  }
  if (body.routeNo !== undefined) {
    const routeNo = parsePositiveInt(body.routeNo);
    if (routeNo === null) {
      return NextResponse.json({ error: "Route number must be a positive number" }, { status: 400 });
    }
    data.routeNo = routeNo;
  }
  if (body.rentPerYear !== undefined) {
    const rentPerYear = parsePositiveInt(body.rentPerYear);
    if (rentPerYear === null) {
      return NextResponse.json({ error: "Rent per year must be a positive number" }, { status: 400 });
    }
    data.rentPerYear = rentPerYear;
  }
  if (body.distanceKm !== undefined) {
    if (body.distanceKm !== null && body.distanceKm !== "" && parseDistanceKm(body.distanceKm) === null) {
      return NextResponse.json({ error: "Distance must be a non-negative number" }, { status: 400 });
    }
    data.distanceKm = parseDistanceKm(body.distanceKm);
  }
  if (body.position !== undefined && Number.isFinite(Number(body.position))) {
    data.position = Number(body.position);
  }

  const item = await prisma.busRoute.update({ where: { id }, data });

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.busRoute.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.busRoute.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
