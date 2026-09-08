// One-off migration: the faculty "subjects" field used to be free text and
// included a typo ("Enlgish") plus several non-subject entries someone typed
// in there (coaching/staff roles like "Taekwondo", "Football Coach",
// "Office Assistant Cum Deo"). The form now offers a dropdown of the
// admin-managed Subject list instead, so existing values are remapped to
// the matching Subject.label, with known typos fixed. Anything that still
// doesn't match a real subject is dropped and reported for manual review.
//
// Usage:
//   node --env-file=.env.local scripts/migrate-faculty-subjects.mjs [--dry-run]

import { prisma } from "../src/lib/prisma.js";

const DRY_RUN = process.argv.includes("--dry-run");

const TYPO_FIXES = {
  ENLGISH: "English",
  "PHYSICAL EDUCATION TEACHER": "Physical Education",
};

function mapSubject(raw, validLabels) {
  const trimmed = raw.trim();
  const fixed = TYPO_FIXES[trimmed.toUpperCase()] ?? trimmed;
  return validLabels.has(fixed) ? fixed : null;
}

async function main() {
  const [items, subjectRows] = await Promise.all([
    prisma.faculty.findMany(),
    prisma.subject.findMany({ select: { label: true } }),
  ]);
  const validLabels = new Set(subjectRows.map((s) => s.label));

  let updated = 0;
  const dropped = [];

  for (const item of items) {
    if (item.subjects.length === 0) continue;

    const mapped = new Set();
    for (const raw of item.subjects) {
      const label = mapSubject(raw, validLabels);
      if (label) {
        mapped.add(label);
      } else {
        dropped.push({ faculty: item.name, raw });
      }
    }

    const newSubjects = [...mapped];
    const changed =
      newSubjects.length !== item.subjects.length ||
      !newSubjects.every((v) => item.subjects.includes(v));
    if (!changed) continue;

    updated += 1;
    console.log(
      `${DRY_RUN ? "[dry-run] " : ""}${item.name}: ${JSON.stringify(item.subjects)} -> ${JSON.stringify(newSubjects)}`,
    );

    if (!DRY_RUN) {
      await prisma.faculty.update({ where: { id: item.id }, data: { subjects: newSubjects } });
    }
  }

  console.log(`\n${updated}/${items.length} faculty rows ${DRY_RUN ? "would be" : "were"} updated.`);

  if (dropped.length > 0) {
    console.log(`\n${dropped.length} subject value(s) had no matching subject and were dropped:`);
    for (const { faculty, raw } of dropped) {
      console.log(`  - ${faculty}: "${raw}"`);
    }
    console.log("\nReview these faculty and re-select their subjects manually if needed.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
