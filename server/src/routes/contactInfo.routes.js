import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateContactInfoSchema } from '../validators/contactInfo.validator.js';
import {
  getPublicContactInfo,
  updateContactInfo,
} from '../controllers/contactInfo.controller.js';

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────
router.get('/public/contact-info', getPublicContactInfo);

// ── Admin ──────────────────────────────────────────────────────────────────
router.put(
  '/admin/contact-info',
  authenticate,
  requireAuth,
  validate(updateContactInfoSchema),
  updateContactInfo
);

export default router;
