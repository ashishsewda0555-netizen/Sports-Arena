import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createEventSchema, updateEventSchema } from '../validators/event.validator.js';
import { eventsQuerySchema } from '../validators/publicQuery.validator.js';
import {
  listPublicEvents,
  getPublicEvent,
  listAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  archiveEvent,
} from '../controllers/event.controller.js';

import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: JPEG, PNG, WebP'), false);
    }
  },
});

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────
router.get('/public/events', validate(eventsQuerySchema, 'query'), listPublicEvents);
router.get('/public/events/:id', getPublicEvent);

// ── Admin ──────────────────────────────────────────────────────────────────
router.get('/admin/events', authenticate, requireAuth, listAdminEvents);
router.post(
  '/admin/events',
  authenticate,
  requireAuth,
  upload.single('image'),
  validate(createEventSchema),
  createEvent
);
router.put(
  '/admin/events/:id',
  authenticate,
  requireAuth,
  upload.single('image'),
  validate(updateEventSchema),
  updateEvent
);
router.delete('/admin/events/:id', authenticate, requireAuth, deleteEvent);
router.patch(
  '/admin/events/:id/archive',
  authenticate,
  requireAuth,
  archiveEvent
);

export default router;
