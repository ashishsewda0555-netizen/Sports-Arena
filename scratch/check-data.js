import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sports-arena';

const sportSchema = new mongoose.Schema({
  name: { type: String },
  slug: { type: String },
  isActive: { type: Boolean },
  featuredImageId: { type: mongoose.Schema.Types.ObjectId, ref: 'GalleryImage' }
}, { strict: false });

const coachSchema = new mongoose.Schema({
  name: { type: String },
  specializations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sport' }]
}, { strict: false });

const imageSchema = new mongoose.Schema({
  url: { type: String }
}, { strict: false });

const Sport = mongoose.models.Sport || mongoose.model('Sport', sportSchema);
const Coach = mongoose.models.Coach || mongoose.model('Coach', coachSchema);
const GalleryImage = mongoose.models.GalleryImage || mongoose.model('GalleryImage', imageSchema);

async function checkData() {
  try {
    await mongoose.connect(MONGODB_URI);
    const sports = await Sport.find({}).populate('featuredImageId').lean();
    console.log("=== SPORTS ===");
    sports.forEach(s => {
      console.log(`- ${s.name} (slug: ${s.slug}, active: ${s.isActive}, img: ${s.featuredImageId ? s.featuredImageId.url : s.imageUrl || 'none'})`);
    });

    console.log("\n=== COACHES ===");
    const coaches = await Coach.find({}).lean();
    coaches.forEach(c => {
      console.log(`- ${c.name} (specializations: ${c.specializations.join(', ')})`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

checkData();
