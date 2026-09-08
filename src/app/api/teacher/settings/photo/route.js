import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";

const TEACHER_PROFILE_PHOTO_PREFIX = "teacher-profile-photos";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function POST(request) {
  let profile;
  try {
    profile = await requireRole(["TEACHER"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 5MB or smaller" }, { status: 400 });
  }

  let url;
  try {
    url = await uploadToS3(TEACHER_PROFILE_PHOTO_PREFIX, file);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await prisma.profile.update({ where: { id: profile.id }, data: { photoUrl: url } });

  return NextResponse.json({ url });
}
