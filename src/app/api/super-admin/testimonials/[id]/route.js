import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFromS3 } from "@/lib/s3";

export async function GET(request, { params }) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const item = await prisma.testimonial.findUnique({ where: { id } });
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
  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = {};

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    data.name = body.name.trim();
  }
  if (body.designation !== undefined) {
    data.designation = body.designation?.trim() || null;
  }
  if (body.quote !== undefined) {
    if (typeof body.quote !== "string" || !body.quote.trim()) {
      return NextResponse.json({ error: "Quote is required" }, { status: 400 });
    }
    data.quote = body.quote.trim();
  }
  if (body.photoUrl !== undefined) {
    data.photoUrl = body.photoUrl || null;
  }
  if (body.position !== undefined && Number.isFinite(Number(body.position))) {
    data.position = Number(body.position);
  }

  const item = await prisma.testimonial.update({ where: { id }, data });

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.photoUrl) {
    await deleteFromS3([existing.photoUrl]);
  }

  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
