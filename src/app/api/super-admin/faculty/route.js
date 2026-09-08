import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
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

export async function GET() {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.faculty.findMany({
    orderBy: { position: "asc" },
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
  if (typeof body.designation !== "string" || !body.designation.trim()) {
    return NextResponse.json({ error: "Designation is required" }, { status: 400 });
  }

  const [maxPosition, schoolClasses, subjectRows] = await Promise.all([
    prisma.faculty.aggregate({ _max: { position: true } }),
    prisma.schoolClass.findMany({ select: { value: true } }),
    prisma.subject.findMany({ select: { label: true } }),
  ]);
  const validClassValues = new Set(schoolClasses.map((c) => c.value));
  const validSubjectLabels = new Set(subjectRows.map((s) => s.label));

  const item = await prisma.faculty.create({
    data: {
      name: toTitleCase(body.name.trim()),
      designation: toTitleCase(body.designation.trim()),
      department:
        typeof body.department === "string" ? toTitleCase(body.department.trim()) || null : null,
      category: FACULTY_CATEGORY_VALUES.includes(body.category) ? body.category : "TEACHING",
      subjects: sanitizeSubjects(body.subjects, validSubjectLabels),
      grades: sanitizeGrades(body.grades, validClassValues),
      areasOfInterest: sanitizeStringArray(body.areasOfInterest),
      achievements: sanitizeStringArray(body.achievements),
      qualification:
        typeof body.qualification === "string" ? body.qualification.trim() || null : null,
      bio: typeof body.bio === "string" ? body.bio.trim() || null : null,
      experienceYears:
        Number.isFinite(Number(body.experienceYears)) && body.experienceYears !== ""
          ? Number(body.experienceYears)
          : null,
      email: typeof body.email === "string" ? body.email.trim() || null : null,
      photoUrl: body.photoUrl || null,
      position: (maxPosition._max.position ?? -1) + 1,
      authorId: profile.id,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
