// src/lib/env.ts
function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env variable: ${name}`);
  return v;
}

function optional(name: string): string | undefined {
  const v = process.env[name];
  return v?.length ? v : undefined;
}

function bool(name: string, defaultValue = false): boolean {
  const v = process.env[name];
  if (!v) return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(v.toLowerCase());
}

export const ENV = {
  ADMIN_SEED_ENABLED: bool('ADMIN_SEED_ENABLED', false),
  ADMIN_SEED_FORCE_UPDATE: bool('ADMIN_SEED_FORCE_UPDATE', false),

  ADMIN_EMAIL: required('ADMIN_EMAIL'),
  ADMIN_PASSWORD: required('ADMIN_PASSWORD'),
  ADMIN_FULLNAME: required('ADMIN_FULLNAME'),
  ADMIN_PHONE: optional('ADMIN_PHONE'),

  SESSION_SECRET: required('SESSION_SECRET'),

  // Public site origin — used to build absolute links in emails (e.g. the
  // password-reset link). Falls back to localhost for local development.
  BASE_URL: optional('NEXT_PUBLIC_BASE_URL') ?? 'http://localhost:3000',

  CLOUDINARY_CLOUD_NAME: required('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: required('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: required('CLOUDINARY_API_SECRET'),
  UPSTASH_REDIS_REST_URL: required('UPSTASH_REDIS_REST_URL'),
  UPSTASH_REDIS_REST_TOKEN: required('UPSTASH_REDIS_REST_TOKEN'),

  // Gmail SMTP — used to email two-factor authentication codes. Optional so
  // the app still boots without them; the mail layer fails loudly at send time
  // if a 2FA flow runs while they're unset.
  GMAIL_USER: optional('GMAIL_USER'),
  GMAIL_PASSWORD: optional('GMAIL_PASSWORD'),
  EMAIL_FROM_NAME: optional('EMAIL_FROM_NAME') ?? 'Chosen Fintech Solutions',
} as const;
