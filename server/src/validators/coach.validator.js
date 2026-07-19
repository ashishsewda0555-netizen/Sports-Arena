import { z } from 'zod';
import { BATCH_LEVELS } from '../utils/constants.js';

const parseArray = (val) => {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return [val]; }
  }
  if (!Array.isArray(val) && val !== undefined) return [val];
  return val;
};

export const createCoachSchema = z.object({
  name: z.string().min(1, 'Coach name is required').trim(),
  photoId: z.string().optional().nullable(),
  specializations: z.preprocess(
    parseArray,
    z.array(z.string().min(1)).min(1, 'At least one specialization is required')
  ),
  title: z.string().trim().optional(),
  yearsOfExperience: z.coerce.number().int().min(0, 'Must be a non-negative number'),
  bioShort: z
    .string()
    .min(1, 'Short bio is required')
    .max(160, 'Short bio must be 160 characters or fewer'),
  bioFull: z.string().min(1, 'Full bio is required'),
  achievements: z.preprocess(parseArray, z.array(z.string()).optional().default([])),
  certifications: z.preprocess(parseArray, z.array(z.string()).optional().default([])),
  batchLevels: z.preprocess(parseArray, z.array(z.enum(BATCH_LEVELS)).optional().default([])),
  displayOrder: z.coerce.number().int().min(0),
  isActive: z.coerce.boolean().optional().default(true),
});

export const updateCoachSchema = createCoachSchema.partial();
