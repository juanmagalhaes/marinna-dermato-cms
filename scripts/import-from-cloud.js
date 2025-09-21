'use strict';

const https = require('https');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

// Configuration
const CLOUD_URL = 'https://balanced-books-9038cf24ee.strapiapp.com/api';
const CLOUD_TOKEN = 'ceb60dc61ffab1ecb9f8e85323af6dd86b5e68cbc12f1637f42902cf8039b81ca8fbe3593af17c67d6a59405bda4eb315a21e1a4d5eadb393f3f60fff1ce0db05bf25f61c4b2f2ff557f11138056419ab18dd67a7d3641a0feb30e44adc8d68e50e8fcff81c261f126d3029a7abb40862561b18b9f0c5a71d31e65fc8d235ac0';

// Content types to import
const CONTENT_TYPES = [
  'home-page',
  'doctor-profile', 
  'treatment',
  'publication',
  'faq',
  'global'
];

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
 * Create entry in local Strapi
 */
async function createEntry({ model, entry, strapi }) {
  try {
    console.log(`📝 Creating ${model}...`);
    
    // Remove id and timestamps to avoid conflicts
    const cleanEntry = { ...entry };
    delete cleanEntry.id;
    delete cleanEntry.documentId;
    delete cleanEntry.createdAt;
    delete cleanEntry.updatedAt;
    delete cleanEntry.publishedAt;
    
    // Create the entry
    const result = await strapi.documents(`api::${model}.${model}`).create({
      data: cleanEntry,
    });
    
    console.log(`✅ Successfully created ${model}`);
    return result;
  } catch (error) {
    console.error(`❌ Error creating ${model}:`, error.message);
    return null;
  }
}

/**
 * Set public permissions for content types
 */
async function setPublicPermissions(strapi, permissions) {
  try {
    // Find the ID of the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: {
        type: 'public',
      },
    });

    if (!publicRole) {
      console.log('⚠️  Public role not found, skipping permissions setup');
      return;
    }

    // Create the new permissions and link them to the public role
    const allPermissionsToCreate = [];
    Object.keys(permissions).forEach((controller) => {
      const actions = permissions[controller];
      const permissionsToCreate = actions.map((action) => {
        return strapi.query('plugin::users-permissions.permission').create({
          data: {
            action: `api::${controller}.${controller}.${action}`,
            role: publicRole.id,
          },
        });
      });
      allPermissionsToCreate.push(...permissionsToCreate);
    });
    
    await Promise.all(allPermissionsToCreate);
    console.log('✅ Public permissions set successfully');
  } catch (error) {
    console.error('❌ Error setting permissions:', error.message);
  }
}

/**
 * Import home page data
 */
async function importHomePage(strapi) {
  try {
    const response = await fetchFromCloud(`${CLOUD_URL}/home-page?populate=*`);
    if (response.status === 200 && response.data.data) {
      await createEntry({
        model: 'home-page',
        entry: response.data.data,
        strapi
      });
    } else {
      console.log('⚠️  No home-page data found in cloud');
    }
  } catch (error) {
    console.error('❌ Error importing home-page:', error.message);
  }
}

/**
 * Import doctor profile data
 */
async function importDoctorProfile(strapi) {
  try {
    const response = await fetchFromCloud(`${CLOUD_URL}/doctor-profile?populate=*`);
    if (response.status === 200 && response.data.data) {
      await createEntry({
        model: 'doctor-profile',
        entry: response.data.data,
        strapi
      });
    } else {
      console.log('⚠️  No doctor-profile data found in cloud');
    }
  } catch (error) {
    console.error('❌ Error importing doctor-profile:', error.message);
  }
}

/**
 * Import treatments data
 */
async function importTreatments(strapi) {
  try {
    const response = await fetchFromCloud(`${CLOUD_URL}/treatments?populate=*`);
    if (response.status === 200 && response.data.data) {
      const treatments = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      for (const treatment of treatments) {
        await createEntry({
          model: 'treatment',
          entry: treatment,
          strapi
        });
      }
    } else {
      console.log('⚠️  No treatments data found in cloud');
    }
  } catch (error) {
    console.error('❌ Error importing treatments:', error.message);
  }
}

/**
 * Import global data
 */
async function importGlobal(strapi) {
  try {
    const response = await fetchFromCloud(`${CLOUD_URL}/global?populate=*`);
    if (response.status === 200 && response.data.data) {
      await createEntry({
        model: 'global',
        entry: response.data.data,
        strapi
      });
    } else {
      console.log('⚠️  No global data found in cloud');
    }
  } catch (error) {
    console.error('❌ Error importing global:', error.message);
  }
}

/**
 * Main import function
 */
async function importFromCloud() {
  console.log('🚀 Starting import from Strapi Cloud to Local...\n');
  
  let app;
  try {
    // Initialize Strapi
    console.log('🔧 Initializing Strapi...');
    const appContext = await compileStrapi();
    app = await createStrapi(appContext).load();
    app.log.level = 'error';
    
    // Set public permissions
    console.log('🔐 Setting public permissions...');
    await setPublicPermissions(app, {
      'home-page': ['find', 'findOne'],
      'doctor-profile': ['find', 'findOne'],
      'treatment': ['find', 'findOne'],
      'publication': ['find', 'findOne'],
      'faq': ['find', 'findOne'],
      'global': ['find', 'findOne'],
    });
    
    // Import data
    console.log('\n📥 Importing data...');
    await importHomePage(app);
    await importDoctorProfile(app);
    await importTreatments(app);
    await importGlobal(app);
    
    console.log('\n🎉 Import completed successfully!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    if (app) {
      await app.destroy();
    }
  }
}

// Run the import
if (require.main === module) {
  importFromCloud().catch(console.error);
}

module.exports = { importFromCloud };
