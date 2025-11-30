/**
 * File Migration Check Script
 * This script checks which resources have files and which are missing
 * Run with: node check-file-status.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Resource = require('./src/models/Resource');

async function checkFileStatus() {
  try {
    console.log('🔍 Checking file status in MongoDB...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all resources
    const resources = await Resource.find().populate('uploadedBy', 'username email');
    
    if (resources.length === 0) {
      console.log('❌ No resources found in database');
      await mongoose.disconnect();
      return;
    }

    console.log(`📊 Total Resources: ${resources.length}\n`);

    const withFiles = [];
    const withoutFiles = [];

    resources.forEach(resource => {
      const hasFile = resource.fileData && resource.fileData.length > 0;
      
      if (hasFile) {
        withFiles.push({
          id: resource._id,
          title: resource.title,
          fileSize: resource.fileSize,
          uploader: resource.uploadedBy?.username || 'Unknown'
        });
      } else {
        withoutFiles.push({
          id: resource._id,
          title: resource.title,
          uploader: resource.uploadedBy?.username || 'Unknown'
        });
      }
    });

    console.log(`✅ Resources WITH FILES: ${withFiles.length}`);
    if (withFiles.length > 0) {
      withFiles.forEach(r => {
        console.log(`   📄 ${r.title} (${(r.fileSize / 1024).toFixed(2)} KB) - ${r.uploader}`);
      });
    }

    console.log(`\n❌ Resources WITHOUT FILES: ${withoutFiles.length}`);
    if (withoutFiles.length > 0) {
      withoutFiles.forEach(r => {
        console.log(`   📋 ${r.title} - ${r.uploader}`);
      });
      
      console.log('\n📝 Action Required:');
      console.log('   Resources without files need to be re-uploaded by the faculty/admin.');
      console.log('   Users should contact the uploader to re-upload these resources.');
    }

    await mongoose.disconnect();
    console.log('\n✅ Check complete');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkFileStatus();
