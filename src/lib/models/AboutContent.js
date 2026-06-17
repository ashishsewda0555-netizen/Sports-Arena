import mongoose from 'mongoose';

/**
 * AboutContent — Singleton document for the About page.
 * Resolves the gap: PRD FR-201/202/203 requires editable content
 * but no collection was defined.
 */
const aboutContentSchema = new mongoose.Schema(
  {
    // Our Story section
    storyHeading: {
      type: String,
      default: 'Our Story',
      trim: true,
    },
    storyContent: {
      type: String, // Rich text / HTML
      default: '',
    },
    storyImageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GalleryImage',
    },

    // Mission & Vision section
    missionHeading: {
      type: String,
      default: 'Our Mission',
      trim: true,
    },
    missionContent: {
      type: String,
      default: '',
    },
    visionHeading: {
      type: String,
      default: 'Our Vision',
      trim: true,
    },
    visionContent: {
      type: String,
      default: '',
    },

    // Infrastructure Overview
    infrastructureHeading: {
      type: String,
      default: 'Infrastructure Overview',
      trim: true,
    },
    infrastructureItems: [
      {
        icon: { type: String }, // icon key
        title: { type: String },
        value: { type: String }, // e.g., "15,000 sq ft"
        description: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AboutContent ||
  mongoose.model('AboutContent', aboutContentSchema);
