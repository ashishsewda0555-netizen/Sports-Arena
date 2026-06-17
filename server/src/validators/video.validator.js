import { z } from 'zod';
import { VIDEO_PLACEMENTS } from '../utils/constants.js';

export const createVideoSchema = z.object({
  title: z.string().min(1, 'Video title is required').trim(),
  description: z.string().trim().optional(),
  embedUrl: z.string().url('Embed URL must be a valid URL').trim(),
  thumbnailUrl: z.string().url().trim().optional().nullable().or(z.literal('')),
  placement: z.enum(VIDEO_PLACEMENTS),
  displayOrder: z.number().int().min(0),
  isActive: z.boolean().optional().default(true),
});

export const updateVideoSchema = createVideoSchema.partial();
