#!/usr/bin/env node
/**
 * API Routes Testing Script
 * Tests all API endpoints to ensure they're accessible
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

async function testRoute(name, path, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);
    const status = response.status;
    
    if (status === 404) {
      console.log(`${colors.red}✗ ${name}: 404 Not Found${colors.reset}`);
      return { name, status, success: false };
    } else if (status >= 200 && status < 300) {
      console.log(`${colors.green}✓ ${name}: ${status} OK${colors.reset}`);
      return { name, status, success: true };
    } else if (status === 400 || status === 401) {
      // Expected errors for routes that need auth/params
      console.log(`${colors.yellow}⚠ ${name}: ${status} (Expected - needs auth/params)${colors.reset}`);
      return { name, status, success: true };
    } else {
      console.log(`${colors.yellow}⚠ ${name}: ${status}${colors.reset}`);
      return { name, status, success: false };
    }
  } catch (error) {
    console.log(`${colors.red}✗ ${name}: ${error.message}${colors.reset}`);
    return { name, error: error.message, success: false };
  }
}

async function runTests() {
  console.log(`${colors.cyan}🧪 Testing API Routes...${colors.reset}\n`);
  console.log(`Base URL: ${BASE_URL}\n`);

  const results = [];

  // Health check
  results.push(await testRoute('Health Check', '/api/health', 'GET'));

  // Auth routes
  results.push(await testRoute('Password Reset', '/api/auth/password-reset', 'POST', { email: 'test@example.com' }));
  results.push(await testRoute('Verify Email', '/api/auth/verify-email', 'POST', {}));
  results.push(await testRoute('Change Email', '/api/auth/change-email', 'POST', {}));

  // Memory extraction
  results.push(await testRoute('Extract Memories', '/api/extract-memories', 'POST', {
    userMessage: 'test',
    assistantResponse: 'test',
    userId: 'test'
  }));

  // TTS/STT
  results.push(await testRoute('Text-to-Speech', '/api/tts', 'POST', { text: 'Hello' }));
  // Note: Transcribe needs FormData with audio file, skip in basic test
  console.log(`${colors.yellow}⊘ Transcribe: Skipped (requires audio file)${colors.reset}`);

  // Image/Video generation
  results.push(await testRoute('Generate Image', '/api/generate-image', 'POST', {}));
  results.push(await testRoute('Generate Video', '/api/generate-video', 'POST', {}));
  // Note: Upload Image needs FormData with file, skip in basic test
  console.log(`${colors.yellow}⊘ Upload Image: Skipped (requires image file)${colors.reset}`);

  // Chat
  results.push(await testRoute('Chat Direct', '/api/chat-direct', 'POST', {}));
  results.push(await testRoute('Chat Personality', '/api/chat-direct-personality', 'POST', {}));
  results.push(await testRoute('Test Chat', '/api/test-chat', 'POST', {}));

  // Profile
  results.push(await testRoute('Profile', '/api/profile', 'GET'));

  // Storage
  results.push(await testRoute('Storage Cleanup', '/api/storage/cleanup', 'POST', {}));

  // Debug
  results.push(await testRoute('Debug Errors', '/api/debug/errors', 'GET'));
  results.push(await testRoute('Debug Providers', '/api/debug/providers', 'GET'));

  // Summary
  console.log(`\n${colors.cyan}📊 Test Summary${colors.reset}`);
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const total = results.length;
  
  console.log(`Total: ${total}`);
  console.log(`${colors.green}Successful: ${successful}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  
  if (failed > 0) {
    console.log(`\n${colors.yellow}Failed routes:${colors.reset}`);
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.status || r.error}`);
    });
  }

  console.log(`\n${colors.cyan}💡 Note:${colors.reset} Routes returning 400/401 are working but need authentication or valid parameters.`);
  
  return failed === 0;
}

// Run tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error(`${colors.red}Test runner error:${colors.reset}`, error);
    process.exit(1);
  });
