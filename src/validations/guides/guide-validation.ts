// src/validations/guides/guide-validation.ts
import { z } from 'zod';
import { parseBoolean } from '@/utils/parse-booleans';

export const createGuideSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be less than 200 characters'),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(500, 'Description must be less than 500 characters'),
    content: z.string().min(1, 'Content is required'),
    image: z
      .instanceof(File)
      .optional()
      .or(z.string().optional())
      .or(z.null()),
    level: z
      .enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
      .optional()
      .or(z.null()),
    isPublished: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((v) => (v !== undefined ? parseBoolean(v) : false)),
    isFeatured: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((v) => (v !== undefined ? parseBoolean(v) : false)),
    publishDate: z.string().optional().or(z.null()),
    createdAt: z.string().optional().or(z.null()),
    updatedAt: z.string().optional().or(z.null()),
  })
  .refine(
    (data) => {
      if (data.updatedAt && data.createdAt) {
        const created = new Date(data.createdAt);
        const updated = new Date(data.updatedAt);

        created.setSeconds(0, 0);
        updated.setSeconds(0, 0);

        return updated.getTime() >= created.getTime();
      }
      return true;
    },
    {
      message: 'Updated date must be equal to or later than created date',
      path: ['updatedAt'],
    },
  )
  .refine(
    (data) => {
      if (data.publishDate && data.createdAt) {
        const published = new Date(data.publishDate);
        const created = new Date(data.createdAt);

        published.setSeconds(0, 0);
        created.setSeconds(0, 0);

        return published.getTime() >= created.getTime();
      }
      return true;
    },
    {
      message: 'Publish date cannot be earlier than created date',
      path: ['publishDate'],
    },
  )
  .refine(
    (data) => {
      if (data.updatedAt && data.publishDate) {
        const updated = new Date(data.updatedAt);
        const published = new Date(data.publishDate);

        updated.setSeconds(0, 0);
        published.setSeconds(0, 0);

        return updated.getTime() >= published.getTime();
      }
      return true;
    },
    {
      message: 'Updated date must be equal to or later than publish date',
      path: ['updatedAt'],
    },
  );

export const updateGuideSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  isPublished: z.union([z.boolean(), z.string()]).optional(),
  isFeatured: z.union([z.boolean(), z.string()]).optional(),
  publishDate: z.string().datetime({ offset: true }).optional().nullable(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional().nullable(),
  createdAt: z.string().datetime({ offset: true }).optional(),
  updatedAt: z.string().datetime({ offset: true }).optional(),
});

export type IGuideFormSchema = z.input<typeof createGuideSchema>;

export type IGuideFormOutput = z.output<typeof createGuideSchema>;
