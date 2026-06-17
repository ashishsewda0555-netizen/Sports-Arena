import mongoose from 'mongoose';

/**
 * FacilitiesContent — Singleton document for the Facilities page.
 * Resolves the gap: PRD FR-701/702/703 requires editable facility
 * content but no collection was defined.
 */
const facilitySectionSchema = new mongoose.Schema(
  {
    heading: { type: String, trim: true },
    content: { type: String }, // Rich text / HTML
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GalleryImage',
    },
    features: [{ type: String }], // Bullet point specs
    displayOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const facilitiesContentSchema = new mongoose.Schema(
  {
    introHeading: {
      type: String,
      default: 'Our Facilities',
      trim: true,
    },
    introContent: {
      type: String,
      default: '',
    },
    sections: [facilitySectionSchema],
    // Safety & Hygiene (dedicated subsection)
    safetyHeading: {
      type: String,
      default: 'Safety & Hygiene',
      trim: true,
    },
    safetyContent: {
      type: String,
      default: '',
    },
    safetyImageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GalleryImage',
    },
    safetyFeatures: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.FacilitiesContent ||
  mongoose.model('FacilitiesContent', facilitiesContentSchema);
