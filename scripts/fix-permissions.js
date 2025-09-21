'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

/**
 * Fix API permissions for all content types
 */
async function fixPermissions() {
  console.log('🔐 Fixing API permissions...\n');
  
  let app;
  try {
    // Initialize Strapi
    const appContext = await compileStrapi();
    app = await createStrapi(appContext).load();
    app.log.level = 'error';
    
    // Content types to configure
    const contentTypes = [
      'home-page',
      'doctor-profile', 
      'treatment',
      'publication',
      'faq',
      'global'
    ];
    
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

    // Clear ALL existing permissions for these content types
    for (const contentType of contentTypes) {
      const deleted = await app.query('plugin::users-permissions.permission').deleteMany({
        where: {
          role: publicRole.id,
          action: {
            $contains: `api::${contentType}.${contentType}`
          }
        }
      });
      console.log(`🧹 Cleared ${deleted} existing permissions for ${contentType}`);
    }

    // Create new permissions
    const permissionsToCreate = [];
    
    for (const contentType of contentTypes) {
      const actions = ['find', 'findOne'];
      
      for (const action of actions) {
        permissionsToCreate.push({
          action: `api::${contentType}.${contentType}.${action}`,
          role: publicRole.id,
        });
      }
    }

    // Create all permissions
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

    console.log('\n🎉 Permissions fixed!');
    console.log('\n📡 Testing API endpoints...');
    
    // Test each endpoint
    const endpoints = [
      'treatments',
      'doctor-profile', 
      'global',
      'publications',
      'home-page',
      'faq'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:1337/api/${endpoint}`);
        const data = await response.json();
        const count = data.data ? (Array.isArray(data.data) ? data.data.length : 1) : 0;
        console.log(`  ✅ ${endpoint}: ${count} items`);
      } catch (error) {
        console.log(`  ❌ ${endpoint}: Error - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error fixing permissions:', error);
  } finally {
    if (app) {
      await app.destroy();
    }
  }
}

// Run the fix
if (require.main === module) {
  fixPermissions().catch(console.error);
}

module.exports = { fixPermissions };
