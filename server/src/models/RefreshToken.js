import mongoose from 'mongoose';
import crypto from 'crypto';

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index — MongoDB auto-deletes expired docs
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    family: {
      type: String,
      required: true,
      index: true,
    },
    replacedByToken: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ── Compound index for fast lookup ───────────────────────────────────────────
refreshTokenSchema.index({ userId: 1, isRevoked: 1 });

// ── Static Methods ───────────────────────────────────────────────────────────

/**
 * Generate a cryptographically secure random token.
 * @returns {string}
 */
refreshTokenSchema.statics.generateToken = function () {
  return crypto.randomBytes(40).toString('hex');
};

/**
 * Generate a unique family identifier for token rotation tracking.
 * @returns {string}
 */
refreshTokenSchema.statics.generateFamily = function () {
  return crypto.randomBytes(20).toString('hex');
};

/**
 * Revoke all tokens in a family (used when refresh token reuse is detected).
 * @param {string} family - The token family identifier
 * @returns {Promise<void>}
 */
refreshTokenSchema.statics.revokeFamily = async function (family) {
  await this.updateMany({ family }, { isRevoked: true });
};

/**
 * Revoke all tokens belonging to a user (used on logout-all or account compromise).
 * @param {string} userId
 * @returns {Promise<void>}
 */
refreshTokenSchema.statics.revokeAllForUser = async function (userId) {
  await this.updateMany({ userId }, { isRevoked: true });
};

/**
 * Clean up expired and revoked tokens older than 30 days.
 * Can be called periodically to reduce collection size.
 * @returns {Promise<number>} Number of deleted documents
 */
refreshTokenSchema.statics.cleanup = async function () {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const result = await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isRevoked: true, updatedAt: { $lt: thirtyDaysAgo } },
    ],
  });
  return result.deletedCount;
};

export default mongoose.model('RefreshToken', refreshTokenSchema);
