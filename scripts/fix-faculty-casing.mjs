// One-off backfill: re-title-cases existing faculty text fields (name,
// designation, department, subjects, areasOfInterest, achievements) so
// ALL-CAPS / all-lowercase entries typed before the form started enforcing
// this match what the form now produces. Grades is deliberately excluded —
// it stores Roman numerals ("VI", "XII") that title-casing would mangle.
//
// Usage:
//   node --env-file=.env scripts/fix-faculty-casing.mjs [--dry-run]
//
// Safe to re-run: title-casing an already-corrected value is a no-op.

import { prisma } from "../src/lib/prisma.js";
import { toTitleCase } from "../src/lib/text-case.js";

const DRY_RUN = process.argv.includes("--dry-run");

function fixArray(values) {
  return values.map((value) => toTitleCase(value));
}

async function main() {
  const items = await prisma.faculty.findMany();
  let updated = 0;

  for (const item of items) {
    const data = {};

    const name = toTitleCase(item.name);
    if (name !== item.name) data.name = name;

    const designation = toTitleCase(item.designation);
    if (designation !== item.designation) data.designation = designation;

    if (item.department != null) {
      const department = toTitleCase(item.department);
      if (department !== item.department) data.department = department;
    }

    const subjects = fixArray(item.subjects);
    if (subjects.some((v, i) => v !== item.subjects[i])) data.subjects = subjects;

    const areasOfInterest = fixArray(item.areasOfInterest);
    if (areasOfInterest.some((v, i) => v !== item.areasOfInterest[i])) {
      data.areasOfInterest = areasOfInterest;
    }

    const achievements = fixArray(item.achievements);
    if (achievements.some((v, i) => v !== item.achievements[i])) {
      data.achievements = achievements;
    }

    if (Object.keys(data).length === 0) continue;

    updated += 1;
    console.log(`${DRY_RUN ? "[dry-run] " : ""}${item.id} (${item.name})`, data);

    if (!DRY_RUN) {
      await prisma.faculty.update({ where: { id: item.id }, data });
    }
  }

  console.log(`\n${updated}/${items.length} faculty rows ${DRY_RUN ? "would be" : "were"} updated.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
