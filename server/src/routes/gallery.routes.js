import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateGallerySchema } from '../validators/gallery.validator.js';
import { reorderSchema } from '../validators/reorder.validator.js';
import { galleryQuerySchema } from '../validators/publicQuery.validator.js';
import {
  listPublicGallery,
  listFeaturedGallery,
  listAdminGallery,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGallery,
} from '../controllers/gallery.controller.js';
import multer from 'multer';

// Configure multer for memory storage (buffer-based upload to Cloudinary)
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
router.get('/public/gallery', validate(galleryQuerySchema, 'query'), listPublicGallery);
router.get('/public/gallery/featured', listFeaturedGallery);

// ── Admin ──────────────────────────────────────────────────────────────────
router.get('/admin/gallery', authenticate, requireAuth, listAdminGallery);
router.post(
  '/admin/gallery',
  authenticate,
  requireAuth,
  upload.single('image'),
  createGalleryImage
);
router.put(
  '/admin/gallery/:id',
  authenticate,
  requireAuth,
  validate(updateGallerySchema),
  updateGalleryImage
);
router.delete('/admin/gallery/:id', authenticate, requireAuth, deleteGalleryImage);
router.patch(
  '/admin/gallery/reorder',
  authenticate,
  requireAuth,
  validate(reorderSchema),
  reorderGallery
);

export default router;
