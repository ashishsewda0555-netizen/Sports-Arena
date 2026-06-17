import { z } from 'zod';

export const updateSocialLinksSchema = z.object({
  instagramUrl: z.string().url().trim().optional().nullable().or(z.literal('')),
  facebookUrl: z.string().url().trim().optional().nullable().or(z.literal('')),
  youtubeUrl: z.string().url().trim().optional().nullable().or(z.literal('')),
  googleBusinessProfileUrl: z.string().url().trim().optional().nullable().or(z.literal('')),
});
