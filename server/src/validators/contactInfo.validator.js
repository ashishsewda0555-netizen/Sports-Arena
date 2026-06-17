import { z } from 'zod';

export const updateContactInfoSchema = z.object({
  facilityName: z.string().min(1).trim().optional(),
  addressLine1: z.string().min(1).trim().optional(),
  addressLine2: z.string().trim().optional().nullable(),
  city: z.string().min(1).trim().optional(),
  state: z.string().min(1).trim().optional(),
  postalCode: z.string().min(1).trim().optional(),
  country: z.string().trim().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  phonePrimary: z.string().min(1).trim().optional(),
  phoneSecondary: z.string().trim().optional().nullable(),
  whatsappNumber: z.string().min(1).trim().optional(),
  email: z.string().email('Please enter a valid email address').trim().optional(),
  mapEmbedUrl: z.string().url().trim().optional().nullable().or(z.literal('')),
  notificationEmail: z.string().email().trim().optional().nullable().or(z.literal('')),
});
