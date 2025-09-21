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
 * Clean SEO data by removing system fields
 */
function cleanSeoData(seoData) {
  const cleanData = { ...seoData };
  
  // Remove system fields
  delete cleanData.id;
  delete cleanData.documentId;
  delete cleanData.createdAt;
  delete cleanData.updatedAt;
  delete cleanData.publishedAt;
  delete cleanData.createdBy;
  delete cleanData.updatedBy;
  delete cleanData.locale;
  
  return cleanData;
}

/**
 * Import SEO data
 */
async function importSeoData() {
  console.log('🔍 Importing SEO data...\n');
  
  let app;
  try {
    // Initialize Strapi
    const appContext = await compileStrapi();
    app = await createStrapi(appContext).load();
    app.log.level = 'error';
    
    // Fetch from cloud
    console.log('📡 Fetching SEO data from cloud...');
    const response = await fetchFromCloud(`${CLOUD_URL}/default-seo?populate=*`);
    
    if (response.status !== 200 || !response.data.data) {
      console.log('❌ No SEO data found in cloud');
      return;
    }
    
    const seoData = response.data.data;
    console.log('✅ Found SEO data:');
    console.log(`  - Default Title: ${seoData.defaultTitle}`);
    console.log(`  - Site Name: ${seoData.siteName}`);
    console.log(`  - Description: ${seoData.description?.substring(0, 100)}...`);
    console.log(`  - Keywords: ${seoData.keywords?.substring(0, 100)}...`);
    
    // Clean the data
    const cleanData = cleanSeoData(seoData);
    
    // Create in local
    console.log('\n💾 Creating SEO data in local...');
    const result = await app.documents('api::default-seo.default-seo').create({
      data: cleanData,
    });
    
    console.log('✅ SEO data created successfully');
    
    // Publish it
    console.log('📢 Publishing SEO data...');
    await app.documents('api::default-seo.default-seo').update({
      documentId: result.documentId,
      data: {
        ...result,
        publishedAt: new Date().toISOString()
      }
    });
    
    console.log('✅ SEO data published successfully');
    
    // Test the API
    console.log('\n🧪 Testing API...');
    try {
      const testResponse = await fetch('http://localhost:1337/api/default-seo');
      const testData = await testResponse.json();
      const count = testData.data ? (Array.isArray(testData.data) ? testData.data.length : 1) : 0;
      console.log(`✅ API test: ${count} SEO data item(s) accessible`);
      
      if (testData.data) {
        const data = Array.isArray(testData.data) ? testData.data[0] : testData.data;
        console.log(`  - Title: ${data.defaultTitle}`);
        console.log(`  - Site: ${data.siteName}`);
      }
    } catch (error) {
      console.log(`❌ API test failed: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error importing SEO data:', error);
  } finally {
    if (app) {
      await app.destroy();
    }
  }
}

// Run the import
if (require.main === module) {
  importSeoData().catch(console.error);
}

module.exports = { importSeoData };
