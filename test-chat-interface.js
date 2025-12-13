/**
 * Test Chat Interface with All Models
 * This script tests the chat interface by sending messages with different model selections
 */

const fs = require('fs');
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

/**
 * Test the processUserMessage flow directly (same as chat interface uses)
 */
async function testChatWithModel(model, message) {
  try {
    log('yellow', `Testing chat with ${model}: "${message}"`);
    
    const startTime = Date.now();
    
    // This is the same request format that the chat interface uses
    const requestBody = {
      message: message,
      history: [], // Empty history for simple test
      settings: {
        model: model,
        tone: 'helpful',
        technicalLevel: 'intermediate',
        enableSpeech: false,
        voice: 'Algenib'
      }
    };

    // We'll test the generateResponse function directly (same as chat interface)
    // Since we can't import server actions directly in Node.js, we'll simulate the API call
    const response = await fetch(`${APP_URL}/api/test-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
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
      response: data.content?.substring(0, 200)
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

/**
 * Test all models with a simple message
 */
async function testAllChatModels() {
  log('cyan', '🚀 Testing Chat Interface with All Models...\n');
  
  const testMessage = "Hello! What is 15 + 27?";
  const results = [];
  
  for (const model of testModels) {
    const result = await testChatWithModel(model, testMessage);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Generate summary
  log('cyan', '\n📊 Chat Interface Test Results:');
  console.table(results.map(r => ({
    Model: r.model,
    'Model Used': r.modelUsed || 'N/A',
    Status: r.success ? '✅ Success' : '❌ Failed',
    'Response Time': r.success ? `${r.responseTime}ms` : 'N/A',
    Error: r.error || 'None'
  })));
  
  const successCount = results.filter(r => r.success).length;
  log('cyan', `\n✅ Success Rate: ${successCount}/${results.length} (${Math.round(successCount/results.length*100)}%)`);
  
  // Save detailed results
  fs.writeFileSync('chat-interface-test-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    testMessage,
    results
  }, null, 2));
  
  log('blue', '📄 Detailed results saved to: chat-interface-test-results.json');
  
  return results;
}

// Create a test API endpoint for testing
async function createTestEndpoint() {
  const testEndpointCode = `
import { NextRequest, NextResponse } from 'next/server';
import { processUserMessage } from '@/ai/flows/process-user-message';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history, settings } = body;

    const result = await processUserMessage({
      message,
      history,
      settings
    });

    return NextResponse.json({
      content: result.answer,
      modelUsed: result.modelUsed,
      autoRouted: result.autoRouted,
      routingReasoning: result.routingReasoning
    });
  } catch (error) {
    console.error('Test chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
`;

  // Write the test endpoint
  fs.writeFileSync('src/app/api/test-chat/route.ts', testEndpointCode);
  log('green', '✅ Created test endpoint at /api/test-chat');
  
  // Wait a moment for the endpoint to be available
  await new Promise(resolve => setTimeout(resolve, 2000));
}

// Main execution
async function main() {
  try {
    await createTestEndpoint();
    await testAllChatModels();
  } catch (error) {
    log('red', `💥 Test failed: ${error.message}`);
    console.error(error);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { testAllChatModels, testChatWithModel };