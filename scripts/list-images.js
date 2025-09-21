const { createStrapi } = require('@strapi/strapi');

async function listImages() {
  console.log('🖼️  Listing all images in database...\n');
  
  try {
    const strapi = await createStrapi();
    await strapi.start();
    
    // Get all files from database
    const files = await strapi.entityService.findMany('plugin::upload.file');
    console.log(`📊 Total files in database: ${files.length}\n`);
    
    if (files.length === 0) {
      console.log('❌ No files found in database');
      await strapi.destroy();
      return;
    }
    
    // List all files with details
    files.forEach((file, index) => {
      console.log(`📁 ${index + 1}. ${file.name}`);
      console.log(`   ID: ${file.id}`);
      console.log(`   Document ID: ${file.documentId}`);
      console.log(`   MIME Type: ${file.mime}`);
      console.log(`   Size: ${file.size} bytes`);
      console.log(`   Dimensions: ${file.width}x${file.height}`);
      console.log(`   Published: ${file.publishedAt ? 'Yes' : 'No'}`);
      console.log(`   Provider: ${file.provider}`);
      console.log(`   URL: ${file.url}`);
      console.log(`   Created: ${file.createdAt}`);
      console.log(`   Updated: ${file.updatedAt}`);
      console.log('');
    });
    
    // Check if files have the correct structure for Media Library
    console.log('🔍 Checking file structure for Media Library compatibility...\n');
    
    const requiredFields = ['name', 'url', 'mime', 'size', 'width', 'height'];
    const missingFields = files.map(file => {
      const missing = requiredFields.filter(field => !file[field]);
      return { name: file.name, missing };
    }).filter(item => item.missing.length > 0);
    
    if (missingFields.length > 0) {
      console.log('⚠️  Files with missing required fields:');
      missingFields.forEach(item => {
        console.log(`   ${item.name}: missing ${item.missing.join(', ')}`);
      });
    } else {
      console.log('✅ All files have required fields for Media Library');
    }
    
    await strapi.destroy();
  } catch (error) {
    console.error('❌ Error listing images:', error.message);
  }
}

listImages();
