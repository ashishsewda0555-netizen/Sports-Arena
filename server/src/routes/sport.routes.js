import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateSportSchema } from '../validators/sport.validator.js';
import {
  listPublicSports,
  getPublicSportBySlug,
  listAdminSports,
  updateSport,
} from '../controllers/sport.controller.js';

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────
router.get('/public/sports', listPublicSports);
router.get('/public/sports/:slug', getPublicSportBySlug);

// ── Admin ──────────────────────────────────────────────────────────────────
router.get('/admin/sports', authenticate, requireAuth, listAdminSports);
router.put(
  '/admin/sports/:id',
  authenticate,
  requireAuth,
  validate(updateSportSchema),
  updateSport
);

export default router;
