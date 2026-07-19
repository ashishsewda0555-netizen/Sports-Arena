import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sports-arena';

// Define minimal schema for upserting
const sportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { strict: false });

const Sport = mongoose.models.Sport || mongoose.model('Sport', sportSchema);

const SPORTS_TO_SEED = [
  { name: 'Badminton', slug: 'badminton', displayOrder: 1 },
  { name: 'Basketball', slug: 'basketball', displayOrder: 2 },
  { name: 'Football', slug: 'football', displayOrder: 3 },
  { name: 'Tennis', slug: 'tennis', displayOrder: 4 },
  { name: 'Swimming', slug: 'swimming', displayOrder: 5 },
  { name: 'Table Tennis', slug: 'table-tennis', displayOrder: 6 },
  { name: 'Volleyball', slug: 'volleyball', displayOrder: 7 }
];

async function seedSports() {
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    console.log('Seeding sports...');
    for (const sport of SPORTS_TO_SEED) {
      const result = await Sport.findOneAndUpdate(
        { slug: sport.slug },
        { $setOnInsert: sport },
        { upsert: true, new: true }
      );
      console.log(`✓ Ensured sport exists: ${result.name}`);
    }

    console.log('Seed completed successfully!');
  } catch (err) {
    console.error('Failed to seed sports:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedSports();
