import jwt from 'jsonwebtoken';
import config from '../config/index.js';

// ── Access Token ─────────────────────────────────────────────────────────────

/**
 * Sign a short-lived JWT access token.
 * @param {Object} payload - Data to embed in the token
 * @param {string} payload.userId - The user's ID
 * @param {string} payload.role   - The user's role (admin | editor)
 * @returns {string} Signed JWT
 */
export function signAccessToken({ userId, role }) {
  return jwt.sign(
    { userId, role, type: 'access' },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

/**
 * Verify and decode an access token.
 * @param {string} token - JWT to verify
 * @returns {Object} Decoded payload
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
export function verifyAccessToken(token) {
  const decoded = jwt.verify(token, config.jwtSecret);
  if (decoded.type !== 'access') {
    throw new jwt.JsonWebTokenError('Invalid token type');
  }
  return decoded;
}

// ── Cookie Options ───────────────────────────────────────────────────────────

/**
 * Get cookie options for the access token cookie.
 * @returns {Object} Cookie options
 */
export function getAccessCookieOptions() {
  const isProduction = config.nodeEnv === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
    maxAge: parseExpiresIn(config.jwtExpiresIn),
  };
}

/**
 * Get cookie options for the refresh token cookie.
 * @returns {Object} Cookie options
 */
export function getRefreshCookieOptions() {
  const isProduction = config.nodeEnv === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/api/v1/auth', // Only sent to auth endpoints
    maxAge: parseExpiresIn(config.refreshTokenExpiresIn),
  };
}

/**
 * Parse a time string like '7d', '15m', '2h' to milliseconds.
 * @param {string} expiresIn
 * @returns {number} Milliseconds
 */
function parseExpiresIn(expiresIn) {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // Default: 7 days

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default:  return 7 * 24 * 60 * 60 * 1000;
  }
}
