// scripts/seed-team.ts
//
// One-off seed: moves the three team members that used to be hardcoded in
// src/static-data/about.ts into the TeamMember table, uploading their photos
// from public/ to Cloudinary on the way.
//
// Idempotent - a member whose name already exists is skipped, so re-running is
// safe.
//
// Usage:
//   npx tsx --env-file=.env scripts/seed-team.ts --dry-run
//   npx tsx --env-file=.env scripts/seed-team.ts
//
// Run against production by overriding the connection string (shell env takes
// precedence over --env-file, so Cloudinary creds still load from .env):
//   DATABASE_URL="<prod-url>" npx tsx --env-file=.env scripts/seed-team.ts
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import prisma from '../src/lib/prisma';
import { cloudinaryService } from '../src/config/claudinary';

const DRY_RUN = process.argv.includes('--dry-run');

const TEAM_UPLOAD_FOLDER = 'chosen-fintech/team-photos';

interface SeedMember {
  name: string;
  role: string;
  /** File under public/, uploaded to Cloudinary as the member's photo. */
  imageFile: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  displayOrder: number;
}

const MEMBERS: SeedMember[] = [
  {
    name: 'Mohammed Mustapha Yakubu',
    role: 'Founder & CEO',
    imageFile: 'founder.jpg',
    twitterUrl: 'https://x.com/mmustaphayakubu',
    linkedinUrl:
      'https://www.linkedin.com/in/mohammed-mustapha-yakubu-a08455125',
    displayOrder: 0,
  },
  {
    name: 'Seidu Ziblim',
    role: 'Project Support',
    imageFile: 'seidu-ziblim.jpeg',
    displayOrder: 1,
  },
  {
    name: 'Osman Mohammed',
    role: 'Events Support',
    imageFile: 'osman-mohammed.jpeg',
    displayOrder: 2,
  },
];

const MIME_BY_EXTENSION: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

async function uploadPublicImage(fileName: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'public', fileName);
  const buffer = await readFile(filePath);
  const extension = path.extname(fileName).toLowerCase();

  const result = await cloudinaryService.uploadImage(
    {
      buffer,
      originalname: fileName,
      mimetype: MIME_BY_EXTENSION[extension] ?? 'image/jpeg',
    },
    { folder: TEAM_UPLOAD_FOLDER },
  );

  return result.secure_url;
}

async function main(): Promise<void> {
  console.log(
    DRY_RUN ? 'Seeding team members (dry run)...' : 'Seeding team members...',
  );

  let created = 0;
  let skipped = 0;

  for (const member of MEMBERS) {
    const existing = await prisma.teamMember.findFirst({
      where: { name: member.name },
      select: { id: true },
    });

    if (existing) {
      console.log(`  skip   ${member.name} (already in the database)`);
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`  create ${member.name} - would upload ${member.imageFile}`);
      created++;
      continue;
    }

    const imageUrl = await uploadPublicImage(member.imageFile);

    await prisma.teamMember.create({
      data: {
        name: member.name,
        role: member.role,
        imageUrl,
        facebookUrl: member.facebookUrl ?? null,
        twitterUrl: member.twitterUrl ?? null,
        linkedinUrl: member.linkedinUrl ?? null,
        displayOrder: member.displayOrder,
        isPublished: true,
      },
    });

    console.log(`  create ${member.name}`);
    created++;
  }

  console.log(`Done. ${created} created, ${skipped} skipped.`);
}

main()
  .catch((error) => {
    console.error('Team seed failed:', error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
