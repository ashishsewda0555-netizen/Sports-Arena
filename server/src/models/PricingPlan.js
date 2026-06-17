import mongoose from 'mongoose';

const pricingPlanSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['coaching', 'casual-play', 'fitness-zone'],
    },
    sportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sport',
    },
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    priceLabel: {
      type: String,
      required: [true, 'Price label is required'],
      trim: true,
    },
    priceNumeric: {
      type: Number,
      min: 0,
    },
    billingPeriod: {
      type: String,
      required: true,
      enum: ['per-session', 'monthly', 'quarterly', 'one-time'],
    },
    inclusions: [{ type: String }],
    isPopular: {
      type: Boolean,
      default: false,
      required: true,
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

pricingPlanSchema.index({ category: 1, displayOrder: 1 });

export default mongoose.model('PricingPlan', pricingPlanSchema);
