import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { requireRole } from "@/lib/auth";
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

  const valid = [];
  const errors = [];
  const seenPlaces = new Set();

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // 1-based + header row
    const place = getField(row, "place", "places", "stop");
    const rawRouteNo = getField(row, "route no", "routeno", "route no.", "route");
    const rawDistance = getField(row, "km", "k.m", "km.", "distance", "distance (km)");
    const rawRent = getField(row, "rent/year", "rent per year", "rent", "rent / year");

    if (!place || typeof place !== "string") {
      errors.push({ row: rowNumber, message: "Place is required" });
      return;
    }
    const placeKey = place.trim().toLowerCase();
    if (seenPlaces.has(placeKey)) {
      errors.push({ row: rowNumber, message: `Duplicate place "${place}" in file` });
      return;
    }

    const routeNo = Number(rawRouteNo);
    if (!Number.isInteger(routeNo) || routeNo < 1) {
      errors.push({ row: rowNumber, message: `Invalid route number "${rawRouteNo}"` });
      return;
    }

    const rentPerYear = Number(rawRent);
    if (!Number.isFinite(rentPerYear) || rentPerYear < 0) {
      errors.push({ row: rowNumber, message: `Invalid rent "${rawRent}"` });
      return;
    }

    let distanceKm = null;
    if (rawDistance !== undefined && rawDistance !== "" && rawDistance !== null) {
      const parsed = Number(rawDistance);
      if (!Number.isFinite(parsed) || parsed < 0) {
        errors.push({ row: rowNumber, message: `Invalid distance "${rawDistance}"` });
        return;
      }
      distanceKm = parsed;
    }

    seenPlaces.add(placeKey);
    valid.push({
      place: place.trim(),
      routeNo,
      rentPerYear: Math.round(rentPerYear),
      distanceKm,
    });
  });

  if (valid.length === 0) {
    return NextResponse.json(
      { error: "No valid rows found", errors: errors.slice(0, 20) },
      { status: 400 },
    );
  }

  const existing = await prisma.busRoute.findMany({
    where: { place: { in: valid.map((v) => v.place) } },
    select: { place: true },
  });
  const existingPlaces = new Set(existing.map((e) => e.place));

  const publishFields = publish
    ? { status: "PUBLISHED", publishedAt: new Date() }
    : {};

  const maxPosition = await prisma.busRoute.aggregate({ _max: { position: true } });
  let nextPosition = (maxPosition._max.position ?? -1) + 1;

  await prisma.$transaction(
    valid.map((stop) => {
      const isNew = !existingPlaces.has(stop.place);
      const position = isNew ? nextPosition++ : undefined;
      return prisma.busRoute.upsert({
        where: { place: stop.place },
        create: { ...stop, position, authorId: profile.id, ...publishFields },
        update: { ...stop, ...publishFields },
      });
    }),
  );

  const updated = valid.filter((stop) => existingPlaces.has(stop.place)).length;
  const created = valid.length - updated;

  return NextResponse.json({
    created,
    updated,
    skipped: errors.length,
    errors: errors.slice(0, 20),
  });
}
