/**
 * Debug Chat Interface Issue
 * Simple test to isolate the problem
 */

require('dotenv').config({ path: '.env.local' });

const APP_URL = 'http://localhost:3000';

async function testSimpleMessage() {
  console.log('🔍 Testing simple message with auto model...');
  
  try {
    const response = await fetch(`${APP_URL}/api/test-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "Hello",
        history: [],
        settings: {
          model: 'auto',
          tone: 'helpful',
          technicalLevel: 'intermediate',
          enableSpeech: false,
          voice: 'Algenib'
        }
      })
    });

    const data = await response.json();
    console.log('Response:', data);
    
    if (data.error) {
      console.error('❌ Error:', data.error);
    } else {
      console.log('✅ Success!');
      console.log('Content:', data.content);
      console.log('Model Used:', data.modelUsed);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

// Test the smart fallback system directly
async function testSmartFallback() {
  console.log('🔍 Testing smart fallback system...');
  
  try {
    const response = await fetch(`${APP_URL}/api/ai/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem: "What is 2 + 2?",
        tone: 'helpful',
        technicalLevel: 'beginner',
        preferredModel: 'auto'
      })
    });

    const data = await response.json();
    console.log('Solve API Response:', data);
    
    if (data.error) {
      console.error('❌ Solve API Error:', data.error);
    } else {
      console.log('✅ Solve API Success!');
      console.log('Solution:', data.solution?.substring(0, 100));
      console.log('Model Used:', data.modelUsed);
    }
    
  } catch (error) {
    console.error('❌ Solve API Request failed:', error.message);
  }
}

async function main() {
  console.log('🚀 Debugging Chat Interface Issue...\n');
  
  await testSimpleMessage();
  console.log('\n' + '='.repeat(50) + '\n');
  await testSmartFallback();
}

main();