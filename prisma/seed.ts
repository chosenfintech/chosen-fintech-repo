import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { ENV } from '@/lib/env';

async function seedAdmin() {
  if (!ENV.adminSeedEnabled) {
    console.log('Admin seed skipped (ADMIN_SEED_ENABLED=false).');
    return;
  }

  const email = ENV.adminEmail().toLowerCase().trim();
  const password = ENV.adminPassword();
  const fullName = ENV.adminFullname();
  const phone = ENV.adminPhone();

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  // Create-only by default (no surprise updates)
  if (existing && !ENV.adminSeedForceUpdate) {
    console.log(
      `Admin seed: user already exists (${email}). No changes (force update disabled).`,
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Upsert (create or update) BUT only when force update is enabled (or user doesn't exist)
  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      password: hashedPassword,
      ...(fullName ? { fullName } : {}),
      ...(phone ? { phone } : {}),
    },
    update: {
      password: hashedPassword,
      ...(fullName ? { fullName } : {}),
      ...(phone ? { phone } : {}),
    },
  });

  console.log(
    existing
      ? `Admin seed: updated admin (${email}) because ADMIN_SEED_FORCE_UPDATE=true.`
      : `Admin seed: created admin (${email}).`,
  );
}

async function main() {
  await seedAdmin();
}

// Main
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error('Seed failed:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
