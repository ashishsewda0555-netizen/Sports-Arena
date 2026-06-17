import mongoose from 'mongoose';

const dayScheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    openTime: {
      type: String, // "HH:mm" 24h format
      default: '06:00',
    },
    closeTime: {
      type: String, // "HH:mm" 24h format
      default: '22:00',
    },
  },
  { _id: false }
);

const operatingHoursSchema = new mongoose.Schema(
  {
    schedule: {
      type: [dayScheduleSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v.length === 7;
        },
        message: 'Schedule must contain exactly 7 days',
      },
    },
    specialNotes: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.OperatingHours ||
  mongoose.model('OperatingHours', operatingHoursSchema);
