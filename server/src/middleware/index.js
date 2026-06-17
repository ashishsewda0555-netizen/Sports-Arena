/**
 * Middleware barrel export.
 * Provides a single import point for all middleware modules.
 */

// Authentication & Authorization
export { authenticate, requireAuth, requireAdmin, requireRole } from './auth.js';

// Request Validation
export { validate } from './validate.js';

// Input Sanitization
export { sanitizeInput } from './sanitize.js';

// Rate Limiting
export { rateLimit } from './rateLimiter.js';

// Request Logging
export { requestLogger } from './requestLogger.js';

// Security (Helmet, CORS)
export { securityHeaders, corsConfig } from './security.js';

// Error Handling
export { errorHandler, notFound } from './errorHandler.js';
