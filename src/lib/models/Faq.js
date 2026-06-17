import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        'general',
        'coaching',
        'facilities',
        'pricing',
        'equipment',
        'events',
        'timings',
        'fitness-area',
        'visitors',
        'parents',
      ],
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
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

faqSchema.index({ category: 1, displayOrder: 1 });
faqSchema.index({ isFeatured: 1 });

export default mongoose.models.Faq || mongoose.model('Faq', faqSchema);
