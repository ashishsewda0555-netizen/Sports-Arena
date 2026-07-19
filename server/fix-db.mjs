
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });
dotenv.config({ path: '../.env' });
const uri = process.env.MONGODB_URI;
console.log('Connecting to', uri);
mongoose.connect(uri).then(async () => {
  const Sport = mongoose.connection.collection('sports');
  await Sport.updateOne({slug: 'badminton'}, {$set: {shortDescription: 'Fast-paced indoor badminton for all skill levels.'}});
  await Sport.updateOne({slug: 'table-tennis'}, {$set: {shortDescription: 'Quick rallies and sharp reflexes on premium tables.'}});
  console.log('Updated DB');
  process.exit(0);
}).catch(console.error);

