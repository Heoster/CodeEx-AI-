/**
 * Test Chat Interface with Working Direct API
 */

require('dotenv').config({ path: '.env.local' });

const APP_URL = 'http://localhost:3000';

// Test models
const testModels = [
  'auto',
  'llama-3.1-8b-instant',
  'llama-3.1-8b-instruct-hf',
  'deepseek-v3.2',
  'rnj-1-instruct',
  'gpt-oss-20b',
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite'
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testChatWithModel(model, message) {
  try {
    log('yellow', `Testing chat with ${model}: "${message}"`);
    
    const startTime = Date.now();
    
    const response = await fetch(`${APP_URL}/api/chat-direct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        history: [],
        settings: {
          model: model,
          tone: 'helpful',
          technicalLevel: 'intermediate',
          enableSpeech: false,
          voice: 'Algenib'
        }
      })
    });

    const endTime = Date.now();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    log('green', `✅ ${model} -> ${data.modelUsed || 'unknown'} (${endTime - startTime}ms)`);
    log('blue', `   Response: ${data.content?.substring(0, 100)}...`);
    
    return {
      model,
      modelUsed: data.modelUsed,
      success: true,
      responseTime: endTime - startTime,
      response: data.content?.substring(0, 200),
      autoRouted: data.autoRouted
    };
    
  } catch (error) {
    log('red', `❌ ${model}: ${error.message}`);
    return {
      model,
      success: false,
      error: error.message
    };
  }
}

async function testAllChatModels() {
  log('cyan', '🚀 Testing Chat Interface with All Models (Direct API)...\n');
  
  const testMessage = "Hello! What is 15 + 27?";
  const results = [];
  
  for (const model of testModels) {
    const result = await testChatWithModel(model, testMessage);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Generate summary
  log('cyan', '\n📊 Chat Interface Test Results (Direct API):');
  console.table(results.map(r => ({
    Model: r.model,
    'Model Used': r.modelUsed || 'N/A',
    Status: r.success ? '✅ Success' : '❌ Failed',
    'Response Time': r.success ? `${r.responseTime}ms` : 'N/A',
    'Auto Routed': r.autoRouted ? 'Yes' : 'No',
    Error: r.error || 'None'
  })));
  
  const successCount = results.filter(r => r.success).length;
  log('cyan', `\n✅ Success Rate: ${successCount}/${results.length} (${Math.round(successCount/results.length*100)}%)`);
  
  return results;
}

testAllChatModels();