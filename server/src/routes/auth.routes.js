import { Router } from 'express';
import { authenticate, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, changePasswordSchema } from '../validators/auth.validator.js';
import {
  login,
  logout,
  getMe,
  changePassword,
  refreshToken,
} from '../controllers/auth.controller.js';

const router = Router();

// POST /api/v1/auth/login — Authenticate and receive tokens
router.post('/login', validate(loginSchema), login);

// POST /api/v1/auth/logout — Clear tokens (requires auth)
router.post('/logout', authenticate, requireAuth, logout);

// POST /api/v1/auth/refresh — Rotate refresh token (no auth middleware — uses cookie directly)
router.post('/refresh', refreshToken);

// GET /api/v1/auth/me — Get current user profile (requires auth)
router.get('/me', authenticate, requireAuth, getMe);

// POST /api/v1/auth/change-password — Change password (requires auth)
router.post(
  '/change-password',
  authenticate,
  requireAuth,
  validate(changePasswordSchema),
  changePassword
);

export default router;
