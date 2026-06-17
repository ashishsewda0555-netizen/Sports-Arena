import { z } from 'zod';
import { GALLERY_CATEGORIES } from '../utils/constants.js';

export const createGallerySchema = z.object({
  title: z.string().trim().optional(),
  altText: z.string().min(1, 'Alt text is required').trim(),
  category: z.enum(GALLERY_CATEGORIES),
  relatedEventId: z.string().optional().nullable(),
  displayOrder: z.number().int().min(0),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export const updateGallerySchema = z.object({
  title: z.string().trim().optional(),
  altText: z.string().trim().optional(),
  category: z.enum(GALLERY_CATEGORIES).optional(),
  relatedEventId: z.string().optional().nullable(),
  displayOrder: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
