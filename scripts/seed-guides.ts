// scripts/seed-guides.ts
//
// One-off seed: copies the original static Academy guides
// (src/static-data/academy-guides.ts) into the dynamic Guide table so the now
// DB-backed /academy page shows them. Each guide is created published.
//
// Idempotent: a guide whose slug already exists is skipped.
//
// Usage:
//   npx tsx --env-file=.env scripts/seed-guides.ts --dry-run
//   npx tsx --env-file=.env scripts/seed-guides.ts
//
//   DATABASE_URL="<prod-url>" npx tsx --env-file=.env scripts/seed-guides.ts --dry-run
import prisma from '../src/lib/prisma';
import { academyGuides } from '../src/static-data/academy-guides';
import { calculateReadTime } from '../src/utils/read-time-calculator';

const DRY_RUN = process.argv.includes('--dry-run');

const LEVEL_MAP: Record<string, 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'> = {
  Beginner: 'BEGINNER',
  Intermediate: 'INTERMEDIATE',
  Advanced: 'ADVANCED',
};

const main = async (): Promise<void> => {
  console.log(
    DRY_RUN
      ? 'Dry run — scanning only, nothing will be written.'
      : 'Seeding static academy guides → Guide table...',
  );

  // Guides need an author; use the seeded admin (or the first user).
  const author =
    (await prisma.user.findFirst({ where: { isAdmin: true } })) ??
    (await prisma.user.findFirst());

  if (!author) {
    console.error('No user found to own the guides. Seed an admin user first.');
    process.exit(1);
  }

  console.log(`\nStatic guides: ${academyGuides.length} (author: ${author.email})`);

  let seeded = 0;
  let skipped = 0;
  let failed = 0;

  for (const guide of academyGuides) {
    const label = `"${guide.title}" (${guide.slug})`;
    try {
      const existing = await prisma.guide.findUnique({
        where: { slug: guide.slug },
        select: { id: true },
      });
      if (existing) {
        skipped++;
        console.log(`  ↷ skip ${label}: already exists`);
        continue;
      }

      if (DRY_RUN) {
        console.log(`  [dry-run] would seed ${label} [level: ${guide.level}]`);
        continue;
      }

      await prisma.guide.create({
        data: {
          title: guide.title,
          slug: guide.slug,
          description: guide.description,
          content: guide.content,
          image: guide.image,
          level: LEVEL_MAP[guide.level] ?? 'BEGINNER',
          readTime: calculateReadTime(guide.content),
          isPublished: true,
          isFeatured: false,
          publishDate: new Date(),
          authorId: author.id,
        },
      });

      seeded++;
      console.log(`  ✔ ${label} [level: ${guide.level}]`);
    } catch (error) {
      failed++;
      console.error(
        `  ✖ ${label} failed:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  if (!DRY_RUN) {
    console.log(`\nDone. Seeded: ${seeded}, skipped: ${skipped}, failed: ${failed}`);
    if (failed > 0) process.exitCode = 1;
  }

  await prisma.$disconnect();
};

main().catch(async (error) => {
  console.error('Seed aborted:', error);
  await prisma.$disconnect();
  process.exit(1);
});
