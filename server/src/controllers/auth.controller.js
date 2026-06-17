import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import ApiError from '../utils/ApiError.js';
import {
  signAccessToken,
  getAccessCookieOptions,
  getRefreshCookieOptions,
} from '../utils/jwt.js';
import config from '../config/index.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Issue a new access token + refresh token pair.
 * Sets both as HTTP-only cookies on the response.
 *
 * @param {Object} res - Express response
 * @param {Object} user - User document
 * @param {Object} req - Express request (for metadata)
 * @param {string|null} family - Existing token family (for rotation), or null for new family
 * @returns {Promise<void>}
 */
async function issueTokenPair(res, user, req, family = null) {
  // 1. Sign short-lived access token (JWT)
  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  // 2. Generate opaque refresh token
  const refreshTokenValue = RefreshToken.generateToken();
  const tokenFamily = family || RefreshToken.generateFamily();

  const expiresAt = new Date(
    Date.now() + parseExpiresInMs(config.refreshTokenExpiresIn)
  );

  await RefreshToken.create({
    token: refreshTokenValue,
    userId: user._id,
    expiresAt,
    family: tokenFamily,
    userAgent: req.headers['user-agent'] || null,
    ipAddress:
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      null,
  });

  // 3. Set cookies
  res.cookie('token', accessToken, getAccessCookieOptions());
  res.cookie('refreshToken', refreshTokenValue, getRefreshCookieOptions());
}

/**
 * Parse a duration string (e.g., '30d') to milliseconds.
 * @param {string} str
 * @returns {number}
 */
function parseExpiresInMs(str) {
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) return 30 * 24 * 60 * 60 * 1000;
  const val = parseInt(match[1], 10);
  switch (match[2]) {
    case 's': return val * 1000;
    case 'm': return val * 60 * 1000;
    case 'h': return val * 60 * 60 * 1000;
    case 'd': return val * 24 * 60 * 60 * 1000;
    default:  return 30 * 24 * 60 * 60 * 1000;
  }
}

// ── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/login
 * Authenticate with email + password, issue access + refresh tokens via HTTP-only cookies.
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user with password hash included (it's excluded by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+passwordHash'
    );
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.unauthorized('Account is deactivated');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    // Issue access + refresh token pair
    await issueTokenPair(res, user, req);

    res.json({
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/logout
 * Clear auth cookies and revoke the current refresh token.
 */
export async function logout(req, res, next) {
  try {
    // Revoke the refresh token if present
    const refreshTokenValue = req.cookies?.refreshToken;
    if (refreshTokenValue) {
      const existingToken = await RefreshToken.findOne({
        token: refreshTokenValue,
      });
      if (existingToken) {
        existingToken.isRevoked = true;
        await existingToken.save();
      }
    }

    // Clear cookies
    res.cookie('token', '', { ...getAccessCookieOptions(), maxAge: 0 });
    res.cookie('refreshToken', '', { ...getRefreshCookieOptions(), maxAge: 0 });

    res.json({ data: { message: 'Logged out successfully' } });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/refresh
 * Rotate the refresh token — issue new access + refresh token pair.
 *
 * Implements refresh token rotation with family tracking:
 * - If a refresh token is reused (already replaced), the entire family is revoked
 *   to protect against token theft.
 * - Only valid, non-revoked, non-expired tokens are accepted.
 */
export async function refreshToken(req, res, next) {
  try {
    const refreshTokenValue = req.cookies?.refreshToken;

    if (!refreshTokenValue) {
      throw ApiError.unauthorized('Refresh token required');
    }

    const existingToken = await RefreshToken.findOne({
      token: refreshTokenValue,
    });

    // Token not found
    if (!existingToken) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    // Token already revoked — possible replay attack! Revoke entire family.
    if (existingToken.isRevoked) {
      await RefreshToken.revokeFamily(existingToken.family);
      // Clear cookies
      res.cookie('token', '', { ...getAccessCookieOptions(), maxAge: 0 });
      res.cookie('refreshToken', '', { ...getRefreshCookieOptions(), maxAge: 0 });
      throw ApiError.unauthorized(
        'Refresh token reuse detected. All sessions in this family have been revoked.'
      );
    }

    // Token expired
    if (existingToken.expiresAt < new Date()) {
      existingToken.isRevoked = true;
      await existingToken.save();
      throw ApiError.unauthorized('Refresh token expired');
    }

    // Look up the user
    const user = await User.findById(existingToken.userId);
    if (!user || !user.isActive) {
      existingToken.isRevoked = true;
      await existingToken.save();
      throw ApiError.unauthorized('User not found or account deactivated');
    }

    // Rotate: mark old token as revoked and issue new pair in the same family
    existingToken.isRevoked = true;
    existingToken.replacedByToken = 'pending'; // Will be updated by issueTokenPair
    await existingToken.save();

    await issueTokenPair(res, user, req, existingToken.family);

    res.json({
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/auth/me
 * Returns current authenticated user's profile.
 */
export async function getMe(req, res) {
  res.json({
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    },
  });
}

/**
 * POST /api/v1/auth/change-password
 * Change the authenticated user's password. Requires current password.
 */
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    // Fetch user with passwordHash
    const user = await User.findById(req.user._id).select('+passwordHash');
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    // Hash and save new password
    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();

    // Revoke all existing refresh tokens (force re-login on other devices)
    await RefreshToken.revokeAllForUser(user._id);

    // Issue a fresh token pair so this session stays active
    await issueTokenPair(res, user, req);

    res.json({ data: { message: 'Password changed successfully' } });
  } catch (error) {
    next(error);
  }
}
