import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FACULTY_CATEGORIES } from "@/data/faculty-categories";

const FACULTY_CATEGORY_VALUES = FACULTY_CATEGORIES.map((c) => c.value);

function sanitizeStringArray(values) {
  if (!Array.isArray(values)) return [];
  return values.map((value) => (typeof value === "string" ? value.trim() : "")).filter(Boolean);
}

export async function GET() {
  let profile;
  try {
    profile = await requireTeacherFeature("FACULTY");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.faculty.findMany({
    where: { authorId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}

export async function POST(request) {
  let profile;
  try {
    profile = await requireTeacherFeature("FACULTY");
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

  const maxPosition = await prisma.faculty.aggregate({ _max: { position: true } });

  const item = await prisma.faculty.create({
    data: {
      name: body.name.trim(),
      designation: body.designation.trim(),
      department: typeof body.department === "string" ? body.department.trim() || null : null,
      category: FACULTY_CATEGORY_VALUES.includes(body.category) ? body.category : "TEACHING",
      subjects: sanitizeStringArray(body.subjects),
      grades: sanitizeStringArray(body.grades),
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
      // Teachers publish directly — no separate admin review step, unlike
      // EDITOR-authored faculty entries in the super-admin dashboard.
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
