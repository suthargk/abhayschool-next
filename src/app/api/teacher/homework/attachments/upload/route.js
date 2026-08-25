import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { uploadToS3 } from "@/lib/s3";

const ATTACHMENT_PREFIX = "homework-attachments";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
  "image/webp",
];

export async function POST(request) {
  try {
    await requireRole(["TEACHER"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Allowed: PDF, DOC/DOCX, XLS/XLSX, images." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be 10MB or smaller" }, { status: 400 });
  }

  let url;
  try {
    url = await uploadToS3(ATTACHMENT_PREFIX, file);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    url,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });
}
