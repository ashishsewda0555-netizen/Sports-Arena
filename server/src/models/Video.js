import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    embedUrl: {
      type: String,
      required: [true, 'Embed URL is required'],
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    placement: {
      type: String,
      required: true,
      enum: ['homepage-arena-tour', 'gallery', 'general'],
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

videoSchema.index({ placement: 1 });

export default mongoose.model('Video', videoSchema);
