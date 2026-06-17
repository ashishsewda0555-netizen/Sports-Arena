import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPricingSchema, updatePricingSchema } from '../validators/pricing.validator.js';
import { reorderSchema } from '../validators/reorder.validator.js';
import { pricingQuerySchema } from '../validators/publicQuery.validator.js';
import {
  listPublicPricing,
  listAdminPricing,
  createPricing,
  updatePricing,
  deletePricing,
  reorderPricing,
} from '../controllers/pricing.controller.js';

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────
router.get('/public/pricing', validate(pricingQuerySchema, 'query'), listPublicPricing);

// ── Admin ──────────────────────────────────────────────────────────────────
router.get('/admin/pricing', authenticate, requireAuth, listAdminPricing);
router.post(
  '/admin/pricing',
  authenticate,
  requireAuth,
  validate(createPricingSchema),
  createPricing
);
router.put(
  '/admin/pricing/:id',
  authenticate,
  requireAuth,
  validate(updatePricingSchema),
  updatePricing
);
router.delete('/admin/pricing/:id', authenticate, requireAuth, deletePricing);
router.patch(
  '/admin/pricing/reorder',
  authenticate,
  requireAuth,
  validate(reorderSchema),
  reorderPricing
);

export default router;
