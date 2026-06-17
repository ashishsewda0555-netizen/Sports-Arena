import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    altText: {
      type: String,
      required: [true, 'Alt text is required for accessibility and SEO'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'courts',
        'coaching',
        'tournaments',
        'facilities',
        'fitness-area',
        'happy-customers',
        'arena-infrastructure',
      ],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    relatedEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    displayOrder: {
      type: Number,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

galleryImageSchema.index({ category: 1, displayOrder: 1 });
galleryImageSchema.index({ isFeatured: 1 });
galleryImageSchema.index({ relatedEventId: 1 });

export default mongoose.model('GalleryImage', galleryImageSchema);
