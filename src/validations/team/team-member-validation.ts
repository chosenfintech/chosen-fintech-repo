// src/validations/team/team-member-validation.ts
import { z } from 'zod';
import { parseBoolean } from '@/utils/parse-booleans';

/** Trims, then treats an empty string as "not provided". */
const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be less than ${max} characters`)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null));

/** Same as `optionalText`, but the value must look like a URL when present. */
const optionalUrl = (label: string) =>
  optionalText(500, label).refine(
    (v) => v === null || /^https?:\/\/\S+$/i.test(v),
    { message: `${label} must be a full URL starting with http:// or https://` },
  );

const optionalEmail = optionalText(255, 'Email').refine(
  (v) => v === null || z.email().safeParse(v).success,
  { message: 'Email must be a valid email address' },
);

/**
 * Sent as multipart/form-data alongside the photo, so numbers and booleans
 * arrive as strings and are coerced here.
 */
export const createTeamMemberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(150, 'Name must be less than 150 characters'),
  role: z
    .string()
    .trim()
    .min(2, 'Role must be at least 2 characters')
    .max(150, 'Role must be less than 150 characters'),
  email: optionalEmail,
  facebookUrl: optionalUrl('Facebook URL'),
  twitterUrl: optionalUrl('X / Twitter URL'),
  linkedinUrl: optionalUrl('LinkedIn URL'),
  displayOrder: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === '') return 0;
      const parsed = typeof v === 'number' ? v : Number(v);
      return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
    })
    .refine((v) => v >= 0 && v <= 9999, {
      message: 'Display order must be between 0 and 9999',
    }),
  isPublished: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => (v !== undefined ? parseBoolean(v) : false)),
});

/** Every field optional - the photo is replaced only when a new file is sent. */
export const updateTeamMemberSchema = createTeamMemberSchema.partial();

export type ITeamMemberFormSchema = z.input<typeof createTeamMemberSchema>;

export type ITeamMemberFormOutput = z.output<typeof createTeamMemberSchema>;
