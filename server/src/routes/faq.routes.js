import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createFaqSchema, updateFaqSchema } from '../validators/faq.validator.js';
import { reorderSchema } from '../validators/reorder.validator.js';
import { faqsQuerySchema } from '../validators/publicQuery.validator.js';
import {
  listPublicFaqs,
  listAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  reorderFaqs,
} from '../controllers/faq.controller.js';

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────
router.get('/public/faqs', validate(faqsQuerySchema, 'query'), listPublicFaqs);

// ── Admin ──────────────────────────────────────────────────────────────────
router.get('/admin/faqs', authenticate, requireAuth, listAdminFaqs);
router.post(
  '/admin/faqs',
  authenticate,
  requireAuth,
  validate(createFaqSchema),
  createFaq
);
router.put(
  '/admin/faqs/:id',
  authenticate,
  requireAuth,
  validate(updateFaqSchema),
  updateFaq
);
router.delete('/admin/faqs/:id', authenticate, requireAuth, deleteFaq);
router.patch(
  '/admin/faqs/reorder',
  authenticate,
  requireAuth,
  validate(reorderSchema),
  reorderFaqs
);

export default router;
