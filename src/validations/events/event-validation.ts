// src/validations/events/event-validation.ts
import { z } from 'zod';
import { parseBoolean } from '@/utils/parse-booleans';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const createEventSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be less than 200 characters'),
    excerpt: z
      .string()
      .min(1, 'Excerpt is required')
      .max(500, 'Excerpt must be less than 500 characters'),
    content: z.string().min(1, 'Content is required'),
    coverImage: z
      .instanceof(File)
      .optional()
      .or(z.string().optional())
      .or(z.null()),
    categoryId: z.string().optional().or(z.null()),
    eventDate: z.string().optional().or(z.null()),
    location: z
      .string()
      .max(255, 'Location must be less than 255 characters')
      .optional()
      .or(z.null()),
    startTime: z
      .string()
      .max(50, 'Start time must be less than 50 characters')
      .optional()
      .or(z.null()),
    endTime: z
      .string()
      .max(50, 'End time must be less than 50 characters')
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

export const updateEventSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  excerpt: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  isPublished: z.union([z.boolean(), z.string()]).optional(),
  isFeatured: z.union([z.boolean(), z.string()]).optional(),
  publishDate: z.string().datetime({ offset: true }).optional().nullable(),
  categoryId: z
    .string()
    .regex(uuidRegex, 'Event category ID must be a valid UUID')
    .optional()
    .nullable(),
  eventDate: z.string().optional().nullable(),
  location: z.string().max(255).optional().nullable(),
  startTime: z.string().max(50).optional().nullable(),
  endTime: z.string().max(50).optional().nullable(),
  createdAt: z.string().datetime({ offset: true }).optional(),
  updatedAt: z.string().datetime({ offset: true }).optional(),
});

export type IEventFormSchema = z.input<typeof createEventSchema>;

export type IEventFormOutput = z.output<typeof createEventSchema>;
