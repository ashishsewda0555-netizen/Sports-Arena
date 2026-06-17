import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateSocialLinksSchema } from '../validators/socialLinks.validator.js';
import {
  getPublicSocialLinks,
  updateSocialLinks,
} from '../controllers/socialLinks.controller.js';

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────
router.get('/public/social-links', getPublicSocialLinks);

// ── Admin ──────────────────────────────────────────────────────────────────
router.put(
  '/admin/social-links',
  authenticate,
  requireAuth,
  validate(updateSocialLinksSchema),
  updateSocialLinks
);

export default router;
