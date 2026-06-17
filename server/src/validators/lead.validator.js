import { z } from 'zod';
import { LEAD_STATUSES } from '../utils/constants.js';

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number too long')
    .regex(
      /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,5}\)?[\s-]?)?\d[\d\s-]{4,14}\d$/,
      'Please enter a valid phone number'
    )
    .trim(),
  sportOfInterest: z.string().min(1).optional().nullable(),
  message: z.string().max(2000, 'Message too long').trim().optional(),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});
