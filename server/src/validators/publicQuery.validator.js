import { z } from 'zod';
import {
  GALLERY_CATEGORIES,
  PRICING_CATEGORIES,
  FAQ_CATEGORIES,
  EVENT_STATUSES,
  VIDEO_PLACEMENTS,
} from '../utils/constants.js';

// ── Shared pagination params ─────────────────────────────────────────────────
const paginationParams = {
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
};

// ── Gallery query ────────────────────────────────────────────────────────────
export const galleryQuerySchema = z.object({
  ...paginationParams,
  category: z.enum(GALLERY_CATEGORIES).optional(),
});

// ── Pricing query ────────────────────────────────────────────────────────────
export const pricingQuerySchema = z.object({
  category: z.enum(PRICING_CATEGORIES).optional(),
});

// ── Testimonials query ───────────────────────────────────────────────────────
export const testimonialsQuerySchema = z.object({
  featured: z.enum(['true', 'false']).optional(),
  sportId: z.string().min(1).optional(),
});

// ── FAQs query ───────────────────────────────────────────────────────────────
export const faqsQuerySchema = z.object({
  category: z.enum(FAQ_CATEGORIES).optional(),
  featured: z.enum(['true', 'false']).optional(),
});

// ── Events query ─────────────────────────────────────────────────────────────
export const eventsQuerySchema = z.object({
  ...paginationParams,
  status: z.enum(EVENT_STATUSES).optional(),
});

// ── Videos query ─────────────────────────────────────────────────────────────
export const videosQuerySchema = z.object({
  placement: z.enum(VIDEO_PLACEMENTS).optional(),
});
