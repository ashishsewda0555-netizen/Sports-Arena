import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { rateLimit } from '../middleware/rateLimiter.js';
import { createLeadSchema, updateLeadStatusSchema } from '../validators/lead.validator.js';
import {
  submitContactForm,
  listAdminLeads,
  getAdminLead,
  updateLeadStatus,
  deleteLead,
} from '../controllers/lead.controller.js';

const router = Router();

// ── Public (rate-limited) ──────────────────────────────────────────────────
router.post(
  '/public/contact',
  rateLimit({ interval: 600000, limit: 5 }),
  validate(createLeadSchema),
  submitContactForm
);

// ── Admin ──────────────────────────────────────────────────────────────────
router.get('/admin/leads', authenticate, requireAuth, listAdminLeads);
router.get('/admin/leads/:id', authenticate, requireAuth, getAdminLead);
router.patch(
  '/admin/leads/:id',
  authenticate,
  requireAuth,
  validate(updateLeadStatusSchema),
  updateLeadStatus
);
router.delete('/admin/leads/:id', authenticate, requireAuth, deleteLead);

export default router;
