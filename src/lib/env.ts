function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env variable: ${name}`);
  return v;
}

function optionalEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length ? v : undefined;
}

function boolEnv(name: string, defaultValue = false): boolean {
  const v = process.env[name];
  if (!v) return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(v.toLowerCase());
}

export const ENV = {
  adminSeedEnabled: boolEnv('ADMIN_SEED_ENABLED', false),
  adminSeedForceUpdate: boolEnv('ADMIN_SEED_FORCE_UPDATE', false),

  adminEmail: () => requiredEnv('ADMIN_EMAIL'),
  adminPassword: () => requiredEnv('ADMIN_PASSWORD'),

  adminFullname: () => requiredEnv('ADMIN_FULLNAME'),
  adminPhone: () => optionalEnv('ADMIN_PHONE'),
};
