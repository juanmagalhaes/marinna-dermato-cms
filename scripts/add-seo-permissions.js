'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

/**
 * Add permissions for default-seo
 */
async function addSeoPermissions() {
  console.log('🔐 Adding SEO permissions...\n');
  
  let app;
  try {
    // Initialize Strapi
    const appContext = await compileStrapi();
    app = await createStrapi(appContext).load();
    app.log.level = 'error';
    
    // Find the public role
    const publicRole = await app.query('plugin::users-permissions.role').findOne({
      where: {
        type: 'public',
      },
    });

    if (!publicRole) {
      console.log('❌ Public role not found');
      return;
    }

    console.log(`📋 Found public role with ID: ${publicRole.id}`);

    // Clear existing permissions for default-seo
    const deleted = await app.query('plugin::users-permissions.permission').deleteMany({
      where: {
        role: publicRole.id,
        action: {
          $contains: 'api::default-seo.default-seo'
        }
      }
    });
    console.log(`🧹 Cleared ${deleted} existing permissions for default-seo`);

    // Create new permissions for default-seo
    const permissionsToCreate = [
      {
        action: 'api::default-seo.default-seo.find',
        role: publicRole.id,
      },
      {
        action: 'api::default-seo.default-seo.findOne',
        role: publicRole.id,
      }
    ];

    // Create permissions
    for (const permission of permissionsToCreate) {
      try {
        await app.query('plugin::users-permissions.permission').create({
          data: permission,
        });
        console.log(`✅ Created permission: ${permission.action}`);
      } catch (error) {
        console.log(`⚠️  Permission already exists: ${permission.action}`);
      }
    }

    console.log('\n🎉 SEO permissions added!');
    
    // Test the API
    console.log('\n🧪 Testing SEO API...');
    try {
      const testResponse = await fetch('http://localhost:1337/api/default-seo');
      const testData = await testResponse.json();
      const count = testData.data ? (Array.isArray(testData.data) ? testData.data.length : 1) : 0;
      console.log(`✅ SEO API test: ${count} item(s) accessible`);
      
      if (testData.data) {
        const data = Array.isArray(testData.data) ? testData.data[0] : testData.data;
        console.log(`  - Title: ${data.defaultTitle}`);
        console.log(`  - Site: ${data.siteName}`);
      }
    } catch (error) {
      console.log(`❌ SEO API test failed: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error adding SEO permissions:', error);
  } finally {
    if (app) {
      await app.destroy();
    }
  }
}

// Run the add
if (require.main === module) {
  addSeoPermissions().catch(console.error);
}

module.exports = { addSeoPermissions };
