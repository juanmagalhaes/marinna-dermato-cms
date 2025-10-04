const { createStrapi } = require('@strapi/strapi');

async function testWebhook() {
  console.log('🧪 Testing webhook functionality...\n');
  
  try {
    const strapi = await createStrapi();
    await strapi.start();
    
    // Test webhook by updating a home page entry
    console.log('📝 Updating home page to trigger webhook...');
    
    const homePages = await strapi.entityService.findMany('api::home-page.home-page', {
      populate: '*'
    });
    
    if (homePages.length > 0) {
      const homePage = homePages[0];
      console.log(`Found home page with ID: ${homePage.id}`);
      
      // Update a simple field to trigger webhook
      const updatedHomePage = await strapi.entityService.update('api::home-page.home-page', homePage.id, {
        data: {
          ...homePage,
          updatedAt: new Date().toISOString()
        }
      });
      
      console.log('✅ Home page updated successfully');
      console.log('🔔 Webhook should have been triggered to Next.js');
      console.log('📱 Check Next.js console for revalidation logs');
      
    } else {
      console.log('❌ No home page found to update');
    }
    
    await strapi.destroy();
  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
  }
}

testWebhook();
