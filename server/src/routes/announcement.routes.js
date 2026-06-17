import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from '../validators/announcement.validator.js';
import {
  listActiveAnnouncements,
  listAdminAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcement.controller.js';

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────
router.get('/public/announcements/active', listActiveAnnouncements);

// ── Admin ──────────────────────────────────────────────────────────────────
router.get('/admin/announcements', authenticate, requireAuth, listAdminAnnouncements);
router.post(
  '/admin/announcements',
  authenticate,
  requireAuth,
  validate(createAnnouncementSchema),
  createAnnouncement
);
router.put(
  '/admin/announcements/:id',
  authenticate,
  requireAuth,
  validate(updateAnnouncementSchema),
  updateAnnouncement
);
router.delete(
  '/admin/announcements/:id',
  authenticate,
  requireAuth,
  deleteAnnouncement
);

export default router;
