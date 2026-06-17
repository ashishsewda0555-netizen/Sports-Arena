import { z } from 'zod';
import { FAQ_CATEGORIES } from '../utils/constants.js';

export const createFaqSchema = z.object({
  category: z.enum(FAQ_CATEGORIES),
  question: z.string().min(1, 'Question is required').trim(),
  answer: z.string().min(1, 'Answer is required'),
  displayOrder: z.number().int().min(0),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export const updateFaqSchema = createFaqSchema.partial();
