
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/sports-arena').then(async () => {
  const Sport = mongoose.connection.collection('sports');
  await Sport.updateOne({slug: 'badminton'}, {$set: {shortDescription: 'Fast-paced indoor badminton for all skill levels.'}});
  await Sport.updateOne({slug: 'table-tennis'}, {$set: {shortDescription: 'Quick rallies and sharp reflexes on premium tables.'}});
  console.log('Updated DB');
  process.exit(0);
});

