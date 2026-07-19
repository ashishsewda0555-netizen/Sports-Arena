require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Define Schema manually so we don't rely on potentially missing models in this script
const sportSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  longDescription: String,
}, { strict: false });

const Sport = mongoose.models.Sport || mongoose.model('Sport', sportSchema);

async function run() {
  try {
    console.log('Connecting to MongoDB...', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const badmintonHtml = `
      <p>Badminton at Bharti Sports Arena is designed for players of all levels, from beginners discovering the sport to seasoned athletes honing their competitive edge. Our state-of-the-art courts feature premium synthetic flooring approved by international standards, ensuring optimal grip and joint protection.</p>
      <p>We offer structured coaching programs led by certified professionals who focus on footwork, stroke mechanics, and match strategy. Whether you're looking for rigorous tournament preparation or just a casual game with friends, our badminton facility provides the perfect environment to elevate your game.</p>
    `;

    const tableTennisHtml = `
      <p>Experience the fast-paced thrill of Table Tennis at our dedicated indoor facility. We provide ITTF-approved tables and professional-grade lighting to ensure perfect visibility and playing conditions, allowing you to focus entirely on your technique and reflexes.</p>
      <p>Our expert coaches are available to help you master the nuances of spin, speed, and placement. From group coaching batches to private one-on-one sessions and casual pay-and-play bookings, our table tennis arena is equipped to cater to all your sporting needs.</p>
    `;

    const fitnessZoneHtml = `
      <p>The Fitness Zone at Bharti Sports Arena is a comprehensive training facility designed to complement your sporting activities and enhance your overall physical conditioning. Equipped with modern strength and cardiovascular machinery, it provides everything you need for a full-body workout.</p>
      <p>Our qualified trainers are on hand to guide you through personalized workout routines, focusing on core strength, agility, and endurance. Whether you are recovering from an injury, building muscle, or simply maintaining an active lifestyle, the Fitness Zone is your dedicated space for health and wellness.</p>
    `;

    await Sport.updateOne({ slug: 'badminton' }, { $set: { longDescription: badmintonHtml } });
    console.log('Updated Badminton');
    
    await Sport.updateOne({ slug: 'table-tennis' }, { $set: { longDescription: tableTennisHtml } });
    console.log('Updated Table Tennis');

    await Sport.updateOne({ slug: 'fitness-zone' }, { $set: { longDescription: fitnessZoneHtml } });
    console.log('Updated Fitness Zone');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
