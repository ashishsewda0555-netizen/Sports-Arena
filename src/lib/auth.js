import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db/connect';
import User from '@/lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Sign a JWT token for a user.
 */
export function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token.
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Get the current authenticated user from the request cookies.
 * Returns { user, error } — user is null if unauthenticated.
 */
export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return { user: null, error: 'Not authenticated' };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return { user: null, error: 'Invalid or expired token' };
  }

  await connectDB();
  const user = await User.findById(decoded.userId)
    .select('-passwordHash')
    .lean();

  if (!user || !user.isActive) {
    return { user: null, error: 'User not found or deactivated' };
  }

  return { user: { ...user, _id: user._id.toString() }, error: null };
}

/**
 * Middleware wrapper: require authentication.
 * Returns a JSON error response if not authenticated.
 */
export async function requireAuth() {
  const { user, error } = await getAuthUser();
  if (!user) {
    return {
      authorized: false,
      user: null,
      response: Response.json(
        { error: { code: 'UNAUTHORIZED', message: error } },
        { status: 401 }
      ),
    };
  }
  return { authorized: true, user, response: null };
}

/**
 * Middleware wrapper: require admin role.
 */
export async function requireAdmin() {
  const auth = await requireAuth();
  if (!auth.authorized) return auth;

  if (auth.user.role !== 'admin') {
    return {
      authorized: false,
      user: auth.user,
      response: Response.json(
        { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      ),
    };
  }
  return auth;
}

/**
 * Set auth cookie on the response.
 */
export function setAuthCookie(token) {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    name: 'token',
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  };
}

/**
 * Clear auth cookie.
 */
export function clearAuthCookie() {
  return {
    name: 'token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  };
}
