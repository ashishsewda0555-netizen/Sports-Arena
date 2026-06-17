import config from '../config/index.js';

/**
 * Structured request logging middleware.
 * Logs request/response details in a structured JSON format for production
 * and a human-readable format for development.
 *
 * Replaces morgan for more control over what's logged.
 */

/**
 * Colorize text for terminal output (development mode only).
 * @param {string} text
 * @param {string} color
 * @returns {string}
 */
function colorize(text, color) {
  const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
  };
  return `${colors[color] || ''}${text}${colors.reset}`;
}

/**
 * Get color based on HTTP status code.
 * @param {number} statusCode
 * @returns {string}
 */
function getStatusColor(statusCode) {
  if (statusCode >= 500) return 'red';
  if (statusCode >= 400) return 'yellow';
  if (statusCode >= 300) return 'cyan';
  return 'green';
}

/**
 * Express middleware for structured request logging.
 * Skips logging in test environment.
 */
export function requestLogger(req, res, next) {
  if (config.nodeEnv === 'test') return next();

  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] || generateRequestId();

  // Attach request ID to request and response for correlation
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  // Capture the original end method to log after response is sent
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - startTime;
    const logData = buildLogData(req, res, duration, requestId);

    if (config.nodeEnv === 'development') {
      logDevelopment(logData);
    } else {
      logProduction(logData);
    }

    originalEnd.apply(res, args);
  };

  next();
}

/**
 * Build structured log data from request/response.
 * @param {Object} req
 * @param {Object} res
 * @param {number} duration
 * @param {string} requestId
 * @returns {Object}
 */
function buildLogData(req, res, duration, requestId) {
  return {
    requestId,
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    durationMs: duration,
    ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
    userId: req.user?._id || null,
    contentLength: res.getHeader('content-length') || 0,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Log in human-readable format for development.
 * @param {Object} data
 */
function logDevelopment(data) {
  const statusColor = getStatusColor(data.statusCode);
  const methodPad = data.method.padEnd(7);

  const line = [
    colorize(methodPad, 'bold'),
    data.url.padEnd(50),
    colorize(String(data.statusCode), statusColor),
    colorize(data.duration.padStart(8), 'gray'),
    data.userId ? colorize(`user:${data.userId}`, 'cyan') : '',
  ]
    .filter(Boolean)
    .join(' ');

  console.log(line);

  // Log slow requests as warnings
  if (data.durationMs > 1000) {
    console.warn(
      colorize(`⚠️  Slow request: ${data.method} ${data.url} took ${data.duration}`, 'yellow')
    );
  }
}

/**
 * Log in structured JSON format for production (machine-parseable).
 * @param {Object} data
 */
function logProduction(data) {
  const logEntry = {
    level: data.statusCode >= 500 ? 'error' : data.statusCode >= 400 ? 'warn' : 'info',
    ...data,
  };

  // Use stdout for structured logging (compatible with log aggregators)
  process.stdout.write(JSON.stringify(logEntry) + '\n');
}

/**
 * Generate a simple request ID.
 * @returns {string}
 */
function generateRequestId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}
