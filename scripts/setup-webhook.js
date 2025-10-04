const { createStrapi } = require('@strapi/strapi');

async function setupWebhook() {
  console.log('🔗 Setting up webhook for local development...\n');
  
  try {
    const strapi = await createStrapi();
    await strapi.start();
    
    // Webhook configuration
    const webhookConfig = {
      name: 'Next.js Local Revalidation',
      url: 'http://192.168.0.7:3000/api/revalidate',
      events: [
        'entry.create',
        'entry.update', 
        'entry.delete',
        'entry.publish',
        'entry.unpublish'
      ],
      headers: {
        'Content-Type': 'application/json'
      },
      isEnabled: true
    };
    
    console.log('📋 Webhook configuration:');
    console.log(`   Name: ${webhookConfig.name}`);
    console.log(`   URL: ${webhookConfig.url}`);
    console.log(`   Events: ${webhookConfig.events.join(', ')}`);
    console.log(`   Headers: ${JSON.stringify(webhookConfig.headers)}`);
    console.log(`   Enabled: ${webhookConfig.isEnabled}`);
    
    // Check if webhook plugin is available
    const webhookPlugin = strapi.plugin('webhook');
    if (webhookPlugin) {
      console.log('\n✅ Webhook plugin is available');
      
      // Try to create webhook
      try {
        const webhook = await strapi.entityService.create('webhook::webhook', {
          data: webhookConfig
        });
        console.log(`✅ Webhook created successfully with ID: ${webhook.id}`);
      } catch (error) {
        console.log(`❌ Error creating webhook: ${error.message}`);
        console.log('💡 You may need to create the webhook manually in the Strapi admin');
      }
    } else {
      console.log('\n❌ Webhook plugin not found');
      console.log('💡 You may need to install the webhook plugin or create webhooks manually');
    }
    
    console.log('\n📝 Manual setup instructions:');
    console.log('1. Access Strapi admin: http://localhost:1337/admin');
    console.log('2. Go to Settings > Webhooks');
    console.log('3. Create new webhook with:');
    console.log(`   - Name: ${webhookConfig.name}`);
    console.log(`   - URL: ${webhookConfig.url}`);
    console.log(`   - Events: ${webhookConfig.events.join(', ')}`);
    console.log(`   - Headers: ${JSON.stringify(webhookConfig.headers)}`);
    console.log('4. Save and test the webhook');
    
    console.log('\n🧪 Testing webhook:');
    console.log('1. Make sure Next.js is running on http://192.168.0.7:3000');
    console.log('2. Test the webhook endpoint:');
    console.log('   curl -X POST http://192.168.0.7:3000/api/revalidate \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"model": "home-page", "entry": {"id": 1}}\'');
    
    await strapi.destroy();
  } catch (error) {
    console.error('❌ Error setting up webhook:', error.message);
  }
}

setupWebhook();
