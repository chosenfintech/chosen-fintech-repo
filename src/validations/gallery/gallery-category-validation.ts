// src/validations/gallery/gallery-category-validation.ts
import { z } from 'zod';

export const createGalleryCategorySchema = z.object({
  name: z
    .string({ message: 'Category name is required' })
    .min(1, 'Category name must not be empty')
    .max(100, 'Category name must be less than 100 characters'),
  isFeatured: z.boolean().optional().default(false),
});

export const updateGalleryCategorySchema = z.object({
  name: z
    .string({ message: 'Category name must be a string' })
    .min(1, 'Category name must not be empty')
    .max(100, 'Cataegory name must be less than 100 characters')
    .optional(),
  isFeatured: z.boolean().optional(),
});

export type IGalleryCategoryFormSchema = z.input<
  typeof createGalleryCategorySchema
>;
