'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

/**
 * Check what data was imported
 */
async function checkImportedData() {
  console.log('🔍 Checking imported data...\n');
  
  let app;
  try {
    // Initialize Strapi
    const appContext = await compileStrapi();
    app = await createStrapi(appContext).load();
    app.log.level = 'error';
    
    // Check treatments
    const treatments = await app.documents('api::treatment.treatment').findMany();
    console.log(`📋 Treatments: ${treatments.length} found`);
    treatments.forEach((treatment, index) => {
      console.log(`  ${index + 1}. ${treatment.title} (${treatment.slug})`);
    });
    
    // Check home-page
    const homePages = await app.documents('api::home-page.home-page').findMany();
    console.log(`\n🏠 Home Pages: ${homePages.length} found`);
    homePages.forEach((homePage, index) => {
      console.log(`  ${index + 1}. ID: ${homePage.documentId}`);
    });
    
    // Check doctor-profile
    const doctorProfiles = await app.documents('api::doctor-profile.doctor-profile').findMany();
    console.log(`\n👩‍⚕️ Doctor Profiles: ${doctorProfiles.length} found`);
    doctorProfiles.forEach((profile, index) => {
      console.log(`  ${index + 1}. ID: ${profile.documentId}`);
    });
    
    // Check global
    const globals = await app.documents('api::global.global').findMany();
    console.log(`\n🌐 Globals: ${globals.length} found`);
    globals.forEach((global, index) => {
      console.log(`  ${index + 1}. ID: ${global.documentId}`);
    });
    
    console.log('\n✅ Data check completed!');
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    if (app) {
      await app.destroy();
    }
  }
}

// Run the check
if (require.main === module) {
  checkImportedData().catch(console.error);
}

module.exports = { checkImportedData };
