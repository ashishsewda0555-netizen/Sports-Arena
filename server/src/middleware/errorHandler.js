import ApiError from '../utils/ApiError.js';
import config from '../config/index.js';

/**
 * Global error handler middleware.
 * Catches ApiError, Mongoose validation errors, and unexpected errors.
 */
export function errorHandler(err, _req, res, _next) {
  // Already an ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details,
      },
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'unknown';
    return res.status(409).json({
      error: {
        code: 'CONFLICT',
        message: `Duplicate value for field: ${field}`,
        details: [],
      },
    });
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: `Invalid ${err.path}: ${err.value}`,
        details: [],
      },
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
        details: [],
      },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Token expired',
        details: [],
      },
    });
  }

  // Unexpected error
  if (config.nodeEnv === 'development') {
    console.error('❌ Unhandled Error:', err);
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message:
        config.nodeEnv === 'development'
          ? err.message
          : 'An unexpected error occurred',
      details: [],
    },
  });
}

/**
 * 404 Not Found handler for unmatched routes.
 */
export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}
