'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

/**
 * Check images in database
 */
async function checkImages() {
  console.log('🖼️  Checking images in database...\n');
  
  let app;
  try {
    // Initialize Strapi
    const appContext = await compileStrapi();
    app = await createStrapi(appContext).load();
    app.log.level = 'error';
    
    // Check files table directly
    const files = await app.query('plugin::upload.file').findMany();
    console.log(`📊 Files in database: ${files.length}`);
    
    if (files.length > 0) {
      console.log('\n📋 Files:');
      files.forEach((file, index) => {
        console.log(`  ${index + 1}. ${file.name} (${file.mime})`);
        console.log(`      ID: ${file.id}`);
        console.log(`      URL: ${file.url}`);
        console.log(`      Size: ${file.size} bytes`);
        console.log('');
      });
    } else {
      console.log('❌ No files found in database');
    }
    
    // Check if files are accessible via API
    console.log('🧪 Testing API access...');
    try {
      const response = await fetch('http://localhost:1337/api/upload/files');
      const data = await response.json();
      console.log(`API Response Status: ${response.status}`);
      console.log(`API Response:`, JSON.stringify(data, null, 2));
    } catch (error) {
      console.log(`❌ API test failed: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking images:', error);
  } finally {
    if (app) {
      await app.destroy();
    }
  }
}

// Run the check
if (require.main === module) {
  checkImages().catch(console.error);
}

module.exports = { checkImages };
