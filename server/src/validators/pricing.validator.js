import { z } from 'zod';
import { PRICING_CATEGORIES, BILLING_PERIODS } from '../utils/constants.js';

export const createPricingSchema = z.object({
  category: z.enum(PRICING_CATEGORIES),
  sportId: z.string().optional().nullable(),
  planName: z.string().min(1, 'Plan name is required').trim(),
  priceLabel: z.string().min(1, 'Price label is required').trim(),
  priceNumeric: z.number().min(0).optional().nullable(),
  billingPeriod: z.enum(BILLING_PERIODS),
  inclusions: z.array(z.string()).optional().default([]),
  isPopular: z.boolean().optional().default(false),
  displayOrder: z.number().int().min(0),
  isActive: z.boolean().optional().default(true),
});

export const updatePricingSchema = createPricingSchema.partial();
