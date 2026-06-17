import mongoose from 'mongoose';

const sportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sport name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['racquet', 'indoor-table', 'mind-sport', 'fitness'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
    },
    longDescription: {
      type: String,
      required: [true, 'Long description is required'],
    },
    keyFeatures: [{ type: String }],
    benefits: [{ type: String }],
    iconKey: {
      type: String,
      required: true,
    },
    featuredImageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GalleryImage',
    },
    galleryImageIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GalleryImage',
      },
    ],
    ctaType: {
      type: String,
      required: true,
      enum: ['coaching-enquiry', 'casual-play', 'fitness-enquiry'],
    },
    displayOrder: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

sportSchema.index({ slug: 1 }, { unique: true });
sportSchema.index({ displayOrder: 1 });

export default mongoose.models.Sport || mongoose.model('Sport', sportSchema);
