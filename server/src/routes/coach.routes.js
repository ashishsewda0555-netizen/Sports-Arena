import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCoachSchema, updateCoachSchema } from '../validators/coach.validator.js';
import { reorderSchema } from '../validators/reorder.validator.js';
import {
  listPublicCoaches,
  getPublicCoach,
  listAdminCoaches,
  createCoach,
  updateCoach,
  deleteCoach,
  reorderCoaches,
} from '../controllers/coach.controller.js';

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
router.get('/public/coaches', listPublicCoaches);
router.get('/public/coaches/:id', getPublicCoach);

// ── Admin ──────────────────────────────────────────────────────────────────
router.get('/admin/coaches', authenticate, requireAuth, listAdminCoaches);
router.post(
  '/admin/coaches',
  authenticate,
  requireAuth,
  upload.single('image'),
  validate(createCoachSchema),
  createCoach
);
router.put(
  '/admin/coaches/:id',
  authenticate,
  requireAuth,
  upload.single('image'),
  validate(updateCoachSchema),
  updateCoach
);
router.delete('/admin/coaches/:id', authenticate, requireAuth, deleteCoach);
router.patch(
  '/admin/coaches/reorder',
  authenticate,
  requireAuth,
  validate(reorderSchema),
  reorderCoaches
);

export default router;
