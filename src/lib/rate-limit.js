/**
 * Simple in-memory rate limiter for API routes.
 * For production, consider using Redis-based limiting.
 *
 * Usage in an API route:
 *   import { rateLimit } from '@/lib/rate-limit';
 *   const limiter = rateLimit({ interval: 600000, limit: 5 }); // 5 per 10 min
 *
 *   export async function POST(request) {
 *     const ip = request.headers.get('x-forwarded-for') || 'unknown';
 *     const { success } = limiter.check(ip);
 *     if (!success) return Response.json({ error: ... }, { status: 429 });
 *   }
 */

const rateLimitMap = new Map();

export function rateLimit({ interval = 600000, limit = 5 } = {}) {
  return {
    check(key) {
      const now = Date.now();
      const record = rateLimitMap.get(key);

      if (!record || now - record.start > interval) {
        rateLimitMap.set(key, { start: now, count: 1 });
        return { success: true, remaining: limit - 1 };
      }

      if (record.count >= limit) {
        return { success: false, remaining: 0 };
      }

      record.count++;
      return { success: true, remaining: limit - record.count };
    },
  };
}

// Clean up old entries periodically (prevents memory leak in long-running processes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap) {
      if (now - record.start > 3600000) {
        // Clean entries older than 1 hour
        rateLimitMap.delete(key);
      }
    }
  }, 600000); // Every 10 minutes
}
