import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FACULTY_CATEGORIES } from "@/data/faculty-categories";
import { toTitleCase } from "@/lib/text-case";

const FACULTY_CATEGORY_VALUES = FACULTY_CATEGORIES.map((c) => c.value);

function sanitizeStringArray(values) {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => (typeof value === "string" ? toTitleCase(value.trim()) : ""))
    .filter(Boolean);
}

// Grades must be one of the admin-managed SchoolClass values — free text is
// no longer accepted (the form only offers a dropdown of known classes).
function sanitizeGrades(values, validValues) {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((value) => validValues.has(value)))];
}

// Subjects must be one of the admin-managed Subject labels — free text is
// no longer accepted (the form only offers a dropdown of known subjects).
function sanitizeSubjects(values, validLabels) {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((value) => validLabels.has(value)))];
}

export async function GET(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("FACULTY");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const item = await prisma.faculty.findUnique({ where: { id } });
  if (!item || item.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("FACULTY");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.faculty.findUnique({ where: { id } });
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
    data.name = toTitleCase(body.name.trim());
  }
  if (typeof body.designation === "string") {
    if (!body.designation.trim()) {
      return NextResponse.json({ error: "Designation is required" }, { status: 400 });
    }
    data.designation = toTitleCase(body.designation.trim());
  }
  if (body.department !== undefined) {
    data.department =
      typeof body.department === "string" ? toTitleCase(body.department.trim()) || null : null;
  }
  if (body.category !== undefined) {
    data.category = FACULTY_CATEGORY_VALUES.includes(body.category) ? body.category : "TEACHING";
  }
  if (body.subjects !== undefined) {
    const subjectRows = await prisma.subject.findMany({ select: { label: true } });
    data.subjects = sanitizeSubjects(body.subjects, new Set(subjectRows.map((s) => s.label)));
  }
  if (body.grades !== undefined) {
    const schoolClasses = await prisma.schoolClass.findMany({ select: { value: true } });
    data.grades = sanitizeGrades(body.grades, new Set(schoolClasses.map((c) => c.value)));
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

  const item = await prisma.faculty.update({ where: { id }, data });

  return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
  let profile;
  try {
    profile = await requireTeacherFeature("FACULTY");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { id } = await params;
  const existing = await prisma.faculty.findUnique({ where: { id } });
  if (!existing || existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.faculty.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
