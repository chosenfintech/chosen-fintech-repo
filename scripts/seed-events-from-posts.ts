// scripts/seed-events-from-posts.ts
//
// One-off migration: events used to be stored as Posts whose category was NOT
// "blog" or "education" (the old `postType=events` rule). Now that events have
// their own model, this script copies those event-posts into the Event /
// EventCategory tables.
//
// For each event-post it:
//   1. Upserts a matching EventCategory by name (when the post had a category).
//   2. Creates an Event mirroring the post's fields (event-specific fields —
//      eventDate, location, startTime, endTime — are left null; there is no
//      source data for them). Original slug, publishDate and createdAt are
//      preserved.
//   3. Optionally deletes the original post (only with --delete-migrated).
//
// Safe to re-run: an event whose slug already exists is skipped.
//
// Selection note: this matches exactly what the old /events page showed —
// posts whose category name is NOT "blog"/"education", INCLUDING posts with no
// category at all.
//
// Usage:
//   npx tsx --env-file=.env scripts/seed-events-from-posts.ts --dry-run
//   npx tsx --env-file=.env scripts/seed-events-from-posts.ts
//   npx tsx --env-file=.env scripts/seed-events-from-posts.ts --delete-migrated
//
// Run against production by overriding the connection string (shell env takes
// precedence over --env-file):
//   DATABASE_URL="<prod-url>" npx tsx --env-file=.env scripts/seed-events-from-posts.ts --dry-run
import prisma from '../src/lib/prisma';

const DRY_RUN = process.argv.includes('--dry-run');
const DELETE_MIGRATED = process.argv.includes('--delete-migrated');

const BLOG_AND_EDUCATION_CATEGORY_NAMES = ['blog', 'education'];

const main = async (): Promise<void> => {
  console.log(
    DRY_RUN
      ? 'Dry run — scanning only, nothing will be written.'
      : DELETE_MIGRATED
        ? 'Migrating event-posts → Event (and DELETING the original posts)...'
        : 'Seeding event-posts → Event (originals kept; pass --delete-migrated to remove them)...',
  );

  // Event-posts = posts whose category is NOT blog/education (null category included).
  const eventPosts = await prisma.post.findMany({
    where: {
      NOT: {
        category: {
          name: {
            in: BLOG_AND_EDUCATION_CATEGORY_NAMES,
            mode: 'insensitive',
          },
        },
      },
    },
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`\nEvent-posts found: ${eventPosts.length}`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  // Cache of category name -> EventCategory id, to avoid repeat upserts.
  const eventCategoryIdByName = new Map<string, string>();

  for (const post of eventPosts) {
    const categoryName = post.category?.name ?? null;
    const label = `"${post.title}" (${post.slug})`;

    try {
      const existing = await prisma.event.findUnique({
        where: { slug: post.slug },
        select: { id: true },
      });
      if (existing) {
        skipped++;
        console.log(`  ↷ skip ${label}: an event with this slug already exists`);
        continue;
      }

      if (DRY_RUN) {
        console.log(
          `  [dry-run] would seed ${label}` +
            (categoryName ? ` [category: ${categoryName}]` : ' [no category]') +
            (DELETE_MIGRATED ? ' and delete the original post' : ''),
        );
        continue;
      }

      // Resolve / create the matching EventCategory.
      let eventCategoryId: string | null = null;
      if (categoryName) {
        const cached = eventCategoryIdByName.get(categoryName.toLowerCase());
        if (cached) {
          eventCategoryId = cached;
        } else {
          const eventCategory = await prisma.eventCategory.upsert({
            where: { name: categoryName },
            create: { name: categoryName },
            update: {},
            select: { id: true },
          });
          eventCategoryId = eventCategory.id;
          eventCategoryIdByName.set(categoryName.toLowerCase(), eventCategory.id);
        }
      }

      await prisma.$transaction(async (tx) => {
        await tx.event.create({
          data: {
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            readTime: post.readTime,
            coverImage: post.coverImage,
            isPublished: post.isPublished,
            isFeatured: post.isFeatured,
            publishDate: post.publishDate,
            createdAt: post.createdAt, // preserve original ordering
            authorId: post.authorId,
            ...(eventCategoryId && { categoryId: eventCategoryId }),
            // event-specific fields have no source data
            eventDate: null,
            location: null,
            startTime: null,
            endTime: null,
          },
        });

        if (DELETE_MIGRATED) {
          await tx.post.delete({ where: { id: post.id } });
        }
      });

      migrated++;
      console.log(
        `  ✔ ${label}` +
          (categoryName ? ` [category: ${categoryName}]` : ' [no category]') +
          (DELETE_MIGRATED ? ' (original post deleted)' : ''),
      );
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
      `\nDone. Seeded: ${migrated}, skipped: ${skipped}, failed: ${failed}`,
    );
    if (failed > 0) process.exitCode = 1;
  }

  await prisma.$disconnect();
};

main().catch(async (error) => {
  console.error('Migration aborted:', error);
  await prisma.$disconnect();
  process.exit(1);
});
