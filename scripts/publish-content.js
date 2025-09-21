'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

/**
 * Publish all content
 */
async function publishContent() {
  console.log('📢 Publishing content...\n');
  
  let app;
  try {
    // Initialize Strapi
    const appContext = await compileStrapi();
    app = await createStrapi(appContext).load();
    app.log.level = 'error';
    
    // Publish treatments
    console.log('📋 Publishing treatments...');
    const treatments = await app.documents('api::treatment.treatment').findMany();
    console.log(`Found ${treatments.length} treatments to publish`);
    
    for (const treatment of treatments) {
      try {
        await app.documents('api::treatment.treatment').update({
          documentId: treatment.documentId,
          data: {
            ...treatment,
            publishedAt: new Date().toISOString()
          }
        });
        console.log(`✅ Published: ${treatment.title}`);
      } catch (error) {
        console.log(`❌ Error publishing ${treatment.title}:`, error.message);
      }
    }
    
    // Publish home pages
    console.log('\n🏠 Publishing home pages...');
    const homePages = await app.documents('api::home-page.home-page').findMany();
    console.log(`Found ${homePages.length} home pages to publish`);
    
    for (const homePage of homePages) {
      try {
        await app.documents('api::home-page.home-page').update({
          documentId: homePage.documentId,
          data: {
            ...homePage,
            publishedAt: new Date().toISOString()
          }
        });
        console.log(`✅ Published: Home Page ${homePage.documentId}`);
      } catch (error) {
        console.log(`❌ Error publishing home page:`, error.message);
      }
    }
    
    // Publish doctor profiles
    console.log('\n👩‍⚕️ Publishing doctor profiles...');
    const doctorProfiles = await app.documents('api::doctor-profile.doctor-profile').findMany();
    console.log(`Found ${doctorProfiles.length} doctor profiles to publish`);
    
    for (const profile of doctorProfiles) {
      try {
        await app.documents('api::doctor-profile.doctor-profile').update({
          documentId: profile.documentId,
          data: {
            ...profile,
            publishedAt: new Date().toISOString()
          }
        });
        console.log(`✅ Published: Doctor Profile ${profile.documentId}`);
      } catch (error) {
        console.log(`❌ Error publishing doctor profile:`, error.message);
      }
    }
    
    // Publish globals
    console.log('\n🌐 Publishing globals...');
    const globals = await app.documents('api::global.global').findMany();
    console.log(`Found ${globals.length} globals to publish`);
    
    for (const global of globals) {
      try {
        await app.documents('api::global.global').update({
          documentId: global.documentId,
          data: {
            ...global,
            publishedAt: new Date().toISOString()
          }
        });
        console.log(`✅ Published: Global ${global.documentId}`);
      } catch (error) {
        console.log(`❌ Error publishing global:`, error.message);
      }
    }
    
    console.log('\n🎉 Content publishing completed!');
    
  } catch (error) {
    console.error('❌ Error publishing content:', error);
  } finally {
    if (app) {
      await app.destroy();
    }
  }
}

// Run the publish
if (require.main === module) {
  publishContent().catch(console.error);
}

module.exports = { publishContent };
