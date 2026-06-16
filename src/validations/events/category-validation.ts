// src/validations/events/category-validation.ts
import { z } from 'zod';

/**
 * Schema for creating a new category
 */
export const createEventCategorySchema = z.object({
  name: z
    .string({
      message: 'EventCategory name is required',
    })
    .min(1, 'EventCategory name must not be empty')
    .max(100, 'EventCategory name must be less than 100 characters'),
});

/**
 * Schema for updating a category
 * - Name is optional, but if provided must follow the same rules
 */
export const updateEventCategorySchema = z.object({
  name: z
    .string({
      message: 'EventCategory name must be a string',
    })
    .min(1, 'EventCategory name must not be empty')
    .max(100, 'EventCategory name must be less than 100 characters')
    .optional(),
});

export type IEventCategoryFormSchema = z.infer<typeof createEventCategorySchema>;
