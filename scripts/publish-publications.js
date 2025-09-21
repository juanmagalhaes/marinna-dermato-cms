'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

/**
 * Publish publications
 */
async function publishPublications() {
  console.log('📰 Publishing publications...\n');
  
  let app;
  try {
    // Initialize Strapi
    const appContext = await compileStrapi();
    app = await createStrapi(appContext).load();
    app.log.level = 'error';
    
    // Publish publications
    const publications = await app.documents('api::publication.publication').findMany();
    console.log(`Found ${publications.length} publications to publish`);
    
    for (const publication of publications) {
      try {
        await app.documents('api::publication.publication').update({
          documentId: publication.documentId,
          data: {
            ...publication,
            publishedAt: new Date().toISOString()
          }
        });
        console.log(`✅ Published: ${publication.title || 'Publication'}`);
      } catch (error) {
        console.log(`❌ Error publishing publication:`, error.message);
      }
    }
    
    console.log('\n🎉 Publications publishing completed!');
    
  } catch (error) {
    console.error('❌ Error publishing publications:', error);
  } finally {
    if (app) {
      await app.destroy();
    }
  }
}

// Run the publish
if (require.main === module) {
  publishPublications().catch(console.error);
}

module.exports = { publishPublications };
