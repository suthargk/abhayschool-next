// One-off migration: the faculty "grades" field used to be free text (e.g.
// "VI", "XI SCI", "NURSERY"). The form now offers a dropdown of the
// admin-managed SchoolClass list (Class I - XII) instead, so existing values
// are remapped to the matching SchoolClass.value ("CLASS_VI", etc).
//
// Stream-qualified entries ("XI SCI", "XII SCI") are mapped to their plain
// class (dropping the stream — there's no stream concept in SchoolClass).
// Entries with no match (NURSERY, NURSURY, NURSERY TO FIFTH — pre-primary
// isn't in the SchoolClass list) are dropped and reported for manual review.
//
// Usage:
//   node --env-file=.env.local scripts/migrate-faculty-grades-to-classes.mjs [--dry-run]

import { prisma } from "../src/lib/prisma.js";

const DRY_RUN = process.argv.includes("--dry-run");

const ROMAN_TO_VALUE = {
  I: "CLASS_I",
  II: "CLASS_II",
  III: "CLASS_III",
  IV: "CLASS_IV",
  V: "CLASS_V",
  VI: "CLASS_VI",
  VII: "CLASS_VII",
  VIII: "CLASS_VIII",
  IX: "CLASS_IX",
  X: "CLASS_X",
  XI: "CLASS_XI",
  XII: "CLASS_XII",
};

function mapGrade(raw, validValues) {
  const normalized = raw
    .trim()
    .toUpperCase()
    .replace(/\s*(SCI|SCIENCE|ARTS|COMMERCE|STREAM)\.?$/i, "")
    .trim();
  const value = ROMAN_TO_VALUE[normalized];
  return value && validValues.has(value) ? value : null;
}

async function main() {
  const [items, schoolClasses] = await Promise.all([
    prisma.faculty.findMany(),
    prisma.schoolClass.findMany({ select: { value: true } }),
  ]);
  const validValues = new Set(schoolClasses.map((c) => c.value));

  let updated = 0;
  const unmapped = [];

  for (const item of items) {
    if (item.grades.length === 0) continue;

    const mapped = new Set();
    for (const raw of item.grades) {
      const value = mapGrade(raw, validValues);
      if (value) {
        mapped.add(value);
      } else {
        unmapped.push({ faculty: item.name, raw });
      }
    }

    const newGrades = [...mapped];
    const changed =
      newGrades.length !== item.grades.length || !newGrades.every((v) => item.grades.includes(v));
    if (!changed) continue;

    updated += 1;
    console.log(
      `${DRY_RUN ? "[dry-run] " : ""}${item.name}: ${JSON.stringify(item.grades)} -> ${JSON.stringify(newGrades)}`,
    );

    if (!DRY_RUN) {
      await prisma.faculty.update({ where: { id: item.id }, data: { grades: newGrades } });
    }
  }

  console.log(`\n${updated}/${items.length} faculty rows ${DRY_RUN ? "would be" : "were"} updated.`);

  if (unmapped.length > 0) {
    console.log(`\n${unmapped.length} grade value(s) had no matching class and were dropped:`);
    for (const { faculty, raw } of unmapped) {
      console.log(`  - ${faculty}: "${raw}"`);
    }
    console.log("\nReview these faculty and re-select their classes manually if needed.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
