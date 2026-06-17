import express from 'express';
import cookieParser from 'cookie-parser';
import config from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { securityHeaders, corsConfig } from './middleware/security.js';
import { requestLogger } from './middleware/requestLogger.js';
import { sanitizeInput } from './middleware/sanitize.js';

const app = express();

// ── Security headers (Helmet — hardened CSP, HSTS, etc.) ───────────────────
app.use(securityHeaders());

// ── CORS (origin validation, credentials, exposed headers) ─────────────────
app.use(corsConfig());

// ── Request logging (structured dev/prod logging) ──────────────────────────
app.use(requestLogger);

// ── Body parsers ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Input sanitization (XSS protection on body/query/params) ───────────────
app.use(sanitizeInput);

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API routes ─────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ── 404 handler ────────────────────────────────────────────────────────────
app.use(notFound);

// ── Global error handler ───────────────────────────────────────────────────
app.use(errorHandler);

export default app;
