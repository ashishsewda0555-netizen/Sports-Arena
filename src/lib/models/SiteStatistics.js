import mongoose from 'mongoose';

/**
 * SiteStatistics — Singleton document for animated counters.
 * Resolves the gap identified in the analysis: PRD FR-108 requires
 * admin-editable statistics but no collection was defined in the original schema.
 */
const siteStatisticsSchema = new mongoose.Schema(
  {
    yearsOfExperience: {
      type: Number,
      default: 0,
      required: true,
    },
    studentsTrained: {
      type: Number,
      default: 0,
      required: true,
    },
    tournamentsHosted: {
      type: Number,
      default: 0,
      required: true,
    },
    coachesOnStaff: {
      type: Number,
      default: 0,
      required: true,
    },
    courtsAndTables: {
      type: Number,
      default: 0,
    },
    // Labels (admin-customizable)
    yearsLabel: {
      type: String,
      default: 'Years of Experience',
      trim: true,
    },
    studentsLabel: {
      type: String,
      default: 'Students Trained',
      trim: true,
    },
    tournamentsLabel: {
      type: String,
      default: 'Tournaments Hosted',
      trim: true,
    },
    coachesLabel: {
      type: String,
      default: 'Expert Coaches',
      trim: true,
    },
    courtsLabel: {
      type: String,
      default: 'Courts & Tables',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SiteStatistics ||
  mongoose.model('SiteStatistics', siteStatisticsSchema);
