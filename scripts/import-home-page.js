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
 * Clean home page data by removing problematic relationships
 */
function cleanHomePageData(homePage) {
  const cleanData = { ...homePage };
  
  // Remove system fields
  delete cleanData.id;
  delete cleanData.documentId;
  delete cleanData.createdAt;
  delete cleanData.updatedAt;
  delete cleanData.publishedAt;
  delete cleanData.createdBy;
  delete cleanData.updatedBy;
  delete cleanData.locale;
  
  // Remove problematic relationships
  if (cleanData.featuredTreatments) {
    // Keep only the IDs, not the full objects
    cleanData.featuredTreatments = cleanData.featuredTreatments.map(treatment => ({
      id: treatment.id
    }));
  }
  
  if (cleanData.publicationsPreview) {
    // Keep only the IDs, not the full objects
    cleanData.publicationsPreview = cleanData.publicationsPreview.map(publication => ({
      id: publication.id
    }));
  }
  
  if (cleanData.faqPreview) {
    // Keep only the IDs, not the full objects
    cleanData.faqPreview = cleanData.faqPreview.map(faq => ({
      id: faq.id
    }));
  }
  
  return cleanData;
}

/**
 * Import home page data
 */
async function importHomePage() {
  console.log('🏠 Importing home page...\n');
  
  let app;
  try {
    // Initialize Strapi
    const appContext = await compileStrapi();
    app = await createStrapi(appContext).load();
    app.log.level = 'error';
    
    // Fetch from cloud
    console.log('📡 Fetching home page from cloud...');
    const response = await fetchFromCloud(`${CLOUD_URL}/home-page?populate=*`);
    
    if (response.status !== 200 || !response.data.data) {
      console.log('❌ No home-page data found in cloud');
      return;
    }
    
    const homePage = response.data.data;
    console.log(`✅ Found home page: ${homePage.hero?.title || 'N/A'}`);
    console.log(`  - Highlights: ${homePage.highlights?.length || 0}`);
    console.log(`  - Featured treatments: ${homePage.featuredTreatments?.length || 0}`);
    
    // Clean the data
    const cleanData = cleanHomePageData(homePage);
    
    // Create in local
    console.log('\n💾 Creating home page in local...');
    const result = await app.documents('api::home-page.home-page').create({
      data: cleanData,
    });
    
    console.log('✅ Home page created successfully');
    
    // Publish it
    console.log('📢 Publishing home page...');
    await app.documents('api::home-page.home-page').update({
      documentId: result.documentId,
      data: {
        ...result,
        publishedAt: new Date().toISOString()
      }
    });
    
    console.log('✅ Home page published successfully');
    
    // Test the API
    console.log('\n🧪 Testing API...');
    try {
      const testResponse = await fetch('http://localhost:1337/api/home-page');
      const testData = await testResponse.json();
      const count = testData.data ? (Array.isArray(testData.data) ? testData.data.length : 1) : 0;
      console.log(`✅ API test: ${count} home page(s) accessible`);
    } catch (error) {
      console.log(`❌ API test failed: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error importing home page:', error);
  } finally {
    if (app) {
      await app.destroy();
    }
  }
}

// Run the import
if (require.main === module) {
  importHomePage().catch(console.error);
}

module.exports = { importHomePage };
