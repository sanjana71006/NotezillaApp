const mongoose = require('mongoose');

/**
 * Connect to MongoDB using environment variables.
 *
 * Expected environment variables:
 * - MONGODB_URI  : full connection string (mongodb+srv://...)
 * - MONGODB_DBNAME (optional): explicit database name to use
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not set in environment. Set backend/.env or process env.');
  }

  // Default to the 'Notes' database if no explicit DB name is provided
  const dbName = process.env.MONGODB_DBNAME || 'Notes';

  console.log('Attempting to connect to MongoDB...');
  try {
    await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 10000,
    });

    const dbUsed = (mongoose.connection && mongoose.connection.db)
      ? mongoose.connection.db.databaseName
      : '(unknown)';
    console.log(`✅ MongoDB connected — database: ${dbUsed}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected.');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed');
    console.error(error && error.message ? error.message : error);

    // Helpful troubleshooting hints
    console.error('\nTroubleshooting tips:');
    console.error('- Verify MONGODB_URI is correct and includes the right username/password (URL-encode special chars)');
    console.error('- If you want to target a specific DB, set MONGODB_DBNAME in your env');
    console.error('- Ensure your IP or the deployment host (Vercel) is allowed in Atlas Network Access');
    console.error('- Check Atlas > Database Access that the DB user exists and has correct roles');

    throw error;
  }
}

module.exports = connectDB;
