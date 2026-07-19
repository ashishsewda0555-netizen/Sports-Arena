import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sports-arena';

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true, enum: ['racquet', 'indoor-table', 'mind-sport', 'fitness'] },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  iconKey: { type: String, required: true },
  ctaType: { type: String, required: true, enum: ['coaching-enquiry', 'casual-play', 'fitness-enquiry'] },
  displayOrder: { type: Number, required: true },
  isActive: { type: Boolean, default: true, required: true }
}, { strict: false });

const Sport = mongoose.models.Sport || mongoose.model('Sport', sportSchema);

const SPORTS_TO_ADD = [
  {
    name: 'Snooker',
    slug: 'snooker',
    category: 'indoor-table',
    shortDescription: 'Premium snooker tables in a relaxed environment.',
    longDescription: 'Enjoy our professional-grade snooker tables. Whether you are a casual player or a serious competitor, our facilities provide the perfect setting.',
    iconKey: 'circle',
    ctaType: 'casual-play',
    displayOrder: 10,
    isActive: true
  },
  {
    name: 'Table Soccer',
    slug: 'table-soccer',
    category: 'indoor-table',
    shortDescription: 'Fast-paced foosball action for groups.',
    longDescription: 'Challenge your friends to a game of table soccer (foosball) on our high-quality tables.',
    iconKey: 'users',
    ctaType: 'casual-play',
    displayOrder: 11,
    isActive: true
  },
  {
    name: 'Chess',
    slug: 'chess',
    category: 'mind-sport',
    shortDescription: 'Dedicated zones for chess and strategy.',
    longDescription: 'Sharpen your mind in our quiet, dedicated chess zones. Perfect for practice or casual matches.',
    iconKey: 'brain',
    ctaType: 'casual-play',
    displayOrder: 12,
    isActive: true
  },
  {
    name: 'Carrom',
    slug: 'carrom',
    category: 'indoor-table',
    shortDescription: 'Traditional carrom boards for all ages.',
    longDescription: 'Enjoy classic carrom with friends and family. Our smooth, well-maintained boards offer a great playing experience.',
    iconKey: 'layout-grid',
    ctaType: 'casual-play',
    displayOrder: 13,
    isActive: true
  }
];

const SLUGS_TO_DEACTIVATE = ['basketball', 'football', 'tennis', 'swimming', 'volleyball'];

async function runMigration() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const result = await Sport.updateMany(
      { slug: { $in: SLUGS_TO_DEACTIVATE } },
      { $set: { isActive: false } }
    );
    console.log(`Deactivated ${result.modifiedCount} sports.`);

    for (const sport of SPORTS_TO_ADD) {
      await Sport.findOneAndUpdate(
        { slug: sport.slug },
        { $setOnInsert: sport },
        { upsert: true }
      );
      console.log(`Added/Verified: ${sport.name}`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('Done');
  }
}

runMigration();
