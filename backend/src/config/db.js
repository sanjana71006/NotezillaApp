const mongoose = require('mongoose');

async function connectDB() {
  // MongoDB Atlas connection string
  // Updated to use new database user: notezilla_admin
  const uri = 'mongodb+srv://notezilla_admin:Notezilla123@cluster0.1oxvb5x.mongodb.net/?appName=Cluster0';
  
  // If you need to change credentials later, update the username and password above
  // Format: mongodb+srv://USERNAME:PASSWORD@cluster0.1oxvb5x.mongodb.net/?appName=Cluster0
  
  console.log('Attempting to connect to MongoDB Atlas...');
  console.log('Connection string (partial):', uri.substring(0, 30) + '...');
  
  try {
    await mongoose.connect(uri, {
      dbName: 'notezilla',
      serverSelectionTimeoutMS: 10000,
      // useNewUrlParser, useUnifiedTopology are defaults in mongoose v7+
    });
    
    console.log('✅ MongoDB Atlas connected successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    
    // Set up connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed!');
    console.error('Error:', error.message);
    
    if (error.codeName === 'AtlasError') {
      console.error('\n⚠️  MongoDB Atlas Authentication Failed!');
      console.error('Please verify the following:');
      console.error('1. Username: sanjanapriyadarshini6_db_user');
      console.error('2. Password: Check if "Alitane" is correct');
      console.error('3. IP Whitelist: Your IP must be added to MongoDB Atlas Network Access');
      console.error('   - Go to MongoDB Atlas Dashboard');
      console.error('   - Navigate to Network Access');
      console.error('   - Add your current IP or 0.0.0.0/0 for all IPs (development only)');
      console.error('4. Cluster Status: Ensure cluster0 is active\n');
    }
    
    throw error;
  }
}

module.exports = connectDB;
