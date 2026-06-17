import { z } from 'zod';
import { EVENT_STATUSES } from '../utils/constants.js';

export const createEventSchema = z.object({
  title: z.string().min(1, 'Event title is required').trim(),
  description: z.string().min(1, 'Event description is required'),
  eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid event date',
  }),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid end date',
    })
    .optional()
    .nullable(),
  coverImageId: z.string().optional().nullable(),
  status: z.enum(EVENT_STATUSES).optional().default('upcoming'),
  relatedSportIds: z.array(z.string()).optional().default([]),
  displayOrder: z.number().int().min(0, 'Display order must be a non-negative integer'),
  isActive: z.boolean().optional().default(true),
});

export const updateEventSchema = createEventSchema.partial();
