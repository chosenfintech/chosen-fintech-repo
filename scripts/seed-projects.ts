// scripts/seed-projects.ts
//
// One-off seed: copies the original static projects
// (src/static-data/projects.ts) into the dynamic Project table so the now
// DB-backed /projects page shows them. Each project is created published.
//
// Idempotent: a project whose slug already exists is skipped.
//
// Usage:
//   npx tsx --env-file=.env scripts/seed-projects.ts --dry-run
//   npx tsx --env-file=.env scripts/seed-projects.ts
//
//   DATABASE_URL="<prod-url>" npx tsx --env-file=.env scripts/seed-projects.ts --dry-run
import prisma from '../src/lib/prisma';
import { projects } from '../src/static-data/projects';
import { calculateReadTime } from '../src/utils/read-time-calculator';

const DRY_RUN = process.argv.includes('--dry-run');

const main = async (): Promise<void> => {
  console.log(
    DRY_RUN
      ? 'Dry run — scanning only, nothing will be written.'
      : 'Seeding static projects → Project table...',
  );

  const author =
    (await prisma.user.findFirst({ where: { role: 'ADMIN' } })) ??
    (await prisma.user.findFirst());

  if (!author) {
    console.error(
      'No user found to own the projects. Seed an admin user first.',
    );
    process.exit(1);
  }

  console.log(`\nStatic projects: ${projects.length} (author: ${author.email})`);

  let seeded = 0;
  let skipped = 0;
  let failed = 0;

  for (const project of projects) {
    const label = `"${project.title}" (${project.slug})`;
    try {
      const existing = await prisma.project.findUnique({
        where: { slug: project.slug },
        select: { id: true },
      });
      if (existing) {
        skipped++;
        console.log(`  ↷ skip ${label}: already exists`);
        continue;
      }

      if (DRY_RUN) {
        console.log(`  [dry-run] would seed ${label}`);
        continue;
      }

      await prisma.project.create({
        data: {
          title: project.title,
          slug: project.slug,
          description: project.description,
          content: project.content,
          imageUrl: project.imageUrl,
          readTime: calculateReadTime(project.content),
          isPublished: true,
          isFeatured: false,
          publishDate: new Date(),
          authorId: author.id,
        },
      });

      seeded++;
      console.log(`  ✔ ${label}`);
    } catch (error) {
      failed++;
      console.error(
        `  ✖ ${label} failed:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  if (!DRY_RUN) {
    console.log(
      `\nDone. Seeded: ${seeded}, skipped: ${skipped}, failed: ${failed}`,
    );
    if (failed > 0) process.exitCode = 1;
  }

  await prisma.$disconnect();
};

main().catch(async (error) => {
  console.error('Seed aborted:', error);
  await prisma.$disconnect();
  process.exit(1);
});
