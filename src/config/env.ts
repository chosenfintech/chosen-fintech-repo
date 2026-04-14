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

  CLOUDINARY_CLOUD_NAME: required('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: required('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: required('CLOUDINARY_API_SECRET'),
  UPSTASH_REDIS_REST_URL: required('UPSTASH_REDIS_REST_URL'),
  UPSTASH_REDIS_REST_TOKEN: required('UPSTASH_REDIS_REST_TOKEN'),
} as const;
