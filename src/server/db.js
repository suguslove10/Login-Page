import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Add connection options
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'vendor-system',
      // Log MongoDB queries in development
      ...(process.env.NODE_ENV === 'development' && { debug: true })
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Add connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Log the full error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', err);
      // Log the connection string with hidden password
      const maskedUri = process.env.MONGODB_URI?.replace(
        /:([^@]+)@/,
        ':****@'
      );
      console.log('Attempted connection string:', maskedUri);
    }
    process.exit(1);
  }
};

export default connectDB;