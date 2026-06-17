import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema(
  {
    facilityName: {
      type: String,
      required: [true, 'Facility name is required'],
      trim: true,
    },
    addressLine1: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      default: 'India',
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    phonePrimary: {
      type: String,
      required: [true, 'Primary phone is required'],
      trim: true,
    },
    phoneSecondary: {
      type: String,
      trim: true,
    },
    whatsappNumber: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true,
    },
    mapEmbedUrl: {
      type: String,
      trim: true,
    },
    notificationEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ContactInfo ||
  mongoose.model('ContactInfo', contactInfoSchema);
