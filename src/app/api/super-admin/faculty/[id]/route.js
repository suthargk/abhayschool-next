import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFromS3 } from "@/lib/s3";
import { FACULTY_CATEGORIES } from "@/data/faculty-categories";

const FACULTY_CATEGORY_VALUES = FACULTY_CATEGORIES.map((c) => c.value);

function sanitizeStringArray(values) {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
}

export async function GET(request, { params }) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const item = await prisma.faculty.findUnique({ where: { id } });
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
  const existing = await prisma.faculty.findUnique({ where: { id } });
  if (!existing) {
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
  if (typeof body.designation === "string") {
    if (!body.designation.trim()) {
      return NextResponse.json({ error: "Designation is required" }, { status: 400 });
    }
    data.designation = body.designation.trim();
  }
  if (body.department !== undefined) {
    data.department = typeof body.department === "string" ? body.department.trim() || null : null;
  }
  if (body.category !== undefined) {
    data.category = FACULTY_CATEGORY_VALUES.includes(body.category) ? body.category : "TEACHING";
  }
  if (body.subjects !== undefined) {
    data.subjects = sanitizeStringArray(body.subjects);
  }
  if (body.grades !== undefined) {
    data.grades = sanitizeStringArray(body.grades);
  }
  if (body.areasOfInterest !== undefined) {
    data.areasOfInterest = sanitizeStringArray(body.areasOfInterest);
  }
  if (body.achievements !== undefined) {
    data.achievements = sanitizeStringArray(body.achievements);
  }
  if (body.qualification !== undefined) {
    data.qualification =
      typeof body.qualification === "string" ? body.qualification.trim() || null : null;
  }
  if (body.bio !== undefined) {
    data.bio = typeof body.bio === "string" ? body.bio.trim() || null : null;
  }
  if (body.experienceYears !== undefined) {
    data.experienceYears =
      body.experienceYears !== "" && Number.isFinite(Number(body.experienceYears))
        ? Number(body.experienceYears)
        : null;
  }
  if (body.email !== undefined) {
    data.email = typeof body.email === "string" ? body.email.trim() || null : null;
  }
  if (body.photoUrl !== undefined) {
    data.photoUrl = body.photoUrl || null;
  }
  if (body.position !== undefined && Number.isFinite(Number(body.position))) {
    data.position = Number(body.position);
  }

  const item = await prisma.faculty.update({ where: { id }, data });

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  try {
    await requireRole(["ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.faculty.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.photoUrl) {
    await deleteFromS3([existing.photoUrl]);
  }

  await prisma.faculty.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
