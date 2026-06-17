import config from './config/index.js';
import connectDB from './db/connect.js';
import app from './app.js';

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Start Express server
  app.listen(config.port, () => {
    console.log(`\n🚀 Sports Arena API Server`);
    console.log(`   Environment : ${config.nodeEnv}`);
    console.log(`   Port        : ${config.port}`);
    console.log(`   URL         : http://localhost:${config.port}`);
    console.log(`   Health      : http://localhost:${config.port}/api/v1/health\n`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
