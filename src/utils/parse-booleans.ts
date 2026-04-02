// Helper function to parse booleans safely
export const parseBoolean = (value: unknown): boolean => {
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

  return false;
};
