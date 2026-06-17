import { z } from 'zod';
import { ANNOUNCEMENT_TYPES } from '../utils/constants.js';

export const createAnnouncementSchema = z.object({
  message: z.string().min(1, 'Announcement message is required').trim(),
  type: z.enum(ANNOUNCEMENT_TYPES).optional().default('info'),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date',
  }),
  linkUrl: z.string().url().trim().optional().or(z.literal('')),
  linkLabel: z.string().trim().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();
