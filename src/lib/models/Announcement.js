import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Announcement message is required'],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['info', 'warning'],
      default: 'info',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: 'End date must be on or after the start date',
      },
    },
    linkUrl: {
      type: String,
      trim: true,
    },
    linkLabel: {
      type: String,
      trim: true,
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

announcementSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.models.Announcement ||
  mongoose.model('Announcement', announcementSchema);
