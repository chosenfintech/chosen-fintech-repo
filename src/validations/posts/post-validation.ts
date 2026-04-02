// src/validations/posts/post-validation.ts
import { z } from 'zod';
import { parseBoolean } from '@/utils/parse-booleans';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  excerpt: z
    .string()
    .min(1, 'Excerpt is required')
    .max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  isPublished: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => (v !== undefined ? parseBoolean(v) : false)),
  isFeatured: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => (v !== undefined ? parseBoolean(v) : false)),
  publishDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .or(z.literal('')),
  categoryId: z
    .string()
    .regex(uuidRegex, 'Category ID must be a valid UUID')
    .optional(),
  tagIds: z
    .array(z.string().regex(uuidRegex, 'Each tag ID must be a valid UUID'))
    .optional(),
  createdAt: z.string().datetime({ offset: true }).optional(),
  updatedAt: z.string().datetime({ offset: true }).optional(),
});
