import { Router } from 'express';
import { authenticate, requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, updateUserSchema } from '../validators/user.validator.js';
import { listUsers, createUser, updateUser } from '../controllers/user.controller.js';

const router = Router();

// GET /api/v1/admin/users - List all staff accounts
router.get(
  '/admin/users',
  authenticate,
  requireAuth,
  requireAdmin,
  listUsers
);

// POST /api/v1/admin/users - Create a new staff account
router.post(
  '/admin/users',
  authenticate,
  requireAuth,
  requireAdmin,
  validate(createUserSchema),
  createUser
);

// PUT /api/v1/admin/users/:id - Update a staff account
router.put(
  '/admin/users/:id',
  authenticate,
  requireAuth,
  requireAdmin,
  validate(updateUserSchema),
  updateUser
);

export default router;
