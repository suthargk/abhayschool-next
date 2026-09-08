// One-off seed: populates the new admin-managed Subject list from the real
// subject vocabulary already found in Faculty.subjects, TimeTableSlot.subject,
// and the previously-hardcoded homework subject list — so the dropdown is
// immediately useful instead of starting empty. Safe to re-run: existing
// values are left untouched (upsert on the unique `value`).
//
// Usage:
//   node --env-file=.env.local scripts/seed-subjects.mjs [--dry-run]

import { prisma } from "../src/lib/prisma.js";

const DRY_RUN = process.argv.includes("--dry-run");

const SUBJECTS = [
  ["ENGLISH", "English"],
  ["HINDI", "Hindi"],
  ["SANSKRIT", "Sanskrit"],
  ["MATHEMATICS", "Mathematics"],
  ["SCIENCE", "Science"],
  ["PHYSICS", "Physics"],
  ["CHEMISTRY", "Chemistry"],
  ["BIOLOGY", "Biology"],
  ["COMPUTER_SCIENCE", "Computer Science"],
  ["SOCIAL_SCIENCE", "Social Science"],
  ["HISTORY_CIVICS", "History & Civics"],
  ["HISTORY", "History"],
  ["GEOGRAPHY", "Geography"],
  ["GEOLOGY", "Geology"],
  ["ECONOMICS", "Economics"],
  ["POLITICAL_SCIENCE", "Political Science"],
  ["COMMERCE", "Commerce"],
  ["BUSINESS_STUDIES", "Business Studies"],
  ["ACCOUNTANCY", "Accountancy"],
  ["AGRICULTURE", "Agriculture"],
  ["DRAWING", "Drawing"],
  ["ART", "Art"],
  ["PHYSICAL_EDUCATION", "Physical Education"],
];

async function main() {
  const authorId = process.argv
    .find((arg) => arg.startsWith("--author="))
    ?.split("=")[1];
  if (!authorId) {
    throw new Error("Pass --author=<profileId> (an existing ADMIN profile id)");
  }

  const existing = await prisma.subject.findMany({ select: { value: true } });
  const existingValues = new Set(existing.map((s) => s.value));
  const maxPosition = await prisma.subject.aggregate({ _max: { position: true } });
  let nextPosition = (maxPosition._max.position ?? -1) + 1;

  let created = 0;
  for (const [value, label] of SUBJECTS) {
    if (existingValues.has(value)) continue;
    created += 1;
    console.log(`${DRY_RUN ? "[dry-run] " : ""}create ${value} (${label})`);
    if (!DRY_RUN) {
      await prisma.subject.create({
        data: { value, label, position: nextPosition++, authorId },
      });
    }
  }

  console.log(`\n${created}/${SUBJECTS.length} subjects ${DRY_RUN ? "would be" : "were"} created.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
