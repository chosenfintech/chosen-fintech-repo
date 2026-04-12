// src/utils/parse-booleans.ts
export function parseBoolean(value: unknown, fallback?: false): boolean;

export function parseBoolean(value: unknown, fallback: null): boolean | null;

export function parseBoolean(
  value: unknown,
  fallback: false | null = false,
): boolean | null {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase().trim();

    if (['true', '1', 'yes'].includes(lowerValue)) {
      return true;
    }

    if (['false', '0', 'no'].includes(lowerValue)) {
      return false;
    }
  }

  return fallback;
}
