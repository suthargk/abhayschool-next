import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { LOCALES } from "@/i18n/config";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  let profile;
  try {
    profile = await requireRole(["TEACHER"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const body = await request.json().catch(() => null);
  const locale = typeof body?.locale === "string" ? body.locale : "";
  if (!LOCALES.includes(locale)) {
    return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
  }

  await prisma.profile.update({ where: { id: profile.id }, data: { locale } });

  return NextResponse.json({ ok: true });
}
