const { createStrapi } = require('@strapi/strapi');
const { Database } = require('@strapi/database');

async function createWebhook() {
  console.log('🔗 Creating webhook via code...\n');
  
  try {
    const strapi = await createStrapi();
    await strapi.start();
    
    // Webhook configuration
    const webhookData = {
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
    console.log(`   Name: ${webhookData.name}`);
    console.log(`   URL: ${webhookData.url}`);
    console.log(`   Events: ${webhookData.events.join(', ')}`);
    console.log(`   Headers: ${JSON.stringify(webhookData.headers)}`);
    console.log(`   Enabled: ${webhookData.isEnabled}`);
    
    // Try to create webhook using entity service
    try {
      const webhook = await strapi.entityService.create('webhook::webhook', {
        data: webhookData
      });
      console.log(`\n✅ Webhook created successfully!`);
      console.log(`   ID: ${webhook.id}`);
      console.log(`   Name: ${webhook.name}`);
      console.log(`   URL: ${webhook.url}`);
      console.log(`   Events: ${webhook.events.join(', ')}`);
      console.log(`   Enabled: ${webhook.isEnabled}`);
      
    } catch (error) {
      console.log(`\n❌ Error creating webhook via entity service: ${error.message}`);
      
      // Try alternative method - direct database insertion
      console.log('\n🔄 Trying alternative method...');
      
      try {
        const db = strapi.db;
        
        // Check if webhooks table exists
        const tables = await db.connection.raw("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%webhook%'");
        console.log('📊 Webhook tables found:', tables);
        
        // Try to insert directly into database
        const result = await db.connection('webhooks').insert({
          name: webhookData.name,
          url: webhookData.url,
          events: JSON.stringify(webhookData.events),
          headers: JSON.stringify(webhookData.headers),
          isEnabled: webhookData.isEnabled,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
        console.log('✅ Webhook created via direct database insertion!');
        console.log('   Result:', result);
        
      } catch (dbError) {
        console.log(`❌ Database insertion failed: ${dbError.message}`);
        console.log('\n💡 Manual creation required - see instructions below');
      }
    }
    
    // List existing webhooks
    console.log('\n📋 Checking existing webhooks...');
    try {
      const existingWebhooks = await strapi.entityService.findMany('webhook::webhook');
      console.log(`Found ${existingWebhooks.length} existing webhooks:`);
      existingWebhooks.forEach((webhook, index) => {
        console.log(`   ${index + 1}. ${webhook.name} - ${webhook.url} (${webhook.isEnabled ? 'enabled' : 'disabled'})`);
      });
    } catch (error) {
      console.log('❌ Could not list existing webhooks:', error.message);
    }
    
    console.log('\n📝 Manual creation instructions:');
    console.log('1. Access Strapi admin: http://localhost:1337/admin');
    console.log('2. Go to Settings > Webhooks');
    console.log('3. Click "Add new webhook"');
    console.log('4. Fill in the form:');
    console.log(`   - Name: ${webhookData.name}`);
    console.log(`   - URL: ${webhookData.url}`);
    console.log(`   - Events: ${webhookData.events.join(', ')}`);
    console.log(`   - Headers: ${JSON.stringify(webhookData.headers)}`);
    console.log('5. Save and test');
    
    await strapi.destroy();
  } catch (error) {
    console.error('❌ Error creating webhook:', error.message);
  }
}

createWebhook();
