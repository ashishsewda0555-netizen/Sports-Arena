import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value >= this.eventDate;
        },
        message: 'End date must be on or after the event date',
      },
    },
    coverImageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GalleryImage',
    },
    status: {
      type: String,
      required: true,
      enum: ['upcoming', 'past'],
      default: 'upcoming',
    },
    relatedSportIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport',
      },
    ],
    displayOrder: {
      type: Number,
      required: [true, 'Display order is required'],
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

eventSchema.index({ status: 1, eventDate: 1 });
eventSchema.index({ relatedSportIds: 1 });

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
