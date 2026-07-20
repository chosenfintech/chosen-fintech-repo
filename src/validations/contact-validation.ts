// src/validations/contact-validation.ts
import { z } from 'zod';

export const CONTACT_SUBJECTS = [
  'General enquiry',
  'Training & programmes',
  'Partnership',
  'Support',
] as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please tell us your name')
    .max(150, 'Name must be less than 150 characters'),
  email: z
    .email('Please enter a valid email address')
    .trim()
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone number must be less than 30 characters')
    .optional()
    .or(z.literal('')),
  subject: z.enum(CONTACT_SUBJECTS, {
    message: 'Please choose what your message is about',
  }),
  message: z
    .string()
    .trim()
    .min(10, 'Please write at least a sentence so we can help')
    .max(5000, 'Message must be less than 5000 characters'),
  /**
   * Honeypot - invisible to people, irresistible to bots. Accepted by the
   * schema so the route can reject a filled one with a flat 403 rather than a
   * field error that tells a bot exactly which input gave it away.
   */
  website: z.string().optional(),
});

export type IContactFormSchema = z.input<typeof contactSchema>;

export type IContactFormOutput = z.output<typeof contactSchema>;
