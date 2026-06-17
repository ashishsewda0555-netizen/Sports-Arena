import { z } from 'zod';

export const createTestimonialSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required').trim(),
  role: z.string().trim().optional(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  quote: z.string().min(1, 'Testimonial text is required'),
  photoId: z.string().optional().nullable(),
  relatedSportId: z.string().optional().nullable(),
  displayOrder: z.number().int().min(0),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();
