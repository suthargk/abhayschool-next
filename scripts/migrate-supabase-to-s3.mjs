// One-off migration: copies every file currently hosted on Supabase Storage
// to the new S3 bucket and rewrites the corresponding DB URL(s) in place.
//
// Usage:
//   node --env-file=.env scripts/migrate-supabase-to-s3.mjs [--dry-run]
//
// Requires Node >=20.6 (for --env-file) and DATABASE_URL/DIRECT_URL plus
// AWS_REGION/AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY/AWS_S3_BUCKET_NAME in .env.
// Safe to re-run: rows already pointing at the S3 bucket are skipped.

import { prisma } from "../src/lib/prisma.js";
import { putObject } from "../src/lib/s3.js";

const DRY_RUN = process.argv.includes("--dry-run");
const SUPABASE_MARKER = "/storage/v1/object/public/";

const SIMPLE_FIELDS = [
  { model: "galleryImage", field: "imageUrl" },
  { model: "galleryAlbum", field: "coverImageUrl" },
  { model: "testimonial", field: "photoUrl" },
  { model: "topper", field: "photoUrl" },
  { model: "facility", field: "imageUrl" },
  { model: "faculty", field: "photoUrl" },
  { model: "academicPost", field: "coverImageUrl" },
  { model: "newsNotice", field: "coverImageUrl" },
  { model: "homeworkAttachment", field: "fileUrl" },
  { model: "attachment", field: "fileUrl" },
  { model: "principalMessage", field: "photoUrl" },
  { model: "principalMessage", field: "signatureUrl" },
];

const CONTENT_MODELS = ["newsNotice", "homework", "academicPost", "principalMessage"];

const stats = { found: 0, migrated: 0 };
const failures = [];
const urlCache = new Map();

function isSupabaseUrl(value) {
  return typeof value === "string" && value.includes(SUPABASE_MARKER);
}

function keyFromSupabaseUrl(url) {
  return url.slice(url.indexOf(SUPABASE_MARKER) + SUPABASE_MARKER.length);
}

async function migrateUrl(url) {
  if (urlCache.has(url)) return urlCache.get(url);

  stats.found += 1;
  if (DRY_RUN) {
    urlCache.set(url, url);
    return url;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch failed (${res.status}) for ${url}`);
  }
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  const buffer = Buffer.from(await res.arrayBuffer());
  const key = keyFromSupabaseUrl(url);
  const newUrl = await putObject(key, buffer, contentType);

  urlCache.set(url, newUrl);
  stats.migrated += 1;
  return newUrl;
}

function collectStrings(node, acc) {
  if (typeof node === "string") {
    acc.push(node);
  } else if (Array.isArray(node)) {
    node.forEach((item) => collectStrings(item, acc));
  } else if (node && typeof node === "object") {
    Object.values(node).forEach((value) => collectStrings(value, acc));
  }
}

function replaceStrings(node, replacements) {
  if (typeof node === "string") {
    return replacements.has(node) ? replacements.get(node) : node;
  }
  if (Array.isArray(node)) {
    return node.map((item) => replaceStrings(item, replacements));
  }
  if (node && typeof node === "object") {
    return Object.fromEntries(
      Object.entries(node).map(([key, value]) => [key, replaceStrings(value, replacements)]),
    );
  }
  return node;
}

async function migrateSimpleFields() {
  for (const { model, field } of SIMPLE_FIELDS) {
    const rows = await prisma[model].findMany({
      where: { [field]: { contains: SUPABASE_MARKER } },
      select: { id: true, [field]: true },
    });

    for (const row of rows) {
      const url = row[field];
      try {
        const newUrl = await migrateUrl(url);
        if (!DRY_RUN) {
          await prisma[model].update({ where: { id: row.id }, data: { [field]: newUrl } });
        }
        console.log(`${DRY_RUN ? "[dry-run] " : ""}${model}.${field} ${row.id}`);
      } catch (error) {
        failures.push({ model, field, id: row.id, error: error.message });
        console.error(`FAILED ${model}.${field} ${row.id}: ${error.message}`);
      }
    }
  }
}

async function migrateContentFields() {
  for (const model of CONTENT_MODELS) {
    const rows = await prisma[model].findMany({ select: { id: true, content: true } });

    for (const row of rows) {
      const strings = [];
      collectStrings(row.content, strings);
      const supabaseUrls = [...new Set(strings.filter(isSupabaseUrl))];
      if (supabaseUrls.length === 0) continue;

      try {
        const replacements = new Map();
        for (const url of supabaseUrls) {
          replacements.set(url, await migrateUrl(url));
        }
        const newContent = replaceStrings(row.content, replacements);
        if (!DRY_RUN) {
          await prisma[model].update({ where: { id: row.id }, data: { content: newContent } });
        }
        console.log(
          `${DRY_RUN ? "[dry-run] " : ""}${model}.content ${row.id} (${supabaseUrls.length} image${supabaseUrls.length === 1 ? "" : "s"})`,
        );
      } catch (error) {
        failures.push({ model, field: "content", id: row.id, error: error.message });
        console.error(`FAILED ${model}.content ${row.id}: ${error.message}`);
      }
    }
  }
}

async function main() {
  console.log(DRY_RUN ? "Dry run — no writes will happen.\n" : "Migrating Supabase Storage files to S3...\n");

  await migrateSimpleFields();
  await migrateContentFields();

  console.log("\n--- Summary ---");
  console.log(`Supabase URLs found: ${stats.found}`);
  console.log(`Objects migrated to S3: ${stats.migrated}`);
  console.log(`Failures: ${failures.length}`);
  if (failures.length > 0) {
    console.table(failures);
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error("Migration script crashed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
