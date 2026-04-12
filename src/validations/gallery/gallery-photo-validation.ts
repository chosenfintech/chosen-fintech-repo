// src/validations/gallery/gallery-photo-validation.ts
import { z } from 'zod';
import { parseBoolean } from '@/utils/parse-booleans';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const createGalleryPhotoSchema = z.object({
  altText: z
    .string()
    .max(255, 'Alt text must be less than 255 characters')
    .optional()
    .nullable(),
  caption: z
    .string()
    .max(500, 'Caption must be less than 500 characters')
    .optional()
    .nullable(),
  isPublished: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => (v !== undefined ? parseBoolean(v) : false)),
  categoryId: z
    .string({ message: 'Category ID is required' })
    .regex(uuidRegex, 'Category ID must be a valid UUID'),
});

export const updateGalleryPhotoSchema = z.object({
  altText: z
    .string()
    .max(255, 'Alt text must be less than 255 characters')
    .optional()
    .nullable(),
  caption: z
    .string()
    .max(500, 'Caption must be less than 500 characters')
    .optional()
    .nullable(),
  isPublished: z.union([z.boolean(), z.string()]).optional(),
});

export type IGalleryPhotoFormSchema = z.input<typeof createGalleryPhotoSchema>;

export type IGalleryPhotoFormOutput = z.output<typeof createGalleryPhotoSchema>;
