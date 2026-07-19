import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,

  // ── JWT / Auth ──────────────────────────────────────────────────────────
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',              // Short-lived access token
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d', // Long-lived refresh token

  // ── CORS ────────────────────────────────────────────────────────────────
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // ── Cloudinary ──────────────────────────────────────────────────────────
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  // ── Email ───────────────────────────────────────────────────────────────
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  notificationEmail: process.env.NOTIFICATION_EMAIL,

  // ── Site ─────────────────────────────────────────────────────────────────
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  brandName: process.env.BRAND_NAME || 'Sports Arena',

  // ── Admin Seed ──────────────────────────────────────────────────────────
  admin: {
    name: process.env.ADMIN_NAME || 'Admin User',
    email: process.env.ADMIN_EMAIL || 'admin@academy.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
  },
};

// Validate required env vars
const required = ['mongodbUri', 'jwtSecret'];
for (const key of required) {
  if (!config[key]) {
    throw new Error(`Missing required environment variable: ${key.toUpperCase()}`);
  }
}

// Warn about optional but important env vars
if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
  console.warn(
    '\n⚠️  WARNING: Cloudinary credentials are not configured.\n' +
    '   Image uploads will fail until you set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env\n' +
    '   Sign up for free at https://cloudinary.com\n'
  );
}

export default config;
