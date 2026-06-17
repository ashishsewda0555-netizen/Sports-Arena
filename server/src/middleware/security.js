import helmet from 'helmet';
import cors from 'cors';
import config from '../config/index.js';

/**
 * Hardened Helmet configuration for security headers.
 * Customized for the Sports Arena API server.
 */
export function securityHeaders() {
  return helmet({
    // Content Security Policy — restrict resource loading
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", 'https://www.youtube.com', 'https://player.vimeo.com'],
        frameSrc: ["'self'", 'https://www.youtube.com', 'https://player.vimeo.com', 'https://www.google.com/maps'],
        frameAncestors: ["'self'"],
        formAction: ["'self'"],
        baseUri: ["'self'"],
        upgradeInsecureRequests: config.nodeEnv === 'production' ? [] : null,
      },
    },

    // Strict-Transport-Security — force HTTPS
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },

    // X-Content-Type-Options: nosniff
    noSniff: true,

    // Referrer-Policy
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },

    // X-Frame-Options — prevent clickjacking
    frameguard: {
      action: 'deny',
    },

    // X-XSS-Protection (legacy, but good to have)
    xssFilter: true,

    // Don't expose that we're using Express
    hidePoweredBy: true,

    // X-Permitted-Cross-Domain-Policies
    permittedCrossDomainPolicies: {
      permittedPolicies: 'none',
    },

    // X-DNS-Prefetch-Control
    dnsPrefetchControl: {
      allow: false,
    },

    // Expect-CT (Certificate Transparency)
    // Note: This is deprecated in modern browsers, but keeps older ones safe
  });
}

/**
 * Hardened CORS configuration.
 * In production, only allows the configured origin.
 * In development, allows localhost variants.
 */
export function corsConfig() {
  const allowedOrigins = config.nodeEnv === 'production'
    ? [config.corsOrigin]
    : [
        config.corsOrigin,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
      ];

  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS policy: Origin '${origin}' is not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-Id',
      'X-Requested-With',
    ],
    exposedHeaders: ['X-Request-Id', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 86400, // 24 hours — browsers cache preflight results
    optionsSuccessStatus: 204,
  });
}
