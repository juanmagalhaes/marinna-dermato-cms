// Create webhook using Strapi REST API
async function createWebhookViaAPI() {
  console.log('🔗 Creating webhook via REST API...\n');
  
  const strapiUrl = 'http://localhost:1337';
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
  
  try {
    // First, check if webhooks endpoint exists
    console.log('1. Checking webhooks endpoint...');
    const checkResponse = await fetch(`${strapiUrl}/api/webhooks`);
    
    if (checkResponse.ok) {
      console.log('✅ Webhooks endpoint found');
      const existingWebhooks = await checkResponse.json();
      console.log(`📊 Found ${existingWebhooks.data?.length || 0} existing webhooks`);
      
      // Check if our webhook already exists
      const existingWebhook = existingWebhooks.data?.find(w => w.attributes?.url === webhookData.url);
      if (existingWebhook) {
        console.log('⚠️  Webhook already exists with this URL');
        console.log(`   ID: ${existingWebhook.id}`);
        console.log(`   Name: ${existingWebhook.attributes?.name}`);
        console.log(`   URL: ${existingWebhook.attributes?.url}`);
        console.log(`   Enabled: ${existingWebhook.attributes?.isEnabled}`);
        return;
      }
      
      // Create new webhook
      console.log('\n2. Creating new webhook...');
      const createResponse = await fetch(`${strapiUrl}/api/webhooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: webhookData
        })
      });
      
      if (createResponse.ok) {
        const newWebhook = await createResponse.json();
        console.log('✅ Webhook created successfully!');
        console.log(`   ID: ${newWebhook.data.id}`);
        console.log(`   Name: ${newWebhook.data.attributes.name}`);
        console.log(`   URL: ${newWebhook.data.attributes.url}`);
        console.log(`   Events: ${newWebhook.data.attributes.events.join(', ')}`);
        console.log(`   Enabled: ${newWebhook.data.attributes.isEnabled}`);
      } else {
        console.log(`❌ Failed to create webhook: ${createResponse.status} ${createResponse.statusText}`);
        const error = await createResponse.text();
        console.log('Error details:', error);
      }
      
    } else {
      console.log(`❌ Webhooks endpoint not found: ${checkResponse.status} ${checkResponse.statusText}`);
      console.log('\n💡 Webhooks might not be available via REST API');
      console.log('   You may need to create it manually in the admin panel');
    }
    
  } catch (error) {
    console.error('❌ Error creating webhook:', error.message);
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
  
  console.log('\n🧪 Test webhook manually:');
  console.log('curl -X POST http://192.168.0.7:3000/api/revalidate \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"model": "home-page", "entry": {"id": 1}}\'');
}

createWebhookViaAPI();
