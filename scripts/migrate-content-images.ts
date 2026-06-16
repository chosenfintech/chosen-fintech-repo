// scripts/migrate-content-images.ts
//
// One-off migration: finds records whose HTML content still embeds base64
// images, uploads those images to Cloudinary, and rewrites the content to
// reference the hosted URLs. Covers posts and events.
//
// Records are updated directly in the database — no API routes run.
//
// Usage:
//   npx tsx --env-file=.env scripts/migrate-content-images.ts --dry-run
//   npx tsx --env-file=.env scripts/migrate-content-images.ts
//
// Run against production by overriding the connection string (shell env takes
// precedence over --env-file, so Cloudinary creds still load from .env):
//   DATABASE_URL="<prod-url>" npx tsx --env-file=.env scripts/migrate-content-images.ts
import prisma from '../src/lib/prisma';
import {
  uploadBase64ContentImages,
  deleteUploadedContentImages,
} from '../src/utils/content-images';

const DRY_RUN = process.argv.includes('--dry-run');

const BASE64_MARKER = 'data:image';
const BASE64_IMG_COUNT_REGEX =
  /<img[^>]*\ssrc=["']data:image\/[a-z]+;base64,[^"']+["'][^>]*>/gi;

const countBase64Images = (html: string): number =>
  [...html.matchAll(BASE64_IMG_COUNT_REGEX)].length;

const formatKb = (text: string): string =>
  `${(Buffer.byteLength(text, 'utf8') / 1024).toFixed(1)}kb`;

interface MigrationTarget {
  label: string;
  folder: string;
  findRecords: () => Promise<
    Array<{ id: string; title: string; content: string }>
  >;
  updateContent: (id: string, content: string) => Promise<unknown>;
}

const targets: MigrationTarget[] = [
  {
    label: 'post',
    folder: 'chosen-fintech/posts-images/content',
    findRecords: () =>
      prisma.post.findMany({
        where: { content: { contains: BASE64_MARKER } },
        select: { id: true, title: true, content: true },
      }),
    updateContent: (id, content) =>
      prisma.post.update({ where: { id }, data: { content } }),
  },
  {
    label: 'event',
    folder: 'chosen-fintech/events-images/content',
    findRecords: () =>
      prisma.event.findMany({
        where: { content: { contains: BASE64_MARKER } },
        select: { id: true, title: true, content: true },
      }),
    updateContent: (id, content) =>
      prisma.event.update({ where: { id }, data: { content } }),
  },
];

const migrateTarget = async (
  target: MigrationTarget,
): Promise<{ migrated: number; failed: number }> => {
  const records = await target.findRecords();
  console.log(`\n${target.label}s with base64 content: ${records.length}`);

  let migrated = 0;
  let failed = 0;

  for (const record of records) {
    const imageCount = countBase64Images(record.content);
    const sizeBefore = formatKb(record.content);

    if (DRY_RUN) {
      console.log(
        `  [dry-run] ${target.label} "${record.title}" (${record.id}): ` +
          `${imageCount} base64 image(s), content ${sizeBefore}`,
      );
      continue;
    }

    let uploadedPublicIds: string[] = [];
    try {
      const result = await uploadBase64ContentImages(
        record.content,
        target.folder,
      );
      uploadedPublicIds = result.uploadedPublicIds;

      await target.updateContent(record.id, result.html);

      migrated++;
      console.log(
        `  ✔ ${target.label} "${record.title}" (${record.id}): ` +
          `${result.uploadedPublicIds.length} image(s) uploaded, ` +
          `content ${sizeBefore} → ${formatKb(result.html)}`,
      );
    } catch (error) {
      failed++;
      console.error(
        `  ✖ ${target.label} "${record.title}" (${record.id}) failed:`,
        error instanceof Error ? error.message : error,
      );
      // The row was not updated — remove any images that did upload so they
      // don't sit orphaned in Cloudinary. A re-run picks the record up again
      // since its content still contains base64 data.
      await deleteUploadedContentImages(uploadedPublicIds);
    }
  }

  return { migrated, failed };
};

const main = async (): Promise<void> => {
  console.log(
    DRY_RUN
      ? 'Dry run — scanning only, nothing will be uploaded or updated.'
      : 'Migrating base64 content images to Cloudinary...',
  );

  let totalMigrated = 0;
  let totalFailed = 0;

  for (const target of targets) {
    const { migrated, failed } = await migrateTarget(target);
    totalMigrated += migrated;
    totalFailed += failed;
  }

  if (!DRY_RUN) {
    console.log(`\nDone. Migrated: ${totalMigrated}, failed: ${totalFailed}`);
    if (totalFailed > 0) {
      console.log('Failed records were left untouched — re-run to retry.');
      process.exitCode = 1;
    }
  }

  await prisma.$disconnect();
};

main().catch(async (error) => {
  console.error('Migration aborted:', error);
  await prisma.$disconnect();
  process.exit(1);
});
