const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in environment');

  await mongoose.connect(uri, {
    // useNewUrlParser, useUnifiedTopology are defaults in mongoose v7+
  });
  console.log('MongoDB connected');
}

module.exports = connectDB;
