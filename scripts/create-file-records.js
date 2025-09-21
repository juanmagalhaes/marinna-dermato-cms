'use strict';

const https = require('https');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

// Configuration
const CLOUD_URL = 'https://balanced-books-9038cf24ee.strapiapp.com/api';
const CLOUD_TOKEN = 'ceb60dc61ffab1ecb9f8e85323af6dd86b5e68cbc12f1637f42902cf8039b81ca8fbe3593af17c67d6a59405bda4eb315a21e1a4d5eadb393f3f60fff1ce0db05bf25f61c4b2f2ff557f11138056419ab18dd67a7d3641a0feb30e44adc8d68e50e8fcff81c261f126d3029a7abb40862561b18b9f0c5a71d31e65fc8d235ac0';

/**
 * Make HTTP request to fetch data from cloud
 */
function fetchFromCloud(url) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${CLOUD_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    https.get(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', reject);
  });
}

/**
 * Create file records directly in the database
 */
async function createFileRecords() {
  console.log('📁 Creating file records...\n');
  
  let app;
  try {
    // Initialize Strapi
    const appContext = await compileStrapi();
    app = await createStrapi(appContext).load();
    app.log.level = 'error';
    
    // Get important images from cloud
    const response = await fetchFromCloud(`${CLOUD_URL}/upload/files`);
    
    if (response.status !== 200 || !response.data) {
      console.log('❌ No files found in cloud');
      return;
    }
    
    const files = Array.isArray(response.data) ? response.data : [response.data];
    
    // Filter for important images only
    const importantImages = files.filter(file => {
      const name = file.name.toLowerCase();
      return name.includes('marinna') || 
             name.includes('hero') || 
             name.includes('clinica') || 
             name.includes('favicon') ||
             name.includes('default-image');
    });
    
    console.log(`📋 Found ${importantImages.length} important images to create records for:`);
    importantImages.forEach((img, index) => {
      console.log(`  ${index + 1}. ${img.name}`);
    });
    
    // Check existing files
    const existingFiles = await app.query('plugin::upload.file').findMany();
    const existingNames = new Set(existingFiles.map(file => file.name));
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const file of importantImages) {
      if (existingNames.has(file.name)) {
        console.log(`⏭️  Skipping ${file.name} (already exists)`);
        skippedCount++;
        continue;
      }
      
      try {
        console.log(`📝 Creating record for ${file.name}...`);
        
        // Create file record directly in database
        const fileRecord = await app.query('plugin::upload.file').create({
          data: {
            name: file.name,
            alternativeText: file.alternativeText || file.name,
            caption: file.caption || file.name,
            width: file.width,
            height: file.height,
            formats: file.formats,
            hash: file.hash,
            ext: file.ext,
            mime: file.mime,
            size: file.size,
            url: file.url,
            previewUrl: file.previewUrl,
            provider: file.provider,
            provider_metadata: file.provider_metadata,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
          }
        });
        
        console.log(`✅ Created record for ${file.name} (ID: ${fileRecord.id})`);
        createdCount++;
        
      } catch (error) {
        console.log(`❌ Error creating record for ${file.name}: ${error.message}`);
      }
    }
    
    console.log(`\n🎉 File records creation completed!`);
    console.log(`  - Created: ${createdCount} records`);
    console.log(`  - Skipped: ${skippedCount} records`);
    
    // Check final count
    const finalFiles = await app.query('plugin::upload.file').findMany();
    console.log(`  - Total local files: ${finalFiles.length}`);
    
    if (finalFiles.length > 0) {
      console.log('\n📋 Local files:');
      finalFiles.forEach((file, index) => {
        console.log(`  ${index + 1}. ${file.name} (${file.mime}) - ${file.url}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error creating file records:', error);
  } finally {
    if (app) {
      await app.destroy();
    }
  }
}

// Run the creation
if (require.main === module) {
  createFileRecords().catch(console.error);
}

module.exports = { createFileRecords };
