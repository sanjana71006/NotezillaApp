/**
 * View Database Contents
 * This script shows all collections and data in your MongoDB database
 */

const mongoose = require('mongoose');

async function viewDatabase() {
  console.log('\n📊 MongoDB Database Viewer\n');
  
  const uri = 'mongodb+srv://notezilla_admin:Notezilla123@cluster0.1oxvb5x.mongodb.net/?appName=Cluster0';
  
  try {
    await mongoose.connect(uri, {
      dbName: 'notezilla',
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📁 Database:', mongoose.connection.db.databaseName);
    console.log('=' .repeat(60));
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('\n📭 Database is empty - no collections yet');
      console.log('\nℹ️  Collections will be created automatically when you:');
      console.log('   • Sign up new users');
      console.log('   • Upload resources');
      console.log('   • Create assignments');
      console.log('   • Post in discussions');
      console.log('   • etc.\n');
    } else {
      console.log(`\n📚 Found ${collections.length} collection(s):\n`);
      
      // Loop through each collection and show its data
      for (const collection of collections) {
        const collectionName = collection.name;
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📦 Collection: ${collectionName}`);
        console.log(`${'='.repeat(60)}`);
        
        const data = await mongoose.connection.db.collection(collectionName).find({}).toArray();
        
        console.log(`Documents: ${data.length}`);
        
        if (data.length === 0) {
          console.log('└── (Empty collection)');
        } else {
          console.log('\n');
          data.forEach((doc, index) => {
            console.log(`Document ${index + 1}:`);
            console.log(JSON.stringify(doc, null, 2));
            console.log('\n');
          });
        }
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Database view complete\n');
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

viewDatabase();
