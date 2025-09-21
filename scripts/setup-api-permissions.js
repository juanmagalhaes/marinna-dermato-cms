'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

/**
 * Setup API permissions for content types
 */
async function setupApiPermissions() {
  console.log('🔐 Setting up API permissions...\n');
  
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

    // Clear existing permissions for these content types
    for (const contentType of contentTypes) {
      await app.query('plugin::users-permissions.permission').deleteMany({
        where: {
          role: publicRole.id,
          action: {
            $contains: `api::${contentType}.${contentType}`
          }
        }
      });
      console.log(`🧹 Cleared existing permissions for ${contentType}`);
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

    console.log('\n🎉 API permissions setup completed!');
    console.log('\n📡 You can now access the API at:');
    console.log('  - http://localhost:1337/api/treatments');
    console.log('  - http://localhost:1337/api/home-page');
    console.log('  - http://localhost:1337/api/doctor-profile');
    console.log('  - http://localhost:1337/api/global');
    
  } catch (error) {
    console.error('❌ Error setting up permissions:', error);
  } finally {
    if (app) {
      await app.destroy();
    }
  }
}

// Run the setup
if (require.main === module) {
  setupApiPermissions().catch(console.error);
}

module.exports = { setupApiPermissions };
