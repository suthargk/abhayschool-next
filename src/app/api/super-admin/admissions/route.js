import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUSES = ["NEW", "CONTACTED", "CLOSED"];

export async function GET(request) {
  try {
    await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";
  const status = searchParams.get("status");

  const where = {
    ...(STATUSES.includes(status) ? { status } : {}),
    ...(q
      ? {
          OR: [
            { studentName: { contains: q, mode: "insensitive" } },
            { parentName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const items = await prisma.admissionEnquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}
