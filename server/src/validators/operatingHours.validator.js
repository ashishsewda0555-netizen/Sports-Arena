import { z } from 'zod';
import { DAYS_OF_WEEK } from '../utils/constants.js';

const dayScheduleSchema = z.object({
  day: z.enum(DAYS_OF_WEEK),
  isOpen: z.boolean(),
  openTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'),
});

export const updateOperatingHoursSchema = z.object({
  schedule: z
    .array(dayScheduleSchema)
    .length(7, 'Schedule must contain exactly 7 days'),
  specialNotes: z.string().trim().optional().nullable(),
  timezone: z.string().optional(),
});
