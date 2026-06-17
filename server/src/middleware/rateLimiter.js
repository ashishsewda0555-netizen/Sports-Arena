import ApiError from '../utils/ApiError.js';

const rateLimitMap = new Map();

/**
 * Create an IP-based rate limiter middleware.
 * @param {Object} options
 * @param {number} options.interval - Time window in milliseconds (default 600000 = 10 min)
 * @param {number} options.limit - Max requests per interval (default 5)
 */
export function rateLimit({ interval = 600000, limit = 5 } = {}) {
  return (req, _res, next) => {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now - record.start > interval) {
      rateLimitMap.set(ip, { start: now, count: 1 });
      return next();
    }

    if (record.count >= limit) {
      return next(
        ApiError.tooManyRequests(
          `Rate limit exceeded. Try again in ${Math.ceil((record.start + interval - now) / 1000)} seconds.`
        )
      );
    }

    record.count++;
    next();
  };
}

// Clean up old entries every 10 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap) {
    if (now - record.start > 3600000) {
      rateLimitMap.delete(key);
    }
  }
}, 600000);
