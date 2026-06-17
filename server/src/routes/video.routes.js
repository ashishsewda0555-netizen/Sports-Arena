import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createVideoSchema, updateVideoSchema } from '../validators/video.validator.js';
import { videosQuerySchema } from '../validators/publicQuery.validator.js';
import {
  listPublicVideos,
  listAdminVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/video.controller.js';

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────
router.get('/public/videos', validate(videosQuerySchema, 'query'), listPublicVideos);

// ── Admin ──────────────────────────────────────────────────────────────────
router.get('/admin/videos', authenticate, requireAuth, listAdminVideos);
router.post(
  '/admin/videos',
  authenticate,
  requireAuth,
  validate(createVideoSchema),
  createVideo
);
router.put(
  '/admin/videos/:id',
  authenticate,
  requireAuth,
  validate(updateVideoSchema),
  updateVideo
);
router.delete('/admin/videos/:id', authenticate, requireAuth, deleteVideo);

export default router;
