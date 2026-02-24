/**
 * Test script for /api/chat-direct endpoint
 * Tests OPTIONS, GET, and POST methods
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://codeex-ai.netlify.app';

async function testEndpoint() {
  console.log('🧪 Testing /api/chat-direct endpoint\n');
  console.log(`Base URL: ${APP_URL}\n`);

  // Test 1: OPTIONS (CORS preflight)
  console.log('1️⃣  Testing OPTIONS (CORS preflight)...');
  try {
    const response = await fetch(`${APP_URL}/api/chat-direct`, {
      method: 'OPTIONS',
    });
    console.log(`   Status: ${response.status}`);
    console.log(`   CORS Headers:`);
    console.log(`   - Allow-Origin: ${response.headers.get('Access-Control-Allow-Origin')}`);
    console.log(`   - Allow-Methods: ${response.headers.get('Access-Control-Allow-Methods')}`);
    console.log(`   - Allow-Headers: ${response.headers.get('Access-Control-Allow-Headers')}`);
    console.log(`   ✅ OPTIONS works\n`);
  } catch (error) {
    console.log(`   ❌ OPTIONS failed: ${error.message}\n`);
  }

  // Test 2: GET (should return 405 with helpful message)
  console.log('2️⃣  Testing GET (should return 405)...');
  try {
    const response = await fetch(`${APP_URL}/api/chat-direct`, {
      method: 'GET',
    });
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Error: ${data.error}`);
    console.log(`   Message: ${data.message}`);
    console.log(`   CORS Headers:`);
    console.log(`   - Allow-Origin: ${response.headers.get('Access-Control-Allow-Origin')}`);
    if (response.status === 405) {
      console.log(`   ✅ GET returns proper 405 error\n`);
    } else {
      console.log(`   ⚠️  Expected 405, got ${response.status}\n`);
    }
  } catch (error) {
    console.log(`   ❌ GET failed: ${error.message}\n`);
  }

  // Test 3: POST with valid data
  console.log('3️⃣  Testing POST with valid data...');
  try {
    const startTime = Date.now();
    const response = await fetch(`${APP_URL}/api/chat-direct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello! Can you tell me what 2+2 equals?',
        history: [],
        settings: {
          tone: 'friendly',
          technicalLevel: 'intermediate',
          model: 'auto',
        },
      }),
    });
    const data = await response.json();
    const responseTime = Date.now() - startTime;

    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${data.success}`);
    console.log(`   Model Used: ${data.modelUsed}`);
    console.log(`   Response Time: ${responseTime}ms`);
    console.log(`   Content Preview: ${data.content?.substring(0, 100)}...`);
    console.log(`   CORS Headers:`);
    console.log(`   - Allow-Origin: ${response.headers.get('Access-Control-Allow-Origin')}`);
    
    if (response.ok && data.success) {
      console.log(`   ✅ POST works correctly\n`);
    } else {
      console.log(`   ❌ POST failed: ${data.message || 'Unknown error'}\n`);
    }
  } catch (error) {
    console.log(`   ❌ POST failed: ${error.message}\n`);
  }

  // Test 4: POST with invalid data (missing message)
  console.log('4️⃣  Testing POST with invalid data...');
  try {
    const response = await fetch(`${APP_URL}/api/chat-direct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: [],
        settings: {},
      }),
    });
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Error: ${data.error}`);
    console.log(`   Message: ${data.message}`);
    
    if (response.status === 400 && data.error === 'MISSING_MESSAGE') {
      console.log(`   ✅ Validation works correctly\n`);
    } else {
      console.log(`   ⚠️  Expected 400 MISSING_MESSAGE error\n`);
    }
  } catch (error) {
    console.log(`   ❌ Validation test failed: ${error.message}\n`);
  }

  console.log('✅ All tests completed!');
}

// Run tests
testEndpoint().catch(console.error);
