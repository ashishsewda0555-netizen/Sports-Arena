import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateOperatingHoursSchema } from '../validators/operatingHours.validator.js';
import {
  getPublicOperatingHours,
  updateOperatingHours,
} from '../controllers/operatingHours.controller.js';

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────
router.get('/public/operating-hours', getPublicOperatingHours);

// ── Admin ──────────────────────────────────────────────────────────────────
router.put(
  '/admin/operating-hours',
  authenticate,
  requireAuth,
  validate(updateOperatingHoursSchema),
  updateOperatingHours
);

export default router;
