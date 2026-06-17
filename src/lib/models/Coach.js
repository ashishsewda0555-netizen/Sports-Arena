import mongoose from 'mongoose';

const coachSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Coach name is required'],
      trim: true,
    },
    photoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GalleryImage',
    },
    specializations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport',
        required: true,
      },
    ],
    title: {
      type: String,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: 0,
    },
    bioShort: {
      type: String,
      required: [true, 'Short bio is required'],
      maxlength: [160, 'Short bio must be 160 characters or fewer'],
    },
    bioFull: {
      type: String,
      required: [true, 'Full bio is required'],
    },
    achievements: [{ type: String }],
    certifications: [{ type: String }],
    batchLevels: [
      {
        type: String,
        enum: [
          'junior',
          'senior',
          'beginner',
          'intermediate',
          'advanced',
          'tournament-prep',
        ],
      },
    ],
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

coachSchema.index({ displayOrder: 1 });
coachSchema.index({ specializations: 1 });

export default mongoose.models.Coach || mongoose.model('Coach', coachSchema);
