import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const ATTACHMENT_BUCKET = "homework-attachments";

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
    await requireRole(["EDITOR", "ADMIN"]);
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
    return NextResponse.json(
      { error: "File must be 10MB or smaller" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(ATTACHMENT_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(ATTACHMENT_BUCKET).getPublicUrl(path);

  return NextResponse.json({
    url: publicUrl,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });
}
