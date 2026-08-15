import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { parseWeekday } from "@/data/weekdays";
import { requireRole } from "@/lib/auth";
import { parseClassValue } from "@/lib/classes";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".xlsx", ".xls", ".csv"];

function getField(row, ...names) {
  for (const key of Object.keys(row)) {
    const normalizedKey = key.trim().toLowerCase();
    if (names.includes(normalizedKey)) {
      const value = row[key];
      return typeof value === "string" ? value.trim() : value;
    }
  }
  return undefined;
}

export async function POST(request) {
  let profile;
  try {
    profile = await requireRole(["EDITOR", "ADMIN"]);
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: error.status ?? 403 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const publish = formData?.get("publish") === "true";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: "File must be .xlsx, .xls, or .csv" },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be 2MB or smaller" }, { status: 400 });
  }

  let rows;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  } catch {
    return NextResponse.json({ error: "Could not read the spreadsheet" }, { status: 400 });
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: "The sheet has no data rows" }, { status: 400 });
  }

  const classes = await prisma.schoolClass.findMany();

  const valid = [];
  const errors = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // 1-based + header row
    const rawClass = getField(row, "class");
    const rawDay = getField(row, "day");
    const rawPeriod = getField(row, "period");
    const subject = getField(row, "subject");
    const teacherName = getField(row, "teacher", "teachername", "teacher name");
    const startTime = getField(row, "start time", "starttime", "start");
    const endTime = getField(row, "end time", "endtime", "end");

    const klass = parseClassValue(classes, rawClass);
    if (!klass) {
      errors.push({ row: rowNumber, message: `Unrecognized class "${rawClass}"` });
      return;
    }
    const day = parseWeekday(rawDay);
    if (!day) {
      errors.push({ row: rowNumber, message: `Unrecognized day "${rawDay}"` });
      return;
    }
    const period = Number(rawPeriod);
    if (!Number.isInteger(period) || period < 1) {
      errors.push({ row: rowNumber, message: `Invalid period "${rawPeriod}"` });
      return;
    }
    if (!subject || typeof subject !== "string") {
      errors.push({ row: rowNumber, message: "Subject is required" });
      return;
    }

    valid.push({
      class: klass,
      day,
      period,
      subject: subject.trim(),
      teacherName: teacherName ? String(teacherName).trim() : null,
      startTime: startTime ? String(startTime).trim() : null,
      endTime: endTime ? String(endTime).trim() : null,
    });
  });

  if (valid.length === 0) {
    return NextResponse.json(
      { error: "No valid rows found", errors: errors.slice(0, 20) },
      { status: 400 },
    );
  }

  const existing = await prisma.timeTableSlot.findMany({
    where: { OR: valid.map(({ class: c, day, period }) => ({ class: c, day, period })) },
    select: { class: true, day: true, period: true },
  });
  const existingKeys = new Set(existing.map((e) => `${e.class}-${e.day}-${e.period}`));

  const publishFields = publish
    ? { status: "PUBLISHED", publishedAt: new Date() }
    : {};

  await prisma.$transaction(
    valid.map((slot) =>
      prisma.timeTableSlot.upsert({
        where: { class_day_period: { class: slot.class, day: slot.day, period: slot.period } },
        create: { ...slot, authorId: profile.id, ...publishFields },
        update: { ...slot, ...publishFields },
      }),
    ),
  );

  const updated = valid.filter((slot) =>
    existingKeys.has(`${slot.class}-${slot.day}-${slot.period}`),
  ).length;
  const created = valid.length - updated;

  return NextResponse.json({
    created,
    updated,
    skipped: errors.length,
    errors: errors.slice(0, 20),
  });
}
