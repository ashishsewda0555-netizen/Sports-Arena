import { z } from 'zod';
import { USER_ROLES } from '../utils/constants.js';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(USER_ROLES).default('editor'),
  isActive: z.boolean().optional().default(true),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').trim().optional(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim().optional(),
  role: z.enum(USER_ROLES).optional(),
  isActive: z.boolean().optional(),
});
