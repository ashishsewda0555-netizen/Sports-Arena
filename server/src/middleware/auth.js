import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Extract and verify JWT access token from cookies, attach user to req.
 * Does NOT reject unauthenticated requests — use requireAuth for that.
 */
export async function authenticate(req, _res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId)
      .select('-passwordHash')
      .lean();

    if (!user || !user.isActive) {
      req.user = null;
      return next();
    }

    req.user = { ...user, _id: user._id.toString() };
    next();
  } catch {
    // Invalid/expired token — treat as unauthenticated
    req.user = null;
    next();
  }
}

/**
 * Require authentication — returns 401 if no valid user.
 */
export function requireAuth(req, _res, next) {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }
  next();
}

/**
 * Require admin role — returns 403 if user is not admin.
 * Must be used AFTER requireAuth.
 */
export function requireAdmin(req, _res, next) {
  if (req.user.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required'));
  }
  next();
}

/**
 * Require one of the specified roles — returns 403 if user's role is not included.
 * Must be used AFTER requireAuth.
 *
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'editor')
 * @returns {Function} Express middleware
 *
 * @example
 *   router.get('/admin/data', authenticate, requireAuth, requireRole('admin', 'editor'), handler);
 */
export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required role(s): ${roles.join(', ')}`
        )
      );
    }
    next();
  };
}
