#!/usr/bin/env node

/**
 * Test TTS API Route
 * Verifies that Groq Orpheus TTS works through the API route
 */

const fs = require('fs');
const path = require('path');

async function testTTSAPI() {
  console.log('🎤 Testing TTS API Route...\n');

  const testCases = [
    { text: 'Hello, this is a test of Groq Orpheus TTS.', voice: 'troy' },
    { text: 'Testing Diana voice.', voice: 'diana' },
    { text: 'Quick test with Hannah.', voice: 'hannah' },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      console.log(`Testing: "${testCase.text}" with voice "${testCase.voice}"`);
      
      const response = await fetch('http://localhost:3000/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.audio) {
        console.log(`✅ Success! Provider: ${data.provider}, Model: ${data.model}`);
        console.log(`   Audio size: ${data.audio.length} bytes (base64)`);
        
        // Optionally save audio file
        if (process.argv.includes('--save')) {
          const audioBuffer = Buffer.from(data.audio, 'base64');
          const filename = `test-${testCase.voice}-${Date.now()}.wav`;
          fs.writeFileSync(filename, audioBuffer);
          console.log(`   Saved to: ${filename}`);
        }
        
        passed++;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      failed++;
    }
    console.log('');
  }

  console.log('\n📊 Test Results:');
  console.log(`   Passed: ${passed}/${testCases.length}`);
  console.log(`   Failed: ${failed}/${testCases.length}`);

  if (failed === 0) {
    console.log('\n✨ All tests passed! Groq TTS is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check your GROQ_API_KEY in .env.local');
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    return response.ok;
  } catch {
    return false;
  }
}

// Main
(async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running on http://localhost:3000');
    console.log('   Please start the server first: npm run dev');
    process.exit(1);
  }

  await testTTSAPI();
})();
