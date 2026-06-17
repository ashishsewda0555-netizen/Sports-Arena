import mongoose from 'mongoose';

const socialLinksSchema = new mongoose.Schema(
  {
    instagramUrl: { type: String, trim: true },
    facebookUrl: { type: String, trim: true },
    youtubeUrl: { type: String, trim: true },
    googleBusinessProfileUrl: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SocialLinks ||
  mongoose.model('SocialLinks', socialLinksSchema);
