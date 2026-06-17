import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    quote: {
      type: String,
      required: [true, 'Testimonial text is required'],
    },
    photoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GalleryImage',
    },
    relatedSportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sport',
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
  },
  {
    timestamps: true,
  }
);

testimonialSchema.index({ isFeatured: 1 });
testimonialSchema.index({ displayOrder: 1 });

export default mongoose.model('Testimonial', testimonialSchema);
