/**
 * Create Test Data
 * This script creates sample users to test the database
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createTestData() {
  console.log('\n🔧 Creating Test Data...\n');
  
  const uri = 'mongodb+srv://notezilla_admin:Notezilla123@cluster0.1oxvb5x.mongodb.net/?appName=Cluster0';
  
  try {
    await mongoose.connect(uri, { dbName: 'notezilla' });
    console.log('✅ Connected to MongoDB Atlas\n');
    
    // Define User Schema
    const UserSchema = new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      role: String,
      isBlocked: { type: Boolean, default: false },
      isEmailVerified: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    });
    
    const User = mongoose.model('User', UserSchema);
    
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    
    if (existingUsers > 0) {
      console.log(`ℹ️  Database already has ${existingUsers} user(s)`);
      console.log('Skipping test data creation...\n');
    } else {
      // Create test users
      const testUsers = [
        {
          username: 'Admin User',
          email: 'admin@notezilla.com',
          password: await bcrypt.hash('admin123', 10),
          role: 'Admin',
          isEmailVerified: true
        },
        {
          username: 'John Faculty',
          email: 'faculty@notezilla.com',
          password: await bcrypt.hash('faculty123', 10),
          role: 'Faculty',
          isEmailVerified: true
        },
        {
          username: 'Alice Student',
          email: 'student@notezilla.com',
          password: await bcrypt.hash('student123', 10),
          role: 'Student',
          isEmailVerified: true
        }
      ];
      
      console.log('Creating test users...\n');
      
      for (const userData of testUsers) {
        const user = await User.create(userData);
        console.log(`✅ Created: ${user.username} (${user.role})`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${userData.role.toLowerCase()}123\n`);
      }
      
      console.log('🎉 Test data created successfully!\n');
      console.log('You can now login with:');
      console.log('─'.repeat(40));
      console.log('Admin:   admin@notezilla.com / admin123');
      console.log('Faculty: faculty@notezilla.com / faculty123');
      console.log('Student: student@notezilla.com / student123');
      console.log('─'.repeat(40));
    }
    
    // Show current database stats
    const userCount = await User.countDocuments();
    console.log(`\n📊 Database Stats:`);
    console.log(`   Total Users: ${userCount}`);
    
    await mongoose.disconnect();
    console.log('\n✅ Done!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

createTestData();
