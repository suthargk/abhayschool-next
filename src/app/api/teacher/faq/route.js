import { NextResponse } from "next/server";

import { requireTeacherFeature } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let profile;
  try {
    profile = await requireTeacherFeature("FAQ");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const items = await prisma.faq.findMany({
    where: { authorId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}

export async function POST(request) {
  let profile;
  try {
    profile = await requireTeacherFeature("FAQ");
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.question !== "string" || !body.question.trim()) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }
  if (typeof body.answer !== "string" || !body.answer.trim()) {
    return NextResponse.json({ error: "Answer is required" }, { status: 400 });
  }

  const maxPosition = await prisma.faq.aggregate({ _max: { position: true } });

  const item = await prisma.faq.create({
    data: {
      question: body.question.trim(),
      answer: body.answer.trim(),
      position: (maxPosition._max.position ?? -1) + 1,
      authorId: profile.id,
      // Teachers publish directly — no separate admin review step, unlike
      // EDITOR-authored FAQs in the super-admin dashboard.
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
