import { z } from 'zod';
import { BATCH_LEVELS } from '../utils/constants.js';

export const createCoachSchema = z.object({
  name: z.string().min(1, 'Coach name is required').trim(),
  photoId: z.string().optional().nullable(),
  specializations: z
    .array(z.string())
    .min(1, 'At least one specialization is required'),
  title: z.string().trim().optional(),
  yearsOfExperience: z.number().int().min(0, 'Must be a non-negative number'),
  bioShort: z
    .string()
    .min(1, 'Short bio is required')
    .max(160, 'Short bio must be 160 characters or fewer'),
  bioFull: z.string().min(1, 'Full bio is required'),
  achievements: z.array(z.string()).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  batchLevels: z.array(z.enum(BATCH_LEVELS)).optional().default([]),
  displayOrder: z.number().int().min(0),
  isActive: z.boolean().optional().default(true),
});

export const updateCoachSchema = createCoachSchema.partial();
