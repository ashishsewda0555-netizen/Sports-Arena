import { z } from 'zod';
import { SPORT_CATEGORIES, CTA_TYPES } from '../utils/constants.js';

export const updateSportSchema = z.object({
  shortDescription: z.string().min(1).optional(),
  longDescription: z.string().min(1, 'Long description is required').optional(),
  keyFeatures: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  iconKey: z.string().optional(),
  featuredImageId: z.string().optional().nullable(),
  galleryImageIds: z.array(z.string()).optional(),
  ctaType: z.enum(CTA_TYPES).optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  category: z.enum(SPORT_CATEGORIES).optional(),
});
