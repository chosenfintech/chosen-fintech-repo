// src/validations/posts/category-validation.ts
import { z } from 'zod';

/**
 * Schema for creating a new category
 */
export const createCategorySchema = z.object({
  name: z
    .string({
      message: 'Category name is required',
    })
    .min(1, 'Category name must not be empty')
    .max(100, 'Category name must be less than 100 characters'),
});

/**
 * Schema for updating a category
 * - Name is optional, but if provided must follow the same rules
 */
export const updateCategorySchema = z.object({
  name: z
    .string({
      message: 'Category name must be a string',
    })
    .min(1, 'Category name must not be empty')
    .max(100, 'Category name must be less than 100 characters')
    .optional(),
});
