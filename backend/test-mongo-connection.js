/**
 * MongoDB Atlas Connection Tester
 * Run this after whitelisting your IP in MongoDB Atlas
 */

const mongoose = require('mongoose');

async function testConnection() {
  console.log('\n🔍 MongoDB Atlas Connection Tester\n');
  console.log('Testing connection to cluster0.1oxvb5x.mongodb.net\n');
  
  // Test with the current credentials
  const username = 'notezilla_admin';
  const password = 'Notezilla123';
  const cluster = 'cluster0.1oxvb5x.mongodb.net';
  
  const uri = `mongodb+srv://${username}:${password}@${cluster}/?appName=Cluster0`;
  
  console.log('Connection Details:');
  console.log('├── Username:', username);
  console.log('├── Password:', '*'.repeat(password.length));
  console.log('├── Cluster:', cluster);
  console.log('└── Database: notezilla\n');
  
  console.log('Attempting connection...\n');
  
  try {
    await mongoose.connect(uri, {
      dbName: 'notezilla',
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ SUCCESS! MongoDB Atlas connected!\n');
    console.log('Connection Info:');
    console.log('├── Database:', mongoose.connection.db.databaseName);
    console.log('├── Host:', mongoose.connection.host);
    console.log('└── Ready State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    
    // List existing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nExisting Collections:', collections.length);
    if (collections.length > 0) {
      collections.forEach(col => console.log('  -', col.name));
    } else {
      console.log('  (No collections yet - database is empty)');
    }
    
    console.log('\n🎉 Your MongoDB Atlas is properly configured!');
    console.log('You can now start your application with: npm run dev\n');
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.log('❌ CONNECTION FAILED!\n');
    console.log('Error Type:', error.name);
    console.log('Error Code:', error.code || 'N/A');
    console.log('Error Message:', error.message);
    
    console.log('\n📋 Troubleshooting Checklist:\n');
    
    if (error.code === 8000 || error.codeName === 'AtlasError') {
      console.log('⚠️  Authentication Error - This means:');
      console.log('   1. ❌ Your IP is NOT whitelisted in Network Access');
      console.log('   2. ❌ Username or password is incorrect');
      console.log('   3. ❌ User does not have proper permissions\n');
      
      console.log('🔧 TO FIX:');
      console.log('   1. Go to https://cloud.mongodb.com/');
      console.log('   2. Click "Network Access" → Add IP → "Allow from Anywhere"');
      console.log('   3. Click "Database Access" → Verify user exists');
      console.log('   4. Wait 1-2 minutes and run this script again\n');
    } else if (error.name === 'MongoServerSelectionError') {
      console.log('⚠️  Server Selection Error - This means:');
      console.log('   1. ❌ Cannot reach MongoDB servers');
      console.log('   2. ❌ Cluster might be paused');
      console.log('   3. ❌ Network/firewall issue\n');
      
      console.log('🔧 TO FIX:');
      console.log('   1. Check if cluster0 is "Active" in Atlas dashboard');
      console.log('   2. Check your internet connection');
      console.log('   3. Try disabling VPN if using one\n');
    } else {
      console.log('⚠️  Unexpected Error\n');
      console.log('🔧 TO FIX:');
      console.log('   1. Double-check the connection string');
      console.log('   2. Verify cluster name is "cluster0"');
      console.log('   3. Check MongoDB Atlas dashboard for issues\n');
    }
    
    console.log('📖 See TROUBLESHOOT_MONGODB.md for detailed instructions\n');
    
    process.exit(1);
  }
}

// Run the test
testConnection();
