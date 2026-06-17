import mongoose from 'mongoose';
import config from '../config/index.js';

/**
 * Connect to MongoDB Atlas with retry logic.
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      bufferCommands: false,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

export default connectDB;
