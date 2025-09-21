const fs = require('fs');
const path = require('path');

// Scripts to keep (useful for the project)
const scriptsToKeep = [
  'setup-api-permissions.js',
  'fix-permissions.js',
  'publish-content.js',
  'publish-publications.js',
  'import-from-cloud.js',
  'import-home-page.js',
  'import-seo-data.js',
  'create-file-records.js',
  'check-imported-data.js',
  'list-images.js',
  'verify-permissions.js',
  'seed.js',
  'cleanup-scripts.js' // This script itself
];

// Scripts to remove (debug/temporary)
const scriptsToRemove = [
  'check-admin-images.js',
  'check-admin-permissions.js',
  'check-media-library.js',
  'check-missing-data.js',
  'check-seo-data.js',
  'check-upload-config.js',
  'check-upload-plugin.js',
  'debug-database.js',
  'fix-admin-api.js',
  'fix-folder-path.js',
  'fix-folder-path-v2.js',
  'fix-media-library.js',
  'fix-upload-permissions.js',
  'force-refresh-admin.js',
  'force-refresh-media.js',
  'import-images-fixed.js',
  'import-images.js',
  'import-missing-data.js',
  'list-tables.js',
  'recreate-images.js',
  'setup-upload-permissions.js',
  'simple-image-import.js',
  'simple-media-check.js',
  'upload-images-correct.js'
];

function cleanupScripts() {
  console.log('🧹 Cleaning up temporary scripts...\n');
  
  const scriptsDir = path.join(__dirname);
  
  // List all files in scripts directory
  const allFiles = fs.readdirSync(scriptsDir);
  const jsFiles = allFiles.filter(file => file.endsWith('.js'));
  
  console.log(`📊 Found ${jsFiles.length} JavaScript files in scripts directory\n`);
  
  // Remove temporary scripts
  let removedCount = 0;
  scriptsToRemove.forEach(scriptName => {
    const scriptPath = path.join(scriptsDir, scriptName);
    if (fs.existsSync(scriptPath)) {
      try {
        fs.unlinkSync(scriptPath);
        console.log(`✅ Removed: ${scriptName}`);
        removedCount++;
      } catch (error) {
        console.log(`❌ Error removing ${scriptName}: ${error.message}`);
      }
    }
  });
  
  console.log(`\n📊 Removed ${removedCount} temporary scripts`);
  
  // List remaining scripts
  const remainingFiles = fs.readdirSync(scriptsDir).filter(file => file.endsWith('.js'));
  console.log(`\n📋 Remaining scripts (${remainingFiles.length}):`);
  remainingFiles.forEach(file => {
    console.log(`  - ${file}`);
  });
  
  console.log('\n✅ Cleanup completed!');
  console.log('💡 The remaining scripts are useful for:');
  console.log('   - Setting up permissions');
  console.log('   - Importing data from Cloud');
  console.log('   - Publishing content');
  console.log('   - Debugging and verification');
}

cleanupScripts();
