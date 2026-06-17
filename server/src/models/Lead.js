import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    sportOfInterest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sport',
    },
    message: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['contact-form', 'popup'],
      default: 'contact-form',
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
      required: true,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ sportOfInterest: 1 });

export default mongoose.model('Lead', leadSchema);
