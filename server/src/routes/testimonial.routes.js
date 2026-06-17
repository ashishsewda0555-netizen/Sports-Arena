import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createTestimonialSchema,
  updateTestimonialSchema,
} from '../validators/testimonial.validator.js';
import { reorderSchema } from '../validators/reorder.validator.js';
import { testimonialsQuerySchema } from '../validators/publicQuery.validator.js';
import {
  listPublicTestimonials,
  listAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
} from '../controllers/testimonial.controller.js';

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────
router.get(
  '/public/testimonials',
  validate(testimonialsQuerySchema, 'query'),
  listPublicTestimonials
);

// ── Admin ──────────────────────────────────────────────────────────────────
router.get('/admin/testimonials', authenticate, requireAuth, listAdminTestimonials);
router.post(
  '/admin/testimonials',
  authenticate,
  requireAuth,
  validate(createTestimonialSchema),
  createTestimonial
);
router.put(
  '/admin/testimonials/:id',
  authenticate,
  requireAuth,
  validate(updateTestimonialSchema),
  updateTestimonial
);
router.delete(
  '/admin/testimonials/:id',
  authenticate,
  requireAuth,
  deleteTestimonial
);
router.patch(
  '/admin/testimonials/reorder',
  authenticate,
  requireAuth,
  validate(reorderSchema),
  reorderTestimonials
);

export default router;
