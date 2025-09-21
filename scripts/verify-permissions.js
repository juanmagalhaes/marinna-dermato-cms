'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

/**
 * Verify and fix permissions
 */
async function verifyPermissions() {
  console.log('🔐 Verifying permissions...\n');
  
  let app;
  try {
    // Initialize Strapi
    const appContext = await compileStrapi();
    app = await createStrapi(appContext).load();
    app.log.level = 'error';
    
    // Check public role
    const publicRole = await app.query('plugin::users-permissions.role').findOne({
      where: {
        type: 'public',
      },
    });

    if (!publicRole) {
      console.log('❌ Public role not found');
      return;
    }

    console.log(`📋 Public role ID: ${publicRole.id}`);

    // Check all permissions for public role
    const permissions = await app.query('plugin::users-permissions.permission').findMany({
      where: {
        role: publicRole.id,
      },
    });

    console.log(`📊 Total permissions: ${permissions.length}`);
    
    // Group permissions by action
    const permissionGroups = {};
    permissions.forEach(permission => {
      const action = permission.action;
      if (!permissionGroups[action]) {
        permissionGroups[action] = [];
      }
      permissionGroups[action].push(permission);
    });

    console.log('\n📋 Permission groups:');
    Object.keys(permissionGroups).forEach(action => {
      console.log(`  ${action}: ${permissionGroups[action].length} permission(s)`);
    });

    // Check specifically for upload permissions
    const uploadPermissions = permissions.filter(p => 
      p.action.includes('plugin::upload') || 
      p.action.includes('upload')
    );
    
    console.log(`\n📁 Upload permissions: ${uploadPermissions.length}`);
    uploadPermissions.forEach(permission => {
      console.log(`  - ${permission.action}`);
    });

    // If no upload permissions, create them
    if (uploadPermissions.length === 0) {
      console.log('\n🔧 Creating upload permissions...');
      
      const uploadActions = [
        'plugin::upload.files.find',
        'plugin::upload.files.findOne'
      ];

      for (const action of uploadActions) {
        try {
          await app.query('plugin::users-permissions.permission').create({
            data: {
              action: action,
              role: publicRole.id,
            },
          });
          console.log(`✅ Created permission: ${action}`);
        } catch (error) {
          console.log(`⚠️  Error creating ${action}: ${error.message}`);
        }
      }
    }

    // Test API access
    console.log('\n🧪 Testing API access...');
    try {
      const response = await fetch('http://localhost:1337/api/upload/files');
      console.log(`Status: ${response.status}`);
      
      if (response.status === 200) {
        const data = await response.json();
        const count = data.data ? (Array.isArray(data.data) ? data.data.length : 1) : 0;
        console.log(`✅ Success! ${count} files accessible`);
      } else {
        const errorData = await response.json();
        console.log(`❌ Error: ${errorData.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ API test failed: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error verifying permissions:', error);
  } finally {
    if (app) {
      await app.destroy();
    }
  }
}

// Run the verification
if (require.main === module) {
  verifyPermissions().catch(console.error);
}

module.exports = { verifyPermissions };
