// One-off: resets Subject.position so the list starts in A-Z order (by
// label) everywhere it's consumed (all dropdowns query `orderBy: { position:
// "asc" }`). Drag-to-reorder in the admin UI still works normally after this
// — it's just the starting order that changes, not the reordering mechanism.
//
// Usage:
//   node --env-file=.env.local scripts/sort-subjects-alphabetically.mjs [--dry-run]

import { prisma } from "../src/lib/prisma.js";

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  const items = await prisma.subject.findMany();
  const sorted = [...items].sort((a, b) => a.label.localeCompare(b.label, "en"));

  const changes = sorted
    .map((item, index) => ({ item, index }))
    .filter(({ item, index }) => item.position !== index);

  if (changes.length === 0) {
    console.log("Already in alphabetical order — nothing to do.");
    return;
  }

  console.log("New order:");
  sorted.forEach((item, index) => {
    const changed = item.position !== index ? ` (was ${item.position})` : "";
    console.log(`  ${index}: ${item.label}${changed}`);
  });

  if (!DRY_RUN) {
    await prisma.$transaction(
      sorted.map((item, index) => prisma.subject.update({ where: { id: item.id }, data: { position: index } })),
    );
  }

  console.log(`\n${changes.length}/${items.length} subjects ${DRY_RUN ? "would be" : "were"} repositioned.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
